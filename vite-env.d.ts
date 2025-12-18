/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;

  // Custom environment variables
  // NOTE: In Vite, only variables prefixed with VITE_ are exposed to the client
  readonly VITE_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_API_ENDPOINT?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENVIRONMENT?: string;
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_ERROR_TRACKING?: string;
  readonly VITE_ENABLE_RATE_LIMITING?: string;
  readonly VITE_RATE_LIMIT_WINDOW?: string;
  readonly VITE_RATE_LIMIT_MAX_REQUESTS?: string;
  readonly VITE_MAX_FILE_SIZE?: string;
  readonly VITE_ALLOWED_FILE_TYPES?: string;
  readonly VITE_LOG_LEVEL?: string;
  readonly VITE_ENABLE_CONSOLE_LOGGING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
