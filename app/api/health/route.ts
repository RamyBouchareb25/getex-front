import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      BACKEND_URL: process.env.BACKEND_URL || 'not set',
      BACKEND_HOST: process.env.BACKEND_HOST || 'not set',
      BACKEND_PROTOCOL: process.env.BACKEND_PROTOCOL || 'not set',
    },
  };

  // Test backend connectivity if requested
  if (request.nextUrl.searchParams.get('checkBackend') === 'true') {
    try {
      const backendUrl = process.env.BACKEND_URL;
      if (!backendUrl) {
        throw new Error('BACKEND_URL not configured');
      }

      const response = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        headers: { 'User-Agent': 'JacketsClub-Frontend-Health-Check' },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status} ${response.statusText}`);
      }

      const backendHealth = await response.json();
      (healthData as any).backend = {
        status: 'ok',
        response: backendHealth,
      };
    } catch (error) {
      (healthData as any).backend = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return NextResponse.json(healthData, { status: 503 });
    }
  }

  return NextResponse.json(healthData, { status: 200 });
}