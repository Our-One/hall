function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback?: string): string | undefined {
  return process.env[key] ?? fallback;
}


export const env = {
  get DATABASE_URL() {
    return required('DATABASE_URL');
  },
  get DATABASE_READ_URL() {
    return optional('DATABASE_READ_URL') ?? this.DATABASE_URL;
  },
  get RESEND_API_KEY() {
    return required('RESEND_API_KEY');
  },
  get AUTH_SECRET() {
    return required('AUTH_SECRET');
  },
  get AUTH_GITHUB_ID() {
    return optional('AUTH_GITHUB_ID');
  },
  get AUTH_GITHUB_SECRET() {
    return optional('AUTH_GITHUB_SECRET');
  },
  get AUTH_GOOGLE_ID() {
    return optional('AUTH_GOOGLE_ID');
  },
  get AUTH_GOOGLE_SECRET() {
    return optional('AUTH_GOOGLE_SECRET');
  },
  get R2_ACCOUNT_ID() {
    return optional('R2_ACCOUNT_ID');
  },
  get R2_ACCESS_KEY_ID() {
    return optional('R2_ACCESS_KEY_ID');
  },
  get R2_SECRET_ACCESS_KEY() {
    return optional('R2_SECRET_ACCESS_KEY');
  },
  get R2_BUCKET_NAME() {
    return optional('R2_BUCKET_NAME', 'ourone');
  },
  get CRON_SECRET() {
    return optional('CRON_SECRET');
  },
  get UPSTASH_REDIS_REST_URL() {
    return optional('UPSTASH_REDIS_REST_URL');
  },
  get UPSTASH_REDIS_REST_TOKEN() {
    return optional('UPSTASH_REDIS_REST_TOKEN');
  },
  get GEMINI_API_KEY() {
    return optional('GEMINI_API_KEY');
  },
  get NODE_ENV() {
    return optional('NODE_ENV', 'development');
  },
} as const;
