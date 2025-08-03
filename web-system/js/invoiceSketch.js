/**
 * Invoice Sketch Generator - No Module Version
 * Generates Excel and PDF invoice sketches (Croqui da Nota Fiscal de Entrada)
 * Compatible with file:// protocol
 */

// Global namespace to avoid conflicts
window.InvoiceSketch = (function() {
    'use strict';
    
    // Invoice Sketch Generator Class
    class InvoiceSketchGenerator {
        constructor() {
            this.diData = null;
            this.processedData = null;
        }

        setDIData(diData, processedData) {
            this.diData = diData;
            this.processedData = processedData;
        }

        generateSketchData() {
            if (!this.diData || !this.processedData) {
                throw new Error('DI data not set');
            }

            const sketchData = {
                header: this.generateHeader(),
                items: this.generateItems(),
                calculations: this.generateCalculations()
            };

            return sketchData;
        }

        generateHeader() {
            const header = this.diData.cabecalho;
            return {
                di: header.DI,
                dataRegistro: header.dataRegistro,
                cotacaoUSD: this.processedData.cotacao || 0
            };
        }

        generateItems() {
            const items = [];
            
            if (!this.diData.adicoes || !Array.isArray(this.diData.adicoes)) {
                return items;
            }
            
            this.diData.adicoes.forEach((adicao, adicaoIndex) => {
                if (!adicao.itens || !Array.isArray(adicao.itens)) {
                    return;
                }
                
                adicao.itens.forEach((item, itemIndex) => {
                    const costs = this.processedData.custosPorItem?.[`${adicaoIndex}-${itemIndex}`] || {};
                    
                    items.push({
                        adicao: adicao.numero || (adicaoIndex + 1),
                        item: item.Código || `IC${String(itemIndex + 1).padStart(4, '0')}`,
                        produto: item.Descrição || adicao.dadosGerais?.descricao || 'Produto sem descrição',
                        ncm: adicao.dadosGerais?.NCM || '00000000',
                        peso: parseFloat(item.Peso || 0),
                        mva: 0,
                        bcST: 0,
                        st: 0,
                        fp: 0,
                        quantCx: parseFloat(item['Unid/Caixa'] || 1),
                        quantPorCx: parseFloat(item.Qtd || 1),
                        totalUn: parseFloat(item.Qtd || 1),
                        valorMercadoria: {
                            vUnit: parseFloat(item['Valor Unit. USD'] || 0),
                            vTotal: parseFloat(item['Valor Total USD'] || 0)
                        },
                        bcICMS: costs.bcICMS || 0,
                        vICMS: costs.valorICMS || 0,
                        bcIPI: costs.bcIPI || 0,
                        vIPI: costs.valorIPI || 0,
                        aliqICMS: adicao.tributos?.['ICMS Alíq. (%)'] || 0,
                        aliqIPI: adicao.tributos?.['IPI Alíq. (%)'] || 0
                    });
                });
            });

            return items;
        }

        generateCalculations() {
            const totals = this.processedData.totais || {};
            
            return {
                baseCalculoICMS: totals.baseICMS || 0,
                valorICMS: totals.valorICMS || 0,
                bcST: 0,
                icmsST: 0,
                valorTotalProdutos: totals.valorMercadorias || 0,
                totalFrete: totals.frete || 0,
                valorSeguro: totals.seguro || 0,
                totalDesconto: 0,
                valorII: totals.valorII || 0,
                valorIPI: totals.valorIPI || 0,
                pis: totals.valorPIS || 0,
                cofins: totals.valorCOFINS || 0,
                valorTotalNota: totals.valorTotal || 0,
                outrasDesepesasAcessorias: totals.despesasAcessorias || 0
            };
        }

        async generateExcel() {
            const sketchData = this.generateSketchData();
            
            const wb = XLSX.utils.book_new();
            const ws = this.createMainSheet(sketchData);
            XLSX.utils.book_append_sheet(wb, ws, "Croqui NF Entrada");
            
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            
            return blob;
        }

        createMainSheet(sketchData) {
            const data = [];
            
            // Header row
            data.push([
                `DI: ${sketchData.header.di}`,
                '',
                '',
                `DATA DO REGISTRO: ${sketchData.header.dataRegistro}`,
                '',
                '',
                `Cotação US$ ${sketchData.header.cotacaoUSD}`,
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'CROQUI NOTA FISCAL DE ENTRADA'
            ]);
            
            data.push([]);
            
            // Table headers
            data.push([
                'Adição',
                'ITEM',
                'PRODUTO',
                'NCM',
                'PESO',
                'QUANT CX',
                'QUANT P/CX',
                'TOTAL UN',
                'V. UNIT',
                'V. TOTAL',
                'BC ICMS',
                'V.ICMS',
                'BC IPI',
                'V.IPI',
                'ALIQ ICMS',
                'ALIQ IPI',
                'MVA',
                'BC ST',
                'ST',
                'FP'
            ]);
            
            // Items data
            sketchData.items.forEach(item => {
                data.push([
                    item.adicao,
                    item.item,
                    item.produto,
                    item.ncm,
                    item.peso,
                    item.quantCx,
                    item.quantPorCx,
                    item.totalUn,
                    item.valorMercadoria.vUnit,
                    item.valorMercadoria.vTotal,
                    item.bcICMS,
                    item.vICMS,
                    item.bcIPI,
                    item.vIPI,
                    `${item.aliqICMS}%`,
                    `${item.aliqIPI}%`,
                    `${item.mva}%`,
                    item.bcST,
                    item.st,
                    item.fp
                ]);
            });
            
            // Total row
            const totals = sketchData.calculations;
            data.push([
                'TOTAL',
                '',
                '',
                '',
                sketchData.items.reduce((sum, item) => sum + item.peso, 0),
                sketchData.items.length,
                '',
                sketchData.items.reduce((sum, item) => sum + item.totalUn, 0),
                '',
                totals.valorTotalProdutos,
                totals.baseCalculoICMS,
                totals.valorICMS,
                '',
                totals.valorIPI,
                '',
                '',
                '',
                '',
                '',
                ''
            ]);
            
            data.push([]);
            data.push([]);
            
            // Calculations table
            data.push(['CÁLCULO DO IMPOSTO']);
            
            data.push([
                'Base de Cálculo do ICMS',
                'VALOR DO ICMS',
                'BC ST',
                'ICMS ST',
                'VALOR TOTAL DOS PRODUTOS',
                'Total do Frete',
                'Valor do Seguro',
                'Total do Desconto',
                'VALOR DO II',
                'Outras Despesas Acessórias'
            ]);
            
            data.push([
                totals.baseCalculoICMS,
                totals.valorICMS,
                totals.bcST,
                totals.icmsST,
                totals.valorTotalProdutos,
                totals.totalFrete,
                totals.valorSeguro,
                totals.totalDesconto,
                totals.valorII,
                totals.outrasDesepesasAcessorias
            ]);
            
            data.push([
                '',
                'PIS',
                '',
                'COFINS',
                '',
                '',
                '',
                '',
                'VALOR TOTAL DA NOTA',
                ''
            ]);
            
            data.push([
                '',
                totals.pis,
                '',
                totals.cofins,
                '',
                '',
                '',
                '',
                totals.valorTotalNota,
                ''
            ]);
            
            const ws = XLSX.utils.aoa_to_sheet(data);
            
            // Set column widths
            const colWidths = [
                { wch: 8 }, { wch: 10 }, { wch: 40 }, { wch: 10 }, { wch: 8 },
                { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
                { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
                { wch: 10 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 8 }
            ];
            ws['!cols'] = colWidths;
            
            return ws;
        }

        async generatePDF() {
            const sketchData = this.generateSketchData();
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('l', 'mm', 'a4');
            
            doc.setFont('helvetica');
            
            // Title
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('CROQUI NOTA FISCAL DE ENTRADA', 20, 20);
            
            // Header information
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`DI: ${sketchData.header.di}`, 20, 30);
            doc.text(`DATA DO REGISTRO: ${sketchData.header.dataRegistro}`, 100, 30);
            doc.text(`Cotação US$ ${sketchData.header.cotacaoUSD}`, 200, 30);
            
            // Items table
            const itemsHeaders = [
                'Adição', 'ITEM', 'PRODUTO', 'NCM', 'PESO', 'QTD CX', 'QTD P/CX', 
                'TOTAL UN', 'V. UNIT', 'V. TOTAL', 'BC ICMS', 'V.ICMS', 'ALIQ ICMS', 'ALIQ IPI'
            ];
            
            const itemsData = sketchData.items.map(item => [
                item.adicao,
                item.item,
                item.produto.substring(0, 25) + '...',
                item.ncm,
                item.peso.toFixed(2),
                item.quantCx,
                item.quantPorCx,
                item.totalUn,
                item.valorMercadoria.vUnit.toFixed(2),
                item.valorMercadoria.vTotal.toFixed(2),
                item.bcICMS.toFixed(2),
                item.vICMS.toFixed(2),
                `${item.aliqICMS}%`,
                `${item.aliqIPI}%`
            ]);
            
            if (doc.autoTable) {
                doc.autoTable({
                    head: [itemsHeaders],
                    body: itemsData,
                    startY: 40,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 139, 202] },
                    margin: { left: 10, right: 10 }
                });
                
                const finalY = doc.lastAutoTable.finalY + 20;
                
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text('CÁLCULO DO IMPOSTO', 20, finalY);
                
                const calcHeaders = [
                    'BC ICMS', 'VALOR ICMS', 'VALOR TOTAL PRODUTOS', 'FRETE', 'SEGURO', 'VALOR II', 'VALOR IPI', 'VALOR TOTAL NOTA'
                ];
                
                const calcData = [[
                    sketchData.calculations.baseCalculoICMS.toFixed(2),
                    sketchData.calculations.valorICMS.toFixed(2),
                    sketchData.calculations.valorTotalProdutos.toFixed(2),
                    sketchData.calculations.totalFrete.toFixed(2),
                    sketchData.calculations.valorSeguro.toFixed(2),
                    sketchData.calculations.valorII.toFixed(2),
                    sketchData.calculations.valorIPI.toFixed(2),
                    sketchData.calculations.valorTotalNota.toFixed(2)
                ]];
                
                doc.autoTable({
                    head: [calcHeaders],
                    body: calcData,
                    startY: finalY + 10,
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [66, 139, 202] },
                    margin: { left: 10, right: 10 }
                });
            }
            
            return doc;
        }

        async downloadExcel(filename = 'croqui-nf-entrada.xlsx') {
            const blob = await this.generateExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        async downloadPDF(filename = 'croqui-nf-entrada.pdf') {
            const doc = await this.generatePDF();
            doc.save(filename);
        }
    }

    // Invoice Sketch Panel Class
    class InvoiceSketchPanel {
        constructor() {
            this.generator = new InvoiceSketchGenerator();
            this.isVisible = false;
            this.init();
        }

        init() {
            this.createPanel();
            this.attachEventListeners();
        }

        createPanel() {
            const panel = document.createElement('div');
            panel.id = 'invoice-sketch-panel';
            panel.className = 'sketch-panel hidden';
            panel.innerHTML = `
                <div class="sketch-panel-content">
                    <div class="sketch-panel-header">
                        <h3><i class="icon-document"></i> Croqui da Nota Fiscal de Entrada</h3>
                        <button class="close-btn" id="close-sketch-panel">
                            <i class="icon-close"></i>
                        </button>
                    </div>
                    
                    <div class="sketch-info">
                        <div class="info-card">
                            <h4>Informações da DI</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>DI:</label>
                                    <span id="sketch-di">-</span>
                                </div>
                                <div class="info-item">
                                    <label>Data Registro:</label>
                                    <span id="sketch-data">-</span>
                                </div>
                                <div class="info-item">
                                    <label>Cotação USD:</label>
                                    <span id="sketch-cotacao">-</span>
                                </div>
                                <div class="info-item">
                                    <label>Total Itens:</label>
                                    <span id="sketch-total-itens">-</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-card">
                            <h4>Resumo dos Valores</h4>
                            <div class="info-grid">
                                <div class="info-item">
                                    <label>Valor Mercadorias:</label>
                                    <span id="sketch-valor-mercadorias">R$ -</span>
                                </div>
                                <div class="info-item">
                                    <label>ICMS:</label>
                                    <span id="sketch-icms">R$ -</span>
                                </div>
                                <div class="info-item">
                                    <label>IPI:</label>
                                    <span id="sketch-ipi">R$ -</span>
                                </div>
                                <div class="info-item">
                                    <label>Valor Total:</label>
                                    <span id="sketch-valor-total">R$ -</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="sketch-preview">
                        <div class="preview-header">
                            <h4>Preview do Croqui</h4>
                            <button class="btn btn-outline btn-small" id="expand-preview-btn">
                                📋 Ver Todos os Itens
                            </button>
                        </div>
                        <div class="preview-table-container" id="preview-table-container">
                            <table class="preview-table" id="sketch-preview-table">
                                <thead>
                                    <tr>
                                        <th>Adição</th>
                                        <th>Item</th>
                                        <th>Produto</th>
                                        <th>NCM</th>
                                        <th>Qtd</th>
                                        <th>V. Unit</th>
                                        <th>V. Total</th>
                                        <th>ICMS</th>
                                        <th>IPI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colspan="9" class="no-data">Nenhum dado processado</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="sketch-actions">
                        <div class="action-group full-width">
                            <h4>Exportar Croqui da Nota Fiscal</h4>
                            <div class="export-buttons">
                                <button class="btn btn-primary btn-large" id="generate-excel-sketch">
                                    📊 Gerar Excel Completo
                                </button>
                                <button class="btn btn-secondary btn-large" id="generate-pdf-sketch">
                                    📋 Gerar PDF Formatado
                                </button>
                            </div>
                            <p class="export-info">
                                O croqui será gerado com todas as adições e itens, incluindo valores de ICMS, IPI e demais tributos calculados.
                            </p>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
        }

        attachEventListeners() {
            const self = this;
            
            document.getElementById('close-sketch-panel').addEventListener('click', () => {
                self.hide();
            });

            document.getElementById('generate-excel-sketch').addEventListener('click', async () => {
                try {
                    await self.generateExcel();
                } catch (error) {
                    self.showError('Erro ao gerar Excel: ' + error.message);
                }
            });

            document.getElementById('generate-pdf-sketch').addEventListener('click', async () => {
                try {
                    await self.generatePDF();
                } catch (error) {
                    self.showError('Erro ao gerar PDF: ' + error.message);
                }
            });

            document.getElementById('invoice-sketch-panel').addEventListener('click', (e) => {
                if (e.target.id === 'invoice-sketch-panel') {
                    self.hide();
                }
            });

            // Expand preview button
            document.getElementById('expand-preview-btn').addEventListener('click', () => {
                const container = document.getElementById('preview-table-container');
                const btn = document.getElementById('expand-preview-btn');
                
                if (container.style.maxHeight === 'none') {
                    container.style.maxHeight = '500px';
                    btn.textContent = '📋 Ver Todos os Itens';
                } else {
                    container.style.maxHeight = 'none';
                    btn.textContent = '📋 Recolher Lista';
                }
            });
        }

        show() {
            this.isVisible = true;
            const panel = document.getElementById('invoice-sketch-panel');
            panel.classList.remove('hidden');
            panel.classList.add('visible');
            document.body.classList.add('modal-open');
        }

        hide() {
            this.isVisible = false;
            const panel = document.getElementById('invoice-sketch-panel');
            panel.classList.remove('visible');
            panel.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }

        updateData(diData, processedData) {
            this.generator.setDIData(diData, processedData);
            this.updateInfoDisplay(diData, processedData);
            this.updatePreviewTable();
        }

        updateInfoDisplay(diData, processedData) {
            document.getElementById('sketch-di').textContent = diData.cabecalho.DI || '-';
            document.getElementById('sketch-data').textContent = diData.cabecalho.dataRegistro || '-';
            document.getElementById('sketch-cotacao').textContent = processedData.cotacao?.toFixed(5) || '-';
            
            const totalItems = diData.adicoes.reduce((sum, adicao) => sum + adicao.itens.length, 0);
            document.getElementById('sketch-total-itens').textContent = totalItems;
            
            const totals = processedData.totais || {};
            document.getElementById('sketch-valor-mercadorias').textContent = 
                this.formatCurrency(totals.valorMercadorias || 0);
            document.getElementById('sketch-icms').textContent = 
                this.formatCurrency(totals.valorICMS || 0);
            document.getElementById('sketch-ipi').textContent = 
                this.formatCurrency(totals.valorIPI || 0);
            document.getElementById('sketch-valor-total').textContent = 
                this.formatCurrency(totals.valorTotal || 0);
        }

        updatePreviewTable() {
            try {
                const sketchData = this.generator.generateSketchData();
                const tbody = document.querySelector('#sketch-preview-table tbody');
                
                if (!sketchData.items || sketchData.items.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="9" class="no-data">Nenhum item encontrado</td></tr>';
                    return;
                }
                
                tbody.innerHTML = '';
                
                const previewItems = sketchData.items.slice(0, 50); // Mostrar mais itens
                
                previewItems.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.adicao}</td>
                        <td>${item.item}</td>
                        <td class="produto-cell" title="${item.produto}">${this.truncateText(item.produto, 30)}</td>
                        <td>${item.ncm}</td>
                        <td>${item.totalUn}</td>
                        <td>${this.formatCurrency(item.valorMercadoria.vUnit)}</td>
                        <td>${this.formatCurrency(item.valorMercadoria.vTotal)}</td>
                        <td>${this.formatCurrency(item.vICMS)}</td>
                        <td>${this.formatCurrency(item.vIPI)}</td>
                    `;
                    tbody.appendChild(row);
                });
                
                if (sketchData.items.length > 50) {
                    const moreRow = document.createElement('tr');
                    moreRow.innerHTML = `
                        <td colspan="9" class="more-items">
                            ... e mais ${sketchData.items.length - 50} itens (total: ${sketchData.items.length})
                        </td>
                    `;
                    tbody.appendChild(moreRow);
                } else if (sketchData.items.length > 0) {
                    const totalRow = document.createElement('tr');
                    totalRow.innerHTML = `
                        <td colspan="9" class="more-items">
                            Total de ${sketchData.items.length} itens exibidos
                        </td>
                    `;
                    tbody.appendChild(totalRow);
                }
                
            } catch (error) {
                console.error('Error updating preview table:', error);
                const tbody = document.querySelector('#sketch-preview-table tbody');
                tbody.innerHTML = '<tr><td colspan="9" class="error">Erro ao gerar preview</td></tr>';
            }
        }

        async generateExcel() {
            this.showLoading('Gerando Excel...');
            
            try {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                const filename = `croqui-nf-entrada-${timestamp}.xlsx`;
                
                await this.generator.downloadExcel(filename);
                this.showSuccess('Excel gerado com sucesso!');
                
            } catch (error) {
                throw error;
            } finally {
                this.hideLoading();
            }
        }

        async generatePDF() {
            this.showLoading('Gerando PDF...');
            
            try {
                const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                const filename = `croqui-nf-entrada-${timestamp}.pdf`;
                
                await this.generator.downloadPDF(filename);
                this.showSuccess('PDF gerado com sucesso!');
                
            } catch (error) {
                throw error;
            } finally {
                this.hideLoading();
            }
        }

        showLoading(message) {
            const overlay = document.createElement('div');
            overlay.id = 'sketch-loading';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-content">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;
            document.getElementById('invoice-sketch-panel').appendChild(overlay);
        }

        hideLoading() {
            const loading = document.getElementById('sketch-loading');
            if (loading) {
                loading.remove();
            }
        }

        showSuccess(message) {
            this.showNotification(message, 'success');
        }

        showError(message) {
            this.showNotification(message, 'error');
        }

        showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()">×</button>
            `;
            
            document.getElementById('invoice-sketch-panel').appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 5000);
        }

        formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value || 0);
        }

        truncateText(text, maxLength) {
            if (!text || typeof text !== 'string') return '';
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        }
    }

    // Initialize and expose API
    let invoiceSketchPanel = null;
    let currentDIData = null;
    let currentProcessedData = null;

    function init() {
        invoiceSketchPanel = new InvoiceSketchPanel();
        
        const invoiceSketchBtn = document.getElementById('invoiceSketchBtn');
        
        if (invoiceSketchBtn) {
            invoiceSketchBtn.addEventListener('click', open);
        } else {
            // Retry after a delay
            setTimeout(() => {
                const retryBtn = document.getElementById('invoiceSketchBtn');
                if (retryBtn) {
                    retryBtn.addEventListener('click', open);
                }
            }, 1000);
        }
    }

    function updateData(diData, processedData) {
        currentDIData = diData;
        currentProcessedData = processedData;
        
        const invoiceSketchBtn = document.getElementById('invoiceSketchBtn');
        
        if (invoiceSketchBtn) {
            invoiceSketchBtn.disabled = false;
        }
        
        if (invoiceSketchPanel) {
            invoiceSketchPanel.updateData(diData, processedData);
        }
    }

    function open() {
        if (!currentDIData || !currentProcessedData) {
            alert('Erro: Dados da DI não disponíveis. Processe um arquivo XML primeiro.');
            return;
        }
        
        // Abrir em nova aba
        openInNewTab();
    }
    
    function openInNewTab() {
        const generator = new InvoiceSketchGenerator();
        generator.setDIData(currentDIData, currentProcessedData);
        const sketchData = generator.generateSketchData();
        
        const newWindow = window.open('', '_blank');
        newWindow.document.write(generateFullPageHTML(sketchData));
        newWindow.document.close();
    }
    
    function generateFullPageHTML(sketchData) {
        return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Croqui da Nota Fiscal de Entrada - DI: ${sketchData.header.di}</title>
            <style>
                :root {
                    --expertzy-red: #FF002D;
                    --expertzy-blue: #091A30;
                    --expertzy-white: #FFFFFF;
                }
                
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: #f8f9fa;
                    color: var(--expertzy-blue);
                    line-height: 1.6;
                }
                
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .header {
                    background: var(--expertzy-red);
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                
                .header h1 {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }
                
                .header-info {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                
                .info-card {
                    background: white;
                    color: var(--expertzy-blue);
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                }
                
                .info-card h3 {
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    opacity: 0.8;
                }
                
                .info-card .value {
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                
                .export-section {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .export-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 15px;
                }
                
                .btn {
                    padding: 15px 30px;
                    border: none;
                    border-radius: 6px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                }
                
                .btn-primary {
                    background: var(--expertzy-red);
                    color: white;
                }
                
                .btn-secondary {
                    background: var(--expertzy-blue);
                    color: white;
                }
                
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .items-section {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .section-header {
                    background: var(--expertzy-blue);
                    color: white;
                    padding: 15px 20px;
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                
                .items-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                
                .items-table th {
                    background: #f8f9fa;
                    padding: 12px 8px;
                    text-align: left;
                    font-weight: bold;
                    border-bottom: 2px solid var(--expertzy-red);
                    position: sticky;
                    top: 0;
                }
                
                .items-table td {
                    padding: 10px 8px;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .items-table tr:hover {
                    background: #f8f9fa;
                }
                
                .currency {
                    text-align: right;
                    font-weight: bold;
                }
                
                .calculations-section {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .calculations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .calc-item {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    text-align: center;
                }
                
                .calc-item h4 {
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                    opacity: 0.8;
                }
                
                .calc-item .value {
                    font-size: 1.3rem;
                    font-weight: bold;
                    color: var(--expertzy-red);
                }
                
                @media print {
                    .export-section { display: none; }
                    body { background: white; }
                    .container { max-width: none; margin: 0; padding: 10px; }
                }
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"></script>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>CROQUI DA NOTA FISCAL DE ENTRADA</h1>
                    <div class="header-info">
                        <div class="info-card">
                            <h3>DI</h3>
                            <div class="value">${sketchData.header.di}</div>
                        </div>
                        <div class="info-card">
                            <h3>Data de Registro</h3>
                            <div class="value">${sketchData.header.dataRegistro}</div>
                        </div>
                        <div class="info-card">
                            <h3>Cotação USD</h3>
                            <div class="value">R$ ${sketchData.header.cotacaoUSD.toFixed(5)}</div>
                        </div>
                        <div class="info-card">
                            <h3>Total de Itens</h3>
                            <div class="value">${sketchData.items.length}</div>
                        </div>
                    </div>
                </div>
                
                <div class="export-section">
                    <h2>Exportar Croqui</h2>
                    <p>Gere o croqui da nota fiscal nos formatos desejados:</p>
                    <div class="export-buttons">
                        <button class="btn btn-primary" onclick="exportToExcel()">
                            📊 Exportar Excel
                        </button>
                        <button class="btn btn-secondary" onclick="exportToPDF()">
                            📋 Exportar PDF
                        </button>
                    </div>
                </div>
                
                <div class="items-section">
                    <div class="section-header">
                        Detalhamento dos Itens
                    </div>
                    <div style="overflow-x: auto;">
                        <table class="items-table">
                            <thead>
                                <tr>
                                    <th>Adição</th>
                                    <th>Item</th>
                                    <th>Produto</th>
                                    <th>NCM</th>
                                    <th>Peso</th>
                                    <th>Qtd CX</th>
                                    <th>Qtd P/CX</th>
                                    <th>Total UN</th>
                                    <th>V. Unit USD</th>
                                    <th>V. Total USD</th>
                                    <th>BC ICMS</th>
                                    <th>V. ICMS</th>
                                    <th>BC IPI</th>
                                    <th>V. IPI</th>
                                    <th>Aliq ICMS</th>
                                    <th>Aliq IPI</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sketchData.items.map(item => `
                                    <tr>
                                        <td>${item.adicao}</td>
                                        <td>${item.item}</td>
                                        <td title="${item.produto}">${item.produto}</td>
                                        <td>${item.ncm}</td>
                                        <td>${item.peso.toFixed(2)}</td>
                                        <td>${item.quantCx}</td>
                                        <td>${item.quantPorCx}</td>
                                        <td>${item.totalUn}</td>
                                        <td class="currency">$ ${item.valorMercadoria.vUnit.toFixed(2)}</td>
                                        <td class="currency">$ ${item.valorMercadoria.vTotal.toFixed(2)}</td>
                                        <td class="currency">R$ ${item.bcICMS.toFixed(2)}</td>
                                        <td class="currency">R$ ${item.vICMS.toFixed(2)}</td>
                                        <td class="currency">R$ ${item.bcIPI.toFixed(2)}</td>
                                        <td class="currency">R$ ${item.vIPI.toFixed(2)}</td>
                                        <td>${item.aliqICMS.toFixed(2)}%</td>
                                        <td>${item.aliqIPI.toFixed(2)}%</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="calculations-section">
                    <div class="section-header">
                        Cálculo dos Impostos
                    </div>
                    <div class="calculations-grid">
                        <div class="calc-item">
                            <h4>Base ICMS</h4>
                            <div class="value">R$ ${sketchData.calculations.baseCalculoICMS.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Valor ICMS</h4>
                            <div class="value">R$ ${sketchData.calculations.valorICMS.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Valor II</h4>
                            <div class="value">R$ ${sketchData.calculations.valorII.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Valor IPI</h4>
                            <div class="value">R$ ${sketchData.calculations.valorIPI.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>PIS</h4>
                            <div class="value">R$ ${sketchData.calculations.pis.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>COFINS</h4>
                            <div class="value">R$ ${sketchData.calculations.cofins.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Frete</h4>
                            <div class="value">R$ ${sketchData.calculations.totalFrete.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Seguro</h4>
                            <div class="value">R$ ${sketchData.calculations.valorSeguro.toFixed(2)}</div>
                        </div>
                        <div class="calc-item">
                            <h4>Valor Total Produtos</h4>
                            <div class="value">R$ ${sketchData.calculations.valorTotalProdutos.toFixed(2)}</div>
                        </div>
                        <div class="calc-item" style="grid-column: 1 / -1; background: var(--expertzy-red); color: white;">
                            <h4 style="color: white; opacity: 1;">VALOR TOTAL DA NOTA</h4>
                            <div class="value" style="color: white; font-size: 2rem;">R$ ${sketchData.calculations.valorTotalNota.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <script>
                // Dados do croqui disponíveis globalmente
                window.sketchData = ${JSON.stringify(sketchData)};
                
                function exportToExcel() {
                    // Implementação da exportação Excel
                    generateExcelFile();
                }
                
                function exportToPDF() {
                    // Implementação da exportação PDF
                    generatePDFFile();
                }
                
                function generateExcelFile() {
                    const wb = XLSX.utils.book_new();
                    
                    // Criar dados da planilha
                    const data = [];
                    
                    // Cabeçalho
                    data.push(['CROQUI NOTA FISCAL DE ENTRADA']);
                    data.push(['DI: ' + window.sketchData.header.di, '', 'Data: ' + window.sketchData.header.dataRegistro, '', 'Cotação USD: R$ ' + window.sketchData.header.cotacaoUSD.toFixed(5)]);
                    data.push([]);
                    
                    // Cabeçalhos da tabela
                    data.push(['Adição', 'Item', 'Produto', 'NCM', 'Peso', 'Qtd CX', 'Qtd P/CX', 'Total UN', 'V.Unit USD', 'V.Total USD', 'BC ICMS', 'V.ICMS', 'BC IPI', 'V.IPI', 'Aliq ICMS', 'Aliq IPI']);
                    
                    // Dados dos itens
                    window.sketchData.items.forEach(item => {
                        data.push([
                            item.adicao, item.item, item.produto, item.ncm, item.peso,
                            item.quantCx, item.quantPorCx, item.totalUn,
                            item.valorMercadoria.vUnit, item.valorMercadoria.vTotal,
                            item.bcICMS, item.vICMS, item.bcIPI, item.vIPI,
                            item.aliqICMS + '%', item.aliqIPI + '%'
                        ]);
                    });
                    
                    data.push([]);
                    data.push(['CÁLCULO DOS IMPOSTOS']);
                    data.push(['Base ICMS', 'Valor ICMS', 'Valor II', 'Valor IPI', 'PIS', 'COFINS', 'Frete', 'Seguro', 'Valor Total']);
                    data.push([
                        window.sketchData.calculations.baseCalculoICMS,
                        window.sketchData.calculations.valorICMS,
                        window.sketchData.calculations.valorII,
                        window.sketchData.calculations.valorIPI,
                        window.sketchData.calculations.pis,
                        window.sketchData.calculations.cofins,
                        window.sketchData.calculations.totalFrete,
                        window.sketchData.calculations.valorSeguro,
                        window.sketchData.calculations.valorTotalNota
                    ]);
                    
                    const ws = XLSX.utils.aoa_to_sheet(data);
                    XLSX.utils.book_append_sheet(wb, ws, 'Croqui NF');
                    
                    const filename = 'croqui-nf-entrada-' + window.sketchData.header.di.replace(/[^a-zA-Z0-9]/g, '') + '.xlsx';
                    XLSX.writeFile(wb, filename);
                }
                
                function generatePDFFile() {
                    window.print();
                }
            </script>
        </body>
        </html>
        `;
    }

    // Auto-initialize when DOM is ready
    function ensureInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            // Use a small delay to ensure all other scripts are loaded
            setTimeout(init, 100);
        }
    }
    
    ensureInit();

    // Public API
    return {
        init: init,
        updateData: updateData,
        open: open,
        InvoiceSketchGenerator: InvoiceSketchGenerator,
        InvoiceSketchPanel: InvoiceSketchPanel
    };

})();