import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span style={{ fontWeight: 900, fontSize: '1.25rem' }}>Music Streaming Hub</span>,
  project: {
    link: 'https://github.com/gordo-labs/music-streaming-hub',
  },
  docsRepositoryBase: 'https://github.com/gordo-labs/music-hub-docs/tree/main',
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{' '}
        <a href="https://music-hub.gordo.design" target="_blank">
          Music Streaming Hub
        </a>
        .
      </span>
    ),
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Music Streaming Hub'
    }
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Music Streaming Hub Documentation" />
      <meta property="og:description" content="Self-hosted music streaming with mobile apps. No subscriptions, total privacy." />
    </>
  ),
  primaryHue: 0, // Black/white theme
  darkMode: true,
  nextThemes: {
    defaultTheme: 'dark'
  }
}

export default config
