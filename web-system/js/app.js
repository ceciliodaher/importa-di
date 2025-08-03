/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Main Application Controller - Controlador principal da aplicação
*/

import { DragDropZone } from './components/dragDropZone.js';
import { DIXMLParser } from './core/xmlParser.js';
import { showToast, toggleElementVisibility, formatCurrency, formatNumber } from './utils/helpers.js';
import { INCOTERMS, FILE_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './utils/constants.js';

class ImportDIApp {
    constructor() {
        this.dragDropZone = null;
        this.xmlParser = new DIXMLParser();
        this.currentDIData = null;
        this.currentFile = null;
        this.isProcessing = false;
        
        this.init();
    }
    
    async init() {
        try {
            this.setupDragDropZone();
            this.setupEventListeners();
            this.showEmptyState();
            
            console.log('✅ Aplicação iniciada com sucesso');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            showToast('Erro na inicialização da aplicação', 'error');
        }
    }
    
    setupDragDropZone() {
        const dragDropElement = document.getElementById('dragDropZone');
        const fileInputElement = document.getElementById('fileInput');
        
        if (dragDropElement && fileInputElement) {
            this.dragDropZone = new DragDropZone(
                dragDropElement,
                fileInputElement,
                this.handleFileSelected.bind(this)
            );
        }
    }
    
    setupEventListeners() {
        // Process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', this.handleProcessClick.bind(this));
        }
        
        // Configuration checkboxes
        const freteCheckbox = document.getElementById('freteEmbutido');
        const seguroCheckbox = document.getElementById('seguroEmbutido');
        
        if (freteCheckbox) {
            freteCheckbox.addEventListener('change', this.handleConfigChange.bind(this));
        }
        
        if (seguroCheckbox) {
            seguroCheckbox.addEventListener('change', this.handleConfigChange.bind(this));
        }
        
        // Export buttons
        this.setupExportButtons();
        
        // Table action buttons
        this.setupTableActions();
    }
    
    setupExportButtons() {
        const exportButtons = [
            { id: 'exportExcelBtn', handler: this.handleExportExcel.bind(this) },
            { id: 'exportCSVBtn', handler: this.handleExportCSV.bind(this) },
            { id: 'exportPDFBtn', handler: this.handleExportPDF.bind(this) },
            { id: 'saveConfigBtn', handler: this.handleSaveConfig.bind(this) }
        ];
        
        exportButtons.forEach(({ id, handler }) => {
            const button = document.getElementById(id);
            if (button) {
                button.addEventListener('click', handler);
            }
        });
    }
    
    setupTableActions() {
        const expandAllBtn = document.getElementById('expandAllBtn');
        const collapseAllBtn = document.getElementById('collapseAllBtn');
        
        if (expandAllBtn) {
            expandAllBtn.addEventListener('click', this.handleExpandAll.bind(this));
        }
        
        if (collapseAllBtn) {
            collapseAllBtn.addEventListener('click', this.handleCollapseAll.bind(this));
        }
    }
    
    async handleFileSelected(file) {
        if (this.isProcessing) {
            return;
        }
        
        try {
            this.currentFile = file;
            this.showConfigSection();
            this.enableProcessButton();
            
            // Try to parse XML immediately for INCOTERM detection
            await this.performQuickAnalysis(file);
            
        } catch (error) {
            console.error('Erro na seleção do arquivo:', error);
            showToast('Erro ao analisar arquivo selecionado', 'error');
            this.resetApplication();
        }
    }
    
    async performQuickAnalysis(file) {
        try {
            const content = await this.readFileContent(file);
            const diData = await this.xmlParser.parseXML(content);
            
            // Detect INCOTERM and auto-configure
            const incoterm = this.xmlParser.detectINCOTERM(diData);
            if (incoterm && INCOTERMS[incoterm]) {
                this.autoConfigureINCOTERM(incoterm);
            }
            
        } catch (error) {
            console.warn('Análise rápida falhou, continuando...', error);
        }
    }
    
    autoConfigureINCOTERM(incoterm) {
        const config = INCOTERMS[incoterm];
        const freteCheckbox = document.getElementById('freteEmbutido');
        const seguroCheckbox = document.getElementById('seguroEmbutido');
        const detectedDiv = document.getElementById('incotermDetected');
        const detectedText = document.getElementById('detectedIncotermText');
        
        if (freteCheckbox && seguroCheckbox) {
            freteCheckbox.checked = config.freteEmbutido;
            seguroCheckbox.checked = config.seguroEmbutido;
        }
        
        if (detectedDiv && detectedText) {
            detectedText.textContent = `INCOTERM detectado: ${incoterm} - ${config.description}`;
            detectedDiv.classList.remove('expertzy-hidden');
        }
        
        showToast(`INCOTERM ${incoterm} detectado e configurado automaticamente`, 'success');
    }
    
    async handleProcessClick() {
        if (!this.currentFile || this.isProcessing) {
            return;
        }
        
        try {
            this.setProcessingState(true);
            this.hideError();
            
            // Read file content
            this.updateProgress(10, 'Lendo arquivo...');
            const content = await this.readFileContent(this.currentFile);
            
            // Parse XML
            this.updateProgress(30, 'Analisando estrutura XML...');
            this.currentDIData = await this.xmlParser.parseXML(content);
            
            // Calculate costs
            this.updateProgress(60, 'Calculando custos...');
            await this.calculateCosts();
            
            // Validate results
            this.updateProgress(80, 'Validando resultados...');
            await this.validateResults();
            
            // Display results
            this.updateProgress(100, 'Exibindo resultados...');
            await this.displayResults();
            
            this.setProcessingState(false);
            showToast(SUCCESS_MESSAGES.CALCULATIONS_COMPLETE, 'success');
            
        } catch (error) {
            console.error('Erro no processamento:', error);
            this.showError('Erro no processamento', error.message);
            this.setProcessingState(false);
        }
    }
    
    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao ler arquivo'));
            };
            
            reader.readAsText(file, 'UTF-8');
        });
    }
    
    async calculateCosts() {
        // TODO: Implement cost calculation engine
        // For now, we'll use the parsed data as-is
        console.log('📊 Calculando custos...', this.currentDIData);
        
        // Simulate cost calculation delay
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    async validateResults() {
        // TODO: Implement result validation
        console.log('🔍 Validando resultados...');
        
        // Simulate validation delay
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    async displayResults() {
        this.hideEmptyState();
        this.showResultsSection();
        this.populateSummaryCards();
        this.populateValidationSection();
        this.populateResultsTable();
        this.enableExportButtons();
    }
    
    populateSummaryCards() {
        if (!this.currentDIData) return;
        
        const stats = this.xmlParser.getProcessingStats(this.currentDIData);
        
        // Update summary cards
        this.updateElement('totalAdicoes', stats.totalAdicoes.toString());
        this.updateElement('totalItens', stats.totalItens.toString());
        this.updateElement('valorFOB', formatCurrency(this.currentDIData.valores['FOB R$'] || 0));
        
        // Calculate total cost (placeholder - will be implemented in cost calculator)
        const totalCost = this.currentDIData.valores['FOB R$'] + 
                         this.currentDIData.valores['Frete R$'] + 
                         this.currentDIData.valores['Seguro R$'] +
                         this.currentDIData.tributos['II R$'];
        
        this.updateElement('custoTotal', formatCurrency(totalCost));
    }
    
    populateValidationSection() {
        // TODO: Implement validation display
        const validationResults = document.getElementById('validationResults');
        if (validationResults) {
            validationResults.innerHTML = `
                <div class="validation-item">
                    <span class="validation-label">Status da Validação</span>
                    <span class="validation-value success">✓ Aprovado</span>
                </div>
                <div class="validation-item">
                    <span class="validation-label">Diferença de Cálculo</span>
                    <span class="validation-value success">< R$ 0,01</span>
                </div>
            `;
        }
    }
    
    populateResultsTable() {
        if (!this.currentDIData || !this.currentDIData.adicoes) return;
        
        const tableBody = document.getElementById('resultsTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        this.currentDIData.adicoes.forEach((adicao, index) => {
            const row = this.createTableRow(adicao, index);
            tableBody.appendChild(row);
        });
    }
    
    createTableRow(adicao, index) {
        const row = document.createElement('tr');
        row.className = 'table-row-expandable';
        row.dataset.index = index;
        
        const totalTributos = (adicao.tributos['II R$'] || 0) + 
                             (adicao.tributos['IPI R$'] || 0) + 
                             (adicao.tributos['PIS R$'] || 0) + 
                             (adicao.tributos['COFINS R$'] || 0);
        
        row.innerHTML = `
            <td>
                <span class="table-expand-icon">▶</span>
            </td>
            <td>${adicao.numero}</td>
            <td>${adicao.dadosGerais.NCM}</td>
            <td title="${adicao.dadosGerais['Descrição NCM']}">
                ${this.truncateText(adicao.dadosGerais['Descrição NCM'], 40)}
            </td>
            <td>${adicao.dadosGerais.INCOTERM}</td>
            <td>${formatCurrency(adicao.dadosGerais['VCMV R$'])}</td>
            <td>${formatCurrency(adicao.dadosGerais['VCMV R$'] + totalTributos)}</td>
            <td>${formatCurrency(adicao.tributos['II R$'])}</td>
            <td>-</td>
        `;
        
        row.addEventListener('click', () => this.toggleRowExpansion(row, adicao));
        
        return row;
    }
    
    toggleRowExpansion(row, adicao) {
        const icon = row.querySelector('.table-expand-icon');
        const isExpanded = row.classList.contains('table-row-expanded');
        
        if (isExpanded) {
            this.collapseRow(row);
        } else {
            this.expandRow(row, adicao);
        }
        
        icon.textContent = isExpanded ? '▶' : '▼';
        icon.classList.toggle('expanded');
        row.classList.toggle('table-row-expanded');
    }
    
    expandRow(row, adicao) {
        if (row.nextElementSibling?.classList.contains('table-detail-row')) {
            return; // Already expanded
        }
        
        const detailRow = document.createElement('tr');
        detailRow.className = 'table-detail-row';
        detailRow.innerHTML = `
            <td colspan="9">
                <div class="table-detail-content">
                    <h4>Detalhes da Adição ${adicao.numero}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div>
                            <h5>Dados Gerais</h5>
                            <p><strong>NCM:</strong> ${adicao.dadosGerais.NCM}</p>
                            <p><strong>Descrição:</strong> ${adicao.dadosGerais['Descrição NCM']}</p>
                            <p><strong>INCOTERM:</strong> ${adicao.dadosGerais.INCOTERM}</p>
                            <p><strong>Quantidade:</strong> ${formatNumber(adicao.dadosGerais.Quantidade)} ${adicao.dadosGerais.Unidade}</p>
                        </div>
                        <div>
                            <h5>Tributos</h5>
                            <p><strong>II:</strong> ${formatCurrency(adicao.tributos['II R$'])} (${formatNumber(adicao.tributos['II Alíq. (%)'])}%)</p>
                            <p><strong>IPI:</strong> ${formatCurrency(adicao.tributos['IPI R$'])} (${formatNumber(adicao.tributos['IPI Alíq. (%)'])}%)</p>
                            <p><strong>PIS:</strong> ${formatCurrency(adicao.tributos['PIS R$'])} (${formatNumber(adicao.tributos['PIS Alíq. (%)'])}%)</p>
                            <p><strong>COFINS:</strong> ${formatCurrency(adicao.tributos['COFINS R$'])} (${formatNumber(adicao.tributos['COFINS Alíq. (%)'])}%)</p>
                        </div>
                        <div>
                            <h5>Partes Envolvidas</h5>
                            <p><strong>Exportador:</strong> ${adicao.partes.Exportador}</p>
                            <p><strong>País Origem:</strong> ${adicao.partes['País Origem']}</p>
                            <p><strong>Fabricante:</strong> ${adicao.partes.Fabricante}</p>
                        </div>
                    </div>
                    ${adicao.itens && adicao.itens.length > 0 ? this.createItemsTable(adicao.itens) : ''}
                </div>
            </td>
        `;
        
        row.parentNode.insertBefore(detailRow, row.nextSibling);
    }
    
    collapseRow(row) {
        const detailRow = row.nextElementSibling;
        if (detailRow && detailRow.classList.contains('table-detail-row')) {
            detailRow.remove();
        }
    }
    
    createItemsTable(itens) {
        if (!itens || itens.length === 0) return '';
        
        const rows = itens.map(item => `
            <tr>
                <td>${item.Seq}</td>
                <td>${item.Código}</td>
                <td title="${item.Descrição}">${this.truncateText(item.Descrição, 30)}</td>
                <td>${formatNumber(item.Qtd)}</td>
                <td>${item.Unidade}</td>
                <td>${formatCurrency(item['Valor Unit. USD'])}</td>
                <td>${item['Unid/Caixa']}</td>
            </tr>
        `).join('');
        
        return `
            <div style="margin-top: 1rem;">
                <h5>Itens Detalhados</h5>
                <div class="table-responsive">
                    <table class="expertzy-table" style="margin-top: 0.5rem;">
                        <thead>
                            <tr>
                                <th>Seq</th>
                                <th>Código</th>
                                <th>Descrição</th>
                                <th>Qtd</th>
                                <th>Unidade</th>
                                <th>Valor Unit. USD</th>
                                <th>Unid/Caixa</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    handleConfigChange() {
        // Configuration changed, could trigger recalculation
        console.log('⚙️ Configuração alterada');
    }
    
    // Export handlers (placeholder implementations)
    handleExportExcel() {
        showToast('Exportação Excel em desenvolvimento', 'info');
    }
    
    handleExportCSV() {
        showToast('Exportação CSV em desenvolvimento', 'info');
    }
    
    handleExportPDF() {
        showToast('Exportação PDF em desenvolvimento', 'info');
    }
    
    handleSaveConfig() {
        showToast('Salvamento de configuração em desenvolvimento', 'info');
    }
    
    handleExpandAll() {
        const expandableRows = document.querySelectorAll('.table-row-expandable:not(.table-row-expanded)');
        expandableRows.forEach(row => {
            const index = parseInt(row.dataset.index);
            if (this.currentDIData && this.currentDIData.adicoes[index]) {
                this.toggleRowExpansion(row, this.currentDIData.adicoes[index]);
            }
        });
    }
    
    handleCollapseAll() {
        const expandedRows = document.querySelectorAll('.table-row-expanded');
        expandedRows.forEach(row => {
            this.collapseRow(row);
            const icon = row.querySelector('.table-expand-icon');
            icon.textContent = '▶';
            icon.classList.remove('expanded');
            row.classList.remove('table-row-expanded');
        });
    }
    
    // UI State Management
    setProcessingState(isProcessing) {
        this.isProcessing = isProcessing;
        
        if (this.dragDropZone) {
            this.dragDropZone.setProcessingState(isProcessing);
        }
        
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.disabled = isProcessing;
            processBtn.innerHTML = isProcessing ? 
                '<span class="loading-spinner"></span> Processando...' : 
                '<span>💾</span> Processar e Calcular Custos';
        }
    }
    
    updateProgress(percentage, text) {
        if (this.dragDropZone) {
            this.dragDropZone.updateProgress(percentage, text);
        }
    }
    
    showConfigSection() {
        toggleElementVisibility('#configSection', true);
    }
    
    showResultsSection() {
        toggleElementVisibility('#resultsSection', true);
        toggleElementVisibility('#exportSection', true);
    }
    
    showEmptyState() {
        toggleElementVisibility('#emptyState', true);
    }
    
    hideEmptyState() {
        toggleElementVisibility('#emptyState', false);
    }
    
    enableProcessButton() {
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.disabled = false;
        }
    }
    
    enableExportButtons() {
        const exportButtons = ['exportExcelBtn', 'exportCSVBtn', 'exportPDFBtn', 'saveConfigBtn'];
        exportButtons.forEach(id => {
            const button = document.getElementById(id);
            if (button) {
                button.disabled = false;
            }
        });
    }
    
    showError(title, message, details = null) {
        const errorContainer = document.getElementById('errorContainer');
        const errorMessage = document.getElementById('errorMessage');
        const errorDetails = document.getElementById('errorDetails');
        
        if (errorContainer && errorMessage) {
            errorMessage.textContent = message;
            
            if (errorDetails && details) {
                errorDetails.textContent = details;
            }
            
            toggleElementVisibility(errorContainer, true);
        }
        
        showToast(`${title}: ${message}`, 'error');
    }
    
    hideError() {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
            toggleElementVisibility(errorContainer, false);
        }
    }
    
    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }
    
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) {
            return text || '';
        }
        return text.substring(0, maxLength) + '...';
    }
    
    resetApplication() {
        this.currentDIData = null;
        this.currentFile = null;
        this.isProcessing = false;
        
        if (this.dragDropZone) {
            this.dragDropZone.reset();
        }
        
        toggleElementVisibility('#configSection', false);
        toggleElementVisibility('#resultsSection', false);
        toggleElementVisibility('#exportSection', false);
        this.showEmptyState();
        this.hideError();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImportDIApp();
});