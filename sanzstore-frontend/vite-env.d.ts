/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_OTHER_KEY?: string; // tambahkan semua variabel yang kamu gunakan
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  