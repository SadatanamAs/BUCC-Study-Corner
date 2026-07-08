// Treat env vars that are present-but-empty (e.g. `ADMIN_BOOTSTRAP_TOKEN=`)
// as unset. Without this, an empty Vercel env var silently disables the
// admin bootstrap branch — the user registers successfully but always
// gets `role: "user"`, with no error to indicate the secret is missing.
export const envOrEmpty = (name) => {
  const value = process.env[name];
  return typeof value === 'string' && value.trim() !== '' ? value : '';
};

export const isProd = () => process.env.NODE_ENV === 'production';