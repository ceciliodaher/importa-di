# 📋 INSTRUÇÕES DE USO - Sistema DI Expertzy

## 🚀 Como usar (SEM servidor local)

### Método 1: Duplo clique (Mais fácil)
1. Navegue até a pasta `web-system`
2. **Duplo clique** no arquivo `index.html`
3. O sistema abrirá diretamente no seu navegador padrão
4. ✅ **Pronto para usar!**

### Método 2: Arrastar para o navegador
1. Abra seu navegador (Chrome, Firefox, Edge, Safari)
2. **Arraste** o arquivo `index.html` para a janela do navegador
3. ✅ **Funcionando!**

## 📁 Testando o sistema

1. **Arraste um arquivo XML** para a área de upload
   - Use o arquivo de exemplo: `assets/samples/2300120746.xml`
   - Ou qualquer XML de DI válido

2. **Configure parâmetros** 
   - **INCOTERM**: Detectado automaticamente, ajuste se necessário
   - **Estado de destino**: Selecione a UF (padrão: Goiás)
   - **Alíquota ICMS**: Atualizada automaticamente conforme UF (editável)
   - **CFOP padrão**: Selecione o CFOP adequado (padrão: 3102)

3. **Processe os dados**
   - Clique em "Processar e Calcular Custos"
   - Aguarde a análise completa

4. **Visualize os resultados**
   - Tabelas interativas expansíveis
   - Resumo executivo
   - Dados detalhados por adição
   - **Edição individual**: CFOP e ICMS editáveis por adição

5. **Exporte os resultados**
   - **Excel completo**: Com aba profissional "Croqui NFe Entrada"
   - **CSV**: Para importação em ERP
   - **PDF**: Relatório executivo

## ✅ O que está funcionando

- ✅ **Upload drag'n'drop** de arquivos XML
- ✅ **Parser completo** da estrutura DI
- ✅ **Detecção automática** de INCOTERM
- ✅ **Interface responsiva** com identidade Expertzy
- ✅ **Validação** de arquivos e dados
- ✅ **Exibição detalhada** de resultados
- ✅ **Tabelas expansíveis** com drill-down
- ✅ **Feedback visual** completo
- ✅ **Engine de cálculo** de custos unitários completa
- ✅ **Validação cruzada** com totais da DI (±R$0,01)
- ✅ **Configuração de ICMS** por estado brasileiro
- ✅ **Seleção de CFOP** configurável por adição
- ✅ **Edição individual** de CFOP e ICMS por adição
- ✅ **Exportação Excel** com aba "Croqui NFe Entrada" profissional
- ✅ **Exportação** CSV com dados detalhados
- ✅ **Exportação** PDF de relatórios
- ✅ **Relatórios** de validação e resumo

## 💡 Funcionalidades Avançadas

### Configuração por Estado
- **Alíquotas ICMS**: Predefinidas por UF, editáveis
- **Goiás**: 19% (padrão), **São Paulo**: 18%, **Rio de Janeiro**: 20%
- **Atualização automática** ao selecionar estado

### CFOP Configurável
- **9 opções** principais de CFOP para importação
- **3102**: Compra para comercialização (padrão)
- **3101**: Compra para industrialização
- **Edição individual** por adição

### Sistema de Exportação Completo
- **Excel profissional**: Replica exatamente o padrão Python original
- **Aba "Croqui NFe Entrada"**: Layout brasileiro oficial
- **Dados configuráveis**: CFOP e ICMS específicos por item

## 🔄 Pendente

- 🔄 **Testes** com arquivos XML reais de diferentes URFs
- 🔄 **Exportação** PDF formatado
- 🔄 **Histórico** de processamentos

## 🎨 Visual

O sistema segue a identidade visual da **Expertzy**:
- **Vermelho**: #FF002D (destaques)
- **Azul**: #091A30 (textos)
- **Branco**: #FFFFFF (fundos)

## 🔧 Compatibilidade

### ✅ Navegadores suportados
- **Chrome** 80+ (Recomendado)
- **Firefox** 75+
- **Edge** 80+
- **Safari** 13+

### ❌ O que NÃO funciona
- Internet Explorer (não suportado)
- Navegadores muito antigos
- Modo privado em alguns navegadores (limitações de FileReader)

## 📞 Problemas?

### Arquivo não carrega
- ✅ Verifique se é um arquivo `.xml` válido
- ✅ Máximo 10MB de tamanho
- ✅ Use um navegador moderno

### Interface não aparece corretamente
- ✅ Atualize a página (F5)
- ✅ Limpe o cache do navegador
- ✅ Teste em outro navegador

### Erro no processamento
- ✅ Verifique se o XML é uma DI válida da Receita Federal
- ✅ Consulte o console do navegador (F12) para detalhes

## 🎯 Próximos passos

Após testar o sistema básico, as próximas implementações serão:

1. **Engine de cálculo** completa (replicar lógica Python)
2. **Sistema de exportação** (Excel multi-aba, CSV, PDF)
3. **Validação avançada** com tolerância de ±R$0,01
4. **Histórico** e configurações persistentes

---

**Sistema desenvolvido pela Expertzy Inteligência Tributária**
© 2025 Expertzy Inteligência Tributária