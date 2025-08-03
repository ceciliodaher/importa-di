/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Drag and Drop Zone Component - Componente de upload de arquivos XML
*/

import { showToast } from '../utils/helpers.js';

export class DragDropZone {
    constructor(zoneElement, fileInputElement, onFileSelected) {
        this.zone = zoneElement;
        this.fileInput = fileInputElement;
        this.onFileSelected = onFileSelected;
        this.isProcessing = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Drag and drop events
        this.zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
        this.zone.addEventListener('dragover', this.handleDragOver.bind(this));
        this.zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.zone.addEventListener('drop', this.handleDrop.bind(this));
        
        // Click to select file
        this.zone.addEventListener('click', this.handleClick.bind(this));
        
        // File input change
        this.fileInput.addEventListener('change', this.handleFileInputChange.bind(this));
        
        // Prevent default drag behaviors on document
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.preventDefaults.bind(this), false);
        });
    }
    
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    handleDragEnter(e) {
        this.preventDefaults(e);
        if (!this.isProcessing) {
            this.zone.classList.add('drag-over');
            this.updateDragText('Solte o arquivo aqui');
        }
    }
    
    handleDragOver(e) {
        this.preventDefaults(e);
        if (!this.isProcessing) {
            this.zone.classList.add('drag-over');
        }
    }
    
    handleDragLeave(e) {
        this.preventDefaults(e);
        // Only remove drag-over if we're leaving the zone completely
        if (!this.zone.contains(e.relatedTarget)) {
            this.zone.classList.remove('drag-over');
            this.updateDragText('Arraste seu arquivo XML aqui');
        }
    }
    
    handleDrop(e) {
        this.preventDefaults(e);
        
        if (this.isProcessing) {
            return;
        }
        
        this.zone.classList.remove('drag-over');
        this.updateDragText('Arraste seu arquivo XML aqui');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    handleClick(e) {
        if (!this.isProcessing && !e.target.closest('input')) {
            this.fileInput.click();
        }
    }
    
    handleFileInputChange(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    processFile(file) {
        // Validate file type
        if (!this.validateFile(file)) {
            return;
        }
        
        // Update UI to show file is selected
        this.showFileInfo(file);
        
        // Call the callback with the file
        if (this.onFileSelected) {
            this.onFileSelected(file);
        }
    }
    
    validateFile(file) {
        // Check file type
        if (!file.type.includes('xml') && !file.name.toLowerCase().endsWith('.xml')) {
            showToast('Erro: Apenas arquivos XML são aceitos', 'error');
            return false;
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            showToast('Erro: Arquivo muito grande. Máximo 10MB', 'error');
            return false;
        }
        
        // Check if file is empty
        if (file.size === 0) {
            showToast('Erro: Arquivo está vazio', 'error');
            return false;
        }
        
        return true;
    }
    
    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        
        if (fileInfo && fileName) {
            fileName.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
            fileInfo.classList.remove('expertzy-hidden');
        }
        
        // Show success message
        showToast(`Arquivo ${file.name} carregado com sucesso`, 'success');
    }
    
    updateDragText(text) {
        const dragText = this.zone.querySelector('.drag-drop-text');
        if (dragText) {
            dragText.textContent = text;
        }
    }
    
    setProcessingState(isProcessing) {
        this.isProcessing = isProcessing;
        
        if (isProcessing) {
            this.zone.classList.add('processing');
            this.updateDragText('Processando arquivo...');
            this.showProgress(0);
        } else {
            this.zone.classList.remove('processing');
            this.updateDragText('Arraste seu arquivo XML aqui');
            this.hideProgress();
        }
    }
    
    showProgress(percentage) {
        const progressContainer = document.getElementById('progressContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressContainer && progressFill && progressText) {
            progressContainer.classList.remove('expertzy-hidden');
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `Processando... ${Math.round(percentage)}%`;
        }
    }
    
    hideProgress() {
        const progressContainer = document.getElementById('progressContainer');
        if (progressContainer) {
            progressContainer.classList.add('expertzy-hidden');
        }
    }
    
    updateProgress(percentage, text = '') {
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText && text) {
            progressText.textContent = text;
        }
    }
    
    reset() {
        this.isProcessing = false;
        this.zone.classList.remove('processing', 'drag-over');
        this.updateDragText('Arraste seu arquivo XML aqui');
        this.hideProgress();
        
        // Clear file input
        this.fileInput.value = '';
        
        // Hide file info
        const fileInfo = document.getElementById('fileInfo');
        if (fileInfo) {
            fileInfo.classList.add('expertzy-hidden');
        }
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Public methods for external control
    enable() {
        this.isProcessing = false;
        this.zone.style.pointerEvents = 'auto';
        this.zone.style.opacity = '1';
    }
    
    disable() {
        this.isProcessing = true;
        this.zone.style.pointerEvents = 'none';
        this.zone.style.opacity = '0.6';
    }
    
    showError(message) {
        showToast(message, 'error');
        this.reset();
    }
    
    showSuccess(message) {
        showToast(message, 'success');
    }
}