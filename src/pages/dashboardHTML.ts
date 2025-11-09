export const getDashboardHTMLPage = () => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { 
        padding: 20px; 
        font-family: var(--vscode-font-family); 
        color: var(--vscode-foreground);
      }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      button { 
        padding: 8px 16px; 
        background: var(--vscode-button-background); 
        color: var(--vscode-button-foreground); 
        border: none; 
        cursor: pointer; 
      }
      button:hover { background: var(--vscode-button-hoverBackground); }
      .status-section { margin-top: 20px; }
      .status-title { 
        font-size: 14px; 
        font-weight: bold; 
        margin: 16px 0 8px 0;
        text-transform: capitalize;
      }
      .api-item { 
        padding: 12px; 
        margin: 8px 0; 
        background: var(--vscode-editor-background); 
        border: 1px solid var(--vscode-panel-border); 
        border-radius: 4px;
      }
      .api-name { font-weight: bold; margin-bottom: 4px; }
      .api-endpoint { font-size: 12px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
      .api-version { font-size: 11px; color: var(--vscode-descriptionForeground); }
      .status-badge { 
        display: inline-block; 
        padding: 2px 8px; 
        border-radius: 3px; 
        font-size: 11px; 
        margin-top: 6px;
      }
      .status-badge.completed { background: #4caf50; color: white; }
      .status-badge.ongoing { background: #ff9800; color: white; }
      .status-badge.pending { background: #757575; color: white; }
      .loading { text-align: center; padding: 20px; }
    </style>
  </head>
  <body>
    <div class="header">
      <h2>APIs</h2>
      <div>
        <button onclick="refresh()">Refresh</button>
        <button onclick="logout()">Logout</button>
      </div>
    </div>
    
    <div id="content" class="loading">Loading...</div>
    
    <script>
      const vscode = acquireVsCodeApi();
      
      function refresh() {
        vscode.postMessage({ command: 'refreshAPIs' });
      }
      
      function logout() {
        vscode.postMessage({ command: 'logout' });
      }
      
      function renderAPIs(data) {
        if (!data || !data.groupedByStatus) {
          document.getElementById('content').innerHTML = '<p>No APIs found</p>';
          return;
        }
        
        let html = '';
        const grouped = data.groupedByStatus;
        
        // Render each status group
        ['completed', 'ongoing', 'pending'].forEach(status => {
          const apis = grouped[status];
          if (apis && apis.length > 0) {
            html += \`<div class="status-section">
              <div class="status-title">\${status} (\${apis.length})</div>\`;
            
            apis.forEach(api => {
              html += \`<div class="api-item">
                <div class="api-name">\${api.path}</div>
                <div class="api-endpoint">\${api.method} • Version: \${api.version}</div>
                <span class="status-badge \${api.endpoint_status}">\${api.endpoint_status}</span>
              </div>\`;
            });
            
            html += '</div>';
          }
        });
        
        document.getElementById('content').innerHTML = html || '<p>No APIs found</p>';
      }
      
      window.addEventListener('message', (event) => {
        const message = event.data;
        if (message.command === 'updateAPIs') {
          renderAPIs(message.data);
        }
      });
      
      // Request initial data
      vscode.postMessage({ command: 'refreshAPIs' });
    </script>
  </body>
  </html>`;
};
