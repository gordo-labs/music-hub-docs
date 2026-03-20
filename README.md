# Music Hub Docs

Nextra-powered documentation site for Music Hub. Source repo: [`gordo-labs/music-hub-docs`](https://github.com/gordo-labs/music-hub-docs). Deploy with Vercel (root = this repo, `npm run build`).

## Tech Stack

- **Next.js 14** - Framework
- **Nextra 2.x** - Documentation theme
- **TypeScript** - Type safety
- **MDX** - Markdown with React components
- **Next build output** - Served by Vercel from `.next`

## Development

```bash
git clone https://github.com/gordo-labs/music-hub-docs.git
cd music-hub-docs
npm install
npm run dev
```

Visit `http://localhost:3001`.

## Build

```bash
npm run build
```

## Deployment

Deploy to Vercel:

```bash
npm install
npm run build
```

## Structure

```
docs/
├── pages/
│   ├── _meta.json               # Navigation structure
│   ├── index.mdx                # Home page
│   ├── getting-started.mdx      # Getting Started guide
│   ├── architecture.mdx         # Architecture docs
│   ├── building.mdx             # Build instructions
│   ├── troubleshooting.mdx      # Troubleshooting
│   ├── api.mdx                  # API reference
│   └── agents/
│       ├── _meta.json           # Agents section nav
│       └── integration.mdx      # AI integration guide
├── theme.config.tsx             # Nextra theme config
├── next.config.mjs              # Next.js config
└── public/                      # Static assets
```

## Content That Must Stay Current

- `pages/index.mdx` for beta availability
- `pages/getting-started.mdx` for the live install/TestFlight flow
- `pages/building.mdx` for actual repo commands
- `theme.config.tsx` for GitHub links (`music-hub-docs` + desktop repo)

## Navigation

Sidebar order is defined in `pages/_meta.json`.

## License

MIT
