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
      .api-list { margin-top: 20px; }
      .api-item { 
        padding: 12px; 
        margin: 8px 0; 
        background: var(--vscode-editor-background); 
        border: 1px solid var(--vscode-panel-border); 
        border-radius: 4px;
      }
      .api-name { font-weight: bold; margin-bottom: 4px; }
      .api-endpoint { font-size: 12px; color: var(--vscode-descriptionForeground); }
      .status { 
        display: inline-block; 
        padding: 2px 8px; 
        border-radius: 3px; 
        font-size: 11px; 
        margin-top: 6px;
      }
      .status.ready { background: #4caf50; color: white; }
      .status.progress { background: #ff9800; color: white; }
      .status.not-started { background: #757575; color: white; }
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
      
      function renderAPIs(apis) {
        const html = apis.map(api => \`
          <div class="api-item">
            <div class="api-name">\${api.name}</div>
            <div class="api-endpoint">\${api.method} \${api.endpoint}</div>
            <span class="status \${api.status.toLowerCase().replace(' ', '-')}">\${api.status}</span>
          </div>
        \`).join('');
        
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
