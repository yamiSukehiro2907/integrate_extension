# Integrate - VS Code Extension

> Seamless integration between frontend & backend development

The in-editor developer experience for the **Integrate** platform. This extension brings contract validation, API status tracking, and real-time synchronization directly into your IDE.

---

## Features

### 🔐 **Project Authentication**
- Connect to your Integrate project using email and project token
- Secure credential storage using VS Code's Secret Storage API
- Auto-download project files (OpenAPI spec, schema, rules) on authentication

### 📊 **Real-time API Dashboard**
- View all project APIs organized by status (Completed, Ongoing, Not Started)
- Live sync with your team's changes
- Quick refresh to get latest endpoint updates

### 📁 **Auto-generated Project Files**
- `openapi.yaml` - OpenAPI specification
- `schema.json` - API schema definitions  
- `rules.md` - Project rules and guidelines
- Automatically added to `.gitignore`

---

## Installation

### From Source
1. Clone this repository
2. Run `npm install`
3. Press `F5` to launch Extension Development Host
4. Open the Integrate sidebar from the Activity Bar

### Requirements
- VS Code version 1.105.0 or higher
- Node.js 16+ 
- Active Integrate project

---

## Setup

### 1. Configure Server URL (Optional)
Open VS Code Settings (`Ctrl+,`) and search for "Integrate":

```json
{
  "integrate.serverUrl": "https://api.integrate.dev"
}
```

For local development:
```json
{
  "integrate.serverUrl": "http://localhost:8080"
}
```

### 2. Environment Variables (Development Only)
Create a `.env` file in the extension root:

```env
INTEGRATE_URL=http://localhost:3000
```

### 3. Authentication
1. Open the Integrate sidebar (click icon in Activity Bar)
2. Enter your **Gmail** and **Project Token**
3. Click **Connect**

---

## Usage

### Dashboard
After authentication, you'll see:
- **API List**: All endpoints grouped by status
- **Refresh Button**: Manually sync latest changes
- **Logout Button**: Clear credentials and disconnect

### Project Files
Three files are automatically downloaded to your workspace root:
- `openapi.yaml` - Full API specification
- `schema.json` - Request/response schemas
- `rules.md` - Development rules and conventions

These files are automatically added to `.gitignore`.

---

## Commands

Access via Command Palette (`Ctrl+Shift+P`):

| Command | Description |
|---------|-------------|
| `Integrate: Refresh Status` | Fetch latest API updates |
| `Integrate: Logout` | Clear credentials |

---

## API Integration

### Authentication Endpoint
```http
POST /auth
Cookie: projectToken=<token>; email=<email>
```

**Response:**
```json
{
  "message": "Authentication successful!",
  "user": { "id": "1", "name": "John Doe", "email": "john@example.com" },
  "project": { "id": "10", "name": "My Project", "version": "1.0.0" },
  "files": {
    "openapi_yaml": {...},
    "schema_json": {...},
    "rules_md": "# Rules\n..."
  }
}
```

### Endpoints List
```http
GET /projects/endpoint
Cookie: projectToken=<token>; email=<email>
```

**Response:**
```json
{
  "message": "✅ Endpoints fetched successfully",
  "totalCount": 3,
  "groupedByStatus": {
    "completed": [...],
    "ongoing": [...],
    "not_started": [...]
  }
}
```

---

## Tech Stack

- **TypeScript** - Primary language
- **VS Code Extension API** - Webview, Secret Storage, Configuration
- **Axios** - HTTP client with cookie support
- **Node.js** - Extension backend runtime
- **Webpack** - Bundling

---

## Project Structure

```
integrate-vscode/
├── src/
│   ├── extension.ts              # Entry point
│   ├── providers/
│   │   └── SidebarProvider.ts    # Sidebar webview provider
│   ├── services/
│   │   ├── ApiService.ts         # Axios instance with interceptors
│   │   ├── AuthService.ts        # Authentication logic
│   │   └── FileService.ts        # File download & gitignore
│   ├── pages/
│   │   ├── authHTML.ts           # Login page HTML
│   │   └── dashboardHTML.ts      # Dashboard page HTML
│   └── helpers/
│       ├── AuthResponse.ts       # Auth response types
│       └── EndpointsResponse.ts  # Endpoints response types
├── package.json                   # Extension manifest
└── .env.example                   # Environment template
```

---

## Development

### Run Extension
```bash
npm install
npm run compile
# Press F5 in VS Code
```

### Watch Mode
```bash
npm run watch
```

### Package Extension
```bash
npm run package
```

Creates `integrate-x.x.x.vsix` file for distribution.

---

## Configuration

All settings are available in VS Code Settings:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `integrate.projectId` | string | - | Current project ID (auto-set) |
| `integrate.projectName` | string | - | Current project name (auto-set) |
| `integrate.serverUrl` | string | `https://api.integrate.dev` | Backend API URL |

---

## Security

- **Project tokens** stored in VS Code Secret Storage (OS keychain)
- **Email** stored securely alongside token
- **Cookie-based authentication** for API requests
- **No plaintext credentials** in settings or files

---

## Troubleshooting

### "No workspace folder open"
Open a folder in VS Code before authenticating to enable file downloads.

### "Authentication failed"
- Verify project token is correct
- Check server URL in settings
- Ensure backend server is running

### "Failed to fetch APIs"
- Confirm you're authenticated
- Check network connection
- Verify backend `/projects/endpoint` route exists

### Extension not showing
- Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
- Check extension is enabled in Extensions panel

---

## Roadmap

- [ ] Socket.io real-time sync
- [ ] Backend validation service (auto-validate localhost)
- [ ] Frontend smart proxy (mock vs real API routing)
- [ ] Hover provider (API details on hover)
- [ ] IntelliSense for API endpoints
- [ ] Code snippets for common patterns

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see LICENSE file for details

---

## Support

- **Issues**: [GitHub Issues](https://github.com/your-org/integrate-vscode/issues)
- **Documentation**: [docs.integrate.dev](https://docs.integrate.dev)
- **Email**: support@integrate.dev

---

Made with ❤️ by the Integrate Team
