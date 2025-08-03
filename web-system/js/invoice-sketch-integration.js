/**
 * Invoice Sketch Integration
 * Integrates the invoice sketch functionality with the main application
 */

// Import the required modules
import { InvoiceSketchGenerator } from '../../js/services/invoiceSketchGenerator.js';
import { InvoiceSketchPanel } from '../../js/components/invoiceSketchPanel.js';

// Initialize the invoice sketch functionality
let invoiceSketchPanel = null;
let currentDIData = null;
let currentProcessedData = null;

/**
 * Initialize invoice sketch integration
 */
function initInvoiceSketchIntegration() {
    // Create the invoice sketch panel
    invoiceSketchPanel = new InvoiceSketchPanel();
    
    // Add event listener to the invoice sketch button
    const invoiceSketchBtn = document.getElementById('invoiceSketchBtn');
    if (invoiceSketchBtn) {
        invoiceSketchBtn.addEventListener('click', openInvoiceSketchPanel);
    }
}

/**
 * Update data when DI is processed
 */
function updateInvoiceSketchData(diData, processedData) {
    currentDIData = diData;
    currentProcessedData = processedData;
    
    // Enable the invoice sketch button
    const invoiceSketchBtn = document.getElementById('invoiceSketchBtn');
    if (invoiceSketchBtn) {
        invoiceSketchBtn.disabled = false;
    }
    
    // Update the panel data if it exists
    if (invoiceSketchPanel) {
        invoiceSketchPanel.updateData(diData, processedData);
    }
}

/**
 * Open the invoice sketch panel
 */
function openInvoiceSketchPanel() {
    if (!currentDIData || !currentProcessedData) {
        showToast('Erro: Dados da DI não disponíveis. Processe um arquivo XML primeiro.', 'error');
        return;
    }
    
    if (invoiceSketchPanel) {
        invoiceSketchPanel.updateData(currentDIData, currentProcessedData);
        invoiceSketchPanel.show();
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Make functions available globally for integration with the main app
window.invoiceSketchIntegration = {
    init: initInvoiceSketchIntegration,
    updateData: updateInvoiceSketchData,
    open: openInvoiceSketchPanel
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInvoiceSketchIntegration);
} else {
    initInvoiceSketchIntegration();
}