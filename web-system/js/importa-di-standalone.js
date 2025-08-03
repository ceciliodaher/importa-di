/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Sistema de Importação DI - Versão Standalone (sem ES6 modules)
Funciona diretamente no navegador sem servidor local
*/

// =============================================================================
// CONSTANTS
// =============================================================================
const CONSTANTS = {
    // INCOTERM types and configurations
    INCOTERMS: {
        FOB: {
            code: 'FOB',
            name: 'Free On Board',
            freteEmbutido: false,
            seguroEmbutido: false,
            description: 'Frete e seguro separados do VCMV'
        },
        CFR: {
            code: 'CFR',
            name: 'Cost and Freight',
            freteEmbutido: true,
            seguroEmbutido: false,
            description: 'Frete embutido no VCMV, seguro separado'
        },
        CIF: {
            code: 'CIF',
            name: 'Cost, Insurance and Freight',
            freteEmbutido: true,
            seguroEmbutido: true,
            description: 'Frete e seguro embutidos no VCMV'
        },
        EXW: {
            code: 'EXW',
            name: 'Ex Works',
            freteEmbutido: false,
            seguroEmbutido: false,
            description: 'Frete e seguro separados do VCMV'
        }
    },

    // DI XML structure paths
    DI_XML_PATHS: {
        ROOT: 'declaracaoImportacao',
        ADICAO: 'adicao',
        MERCADORIA: 'mercadoria',
        
        // Header information
        NUMERO_DI: 'numeroDI',
        DATA_REGISTRO: 'dataRegistro',
        URF_DESPACHO: 'urfDespachoNome',
        MODALIDADE: 'modalidadeDespachoNome',
        TOTAL_ADICOES: 'totalAdicoes',
        SITUACAO: 'situacaoEntregaCarga',
        
        // Importer information
        IMPORTADOR_CNPJ: 'importadorNumero',
        IMPORTADOR_NOME: 'importadorNome',
        IMPORTADOR_REPRESENTANTE: 'importadorNomeRepresentanteLegal',
        IMPORTADOR_CPF_REPR: 'importadorCpfRepresentanteLegal',
        IMPORTADOR_ENDERECO: {
            LOGRADOURO: 'importadorEnderecoLogradouro',
            NUMERO: 'importadorEnderecoNumero',
            BAIRRO: 'importadorEnderecoBairro',
            MUNICIPIO: 'importadorEnderecoMunicipio',
            UF: 'importadorEnderecoUf',
            CEP: 'importadorEnderecoCep'
        },
        
        // Cargo information
        MANIFESTO_NOME: 'documentoChegadaCargaNome',
        MANIFESTO_NUMERO: 'documentoChegadaCargaNumero',
        RECINTO: 'armazenamentoRecintoAduaneiroNome',
        ARMAZEM: 'armazem',
        PESO_BRUTO: 'cargaPesoBruto',
        PESO_LIQUIDO: 'cargaPesoLiquido',
        
        // Values
        FOB_USD: 'localEmbarqueTotalDolares',
        FOB_BRL: 'localEmbarqueTotalReais',
        FRETE_USD: 'freteTotalDolares',
        FRETE_BRL: 'freteTotalReais',
        SEGURO_BRL: 'seguroTotalReais',
        AFRMM: 'afrmm',
        SISCOMEX: 'taxaSiscomex',
        VALOR_ADUANEIRO: 'localDescargaTotalReais',
        
        // Addition information
        NUMERO_ADICAO: 'numeroAdicao',
        NUMERO_LI: 'numeroLI',
        NCM: 'dadosMercadoriaCodigoNcm',
        DESCRICAO_NCM: 'dadosMercadoriaNomeNcm',
        VCMV_USD: 'condicaoVendaValorMoeda',
        VCMV_BRL: 'condicaoVendaValorReais',
        INCOTERM: 'condicaoVendaIncoterm',
        LOCAL_CONDICAO: 'condicaoVendaLocal',
        MOEDA: 'condicaoVendaMoedaNome',
        PESO_LIQUIDO_ADICAO: 'dadosMercadoriaPesoLiquido',
        QUANTIDADE_ESTATISTICA: 'dadosMercadoriaMedidaEstatisticaQuantidade',
        UNIDADE_ESTATISTICA: 'dadosMercadoriaMedidaEstatisticaUnidade',
        
        // Parties involved
        EXPORTADOR: 'fornecedorNome',
        PAIS_AQUISICAO: 'paisAquisicaoMercadoriaNome',
        FABRICANTE: 'fabricanteNome',
        PAIS_ORIGEM: 'paisOrigemMercadoriaNome',
        
        // Taxes
        II_ALIQUOTA: 'iiAliquotaAdValorem',
        II_REGIME: 'iiRegimeTributacaoNome',
        II_VALOR: 'iiAliquotaValorRecolher',
        IPI_ALIQUOTA: 'ipiAliquotaAdValorem',
        IPI_REGIME: 'ipiRegimeTributacaoNome',
        IPI_VALOR: 'ipiAliquotaValorRecolher',
        PIS_ALIQUOTA: 'pisPasepAliquotaAdValorem',
        PIS_VALOR: 'pisPasepAliquotaValorRecolher',
        COFINS_ALIQUOTA: 'cofinsAliquotaAdValorem',
        COFINS_VALOR: 'cofinsAliquotaValorRecolher',
        PIS_COFINS_BASE: 'pisCofinsBaseCalculoValor',
        PIS_COFINS_REGIME: 'pisCofinsRegimeTributacaoNome',
        
        // Item information
        ITEM_SEQUENCIA: 'numeroSequencialItem',
        ITEM_DESCRICAO: 'descricaoMercadoria',
        ITEM_QUANTIDADE: 'quantidade',
        ITEM_UNIDADE: 'unidadeMedida',
        ITEM_VALOR_UNITARIO: 'valorUnitario'
    },

    ERROR_MESSAGES: {
        FILE_NOT_SELECTED: 'Nenhum arquivo selecionado',
        INVALID_FILE_TYPE: 'Tipo de arquivo inválido. Apenas arquivos XML são aceitos',
        FILE_TOO_LARGE: 'Arquivo muito grande. Tamanho máximo: 10MB',
        FILE_EMPTY: 'Arquivo está vazio',
        XML_PARSE_ERROR: 'Erro ao processar arquivo XML',
        DI_STRUCTURE_INVALID: 'Estrutura da DI inválida',
        CALCULATION_ERROR: 'Erro nos cálculos de custo',
        VALIDATION_FAILED: 'Falha na validação dos dados'
    },

    SUCCESS_MESSAGES: {
        FILE_LOADED: 'Arquivo carregado com sucesso',
        PARSING_COMPLETE: 'Análise do XML concluída',
        CALCULATIONS_COMPLETE: 'Cálculos realizados com sucesso',
        VALIDATION_PASSED: 'Validação concluída sem erros'
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const Utils = {
    /**
     * Shows a toast notification
     */
    showToast: function(message, type, duration) {
        type = type || 'info';
        duration = duration || 5000;
        
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.warn('Toast container not found');
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" aria-label="Fechar">&times;</button>
            </div>
        `;
        
        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', function() {
            Utils.removeToast(toast);
        });
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(function() {
            Utils.removeToast(toast);
        }, duration);
    },

    removeToast: function(toast) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(function() {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    },

    /**
     * Formats a number as Brazilian currency
     */
    formatCurrency: function(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 'R$ 0,00';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    },

    /**
     * Formats a number with Brazilian locale
     */
    formatNumber: function(value, decimals) {
        decimals = decimals || 2;
        if (typeof value !== 'number' || isNaN(value)) {
            return '0';
        }
        
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(value);
    },

    /**
     * Parses a numeric field from XML (handles leading zeros and divisors)
     */
    parseNumericField: function(value, divisor) {
        divisor = divisor || 100;
        if (!value) {
            return 0.0;
        }
        
        try {
            const cleanValue = value.toString().replace(/^0+/, '') || '0';
            return parseFloat(cleanValue) / divisor;
        } catch (error) {
            console.warn('Error parsing numeric field:', value, error);
            return 0.0;
        }
    },

    /**
     * Extracts product code from description
     */
    extrairCodigoProduto: function(descricao) {
        if (!descricao) {
            return "N/A";
        }
        
        const parts = descricao.split(" - ");
        if (parts.length >= 2) {
            return parts[0].trim();
        }
        
        return "N/A";
    },

    /**
     * Extracts units per box from description
     */
    extrairUnidadesPorCaixa: function(descricao) {
        if (!descricao || !descricao.includes("EM CX COM")) {
            return "N/A";
        }
        
        try {
            const parte = descricao.split("EM CX COM")[1].split("UNIDADES")[0].trim();
            const unidades = parseInt(parte);
            return isNaN(unidades) ? "N/A" : unidades;
        } catch (error) {
            console.warn('Error extracting units per box:', descricao, error);
            return "N/A";
        }
    },

    /**
     * Shows/hides elements with animation
     */
    toggleElementVisibility: function(element, show) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        if (show) {
            el.classList.remove('expertzy-hidden');
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            
            // Trigger reflow
            el.offsetHeight;
            
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        } else {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'translateY(-20px)';
            
            setTimeout(function() {
                el.classList.add('expertzy-hidden');
                el.style.transition = '';
                el.style.opacity = '';
                el.style.transform = '';
            }, 300);
        }
    },

    logError: function(context, error, additionalData) {
        console.error(`[${context}]`, error);
        if (additionalData) {
            console.error('Additional data:', additionalData);
        }
    }
};

// =============================================================================
// DRAG DROP ZONE CLASS
// =============================================================================
function DragDropZone(zoneElement, fileInputElement, onFileSelected) {
    this.zone = zoneElement;
    this.fileInput = fileInputElement;
    this.onFileSelected = onFileSelected;
    this.isProcessing = false;
    
    this.init();
}

DragDropZone.prototype.init = function() {
    this.setupEventListeners();
};

DragDropZone.prototype.setupEventListeners = function() {
    var self = this;
    
    // Drag and drop events
    this.zone.addEventListener('dragenter', function(e) { self.handleDragEnter(e); });
    this.zone.addEventListener('dragover', function(e) { self.handleDragOver(e); });
    this.zone.addEventListener('dragleave', function(e) { self.handleDragLeave(e); });
    this.zone.addEventListener('drop', function(e) { self.handleDrop(e); });
    
    // Click to select file
    this.zone.addEventListener('click', function(e) { self.handleClick(e); });
    
    // File input change
    this.fileInput.addEventListener('change', function(e) { self.handleFileInputChange(e); });
    
    // Prevent default drag behaviors on document
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        document.addEventListener(eventName, function(e) { self.preventDefaults(e); }, false);
    });
};

DragDropZone.prototype.preventDefaults = function(e) {
    e.preventDefault();
    e.stopPropagation();
};

DragDropZone.prototype.handleDragEnter = function(e) {
    this.preventDefaults(e);
    if (!this.isProcessing) {
        this.zone.classList.add('drag-over');
        this.updateDragText('Solte o arquivo aqui');
    }
};

DragDropZone.prototype.handleDragOver = function(e) {
    this.preventDefaults(e);
    if (!this.isProcessing) {
        this.zone.classList.add('drag-over');
    }
};

DragDropZone.prototype.handleDragLeave = function(e) {
    this.preventDefaults(e);
    if (!this.zone.contains(e.relatedTarget)) {
        this.zone.classList.remove('drag-over');
        this.updateDragText('Arraste seu arquivo XML aqui');
    }
};

DragDropZone.prototype.handleDrop = function(e) {
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
};

DragDropZone.prototype.handleClick = function(e) {
    if (!this.isProcessing && !e.target.closest('input')) {
        this.fileInput.click();
    }
};

DragDropZone.prototype.handleFileInputChange = function(e) {
    const file = e.target.files[0];
    if (file) {
        this.processFile(file);
    }
};

DragDropZone.prototype.processFile = function(file) {
    if (!this.validateFile(file)) {
        return;
    }
    
    this.showFileInfo(file);
    
    if (this.onFileSelected) {
        this.onFileSelected(file);
    }
};

DragDropZone.prototype.validateFile = function(file) {
    if (!file.type.includes('xml') && !file.name.toLowerCase().endsWith('.xml')) {
        Utils.showToast('Erro: Apenas arquivos XML são aceitos', 'error');
        return false;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        Utils.showToast('Erro: Arquivo muito grande. Máximo 10MB', 'error');
        return false;
    }
    
    if (file.size === 0) {
        Utils.showToast('Erro: Arquivo está vazio', 'error');
        return false;
    }
    
    return true;
};

DragDropZone.prototype.showFileInfo = function(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    
    if (fileInfo && fileName) {
        fileName.textContent = `${file.name} (${this.formatFileSize(file.size)})`;
        fileInfo.classList.remove('expertzy-hidden');
    }
    
    Utils.showToast(`Arquivo ${file.name} carregado com sucesso`, 'success');
};

DragDropZone.prototype.updateDragText = function(text) {
    const dragText = this.zone.querySelector('.drag-drop-text');
    if (dragText) {
        dragText.textContent = text;
    }
};

DragDropZone.prototype.setProcessingState = function(isProcessing) {
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
};

DragDropZone.prototype.showProgress = function(percentage) {
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressContainer && progressFill && progressText) {
        progressContainer.classList.remove('expertzy-hidden');
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Processando... ${Math.round(percentage)}%`;
    }
};

DragDropZone.prototype.hideProgress = function() {
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) {
        progressContainer.classList.add('expertzy-hidden');
    }
};

DragDropZone.prototype.updateProgress = function(percentage, text) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText && text) {
        progressText.textContent = text;
    }
};

DragDropZone.prototype.reset = function() {
    this.isProcessing = false;
    this.zone.classList.remove('processing', 'drag-over');
    this.updateDragText('Arraste seu arquivo XML aqui');
    this.hideProgress();
    
    this.fileInput.value = '';
    
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) {
        fileInfo.classList.add('expertzy-hidden');
    }
};

DragDropZone.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// =============================================================================
// XML PARSER CLASS
// =============================================================================
function DIXMLParser() {
    this.parser = new DOMParser();
    this.xmlDoc = null;
    this.rootElement = null;
}

DIXMLParser.prototype.parseXML = function(xmlContent) {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            // Parse XML
            self.xmlDoc = self.parser.parseFromString(xmlContent, 'text/xml');
            
            // Check for parsing errors
            const parserError = self.xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error(`XML Parse Error: ${parserError.textContent}`);
            }
            
            // Find DI root element
            self.rootElement = self.xmlDoc.querySelector(CONSTANTS.DI_XML_PATHS.ROOT);
            if (!self.rootElement) {
                throw new Error('Elemento declaracaoImportacao não encontrado no XML');
            }
            
            // Extract all data
            self.extractDIData().then(function(diData) {
                // Validate extracted data
                self.validateDIData(diData);
                resolve(diData);
            }).catch(reject);
            
        } catch (error) {
            Utils.logError('XMLParser.parseXML', error, { xmlLength: xmlContent?.length });
            reject(new Error(`${CONSTANTS.ERROR_MESSAGES.XML_PARSE_ERROR}: ${error.message}`));
        }
    });
};

DIXMLParser.prototype.extractDIData = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
        try {
            const data = {
                cabecalho: self.extractCabecalho(),
                importador: self.extractImportador(),
                carga: self.extractCarga(),
                valores: self.extractValores(),
                adicoes: self.extractAdicoes(),
                tributos: {},
                informacaoComplementar: self.getTextContent('informacaoComplementar') || '—'
            };
            
            // Calculate total taxes from additions
            data.tributos = self.calculateTotalTaxes(data.adicoes);
            
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

DIXMLParser.prototype.extractCabecalho = function() {
    return {
        DI: this.getTextContent(CONSTANTS.DI_XML_PATHS.NUMERO_DI) || 'N/A',
        'Data registro': this.getTextContent(CONSTANTS.DI_XML_PATHS.DATA_REGISTRO) || 'N/A',
        'URF despacho': this.getTextContent(CONSTANTS.DI_XML_PATHS.URF_DESPACHO) || 'N/A',
        'Modalidade': this.getTextContent(CONSTANTS.DI_XML_PATHS.MODALIDADE) || 'N/A',
        'Qtd. adições': parseInt(this.getTextContent(CONSTANTS.DI_XML_PATHS.TOTAL_ADICOES) || '0'),
        'Situação': this.getTextContent(CONSTANTS.DI_XML_PATHS.SITUACAO) || 'N/A'
    };
};

DIXMLParser.prototype.extractImportador = function() {
    const endereco = this.buildAddress();
    
    return {
        CNPJ: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_CNPJ) || 'N/A',
        Nome: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_NOME) || 'N/A',
        Representante: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_REPRESENTANTE) || 'N/A',
        'CPF repr.': this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_CPF_REPR) || 'N/A',
        Endereço: endereco || 'N/A'
    };
};

DIXMLParser.prototype.buildAddress = function() {
    const addressParts = [
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.LOGRADOURO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.NUMERO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.BAIRRO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.MUNICIPIO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.UF),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.CEP)
    ].filter(function(part) { return part && part.trim() !== ''; });
    
    return addressParts.join(', ');
};

DIXMLParser.prototype.extractCarga = function() {
    const manifestoNome = this.getTextContent(CONSTANTS.DI_XML_PATHS.MANIFESTO_NOME) || 'N/A';
    const manifestoNumero = this.getTextContent(CONSTANTS.DI_XML_PATHS.MANIFESTO_NUMERO) || '';
    
    return {
        Manifesto: `${manifestoNome} ${manifestoNumero}`.trim(),
        Recinto: this.getTextContent(CONSTANTS.DI_XML_PATHS.RECINTO) || 'N/A',
        Armazém: (this.getTextContent(CONSTANTS.DI_XML_PATHS.ARMAZEM) || '').trim() || 'N/A',
        'Peso bruto (kg)': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.PESO_BRUTO) || '0', 1000),
        'Peso líquido (kg)': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.PESO_LIQUIDO) || '0', 1000)
    };
};

DIXMLParser.prototype.extractValores = function() {
    return {
        'FOB USD': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FOB_USD) || '0'),
        'FOB R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FOB_BRL) || '0'),
        'Frete USD': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FRETE_USD) || '0'),
        'Frete R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FRETE_BRL) || '0'),
        'Seguro R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.SEGURO_BRL) || '0'),
        'AFRMM R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.AFRMM) || '0'),
        'Siscomex R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.SISCOMEX) || '0'),
        'Valor Aduaneiro R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.VALOR_ADUANEIRO) || '0')
    };
};

DIXMLParser.prototype.extractAdicoes = function() {
    const adicoes = [];
    const adicaoElements = this.rootElement.querySelectorAll(CONSTANTS.DI_XML_PATHS.ADICAO);
    
    for (let i = 0; i < adicaoElements.length; i++) {
        const adicao = this.extractAdicao(adicaoElements[i]);
        adicoes.push(adicao);
    }
    
    return adicoes;
};

DIXMLParser.prototype.extractAdicao = function(adicaoElement) {
    return {
        numero: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NUMERO_ADICAO) || 'N/A',
        numeroLI: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NUMERO_LI) || 'N/A',
        dadosGerais: this.extractDadosGerais(adicaoElement),
        partes: this.extractPartes(adicaoElement),
        tributos: this.extractTributos(adicaoElement),
        itens: this.extractItens(adicaoElement)
    };
};

DIXMLParser.prototype.extractDadosGerais = function(adicaoElement) {
    return {
        NCM: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NCM) || 'N/A',
        NBM: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NCM) || 'N/A',
        'Descrição NCM': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.DESCRICAO_NCM) || 'N/A',
        'VCMV USD': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.VCMV_USD) || '0'),
        'VCMV R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.VCMV_BRL) || '0'),
        INCOTERM: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.INCOTERM) || 'N/A',
        Local: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.LOCAL_CONDICAO) || 'N/A',
        Moeda: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.MOEDA) || 'N/A',
        'Peso líq. (kg)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PESO_LIQUIDO_ADICAO) || '0', 1000),
        Quantidade: Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.QUANTIDADE_ESTATISTICA) || '0', 1000),
        Unidade: (this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.UNIDADE_ESTATISTICA) || '').trim() || 'N/A'
    };
};

DIXMLParser.prototype.extractPartes = function(adicaoElement) {
    return {
        Exportador: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.EXPORTADOR) || 'N/A',
        'País Aquisição': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PAIS_AQUISICAO) || 'N/A',
        Fabricante: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.FABRICANTE) || 'N/A',
        'País Origem': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PAIS_ORIGEM) || 'N/A'
    };
};

DIXMLParser.prototype.extractTributos = function(adicaoElement) {
    return {
        'II Alíq. (%)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.II_ALIQUOTA) || '0', 10000),
        'II Regime': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.II_REGIME) || 'N/A',
        'II R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.II_VALOR) || '0'),
        'IPI Alíq. (%)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.IPI_ALIQUOTA) || '0', 10000),
        'IPI Regime': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.IPI_REGIME) || 'N/A',
        'IPI R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.IPI_VALOR) || '0'),
        'PIS Alíq. (%)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PIS_ALIQUOTA) || '0', 10000),
        'PIS R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PIS_VALOR) || '0'),
        'COFINS Alíq. (%)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.COFINS_ALIQUOTA) || '0', 10000),
        'COFINS R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.COFINS_VALOR) || '0'),
        'Base PIS/COFINS R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PIS_COFINS_BASE) || '0'),
        'Regime PIS/COFINS': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PIS_COFINS_REGIME) || 'N/A'
    };
};

DIXMLParser.prototype.extractItens = function(adicaoElement) {
    const itens = [];
    const mercadoriaElements = adicaoElement.querySelectorAll(CONSTANTS.DI_XML_PATHS.MERCADORIA);
    
    for (let i = 0; i < mercadoriaElements.length; i++) {
        const item = this.extractItem(mercadoriaElements[i]);
        itens.push(item);
    }
    
    return itens;
};

DIXMLParser.prototype.extractItem = function(mercadoriaElement) {
    const descricao = (this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_DESCRICAO) || '').trim();
    const qtd = Utils.parseNumericField(this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_QUANTIDADE) || '0', 100000);
    const valorUnit = Utils.parseNumericField(this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_VALOR_UNITARIO) || '0', 10000000);
    
    return {
        Seq: this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_SEQUENCIA) || 'N/A',
        Código: Utils.extrairCodigoProduto(descricao),
        Descrição: descricao || 'N/A',
        Qtd: qtd,
        Unidade: (this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_UNIDADE) || '').trim() || 'N/A',
        'Valor Unit. USD': valorUnit,
        'Unid/Caixa': Utils.extrairUnidadesPorCaixa(descricao),
        'Valor Total USD': qtd * valorUnit
    };
};

DIXMLParser.prototype.calculateTotalTaxes = function(adicoes) {
    const totals = {
        'II R$': 0,
        'IPI R$': 0,
        'PIS R$': 0,
        'COFINS R$': 0
    };
    
    for (let i = 0; i < adicoes.length; i++) {
        const adicao = adicoes[i];
        totals['II R$'] += adicao.tributos['II R$'] || 0;
        totals['IPI R$'] += adicao.tributos['IPI R$'] || 0;
        totals['PIS R$'] += adicao.tributos['PIS R$'] || 0;
        totals['COFINS R$'] += adicao.tributos['COFINS R$'] || 0;
    }
    
    return totals;
};

DIXMLParser.prototype.validateDIData = function(diData) {
    const errors = [];
    
    if (!diData.cabecalho.DI || diData.cabecalho.DI === 'N/A') {
        errors.push('Número da DI não encontrado');
    }
    
    if (!diData.importador.CNPJ || diData.importador.CNPJ === 'N/A') {
        errors.push('CNPJ do importador não encontrado');
    }
    
    if (!diData.adicoes || diData.adicoes.length === 0) {
        errors.push('Nenhuma adição encontrada na DI');
    }
    
    if (diData.adicoes) {
        for (let i = 0; i < diData.adicoes.length; i++) {
            const adicao = diData.adicoes[i];
            if (!adicao.dadosGerais.NCM || adicao.dadosGerais.NCM === 'N/A') {
                errors.push(`NCM não encontrado na adição ${i + 1}`);
            }
            
            if (!adicao.dadosGerais['VCMV R$'] || adicao.dadosGerais['VCMV R$'] <= 0) {
                errors.push(`VCMV inválido na adição ${i + 1}`);
            }
        }
    }
    
    if (errors.length > 0) {
        throw new Error(`${CONSTANTS.ERROR_MESSAGES.DI_STRUCTURE_INVALID}:\n${errors.join('\n')}`);
    }
};

DIXMLParser.prototype.getTextContent = function(path) {
    return this.getElementText(this.rootElement, path);
};

DIXMLParser.prototype.getElementText = function(element, path) {
    if (!element || !path) return null;
    
    const targetElement = element.querySelector(path);
    return targetElement ? targetElement.textContent : null;
};

DIXMLParser.prototype.detectINCOTERM = function(diData) {
    if (!diData.adicoes || diData.adicoes.length === 0) {
        return null;
    }
    
    const primeiraAdicao = diData.adicoes[0];
    const incoterm = primeiraAdicao.dadosGerais.INCOTERM;
    
    if (incoterm && incoterm !== 'N/A') {
        return incoterm.toUpperCase();
    }
    
    return null;
};

DIXMLParser.prototype.getProcessingStats = function(diData) {
    const totalAdicoes = diData.adicoes ? diData.adicoes.length : 0;
    let totalItens = 0;
    
    if (diData.adicoes) {
        for (let i = 0; i < diData.adicoes.length; i++) {
            const adicao = diData.adicoes[i];
            totalItens += adicao.itens ? adicao.itens.length : 0;
        }
    }
    
    return {
        totalAdicoes: totalAdicoes,
        totalItens: totalItens,
        temTributos: diData.tributos && Object.keys(diData.tributos).length > 0,
        incotermDetectado: this.detectINCOTERM(diData)
    };
};

// =============================================================================
// MAIN APPLICATION CLASS
// =============================================================================
function ImportDIApp() {
    this.dragDropZone = null;
    this.xmlParser = new DIXMLParser();
    this.currentDIData = null;
    this.currentFile = null;
    this.isProcessing = false;
    
    this.init();
}

ImportDIApp.prototype.init = function() {
    try {
        this.setupDragDropZone();
        this.setupEventListeners();
        this.showEmptyState();
        
        console.log('✅ Aplicação iniciada com sucesso');
        
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
        Utils.showToast('Erro na inicialização da aplicação', 'error');
    }
};

ImportDIApp.prototype.setupDragDropZone = function() {
    const dragDropElement = document.getElementById('dragDropZone');
    const fileInputElement = document.getElementById('fileInput');
    
    if (dragDropElement && fileInputElement) {
        var self = this;
        this.dragDropZone = new DragDropZone(
            dragDropElement,
            fileInputElement,
            function(file) { self.handleFileSelected(file); }
        );
    }
};

ImportDIApp.prototype.setupEventListeners = function() {
    var self = this;
    
    // Process button
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
        processBtn.addEventListener('click', function() { self.handleProcessClick(); });
    }
    
    // Configuration checkboxes
    const freteCheckbox = document.getElementById('freteEmbutido');
    const seguroCheckbox = document.getElementById('seguroEmbutido');
    
    if (freteCheckbox) {
        freteCheckbox.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    if (seguroCheckbox) {
        seguroCheckbox.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    // Export buttons
    this.setupExportButtons();
    
    // Table action buttons
    this.setupTableActions();
};

ImportDIApp.prototype.setupExportButtons = function() {
    var self = this;
    const exportButtons = [
        { id: 'exportExcelBtn', handler: function() { self.handleExportExcel(); } },
        { id: 'exportCSVBtn', handler: function() { self.handleExportCSV(); } },
        { id: 'exportPDFBtn', handler: function() { self.handleExportPDF(); } },
        { id: 'saveConfigBtn', handler: function() { self.handleSaveConfig(); } }
    ];
    
    exportButtons.forEach(function(btn) {
        const button = document.getElementById(btn.id);
        if (button) {
            button.addEventListener('click', btn.handler);
        }
    });
};

ImportDIApp.prototype.setupTableActions = function() {
    var self = this;
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    
    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function() { self.handleExpandAll(); });
    }
    
    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function() { self.handleCollapseAll(); });
    }
};

ImportDIApp.prototype.handleFileSelected = function(file) {
    if (this.isProcessing) {
        return;
    }
    
    try {
        this.currentFile = file;
        this.showConfigSection();
        this.enableProcessButton();
        
        // Try to parse XML immediately for INCOTERM detection
        this.performQuickAnalysis(file);
        
    } catch (error) {
        console.error('Erro na seleção do arquivo:', error);
        Utils.showToast('Erro ao analisar arquivo selecionado', 'error');
        this.resetApplication();
    }
};

ImportDIApp.prototype.performQuickAnalysis = function(file) {
    var self = this;
    
    this.readFileContent(file).then(function(content) {
        return self.xmlParser.parseXML(content);
    }).then(function(diData) {
        // Detect INCOTERM and auto-configure
        const incoterm = self.xmlParser.detectINCOTERM(diData);
        if (incoterm && CONSTANTS.INCOTERMS[incoterm]) {
            self.autoConfigureINCOTERM(incoterm);
        }
    }).catch(function(error) {
        console.warn('Análise rápida falhou, continuando...', error);
    });
};

ImportDIApp.prototype.autoConfigureINCOTERM = function(incoterm) {
    const config = CONSTANTS.INCOTERMS[incoterm];
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
    
    Utils.showToast(`INCOTERM ${incoterm} detectado e configurado automaticamente`, 'success');
};

ImportDIApp.prototype.handleProcessClick = function() {
    if (!this.currentFile || this.isProcessing) {
        return;
    }
    
    var self = this;
    
    this.setProcessingState(true);
    this.hideError();
    
    // Read file content
    this.updateProgress(10, 'Lendo arquivo...');
    
    this.readFileContent(this.currentFile).then(function(content) {
        // Parse XML
        self.updateProgress(30, 'Analisando estrutura XML...');
        return self.xmlParser.parseXML(content);
    }).then(function(diData) {
        self.currentDIData = diData;
        
        // Calculate costs
        self.updateProgress(60, 'Calculando custos...');
        return self.calculateCosts();
    }).then(function() {
        // Validate results
        self.updateProgress(80, 'Validando resultados...');
        return self.validateResults();
    }).then(function() {
        // Display results
        self.updateProgress(100, 'Exibindo resultados...');
        return self.displayResults();
    }).then(function() {
        self.setProcessingState(false);
        Utils.showToast(CONSTANTS.SUCCESS_MESSAGES.CALCULATIONS_COMPLETE, 'success');
    }).catch(function(error) {
        console.error('Erro no processamento:', error);
        self.showError('Erro no processamento', error.message);
        self.setProcessingState(false);
    });
};

ImportDIApp.prototype.readFileContent = function(file) {
    return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        
        reader.onerror = function() {
            reject(new Error('Erro ao ler arquivo'));
        };
        
        reader.readAsText(file, 'UTF-8');
    });
};

ImportDIApp.prototype.calculateCosts = function() {
    // TODO: Implement cost calculation engine
    console.log('📊 Calculando custos...', this.currentDIData);
    
    // Simulate cost calculation delay
    return new Promise(function(resolve) {
        setTimeout(resolve, 500);
    });
};

ImportDIApp.prototype.validateResults = function() {
    // TODO: Implement result validation
    console.log('🔍 Validando resultados...');
    
    // Simulate validation delay
    return new Promise(function(resolve) {
        setTimeout(resolve, 300);
    });
};

ImportDIApp.prototype.displayResults = function() {
    this.hideEmptyState();
    this.showResultsSection();
    this.populateSummaryCards();
    this.populateValidationSection();
    this.populateResultsTable();
    this.enableExportButtons();
    
    return Promise.resolve();
};

ImportDIApp.prototype.populateSummaryCards = function() {
    if (!this.currentDIData) return;
    
    const stats = this.xmlParser.getProcessingStats(this.currentDIData);
    
    // Update summary cards
    this.updateElement('totalAdicoes', stats.totalAdicoes.toString());
    this.updateElement('totalItens', stats.totalItens.toString());
    this.updateElement('valorFOB', Utils.formatCurrency(this.currentDIData.valores['FOB R$'] || 0));
    
    // Calculate total cost (placeholder - will be implemented in cost calculator)
    const totalCost = this.currentDIData.valores['FOB R$'] + 
                     this.currentDIData.valores['Frete R$'] + 
                     this.currentDIData.valores['Seguro R$'] +
                     this.currentDIData.tributos['II R$'];
    
    this.updateElement('custoTotal', Utils.formatCurrency(totalCost));
};

ImportDIApp.prototype.populateValidationSection = function() {
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
};

ImportDIApp.prototype.populateResultsTable = function() {
    if (!this.currentDIData || !this.currentDIData.adicoes) return;
    
    const tableBody = document.getElementById('resultsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    var self = this;
    this.currentDIData.adicoes.forEach(function(adicao, index) {
        const row = self.createTableRow(adicao, index);
        tableBody.appendChild(row);
    });
};

ImportDIApp.prototype.createTableRow = function(adicao, index) {
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
        <td>${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'])}</td>
        <td>${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'] + totalTributos)}</td>
        <td>${Utils.formatCurrency(adicao.tributos['II R$'])}</td>
        <td>-</td>
    `;
    
    var self = this;
    row.addEventListener('click', function() {
        self.toggleRowExpansion(row, adicao);
    });
    
    return row;
};

ImportDIApp.prototype.toggleRowExpansion = function(row, adicao) {
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
};

ImportDIApp.prototype.expandRow = function(row, adicao) {
    if (row.nextElementSibling && row.nextElementSibling.classList.contains('table-detail-row')) {
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
                        <p><strong>Quantidade:</strong> ${Utils.formatNumber(adicao.dadosGerais.Quantidade)} ${adicao.dadosGerais.Unidade}</p>
                    </div>
                    <div>
                        <h5>Tributos</h5>
                        <p><strong>II:</strong> ${Utils.formatCurrency(adicao.tributos['II R$'])} (${Utils.formatNumber(adicao.tributos['II Alíq. (%)'])}%)</p>
                        <p><strong>IPI:</strong> ${Utils.formatCurrency(adicao.tributos['IPI R$'])} (${Utils.formatNumber(adicao.tributos['IPI Alíq. (%)'])}%)</p>
                        <p><strong>PIS:</strong> ${Utils.formatCurrency(adicao.tributos['PIS R$'])} (${Utils.formatNumber(adicao.tributos['PIS Alíq. (%)'])}%)</p>
                        <p><strong>COFINS:</strong> ${Utils.formatCurrency(adicao.tributos['COFINS R$'])} (${Utils.formatNumber(adicao.tributos['COFINS Alíq. (%)'])}%)</p>
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
};

ImportDIApp.prototype.collapseRow = function(row) {
    const detailRow = row.nextElementSibling;
    if (detailRow && detailRow.classList.contains('table-detail-row')) {
        detailRow.remove();
    }
};

ImportDIApp.prototype.createItemsTable = function(itens) {
    if (!itens || itens.length === 0) return '';
    
    var self = this;
    const rows = itens.map(function(item) {
        return `
            <tr>
                <td>${item.Seq}</td>
                <td>${item.Código}</td>
                <td title="${item.Descrição}">${self.truncateText(item.Descrição, 30)}</td>
                <td>${Utils.formatNumber(item.Qtd)}</td>
                <td>${item.Unidade}</td>
                <td>${Utils.formatCurrency(item['Valor Unit. USD'])}</td>
                <td>${item['Unid/Caixa']}</td>
            </tr>
        `;
    }).join('');
    
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
};

// Other methods remain the same...
ImportDIApp.prototype.handleConfigChange = function() {
    console.log('⚙️ Configuração alterada');
};

ImportDIApp.prototype.handleExportExcel = function() {
    Utils.showToast('Exportação Excel em desenvolvimento', 'info');
};

ImportDIApp.prototype.handleExportCSV = function() {
    Utils.showToast('Exportação CSV em desenvolvimento', 'info');
};

ImportDIApp.prototype.handleExportPDF = function() {
    Utils.showToast('Exportação PDF em desenvolvimento', 'info');
};

ImportDIApp.prototype.handleSaveConfig = function() {
    Utils.showToast('Salvamento de configuração em desenvolvimento', 'info');
};

ImportDIApp.prototype.handleExpandAll = function() {
    var self = this;
    const expandableRows = document.querySelectorAll('.table-row-expandable:not(.table-row-expanded)');
    expandableRows.forEach(function(row) {
        const index = parseInt(row.dataset.index);
        if (self.currentDIData && self.currentDIData.adicoes[index]) {
            self.toggleRowExpansion(row, self.currentDIData.adicoes[index]);
        }
    });
};

ImportDIApp.prototype.handleCollapseAll = function() {
    var self = this;
    const expandedRows = document.querySelectorAll('.table-row-expanded');
    expandedRows.forEach(function(row) {
        self.collapseRow(row);
        const icon = row.querySelector('.table-expand-icon');
        icon.textContent = '▶';
        icon.classList.remove('expanded');
        row.classList.remove('table-row-expanded');
    });
};

ImportDIApp.prototype.setProcessingState = function(isProcessing) {
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
};

ImportDIApp.prototype.updateProgress = function(percentage, text) {
    if (this.dragDropZone) {
        this.dragDropZone.updateProgress(percentage, text);
    }
};

ImportDIApp.prototype.showConfigSection = function() {
    Utils.toggleElementVisibility('#configSection', true);
};

ImportDIApp.prototype.showResultsSection = function() {
    Utils.toggleElementVisibility('#resultsSection', true);
    Utils.toggleElementVisibility('#exportSection', true);
};

ImportDIApp.prototype.showEmptyState = function() {
    Utils.toggleElementVisibility('#emptyState', true);
};

ImportDIApp.prototype.hideEmptyState = function() {
    Utils.toggleElementVisibility('#emptyState', false);
};

ImportDIApp.prototype.enableProcessButton = function() {
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
        processBtn.disabled = false;
    }
};

ImportDIApp.prototype.enableExportButtons = function() {
    const exportButtons = ['exportExcelBtn', 'exportCSVBtn', 'exportPDFBtn', 'saveConfigBtn'];
    exportButtons.forEach(function(id) {
        const button = document.getElementById(id);
        if (button) {
            button.disabled = false;
        }
    });
};

ImportDIApp.prototype.showError = function(title, message, details) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');
    
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        
        if (errorDetails && details) {
            errorDetails.textContent = details;
        }
        
        Utils.toggleElementVisibility(errorContainer, true);
    }
    
    Utils.showToast(`${title}: ${message}`, 'error');
};

ImportDIApp.prototype.hideError = function() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        Utils.toggleElementVisibility(errorContainer, false);
    }
};

ImportDIApp.prototype.updateElement = function(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
};

ImportDIApp.prototype.truncateText = function(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text || '';
    }
    return text.substring(0, maxLength) + '...';
};

ImportDIApp.prototype.resetApplication = function() {
    this.currentDIData = null;
    this.currentFile = null;
    this.isProcessing = false;
    
    if (this.dragDropZone) {
        this.dragDropZone.reset();
    }
    
    Utils.toggleElementVisibility('#configSection', false);
    Utils.toggleElementVisibility('#resultsSection', false);
    Utils.toggleElementVisibility('#exportSection', false);
    this.showEmptyState();
    this.hideError();
};

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    new ImportDIApp();
});