/**
 * Invoice Sketch Generator
 * Generates Excel and PDF invoice sketches (Croqui da Nota Fiscal de Entrada)
 * Based on DI data processing
 */

export class InvoiceSketchGenerator {
    constructor() {
        this.diData = null;
        this.processedData = null;
    }

    /**
     * Set DI data for invoice sketch generation
     */
    setDIData(diData, processedData) {
        this.diData = diData;
        this.processedData = processedData;
    }

    /**
     * Generate invoice sketch data structure
     */
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

    /**
     * Generate header information
     */
    generateHeader() {
        const header = this.diData.cabecalho;
        return {
            di: header.DI,
            dataRegistro: header.dataRegistro,
            cotacaoUSD: this.processedData.cotacao || 0
        };
    }

    /**
     * Generate items table data
     */
    generateItems() {
        const items = [];
        
        this.diData.adicoes.forEach((adicao, adicaoIndex) => {
            adicao.itens.forEach((item, itemIndex) => {
                const costs = this.processedData.custosPorItem?.[`${adicaoIndex}-${itemIndex}`] || {};
                
                items.push({
                    adicao: adicao.numero,
                    item: item.codigo || `IC${String(itemIndex + 1).padStart(4, '0')}`,
                    produto: item.descricao,
                    ncm: adicao.dadosGerais.NCM,
                    peso: parseFloat(item.peso || 0),
                    mva: 0, // MVA - needs to be calculated or configured
                    bcST: 0, // Base calculation ST
                    st: 0, // ST value
                    fp: 0, // FP value
                    quantCx: parseFloat(item.unidCaixa || 1),
                    quantPorCx: parseFloat(item.qtd || 1),
                    totalUn: parseFloat(item.qtd || 1),
                    valorMercadoria: {
                        vUnit: parseFloat(item.valorUnit || 0),
                        vTotal: parseFloat(item.valorUnit || 0) * parseFloat(item.qtd || 1)
                    },
                    bcICMS: costs.bcICMS || 0,
                    vICMS: costs.valorICMS || 0,
                    bcIPI: costs.bcIPI || 0,
                    vIPI: costs.valorIPI || 0,
                    aliqICMS: adicao.tributos?.ICMS?.aliquota || 0,
                    aliqIPI: adicao.tributos?.IPI?.aliquota || 0,
                    bcST: 0,
                    st: 0,
                    fp: 0
                });
            });
        });

        return items;
    }

    /**
     * Generate calculations summary
     */
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

    /**
     * Generate Excel file
     */
    async generateExcel() {
        const sketchData = this.generateSketchData();
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Generate main sheet
        const ws = this.createMainSheet(sketchData);
        XLSX.utils.book_append_sheet(wb, ws, "Croqui NF Entrada");
        
        // Write file
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        
        return blob;
    }

    /**
     * Create main Excel sheet with formatting
     */
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
        
        // Empty row
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
        
        // Empty rows
        data.push([]);
        data.push([]);
        
        // Calculations table header
        data.push([
            'CÁLCULO DO IMPOSTO'
        ]);
        
        // Calculations table
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
        
        // Create worksheet
        const ws = XLSX.utils.aoa_to_sheet(data);
        
        // Set column widths
        const colWidths = [
            { wch: 8 },   // Adição
            { wch: 10 },  // ITEM
            { wch: 40 },  // PRODUTO
            { wch: 10 },  // NCM
            { wch: 8 },   // PESO
            { wch: 10 },  // QUANT CX
            { wch: 10 },  // QUANT P/CX
            { wch: 10 },  // TOTAL UN
            { wch: 12 },  // V. UNIT
            { wch: 12 },  // V. TOTAL
            { wch: 12 },  // BC ICMS
            { wch: 12 },  // V.ICMS
            { wch: 12 },  // BC IPI
            { wch: 12 },  // V.IPI
            { wch: 10 },  // ALIQ ICMS
            { wch: 10 },  // ALIQ IPI
            { wch: 8 },   // MVA
            { wch: 12 },  // BC ST
            { wch: 12 },  // ST
            { wch: 8 }    // FP
        ];
        ws['!cols'] = colWidths;
        
        return ws;
    }

    /**
     * Generate PDF file
     */
    async generatePDF() {
        const sketchData = this.generateSketchData();
        
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
        
        // Set fonts
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
            item.produto.substring(0, 25) + '...', // Truncate long product names
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
        
        // Add table using autoTable plugin
        if (doc.autoTable) {
            doc.autoTable({
                head: [itemsHeaders],
                body: itemsData,
                startY: 40,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [66, 139, 202] },
                margin: { left: 10, right: 10 }
            });
            
            // Calculations table
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

    /**
     * Download Excel file
     */
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

    /**
     * Download PDF file
     */
    async downloadPDF(filename = 'croqui-nf-entrada.pdf') {
        const doc = await this.generatePDF();
        doc.save(filename);
    }
}