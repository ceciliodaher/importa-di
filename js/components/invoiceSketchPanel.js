/**
 * Invoice Sketch Panel Component
 * UI component for generating invoice sketches
 */

import { InvoiceSketchGenerator } from '../services/invoiceSketchGenerator.js';

export class InvoiceSketchPanel {
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
            <div class="sketch-panel-header">
                <h3><i class="icon-document"></i> Croqui da Nota Fiscal de Entrada</h3>
                <button class="close-btn" id="close-sketch-panel">
                    <i class="icon-close"></i>
                </button>
            </div>
            
            <div class="sketch-panel-content">
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
                    <h4>Preview do Croqui</h4>
                    <div class="preview-table-container">
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
                    <div class="action-group">
                        <h4>Opções de Exportação</h4>
                        <div class="export-buttons">
                            <button class="btn btn-primary" id="generate-excel-sketch">
                                <i class="icon-excel"></i>
                                Gerar Excel
                            </button>
                            <button class="btn btn-secondary" id="generate-pdf-sketch">
                                <i class="icon-pdf"></i>
                                Gerar PDF
                            </button>
                        </div>
                    </div>
                    
                    <div class="action-group">
                        <h4>Configurações</h4>
                        <div class="config-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-detailed-items" checked>
                                <span class="checkmark"></span>
                                Incluir detalhamento por item
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="include-tax-breakdown" checked>
                                <span class="checkmark"></span>
                                Incluir detalhamento de impostos
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
    }

    attachEventListeners() {
        // Close panel
        document.getElementById('close-sketch-panel').addEventListener('click', () => {
            this.hide();
        });

        // Generate Excel
        document.getElementById('generate-excel-sketch').addEventListener('click', async () => {
            try {
                await this.generateExcel();
            } catch (error) {
                this.showError('Erro ao gerar Excel: ' + error.message);
            }
        });

        // Generate PDF
        document.getElementById('generate-pdf-sketch').addEventListener('click', async () => {
            try {
                await this.generatePDF();
            } catch (error) {
                this.showError('Erro ao gerar PDF: ' + error.message);
            }
        });

        // Close panel when clicking outside
        document.getElementById('invoice-sketch-panel').addEventListener('click', (e) => {
            if (e.target.id === 'invoice-sketch-panel') {
                this.hide();
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
        // Set data in generator
        this.generator.setDIData(diData, processedData);
        
        // Update info display
        this.updateInfoDisplay(diData, processedData);
        
        // Update preview table
        this.updatePreviewTable();
    }

    updateInfoDisplay(diData, processedData) {
        // DI Information
        document.getElementById('sketch-di').textContent = diData.cabecalho.DI || '-';
        document.getElementById('sketch-data').textContent = diData.cabecalho.dataRegistro || '-';
        document.getElementById('sketch-cotacao').textContent = processedData.cotacao?.toFixed(5) || '-';
        
        // Count total items
        const totalItems = diData.adicoes.reduce((sum, adicao) => sum + adicao.itens.length, 0);
        document.getElementById('sketch-total-itens').textContent = totalItems;
        
        // Values summary
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
            
            if (sketchData.items.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="no-data">Nenhum item encontrado</td></tr>';
                return;
            }
            
            tbody.innerHTML = '';
            
            // Show first 10 items as preview
            const previewItems = sketchData.items.slice(0, 10);
            
            previewItems.forEach(item => {
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
            
            // Add "more items" indicator if needed
            if (sketchData.items.length > 10) {
                const moreRow = document.createElement('tr');
                moreRow.innerHTML = `
                    <td colspan="9" class="more-items">
                        ... e mais ${sketchData.items.length - 10} itens
                    </td>
                `;
                tbody.appendChild(moreRow);
            }
            
        } catch (error) {
            console.error('Error updating preview table:', error);
            const tbody = document.querySelector('#sketch-preview-table tbody');
            tbody.innerHTML = '<tr><td colspan="9" class="error">Erro ao gerar preview</td></tr>';
        }
    }

    async generateExcel() {
        const includeDetails = document.getElementById('include-detailed-items').checked;
        const includeTaxes = document.getElementById('include-tax-breakdown').checked;
        
        // Show loading
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
        const includeDetails = document.getElementById('include-detailed-items').checked;
        const includeTaxes = document.getElementById('include-tax-breakdown').checked;
        
        // Show loading
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
        // Create loading overlay
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
        
        // Auto remove after 5 seconds
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
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
}