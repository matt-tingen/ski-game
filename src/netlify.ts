export const BASE_FUNCTIONS_URL = import.meta.env.VITE_DEPLOY_URL
  ? `${import.meta.env.VITE_DEPLOY_URL}/.netlify/functions`
  : null;
