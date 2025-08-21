/**
 * Runtime configuration utilities
 * These functions read environment variables at runtime, not build time
 */

export interface ImageRemotePattern {
  protocol: 'http' | 'https';
  hostname: string;
  port?: string;
  pathname?: string;
}

/**
 * Get allowed image remote patterns based on current environment variables
 */
export function getImageRemotePatterns(): ImageRemotePattern[] {
  // These are read at RUNTIME when the function is called
  const backendHost = process.env.BACKEND_HOST || process.env.NEXT_PUBLIC_BACKEND_HOST || 'localhost';
  const backendProtocol = (process.env.BACKEND_PROTOCOL || process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || 'https') as 'http' | 'https';
  
  return [
    {
      protocol: backendProtocol,
      hostname: backendHost,
      port: "",
      pathname: "/files/**",
    },
  ];
}

/**
 * Check if an image URL is allowed based on current environment
 */
export function isImageAllowed(src: string): boolean {
  const patterns = getImageRemotePatterns();
  
  try {
    const url = new URL(src);
    const urlProtocol = url.protocol.replace(':', '') as 'http' | 'https';
    
    return patterns.some(pattern => {
      // Check protocol match
      if (urlProtocol !== pattern.protocol) return false;
      
      // Check hostname match
      if (pattern.hostname !== url.hostname) return false;
      
      // Check port if specified
      if (pattern.port && pattern.port !== url.port) return false;
      
      // Check pathname if specified
      if (pattern.pathname) {
        const patternPath = pattern.pathname.replace('**', '.*');
        const regex = new RegExp(patternPath);
        if (!regex.test(url.pathname)) return false;
      }
      
      return true;
    });
  } catch (error) {
    console.warn('Invalid image URL:', src);
    return false;
  }
}

/**
 * Get the backend URL based on environment variables
 */
export function getBackendUrl(): string {
  const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (!backendUrl) {
    // Fallback: construct from individual components
    const host = process.env.BACKEND_HOST || 'localhost';
    const protocol = process.env.BACKEND_PROTOCOL || 'https';
    return `${protocol}://${host}`;
  }
  
  return backendUrl;
}

/**
 * Get the backend API URL
 */
export function getBackendApiUrl(): string {
  const baseUrl = getBackendUrl();
  return `${baseUrl}/api`;
}