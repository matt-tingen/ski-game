/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEPLOY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
