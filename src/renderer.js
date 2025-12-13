const axios = require('axios');

// DOM Elements
const methodSelect = document.getElementById('methodSelect');
const urlInput = document.getElementById('urlInput');
const sendBtn = document.getElementById('sendBtn');
const saveBtn = document.getElementById('saveBtn');
const tabButtons = document.querySelectorAll('.tab-btn');
const responseTabButtons = document.querySelectorAll('.response-tab-btn');
const addParamBtn = document.getElementById('addParamBtn');
const addHeaderBtn = document.getElementById('addHeaderBtn');
const paramsList = document.getElementById('paramsList');
const headersList = document.getElementById('headersList');
const bodyTypeSelect = document.getElementById('bodyTypeSelect');
const bodyTextarea = document.getElementById('bodyTextarea');
const responseBody = document.getElementById('responseBody');
const responseHeaders = document.getElementById('responseHeaders');
const statusCode = document.getElementById('statusCode');
const responseTime = document.getElementById('responseTime');
const responseSize = document.getElementById('responseSize');

// State
let requestHistory = JSON.parse(localStorage.getItem('requestHistory') || '[]');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    initializeParams();
    initializeHeaders();
    initializeBody();
    loadRequestHistory();
});

// Tab Switching
function initializeTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update button styles
            tabButtons.forEach(b => {
                b.classList.remove('active', 'border-primary-600', 'text-gray-700');
                b.classList.add('text-gray-500');
            });
            btn.classList.add('active', 'border-primary-600', 'text-gray-700');
            btn.classList.remove('text-gray-500');
            
            // Show/hide tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
        });
    });

    responseTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.responseTab;
            
            responseTabButtons.forEach(b => {
                b.classList.remove('active', 'border-primary-600', 'text-gray-700');
                b.classList.add('text-gray-500');
            });
            btn.classList.add('active', 'border-primary-600', 'text-gray-700');
            btn.classList.remove('text-gray-500');
            
            document.querySelectorAll('.response-content').forEach(content => {
                content.classList.add('hidden');
            });
            document.getElementById(`${tabName}Tab`).classList.remove('hidden');
        });
    });
}

// Params Management
function initializeParams() {
    addParamBtn.addEventListener('click', () => {
        addParamRow('', '');
    });
}

function addParamRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'flex items-center space-x-2';
    row.innerHTML = `
        <input type="text" placeholder="Key" class="input-field flex-1 param-key" value="${key}">
        <input type="text" placeholder="Value" class="input-field flex-1 param-value" value="${value}">
        <button class="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl">×</button>
    `;
    row.querySelector('.remove-item-btn').addEventListener('click', () => {
        row.remove();
    });
    paramsList.appendChild(row);
}

function getParams() {
    const params = {};
    paramsList.querySelectorAll('.flex.items-center.space-x-2').forEach(row => {
        const key = row.querySelector('.param-key').value.trim();
        const value = row.querySelector('.param-value').value.trim();
        if (key) {
            params[key] = value;
        }
    });
    return params;
}

// Headers Management
function initializeHeaders() {
    addHeaderBtn.addEventListener('click', () => {
        addHeaderRow('', '');
    });

    headersList.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            e.target.closest('.flex.items-center.space-x-2').remove();
        }
    });
}

function addHeaderRow(key = '', value = '') {
    const row = document.createElement('div');
    row.className = 'flex items-center space-x-2';
    row.innerHTML = `
        <input type="text" placeholder="Key" class="input-field flex-1 header-key" value="${key}">
        <input type="text" placeholder="Value" class="input-field flex-1 header-value" value="${value}">
        <button class="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl">×</button>
    `;
    headersList.appendChild(row);
}

function getHeaders() {
    const headers = {};
    headersList.querySelectorAll('.flex.items-center.space-x-2').forEach(row => {
        const key = row.querySelector('.header-key').value.trim();
        const value = row.querySelector('.header-value').value.trim();
        if (key) {
            headers[key] = value;
        }
    });
    return headers;
}

// Body Management
function initializeBody() {
    bodyTypeSelect.addEventListener('change', (e) => {
        const bodyType = e.target.value;
        updateBodyUI(bodyType);
    });
}

function updateBodyUI(bodyType) {
    const bodyContent = document.getElementById('bodyContent');
    
    if (bodyType === 'none') {
        bodyContent.innerHTML = '<div class="text-gray-500 text-sm">No body for this request type</div>';
    } else if (bodyType === 'json' || bodyType === 'text') {
        bodyContent.innerHTML = `
            <textarea id="bodyTextarea" rows="12" class="input-field font-mono text-sm" 
                      placeholder='${bodyType === 'json' ? '{"key": "value"}' : "Enter text..."}'></textarea>
        `;
        bodyTextarea = document.getElementById('bodyTextarea');
    } else if (bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') {
        const formList = document.createElement('div');
        formList.id = 'formDataList';
        formList.className = 'space-y-2';
        formList.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-medium text-gray-700">Form Data</label>
                <button id="addFormDataBtn" class="text-sm text-primary-600 hover:text-primary-700">+ Add</button>
            </div>
        `;
        bodyContent.innerHTML = '';
        bodyContent.appendChild(formList);
        
        document.getElementById('addFormDataBtn').addEventListener('click', () => {
            addFormDataRow('', '');
        });
    }
}

function getBody() {
    const bodyType = bodyTypeSelect.value;
    
    if (bodyType === 'none') {
        return null;
    } else if (bodyType === 'json') {
        const textarea = document.getElementById('bodyTextarea');
        if (!textarea || !textarea.value.trim()) return null;
        try {
            return JSON.parse(textarea.value);
        } catch (e) {
            throw new Error('Invalid JSON in body');
        }
    } else if (bodyType === 'text') {
        const textarea = document.getElementById('bodyTextarea');
        return textarea ? textarea.value : null;
    } else if (bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') {
        const formData = {};
        const formList = document.getElementById('formDataList');
        if (formList) {
            formList.querySelectorAll('.flex.items-center.space-x-2').forEach(row => {
                const key = row.querySelector('.form-key')?.value.trim();
                const value = row.querySelector('.form-value')?.value.trim();
                if (key) {
                    formData[key] = value;
                }
            });
        }
        return Object.keys(formData).length > 0 ? formData : null;
    }
    
    return null;
}

function addFormDataRow(key = '', value = '') {
    const formList = document.getElementById('formDataList');
    if (!formList) return;
    
    const row = document.createElement('div');
    row.className = 'flex items-center space-x-2';
    row.innerHTML = `
        <input type="text" placeholder="Key" class="input-field flex-1 form-key" value="${key}">
        <input type="text" placeholder="Value" class="input-field flex-1 form-value" value="${value}">
        <button class="remove-item-btn text-red-600 hover:text-red-700 px-2 font-bold text-xl">×</button>
    `;
    row.querySelector('.remove-item-btn').addEventListener('click', () => {
        row.remove();
    });
    formList.appendChild(row);
}

// Send Request
sendBtn.addEventListener('click', async () => {
    await sendRequest();
});

async function sendRequest() {
    const method = methodSelect.value;
    let url = urlInput.value.trim();
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
        urlInput.value = url;
    }

    // Build URL with query params
    const params = getParams();
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
    }

    // Get headers
    const headers = getHeaders();

    // Get body
    let body = null;
    try {
        body = getBody();
    } catch (e) {
        alert(e.message);
        return;
    }

    // Set content type if not specified
    if (body && !headers['Content-Type'] && !headers['content-type']) {
        const bodyType = bodyTypeSelect.value;
        if (bodyType === 'json') {
            headers['Content-Type'] = 'application/json';
        } else if (bodyType === 'x-www-form-urlencoded') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    }

    // Update UI
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';
    responseBody.innerHTML = '<div class="text-gray-400">Sending request...</div>';

    const startTime = Date.now();

    try {
        const config = {
            method: method.toLowerCase(),
            url: url,
            headers: headers,
            validateStatus: () => true // Accept all status codes
        };

        if (body && method !== 'GET') {
            if (bodyTypeSelect.value === 'x-www-form-urlencoded') {
                config.data = new URLSearchParams(body).toString();
            } else {
                config.data = body;
            }
        }

        const response = await axios(config);
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Display response
        displayResponse(response, duration);
        
        // Save to history
        saveToHistory({
            method,
            url: urlInput.value.trim(),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        displayError(error, duration);
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = `
            <span class="flex items-center space-x-2">
                <span>Send</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
            </span>
        `;
    }
}

function displayResponse(response, duration) {
    // Status code
    const status = response.status;
    statusCode.textContent = status;
    statusCode.className = `px-3 py-1 rounded text-sm font-semibold ${
        status >= 200 && status < 300 ? 'bg-green-100 text-green-800' :
        status >= 300 && status < 400 ? 'bg-yellow-100 text-yellow-800' :
        status >= 400 ? 'bg-red-100 text-red-800' :
        'bg-gray-200 text-gray-800'
    }`;

    // Response time
    responseTime.textContent = `${duration}ms`;

    // Response size
    const size = JSON.stringify(response.data).length;
    responseSize.textContent = formatBytes(size);

    // Response body
    try {
        const formatted = JSON.stringify(response.data, null, 2);
        responseBody.innerHTML = `<pre class="whitespace-pre-wrap">${escapeHtml(formatted)}</pre>`;
    } catch (e) {
        responseBody.innerHTML = `<pre class="whitespace-pre-wrap">${escapeHtml(response.data)}</pre>`;
    }

    // Response headers
    displayResponseHeaders(response.headers);
}

function displayError(error, duration) {
    statusCode.textContent = 'Error';
    statusCode.className = 'px-3 py-1 rounded text-sm font-semibold bg-red-100 text-red-800';
    
    responseTime.textContent = `${duration}ms`;
    responseSize.textContent = '-';

    const errorMessage = error.response 
        ? `Error ${error.response.status}: ${error.response.statusText}\n\n${JSON.stringify(error.response.data, null, 2)}`
        : error.message;

    responseBody.innerHTML = `<pre class="whitespace-pre-wrap text-red-400">${escapeHtml(errorMessage)}</pre>`;
    
    if (error.response && error.response.headers) {
        displayResponseHeaders(error.response.headers);
    } else {
        responseHeaders.innerHTML = '<div class="text-gray-500">No headers</div>';
    }
}

function displayResponseHeaders(headers) {
    responseHeaders.innerHTML = '';
    Object.entries(headers).forEach(([key, value]) => {
        const row = document.createElement('div');
        row.className = 'flex items-start space-x-4 py-2 border-b border-gray-200';
        row.innerHTML = `
            <div class="font-semibold text-gray-700 w-48">${escapeHtml(key)}</div>
            <div class="flex-1 text-gray-600 break-words">${escapeHtml(Array.isArray(value) ? value.join(', ') : value)}</div>
        `;
        responseHeaders.appendChild(row);
    });
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// History Management
function saveToHistory(request) {
    requestHistory.unshift(request);
    if (requestHistory.length > 50) {
        requestHistory = requestHistory.slice(0, 50);
    }
    localStorage.setItem('requestHistory', JSON.stringify(requestHistory));
}

function loadRequestHistory() {
    // Could be used to populate a history sidebar
    console.log('Request history loaded:', requestHistory.length, 'items');
}

// Save button
saveBtn.addEventListener('click', () => {
    const request = {
        method: methodSelect.value,
        url: urlInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    saveToHistory(request);
    alert('Request saved to history!');
});

