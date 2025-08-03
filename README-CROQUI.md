# Funcionalidade Croqui da Nota Fiscal de Entrada

## Visão Geral

Esta funcionalidade adiciona ao sistema a capacidade de gerar croquis da nota fiscal de entrada em formato Excel e PDF, baseado nos dados processados da DI (Declaração de Importação).

## Arquivos Criados

### 1. `/js/services/invoiceSketchGenerator.js`
**Descrição**: Motor principal para geração dos croquis
**Principais funcionalidades**:
- Processamento dos dados da DI para formato de croqui
- Geração de arquivo Excel com formatação adequada
- Geração de arquivo PDF com layout estruturado
- Cálculos de impostos e totais conforme padrão brasileiro

### 2. `/js/components/invoiceSketchPanel.js`
**Descrição**: Interface de usuário para o croqui
**Principais funcionalidades**:
- Modal/painel para exibição e configuração do croqui
- Preview dos dados antes da geração
- Opções de configuração (detalhamento, impostos)
- Controles de download (Excel/PDF)

### 3. `/css/invoice-sketch.css`
**Descrição**: Estilos para a interface do croqui
**Principais funcionalidades**:
- Design responsivo seguindo padrão Expertzy
- Animações e transições
- Layout da tabela de preview
- Indicadores de carregamento

### 4. `/web-system/js/invoice-sketch-integration.js`
**Descrição**: Integração com o sistema principal
**Principais funcionalidades**:
- Conexão com o sistema principal
- Gerenciamento de dados entre componentes
- Controle de estados e eventos

## Como Usar

### 1. Processamento da DI
1. Faça upload do arquivo XML da DI no sistema principal
2. Configure os parâmetros (INCOTERM, ICMS, etc.)
3. Execute o processamento dos custos

### 2. Geração do Croqui
1. Após o processamento, clique no botão "Croqui da NF" na seção de exportação
2. O painel do croqui será aberto mostrando:
   - Informações da DI (número, data, cotação)
   - Resumo dos valores calculados
   - Preview da tabela de itens
   - Opções de exportação

### 3. Exportação
1. **Excel**: Gera arquivo .xlsx com formatação completa, incluindo:
   - Cabeçalho com dados da DI
   - Tabela principal com todos os itens
   - Seção de cálculo de impostos
   - Formatação condicional e estilos

2. **PDF**: Gera arquivo .pdf com layout profissional, incluindo:
   - Cabeçalho formatado
   - Tabelas responsivas
   - Resumo de cálculos
   - Layout paisagem para melhor visualização

## Estrutura dos Dados

### Entrada
O sistema recebe os dados processados da DI contendo:
- `diData`: Dados originais do XML da DI
- `processedData`: Dados processados com custos calculados

### Saída (Croqui)
O croqui gerado contém:

#### Cabeçalho
- Número da DI
- Data de registro
- Cotação do dólar

#### Tabela Principal
Para cada item:
- Adição (número da adição)
- Item (código do item)
- Produto (descrição)
- NCM
- Peso
- Quantidades (caixas, por caixa, total)
- Valores unitário e total
- Base de cálculo e valor do ICMS
- Base de cálculo e valor do IPI
- Alíquotas de ICMS e IPI
- MVA, Base ST, ST, FP (quando aplicável)

#### Seção de Cálculos
- Base de cálculo do ICMS
- Valor do ICMS
- Valor total dos produtos
- Frete total
- Valor do seguro
- Valor do II
- Valor do IPI
- PIS e COFINS
- Valor total da nota

## Conformidade com Padrões

### Padrão Receita Federal
- Estrutura conforme layout oficial da nota fiscal de entrada
- Campos obrigatórios presentes
- Cálculos seguindo regras tributárias brasileiras

### Padrão Expertzy
- Cores e fontes da marca
- Layout responsivo
- Experiência de usuário consistente
- Mensagens de erro e sucesso padronizadas

## Funcionalidades Avançadas

### 1. Configurações
- Incluir/excluir detalhamento por item
- Incluir/excluir breakdown de impostos
- Personalização de campos exibidos

### 2. Validações
- Verificação de dados obrigatórios
- Validação de cálculos
- Tratamento de erros

### 3. Performance
- Geração assíncrona de arquivos
- Indicadores de progresso
- Otimização para arquivos grandes

## Integração com Sistema Principal

### Eventos
- `diProcessed`: Disparado quando DI é processada
- `sketchGenerated`: Disparado quando croqui é gerado
- `exportCompleted`: Disparado quando exportação é concluída

### API de Integração
```javascript
// Atualizar dados do croqui
window.invoiceSketchIntegration.updateData(diData, processedData);

// Abrir painel do croqui
window.invoiceSketchIntegration.open();
```

## Exemplo de Uso Programático

```javascript
// Criar instância do gerador
const generator = new InvoiceSketchGenerator();

// Definir dados
generator.setDIData(diData, processedData);

// Gerar e baixar Excel
await generator.downloadExcel('meu-croqui.xlsx');

// Gerar e baixar PDF
await generator.downloadPDF('meu-croqui.pdf');
```

## Dependências

### Bibliotecas Externas
- **SheetJS (xlsx)**: Para geração de arquivos Excel
- **jsPDF**: Para geração de arquivos PDF
- **jsPDF-AutoTable**: Para tabelas em PDF

### Módulos Internos
- Sistema principal de processamento da DI
- Componentes de UI do Expertzy
- Utilitários de formatação

## Limitações Conhecidas

1. **Tamanho de Arquivo**: Arquivos muito grandes podem causar lentidão
2. **Compatibilidade**: Requer navegadores modernos com suporte a ES6+
3. **Memória**: Processamento local limitado pela memória do navegador

## Roadmap Futuro

### Versão 1.1
- [ ] Exportação para outros formatos (CSV, XML)
- [ ] Templates personalizáveis
- [ ] Histórico de croquis gerados

### Versão 1.2
- [ ] Comparação entre croquis
- [ ] Assinatura digital
- [ ] Integração com sistemas ERP

### Versão 2.0
- [ ] Croqui de nota fiscal de saída
- [ ] Cálculo automático de preços de venda
- [ ] Integração com benefícios fiscais

## Suporte e Manutenção

Para dúvidas ou problemas:
1. Verifique o console do navegador para erros
2. Confirme se todas as dependências estão carregadas
3. Teste com arquivo DI válido
4. Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido por**: Expertzy Inteligência Tributária  
**Versão**: 1.0  
**Data**: Janeiro 2025