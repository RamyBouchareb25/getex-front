import { NextRequest, NextResponse } from 'next/server';
import { serverApi } from '@/lib/axios-interceptor';

export async function GET(request: NextRequest) {
  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      BACKEND_URL: process.env.BACKEND_URL || 'not set',
      BACKEND_HOST: process.env.BACKEND_HOST || 'not set',
      BACKEND_PROTOCOL: process.env.BACKEND_PROTOCOL || 'not set',
    },
    tests: {} as any,
  };

  const tests = [
    {
      name: 'dashboard-stats',
      endpoint: '/dashboard/stats',
      description: 'Dashboard statistics endpoint',
    },
    {
      name: 'dashboard-revenue',
      endpoint: '/dashboard/revenue-trend',
      description: 'Revenue trend data',
    },
    {
      name: 'dashboard-orders',
      endpoint: '/dashboard/order-status',
      description: 'Order status distribution',
    },
  ];

  // Run each test
  for (const test of tests) {
    try {
      console.log(`🧪 Testing ${test.name} (${test.endpoint})`);
      const startTime = Date.now();
      
      const response = await serverApi.get(test.endpoint);
      const endTime = Date.now();
      
      testResults.tests[test.name] = {
        status: 'success',
        responseTime: `${endTime - startTime}ms`,
        statusCode: response.status,
        dataType: typeof response.data,
        dataSize: JSON.stringify(response.data).length,
        description: test.description,
      };
    } catch (error: any) {
      testResults.tests[test.name] = {
        status: 'error',
        error: error.message || 'Unknown error',
        errorType: error.constructor.name,
        description: test.description,
        ...(error.status && { statusCode: error.status }),
        ...(error.url && { url: error.url }),
      };
    }
  }

  // Determine overall status
  const hasErrors = Object.values(testResults.tests).some((test: any) => test.status === 'error');
  const overallStatus = hasErrors ? 503 : 200;

  return NextResponse.json(testResults, { status: overallStatus });
}
