# Sistema de Importação DI - Expertzy

Sistema web para processamento de XML da DI (Declaração de Importação) e cálculo de custos unitários.

## 🚀 Como usar

1. **Abra o arquivo `index.html` no navegador**
   ```bash
   # Navegue até a pasta do projeto
   cd web-system
   
   # Abra diretamente no navegador ou use um servidor local
   python -m http.server 8000
   # ou
   npx serve .
   ```

2. **Faça upload do XML da DI**
   - Arraste o arquivo XML para a área de upload
   - Ou clique para selecionar o arquivo

3. **Configure INCOTERM (se necessário)**
   - O sistema detecta automaticamente
   - Ajuste manualmente se preciso

4. **Processe e visualize os resultados**
   - Clique em "Processar e Calcular Custos"
   - Analise os resultados nas tabelas

5. **Exporte os dados** (em desenvolvimento)
   - Excel multi-aba
   - CSV para ERP
   - Relatório PDF

## 📁 Estrutura do Projeto

```
web-system/
├── index.html              # Página principal
├── css/                    # Estilos
│   ├── reset.css          # Reset CSS
│   ├── expertzy-brand.css # Identidade visual
│   ├── components.css     # Componentes
│   └── main.css          # Estilos principais
├── js/                    # JavaScript
│   ├── app.js            # Controlador principal
│   ├── core/             # Núcleo do sistema
│   ├── components/       # Componentes UI
│   ├── services/         # Serviços
│   └── utils/           # Utilitários
└── assets/              # Recursos
    ├── samples/         # XMLs de exemplo
    ├── icons/          # Ícones
    └── fonts/         # Fontes
```

## ✨ Funcionalidades

### ✅ Implementadas
- [x] Interface drag'n'drop para upload de XML
- [x] Parser completo de XML da DI brasileira
- [x] Detecção automática de INCOTERM
- [x] Configuração de frete/seguro embutido
- [x] Exibição de resultados em tabelas interativas
- [x] Validação de dados
- [x] Interface responsiva com identidade Expertzy

### 🔄 Em desenvolvimento
- [ ] Engine de cálculo de custos completa
- [ ] Validação cruzada de valores
- [ ] Exportação Excel multi-aba
- [ ] Exportação CSV e PDF
- [ ] Histórico de processamentos
- [ ] Configurações persistentes

### 🔮 Futuras
- [ ] Cálculo de preços de venda
- [ ] Integração com benefícios fiscais
- [ ] API para integrações
- [ ] Dashboard analítico

## 🎨 Identidade Visual

O sistema segue rigorosamente a identidade visual da Expertzy:

- **Cores principais:**
  - Vermelho Expertzy: `#FF002D`
  - Azul Naval: `#091A30`
  - Branco: `#FFFFFF`

- **Tipografia:**
  - Principal: `gadeg thin`
  - Secundária: `BRFirma Medium`

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Arquitetura:** Modular, sem frameworks
- **Compatibilidade:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Performance:** < 2s carregamento, < 5s processamento

## 📊 Teste com XML de exemplo

Use o arquivo `assets/samples/2300120746.xml` para testar o sistema.

## 🐛 Solução de problemas

### Arquivo não carrega
- Verifique se é um arquivo .xml válido
- Máximo 10MB de tamanho
- Use servidor local se houver problemas de CORS

### Erro no processamento
- Verifique a estrutura do XML da DI
- Consulte o console do navegador para detalhes
- Use XML válido da Receita Federal

### Interface não responsiva
- Atualize o navegador
- Verifique se CSS está carregando
- Teste em navegador suportado

## 📞 Suporte

Sistema desenvolvido pela **Expertzy Inteligência Tributária**

© 2025 Expertzy Inteligência Tributária