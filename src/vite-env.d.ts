/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly SENTRY_AUTH_TOKEN?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_TRACE_PROPAGATION_TARGET?: string;
  readonly VITE_OPENAI_REALTIME_WS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
