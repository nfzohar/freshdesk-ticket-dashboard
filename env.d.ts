/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  /**
   * Include the api endpoint prefix at the end - e,g., ...com/api/v2/
   */
  readonly VITE_FRESHDESK_DOMAIN_URL: string
  readonly VITE_FRESHDESK_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
