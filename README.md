# Music Hub Docs

Nextra-powered documentation site for Music Hub.

**Canonical repo:** [github.com/gordo-labs/music-hub-docs](https://github.com/gordo-labs/music-hub-docs) — edit there (or sync changes back with a PR). This `docs/` tree in the workspace is a working copy for local edits and Vercel; keep it aligned with `music-hub-docs` on GitHub.

## Tech Stack

- **Next.js 14** - Framework
- **Nextra 2.x** - Documentation theme
- **TypeScript** - Type safety
- **MDX** - Markdown with React components
- **Next build output** - Served by Vercel from `.next`

## Development

```bash
cd docs
npm install
npm run dev
```

Visit `http://localhost:3001`.

## Build

```bash
cd docs
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
- `pages/api.mdx` for hub API contract (auth, `/api/search` pagination, etc.)
- `theme.config.tsx` for GitHub/docs repo links

## Navigation

Sidebar order is defined in `pages/_meta.json`.

## License

MIT
