export const getAuthPageHTML = () => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { padding: 20px; font-family: var(--vscode-font-family); }
      input { width: 100%; padding: 8px; margin: 10px 0; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); }
      button { width: 100%; padding: 10px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; cursor: pointer; margin-top: 10px; }
      .error { color: var(--vscode-errorForeground); margin-top: 10px; }
    </style>
  </head>
  <body>
    <h2>Connect to Integrate</h2>
    <input type="email" id="email" placeholder="Your Gmail" />
    <input type="password" id="projectToken" placeholder="Auth Token" />
    <button onclick="authenticate()">Connect</button>
    <div id="error" class="error"></div>
    
    <script>
      const vscode = acquireVsCodeApi();
      
      function authenticate() {
        const email = document.getElementById('email').value;
        const projectToken = document.getElementById('projectToken').value;
        
        if (!email || !projectToken) {
          document.getElementById('error').textContent = 'Both fields required';
          return;
        }
        
        vscode.postMessage({ command: 'authenticate', projectToken, email });
      }
      
      window.addEventListener('message', (event) => {
        if (event.data.command === 'authError') {
          document.getElementById('error').textContent = event.data.message;
        }
      });
    </script>
  </body>
  </html>`;
};
