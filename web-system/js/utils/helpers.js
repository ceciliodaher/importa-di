/*
EXPERTZY INTELIGÊNCIA TRIBUTÁRIA
© 2025 Expertzy Inteligência Tributária
Helper Functions - Funções auxiliares e utilitários
*/

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds (default: 5000)
 */
export function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Fechar">&times;</button>
        </div>
    `;
    
    // Add close functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

/**
 * Removes a toast notification
 * @param {HTMLElement} toast - Toast element to remove
 */
function removeToast(toast) {
    if (toast && toast.parentNode) {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

/**
 * Gets the appropriate icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon HTML
 */
function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

/**
 * Formats a number as Brazilian currency
 * @param {number} value - Number to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return 'R$ 0,00';
    }
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Formats a number with Brazilian locale
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export function formatNumber(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0';
    }
    
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

/**
 * Formats a percentage value
 * @param {number} value - Percentage value (0-100)
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '0%';
    }
    
    return new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value / 100);
}

/**
 * Formats a date for Brazilian locale
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Whether to include time (default: false)
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
    }
    
    return new Intl.DateTimeFormat('pt-BR', options).format(dateObj);
}

/**
 * Parses a numeric field from XML (handles leading zeros and divisors)
 * @param {string} value - Value from XML
 * @param {number} divisor - Divisor to apply (default: 100)
 * @returns {number} Parsed numeric value
 */
export function parseNumericField(value, divisor = 100) {
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
}

/**
 * Extracts product code from description
 * @param {string} descricao - Product description
 * @returns {string} Extracted product code
 */
export function extrairCodigoProduto(descricao) {
    if (!descricao) {
        return "N/A";
    }
    
    const parts = descricao.split(" - ");
    if (parts.length >= 2) {
        return parts[0].trim();
    }
    
    return "N/A";
}

/**
 * Extracts units per box from description
 * @param {string} descricao - Product description
 * @returns {number|string} Units per box or "N/A"
 */
export function extrairUnidadesPorCaixa(descricao) {
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
}

/**
 * Shows/hides elements with fade animation
 * @param {HTMLElement|string} element - Element or selector
 * @param {boolean} show - Whether to show or hide
 */
export function toggleElementVisibility(element, show) {
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
        
        setTimeout(() => {
            el.classList.add('expertzy-hidden');
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
        }, 300);
    }
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
}

/**
 * Validates if a value is a valid number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid number
 */
export function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Safely gets a nested property from an object
 * @param {object} obj - Object to get property from
 * @param {string} path - Dot-separated path to property
 * @param {any} defaultValue - Default value if property not found
 * @returns {any} Property value or default
 */
export function getNestedProperty(obj, path, defaultValue = null) {
    if (!obj || !path) return defaultValue;
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
        if (current === null || current === undefined || !(key in current)) {
            return defaultValue;
        }
        current = current[key];
    }
    
    return current;
}

/**
 * Downloads a file with given content
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generates a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Logs errors with context
 * @param {string} context - Context where error occurred
 * @param {Error|string} error - Error to log
 * @param {any} additionalData - Additional data to log
 */
export function logError(context, error, additionalData = null) {
    console.error(`[${context}]`, error);
    if (additionalData) {
        console.error('Additional data:', additionalData);
    }
}

/**
 * Validates CNPJ format
 * @param {string} cnpj - CNPJ to validate
 * @returns {boolean} True if valid format
 */
export function isValidCNPJ(cnpj) {
    if (!cnpj) return false;
    
    // Remove formatting
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Check length
    if (cleanCNPJ.length !== 14) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
    
    return true; // Basic validation, could be extended with check digit validation
}