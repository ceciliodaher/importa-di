import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import xml.etree.ElementTree as ET
import pandas as pd
from pathlib import Path
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
log = logging.getLogger("ExtratoDI")


def parse_numeric_field(value, divisor=100):
    """Converte campos numéricos do XML que vêm com zeros à esquerda"""
    if not value:
        return 0.0
    try:
        clean_value = value.lstrip('0') or '0'
        return float(clean_value) / divisor
    except:
        return 0.0


def extrair_codigo_produto(descricao):
    """Extrai o código do produto da descrição"""
    if not descricao:
        return "N/A"
    parts = descricao.split(" - ")
    if len(parts) >= 2:
        return parts[0].strip()
    return "N/A"


def extrair_unidades_por_caixa(descricao):
    """Extrai quantidade de unidades por caixa da descrição"""
    if not descricao or "EM CX COM" not in descricao:
        return "N/A"
    try:
        parte = descricao.split("EM CX COM")[1].split("UNIDADES")[0].strip()
        return int(parte)
    except:
        return "N/A"


def calcular_custos_unitarios(dados, frete_embutido=False, seguro_embutido=False):
    """
    Calcula o custo unitário de cada item importado considerando:
    1. Valor da mercadoria (VCMV)
    2. Custos proporcionais (frete, seguro, AFRMM, Siscomex)
    3. Impostos incorporáveis (II - Imposto de Importação)

    Args:
        dados: Dicionário com os dados da DI
        frete_embutido: Boolean - Se True, considera que frete já está no VCMV
        seguro_embutido: Boolean - Se True, considera que seguro já está no VCMV
    """

    # Extrair totais da DI
    valor_total_di = dados["valores"]["FOB R$"]
    frete_total = dados["valores"]["Frete R$"] if not frete_embutido else 0.0
    seguro_total = dados.get("valores", {}).get("Seguro R$", 0.0) if not seguro_embutido else 0.0
    afrmm_total = dados.get("valores", {}).get("AFRMM R$", 0.0)
    siscomex_total = dados.get("valores", {}).get("Siscomex R$", 0.0)

    # Se frete/seguro estão embutidos, usar valor aduaneiro como base
    if frete_embutido or seguro_embutido:
        valor_base_calculo = dados["valores"]["Valor Aduaneiro R$"]
    else:
        valor_base_calculo = valor_total_di

    # Adicionar informações sobre configuração de custos
    dados["configuracao_custos"] = {
        "Frete Embutido": "Sim" if frete_embutido else "Não",
        "Seguro Embutido": "Sim" if seguro_embutido else "Não",
        "Base de Cálculo": "Valor Aduaneiro" if (frete_embutido or seguro_embutido) else "FOB",
        "Valor Base R$": valor_base_calculo,
        "Frete Considerado R$": frete_total,
        "Seguro Considerado R$": seguro_total,
        "AFRMM R$": afrmm_total,
        "Siscomex R$": siscomex_total
    }

    # Processar cada adição
    for adicao in dados["adicoes"]:
        valor_adicao = adicao["dados_gerais"]["VCMV R$"]

        # Calcular percentual da adição sobre a base correta
        if valor_base_calculo > 0:
            percentual_adicao = valor_adicao / valor_base_calculo
        else:
            percentual_adicao = 0

        # Ratear custos proporcionais (apenas os não embutidos)
        custo_frete_adicao = percentual_adicao * frete_total
        custo_seguro_adicao = percentual_adicao * seguro_total
        custo_afrmm_adicao = percentual_adicao * afrmm_total
        custo_siscomex_adicao = percentual_adicao * siscomex_total

        # Impostos incorporáveis (principalmente II)
        ii_adicao = adicao["tributos"]["II R$"]

        # Custo total da adição
        custo_total_adicao = (
                valor_adicao +
                custo_frete_adicao +
                custo_seguro_adicao +
                custo_afrmm_adicao +
                custo_siscomex_adicao +
                ii_adicao
        )

        # Adicionar dados de custo à adição
        adicao["custos"] = {
            "Valor Mercadoria R$": valor_adicao,
            "Frete Rateado R$": custo_frete_adicao,
            "Seguro Rateado R$": custo_seguro_adicao,
            "AFRMM Rateado R$": custo_afrmm_adicao,
            "Siscomex Rateado R$": custo_siscomex_adicao,
            "II Incorporado R$": ii_adicao,
            "Custo Total Adição R$": custo_total_adicao,
            "% Participação": percentual_adicao * 100,
            "Observações": f"Base: {'Valor Aduaneiro' if (frete_embutido or seguro_embutido) else 'FOB'}"
        }

        # Calcular custo unitário para cada item
        if adicao["itens"]:
            qtd_total_adicao = sum(item["Qtd"] for item in adicao["itens"])

            for item in adicao["itens"]:
                if qtd_total_adicao > 0:
                    proporcao_item = item["Qtd"] / qtd_total_adicao
                    custo_unitario_item = custo_total_adicao * proporcao_item

                    if item["Qtd"] > 0:
                        custo_por_unidade = custo_unitario_item / item["Qtd"]
                    else:
                        custo_por_unidade = 0

                    item["Custo Total Item R$"] = custo_unitario_item
                    item["Custo Unitário R$"] = custo_por_unidade

                    unid_caixa = item.get("Unid/Caixa", "N/A")
                    if isinstance(unid_caixa, int) and unid_caixa > 0:
                        custo_por_peca = custo_unitario_item / (item["Qtd"] * unid_caixa)
                        item["Custo por Peça R$"] = custo_por_peca
                    else:
                        item["Custo por Peça R$"] = "N/A"
                else:
                    item["Custo Total Item R$"] = 0
                    item["Custo Unitário R$"] = 0
                    item["Custo por Peça R$"] = 0


def validar_custos(dados, frete_embutido=False, seguro_embutido=False):
    """Valida se os custos calculados estão coerentes com os totais da DI"""

    # Somar custos de todas as adições
    custo_total_calculado = sum(
        adicao.get("custos", {}).get("Custo Total Adição R$", 0)
        for adicao in dados["adicoes"]
    )

    # Valor esperado baseado na configuração
    if frete_embutido or seguro_embutido:
        # Base: Valor Aduaneiro + despesas não embutidas + II
        valor_esperado = dados["valores"]["Valor Aduaneiro R$"]
        if not frete_embutido:
            valor_esperado += dados["valores"]["Frete R$"]
        if not seguro_embutido:
            valor_esperado += dados.get("valores", {}).get("Seguro R$", 0)
    else:
        # Base tradicional: FOB + todas as despesas
        valor_esperado = (
                dados["valores"]["FOB R$"] +
                dados["valores"]["Frete R$"] +
                dados.get("valores", {}).get("Seguro R$", 0)
        )

    # Adicionar despesas extras e impostos
    valor_esperado += (
            dados.get("valores", {}).get("AFRMM R$", 0) +
            dados.get("valores", {}).get("Siscomex R$", 0) +
            dados["tributos"]["II R$"]
    )

    diferenca = abs(custo_total_calculado - valor_esperado)
    percentual_diferenca = (diferenca / valor_esperado * 100) if valor_esperado > 0 else 0

    validacao = {
        "Custo Total Calculado": custo_total_calculado,
        "Valor Esperado": valor_esperado,
        "Diferença": diferenca,
        "% Diferença": percentual_diferenca,
        "Status": "OK" if percentual_diferenca < 0.01 else "DIVERGÊNCIA",
        "Configuração": f"Frete: {'Embutido' if frete_embutido else 'Separado'}, Seguro: {'Embutido' if seguro_embutido else 'Separado'}"
    }

    return validacao


def carrega_di_completo(xml_path: Path) -> dict:
    """Carrega o XML da DI com dados completos para cada adição"""
    tree = ET.parse(xml_path)
    root = tree.getroot()

    di = root.find("declaracaoImportacao")
    if di is None:
        raise ValueError("Elemento declaracaoImportacao não encontrado no XML")

    get = di.findtext

    dados = {
        "cabecalho": {
            "DI": get("numeroDI") or "N/A",
            "Data registro": get("dataRegistro") or "N/A",
            "URF despacho": get("urfDespachoNome") or "N/A",
            "Modalidade": get("modalidadeDespachoNome") or "N/A",
            "Qtd. adições": int(get("totalAdicoes", "0")),
            "Situação": get("situacaoEntregaCarga") or "N/A",
        },
        "importador": {
            "CNPJ": get("importadorNumero") or "N/A",
            "Nome": get("importadorNome") or "N/A",
            "Representante": get("importadorNomeRepresentanteLegal") or "N/A",
            "CPF repr.": get("importadorCpfRepresentanteLegal") or "N/A",
            "Endereço": ", ".join(filter(None, [
                get("importadorEnderecoLogradouro", ""),
                get("importadorEnderecoNumero", ""),
                get("importadorEnderecoBairro", ""),
                get("importadorEnderecoMunicipio", ""),
                get("importadorEnderecoUf", ""),
                get("importadorEnderecoCep", "")
            ])) or "N/A",
        },
        "carga": {
            "Manifesto": f"{get('documentoChegadaCargaNome', 'N/A')} {get('documentoChegadaCargaNumero', '')}".strip(),
            "Recinto": get("armazenamentoRecintoAduaneiroNome") or "N/A",
            "Armazém": (get("armazem") or "").strip() or "N/A",
            "Peso bruto (kg)": parse_numeric_field(get("cargaPesoBruto", "0"), 1000),
            "Peso líquido (kg)": parse_numeric_field(get("cargaPesoLiquido", "0"), 1000),
        },
        "valores": {
            "FOB USD": parse_numeric_field(get("localEmbarqueTotalDolares", "0")),
            "FOB R$": parse_numeric_field(get("localEmbarqueTotalReais", "0")),
            "Frete USD": parse_numeric_field(get("freteTotalDolares", "0")),
            "Frete R$": parse_numeric_field(get("freteTotalReais", "0")),
            "Seguro R$": parse_numeric_field(get("seguroTotalReais", "0")),
            "AFRMM R$": parse_numeric_field(get("afrmm", "0")),
            "Siscomex R$": parse_numeric_field(get("taxaSiscomex", "0")),
            "Valor Aduaneiro R$": parse_numeric_field(get("localDescargaTotalReais", "0")),
        },
        "adicoes": [],
        "info_complementar": (get("informacaoComplementar", "").strip() or "—")
    }

    # Processar cada adição
    for adicao_elem in di.findall("adicao"):
        g = adicao_elem.findtext

        adicao = {
            "numero": g("numeroAdicao") or "N/A",
            "numero_li": g("numeroLI") or "N/A",
            "dados_gerais": {
                "NCM": g("dadosMercadoriaCodigoNcm") or "N/A",
                "NBM": g("dadosMercadoriaCodigoNcm") or "N/A",
                "Descrição NCM": g("dadosMercadoriaNomeNcm") or "N/A",
                "VCMV USD": parse_numeric_field(g("condicaoVendaValorMoeda", "0")),
                "VCMV R$": parse_numeric_field(g("condicaoVendaValorReais", "0")),
                "INCOTERM": g("condicaoVendaIncoterm") or "N/A",
                "Local": g("condicaoVendaLocal") or "N/A",
                "Moeda": g("condicaoVendaMoedaNome") or "N/A",
                "Peso líq. (kg)": parse_numeric_field(g("dadosMercadoriaPesoLiquido", "0"), 1000),
                "Quantidade": parse_numeric_field(g("dadosMercadoriaMedidaEstatisticaQuantidade", "0"), 1000),
                "Unidade": (g("dadosMercadoriaMedidaEstatisticaUnidade") or "").strip() or "N/A",
            },
            "partes": {
                "Exportador": g("fornecedorNome") or "N/A",
                "País Aquisição": g("paisAquisicaoMercadoriaNome") or "N/A",
                "Fabricante": g("fabricanteNome") or "N/A",
                "País Origem": g("paisOrigemMercadoriaNome") or "N/A",
            },
            "tributos": {
                "II Alíq. (%)": parse_numeric_field(g("iiAliquotaAdValorem", "0"), 10000),
                "II Regime": g("iiRegimeTributacaoNome") or "N/A",
                "II R$": parse_numeric_field(g("iiAliquotaValorRecolher", "0")),
                "IPI Alíq. (%)": parse_numeric_field(g("ipiAliquotaAdValorem", "0"), 10000),
                "IPI Regime": g("ipiRegimeTributacaoNome") or "N/A",
                "IPI R$": parse_numeric_field(g("ipiAliquotaValorRecolher", "0")),
                "PIS Alíq. (%)": parse_numeric_field(g("pisPasepAliquotaAdValorem", "0"), 10000),
                "PIS R$": parse_numeric_field(g("pisPasepAliquotaValorRecolher", "0")),
                "COFINS Alíq. (%)": parse_numeric_field(g("cofinsAliquotaAdValorem", "0"), 10000),
                "COFINS R$": parse_numeric_field(g("cofinsAliquotaValorRecolher", "0")),
                "Base PIS/COFINS R$": parse_numeric_field(g("pisCofinsBaseCalculoValor", "0")),
                "Regime PIS/COFINS": g("pisCofinsRegimeTributacaoNome") or "N/A",
            },
            "itens": []
        }

        # Processar mercadorias (itens) da adição
        for mercadoria in adicao_elem.findall("mercadoria"):
            descricao = (mercadoria.findtext("descricaoMercadoria") or "").strip()
            qtd = parse_numeric_field(mercadoria.findtext("quantidade", "0"), 100000)
            valor_unit = parse_numeric_field(mercadoria.findtext("valorUnitario", "0"), 10000000)

            item = {
                "Seq": mercadoria.findtext("numeroSequencialItem", "N/A"),
                "Código": extrair_codigo_produto(descricao),
                "Descrição": descricao or "N/A",
                "Qtd": qtd,
                "Unidade": (mercadoria.findtext("unidadeMedida") or "").strip() or "N/A",
                "Valor Unit. USD": valor_unit,
                "Unid/Caixa": extrair_unidades_por_caixa(descricao),
                "Valor Total USD": qtd * valor_unit
            }

            adicao["itens"].append(item)

        dados["adicoes"].append(adicao)

    # Calcular totais de tributos
    if dados["adicoes"]:
        tributos_totais = {"II R$": 0, "IPI R$": 0, "PIS R$": 0, "COFINS R$": 0}
        for adicao in dados["adicoes"]:
            tributos_totais["II R$"] += adicao["tributos"]["II R$"]
            tributos_totais["IPI R$"] += adicao["tributos"]["IPI R$"]
            tributos_totais["PIS R$"] += adicao["tributos"]["PIS R$"]
            tributos_totais["COFINS R$"] += adicao["tributos"]["COFINS R$"]
        dados["tributos"] = tributos_totais
    else:
        dados["tributos"] = {"II R$": 0, "IPI R$": 0, "PIS R$": 0, "COFINS R$": 0}

    return dados


def gera_excel_completo(d: dict, xlsx: Path):
    """Gera Excel com aba para cada adição - COM CONFIGURAÇÃO DE CUSTOS"""
    with pd.ExcelWriter(xlsx, engine="xlsxwriter") as wr:
        wb = wr.book
        hdr = wb.add_format({"bold": True, "bg_color": "#D7E4BC"})
        hdr_secao = wb.add_format({"bold": True, "bg_color": "#4F81BD", "font_color": "white"})
        hdr_custo = wb.add_format({"bold": True, "bg_color": "#FFA500", "font_color": "white"})
        hdr_config = wb.add_format({"bold": True, "bg_color": "#9932CC", "font_color": "white"})
        money = wb.add_format({"num_format": "#,##0.00"})
        percent = wb.add_format({"num_format": "0.00%"})

        def simples(dic, aba, larg0=26, larg1=50):
            df_data = pd.DataFrame.from_dict(dic, orient="index", columns=["Valor"])
            df_data.to_excel(wr, aba)
            ws = wr.sheets[aba]
            ws.set_column(0, 0, larg0)
            ws.set_column(1, 1, larg1)
            ws.write_row(0, 0, ["Campo", "Valor"], hdr)

        # Abas gerais
        simples(d["cabecalho"], "01_Capa")
        simples(d["importador"], "02_Importador")
        simples(d["carga"], "03_Carga")
        simples(d["valores"], "04_Valores")

        # NOVA ABA: Configuração de Custos
        if "configuracao_custos" in d:
            config_df = pd.DataFrame.from_dict(d["configuracao_custos"], orient="index", columns=["Valor"])
            config_df.to_excel(wr, "04A_Config_Custos")
            ws = wr.sheets["04A_Config_Custos"]
            ws.set_column(0, 0, 25)
            ws.set_column(1, 1, 25, money)
            ws.write_row(0, 0, ["Configuração", "Valor"], hdr_config)

        # Tributos totais
        pd.Series(d["tributos"]).rename("Total (R$)").to_frame().to_excel(wr, "05_Tributos_Totais")
        ws = wr.sheets["05_Tributos_Totais"]
        ws.set_column(0, 0, 20)
        ws.set_column(1, 1, 14, money)
        ws.write_row(0, 0, ["Imposto", "Total (R$)"], hdr)

        # Validação de custos
        if "validacao_custos" in d:
            validacao_df = pd.DataFrame.from_dict(d["validacao_custos"], orient="index", columns=["Valor"])
            validacao_df.to_excel(wr, "05A_Validacao_Custos")
            ws = wr.sheets["05A_Validacao_Custos"]
            ws.set_column(0, 0, 25)
            ws.set_column(1, 1, 25)
            ws.write_row(0, 0, ["Métrica", "Valor"], hdr)

            # Colorir status
            for i, (idx, row) in enumerate(validacao_df.iterrows(), 2):
                if idx == "Status":
                    status_format = wb.add_format(
                        {"bold": True, "bg_color": "#90EE90" if row["Valor"] == "OK" else "#FFB6C1"})
                    ws.write(i, 1, row["Valor"], status_format)
                elif "R$" in str(row["Valor"]) or idx in ["Custo Total Calculado", "Valor Esperado", "Diferença"]:
                    ws.write(i, 1, row["Valor"], money)

        # Resumo de adições COM CUSTOS
        resumo_adicoes = []
        for ad in d["adicoes"]:
            descricao = ad["dados_gerais"]["Descrição NCM"] or "N/A"
            if len(descricao) > 50:
                descricao = descricao[:50] + "..."

            custos = ad.get("custos", {})
            resumo_adicoes.append({
                "Nº": ad["numero"],
                "NCM": ad["dados_gerais"]["NCM"],
                "Descrição": descricao,
                "INCOTERM": ad["dados_gerais"]["INCOTERM"],
                "VCMV R$": ad["dados_gerais"]["VCMV R$"],
                "Custo Total R$": custos.get("Custo Total Adição R$", 0),
                "II R$": ad["tributos"]["II R$"],
                "Total Tributos R$": (ad["tributos"]["II R$"] + ad["tributos"]["IPI R$"] +
                                      ad["tributos"]["PIS R$"] + ad["tributos"]["COFINS R$"])
            })

        if resumo_adicoes:
            df_resumo = pd.DataFrame(resumo_adicoes)
            df_resumo.to_excel(wr, "06_Resumo_Adicoes", index=False)
            ws = wr.sheets["06_Resumo_Adicoes"]
            ws.freeze_panes(1, 0)

            # Configurar colunas
            for col, width in enumerate([5, 12, 50, 10, 12, 15, 12, 16]):
                ws.set_column(col, col, width)

            # Formatar colunas monetárias
            for c in [4, 5, 6, 7]:
                ws.set_column(c, c, None, money)

            # Cabeçalhos
            for c in range(len(df_resumo.columns)):
                header_format = hdr_custo if "Custo" in df_resumo.columns[c] else hdr
                ws.write(0, c, df_resumo.columns[c], header_format)

        # Resumo de custos por adição
        resumo_custos = []
        for ad in d["adicoes"]:
            custos = ad.get("custos", {})
            if custos:
                resumo_custos.append({
                    "Adição": ad["numero"],
                    "NCM": ad["dados_gerais"]["NCM"],
                    "INCOTERM": ad["dados_gerais"]["INCOTERM"],
                    "Valor Mercadoria R$": custos.get("Valor Mercadoria R$", 0),
                    "Frete Rateado R$": custos.get("Frete Rateado R$", 0),
                    "Seguro Rateado R$": custos.get("Seguro Rateado R$", 0),
                    "AFRMM Rateado R$": custos.get("AFRMM Rateado R$", 0),
                    "Siscomex Rateado R$": custos.get("Siscomex Rateado R$", 0),
                    "II Incorporado R$": custos.get("II Incorporado R$", 0),
                    "Custo Total R$": custos.get("Custo Total Adição R$", 0),
                    "% Participação": custos.get("% Participação", 0)
                })

        if resumo_custos:
            df_custos = pd.DataFrame(resumo_custos)
            df_custos.to_excel(wr, "06A_Resumo_Custos", index=False)
            ws = wr.sheets["06A_Resumo_Custos"]
            ws.freeze_panes(1, 0)

            # Configurar larguras
            for col, width in enumerate([8, 12, 10, 15, 12, 12, 12, 12, 15, 15, 12]):
                ws.set_column(col, col, width)

            # Formatar colunas
            for c in range(3, 10):  # Colunas monetárias
                ws.set_column(c, c, None, money)
            ws.set_column(10, 10, None, percent)  # % Participação

            # Cabeçalhos
            for c in range(len(df_custos.columns)):
                ws.write(0, c, df_custos.columns[c], hdr_custo)

        # Criar aba para cada adição com custos
        for i, ad in enumerate(d["adicoes"], 1):
            numero_adicao = ad["numero"] or str(i).zfill(3)
            aba_nome = f"Add_{numero_adicao}"

            ws = wb.add_worksheet(aba_nome)
            current_row = 0

            # SEÇÃO 1: DADOS GERAIS
            ws.write(current_row, 0, "DADOS GERAIS", hdr_secao)
            ws.write(current_row, 1, "", hdr_secao)
            current_row += 1

            ws.write(current_row, 0, "Campo", hdr)
            ws.write(current_row, 1, "Valor", hdr)
            current_row += 1

            for campo, valor in ad["dados_gerais"].items():
                ws.write(current_row, 0, campo)
                if isinstance(valor, (int, float)) and campo in ["VCMV R$", "Peso líq. (kg)"]:
                    ws.write(current_row, 1, valor, money)
                else:
                    ws.write(current_row, 1, valor)
                current_row += 1

            current_row += 1

            # SEÇÃO 2: PARTES ENVOLVIDAS
            ws.write(current_row, 0, "PARTES ENVOLVIDAS", hdr_secao)
            ws.write(current_row, 1, "", hdr_secao)
            current_row += 1

            ws.write(current_row, 0, "Campo", hdr)
            ws.write(current_row, 1, "Valor", hdr)
            current_row += 1

            for campo, valor in ad["partes"].items():
                ws.write(current_row, 0, campo)
                ws.write(current_row, 1, valor)
                current_row += 1

            current_row += 1

            # SEÇÃO 3: TRIBUTOS
            ws.write(current_row, 0, "TRIBUTOS", hdr_secao)
            ws.write(current_row, 1, "", hdr_secao)
            current_row += 1

            ws.write(current_row, 0, "Campo", hdr)
            ws.write(current_row, 1, "Valor", hdr)
            current_row += 1

            for campo, valor in ad["tributos"].items():
                ws.write(current_row, 0, campo)
                if isinstance(valor, (int, float)) and ("R$" in campo or "%" in campo):
                    if "%" in campo:
                        ws.write(current_row, 1, valor / 100, percent)
                    else:
                        ws.write(current_row, 1, valor, money)
                else:
                    ws.write(current_row, 1, valor)
                current_row += 1

            current_row += 1

            # SEÇÃO 4: ANÁLISE DE CUSTOS
            if "custos" in ad:
                ws.write(current_row, 0, "ANÁLISE DE CUSTOS", hdr_custo)
                ws.write(current_row, 1, "", hdr_custo)
                current_row += 1

                ws.write(current_row, 0, "Componente", hdr)
                ws.write(current_row, 1, "Valor (R$)", hdr)
                current_row += 1

                for campo, valor in ad["custos"].items():
                    ws.write(current_row, 0, campo)
                    if isinstance(valor, (int, float)):
                        if "%" in campo:
                            ws.write(current_row, 1, valor / 100, percent)
                        else:
                            ws.write(current_row, 1, valor, money)
                    else:
                        ws.write(current_row, 1, valor)
                    current_row += 1

                current_row += 1

            # SEÇÃO 5: ITENS DETALHADOS COM CUSTOS
            ws.write(current_row, 0, "ITENS DETALHADOS COM CUSTOS", hdr_secao)
            for col in range(1, 12):
                ws.write(current_row, col, "", hdr_secao)
            current_row += 1

            if ad["itens"]:
                cabecalhos_itens = [
                    "Seq", "Código", "Descrição", "Qtd", "Unidade",
                    "Valor Unit. USD", "Unid/Caixa", "Valor Total USD",
                    "Custo Total R$", "Custo Unit. R$", "Custo/Peça R$"
                ]

                for col, cabecalho in enumerate(cabecalhos_itens):
                    header_format = hdr_custo if "Custo" in cabecalho else hdr
                    ws.write(current_row, col, cabecalho, header_format)
                current_row += 1

                for item in ad["itens"]:
                    ws.write(current_row, 0, item["Seq"])
                    ws.write(current_row, 1, item["Código"])
                    ws.write(current_row, 2, item["Descrição"])
                    ws.write(current_row, 3, item["Qtd"])
                    ws.write(current_row, 4, item["Unidade"])
                    ws.write(current_row, 5, item["Valor Unit. USD"], money)
                    ws.write(current_row, 6, item["Unid/Caixa"])
                    ws.write(current_row, 7, item["Valor Total USD"], money)
                    ws.write(current_row, 8, item.get("Custo Total Item R$", 0), money)
                    ws.write(current_row, 9, item.get("Custo Unitário R$", 0), money)

                    custo_peca = item.get("Custo por Peça R$", "N/A")
                    if custo_peca != "N/A":
                        ws.write(current_row, 10, custo_peca, money)
                    else:
                        ws.write(current_row, 10, "N/A")

                    current_row += 1

                # Linha de totais
                current_row += 1
                ws.write(current_row, 2, "TOTAL:", hdr)
                total_qtd = sum(item["Qtd"] for item in ad["itens"])
                total_valor_usd = sum(item["Valor Total USD"] for item in ad["itens"])
                total_custo_brl = sum(item.get("Custo Total Item R$", 0) for item in ad["itens"])

                ws.write(current_row, 3, total_qtd, hdr)
                ws.write(current_row, 7, total_valor_usd, money)
                ws.write(current_row, 8, total_custo_brl, money)
            else:
                ws.write(current_row, 0, "Nenhum item detalhado encontrado", hdr)

            # Configurar larguras das colunas
            ws.set_column(0, 0, 8)  # Seq
            ws.set_column(1, 1, 12)  # Código
            ws.set_column(2, 2, 60)  # Descrição
            ws.set_column(3, 3, 10)  # Qtd
            ws.set_column(4, 4, 12)  # Unidade
            ws.set_column(5, 5, 15)  # Valor Unit.
            ws.set_column(6, 6, 12)  # Unid/Caixa
            ws.set_column(7, 7, 15)  # Valor Total
            ws.set_column(8, 8, 15)  # Custo Total
            ws.set_column(9, 9, 15)  # Custo Unit.
            ws.set_column(10, 10, 15)  # Custo/Peça

        # Dados complementares
        pd.DataFrame({"Dados Complementares": [d["info_complementar"]]}).to_excel(
            wr, "99_Complementar", index=False)
        ws = wr.sheets["99_Complementar"]
        ws.set_column(0, 0, 120)
        ws.write_row(0, 0, ["Dados Complementares"], hdr)

        # === CROQUI DE NOTA FISCAL DE ENTRADA DE IMPORTAÇÃO - MODELO 55 === #
        ws_croqui = wb.add_worksheet("Croqui_NFe_Entrada")
        linha = 0

        def secao(titulo):
            nonlocal linha
            ws_croqui.write(linha, 0, titulo, hdr_secao)
            linha += 1

        secao("CABEÇALHO DA NOTA")
        ws_croqui.write_row(linha, 0, ["Série", "Modelo", "Tipo de Operação", "Natureza da Operação", "Finalidade",
                                    "Data de Emissão", "Chave de Acesso"])
        ws_croqui.write_row(linha+1, 0, [1, 55, "0 (entrada)", "Importação do exterior (CFOP 3102)", 1,  "", ""])
        linha += 3

        # EMITENTE/IMPORTADOR
        secao("EMITENTE / IMPORTADOR")
        ws_croqui.write_row(linha, 0, ["CNPJ", "Razão Social", "Endereço"])
        ws_croqui.write_row(linha+1, 0, [d["importador"]["CNPJ"], d["importador"]["Nome"], d["importador"]["Endereço"]])
        linha += 3

        # REMETENTE/EXPORTADOR (EXTERIOR)
        secao("REMETENTE / EXPORTADOR (EXTERIOR)")
        primeira_ad = d["adicoes"][0]
        ws_croqui.write_row(linha, 0, ["Nome Exportador", "País de Aquisição"])
        ws_croqui.write_row(linha+1, 0, [primeira_ad["partes"]["Exportador"], primeira_ad["partes"]["País Aquisição"]])
        linha += 3

        # DADOS DA DI
        secao("DADOS DA DECLARAÇÃO DE IMPORTAÇÃO")
        ws_croqui.write_row(linha, 0, ["Número DI", "Registro", "URF", "Modalidade"])
        ws_croqui.write_row(linha+1, 0, [d["cabecalho"]["DI"], d["cabecalho"]["Data registro"], d["cabecalho"]["URF despacho"], d["cabecalho"]["Modalidade"]])
        linha += 3

        # PRODUTOS E SERVIÇOS
        secao("PRODUTOS E SERVIÇOS")
        cols_itens = ["Seq", "Descrição", "NCM", "Quantidade", "Unidade", "Valor Unit. (R$)", "Valor Total (R$)", 
                    "CFOP", "Origem", "CST ICMS", "Alq. ICMS (%)", "IPI CST", "IPI Alíq. (%)", "Fabricante"]
        for idx, c in enumerate(cols_itens):
            ws_croqui.write(linha, idx, c, hdr)
        linha += 1
        seq_nota = 1
        for ad in d["adicoes"]:
            ncm = ad["dados_gerais"]["NCM"]
            fabricante = ad["partes"]["Fabricante"]
            origem = ad["partes"]["País Origem"]
            cfop = "3102"
            cst_icms = "00"
            icms_aliq = 18.0  # ajuste conforme estado/legislação
            ipi_cst = "00"
            ipi_aliq = round(ad["tributos"].get("IPI Alíq. (%)", 0)*100, 2)
            for item in ad["itens"]:
                valor_unit_brl = item.get("Custo Unitário R$", 0)
                valor_total_brl = item.get("Custo Total Item R$", 0)
                ws_croqui.write_row(
                    linha, 0,
                    [seq_nota, item["Descrição"], ncm, item["Qtd"], item["Unidade"], valor_unit_brl, valor_total_brl,
                    cfop, "3", cst_icms, icms_aliq, ipi_cst, ipi_aliq, fabricante]
                )
                linha += 1
                seq_nota += 1

        # BASE E CÁLCULO DO ICMS
        linha += 2
        secao("BASE DE CÁLCULO DO ICMS IMPORTAÇÃO")
        ws_croqui.write_row(linha, 0, ["Valor Aduaneiro", d["valores"]["Valor Aduaneiro R$"]])
        ws_croqui.write_row(linha+1, 0, ["II", d["tributos"]["II R$"]])
        ws_croqui.write_row(linha+2, 0, ["IPI", d["tributos"]["IPI R$"]])
        ws_croqui.write_row(linha+3, 0, ["PIS", d["tributos"]["PIS R$"]])
        ws_croqui.write_row(linha+4, 0, ["COFINS", d["tributos"]["COFINS R$"]])
        outras_desp = d["valores"].get("Siscomex R$", 0) + d["valores"].get("AFRMM R$", 0)
        ws_croqui.write_row(linha+5, 0, ["Outras despesas", outras_desp])
        linha += 6

        base_icms_sem_icms = (
            d["valores"]["Valor Aduaneiro R$"] +
            d["tributos"]["II R$"] + d["tributos"]["IPI R$"] +
            d["tributos"]["PIS R$"] + d["tributos"]["COFINS R$"] + outras_desp
        )
        ws_croqui.write_row(linha, 0, ["Base ICMS Sem ICMS", base_icms_sem_icms])
        linha += 1
        aliq = 18.0 / 100
        base_final_icms = round(base_icms_sem_icms / (1 - aliq), 2)
        ws_croqui.write_row(linha, 0, ["Base Final do ICMS", base_final_icms])
        linha += 1
        ws_croqui.write_row(linha, 0, ["ICMS a Recolher", round(base_final_icms * aliq, 2)])
        linha += 2

        # SEÇÃO EXTRA: INFORMAÇÕES COMPLEMENTARES
        secao("INFORMAÇÕES COMPLEMENTARES / OBSERVAÇÕES OBRIGATÓRIAS")
        info_extra = f"DI: {d['cabecalho']['DI']} - Data Registro: {d['cabecalho']['Data registro']}\n"
        info_extra += d["info_complementar"]
        ws_croqui.write(linha, 0, info_extra)
        linha += 4

        # Ajuste visual
        for col_idx, width in enumerate([5,50,12,9,8,18,18,8,6,10,14,8,8,30]):
            ws_croqui.set_column(col_idx, col_idx, width)

        ws_croqui.write(linha+2, 0, "LEGENDAS: CFOP 3102=Compra p/ comercialização; CST ICMS=00; Origem=3(estrangeira)")

class AppExtrato(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Extrato DI com Custos Unitários e Configuração de Frete/Seguro – XML → Excel")
        self.geometry("950x600")
        self.xml_path = tk.StringVar()
        self.excel_path = tk.StringVar()
        self.frete_embutido = tk.BooleanVar()
        self.seguro_embutido = tk.BooleanVar()
        self._monta_widgets()

    def _monta_widgets(self):
        frm = ttk.Frame(self, padding=20)
        frm.pack(fill="both", expand=True)

        # Título
        ttk.Label(frm, text="Extrato DI com Custos Unitários e Configuração de Frete/Seguro",
                  font=("Arial", 14, "bold"), foreground="green").grid(row=0, column=0, columnspan=3, pady=(0, 15))

        # Descrição
        desc_text = """🚀 FUNCIONALIDADES:
• Cálculo de custos unitários com rateiro proporcional de despesas e impostos
• Opção para frete/seguro embutido no VCMV (INCOTERM CFR/CIF) - EVITA DUPLA CONTABILIZAÇÃO
• Detecção automática de INCOTERM no XML
• Validação automática contra totais da DI
• Planilha completa para entrada fiscal com análise detalhada de custos"""

        ttk.Label(frm, text=desc_text, font=("Arial", 9), foreground="blue",
                  wraplength=900, justify="left").grid(row=1, column=0, columnspan=3, pady=(0, 15))

        # Seleção de arquivo XML
        grupo_arq_xml = ttk.LabelFrame(frm, text="1. Seleção do Arquivo XML da DI", padding=15)
        grupo_arq_xml.grid(row=2, column=0, columnspan=3, sticky="ew", pady=(0, 15))
        grupo_arq_xml.columnconfigure(1, weight=1)

        ttk.Label(grupo_arq_xml, text="Arquivo XML:").grid(row=0, column=0, sticky="w", padx=(0, 10))
        ttk.Entry(grupo_arq_xml, textvariable=self.xml_path, state="readonly") \
            .grid(row=0, column=1, sticky="ew", padx=(0, 10))
        ttk.Button(grupo_arq_xml, text="Procurar XML…", command=self._abrir_xml) \
            .grid(row=0, column=2)

        # NOVA SEÇÃO: Configuração de Custos
        grupo_custos = ttk.LabelFrame(frm, text="2. Configuração de Custos (IMPORTANTE para INCOTERM CFR/CIF)",
                                      padding=15)
        grupo_custos.grid(row=3, column=0, columnspan=3, sticky="ew", pady=(0, 15))

        # Frame para organizar as opções
        frame_opcoes = ttk.Frame(grupo_custos)
        frame_opcoes.grid(row=0, column=0, columnspan=3, sticky="ew")
        frame_opcoes.columnconfigure(0, weight=1)
        frame_opcoes.columnconfigure(1, weight=1)

        # Checkbox Frete Embutido
        frame_frete = ttk.Frame(frame_opcoes)
        frame_frete.grid(row=0, column=0, sticky="w", padx=(0, 20))

        ttk.Checkbutton(frame_frete, text="Frete embutido no VCMV",
                        variable=self.frete_embutido, command=self._atualizar_info_custos) \
            .grid(row=0, column=0, sticky="w")
        ttk.Label(frame_frete, text="(Marque se INCOTERM for CFR ou CIF)",
                  font=("Arial", 8), foreground="gray") \
            .grid(row=1, column=0, sticky="w")

        # Checkbox Seguro Embutido
        frame_seguro = ttk.Frame(frame_opcoes)
        frame_seguro.grid(row=0, column=1, sticky="w")

        ttk.Checkbutton(frame_seguro, text="Seguro embutido no VCMV",
                        variable=self.seguro_embutido, command=self._atualizar_info_custos) \
            .grid(row=0, column=0, sticky="w")
        ttk.Label(frame_seguro, text="(Marque se INCOTERM for CIF)",
                  font=("Arial", 8), foreground="gray") \
            .grid(row=1, column=0, sticky="w")

        # Label informativo sobre configuração
        self.lbl_info_custos = ttk.Label(grupo_custos,
                                         text="ℹ️ Configuração atual: Frete e seguro separados (INCOTERM FOB/EXW)",
                                         font=("Arial", 9), foreground="blue")
        self.lbl_info_custos.grid(row=1, column=0, columnspan=3, pady=(10, 0))

        # Seleção de local para salvar Excel
        grupo_arq_excel = ttk.LabelFrame(frm, text="3. Local para Salvar o Excel", padding=15)
        grupo_arq_excel.grid(row=4, column=0, columnspan=3, sticky="ew", pady=(0, 15))
        grupo_arq_excel.columnconfigure(1, weight=1)

        ttk.Label(grupo_arq_excel, text="Salvar como:").grid(row=0, column=0, sticky="w", padx=(0, 10))
        ttk.Entry(grupo_arq_excel, textvariable=self.excel_path, state="readonly") \
            .grid(row=0, column=1, sticky="ew", padx=(0, 10))
        ttk.Button(grupo_arq_excel, text="Escolher Local…", command=self._escolher_local) \
            .grid(row=0, column=2)

        # Processamento
        grupo_proc = ttk.LabelFrame(frm, text="4. Processamento", padding=15)
        grupo_proc.grid(row=5, column=0, columnspan=3, sticky="ew", pady=(0, 15))

        self.bt_exec = ttk.Button(grupo_proc, text="🧮 Gerar Extrato com Custos Unitários",
                                  command=self._executar, state="disabled")
        self.bt_exec.grid(row=0, column=0, pady=10)

        # Status
        grupo_status = ttk.LabelFrame(frm, text="5. Status", padding=15)
        grupo_status.grid(row=6, column=0, columnspan=3, sticky="ew")
        grupo_status.columnconfigure(0, weight=1)

        self.lbl = ttk.Label(grupo_status,
                             text="🎯 VERSÃO COM CONFIGURAÇÃO DE CUSTOS\n"
                                  "• Configure se frete/seguro estão embutidos no VCMV\n"
                                  "• Evita dupla contabilização em INCOTERM CFR/CIF\n"
                                  "1. Selecione o arquivo XML da DI\n"
                                  "2. Configure os custos conforme INCOTERM\n"
                                  "3. Escolha onde salvar o arquivo Excel",
                             wraplength=850, foreground="green")
        self.lbl.grid(row=0, column=0, sticky="w")

        frm.columnconfigure(1, weight=1)

    def _atualizar_info_custos(self):
        """Atualiza o texto informativo baseado nas opções selecionadas"""
        frete = self.frete_embutido.get()
        seguro = self.seguro_embutido.get()

        if frete and seguro:
            texto = "⚠️ Configuração: Frete E seguro embutidos no VCMV (INCOTERM CIF)"
            cor = "red"
        elif frete:
            texto = "⚠️ Configuração: Frete embutido no VCMV (INCOTERM CFR)"
            cor = "orange"
        elif seguro:
            texto = "⚠️ Configuração: Seguro embutido no VCMV (raro, verificar INCOTERM)"
            cor = "orange"
        else:
            texto = "ℹ️ Configuração: Frete e seguro separados (INCOTERM FOB/EXW)"
            cor = "blue"

        self.lbl_info_custos.config(text=texto, foreground=cor)

    def _abrir_xml(self):
        f = filedialog.askopenfilename(title="Selecione o XML da DI",
                                       filetypes=[("XML", "*.xml"), ("Todos arquivos", "*.*")])
        if f:
            self.xml_path.set(f)
            xml_name = Path(f).stem
            sugestao = Path(f).parent / f"ExtratoDI_CUSTOS_{xml_name}.xlsx"
            self.excel_path.set(str(sugestao))
            self._verificar_pronto()
            self.lbl.config(text=f"✅ XML selecionado: {Path(f).name}\n"
                                 f"Configure os custos e escolha onde salvar o Excel.")

            # Tentar detectar INCOTERM automaticamente
            self._detectar_incoterm_automatico(f)

    def _detectar_incoterm_automatico(self, xml_path):
        """Tenta detectar INCOTERM do XML e sugerir configuração"""
        try:
            tree = ET.parse(xml_path)
            root = tree.getroot()
            di = root.find("declaracaoImportacao")

            if di is not None:
                # Verificar INCOTERM da primeira adição
                primeiro_adicao = di.find("adicao")
                if primeiro_adicao is not None:
                    incoterm = primeiro_adicao.findtext("condicaoVendaIncoterm", "")

                    if incoterm in ["CFR", "CIF"]:
                        self.frete_embutido.set(True)
                        if incoterm == "CIF":
                            self.seguro_embutido.set(True)
                        self._atualizar_info_custos()

                        # Mostrar mensagem informativa
                        messagebox.showinfo("INCOTERM Detectado!",
                                            f"INCOTERM {incoterm} detectado no XML!\n\n"
                                            f"Configuração automática aplicada:\n"
                                            f"• Frete embutido: {'Sim' if self.frete_embutido.get() else 'Não'}\n"
                                            f"• Seguro embutido: {'Sim' if self.seguro_embutido.get() else 'Não'}\n\n"
                                            f"⚠️ IMPORTANTE: Esta configuração evita dupla\n"
                                            f"contabilização do frete/seguro no cálculo de custos.\n\n"
                                            f"Você pode alterar manualmente se necessário.")
        except Exception as e:
            # Ignorar erros de detecção automática
            pass

    def _escolher_local(self):
        nome_padrao = "ExtratoDI_CUSTOS.xlsx"
        if self.xml_path.get():
            xml_name = Path(self.xml_path.get()).stem
            nome_padrao = f"ExtratoDI_CUSTOS_{xml_name}.xlsx"

        f = filedialog.asksaveasfilename(
            title="Salvar Extrato Excel como...",
            defaultextension=".xlsx",
            initialfilename=nome_padrao,
            filetypes=[("Excel", "*.xlsx"), ("Todos arquivos", "*.*")]
        )

        if f:
            self.excel_path.set(f)
            self._verificar_pronto()
            self.lbl.config(text=f"✅ Excel será salvo como: {Path(f).name}\n" +
                                 ("✅ Pronto para processar!" if self.xml_path.get() else "Selecione o XML da DI."))

    def _verificar_pronto(self):
        if self.xml_path.get() and self.excel_path.get():
            self.bt_exec.config(state="normal")
            self.lbl.config(text="🚀 Pronto para gerar extrato com custos configurados!", foreground="green")
        else:
            self.bt_exec.config(state="disabled")

    def _executar(self):
        try:
            self.bt_exec.config(state="disabled")
            self.lbl.config(text="🔄 Processando XML e calculando custos unitários... Aguarde.", foreground="blue")
            self.update()

            # Processar dados
            dados = carrega_di_completo(Path(self.xml_path.get()))

            # Calcular custos com as opções selecionadas
            calcular_custos_unitarios(dados,
                                      frete_embutido=self.frete_embutido.get(),
                                      seguro_embutido=self.seguro_embutido.get())

            # Validar custos
            dados["validacao_custos"] = validar_custos(dados,
                                                       frete_embutido=self.frete_embutido.get(),
                                                       seguro_embutido=self.seguro_embutido.get())

            # Gerar arquivo Excel
            excel_path = Path(self.excel_path.get())
            gera_excel_completo(dados, excel_path)

            num_adicoes = len(dados.get('adicoes', []))
            total_itens = sum(len(ad.get('itens', [])) for ad in dados.get('adicoes', []))

            validacao = dados.get('validacao_custos', {})
            status_validacao = validacao.get('Status', 'N/A')
            diferenca_percent = validacao.get('% Diferença', 0)

            self.lbl.config(text=f"🎉 Extrato salvo: {excel_path.name}\n"
                                 f"📊 {num_adicoes} adições, {total_itens} itens processados\n"
                                 f"🔍 Validação: {status_validacao} (diferença: {diferenca_percent:.3f}%)",
                            foreground="green")

            # Mensagem de sucesso personalizada
            config_msg = ""
            if self.frete_embutido.get() or self.seguro_embutido.get():
                config_msg = f"\n🔧 Configuração aplicada:\n"
                config_msg += f"• Frete embutido: {'Sim' if self.frete_embutido.get() else 'Não'}\n"
                config_msg += f"• Seguro embutido: {'Sim' if self.seguro_embutido.get() else 'Não'}"

            messagebox.showinfo("Custos Unitários Calculados!",
                                f"🎉 Extrato completo gerado com sucesso!\n\n"
                                f"📁 Arquivo: {excel_path.name}\n"
                                f"📊 {num_adicoes} adições processadas\n"
                                f"🛍️ {total_itens} itens com custos unitários\n"
                                f"🔍 Validação: {status_validacao}\n"
                                f"📈 Diferença: {diferenca_percent:.4f}%"
                                f"{config_msg}\n\n"
                                f"✅ Novidades incluídas:\n"
                                f"• Configuração de frete/seguro embutido\n"
                                f"• Detecção automática de INCOTERM\n"
                                f"• Validação adaptada à configuração\n"
                                f"• Planilha com análise completa de custos!")

        except Exception as e:
            log.exception(e)
            messagebox.showerror("Erro", f"❌ Erro ao processar:\n{str(e)}")
            self.lbl.config(text=f"❌ Erro: {str(e)}", foreground="red")
        finally:
            self.bt_exec.config(state="normal")


if __name__ == "__main__":
    AppExtrato().mainloop()
