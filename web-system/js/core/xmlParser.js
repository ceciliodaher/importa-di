/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
XML Parser - Parser para XML da DI (Declaração de Importação)
*/

import { DI_XML_PATHS, VALIDATION, ERROR_MESSAGES } from '../utils/constants.js';
import { parseNumericField, extrairCodigoProduto, extrairUnidadesPorCaixa, logError } from '../utils/helpers.js';

export class DIXMLParser {
    constructor() {
        this.parser = new DOMParser();
        this.xmlDoc = null;
        this.rootElement = null;
    }
    
    /**
     * Parses XML content and extracts DI data
     * @param {string} xmlContent - XML content as string
     * @returns {Promise<object>} Parsed DI data
     */
    async parseXML(xmlContent) {
        try {
            // Parse XML
            this.xmlDoc = this.parser.parseFromString(xmlContent, 'text/xml');
            
            // Check for parsing errors
            const parserError = this.xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error(`XML Parse Error: ${parserError.textContent}`);
            }
            
            // Find DI root element
            this.rootElement = this.xmlDoc.querySelector(DI_XML_PATHS.ROOT);
            if (!this.rootElement) {
                throw new Error('Elemento declaracaoImportacao não encontrado no XML');
            }
            
            // Extract all data
            const diData = await this.extractDIData();
            
            // Validate extracted data
            this.validateDIData(diData);
            
            return diData;
            
        } catch (error) {
            logError('XMLParser.parseXML', error, { xmlLength: xmlContent?.length });
            throw new Error(`${ERROR_MESSAGES.XML_PARSE_ERROR}: ${error.message}`);
        }
    }
    
    /**
     * Extracts complete DI data structure
     * @returns {Promise<object>} Complete DI data
     */
    async extractDIData() {
        const data = {
            cabecalho: this.extractCabecalho(),
            importador: this.extractImportador(),
            carga: this.extractCarga(),
            valores: this.extractValores(),
            adicoes: await this.extractAdicoes(),
            tributos: {},
            informacaoComplementar: this.getTextContent('informacaoComplementar') || '—'
        };
        
        // Calculate total taxes from additions
        data.tributos = this.calculateTotalTaxes(data.adicoes);
        
        return data;
    }
    
    /**
     * Extracts header information
     * @returns {object} Header data
     */
    extractCabecalho() {
        return {
            DI: this.getTextContent(DI_XML_PATHS.NUMERO_DI) || 'N/A',
            'Data registro': this.getTextContent(DI_XML_PATHS.DATA_REGISTRO) || 'N/A',
            'URF despacho': this.getTextContent(DI_XML_PATHS.URF_DESPACHO) || 'N/A',
            'Modalidade': this.getTextContent(DI_XML_PATHS.MODALIDADE) || 'N/A',
            'Qtd. adições': parseInt(this.getTextContent(DI_XML_PATHS.TOTAL_ADICOES) || '0'),
            'Situação': this.getTextContent(DI_XML_PATHS.SITUACAO) || 'N/A'
        };
    }
    
    /**
     * Extracts importer information
     * @returns {object} Importer data
     */
    extractImportador() {
        const endereco = this.buildAddress();
        
        return {
            CNPJ: this.getTextContent(DI_XML_PATHS.IMPORTADOR_CNPJ) || 'N/A',
            Nome: this.getTextContent(DI_XML_PATHS.IMPORTADOR_NOME) || 'N/A',
            Representante: this.getTextContent(DI_XML_PATHS.IMPORTADOR_REPRESENTANTE) || 'N/A',
            'CPF repr.': this.getTextContent(DI_XML_PATHS.IMPORTADOR_CPF_REPR) || 'N/A',
            Endereço: endereco || 'N/A'
        };
    }
    
    /**
     * Builds complete address string
     * @returns {string} Complete address
     */
    buildAddress() {
        const addressParts = [
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.LOGRADOURO),
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.NUMERO),
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.BAIRRO),
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.MUNICIPIO),
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.UF),
            this.getTextContent(DI_XML_PATHS.IMPORTADOR_ENDERECO.CEP)
        ].filter(part => part && part.trim() !== '');
        
        return addressParts.join(', ');
    }
    
    /**
     * Extracts cargo information
     * @returns {object} Cargo data
     */
    extractCarga() {
        const manifestoNome = this.getTextContent(DI_XML_PATHS.MANIFESTO_NOME) || 'N/A';
        const manifestoNumero = this.getTextContent(DI_XML_PATHS.MANIFESTO_NUMERO) || '';
        
        return {
            Manifesto: `${manifestoNome} ${manifestoNumero}`.trim(),
            Recinto: this.getTextContent(DI_XML_PATHS.RECINTO) || 'N/A',
            Armazém: (this.getTextContent(DI_XML_PATHS.ARMAZEM) || '').trim() || 'N/A',
            'Peso bruto (kg)': parseNumericField(this.getTextContent(DI_XML_PATHS.PESO_BRUTO) || '0', 1000),
            'Peso líquido (kg)': parseNumericField(this.getTextContent(DI_XML_PATHS.PESO_LIQUIDO) || '0', 1000)
        };
    }
    
    /**
     * Extracts values information
     * @returns {object} Values data
     */
    extractValores() {
        return {
            'FOB USD': parseNumericField(this.getTextContent(DI_XML_PATHS.FOB_USD) || '0'),
            'FOB R$': parseNumericField(this.getTextContent(DI_XML_PATHS.FOB_BRL) || '0'),
            'Frete USD': parseNumericField(this.getTextContent(DI_XML_PATHS.FRETE_USD) || '0'),
            'Frete R$': parseNumericField(this.getTextContent(DI_XML_PATHS.FRETE_BRL) || '0'),
            'Seguro R$': parseNumericField(this.getTextContent(DI_XML_PATHS.SEGURO_BRL) || '0'),
            'AFRMM R$': parseNumericField(this.getTextContent(DI_XML_PATHS.AFRMM) || '0'),
            'Siscomex R$': parseNumericField(this.getTextContent(DI_XML_PATHS.SISCOMEX) || '0'),
            'Valor Aduaneiro R$': parseNumericField(this.getTextContent(DI_XML_PATHS.VALOR_ADUANEIRO) || '0')
        };
    }
    
    /**
     * Extracts all additions
     * @returns {Promise<Array>} Array of additions
     */
    async extractAdicoes() {
        const adicoes = [];
        const adicaoElements = this.rootElement.querySelectorAll(DI_XML_PATHS.ADICAO);
        
        for (const adicaoElement of adicaoElements) {
            const adicao = await this.extractAdicao(adicaoElement);
            adicoes.push(adicao);
        }
        
        return adicoes;
    }
    
    /**
     * Extracts single addition data
     * @param {Element} adicaoElement - Addition XML element
     * @returns {Promise<object>} Addition data
     */
    async extractAdicao(adicaoElement) {
        return {
            numero: this.getElementText(adicaoElement, DI_XML_PATHS.NUMERO_ADICAO) || 'N/A',
            numeroLI: this.getElementText(adicaoElement, DI_XML_PATHS.NUMERO_LI) || 'N/A',
            dadosGerais: this.extractDadosGerais(adicaoElement),
            partes: this.extractPartes(adicaoElement),
            tributos: this.extractTributos(adicaoElement),
            itens: await this.extractItens(adicaoElement)
        };
    }
    
    /**
     * Extracts general data from addition
     * @param {Element} adicaoElement - Addition XML element
     * @returns {object} General data
     */
    extractDadosGerais(adicaoElement) {
        return {
            NCM: this.getElementText(adicaoElement, DI_XML_PATHS.NCM) || 'N/A',
            NBM: this.getElementText(adicaoElement, DI_XML_PATHS.NCM) || 'N/A',
            'Descrição NCM': this.getElementText(adicaoElement, DI_XML_PATHS.DESCRICAO_NCM) || 'N/A',
            'VCMV USD': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.VCMV_USD) || '0'),
            'VCMV R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.VCMV_BRL) || '0'),
            INCOTERM: this.getElementText(adicaoElement, DI_XML_PATHS.INCOTERM) || 'N/A',
            Local: this.getElementText(adicaoElement, DI_XML_PATHS.LOCAL_CONDICAO) || 'N/A',
            Moeda: this.getElementText(adicaoElement, DI_XML_PATHS.MOEDA) || 'N/A',
            'Peso líq. (kg)': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.PESO_LIQUIDO_ADICAO) || '0', 1000),
            Quantidade: parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.QUANTIDADE_ESTATISTICA) || '0', 1000),
            Unidade: (this.getElementText(adicaoElement, DI_XML_PATHS.UNIDADE_ESTATISTICA) || '').trim() || 'N/A'
        };
    }
    
    /**
     * Extracts parties information from addition
     * @param {Element} adicaoElement - Addition XML element
     * @returns {object} Parties data
     */
    extractPartes(adicaoElement) {
        return {
            Exportador: this.getElementText(adicaoElement, DI_XML_PATHS.EXPORTADOR) || 'N/A',
            'País Aquisição': this.getElementText(adicaoElement, DI_XML_PATHS.PAIS_AQUISICAO) || 'N/A',
            Fabricante: this.getElementText(adicaoElement, DI_XML_PATHS.FABRICANTE) || 'N/A',
            'País Origem': this.getElementText(adicaoElement, DI_XML_PATHS.PAIS_ORIGEM) || 'N/A'
        };
    }
    
    /**
     * Extracts tax information from addition
     * @param {Element} adicaoElement - Addition XML element
     * @returns {object} Tax data
     */
    extractTributos(adicaoElement) {
        return {
            'II Alíq. (%)': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.II_ALIQUOTA) || '0', 10000),
            'II Regime': this.getElementText(adicaoElement, DI_XML_PATHS.II_REGIME) || 'N/A',
            'II R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.II_VALOR) || '0'),
            'IPI Alíq. (%)': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.IPI_ALIQUOTA) || '0', 10000),
            'IPI Regime': this.getElementText(adicaoElement, DI_XML_PATHS.IPI_REGIME) || 'N/A',
            'IPI R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.IPI_VALOR) || '0'),
            'PIS Alíq. (%)': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.PIS_ALIQUOTA) || '0', 10000),
            'PIS R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.PIS_VALOR) || '0'),
            'COFINS Alíq. (%)': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.COFINS_ALIQUOTA) || '0', 10000),
            'COFINS R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.COFINS_VALOR) || '0'),
            'Base PIS/COFINS R$': parseNumericField(this.getElementText(adicaoElement, DI_XML_PATHS.PIS_COFINS_BASE) || '0'),
            'Regime PIS/COFINS': this.getElementText(adicaoElement, DI_XML_PATHS.PIS_COFINS_REGIME) || 'N/A'
        };
    }
    
    /**
     * Extracts items from addition
     * @param {Element} adicaoElement - Addition XML element
     * @returns {Promise<Array>} Array of items
     */
    async extractItens(adicaoElement) {
        const itens = [];
        const mercadoriaElements = adicaoElement.querySelectorAll(DI_XML_PATHS.MERCADORIA);
        
        for (const mercadoriaElement of mercadoriaElements) {
            const item = this.extractItem(mercadoriaElement);
            itens.push(item);
        }
        
        return itens;
    }
    
    /**
     * Extracts single item data
     * @param {Element} mercadoriaElement - Item XML element
     * @returns {object} Item data
     */
    extractItem(mercadoriaElement) {
        const descricao = (this.getElementText(mercadoriaElement, DI_XML_PATHS.ITEM_DESCRICAO) || '').trim();
        const qtd = parseNumericField(this.getElementText(mercadoriaElement, DI_XML_PATHS.ITEM_QUANTIDADE) || '0', 100000);
        const valorUnit = parseNumericField(this.getElementText(mercadoriaElement, DI_XML_PATHS.ITEM_VALOR_UNITARIO) || '0', 10000000);
        
        return {
            Seq: this.getElementText(mercadoriaElement, DI_XML_PATHS.ITEM_SEQUENCIA) || 'N/A',
            Código: extrairCodigoProduto(descricao),
            Descrição: descricao || 'N/A',
            Qtd: qtd,
            Unidade: (this.getElementText(mercadoriaElement, DI_XML_PATHS.ITEM_UNIDADE) || '').trim() || 'N/A',
            'Valor Unit. USD': valorUnit,
            'Unid/Caixa': extrairUnidadesPorCaixa(descricao),
            'Valor Total USD': qtd * valorUnit
        };
    }
    
    /**
     * Calculates total taxes from all additions
     * @param {Array} adicoes - Array of additions
     * @returns {object} Total taxes
     */
    calculateTotalTaxes(adicoes) {
        const totals = {
            'II R$': 0,
            'IPI R$': 0,
            'PIS R$': 0,
            'COFINS R$': 0
        };
        
        for (const adicao of adicoes) {
            totals['II R$'] += adicao.tributos['II R$'] || 0;
            totals['IPI R$'] += adicao.tributos['IPI R$'] || 0;
            totals['PIS R$'] += adicao.tributos['PIS R$'] || 0;
            totals['COFINS R$'] += adicao.tributos['COFINS R$'] || 0;
        }
        
        return totals;
    }
    
    /**
     * Validates extracted DI data
     * @param {object} diData - DI data to validate
     * @throws {Error} If validation fails
     */
    validateDIData(diData) {
        const errors = [];
        
        // Check required fields
        if (!diData.cabecalho.DI || diData.cabecalho.DI === 'N/A') {
            errors.push('Número da DI não encontrado');
        }
        
        if (!diData.importador.CNPJ || diData.importador.CNPJ === 'N/A') {
            errors.push('CNPJ do importador não encontrado');
        }
        
        if (!diData.adicoes || diData.adicoes.length === 0) {
            errors.push('Nenhuma adição encontrada na DI');
        }
        
        // Validate additions
        if (diData.adicoes) {
            diData.adicoes.forEach((adicao, index) => {
                if (!adicao.dadosGerais.NCM || adicao.dadosGerais.NCM === 'N/A') {
                    errors.push(`NCM não encontrado na adição ${index + 1}`);
                }
                
                if (!adicao.dadosGerais['VCMV R$'] || adicao.dadosGerais['VCMV R$'] <= 0) {
                    errors.push(`VCMV inválido na adição ${index + 1}`);
                }
            });
        }
        
        if (errors.length > 0) {
            throw new Error(`${ERROR_MESSAGES.DI_STRUCTURE_INVALID}:\n${errors.join('\n')}`);
        }
    }
    
    /**
     * Gets text content from root element
     * @param {string} path - Element path
     * @returns {string|null} Text content
     */
    getTextContent(path) {
        return this.getElementText(this.rootElement, path);
    }
    
    /**
     * Gets text content from specific element
     * @param {Element} element - Parent element
     * @param {string} path - Element path
     * @returns {string|null} Text content
     */
    getElementText(element, path) {
        if (!element || !path) return null;
        
        const targetElement = element.querySelector(path);
        return targetElement ? targetElement.textContent : null;
    }
    
    /**
     * Detects INCOTERM from DI data
     * @param {object} diData - DI data
     * @returns {string|null} Detected INCOTERM
     */
    detectINCOTERM(diData) {
        if (!diData.adicoes || diData.adicoes.length === 0) {
            return null;
        }
        
        // Check first addition for INCOTERM
        const primeiraAdicao = diData.adicoes[0];
        const incoterm = primeiraAdicao.dadosGerais.INCOTERM;
        
        if (incoterm && incoterm !== 'N/A') {
            return incoterm.toUpperCase();
        }
        
        return null;
    }
    
    /**
     * Gets processing statistics
     * @param {object} diData - DI data
     * @returns {object} Processing statistics
     */
    getProcessingStats(diData) {
        const totalAdicoes = diData.adicoes ? diData.adicoes.length : 0;
        const totalItens = diData.adicoes ? 
            diData.adicoes.reduce((sum, adicao) => sum + (adicao.itens ? adicao.itens.length : 0), 0) : 0;
        
        return {
            totalAdicoes,
            totalItens,
            temTributos: diData.tributos && Object.keys(diData.tributos).length > 0,
            incotermDetectado: this.detectINCOTERM(diData)
        };
    }
}