const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

let servers = [];

const elements = {
  hostInput: document.getElementById('hostInput'),
  labelInput: document.getElementById('labelInput'),
  portInput: document.getElementById('portInput'),
  httpsCheckbox: document.getElementById('httpsCheckbox'),
  addBtn: document.getElementById('addBtn'),
  showFormBtn: document.getElementById('showFormBtn'),
  formSection: document.getElementById('formSection'),
  listSection: document.getElementById('listSection'),
  serverList: document.getElementById('serverList'),
  exportBtn: document.getElementById('exportBtn'),
  editJsonBtn: document.getElementById('editJsonBtn'),
  editorSection: document.getElementById('editorSection'),
  jsonEditor: document.getElementById('jsonEditor'),
  saveJsonBtn: document.getElementById('saveJsonBtn'),
  closeEditorBtn: document.getElementById('closeEditorBtn')
};

const loadServers = async () => {
  const result = await browserAPI.storage.local.get('servers');
  servers = result.servers || [];
  renderServers();
};

const saveServers = async () => {
  await browserAPI.storage.local.set({ servers });
};

const addServer = () => {
  const host = elements.hostInput.value.trim() || 'localhost';
  const label = elements.labelInput.value.trim();
  const port = elements.portInput.value.trim();
  const isHttps = elements.httpsCheckbox.checked;

  if (!port) {
    alert('Please enter a port');
    return;
  }

  const portNum = parseInt(port);
  if (portNum < 1 || portNum > 65535) {
    alert('Port must be between 1 and 65535');
    return;
  }

  const server = {
    id: Date.now(),
    host,
    label: label || `Port ${port}`,
    port: portNum,
    isHttps,
    url: `http${isHttps ? 's' : ''}://${host}:${port}`
  };

  servers.push(server);
  saveServers();
  renderServers();
  resetForm();
  hideForm();
};

const deleteServer = (id) => {
  servers = servers.filter(s => s.id !== id);
  saveServers();
  renderServers();
};

const openServer = (url) => {
  browserAPI.tabs.create({ url, active: true });
};

const checkServerStatus = async (url) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    return true;
  } catch {
    return false;
  }
};

const renderServers = async () => {
  if (servers.length === 0) {
    elements.serverList.innerHTML = `
      <div class="empty-state">
        <p>No registered servers</p>
        <p style="font-size: 12px;">Click on "+ New" to add a server</p>
      </div>
    `;
    return;
  }

  elements.serverList.innerHTML = '';

  for (const [index, server] of servers.entries()) {
    const item = document.createElement('div');
    item.className = 'server-item';
    item.draggable = true;
    item.dataset.id = server.id;
    item.dataset.index = index;

    item.innerHTML = `
      <div class="server-info">
        <div class="server-label">${server.label}</div>
        <div class="server-url">${server.port}</div>
      </div>
      <div class="server-status" title="Unknown status"></div>
      <div class="server-actions">
        <button class="icon-btn open" title="Open">🌐</button>
        <button class="icon-btn delete" title="Delete">🗑️</button>
      </div>
    `;

    const openBtn = item.querySelector('.open');
    const deleteBtn = item.querySelector('.delete');
    const statusDot = item.querySelector('.server-status');

    openBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openServer(server.url);
    });

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${server.label}"?`)) {
        deleteServer(server.id);
      }
    });

    item.addEventListener('click', () => {
      openServer(server.url);
    });

    elements.serverList.appendChild(item);

    checkServerStatus(server.url).then(isOnline => {
      if (isOnline) {
        statusDot.classList.add('online');
        statusDot.title = 'Server accessible';
      } else {
        statusDot.classList.add('offline');
        statusDot.title = 'Server not accessible';
      }
    });
  }
};

const showJsonEditor = () => {
  elements.jsonEditor.value = JSON.stringify(servers, null, 2);
  elements.editorSection.classList.remove('hidden');
};

const hideJsonEditor = () => {
  elements.editorSection.classList.add('hidden');
};

const saveJsonEditor = () => {
  try {
    const parsed = JSON.parse(elements.jsonEditor.value);
    
    if (!Array.isArray(parsed)) {
      alert('JSON must be an array');
      return;
    }

    const validServers = parsed.filter(s => {
      if (!s.host || !s.port || !s.label) {
        return false;
      }
      return true;
    });

    if (validServers.length !== parsed.length) {
      if (!confirm(`${parsed.length - validServers.length} invalid server(s) will be ignored. Continue?`)) {
        return;
      }
    }

    servers = validServers.map(s => ({
      ...s,
      id: s.id || Date.now() + Math.random(),
      url: `http${s.isHttps ? 's' : ''}://${s.host}:${s.port}`
    }));

    saveServers();
    renderServers();
    hideJsonEditor();
  } catch (error) {
    alert('Invalid JSON: ' + error.message);
  }
};

const resetForm = () => {
  elements.hostInput.value = 'localhost';
  elements.labelInput.value = '';
  elements.portInput.value = '';
  elements.httpsCheckbox.checked = false;
};

const showForm = () => {
  elements.formSection.classList.remove('hidden');
  elements.labelInput.focus();
};

const hideForm = () => {
  elements.formSection.classList.add('hidden');
};

const exportConfig = () => {
  const dataStr = JSON.stringify(servers, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'localhost-manager-config.json';
  link.click();

  URL.revokeObjectURL(url);
};

elements.addBtn.addEventListener('click', addServer);
elements.showFormBtn.addEventListener('click', showForm);
elements.exportBtn.addEventListener('click', exportConfig);
elements.editJsonBtn.addEventListener('click', showJsonEditor);
elements.saveJsonBtn.addEventListener('click', saveJsonEditor);
elements.closeEditorBtn.addEventListener('click', hideJsonEditor);

elements.portInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addServer();
  }
});

loadServers();
