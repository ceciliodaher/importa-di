# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a web-based Brazilian import cost calculation and invoice generation system for **Expertzy Inteligência Tributária**. The project aims to replace the existing Python application with a modern, modular web system that processes DI (Declaração de Importação - Import Declaration) XML files, calculates import costs, and will eventually include sales price calculation with fiscal benefits.

## Development Goals

### Phase 1: Core DI Processing System
- Convert Python functionality to modular HTML/CSS/JavaScript
- XML import and validation of Brazilian import declarations
- Cost calculation engine with INCOTERM-aware processing
- Excel/PDF report generation
- Responsive web interface following Expertzy brand guidelines

### Phase 2: Sales Price Calculation
- Extend system to calculate sales prices from import costs
- Integration of Brazilian fiscal benefits for imports
- Multi-state tax calculation (ICMS, DIFAL, ST)
- Margin calculation with different customer types (consumer/reseller)

## Architecture Requirements

### Technology Stack
- **Frontend**: Vanilla HTML, CSS, JavaScript (modular ES6+)
- **No frameworks initially**: Keep it simple and expandable
- **No build tools**: Direct browser compatibility
- **Modular structure**: Easy to extend and maintain

### File Structure
```
/
├── index.html                 # Main entry point
├── css/
│   ├── reset.css             # CSS reset
│   ├── expertzy-brand.css    # Brand identity styles
│   └── main.css              # Application styles
├── js/
│   ├── services/             # Data processing modules
│   │   ├── xmlParser.js      # DI XML parsing
│   │   ├── costCalculator.js # Cost calculation engine
│   │   └── reportGenerator.js # Report generation
│   ├── components/           # UI components
│   │   ├── fileUpload.js     # XML file upload
│   │   ├── configPanel.js    # INCOTERM configuration
│   │   └── resultsTable.js   # Results display
│   └── app.js                # Main application controller
├── assets/                   # Images, fonts, icons
└── docs/                     # Documentation and samples
```

## Brand Identity Requirements

### Expertzy Visual Standards
All interfaces must follow Expertzy brand guidelines:

#### Color Palette
- **Primary Red**: #FF002D (buttons, highlights, headers)
- **Navy Blue**: #091A30 (text, navigation, secondary backgrounds)  
- **White**: #FFFFFF (main backgrounds, contrast areas)

#### Typography
- **Primary Font**: 'gadeg thin' (titles, highlights)
- **Secondary Font**: 'BRFirma Medium' (body text, forms)

#### CSS Variables
```css
:root {
    --expertzy-red: #FF002D;
    --expertzy-blue: #091A30;
    --expertzy-white: #FFFFFF;
    --font-primary: 'gadeg thin', sans-serif;
    --font-secondary: 'BRFirma Medium', sans-serif;
}
```

#### Required Elements
- Header with Expertzy branding and color scheme
- Footer: "© 2025 Expertzy Inteligência Tributária"
- Logo space reserved (120px x 40px minimum)
- Consistent button styling (primary/secondary variants)

## Core Business Logic

### DI XML Processing
The system must replicate the Python application's functionality:

#### Key Functions to Implement
1. **XML Validation**: Validate against Receita Federal schema
2. **Data Extraction**: Parse hierarchical DI structure
3. **Cost Calculation**: Proportional distribution with INCOTERM awareness
4. **Unit Cost Calculation**: Per-item and per-piece calculations
5. **Cost Validation**: Verify calculations against DI totals

#### DI Data Structure
```javascript
{
  cabecalho: { DI, dataRegistro, URF, modalidade, qtdAdicoes, situacao },
  importador: { CNPJ, nome, endereco, representante },
  carga: { manifesto, recinto, pesoBruto, pesoLiquido },
  valores: { FOB_USD, FOB_BRL, frete, seguro, AFRMM, siscomex, valorAduaneiro },
  adicoes: [
    {
      numero, numeroLI,
      dadosGerais: { NCM, descricao, VCMV, INCOTERM, quantidade, unidade },
      partes: { exportador, paisAquisicao, fabricante, paisOrigem },
      tributos: { II, IPI, PIS, COFINS, aliquotas },
      itens: [
        { seq, codigo, descricao, qtd, valorUnit, unidCaixa }
      ]
    }
  ]
}
```

### Cost Calculation Engine
Critical business rules for Brazilian import costs:

#### INCOTERM Handling
- **FOB/EXW**: Freight and insurance separate from VCMV
- **CFR**: Freight embedded in VCMV (avoid double counting)
- **CIF**: Both freight and insurance embedded in VCMV

#### Tax Components
- **II (Import Duty)**: Base = Customs Value (CIF)
- **IPI**: Base = Customs Value + II
- **PIS/COFINS**: Base = Customs Value + II + IPI  
- **ICMS**: Base = (Customs Value + II + IPI + PIS + COFINS + expenses) / (1 - ICMS rate)

#### Cost Distribution
Proportional distribution across items based on:
- Value proportion for monetary costs (freight, insurance, duties)
- Weight proportion for weight-based costs (storage, handling)
- Quantity consideration for unit cost calculation

## Development Commands

### Local Development
```bash
# Serve files locally (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Or with VS Code Live Server extension
```

### Testing Strategy
1. **Cross-browser testing**: Chrome, Firefox, Safari, Edge
2. **Mobile responsiveness**: Test on various screen sizes
3. **XML validation**: Test with sample DI files from `orientacoes/`
4. **Cost accuracy**: Verify against Python application results
5. **Brand compliance**: Visual review against Expertzy guidelines

## Future Development Phases

### Phase 2: Sales Price Module
Extend the system to include:
- **Sales price calculation** from import costs
- **Fiscal benefits integration** (PRODEPE, other state incentives)
- **Multi-state tax calculation** (ICMS, DIFAL, FCP, ST)
- **Customer type handling** (consumer final vs reseller)
- **Margin calculation** with configurable percentages

### Phase 3: Enterprise Features  
- **Database integration** for persistent storage
- **User authentication** and role management
- **API development** for external integrations
- **Advanced reporting** with PDF/Excel generation
- **Audit trail** and compliance tracking

## Key Files and References

### Current Python Implementation
- `orientacoes/importador-xml-di-nf-entrada.py` - Main application to replicate
- `orientacoes/2300120746.xml` - Sample DI XML for testing
- `orientacoes/ExtratoDI_CUSTOS_2300120746.xlsx` - Expected output format

### Documentation
- `orientacoes/Especificação Funcional e Técnica.md` - Technical specification
- `orientacoes/Sistema de Emissão de Nota Fiscal de Importação a.md` - Invoice system spec
- `orientacoes/Fluxo de trabalho até a emissão da Nota Fiscal.md` - Complete workflow

### Brand Resources
- `C:\Users\cecil\git\Webpage\Marca\_Arquivos da Marca\expertzy-brand-guidelines.md` - Brand guidelines
- `C:\Users\cecil\git\Webpage\Marca\Logo\` - Expertzy logos
- `C:\Users\cecil\git\Webpage\Marca\_Fontes do Projeto\` - Brand fonts

## Quality Standards

### Code Quality
- Use ES6+ modules with clear imports/exports
- Follow consistent naming conventions
- Comment complex business logic thoroughly
- Implement error handling for all XML processing
- Maintain separation of concerns (parsing, calculation, UI)

### Performance
- Lazy load components when possible
- Optimize for mobile devices
- Minimize DOM manipulations
- Cache calculated results appropriately

### Accuracy Requirements
- Cost calculations must match Python output within ±R$0.01
- All Brazilian tax rules must be precisely implemented
- INCOTERM detection and handling must be accurate
- Currency conversion must use proper precision

## Detailed Implementation Plan

### 🏗️ **Complete System Architecture**

#### **Expanded File Structure**
```
importa-di-web/
├── index.html                          # Main entry point
├── css/
│   ├── reset.css                       # CSS reset
│   ├── expertzy-brand.css              # Expertzy identity styles
│   ├── components.css                  # Reusable components
│   └── main.css                        # Application styles
├── js/
│   ├── app.js                          # Main application controller
│   ├── core/
│   │   ├── xmlParser.js                # DI XML parsing engine
│   │   ├── costCalculator.js           # Cost calculation engine
│   │   ├── validator.js                # Data validation system
│   │   └── dataStructures.js           # DI data structures
│   ├── components/
│   │   ├── dragDropZone.js             # Drag'n'drop XML upload
│   │   ├── configPanel.js              # INCOTERM configuration
│   │   ├── resultsTable.js             # Interactive results tables
│   │   ├── exportButtons.js            # Export functionality
│   │   └── statusIndicator.js          # User feedback system
│   ├── services/
│   │   ├── fileHandler.js              # File manipulation
│   │   ├── reportGenerator.js          # Excel/PDF generation
│   │   └── dataStorage.js              # LocalStorage/IndexedDB
│   └── utils/
│       ├── formatters.js               # Number/date formatting
│       ├── helpers.js                  # Helper functions
│       └── constants.js                # System constants
├── assets/
│   ├── icons/                          # System icons
│   ├── fonts/                          # Expertzy fonts
│   └── samples/                        # Sample XML files
└── docs/
    └── manual-usuario.md               # User manual
```

### 🎨 **User Interface Design**

#### **Main Layout Specification**
```
┌─────────────────────────────────────────────┐
│ [LOGO EXPERTZY]    IMPORTAÇÃO DI   [CONFIG] │ ← Header (#FF002D bg)
├─────────────────────────────────────────────┤
│                                             │
│   ┌─────────────────────────────────┐       │
│   │     📁 ARRASTE SEU XML AQUI     │       │ ← Drag'n'Drop Zone
│   │        ou clique para selecionar│       │   (dashed border, hover effects)
│   └─────────────────────────────────┘       │
│                                             │
│ ┌─────────┐ ┌──────────┐ ┌─────────────┐   │ ← INCOTERM Config
│ │ ☐ Frete │ │ ☐ Seguro │ │ 💾 Processar │   │   (auto-detection)
│ │ Embutido│ │ Embutido │ │             │   │
│ └─────────┘ └──────────┘ └─────────────┘   │
│                                             │
│ ┌─────────────────────────────────────────┐ │ ← Results Area
│ │        RESULTADOS DE CUSTOS             │ │   (collapsible sections)
│ │ ┌─────┬──────────┬──────────┬────────┐ │ │
│ │ │ NCM │ Produto  │ Custo R$ │ Ações  │ │ │
│ │ └─────┴──────────┴──────────┴────────┘ │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [📊 Excel] [📄 CSV] [📋 Relatório] [💾 Salvar]│ ← Export Buttons
├─────────────────────────────────────────────┤
│ © 2025 Expertzy Inteligência Tributária    │ ← Footer (#091A30 text)
└─────────────────────────────────────────────┘
```

### ⚙️ **Core Functionality Specification**

#### **1. Drag'n'Drop Upload System**
- **Visual feedback**: Highlight on drag over, progress indicators
- **File validation**: XML format, DI structure validation
- **Error handling**: Clear error messages with suggestions
- **Multiple files**: Support for batch processing

#### **2. XML Processing Engine**
- **Parser compatibility**: 100% compatible with Python parser
- **Data extraction**: Complete DI hierarchy (cabecalho, adicoes, itens)
- **INCOTERM detection**: Automatic CFR/CIF/FOB identification
- **Validation**: Cross-reference calculations with DI totals

#### **3. Cost Calculation System**
- **Proportional distribution**: Value-based and weight-based ratios
- **Tax calculations**: II, IPI, PIS, COFINS, ICMS with Brazilian rules
- **INCOTERM handling**: Freight/insurance embedding options
- **Unit costs**: Per-item and per-piece calculations

#### **4. Interactive Results Display**
- **Expandable tables**: Drill-down from DI → Additions → Items
- **Real-time updates**: Recalculate on configuration changes
- **Visual indicators**: Cost validation status, warnings
- **Export preparation**: Pre-formatted data for reports

#### **5. Report Generation**
- **Excel multi-sheet**: Identical to Python output format
- **CSV export**: ERP-ready format
- **PDF reports**: Executive summary with charts
- **Historical data**: Previous calculations storage

### 🚀 **Implementation Roadmap**

#### **Phase 1: Foundation (Weeks 1-2)**
**Goals**: Basic functional system
- [ ] Setup project structure and build system
- [ ] Implement core CSS with Expertzy branding
- [ ] Create drag'n'drop file upload component
- [ ] Basic XML parser for DI structure
- [ ] Simple cost calculation (without INCOTERM)
- [ ] Basic results table display

**Deliverables**:
- Working drag'n'drop interface
- XML file parsing and data extraction
- Basic cost calculations displayed in table
- Responsive layout with Expertzy branding

#### **Phase 2: Core Logic (Weeks 3-4)**
**Goals**: Complete calculation engine
- [ ] Advanced XML parser with full DI structure
- [ ] Complete cost calculation engine
- [ ] INCOTERM detection and configuration
- [ ] Data validation system
- [ ] Error handling and user feedback
- [ ] Cost validation against DI totals

**Deliverables**:
- 100% accurate cost calculations
- INCOTERM configuration working
- Comprehensive error handling
- Data validation matching Python output

#### **Phase 3: User Experience (Weeks 5-6)**
**Goals**: Professional interface
- [ ] Advanced UI components and interactions
- [ ] Mobile responsive design
- [ ] Loading indicators and animations
- [ ] Help system and tooltips
- [ ] Advanced table features (sorting, filtering)
- [ ] Configuration persistence

**Deliverables**:
- Polished, professional interface
- Mobile-friendly responsive design
- Enhanced user experience features
- Configuration saving/loading

#### **Phase 4: Reports & Finalization (Weeks 7-8)**
**Goals**: Complete system
- [ ] Excel export with multiple sheets
- [ ] CSV export for ERP integration
- [ ] PDF report generation
- [ ] Data storage and history
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] User documentation

**Deliverables**:
- Complete export functionality
- Historical data management
- Optimized performance
- Full documentation
- Production-ready system

### 🎯 **Feature Priority Matrix**

#### **MVP (Must Have)**
1. ✅ Drag'n'drop XML upload
2. ✅ DI XML parsing and validation
3. ✅ Basic cost calculation engine
4. ✅ INCOTERM configuration
5. ✅ Results table display
6. ✅ Excel export (basic)

#### **Version 1.0 (Should Have)**
1. ✅ Advanced XML parser (complete DI structure)
2. ✅ Full cost calculation with all taxes
3. ✅ Cost validation system
4. ✅ Professional UI with Expertzy branding
5. ✅ Multi-format export (Excel, CSV, PDF)
6. ✅ Error handling and user feedback

#### **Version 1.1 (Could Have)**
1. 🔄 Historical data and comparisons
2. 🔄 Advanced reporting with charts
3. 🔄 Batch processing multiple files
4. 🔄 Configuration templates
5. 🔄 Export scheduling
6. 🔄 API integration preparation

#### **Future Versions (Won't Have Initially)**
1. 🔮 Sales price calculation module
2. 🔮 Fiscal benefits integration
3. 🔮 Multi-state tax calculations
4. 🔮 ERP system integrations
5. 🔮 Cloud storage and collaboration
6. 🔮 Advanced analytics and dashboards

### 🔧 **Technical Requirements**

#### **Core Technologies**
- **JavaScript ES6+**: Native modules, no bundler required
- **CSS Grid/Flexbox**: Modern responsive layouts
- **Web APIs**: File API, DOMParser, LocalStorage, IndexedDB
- **External Libraries** (minimal):
  - SheetJS for Excel generation
  - jsPDF for PDF reports
  - Chart.js for visualizations (future)

#### **Performance Targets**
- **Load time**: < 2 seconds on 3G connection
- **Processing**: < 5 seconds for typical DI file
- **Memory usage**: < 50MB for large DI files
- **Browser support**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

#### **Quality Assurance**
- **Calculation accuracy**: ±R$0.01 tolerance vs Python
- **Cross-browser testing**: All major browsers
- **Mobile responsiveness**: Tablets and large phones
- **Accessibility**: WCAG 2.1 AA compliance
- **Security**: Client-side only, no data transmission

### 📊 **Success Metrics**

#### **Technical Metrics**
- 100% calculation accuracy vs Python application
- < 5 second processing time for standard DI
- 0 critical bugs in production
- Support for 95%+ of DI XML variations

#### **User Experience Metrics**
- < 30 seconds to process first DI file
- < 5 clicks to generate complete report
- 0 user training required for basic functionality
- Positive feedback on interface vs Python app

#### **Business Metrics**
- Complete replacement of Python application
- Foundation for Phase 2 (sales price calculation)
- Extensible architecture for future modules
- Professional presentation matching Expertzy brand

This system will serve as the foundation for Expertzy's suite of import management tools, requiring high accuracy, professional presentation, and seamless expandability.