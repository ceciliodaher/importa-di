/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Constants - Constantes do sistema
*/

// INCOTERM types and configurations
export const INCOTERMS = {
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
};

// Tax rates and calculation constants
export const TAX_RATES = {
    // PIS/COFINS standard rates
    PIS_RATE: 0.0165,  // 1.65%
    COFINS_RATE: 0.076, // 7.6%
    
    // Default ICMS rate (varies by state)
    ICMS_DEFAULT_RATE: 0.18, // 18%
    
    // Minimum thresholds
    MIN_VALUE_THRESHOLD: 0.01 // R$ 0.01
};

// File processing constants
export const FILE_CONSTANTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_EXTENSIONS: ['.xml'],
    ALLOWED_MIME_TYPES: ['text/xml', 'application/xml'],
    
    // Progress steps for UI feedback
    PROGRESS_STEPS: {
        FILE_LOADED: 10,
        XML_PARSED: 30,
        DATA_EXTRACTED: 50,
        CALCULATIONS_DONE: 80,
        VALIDATION_COMPLETE: 100
    }
};

// DI XML structure constants
export const DI_XML_PATHS = {
    // Root paths
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
};

// Validation constants
export const VALIDATION = {
    // Tolerance for cost calculations (±R$0.01)
    COST_TOLERANCE: 0.01,
    
    // Required fields for DI validation
    REQUIRED_FIELDS: [
        'numeroDI',
        'dataRegistro',
        'importadorNumero',
        'importadorNome'
    ],
    
    // Status types
    STATUS: {
        OK: 'OK',
        WARNING: 'AVISO',
        ERROR: 'ERRO'
    }
};

// Export formats
export const EXPORT_FORMATS = {
    EXCEL: {
        extension: '.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        name: 'Excel'
    },
    CSV: {
        extension: '.csv',
        mimeType: 'text/csv',
        name: 'CSV'
    },
    PDF: {
        extension: '.pdf',
        mimeType: 'application/pdf',
        name: 'PDF'
    },
    JSON: {
        extension: '.json',
        mimeType: 'application/json',
        name: 'JSON'
    }
};

// UI constants
export const UI = {
    // Animation durations (ms)
    ANIMATION: {
        FAST: 200,
        NORMAL: 300,
        SLOW: 500
    },
    
    // Toast notification durations (ms)
    TOAST_DURATION: {
        SUCCESS: 3000,
        INFO: 4000,
        WARNING: 5000,
        ERROR: 6000
    },
    
    // Debounce delays (ms)
    DEBOUNCE: {
        SEARCH: 300,
        RESIZE: 150,
        INPUT: 500
    }
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'expertzy_user_preferences',
    LAST_CONFIGURATION: 'expertzy_last_config',
    PROCESSING_HISTORY: 'expertzy_processing_history',
    CACHE_VERSION: 'expertzy_cache_version'
};

// Error messages
export const ERROR_MESSAGES = {
    FILE_NOT_SELECTED: 'Nenhum arquivo selecionado',
    INVALID_FILE_TYPE: 'Tipo de arquivo inválido. Apenas arquivos XML são aceitos',
    FILE_TOO_LARGE: 'Arquivo muito grande. Tamanho máximo: 10MB',
    FILE_EMPTY: 'Arquivo está vazio',
    XML_PARSE_ERROR: 'Erro ao processar arquivo XML',
    DI_STRUCTURE_INVALID: 'Estrutura da DI inválida',
    CALCULATION_ERROR: 'Erro nos cálculos de custo',
    VALIDATION_FAILED: 'Falha na validação dos dados',
    EXPORT_ERROR: 'Erro ao exportar dados',
    NETWORK_ERROR: 'Erro de conexão',
    UNKNOWN_ERROR: 'Erro desconhecido'
};

// Success messages
export const SUCCESS_MESSAGES = {
    FILE_LOADED: 'Arquivo carregado com sucesso',
    PARSING_COMPLETE: 'Análise do XML concluída',
    CALCULATIONS_COMPLETE: 'Cálculos realizados com sucesso',
    VALIDATION_PASSED: 'Validação concluída sem erros',
    EXPORT_SUCCESS: 'Dados exportados com sucesso',
    CONFIG_SAVED: 'Configuração salva'
};

// App metadata
export const APP_INFO = {
    NAME: 'Sistema de Importação DI',
    VERSION: '1.0.0',
    AUTHOR: 'Expertzy Inteligência Tributária',
    COPYRIGHT: '© 2025 Expertzy Inteligência Tributária',
    DESCRIPTION: 'Sistema de cálculo de custos de importação a partir de XML da DI'
};

// Development flags
export const DEV_FLAGS = {
    DEBUG_MODE: false,
    VERBOSE_LOGGING: false,
    MOCK_DATA: false,
    SKIP_VALIDATION: false
};