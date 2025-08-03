/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Sistema de Importação DI - Versão Completa com Engine de Cálculo
*/

// =============================================================================
// CONSTANTS
// =============================================================================
const CONSTANTS = {
    INCOTERMS: {
        FOB: { code: 'FOB', name: 'Free On Board', freteEmbutido: false, seguroEmbutido: false, description: 'Frete e seguro separados do VCMV' },
        CFR: { code: 'CFR', name: 'Cost and Freight', freteEmbutido: true, seguroEmbutido: false, description: 'Frete embutido no VCMV, seguro separado' },
        CIF: { code: 'CIF', name: 'Cost, Insurance and Freight', freteEmbutido: true, seguroEmbutido: true, description: 'Frete e seguro embutidos no VCMV' },
        EXW: { code: 'EXW', name: 'Ex Works', freteEmbutido: false, seguroEmbutido: false, description: 'Frete e seguro separados do VCMV' }
    },

    CFOP_OPTIONS: {
        '3101': 'Compra para industrialização',
        '3102': 'Compra para comercialização', 
        '3126': 'Compra para utilização na prestação de serviço',
        '3127': 'Compra para ativo imobilizado',
        '3128': 'Compra para consumo',
        '3129': 'Compra para material de uso ou consumo',
        '3132': 'Aquisição de serviço de transporte',
        '3251': 'Compra de energia elétrica para distribuição ou comercialização',
        '3301': 'Aquisição de serviço de comunicação'
    },

    ICMS_ALIQUOTAS_UF: {
        'AC': 19, 'AL': 20, 'AP': 18, 'AM': 20, 'BA': 20.5, 'CE': 20, 'DF': 20, 'ES': 17,
        'GO': 19, 'MA': 23, 'MT': 17, 'MS': 17, 'MG': 18, 'PA': 19, 'PB': 20, 'PR': 19.5,
        'PE': 20.5, 'PI': 22.5, 'RJ': 22, 'RN': 20, 'RS': 17, 'RO': 19.5, 'RR': 20,
        'SC': 17, 'SP': 18, 'SE': 20, 'TO': 20
    },

    DI_XML_PATHS: {
        ROOT: 'declaracaoImportacao', ADICAO: 'adicao', MERCADORIA: 'mercadoria',
        NUMERO_DI: 'numeroDI', DATA_REGISTRO: 'dataRegistro', URF_DESPACHO: 'urfDespachoNome',
        MODALIDADE: 'modalidadeDespachoNome', TOTAL_ADICOES: 'totalAdicoes', SITUACAO: 'situacaoEntregaCarga',
        IMPORTADOR_CNPJ: 'importadorNumero', IMPORTADOR_NOME: 'importadorNome',
        IMPORTADOR_REPRESENTANTE: 'importadorNomeRepresentanteLegal', IMPORTADOR_CPF_REPR: 'importadorCpfRepresentanteLegal',
        IMPORTADOR_ENDERECO: {
            LOGRADOURO: 'importadorEnderecoLogradouro', NUMERO: 'importadorEnderecoNumero',
            BAIRRO: 'importadorEnderecoBairro', MUNICIPIO: 'importadorEnderecoMunicipio',
            UF: 'importadorEnderecoUf', CEP: 'importadorEnderecoCep'
        },
        MANIFESTO_NOME: 'documentoChegadaCargaNome', MANIFESTO_NUMERO: 'documentoChegadaCargaNumero',
        RECINTO: 'armazenamentoRecintoAduaneiroNome', ARMAZEM: 'armazem',
        PESO_BRUTO: 'cargaPesoBruto', PESO_LIQUIDO: 'cargaPesoLiquido',
        FOB_USD: 'localEmbarqueTotalDolares', FOB_BRL: 'localEmbarqueTotalReais',
        FRETE_USD: 'freteTotalDolares', FRETE_BRL: 'freteTotalReais',
        SEGURO_BRL: 'seguroTotalReais', AFRMM: 'afrmm', SISCOMEX: 'taxaSiscomex',
        VALOR_ADUANEIRO: 'localDescargaTotalReais',
        NUMERO_ADICAO: 'numeroAdicao', NUMERO_LI: 'numeroLI', NCM: 'dadosMercadoriaCodigoNcm',
        DESCRICAO_NCM: 'dadosMercadoriaNomeNcm', VCMV_USD: 'condicaoVendaValorMoeda',
        VCMV_BRL: 'condicaoVendaValorReais', INCOTERM: 'condicaoVendaIncoterm',
        LOCAL_CONDICAO: 'condicaoVendaLocal', MOEDA: 'condicaoVendaMoedaNome',
        PESO_LIQUIDO_ADICAO: 'dadosMercadoriaPesoLiquido',
        QUANTIDADE_ESTATISTICA: 'dadosMercadoriaMedidaEstatisticaQuantidade',
        UNIDADE_ESTATISTICA: 'dadosMercadoriaMedidaEstatisticaUnidade',
        EXPORTADOR: 'fornecedorNome', PAIS_AQUISICAO: 'paisAquisicaoMercadoriaNome',
        FABRICANTE: 'fabricanteNome', PAIS_ORIGEM: 'paisOrigemMercadoriaNome',
        II_ALIQUOTA: 'iiAliquotaAdValorem', II_REGIME: 'iiRegimeTributacaoNome', II_VALOR: 'iiAliquotaValorRecolher',
        IPI_ALIQUOTA: 'ipiAliquotaAdValorem', IPI_REGIME: 'ipiRegimeTributacaoNome', IPI_VALOR: 'ipiAliquotaValorRecolher',
        PIS_ALIQUOTA: 'pisPasepAliquotaAdValorem', PIS_VALOR: 'pisPasepAliquotaValorRecolher',
        COFINS_ALIQUOTA: 'cofinsAliquotaAdValorem', COFINS_VALOR: 'cofinsAliquotaValorRecolher',
        PIS_COFINS_BASE: 'pisCofinsBaseCalculoValor', PIS_COFINS_REGIME: 'pisCofinsRegimeTributacaoNome',
        ITEM_SEQUENCIA: 'numeroSequencialItem', ITEM_DESCRICAO: 'descricaoMercadoria',
        ITEM_QUANTIDADE: 'quantidade', ITEM_UNIDADE: 'unidadeMedida', ITEM_VALOR_UNITARIO: 'valorUnitario'
    },

    ERROR_MESSAGES: {
        XML_PARSE_ERROR: 'Erro ao processar arquivo XML',
        DI_STRUCTURE_INVALID: 'Estrutura da DI inválida',
        CALCULATION_ERROR: 'Erro nos cálculos de custo'
    },

    SUCCESS_MESSAGES: {
        CALCULATIONS_COMPLETE: 'Cálculos realizados com sucesso',
        VALIDATION_PASSED: 'Validação concluída sem erros'
    }
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================
const Utils = {
    showToast: function(message, type, duration) {
        type = type || 'info'; duration = duration || 5000;
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" aria-label="Fechar">&times;</button>
            </div>
        `;
        
        toast.querySelector('.toast-close').addEventListener('click', function() {
            Utils.removeToast(toast);
        });
        
        toastContainer.appendChild(toast);
        setTimeout(function() { Utils.removeToast(toast); }, duration);
    },

    removeToast: function(toast) {
        if (toast && toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(function() {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }
    },

    formatCurrency: function(value) {
        if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(value);
    },

    formatNumber: function(value, decimals) {
        decimals = decimals || 2;
        if (typeof value !== 'number' || isNaN(value)) return '0';
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals, maximumFractionDigits: decimals
        }).format(value);
    },

    parseNumericField: function(value, divisor) {
        divisor = divisor || 100;
        if (!value) return 0.0;
        try {
            const cleanValue = value.toString().replace(/^0+/, '') || '0';
            return parseFloat(cleanValue) / divisor;
        } catch (error) {
            console.warn('Error parsing numeric field:', value, error);
            return 0.0;
        }
    },

    extrairCodigoProduto: function(descricao) {
        if (!descricao) return "N/A";
        const parts = descricao.split(" - ");
        return parts.length >= 2 ? parts[0].trim() : "N/A";
    },

    extrairUnidadesPorCaixa: function(descricao) {
        if (!descricao || !descricao.includes("EM CX COM")) return "N/A";
        try {
            const parte = descricao.split("EM CX COM")[1].split("UNIDADES")[0].trim();
            const unidades = parseInt(parte);
            return isNaN(unidades) ? "N/A" : unidades;
        } catch (error) {
            return "N/A";
        }
    },

    toggleElementVisibility: function(element, show) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) return;
        
        if (show) {
            el.classList.remove('expertzy-hidden');
            el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
            el.offsetHeight; // trigger reflow
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '1'; el.style.transform = 'translateY(0)';
        } else {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity = '0'; el.style.transform = 'translateY(-20px)';
            setTimeout(function() {
                el.classList.add('expertzy-hidden');
                el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
            }, 300);
        }
    },

    downloadFile: function(content, filename, mimeType) {
        mimeType = mimeType || 'text/plain';
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = filename; link.style.display = 'none';
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
        setTimeout(function() { URL.revokeObjectURL(url); }, 100);
    }
};

// =============================================================================
// COST CALCULATION ENGINE (replica do Python)
// =============================================================================
const CostCalculator = {
    calcularCustosUnitarios: function(dados, freteEmbutido, seguroEmbutido) {
        freteEmbutido = freteEmbutido || false;
        seguroEmbutido = seguroEmbutido || false;

        // Extrair totais da DI
        const valorTotalDI = dados.valores["FOB R$"];
        const freteTotal = freteEmbutido ? 0.0 : (dados.valores["Frete R$"] || 0.0);
        const seguroTotal = seguroEmbutido ? 0.0 : (dados.valores["Seguro R$"] || 0.0);
        const afrmmTotal = dados.valores["AFRMM R$"] || 0.0;
        const siscomexTotal = dados.valores["Siscomex R$"] || 0.0;
        const outrosCustosTotal = dados.valores["Outros Custos R$"] || 0.0;

        // Base de cálculo
        const valorBaseCalculo = (freteEmbutido || seguroEmbutido) ? 
            dados.valores["Valor Aduaneiro R$"] : valorTotalDI;

        // Configuração de custos
        dados.configuracaoCustos = {
            "Frete Embutido": freteEmbutido ? "Sim" : "Não",
            "Seguro Embutido": seguroEmbutido ? "Sim" : "Não",
            "Base de Cálculo": (freteEmbutido || seguroEmbutido) ? "Valor Aduaneiro" : "FOB",
            "Valor Base R$": valorBaseCalculo,
            "Frete Considerado R$": freteTotal,
            "Seguro Considerado R$": seguroTotal,
            "AFRMM R$": afrmmTotal,
            "Siscomex R$": siscomexTotal,
            "Outros Custos R$": outrosCustosTotal
        };

        // Processar cada adição
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            const valorAdicao = adicao.dadosGerais["VCMV R$"];

            // Percentual da adição
            const percentualAdicao = valorBaseCalculo > 0 ? valorAdicao / valorBaseCalculo : 0;

            // Ratear custos proporcionais
            const custoFreteAdicao = percentualAdicao * freteTotal;
            const custoSeguroAdicao = percentualAdicao * seguroTotal;
            const custoAfrmmAdicao = percentualAdicao * afrmmTotal;
            const custoSiscomexAdicao = percentualAdicao * siscomexTotal;
            const custoOutrosAdicao = percentualAdicao * outrosCustosTotal;

            // Impostos incorporáveis
            const iiAdicao = adicao.tributos["II R$"];

            // Custo total da adição
            const custoTotalAdicao = valorAdicao + custoFreteAdicao + custoSeguroAdicao + 
                                   custoAfrmmAdicao + custoSiscomexAdicao + custoOutrosAdicao + iiAdicao;

            // Adicionar dados de custo à adição
            adicao.custos = {
                "Valor Mercadoria R$": valorAdicao,
                "Frete Rateado R$": custoFreteAdicao,
                "Seguro Rateado R$": custoSeguroAdicao,
                "AFRMM Rateado R$": custoAfrmmAdicao,
                "Siscomex Rateado R$": custoSiscomexAdicao,
                "Outros Custos Rateado R$": custoOutrosAdicao,
                "II Incorporado R$": iiAdicao,
                "Custo Total Adição R$": custoTotalAdicao,
                "% Participação": percentualAdicao * 100,
                "Observações": `Base: ${(freteEmbutido || seguroEmbutido) ? 'Valor Aduaneiro' : 'FOB'}`
            };

            // Calcular custo unitário para cada item
            if (adicao.itens && adicao.itens.length > 0) {
                let qtdTotalAdicao = 0;
                for (let j = 0; j < adicao.itens.length; j++) {
                    qtdTotalAdicao += adicao.itens[j].Qtd;
                }

                for (let j = 0; j < adicao.itens.length; j++) {
                    const item = adicao.itens[j];
                    
                    if (qtdTotalAdicao > 0) {
                        const proporcaoItem = item.Qtd / qtdTotalAdicao;
                        const custoUnitarioItem = custoTotalAdicao * proporcaoItem;
                        const custoPorUnidade = item.Qtd > 0 ? custoUnitarioItem / item.Qtd : 0;

                        item["Custo Total Item R$"] = custoUnitarioItem;
                        item["Custo Unitário R$"] = custoPorUnidade;

                        const unidCaixa = item["Unid/Caixa"];
                        if (typeof unidCaixa === 'number' && unidCaixa > 0) {
                            const custoPorPeca = custoUnitarioItem / (item.Qtd * unidCaixa);
                            item["Custo por Peça R$"] = custoPorPeca;
                        } else {
                            item["Custo por Peça R$"] = "N/A";
                        }
                    } else {
                        item["Custo Total Item R$"] = 0;
                        item["Custo Unitário R$"] = 0;
                        item["Custo por Peça R$"] = 0;
                    }
                }
            }
        }

        // Calcular ICMS para cada adição e agregar tributos DI
        dados.tributos = {
            'II R$': 0,
            'IPI R$': 0,
            'PIS R$': 0,
            'COFINS R$': 0,
            'ICMS R$': 0,
            'Base ICMS R$': 0
        };

        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            const valorAdicao = adicao.dadosGerais["VCMV R$"];

            // Percentual da adição
            const percentualAdicao = valorBaseCalculo > 0 ? valorAdicao / valorBaseCalculo : 0;

            // Ratear custos proporcionais
            const custoFreteAdicao = percentualAdicao * freteTotal;
            const custoSeguroAdicao = percentualAdicao * seguroTotal;
            const custoAfrmmAdicao = percentualAdicao * afrmmTotal;
            const custoSiscomexAdicao = percentualAdicao * siscomexTotal;
            const custoOutrosAdicao = percentualAdicao * outrosCustosTotal;

            // Impostos incorporáveis
            const iiAdicao = adicao.tributos["II R$"];

            // Custo total da adição
            const custoTotalAdicao = valorAdicao + custoFreteAdicao + custoSeguroAdicao + 
                                   custoAfrmmAdicao + custoSiscomexAdicao + custoOutrosAdicao + iiAdicao;

            // Adicionar dados de custo à adição
            adicao.custos = {
                "Valor Mercadoria R$": valorAdicao,
                "Frete Rateado R$": custoFreteAdicao,
                "Seguro Rateado R$": custoSeguroAdicao,
                "AFRMM Rateado R$": custoAfrmmAdicao,
                "Siscomex Rateado R$": custoSiscomexAdicao,
                "Outros Custos Rateado R$": custoOutrosAdicao,
                "II Incorporado R$": iiAdicao,
                "Custo Total Adição R$": custoTotalAdicao,
                "% Participação": percentualAdicao * 100,
                "Observações": `Base: ${(freteEmbutido || seguroEmbutido) ? 'Valor Aduaneiro' : 'FOB'}`
            };

            // Agora calcular ICMS com todos os custos definidos
            const aliquotaICMS = adicao.dadosGerais.ICMS_ALIQUOTA || 19;
            const valorAduaneiro = adicao.dadosGerais["VCMV R$"] || 0;
            const ii = adicao.tributos["II R$"] || 0;
            const ipi = adicao.tributos["IPI R$"] || 0;
            const pis = adicao.tributos["PIS R$"] || 0;
            const cofins = adicao.tributos["COFINS R$"] || 0;
            
            // Incluir outros custos aduaneiros no cálculo do ICMS
            const outrasDesp = custoAfrmmAdicao + custoSiscomexAdicao + custoOutrosAdicao;
            
            // Usar ICMS calculation method
            const resultadoICMS = this.calcularICMSPorDentro(
                valorAduaneiro, ii, ipi, pis, cofins, outrasDesp, aliquotaICMS / 100
            );
            
            // Adicionar ICMS aos tributos da adição
            adicao.tributos['ICMS R$'] = resultadoICMS.icms;
            adicao.tributos['Base ICMS R$'] = resultadoICMS.base;
            adicao.tributos['ICMS Alíq. (%)'] = aliquotaICMS;
            
            // Calcular base IPI (Valor Aduaneiro + II)
            const baseIPI = valorAduaneiro + ii;
            adicao.tributos['Base IPI R$'] = Math.round(baseIPI * 100) / 100;

            // Processar itens da adição
            if (adicao.itens) {
                for (let j = 0; j < adicao.itens.length; j++) {
                    const item = adicao.itens[j];
                    const qtdItem = item.Qtd || 0;
                    const valorTotalItens = adicao.itens.reduce(function(sum, it) {
                        return sum + (it.Qtd || 0);
                    }, 0);

                    if (qtdItem > 0 && valorTotalItens > 0) {
                        const percentualItem = qtdItem / valorTotalItens;
                        const custoUnitarioItem = custoTotalAdicao * percentualItem / qtdItem;
                        
                        item["Custo Total Item R$"] = custoTotalAdicao * percentualItem;
                        item["Custo Unitário R$"] = custoUnitarioItem;

                        const unidCaixa = item["Unid/Caixa"];
                        if (typeof unidCaixa === 'number' && unidCaixa > 0) {
                            const custoPorPeca = custoUnitarioItem / (item.Qtd * unidCaixa);
                            item["Custo por Peça R$"] = custoPorPeca;
                        } else {
                            item["Custo por Peça R$"] = "N/A";
                        }
                    } else {
                        item["Custo Total Item R$"] = 0;
                        item["Custo Unitário R$"] = 0;
                        item["Custo por Peça R$"] = 0;
                    }
                }
            }
            
            // Agregar aos tributos da DI
            dados.tributos['II R$'] += ii;
            dados.tributos['IPI R$'] += ipi;
            dados.tributos['PIS R$'] += pis;
            dados.tributos['COFINS R$'] += cofins;
            dados.tributos['ICMS R$'] += resultadoICMS.icms;
            dados.tributos['Base ICMS R$'] += resultadoICMS.base;
        }

        return dados;
    },

    gerarMemoriaCalculos: function(dados) {
        const memoria = [];
        
        // Cabeçalho da memória de cálculo
        memoria.push(['=== MEMÓRIA DE CÁLCULO DETALHADA - IMPORTAÇÃO ===']);
        memoria.push([`DI: ${dados.cabecalho.DI}`]);
        memoria.push([`Data: ${new Date().toLocaleDateString('pt-BR')}`]);
        memoria.push(['']);
        
        // Resumo Geral
        memoria.push(['RESUMO GERAL DA DI']);
        memoria.push(['Valor FOB R$:', dados.valores['FOB R$'] || 0]);
        memoria.push(['Valor Aduaneiro R$:', dados.valores['Valor Aduaneiro R$'] || 0]);
        memoria.push(['Frete R$:', dados.valores['Frete R$'] || 0]);
        memoria.push(['Seguro R$:', dados.valores['Seguro R$'] || 0]);
        memoria.push(['']);
        
        // Tributos Totais da DI
        memoria.push(['TRIBUTOS TOTAIS DA DI']);
        memoria.push(['II R$:', dados.tributos['II R$'] || 0]);
        memoria.push(['IPI R$:', dados.tributos['IPI R$'] || 0]);
        memoria.push(['PIS R$:', dados.tributos['PIS R$'] || 0]);
        memoria.push(['COFINS R$:', dados.tributos['COFINS R$'] || 0]);
        memoria.push(['Base ICMS R$:', dados.tributos['Base ICMS R$'] || 0]);
        memoria.push(['ICMS R$:', dados.tributos['ICMS R$'] || 0]);
        memoria.push(['']);
        
        // Detalhamento por Adição
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            memoria.push([`=== ADIÇÃO ${adicao.numero} ===`]);
            memoria.push(['NCM:', adicao.dadosGerais.NCM]);
            memoria.push(['Descrição:', adicao.dadosGerais.Descrição]);
            memoria.push(['VCMV R$:', adicao.dadosGerais['VCMV R$']]);
            memoria.push(['']);
            
            // Tributos da Adição
            memoria.push(['TRIBUTOS DA ADIÇÃO']);
            memoria.push(['II Alíq. (%):', `${adicao.tributos['II Alíq. (%)']}%`]);
            memoria.push(['II R$:', adicao.tributos['II R$']]);
            memoria.push(['IPI Alíq. (%):', `${adicao.tributos['IPI Alíq. (%)']}%`]);
            memoria.push(['Base IPI R$:', adicao.tributos['Base IPI R$'] || 0]);
            memoria.push(['IPI R$:', adicao.tributos['IPI R$']]);
            memoria.push(['PIS Alíq. (%):', `${adicao.tributos['PIS Alíq. (%)']}%`]);
            memoria.push(['PIS R$:', adicao.tributos['PIS R$']]);
            memoria.push(['COFINS Alíq. (%):', `${adicao.tributos['COFINS Alíq. (%)']}%`]);
            memoria.push(['COFINS R$:', adicao.tributos['COFINS R$']]);
            memoria.push(['']);
            
            // Cálculo ICMS Detalhado
            memoria.push(['CÁLCULO ICMS - ADIÇÃO ' + adicao.numero]);
            const aliquotaICMS = adicao.dadosGerais.ICMS_ALIQUOTA || 19;
            const valorAduaneiro = adicao.dadosGerais['VCMV R$'] || 0;
            const ii = adicao.tributos['II R$'] || 0;
            const ipi = adicao.tributos['IPI R$'] || 0;
            const pis = adicao.tributos['PIS R$'] || 0;
            const cofins = adicao.tributos['COFINS R$'] || 0;
            
            memoria.push(['Valor Aduaneiro (VDI):', valorAduaneiro]);
            memoria.push(['II:', ii]);
            memoria.push(['IPI:', ipi]);
            memoria.push(['PIS:', pis]);
            memoria.push(['COFINS:', cofins]);
            memoria.push(['Outras Despesas:', 0]);
            
            const somaBase = valorAduaneiro + ii + ipi + pis + cofins;
            memoria.push(['Soma Base (VDI+II+IPI+PIS+COFINS):', somaBase]);
            memoria.push(['Alíquota ICMS (%):', aliquotaICMS]);
            memoria.push(['Alíquota ICMS (decimal):', aliquotaICMS / 100]);
            
            const baseICMS = aliquotaICMS > 0 ? somaBase / (1 - aliquotaICMS / 100) : somaBase;
            const valorICMS = baseICMS * (aliquotaICMS / 100);
            
            memoria.push(['Fórmula: Base ICMS = Soma Base / (1 - alíquota)']);
            memoria.push(['Base ICMS Calculada:', Math.round(baseICMS * 100) / 100]);
            memoria.push(['ICMS Calculado (Base x Alíquota):', Math.round(valorICMS * 100) / 100]);
            memoria.push(['']);
            
            // Memória de Cálculo dos Custos Detalhada
            memoria.push(['MEMÓRIA DE CÁLCULO DOS CUSTOS - ADIÇÃO ' + adicao.numero]);
            if (adicao.custos) {
                memoria.push(['Valor da Mercadoria (VCMV):', adicao.custos['Valor Mercadoria R$'] || 0]);
                memoria.push(['']);
                
                // Custos Rateados
                memoria.push(['CUSTOS RATEADOS PROPORCIONALMENTE:']);
                const percentualAdicao = adicao.custos['% Participação'] || 0;
                memoria.push(['% Participação da Adição:', `${percentualAdicao.toFixed(4)}%`]);
                memoria.push(['']);
                
                memoria.push(['Frete Total da DI R$:', dados.valores['Frete R$'] || 0]);
                memoria.push(['Frete Rateado R$:', adicao.custos['Frete Rateado R$'] || 0]);
                memoria.push(['Cálculo: Frete Total × % Participação']);
                memoria.push(['']);
                
                memoria.push(['Seguro Total da DI R$:', dados.valores['Seguro R$'] || 0]);
                memoria.push(['Seguro Rateado R$:', adicao.custos['Seguro Rateado R$'] || 0]);
                memoria.push(['Cálculo: Seguro Total × % Participação']);
                memoria.push(['']);
                
                memoria.push(['AFRMM Total da DI R$:', dados.valores['AFRMM R$'] || 0]);
                memoria.push(['AFRMM Rateado R$:', adicao.custos['AFRMM Rateado R$'] || 0]);
                memoria.push(['Cálculo: AFRMM Total × % Participação']);
                memoria.push(['']);
                
                memoria.push(['Siscomex Total da DI R$:', dados.valores['Siscomex R$'] || 0]);
                memoria.push(['Siscomex Rateado R$:', adicao.custos['Siscomex Rateado R$'] || 0]);
                memoria.push(['Cálculo: Siscomex Total × % Participação']);
                memoria.push(['']);
                
                if (dados.valores['Outros Custos R$']) {
                    memoria.push(['Outros Custos Total da DI R$:', dados.valores['Outros Custos R$'] || 0]);
                    memoria.push(['Outros Custos Rateado R$:', adicao.custos['Outros Custos Rateado R$'] || 0]);
                    memoria.push(['Cálculo: Outros Custos Total × % Participação']);
                    memoria.push(['']);
                }
                
                memoria.push(['II Incorporado R$:', adicao.custos['II Incorporado R$'] || 0]);
                memoria.push(['']);
                
                // Cálculo do Custo Total
                memoria.push(['CÁLCULO DO CUSTO TOTAL DA ADIÇÃO:']);
                memoria.push(['= Valor Mercadoria + Frete Rateado + Seguro Rateado']);
                memoria.push(['+ AFRMM Rateado + Siscomex Rateado + Outros Custos + II']);
                memoria.push(['Custo Total da Adição R$:', adicao.custos['Custo Total Adição R$'] || 0]);
                memoria.push(['']);
            }
            
            // Itens da Adição
            if (adicao.itens && adicao.itens.length > 0) {
                memoria.push(['ITENS DA ADIÇÃO']);
                memoria.push(['Seq', 'Código', 'Descrição', 'Qtd', 'Custo Unit R$', 'Custo Total R$']);
                
                adicao.itens.forEach(function(item) {
                    memoria.push([
                        item.Seq || '',
                        item.Código || '',
                        item.Descrição || '',
                        item.Qtd || 0,
                        item['Custo Unitário R$'] || 0,
                        item['Custo Total Item R$'] || 0
                    ]);
                });
                memoria.push(['']);
            }
            memoria.push(['']);
        }
        
        return memoria;
    },

    validarCustos: function(dados, freteEmbutido, seguroEmbutido) {
        freteEmbutido = freteEmbutido || false;
        seguroEmbutido = seguroEmbutido || false;

        // Somar custos de todas as adições
        let custoTotalCalculado = 0;
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            if (adicao.custos && adicao.custos["Custo Total Adição R$"]) {
                custoTotalCalculado += adicao.custos["Custo Total Adição R$"];
            }
        }

        // Valor esperado baseado na configuração
        let valorEsperado;
        if (freteEmbutido || seguroEmbutido) {
            valorEsperado = dados.valores["Valor Aduaneiro R$"];
            if (!freteEmbutido) {
                valorEsperado += dados.valores["Frete R$"];
            }
            if (!seguroEmbutido) {
                valorEsperado += dados.valores["Seguro R$"] || 0;
            }
        } else {
            valorEsperado = dados.valores["FOB R$"] + dados.valores["Frete R$"] + 
                          (dados.valores["Seguro R$"] || 0);
        }

        // Adicionar despesas extras e impostos
        valorEsperado += (dados.valores["AFRMM R$"] || 0) + 
                        (dados.valores["Siscomex R$"] || 0) + 
                        (dados.valores["Outros Custos R$"] || 0) +
                        dados.tributos["II R$"];

        const diferenca = Math.abs(custoTotalCalculado - valorEsperado);
        const percentualDiferenca = valorEsperado > 0 ? (diferenca / valorEsperado * 100) : 0;

        return {
            "Custo Total Calculado": custoTotalCalculado,
            "Valor Esperado": valorEsperado,
            "Diferença": diferenca,
            "% Diferença": percentualDiferenca,
            "Status": percentualDiferenca < 0.01 ? "OK" : "DIVERGÊNCIA",
            "Configuração": `Frete: ${freteEmbutido ? 'Embutido' : 'Separado'}, Seguro: ${seguroEmbutido ? 'Embutido' : 'Separado'}`
        };
    },

    /**
     * Calcula ICMS na importação usando a fórmula correta:
     * BC ICMS = (VDI + II + IPI + PIS + COFINS + Despesas) / (1 - alíquota)
     * ICMS = BC ICMS × alíquota
     */
    calcularICMSPorDentro: function(valorAduaneiro, ii, ipi, pis, cofins, outrasDesp, aliquota) {
        // Validar parâmetros
        valorAduaneiro = parseFloat(valorAduaneiro) || 0;
        ii = parseFloat(ii) || 0;
        ipi = parseFloat(ipi) || 0;
        pis = parseFloat(pis) || 0;
        cofins = parseFloat(cofins) || 0;
        outrasDesp = parseFloat(outrasDesp) || 0;
        aliquota = parseFloat(aliquota) || 0;

        // Somatório antes da inclusão do ICMS
        const somaBase = valorAduaneiro + ii + ipi + pis + cofins + outrasDesp;
        
        // Base de cálculo com ICMS incluído (fórmula por dentro)
        const baseICMS = aliquota > 0 ? somaBase / (1 - aliquota) : somaBase;
        
        // Valor do ICMS
        const valorICMS = baseICMS * aliquota;

        return {
            base: Math.round(baseICMS * 100) / 100,
            icms: Math.round(valorICMS * 100) / 100,
            somaBase: Math.round(somaBase * 100) / 100
        };
    },

    /**
     * Calcula custos de uma adição específica
     */
    calcularCustosAdicao: function(adicao, index) {
        // Se a adição já tem custos calculados, retorna
        if (adicao.custos) {
            return adicao.custos;
        }
        
        // Calcular custos básicos para esta adição
        const valorAdicao = adicao.dadosGerais["VCMV R$"] || 0;
        const iiAdicao = adicao.tributos["II R$"] || 0;
        
        return {
            "Valor Mercadoria R$": valorAdicao,
            "Frete Rateado R$": 0,
            "Seguro Rateado R$": 0,
            "AFRMM Rateado R$": 0,
            "Siscomex Rateado R$": 0,
            "II Incorporado R$": iiAdicao,
            "Custo Total Adição R$": valorAdicao + iiAdicao,
            "% Participação": 0,
            "Observações": "Cálculo individual da adição"
        };
    }
};

// =============================================================================
// EXPORT SYSTEM
// =============================================================================
const ExportSystem = {
    exportToCSV: function(dados) {
        let csv = 'Adição,NCM,Descrição,INCOTERM,VCMV R$,Custo Total R$,II R$,% Participação\n';
        
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            const custos = adicao.custos || {};
            
            const row = [
                adicao.numero,
                adicao.dadosGerais.NCM,
                `"${adicao.dadosGerais['Descrição NCM'].replace(/"/g, '""')}"`,
                adicao.dadosGerais.INCOTERM,
                Utils.formatNumber(adicao.dadosGerais['VCMV R$']),
                Utils.formatNumber(custos['Custo Total Adição R$'] || 0),
                Utils.formatNumber(adicao.tributos['II R$']),
                Utils.formatNumber(custos['% Participação'] || 0)
            ];
            
            csv += row.join(',') + '\n';
        }
        
        return csv;
    },

    exportToDetailedCSV: function(dados) {
        let csv = 'Adição,NCM,Descrição NCM,INCOTERM,VCMV R$,Frete Rateado R$,Seguro Rateado R$,AFRMM Rateado R$,Siscomex Rateado R$,II Incorporado R$,Custo Total R$,% Participação,Item Seq,Item Código,Item Descrição,Item Qtd,Item Unidade,Custo Unitário R$,Custo por Peça R$\n';
        
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            const custos = adicao.custos || {};
            
            if (adicao.itens && adicao.itens.length > 0) {
                for (let j = 0; j < adicao.itens.length; j++) {
                    const item = adicao.itens[j];
                    
                    const row = [
                        adicao.numero,
                        adicao.dadosGerais.NCM,
                        `"${adicao.dadosGerais['Descrição NCM'].replace(/"/g, '""')}"`,
                        adicao.dadosGerais.INCOTERM,
                        Utils.formatNumber(adicao.dadosGerais['VCMV R$']),
                        Utils.formatNumber(custos['Frete Rateado R$'] || 0),
                        Utils.formatNumber(custos['Seguro Rateado R$'] || 0),
                        Utils.formatNumber(custos['AFRMM Rateado R$'] || 0),
                        Utils.formatNumber(custos['Siscomex Rateado R$'] || 0),
                        Utils.formatNumber(custos['II Incorporado R$'] || 0),
                        Utils.formatNumber(custos['Custo Total Adição R$'] || 0),
                        Utils.formatNumber(custos['% Participação'] || 0),
                        item.Seq,
                        item.Código,
                        `"${item.Descrição.replace(/"/g, '""')}"`,
                        Utils.formatNumber(item.Qtd),
                        item.Unidade,
                        Utils.formatNumber(item['Custo Unitário R$'] || 0),
                        item['Custo por Peça R$'] === "N/A" ? "N/A" : Utils.formatNumber(item['Custo por Peça R$'] || 0)
                    ];
                    
                    csv += row.join(',') + '\n';
                }
            } else {
                const row = [
                    adicao.numero,
                    adicao.dadosGerais.NCM,
                    `"${adicao.dadosGerais['Descrição NCM'].replace(/"/g, '""')}"`,
                    adicao.dadosGerais.INCOTERM,
                    Utils.formatNumber(adicao.dadosGerais['VCMV R$']),
                    Utils.formatNumber(custos['Frete Rateado R$'] || 0),
                    Utils.formatNumber(custos['Seguro Rateado R$'] || 0),
                    Utils.formatNumber(custos['AFRMM Rateado R$'] || 0),
                    Utils.formatNumber(custos['Siscomex Rateado R$'] || 0),
                    Utils.formatNumber(custos['II Incorporado R$'] || 0),
                    Utils.formatNumber(custos['Custo Total Adição R$'] || 0),
                    Utils.formatNumber(custos['% Participação'] || 0),
                    '','','','','','',''
                ];
                
                csv += row.join(',') + '\n';
            }
        }
        
        return csv;
    },

    generateSummaryReport: function(dados, validacao) {
        const stats = this.getProcessingStats(dados);
        const config = dados.configuracaoCustos || {};
        
        let report = `RELATÓRIO DE IMPORTAÇÃO - EXPERTZY INTELIGÊNCIA TRIBUTÁRIA\n`;
        report += `© 2025 Expertzy Inteligência Tributária\n`;
        report += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        report += `=== INFORMAÇÕES GERAIS ===\n`;
        report += `DI: ${dados.cabecalho.DI}\n`;
        report += `Data Registro: ${dados.cabecalho['Data registro']}\n`;
        report += `Importador: ${dados.importador.Nome} (${dados.importador.CNPJ})\n`;
        report += `URF Despacho: ${dados.cabecalho['URF despacho']}\n\n`;
        
        report += `=== CONFIGURAÇÃO DE CUSTOS ===\n`;
        report += `Frete Embutido: ${config['Frete Embutido'] || 'Não'}\n`;
        report += `Seguro Embutido: ${config['Seguro Embutido'] || 'Não'}\n`;
        report += `Base de Cálculo: ${config['Base de Cálculo'] || 'FOB'}\n`;
        report += `Valor Base: ${Utils.formatCurrency(config['Valor Base R$'] || 0)}\n\n`;
        
        report += `=== TOTAIS DA DI ===\n`;
        report += `FOB: ${Utils.formatCurrency(dados.valores['FOB R$'])}\n`;
        report += `Frete: ${Utils.formatCurrency(dados.valores['Frete R$'])}\n`;
        report += `Seguro: ${Utils.formatCurrency(dados.valores['Seguro R$'] || 0)}\n`;
        report += `AFRMM: ${Utils.formatCurrency(dados.valores['AFRMM R$'] || 0)}\n`;
        report += `Siscomex: ${Utils.formatCurrency(dados.valores['Siscomex R$'] || 0)}\n`;
        report += `Valor Aduaneiro: ${Utils.formatCurrency(dados.valores['Valor Aduaneiro R$'])}\n\n`;
        
        report += `=== TRIBUTOS TOTAIS ===\n`;
        report += `II: ${Utils.formatCurrency(dados.tributos['II R$'])}\n`;
        report += `IPI: ${Utils.formatCurrency(dados.tributos['IPI R$'])}\n`;
        report += `PIS: ${Utils.formatCurrency(dados.tributos['PIS R$'])}\n`;
        report += `COFINS: ${Utils.formatCurrency(dados.tributos['COFINS R$'])}\n\n`;
        
        report += `=== ESTATÍSTICAS ===\n`;
        report += `Total de Adições: ${stats.totalAdicoes}\n`;
        report += `Total de Itens: ${stats.totalItens}\n`;
        report += `INCOTERM Detectado: ${stats.incotermDetectado || 'N/A'}\n\n`;
        
        if (validacao) {
            report += `=== VALIDAÇÃO ===\n`;
            report += `Status: ${validacao.Status}\n`;
            report += `Custo Total Calculado: ${Utils.formatCurrency(validacao['Custo Total Calculado'])}\n`;
            report += `Valor Esperado: ${Utils.formatCurrency(validacao['Valor Esperado'])}\n`;
            report += `Diferença: ${Utils.formatCurrency(validacao['Diferença'])}\n`;
            report += `% Diferença: ${Utils.formatNumber(validacao['% Diferença'], 4)}%\n\n`;
        }
        
        report += `=== RESUMO POR ADIÇÃO ===\n`;
        for (let i = 0; i < dados.adicoes.length; i++) {
            const adicao = dados.adicoes[i];
            const custos = adicao.custos || {};
            
            report += `\nAdição ${adicao.numero}:\n`;
            report += `  NCM: ${adicao.dadosGerais.NCM}\n`;
            report += `  Descrição: ${adicao.dadosGerais['Descrição NCM']}\n`;
            report += `  INCOTERM: ${adicao.dadosGerais.INCOTERM}\n`;
            report += `  VCMV: ${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'])}\n`;
            report += `  Custo Total: ${Utils.formatCurrency(custos['Custo Total Adição R$'] || 0)}\n`;
            report += `  % Participação: ${Utils.formatNumber(custos['% Participação'] || 0, 2)}%\n`;
        }
        
        return report;
    },

    getProcessingStats: function(dados) {
        const totalAdicoes = dados.adicoes ? dados.adicoes.length : 0;
        let totalItens = 0;
        
        if (dados.adicoes) {
            for (let i = 0; i < dados.adicoes.length; i++) {
                const adicao = dados.adicoes[i];
                totalItens += adicao.itens ? adicao.itens.length : 0;
            }
        }
        
        return {
            totalAdicoes: totalAdicoes,
            totalItens: totalItens,
            temTributos: dados.tributos && Object.keys(dados.tributos).length > 0,
            incotermDetectado: this.detectINCOTERM(dados)
        };
    },

    detectINCOTERM: function(dados) {
        if (!dados.adicoes || dados.adicoes.length === 0) return null;
        const primeiraAdicao = dados.adicoes[0];
        const incoterm = primeiraAdicao.dadosGerais.INCOTERM;
        return (incoterm && incoterm !== 'N/A') ? incoterm.toUpperCase() : null;
    },

    exportToExcel: function(dados, validacao) {
        if (!window.XLSX) {
            throw new Error('Biblioteca SheetJS não carregada. Verifique a conexão com a internet.');
        }

        const workbook = XLSX.utils.book_new();

        // Função para criar aba simples (dados chave-valor)
        function criarAbaSimples(dic, nomeAba, largCol0 = 26, largCol1 = 50) {
            const data = [['Campo', 'Valor']];
            Object.keys(dic).forEach(function(key) {
                data.push([key, dic[key]]);
            });
            
            const ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(workbook, ws, nomeAba);
            
            // Configurar larguras das colunas
            ws['!cols'] = [{ wch: largCol0 }, { wch: largCol1 }];
        }

        // 1. Aba Capa (Cabeçalho)
        criarAbaSimples(dados.cabecalho, '01_Capa');
        
        // 2. Aba Importador
        criarAbaSimples(dados.importador, '02_Importador');
        
        // 3. Aba Carga
        criarAbaSimples(dados.carga, '03_Carga');
        
        // 4. Aba Valores
        criarAbaSimples(dados.valores, '04_Valores');

        // 4A. Aba Configuração de Custos
        if (dados.configuracaoCustos) {
            criarAbaSimples(dados.configuracaoCustos, '04A_Config_Custos', 25, 25);
        }

        // 5. Aba Tributos Totais
        const tributosData = [['Imposto', 'Total (R$)']];
        Object.keys(dados.tributos).forEach(function(key) {
            tributosData.push([key, dados.tributos[key]]);
        });
        const tributosWS = XLSX.utils.aoa_to_sheet(tributosData);
        XLSX.utils.book_append_sheet(workbook, tributosWS, '05_Tributos_Totais');
        tributosWS['!cols'] = [{ wch: 20 }, { wch: 14 }];

        // 5A. Aba Validação de Custos
        if (validacao) {
            const validacaoData = [['Métrica', 'Valor']];
            Object.keys(validacao).forEach(function(key) {
                validacaoData.push([key, validacao[key]]);
            });
            const validacaoWS = XLSX.utils.aoa_to_sheet(validacaoData);
            XLSX.utils.book_append_sheet(workbook, validacaoWS, '05A_Validacao_Custos');
            validacaoWS['!cols'] = [{ wch: 25 }, { wch: 25 }];
        }

        // 6. Aba Resumo das Adições
        const resumoAdicoes = [
            ['Nº', 'NCM', 'Descrição', 'INCOTERM', 'VCMV R$', 'Custo Total R$', 'II R$', 'Total Tributos R$']
        ];
        
        dados.adicoes.forEach(function(adicao) {
            let descricao = adicao.dadosGerais['Descrição NCM'] || 'N/A';
            if (descricao.length > 50) {
                descricao = descricao.substring(0, 50) + '...';
            }
            
            const custos = adicao.custos || {};
            const totalTributos = (adicao.tributos['II R$'] || 0) + 
                                 (adicao.tributos['IPI R$'] || 0) + 
                                 (adicao.tributos['PIS R$'] || 0) + 
                                 (adicao.tributos['COFINS R$'] || 0);
            
            resumoAdicoes.push([
                adicao.numero,
                adicao.dadosGerais.NCM,
                descricao,
                adicao.dadosGerais.INCOTERM,
                adicao.dadosGerais['VCMV R$'],
                custos['Custo Total Adição R$'] || 0,
                adicao.tributos['II R$'] || 0,
                totalTributos
            ]);
        });

        const resumoWS = XLSX.utils.aoa_to_sheet(resumoAdicoes);
        XLSX.utils.book_append_sheet(workbook, resumoWS, '06_Resumo_Adicoes');
        resumoWS['!cols'] = [
            { wch: 5 }, { wch: 12 }, { wch: 50 }, { wch: 10 },
            { wch: 12 }, { wch: 15 }, { wch: 12 }, { wch: 16 }
        ];

        // 6A. Aba Resumo de Custos
        const resumoCustos = [
            ['Adição', 'NCM', 'INCOTERM', 'Valor Mercadoria R$', 'Frete Rateado R$', 
             'Seguro Rateado R$', 'AFRMM Rateado R$', 'Siscomex Rateado R$', 
             'II Incorporado R$', 'Custo Total R$', '% Participação']
        ];

        dados.adicoes.forEach(function(adicao) {
            const custos = adicao.custos || {};
            if (Object.keys(custos).length > 0) {
                resumoCustos.push([
                    adicao.numero,
                    adicao.dadosGerais.NCM,
                    adicao.dadosGerais.INCOTERM,
                    custos['Valor Mercadoria R$'] || 0,
                    custos['Frete Rateado R$'] || 0,
                    custos['Seguro Rateado R$'] || 0,
                    custos['AFRMM Rateado R$'] || 0,
                    custos['Siscomex Rateado R$'] || 0,
                    custos['II Incorporado R$'] || 0,
                    custos['Custo Total Adição R$'] || 0,
                    (custos['% Participação'] || 0) / 100 // Convertido para decimal para formatação de percentual
                ]);
            }
        });

        if (resumoCustos.length > 1) {
            const custosWS = XLSX.utils.aoa_to_sheet(resumoCustos);
            XLSX.utils.book_append_sheet(workbook, custosWS, '06A_Resumo_Custos');
            custosWS['!cols'] = [
                { wch: 8 }, { wch: 12 }, { wch: 10 }, { wch: 15 }, { wch: 12 },
                { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 }
            ];
        }

        // 7. Abas individuais para cada adição
        dados.adicoes.forEach(function(adicao, index) {
            const numeroAdicao = adicao.numero || String(index + 1).padStart(3, '0');
            const nomeAba = `Add_${numeroAdicao}`;
            
            const dadosAdicao = [];
            
            // SEÇÃO 1: DADOS GERAIS
            dadosAdicao.push(['DADOS GERAIS', '']);
            dadosAdicao.push(['Campo', 'Valor']);
            Object.keys(adicao.dadosGerais).forEach(function(key) {
                dadosAdicao.push([key, adicao.dadosGerais[key]]);
            });
            dadosAdicao.push(['', '']); // linha vazia
            
            // SEÇÃO 2: PARTES ENVOLVIDAS
            if (adicao.partes) {
                dadosAdicao.push(['PARTES ENVOLVIDAS', '']);
                dadosAdicao.push(['Campo', 'Valor']);
                Object.keys(adicao.partes).forEach(function(key) {
                    dadosAdicao.push([key, adicao.partes[key]]);
                });
                dadosAdicao.push(['', '']); // linha vazia
            }
            
            // SEÇÃO 3: TRIBUTOS
            dadosAdicao.push(['TRIBUTOS', '']);
            dadosAdicao.push(['Campo', 'Valor']);
            Object.keys(adicao.tributos).forEach(function(key) {
                dadosAdicao.push([key, adicao.tributos[key]]);
            });
            dadosAdicao.push(['', '']); // linha vazia
            
            // SEÇÃO 4: ANÁLISE DE CUSTOS
            if (adicao.custos) {
                dadosAdicao.push(['ANÁLISE DE CUSTOS', '']);
                dadosAdicao.push(['Componente', 'Valor (R$)']);
                Object.keys(adicao.custos).forEach(function(key) {
                    dadosAdicao.push([key, adicao.custos[key]]);
                });
                dadosAdicao.push(['', '']); // linha vazia
            }
            
            // SEÇÃO 5: ITENS DETALHADOS COM CUSTOS
            dadosAdicao.push(['ITENS DETALHADOS COM CUSTOS', '', '', '', '', '', '', '', '', '', '']);
            
            if (adicao.itens && adicao.itens.length > 0) {
                dadosAdicao.push([
                    'Seq', 'Código', 'Descrição', 'Qtd', 'Unidade',
                    'Valor Unit. USD', 'Unid/Caixa', 'Valor Total USD',
                    'Custo Total R$', 'Custo Unit. R$', 'Custo/Peça R$'
                ]);
                
                let totalQtd = 0;
                let totalValorUSD = 0;
                let totalCustoBRL = 0;
                
                adicao.itens.forEach(function(item) {
                    const custoPeca = item['Custo por Peça R$'] === "N/A" ? "N/A" : (item['Custo por Peça R$'] || 0);
                    
                    dadosAdicao.push([
                        item.Seq,
                        item.Código,
                        item.Descrição,
                        item.Qtd,
                        item.Unidade,
                        item['Valor Unit. USD'],
                        item['Unid/Caixa'],
                        item['Valor Total USD'],
                        item['Custo Total Item R$'] || 0,
                        item['Custo Unitário R$'] || 0,
                        custoPeca
                    ]);
                    
                    totalQtd += item.Qtd || 0;
                    totalValorUSD += item['Valor Total USD'] || 0;
                    totalCustoBRL += item['Custo Total Item R$'] || 0;
                });
                
                // Linha de totais
                dadosAdicao.push(['', '', 'TOTAL:', totalQtd, '', '', '', totalValorUSD, totalCustoBRL, '', '']);
            } else {
                dadosAdicao.push(['Nenhum item detalhado encontrado', '', '', '', '', '', '', '', '', '', '']);
            }
            
            const adicaoWS = XLSX.utils.aoa_to_sheet(dadosAdicao);
            XLSX.utils.book_append_sheet(workbook, adicaoWS, nomeAba);
            
            // Configurar larguras das colunas
            adicaoWS['!cols'] = [
                { wch: 8 },  // Seq
                { wch: 12 }, // Código
                { wch: 60 }, // Descrição
                { wch: 10 }, // Qtd
                { wch: 12 }, // Unidade
                { wch: 15 }, // Valor Unit.
                { wch: 12 }, // Unid/Caixa
                { wch: 15 }, // Valor Total
                { wch: 15 }, // Custo Total
                { wch: 15 }, // Custo Unit.
                { wch: 15 }  // Custo/Peça
            ];
        });

        // 98. Aba Croqui da NF-e de Entrada (REPLICANDO EXATAMENTE O PYTHON)
        const croquisData = [];
        let linha = 0;

        // CABEÇALHO DA NOTA
        croquisData.push(['CABEÇALHO DA NOTA', '', '', '', '', '', '']);
        croquisData.push(['Série', 'Modelo', 'Tipo de Operação', 'Natureza da Operação', 'Finalidade', 'Data de Emissão', 'Chave de Acesso']);
        croquisData.push([1, 55, '0 (entrada)', 'Importação do exterior (CFOP 3102)', 1, '', '']);
        croquisData.push(['', '', '', '', '', '', '']);

        // EMITENTE / IMPORTADOR
        croquisData.push(['EMITENTE / IMPORTADOR', '', '']);
        croquisData.push(['CNPJ', 'Razão Social', 'Endereço']);
        croquisData.push([dados.importador.CNPJ, dados.importador.Nome, dados.importador.Endereço]);
        croquisData.push(['', '', '']);

        // REMETENTE / EXPORTADOR (EXTERIOR)
        croquisData.push(['REMETENTE / EXPORTADOR (EXTERIOR)', '', '']);
        const primeiraAdicao = dados.adicoes[0];
        croquisData.push(['Nome Exportador', 'País de Aquisição']);
        croquisData.push([primeiraAdicao.partes.Exportador, primeiraAdicao.partes['País Aquisição']]);
        croquisData.push(['', '']);

        // DADOS DA DECLARAÇÃO DE IMPORTAÇÃO
        croquisData.push(['DADOS DA DECLARAÇÃO DE IMPORTAÇÃO', '', '', '']);
        croquisData.push(['Número DI', 'Registro', 'URF', 'Modalidade']);
        croquisData.push([dados.cabecalho.DI, dados.cabecalho['Data registro'], dados.cabecalho['URF despacho'], dados.cabecalho.Modalidade]);
        croquisData.push(['', '', '', '']);

        // PRODUTOS E SERVIÇOS
        croquisData.push(['PRODUTOS E SERVIÇOS', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        const colsItens = ['Seq', 'Descrição', 'NCM', 'Quantidade', 'Unidade', 'Valor Unit. (R$)', 'Valor Total (R$)', 
                          'CFOP', 'Origem', 'CST ICMS', 'Alq. ICMS (%)', 'IPI CST', 'IPI Alíq. (%)', 'Fabricante'];
        croquisData.push(colsItens);

        let seqNota = 1;
        dados.adicoes.forEach(function(adicao) {
            const ncm = adicao.dadosGerais.NCM;
            const fabricante = adicao.partes.Fabricante;
            const origem = adicao.partes['País Origem'];
            const cfop = adicao.dadosGerais.CFOP || '3102'; // usar CFOP específico da adição
            const cstIcms = '00';
            const icmsAliq = adicao.dadosGerais.ICMS_ALIQUOTA || 19.0; // usar alíquota específica da adição
            const ipiCst = '00';
            const ipiAliq = adicao.tributos['IPI Alíq. (%)'] || 0;

            adicao.itens.forEach(function(item) {
                const valorUnitBRL = item['Custo Unitário R$'] || 0;
                const valorTotalBRL = item['Custo Total Item R$'] || 0;
                
                croquisData.push([
                    seqNota, item.Descrição, ncm, item.Qtd, item.Unidade, valorUnitBRL, valorTotalBRL,
                    cfop, '3', cstIcms, icmsAliq, ipiCst, ipiAliq, fabricante
                ]);
                seqNota++;
            });
        });

        croquisData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);
        croquisData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '']);

        // BASE DE CÁLCULO DO ICMS IMPORTAÇÃO
        croquisData.push(['BASE DE CÁLCULO DO ICMS IMPORTAÇÃO', '']);
        croquisData.push(['Valor Aduaneiro', dados.valores['Valor Aduaneiro R$']]);
        croquisData.push(['II', dados.tributos['II R$']]);
        croquisData.push(['IPI', dados.tributos['IPI R$']]);
        croquisData.push(['PIS', dados.tributos['PIS R$']]);
        croquisData.push(['COFINS', dados.tributos['COFINS R$']]);
        const outrasDesp = (dados.valores['Siscomex R$'] || 0) + (dados.valores['AFRMM R$'] || 0) + (dados.valores['Outros Custos R$'] || 0);
        croquisData.push(['Outras despesas', outrasDesp]);

        const baseIcmsSemIcms = (
            dados.valores['Valor Aduaneiro R$'] +
            dados.tributos['II R$'] + dados.tributos['IPI R$'] +
            dados.tributos['PIS R$'] + dados.tributos['COFINS R$'] + outrasDesp
        );
        croquisData.push(['Base ICMS Sem ICMS', baseIcmsSemIcms]);
        
        // Usar alíquota ICMS média das adições para o cálculo geral
        let aliquotaMedia = 19.0; // padrão
        if (dados.adicoes && dados.adicoes.length > 0) {
            const somaAliquotas = dados.adicoes.reduce(function(sum, adicao) {
                return sum + (adicao.dadosGerais.ICMS_ALIQUOTA || 19.0);
            }, 0);
            aliquotaMedia = somaAliquotas / dados.adicoes.length;
        }
        
        // Usar valores de ICMS já calculados nos tributos da DI
        const baseFinalIcms = dados.tributos['Base ICMS R$'] || 0;
        const icmsARecolher = dados.tributos['ICMS R$'] || 0;
        croquisData.push(['Base Final do ICMS', baseFinalIcms]);
        croquisData.push(['ICMS a Recolher', icmsARecolher]);
        croquisData.push(['', '']);

        // INFORMAÇÕES COMPLEMENTARES / OBSERVAÇÕES OBRIGATÓRIAS
        croquisData.push(['INFORMAÇÕES COMPLEMENTARES / OBSERVAÇÕES OBRIGATÓRIAS']);
        const infoExtra = `DI: ${dados.cabecalho.DI} - Data Registro: ${dados.cabecalho['Data registro']}\n${dados.informacaoComplementar}`;
        croquisData.push([infoExtra]);
        croquisData.push(['']);
        croquisData.push(['']);
        croquisData.push(['LEGENDAS: CFOP conforme configuração; CST ICMS=00; Origem=3(estrangeira); ICMS conforme UF de destino']);

        const croquisWS = XLSX.utils.aoa_to_sheet(croquisData);
        XLSX.utils.book_append_sheet(workbook, croquisWS, 'Croqui_NFe_Entrada');
        
        // Ajuste visual - larguras das colunas conforme Python
        const widths = [5, 50, 12, 9, 8, 18, 18, 8, 6, 10, 14, 8, 8, 30];
        croquisWS['!cols'] = widths.map(function(w) { return { wch: w }; });

        // 99. Aba Dados Complementares
        if (dados.informacaoComplementar) {
            const complementarData = [
                ['Dados Complementares'],
                [dados.informacaoComplementar]
            ];
            const complementarWS = XLSX.utils.aoa_to_sheet(complementarData);
            XLSX.utils.book_append_sheet(workbook, complementarWS, '99_Complementar');
            complementarWS['!cols'] = [{ wch: 120 }];
        }

        // Aba Memória de Cálculo Detalhada
        const memoriaData = CostCalculator.gerarMemoriaCalculos(dados);
        const memoriaWS = XLSX.utils.aoa_to_sheet(memoriaData);
        XLSX.utils.book_append_sheet(workbook, memoriaWS, 'Memoria_Calculo');
        memoriaWS['!cols'] = [{ wch: 40 }, { wch: 20 }];

        // Download do arquivo
        const filename = `Extrato_DI_${dados.cabecalho.DI}_${new Date().toISOString().slice(0,10)}.xlsx`;
        XLSX.writeFile(workbook, filename);
    },

    exportToPDF: function(dados, validacao) {
        if (!window.jsPDF) {
            throw new Error('Biblioteca jsPDF não carregada. Verifique a conexão com a internet.');
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        const config = dados.configuracaoCustos || {};
        let yPosition = 20;

        // Função para adicionar texto com quebra de linha automática
        function addText(text, x, y, fontSize = 10, style = 'normal') {
            doc.setFontSize(fontSize);
            doc.setFont('helvetica', style);
            doc.text(text, x, y);
            return y + (fontSize * 0.4);
        }

        // Cabeçalho
        yPosition = addText('RELATÓRIO DE IMPORTAÇÃO', 105, yPosition, 16, 'bold');
        yPosition = addText('EXPERTZY INTELIGÊNCIA TRIBUTÁRIA', 105, yPosition, 12, 'bold');
        yPosition = addText(`© 2025 Expertzy Inteligência Tributária`, 20, yPosition + 10, 8);
        yPosition = addText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, yPosition + 5, 8);

        // Informações Gerais
        yPosition = addText('INFORMAÇÕES GERAIS', 20, yPosition + 15, 12, 'bold');
        yPosition = addText(`DI: ${dados.cabecalho.DI}`, 20, yPosition + 5);
        yPosition = addText(`Data Registro: ${dados.cabecalho['Data registro']}`, 20, yPosition + 5);
        yPosition = addText(`Importador: ${dados.importador.Nome}`, 20, yPosition + 5);
        yPosition = addText(`CNPJ: ${dados.importador.CNPJ}`, 20, yPosition + 5);
        yPosition = addText(`URF Despacho: ${dados.cabecalho['URF despacho']}`, 20, yPosition + 5);

        // Configuração de Custos
        yPosition = addText('CONFIGURAÇÃO DE CUSTOS', 20, yPosition + 15, 12, 'bold');
        yPosition = addText(`Frete Embutido: ${config['Frete Embutido'] || 'Não'}`, 20, yPosition + 5);
        yPosition = addText(`Seguro Embutido: ${config['Seguro Embutido'] || 'Não'}`, 20, yPosition + 5);
        yPosition = addText(`Base de Cálculo: ${config['Base de Cálculo'] || 'FOB'}`, 20, yPosition + 5);

        // Totais da DI
        yPosition = addText('TOTAIS DA DI', 20, yPosition + 15, 12, 'bold');
        yPosition = addText(`FOB: ${Utils.formatCurrency(dados.valores['FOB R$'])}`, 20, yPosition + 5);
        yPosition = addText(`Frete: ${Utils.formatCurrency(dados.valores['Frete R$'])}`, 20, yPosition + 5);
        yPosition = addText(`Seguro: ${Utils.formatCurrency(dados.valores['Seguro R$'] || 0)}`, 20, yPosition + 5);
        yPosition = addText(`AFRMM: ${Utils.formatCurrency(dados.valores['AFRMM R$'] || 0)}`, 20, yPosition + 5);
        yPosition = addText(`Siscomex: ${Utils.formatCurrency(dados.valores['Siscomex R$'] || 0)}`, 20, yPosition + 5);
        yPosition = addText(`Valor Aduaneiro: ${Utils.formatCurrency(dados.valores['Valor Aduaneiro R$'])}`, 20, yPosition + 5);

        // Tributos
        yPosition = addText('TRIBUTOS TOTAIS', 20, yPosition + 15, 12, 'bold');
        yPosition = addText(`II: ${Utils.formatCurrency(dados.tributos['II R$'])}`, 20, yPosition + 5);
        yPosition = addText(`IPI: ${Utils.formatCurrency(dados.tributos['IPI R$'])}`, 20, yPosition + 5);
        yPosition = addText(`PIS: ${Utils.formatCurrency(dados.tributos['PIS R$'])}`, 20, yPosition + 5);
        yPosition = addText(`COFINS: ${Utils.formatCurrency(dados.tributos['COFINS R$'])}`, 20, yPosition + 5);

        // Validação (se disponível)
        if (validacao) {
            yPosition = addText('VALIDAÇÃO', 20, yPosition + 15, 12, 'bold');
            yPosition = addText(`Status: ${validacao.Status}`, 20, yPosition + 5);
            yPosition = addText(`Custo Total Calculado: ${Utils.formatCurrency(validacao['Custo Total Calculado'])}`, 20, yPosition + 5);
            yPosition = addText(`Diferença: ${Utils.formatCurrency(validacao['Diferença'])}`, 20, yPosition + 5);
        }

        // Nova página para resumo das adições
        doc.addPage();
        yPosition = 20;
        yPosition = addText('RESUMO DAS ADIÇÕES', 20, yPosition, 12, 'bold');

        dados.adicoes.forEach(function(adicao, index) {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            const custos = adicao.custos || {};
            yPosition = addText(`Adição ${adicao.numero}`, 20, yPosition + 10, 10, 'bold');
            yPosition = addText(`NCM: ${adicao.dadosGerais.NCM}`, 20, yPosition + 5);
            yPosition = addText(`INCOTERM: ${adicao.dadosGerais.INCOTERM}`, 20, yPosition + 5);
            yPosition = addText(`VCMV: ${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'])}`, 20, yPosition + 5);
            yPosition = addText(`Custo Total: ${Utils.formatCurrency(custos['Custo Total Adição R$'] || 0)}`, 20, yPosition + 5);
            yPosition = addText(`% Participação: ${Utils.formatNumber(custos['% Participação'] || 0, 2)}%`, 20, yPosition + 5);
        });

        // Download do arquivo
        const filename = `Relatorio_DI_${dados.cabecalho.DI}_${new Date().toISOString().slice(0,10)}.pdf`;
        doc.save(filename);
    }
};

// [Continuar com DragDropZone, DIXMLParser e ImportDIApp - mantendo a mesma estrutura das versões anteriores mas com as funcionalidades de cálculo e exportação integradas...]

// =============================================================================
// DRAG DROP ZONE CLASS (simplificada para economizar espaço)
// =============================================================================
function DragDropZone(zoneElement, fileInputElement, onFileSelected) {
    this.zone = zoneElement;
    this.fileInput = fileInputElement;
    this.onFileSelected = onFileSelected;
    this.isProcessing = false;
    this.init();
}

DragDropZone.prototype.init = function() {
    var self = this;
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        self.zone.addEventListener(eventName, function(e) { self.handleDragEvent(e); });
        document.addEventListener(eventName, function(e) { e.preventDefault(); e.stopPropagation(); }, false);
    });
    
    this.zone.addEventListener('click', function(e) {
        if (!self.isProcessing && !e.target.closest('input')) {
            self.fileInput.click();
        }
    });
    
    this.fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && self.validateFile(file)) {
            self.showFileInfo(file);
            if (self.onFileSelected) self.onFileSelected(file);
        }
    });
};

DragDropZone.prototype.handleDragEvent = function(e) {
    e.preventDefault(); e.stopPropagation();
    if (this.isProcessing) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
        this.zone.classList.add('drag-over');
    } else if (e.type === 'dragleave') {
        if (!this.zone.contains(e.relatedTarget)) {
            this.zone.classList.remove('drag-over');
        }
    } else if (e.type === 'drop') {
        this.zone.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0 && this.validateFile(files[0])) {
            this.showFileInfo(files[0]);
            if (this.onFileSelected) this.onFileSelected(files[0]);
        }
    }
};

DragDropZone.prototype.validateFile = function(file) {
    if (!file.type.includes('xml') && !file.name.toLowerCase().endsWith('.xml')) {
        Utils.showToast('Erro: Apenas arquivos XML são aceitos', 'error');
        return false;
    }
    if (file.size > 10 * 1024 * 1024) {
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

DragDropZone.prototype.formatFileSize = function(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

DragDropZone.prototype.setProcessingState = function(isProcessing) {
    this.isProcessing = isProcessing;
    if (isProcessing) {
        this.zone.classList.add('processing');
    } else {
        this.zone.classList.remove('processing');
    }
};

DragDropZone.prototype.updateProgress = function(percentage, text) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressContainer = document.getElementById('progressContainer');
    
    if (progressContainer) progressContainer.classList.remove('expertzy-hidden');
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText && text) progressText.textContent = text;
};

DragDropZone.prototype.reset = function() {
    this.isProcessing = false;
    this.zone.classList.remove('processing', 'drag-over');
    this.fileInput.value = '';
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo) fileInfo.classList.add('expertzy-hidden');
};

// =============================================================================
// XML PARSER CLASS (versão compacta mantendo funcionalidade completa)
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
            self.xmlDoc = self.parser.parseFromString(xmlContent, 'text/xml');
            const parserError = self.xmlDoc.querySelector('parsererror');
            if (parserError) throw new Error(`XML Parse Error: ${parserError.textContent}`);
            
            self.rootElement = self.xmlDoc.querySelector(CONSTANTS.DI_XML_PATHS.ROOT);
            if (!self.rootElement) throw new Error('Elemento declaracaoImportacao não encontrado no XML');
            
            const data = {
                cabecalho: self.extractCabecalho(),
                importador: self.extractImportador(),
                carga: self.extractCarga(),
                valores: self.extractValores(),
                adicoes: self.extractAdicoes(),
                tributos: {},
                informacaoComplementar: self.getTextContent('informacaoComplementar') || '—'
            };
            
            data.tributos = self.calculateTotalTaxes(data.adicoes);
            self.validateDIData(data);
            resolve(data);
            
        } catch (error) {
            reject(new Error(`${CONSTANTS.ERROR_MESSAGES.XML_PARSE_ERROR}: ${error.message}`));
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
    const addressParts = [
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.LOGRADOURO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.NUMERO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.BAIRRO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.MUNICIPIO),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.UF),
        this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_ENDERECO.CEP)
    ].filter(function(part) { return part && part.trim() !== ''; });
    
    return {
        CNPJ: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_CNPJ) || 'N/A',
        Nome: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_NOME) || 'N/A',
        Representante: this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_REPRESENTANTE) || 'N/A',
        'CPF repr.': this.getTextContent(CONSTANTS.DI_XML_PATHS.IMPORTADOR_CPF_REPR) || 'N/A',
        Endereço: addressParts.join(', ') || 'N/A'
    };
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
    // Extrair valores básicos dos campos XML
    const valores = {
        'FOB USD': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FOB_USD) || '0'),
        'FOB R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FOB_BRL) || '0'),
        'Frete USD': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FRETE_USD) || '0'),
        'Frete R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.FRETE_BRL) || '0'),
        'Seguro R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.SEGURO_BRL) || '0'),
        'AFRMM R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.AFRMM) || '0'),
        'Siscomex R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.SISCOMEX) || '0'),
        'Valor Aduaneiro R$': Utils.parseNumericField(this.getTextContent(CONSTANTS.DI_XML_PATHS.VALOR_ADUANEIRO) || '0'),
        'Cotação USD': this.extractTaxaConversao()
    };
    
    // Extrair informação complementar para buscar valores que podem não estar nos campos específicos
    const informacaoComplementar = this.getTextContent('informacaoComplementar') || '';
    
    // Se SISCOMEX não foi encontrado nos campos XML ou está zerado, buscar na informação complementar
    if (valores['Siscomex R$'] === 0 && informacaoComplementar) {
        const siscomexMatch = informacaoComplementar.match(/SISCOMEX.*?R\$\s*([\d.,]+)/i);
        if (siscomexMatch) {
            valores['Siscomex R$'] = parseFloat(siscomexMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
        }
    }
    
    // Se AFRMM não foi encontrado nos campos XML ou está zerado, buscar na informação complementar
    if (valores['AFRMM R$'] === 0 && informacaoComplementar) {
        const afrmmMatch = informacaoComplementar.match(/AFRMM.*?R\$\s*([\d.,]+)/i);
        if (afrmmMatch) {
            valores['AFRMM R$'] = parseFloat(afrmmMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
        }
    }
    
    // Buscar outros custos portuários (capatazia, armazenagem, etc.)
    if (informacaoComplementar) {
        let outrosCustos = 0;
        
        // Capatazia
        const capataziaMatch = informacaoComplementar.match(/CAPATAZIA.*?R\$\s*([\d.,]+)/i);
        if (capataziaMatch) {
            outrosCustos += parseFloat(capataziaMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
        }
        
        // Armazenagem
        const armazenagemMatch = informacaoComplementar.match(/ARMAZENAGEM.*?R\$\s*([\d.,]+)/i);
        if (armazenagemMatch) {
            outrosCustos += parseFloat(armazenagemMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
        }
        
        // Taxa de liberação
        const liberacaoMatch = informacaoComplementar.match(/LIBERACAO.*?R\$\s*([\d.,]+)/i);
        if (liberacaoMatch) {
            outrosCustos += parseFloat(liberacaoMatch[1].replace(/\./g, '').replace(',', '.')) || 0;
        }
        
        if (outrosCustos > 0) {
            valores['Outros Custos R$'] = outrosCustos;
        }
    }
    
    return valores;
};

DIXMLParser.prototype.extractTaxaConversao = function() {
    try {
        // Buscar a taxa de conversão no texto completo do XML
        const xmlText = this.xmlDoc.documentElement.textContent || '';
        const match = xmlText.match(/FOB\s*\(DOLAR\s+ESTADOS\s+UNIDOS\)[.\s]*:\s*([\d,]+)/i);
        if (match && match[1]) {
            // Converter o formato brasileiro (5,2177) para formato numérico (5.2177)
            return parseFloat(match[1].replace(',', '.'));
        }
        return 0;
    } catch (error) {
        console.warn('Erro ao extrair taxa de conversão:', error);
        return 0;
    }
};

DIXMLParser.prototype.extractAdicoes = function() {
    const adicoes = [];
    const adicaoElements = this.rootElement.querySelectorAll(CONSTANTS.DI_XML_PATHS.ADICAO);
    
    for (let i = 0; i < adicaoElements.length; i++) {
        adicoes.push(this.extractAdicao(adicaoElements[i]));
    }
    
    return adicoes;
};

DIXMLParser.prototype.extractAdicao = function(adicaoElement) {
    return {
        numero: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NUMERO_ADICAO) || 'N/A',
        numeroLI: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NUMERO_LI) || 'N/A',
        dadosGerais: {
            NCM: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.NCM) || 'N/A',
            'Descrição NCM': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.DESCRICAO_NCM) || 'N/A',
            'VCMV USD': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.VCMV_USD) || '0'),
            'VCMV R$': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.VCMV_BRL) || '0'),
            INCOTERM: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.INCOTERM) || 'N/A',
            Local: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.LOCAL_CONDICAO) || 'N/A',
            Moeda: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.MOEDA) || 'N/A',
            'Peso líq. (kg)': Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PESO_LIQUIDO_ADICAO) || '0', 1000),
            Quantidade: Utils.parseNumericField(this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.QUANTIDADE_ESTATISTICA) || '0', 1000),
            Unidade: (this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.UNIDADE_ESTATISTICA) || '').trim() || 'N/A'
        },
        partes: {
            Exportador: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.EXPORTADOR) || 'N/A',
            'País Aquisição': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PAIS_AQUISICAO) || 'N/A',
            Fabricante: this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.FABRICANTE) || 'N/A',
            'País Origem': this.getElementText(adicaoElement, CONSTANTS.DI_XML_PATHS.PAIS_ORIGEM) || 'N/A'
        },
        tributos: {
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
        },
        itens: this.extractItens(adicaoElement)
    };
};

DIXMLParser.prototype.extractItens = function(adicaoElement) {
    const itens = [];
    const mercadoriaElements = adicaoElement.querySelectorAll(CONSTANTS.DI_XML_PATHS.MERCADORIA);
    
    for (let i = 0; i < mercadoriaElements.length; i++) {
        const mercadoriaElement = mercadoriaElements[i];
        const descricao = (this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_DESCRICAO) || '').trim();
        const qtd = Utils.parseNumericField(this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_QUANTIDADE) || '0', 100000);
        const valorUnit = Utils.parseNumericField(this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_VALOR_UNITARIO) || '0', 10000000);
        
        itens.push({
            Seq: this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_SEQUENCIA) || 'N/A',
            Código: Utils.extrairCodigoProduto(descricao),
            Descrição: descricao || 'N/A',
            Qtd: qtd,
            Unidade: (this.getElementText(mercadoriaElement, CONSTANTS.DI_XML_PATHS.ITEM_UNIDADE) || '').trim() || 'N/A',
            'Valor Unit. USD': valorUnit,
            'Unid/Caixa': Utils.extrairUnidadesPorCaixa(descricao),
            'Valor Total USD': qtd * valorUnit
        });
    }
    
    return itens;
};

DIXMLParser.prototype.calculateTotalTaxes = function(adicoes) {
    const totals = { 'II R$': 0, 'IPI R$': 0, 'PIS R$': 0, 'COFINS R$': 0 };
    
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
    if (!diData.adicoes || diData.adicoes.length === 0) return null;
    const primeiraAdicao = diData.adicoes[0];
    const incoterm = primeiraAdicao.dadosGerais.INCOTERM;
    return (incoterm && incoterm !== 'N/A') ? incoterm.toUpperCase() : null;
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
// MAIN APPLICATION CLASS (versão com engine de cálculo completa)
// =============================================================================
function ImportDIApp() {
    this.dragDropZone = null;
    this.xmlParser = new DIXMLParser();
    this.currentDIData = null;
    this.currentFile = null;
    this.currentValidation = null;
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
            dragDropElement, fileInputElement,
            function(file) { self.handleFileSelected(file); }
        );
    }
};

ImportDIApp.prototype.setupEventListeners = function() {
    var self = this;
    
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
        processBtn.addEventListener('click', function() { self.handleProcessClick(); });
    }
    
    const freteCheckbox = document.getElementById('freteEmbutido');
    const seguroCheckbox = document.getElementById('seguroEmbutido');
    
    if (freteCheckbox) {
        freteCheckbox.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    if (seguroCheckbox) {
        seguroCheckbox.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    // ICMS e CFOP configuration
    const estadoDestino = document.getElementById('estadoDestino');
    const aliquotaICMSPadrao = document.getElementById('aliquotaICMSPadrao');
    const cfopPadrao = document.getElementById('cfopPadrao');
    
    if (estadoDestino) {
        estadoDestino.addEventListener('change', function() { self.handleEstadoChange(); });
    }
    
    if (aliquotaICMSPadrao) {
        aliquotaICMSPadrao.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    if (cfopPadrao) {
        cfopPadrao.addEventListener('change', function() { self.handleConfigChange(); });
    }
    
    // Export buttons
    const exportButtons = [
        { id: 'exportExcelBtn', handler: function() { self.handleExportExcel(); } },
        { id: 'exportCSVBtn', handler: function() { self.handleExportCSV(); } },
        { id: 'exportPDFBtn', handler: function() { self.handleExportPDF(); } },
        { id: 'saveConfigBtn', handler: function() { self.handleSaveConfig(); } }
    ];
    
    exportButtons.forEach(function(btn) {
        const button = document.getElementById(btn.id);
        if (button) button.addEventListener('click', btn.handler);
    });
    
    // Table actions
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
    if (this.isProcessing) return;
    
    try {
        this.currentFile = file;
        this.showConfigSection();
        this.enableProcessButton();
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
    if (!this.currentFile || this.isProcessing) return;
    
    var self = this;
    
    this.setProcessingState(true);
    this.hideError();
    
    this.updateProgress(10, 'Lendo arquivo...');
    
    this.readFileContent(this.currentFile).then(function(content) {
        self.updateProgress(30, 'Analisando estrutura XML...');
        return self.xmlParser.parseXML(content);
    }).then(function(diData) {
        self.currentDIData = diData;
        
        self.updateProgress(60, 'Calculando custos unitários...');
        return self.calculateCosts();
    }).then(function() {
        self.updateProgress(80, 'Validando resultados...');
        return self.validateResults();
    }).then(function() {
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
        reader.onload = function(event) { resolve(event.target.result); };
        reader.onerror = function() { reject(new Error('Erro ao ler arquivo')); };
        reader.readAsText(file, 'UTF-8');
    });
};

ImportDIApp.prototype.calculateCosts = function() {
    const freteEmbutido = document.getElementById('freteEmbutido').checked;
    const seguroEmbutido = document.getElementById('seguroEmbutido').checked;
    const aliquotaICMSPadrao = parseFloat(document.getElementById('aliquotaICMSPadrao').value) || 19;
    const cfopPadrao = document.getElementById('cfopPadrao').value || '3102';
    
    // Aplicar ICMS e CFOP padrão para todas as adições
    if (this.currentDIData && this.currentDIData.adicoes) {
        this.currentDIData.adicoes.forEach(function(adicao) {
            if (!adicao.dadosGerais.ICMS_ALIQUOTA) {
                adicao.dadosGerais.ICMS_ALIQUOTA = aliquotaICMSPadrao;
            }
            if (!adicao.dadosGerais.CFOP) {
                adicao.dadosGerais.CFOP = cfopPadrao;
            }
        });
    }
    
    // Aplicar engine de cálculo
    this.currentDIData = CostCalculator.calcularCustosUnitarios(
        this.currentDIData, freteEmbutido, seguroEmbutido
    );
    
    console.log('📊 Custos calculados:', this.currentDIData);
    
    return new Promise(function(resolve) {
        setTimeout(resolve, 500);
    });
};

ImportDIApp.prototype.validateResults = function() {
    const freteEmbutido = document.getElementById('freteEmbutido').checked;
    const seguroEmbutido = document.getElementById('seguroEmbutido').checked;
    
    this.currentValidation = CostCalculator.validarCustos(
        this.currentDIData, freteEmbutido, seguroEmbutido
    );
    
    console.log('🔍 Validação:', this.currentValidation);
    
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
    
    this.updateElement('totalAdicoes', stats.totalAdicoes.toString());
    this.updateElement('totalItens', stats.totalItens.toString());
    this.updateElement('valorFOB', Utils.formatCurrency(this.currentDIData.valores['FOB R$'] || 0));
    
    // Calcular custo total usando validação
    const custoTotal = this.currentValidation ? 
        this.currentValidation['Custo Total Calculado'] : 
        (this.currentDIData.valores['FOB R$'] + this.currentDIData.valores['Frete R$'] + 
         (this.currentDIData.valores['Seguro R$'] || 0) + this.currentDIData.tributos['II R$']);
    
    this.updateElement('custoTotal', Utils.formatCurrency(custoTotal));
};

ImportDIApp.prototype.populateValidationSection = function() {
    const validationResults = document.getElementById('validationResults');
    if (!validationResults || !this.currentValidation) return;
    
    const status = this.currentValidation.Status;
    const statusClass = status === 'OK' ? 'success' : 'error';
    
    validationResults.innerHTML = `
        <div class="validation-item">
            <span class="validation-label">Status da Validação</span>
            <span class="validation-value ${statusClass}">${status === 'OK' ? '✓' : '⚠'} ${status}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Custo Total Calculado</span>
            <span class="validation-value">${Utils.formatCurrency(this.currentValidation['Custo Total Calculado'])}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Valor Esperado</span>
            <span class="validation-value">${Utils.formatCurrency(this.currentValidation['Valor Esperado'])}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Diferença</span>
            <span class="validation-value">${Utils.formatCurrency(this.currentValidation['Diferença'])}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">% Diferença</span>
            <span class="validation-value">${Utils.formatNumber(this.currentValidation['% Diferença'], 4)}%</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Configuração</span>
            <span class="validation-value">${this.currentValidation['Configuração']}</span>
        </div>
    `;
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
    
    const custos = adicao.custos || {};
    const custoTotal = custos['Custo Total Adição R$'] || 0;
    const participacao = custos['% Participação'] || 0;
    
    // Obter valores padrão de CFOP e ICMS
    const cfopPadrao = document.getElementById('cfopPadrao').value || '3102';
    const aliquotaICMSPadrao = parseFloat(document.getElementById('aliquotaICMSPadrao').value) || 19;
    
    // Definir CFOP e ICMS para esta adição (usar valores específicos se existirem, senão usar padrão)
    const cfopAdicao = adicao.dadosGerais.CFOP || cfopPadrao;
    const icmsAdicao = adicao.dadosGerais.ICMS_ALIQUOTA || aliquotaICMSPadrao;
    
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
        <td>
            <select class="cfop-select" data-adicao="${index}" style="width:100px;font-size:0.8rem;">
                ${this.generateCFOPOptions(cfopAdicao)}
            </select>
        </td>
        <td>
            <input type="number" class="icms-input" data-adicao="${index}" 
                   value="${icmsAdicao}" min="0" max="100" step="0.01"
                   style="width:60px;font-size:0.8rem;">
        </td>
        <td>${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'])}</td>
        <td>${Utils.formatCurrency(custoTotal)}</td>
        <td>${Utils.formatCurrency(adicao.tributos['II R$'])}</td>
        <td>${Utils.formatNumber(participacao, 2)}%</td>
    `;
    
    // Adicionar event listeners para os campos editáveis
    var self = this;
    
    // Event listener para mudança na tabela (expand/collapse)
    row.addEventListener('click', function(e) {
        // Não expandir/contrair se o clique foi em um campo editável
        if (e.target.classList.contains('cfop-select') || e.target.classList.contains('icms-input')) {
            e.stopPropagation();
            return;
        }
        self.toggleRowExpansion(row, adicao);
    });
    
    // Event listeners para campos editáveis serão adicionados após inserção no DOM
    setTimeout(function() {
        const cfopSelect = row.querySelector('.cfop-select');
        const icmsInput = row.querySelector('.icms-input');
        
        if (cfopSelect) {
            cfopSelect.addEventListener('change', function(e) {
                e.stopPropagation();
                self.handleCFOPChange(index, this.value);
            });
        }
        
        if (icmsInput) {
            icmsInput.addEventListener('change', function(e) {
                e.stopPropagation();
                self.handleICMSChange(index, parseFloat(this.value));
            });
        }
    }, 10);
    
    return row;
};

ImportDIApp.prototype.generateCFOPOptions = function(selectedCFOP) {
    let options = '';
    for (const [codigo, descricao] of Object.entries(CONSTANTS.CFOP_OPTIONS)) {
        const selected = codigo === selectedCFOP ? 'selected' : '';
        options += `<option value="${codigo}" ${selected}>${codigo} - ${descricao}</option>`;
    }
    return options;
};

ImportDIApp.prototype.handleCFOPChange = function(adicaoIndex, novoCFOP) {
    if (this.currentDIData && this.currentDIData.adicoes[adicaoIndex]) {
        this.currentDIData.adicoes[adicaoIndex].dadosGerais.CFOP = novoCFOP;
        Utils.showToast(`CFOP da Adição ${adicaoIndex + 1} alterado para ${novoCFOP}`, 'info');
    }
};

ImportDIApp.prototype.handleICMSChange = function(adicaoIndex, novaAliquota) {
    if (this.currentDIData && this.currentDIData.adicoes[adicaoIndex]) {
        this.currentDIData.adicoes[adicaoIndex].dadosGerais.ICMS_ALIQUOTA = novaAliquota;
        
        // Recalcular os custos desta adição
        const adicao = this.currentDIData.adicoes[adicaoIndex];
        const tributos = adicao.tributos;
        const valores = adicao.valores;
        
        // Recalcular ICMS com nova alíquota
        const novosResultados = CostCalculator.calcularICMSPorDentro(
            valores['Valor Aduaneiro R$'],
            tributos['II R$'],
            tributos['IPI R$'],
            tributos['PIS R$'],
            tributos['COFINS R$'],
            0, // outras despesas
            novaAliquota / 100
        );
        
        // Atualizar valores calculados
        adicao.tributos['ICMS R$'] = novosResultados.icms;
        adicao.tributos['Base ICMS R$'] = novosResultados.base;
        
        // Recalcular custos totais
        adicao.custos = CostCalculator.calcularCustosAdicao(adicao, adicaoIndex);
        
        // Atualizar display
        this.populateResultsTable();
        Utils.showToast(`ICMS da Adição ${adicaoIndex + 1} alterado para ${novaAliquota}%`, 'success');
    }
};

ImportDIApp.prototype.toggleRowExpansion = function(row, adicao) {
    const icon = row.querySelector('.table-expand-icon');
    const isExpanded = row.classList.contains('table-row-expanded');
    
    if (isExpanded) {
        this.collapseRow(row);
        icon.textContent = '▶';
        row.classList.remove('table-row-expanded');
    } else {
        this.expandRow(row, adicao);
        icon.textContent = '▼';
        row.classList.add('table-row-expanded');
    }
};

ImportDIApp.prototype.expandRow = function(row, adicao) {
    if (row.nextElementSibling && row.nextElementSibling.classList.contains('table-detail-row')) {
        return; // Already expanded
    }
    
    const custos = adicao.custos || {};
    const detailRow = document.createElement('tr');
    detailRow.className = 'table-detail-row';
    
    let itemsTableHtml = '';
    if (adicao.itens && adicao.itens.length > 0) {
        var self = this;
        const itemRows = adicao.itens.map(function(item) {
            const custoPorPeca = item['Custo por Peça R$'];
            const custoPorPecaFormatted = custoPorPeca === "N/A" ? "N/A" : Utils.formatCurrency(custoPorPeca);
            
            return `
                <tr>
                    <td>${item.Seq}</td>
                    <td>${item.Código}</td>
                    <td title="${item.Descrição}">${self.truncateText(item.Descrição, 30)}</td>
                    <td>${Utils.formatNumber(item.Qtd)}</td>
                    <td>${item.Unidade}</td>
                    <td>${Utils.formatCurrency(item['Valor Unit. USD'])}</td>
                    <td>${item['Unid/Caixa']}</td>
                    <td>${Utils.formatCurrency(item['Custo Total Item R$'] || 0)}</td>
                    <td>${Utils.formatCurrency(item['Custo Unitário R$'] || 0)}</td>
                    <td>${custoPorPecaFormatted}</td>
                </tr>
            `;
        }).join('');
        
        itemsTableHtml = `
            <div style="margin-top: 1rem;">
                <h5>Itens Detalhados com Custos Unitários</h5>
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
                                <th>Custo Total R$</th>
                                <th>Custo Unit. R$</th>
                                <th>Custo/Peça R$</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
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
                        <p><strong>VCMV:</strong> ${Utils.formatCurrency(adicao.dadosGerais['VCMV R$'])}</p>
                    </div>
                    <div>
                        <h5>Tributos</h5>
                        <p><strong>II:</strong> ${Utils.formatCurrency(adicao.tributos['II R$'])} (${Utils.formatNumber(adicao.tributos['II Alíq. (%)'])}%)</p>
                        <p><strong>IPI:</strong> ${Utils.formatCurrency(adicao.tributos['IPI R$'])} (${Utils.formatNumber(adicao.tributos['IPI Alíq. (%)'])}%)</p>
                        <p><strong>PIS:</strong> ${Utils.formatCurrency(adicao.tributos['PIS R$'])} (${Utils.formatNumber(adicao.tributos['PIS Alíq. (%)'])}%)</p>
                        <p><strong>COFINS:</strong> ${Utils.formatCurrency(adicao.tributos['COFINS R$'])} (${Utils.formatNumber(adicao.tributos['COFINS Alíq. (%)'])}%)</p>
                    </div>
                    <div>
                        <h5>Análise de Custos</h5>
                        <p><strong>Valor Mercadoria:</strong> ${Utils.formatCurrency(custos['Valor Mercadoria R$'] || 0)}</p>
                        <p><strong>Frete Rateado:</strong> ${Utils.formatCurrency(custos['Frete Rateado R$'] || 0)}</p>
                        <p><strong>Seguro Rateado:</strong> ${Utils.formatCurrency(custos['Seguro Rateado R$'] || 0)}</p>
                        <p><strong>AFRMM Rateado:</strong> ${Utils.formatCurrency(custos['AFRMM Rateado R$'] || 0)}</p>
                        <p><strong>Siscomex Rateado:</strong> ${Utils.formatCurrency(custos['Siscomex Rateado R$'] || 0)}</p>
                        <p><strong>II Incorporado:</strong> ${Utils.formatCurrency(custos['II Incorporado R$'] || 0)}</p>
                        <p><strong>Custo Total:</strong> ${Utils.formatCurrency(custos['Custo Total Adição R$'] || 0)}</p>
                        <p><strong>% Participação:</strong> ${Utils.formatNumber(custos['% Participação'] || 0, 2)}%</p>
                    </div>
                </div>
                ${itemsTableHtml}
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

// Export handlers
ImportDIApp.prototype.handleExportExcel = function() {
    if (!this.currentDIData) {
        Utils.showToast('Nenhum dado para exportar', 'warning');
        return;
    }
    
    try {
        ExportSystem.exportToExcel(this.currentDIData, this.currentValidation);
        Utils.showToast('Planilha Excel exportada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar Excel:', error);
        Utils.showToast('Erro ao exportar Excel: ' + error.message, 'error');
    }
};

ImportDIApp.prototype.handleExportCSV = function() {
    if (!this.currentDIData) {
        Utils.showToast('Nenhum dado para exportar', 'warning');
        return;
    }
    
    const csv = ExportSystem.exportToDetailedCSV(this.currentDIData);
    Utils.downloadFile(csv, `DI_Detalhado_${this.currentDIData.cabecalho.DI}_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv');
    Utils.showToast('Dados exportados em CSV com sucesso!', 'success');
};

ImportDIApp.prototype.handleExportPDF = function() {
    if (!this.currentDIData) {
        Utils.showToast('Nenhum dado para exportar', 'warning');
        return;
    }
    
    try {
        ExportSystem.exportToPDF(this.currentDIData, this.currentValidation);
        Utils.showToast('Relatório PDF exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar PDF:', error);
        Utils.showToast('Erro ao exportar PDF: ' + error.message, 'error');
    }
};

ImportDIApp.prototype.handleSaveConfig = function() {
    const config = {
        freteEmbutido: document.getElementById('freteEmbutido').checked,
        seguroEmbutido: document.getElementById('seguroEmbutido').checked,
        estadoDestino: document.getElementById('estadoDestino').value,
        aliquotaICMSPadrao: parseFloat(document.getElementById('aliquotaICMSPadrao').value) || 19,
        cfopPadrao: document.getElementById('cfopPadrao').value || '3102',
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('expertzy_di_config', JSON.stringify(config));
    Utils.showToast('Configuração salva com sucesso!', 'success');
};

ImportDIApp.prototype.handleEstadoChange = function() {
    const estadoSelect = document.getElementById('estadoDestino');
    const aliquotaInput = document.getElementById('aliquotaICMSPadrao');
    
    if (estadoSelect && aliquotaInput) {
        const uf = estadoSelect.value;
        if (uf && CONSTANTS.ICMS_ALIQUOTAS_UF[uf]) {
            aliquotaInput.value = CONSTANTS.ICMS_ALIQUOTAS_UF[uf];
        }
    }
    
    this.handleConfigChange();
};

ImportDIApp.prototype.handleConfigChange = function() {
    // Recalcular se já tem dados processados
    if (this.currentDIData && !this.isProcessing) {
        Utils.showToast('Configuração alterada. Clique em "Processar" para recalcular.', 'info');
    }
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
        row.classList.remove('table-row-expanded');
    });
};

// UI State Management
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
    const resultsContainer = document.querySelector('#resultsContainer');
    
    Utils.toggleElementVisibility('#resultsSection', true);
    Utils.toggleElementVisibility('#exportSection', true);
    
    // Adicionar classe 'visible' ao results-container para mostrar as tabelas
    if (resultsContainer) {
        resultsContainer.classList.add('visible');
    }
};

ImportDIApp.prototype.showEmptyState = function() {
    Utils.toggleElementVisibility('#emptyState', true);
};

ImportDIApp.prototype.hideEmptyState = function() {
    Utils.toggleElementVisibility('#emptyState', false);
};

ImportDIApp.prototype.enableProcessButton = function() {
    const processBtn = document.getElementById('processBtn');
    if (processBtn) processBtn.disabled = false;
};

ImportDIApp.prototype.enableExportButtons = function() {
    const exportButtons = ['exportExcelBtn', 'exportCSVBtn', 'exportPDFBtn', 'invoiceSketchBtn', 'saveConfigBtn'];
    exportButtons.forEach(function(id) {
        const button = document.getElementById(id);
        if (button) button.disabled = false;
    });
    
    // Update invoice sketch data if available
    if (window.InvoiceSketch && this.currentDIData) {
        // Prepare processed data structure for the invoice sketch
        const processedData = {
            cotacao: this.currentDIData.valores?.['Cotação USD'] || 0,
            totais: {
                valorMercadorias: this.currentDIData.valores?.['FOB R$'] || 0,
                valorICMS: this.currentDIData.tributos?.['ICMS R$'] || 0,
                valorIPI: this.currentDIData.tributos?.['IPI R$'] || 0,
                valorII: this.currentDIData.tributos?.['II R$'] || 0,
                valorPIS: this.currentDIData.tributos?.['PIS R$'] || 0,
                valorCOFINS: this.currentDIData.tributos?.['COFINS R$'] || 0,
                frete: this.currentDIData.valores?.['Frete R$'] || 0,
                seguro: this.currentDIData.valores?.['Seguro R$'] || 0,
                baseICMS: this.currentValidation?.['Base ICMS Total'] || 0,
                valorTotal: this.currentValidation?.['Custo Total Calculado'] || 0,
                despesasAcessorias: 0
            },
            custosPorItem: this.extractItemCosts()
        };
        
        window.InvoiceSketch.updateData(this.currentDIData, processedData);
    }
};

// Helper method to extract costs per item
ImportDIApp.prototype.extractItemCosts = function() {
    const custosPorItem = {};
    
    if (this.currentDIData && this.currentDIData.adicoes) {
        this.currentDIData.adicoes.forEach((adicao, adicaoIndex) => {
            if (adicao.itens) {
                adicao.itens.forEach((item, itemIndex) => {
                    const key = `${adicaoIndex}-${itemIndex}`;
                    
                    // Calcular bases e valores proporcionais por item
                    const proporcaoItem = adicao.itens.length > 0 ? (item.Qtd || 0) / adicao.itens.reduce((sum, it) => sum + (it.Qtd || 0), 0) : 0;
                    
                    custosPorItem[key] = {
                        bcICMS: (adicao.tributos?.['Base ICMS R$'] || 0) * proporcaoItem,
                        valorICMS: (adicao.tributos?.['ICMS R$'] || 0) * proporcaoItem,
                        bcIPI: (adicao.tributos?.['Base IPI R$'] || 0) * proporcaoItem,
                        valorIPI: (adicao.tributos?.['IPI R$'] || 0) * proporcaoItem
                    };
                });
            }
        });
    }
    
    return custosPorItem;
};

ImportDIApp.prototype.showError = function(title, message, details) {
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const errorDetails = document.getElementById('errorDetails');
    
    if (errorContainer && errorMessage) {
        errorMessage.textContent = message;
        if (errorDetails && details) errorDetails.textContent = details;
        Utils.toggleElementVisibility(errorContainer, true);
    }
    
    Utils.showToast(`${title}: ${message}`, 'error');
};

ImportDIApp.prototype.hideError = function() {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) Utils.toggleElementVisibility(errorContainer, false);
};

ImportDIApp.prototype.updateElement = function(id, content) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
};

ImportDIApp.prototype.truncateText = function(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
};

ImportDIApp.prototype.resetApplication = function() {
    this.currentDIData = null;
    this.currentFile = null;
    this.currentValidation = null;
    this.isProcessing = false;
    
    if (this.dragDropZone) this.dragDropZone.reset();
    
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