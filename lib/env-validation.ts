/**
 * Environment validation utilities
 */

export interface EnvironmentConfig {
  BACKEND_URL: string;
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  NODE_ENV: string;
}

export function validateEnvironment(): {
  isValid: boolean;
  errors: string[];
  config: Partial<EnvironmentConfig>;
} {
  const errors: string[] = [];
  const config: Partial<EnvironmentConfig> = {};

  // Required environment variables
  const requiredVars = {
    BACKEND_URL: process.env.BACKEND_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  };

  // Check for missing variables
  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value || value.trim() === '') {
      errors.push(`${key} is not set or is empty`);
    } else {
      config[key as keyof EnvironmentConfig] = value;
    }
  });

  // Validate BACKEND_URL format
  if (config.BACKEND_URL) {
    try {
      new URL(config.BACKEND_URL);
    } catch {
      errors.push(`BACKEND_URL "${config.BACKEND_URL}" is not a valid URL`);
    }
  }

  // Validate NEXTAUTH_URL format
  if (config.NEXTAUTH_URL) {
    try {
      new URL(config.NEXTAUTH_URL);
    } catch {
      errors.push(`NEXTAUTH_URL "${config.NEXTAUTH_URL}" is not a valid URL`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    config,
  };
}

export function logEnvironmentStatus(): void {
  const validation = validateEnvironment();
  
  if (validation.isValid) {
    console.log('✅ Environment validation passed');
    console.log('📋 Configuration:', {
      NODE_ENV: validation.config.NODE_ENV,
      BACKEND_URL: validation.config.BACKEND_URL,
      NEXTAUTH_URL: validation.config.NEXTAUTH_URL,
      NEXTAUTH_SECRET: validation.config.NEXTAUTH_SECRET ? '[SET]' : '[NOT SET]',
    });
  } else {
    console.error('❌ Environment validation failed:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
  }
}
