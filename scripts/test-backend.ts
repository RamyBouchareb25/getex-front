#!/usr/bin/env bun

/**
 * Backend connectivity test script
 * Run with: bun run test-backend.ts
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

interface TestResult {
  name: string;
  status: 'success' | 'error';
  responseTime?: string;
  error?: string;
  details?: any;
}

async function testEndpoint(name: string, endpoint: string): Promise<TestResult> {
  console.log(`🧪 Testing ${name}: ${BACKEND_URL}${endpoint}`);
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Bellat-Backend-Test',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    
    const endTime = Date.now();
    const responseTime = `${endTime - startTime}ms`;
    
    if (!response.ok) {
      return {
        name,
        status: 'error',
        responseTime,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
    }
    
    const data = await response.json();
    return {
      name,
      status: 'success',
      responseTime,
      details: {
        status: response.status,
        dataType: typeof data,
        dataSize: JSON.stringify(data).length + ' bytes',
        sampleData: JSON.stringify(data).substring(0, 200) + (JSON.stringify(data).length > 200 ? '...' : ''),
      },
    };
  } catch (error: any) {
    return {
      name,
      status: 'error',
      error: error.message,
      details: {
        errorType: error.constructor.name,
        code: error.code,
      },
    };
  }
}

async function runTests() {
  console.log('🚀 Starting backend connectivity tests...');
  console.log(`📍 Target URL: ${BACKEND_URL}`);
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('');
  
  const tests = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'Dashboard Stats', endpoint: '/dashboard/stats' },
    { name: 'Revenue Trend', endpoint: '/dashboard/revenue-trend' },
    { name: 'Order Status', endpoint: '/dashboard/order-status' },
    { name: 'Top Products', endpoint: '/dashboard/top-products' },
    { name: 'Stock Levels', endpoint: '/dashboard/stock-levels' },
    { name: 'Regional Sales', endpoint: '/dashboard/regional-sales' },
    { name: 'Category Performance', endpoint: '/dashboard/category-performance' },
    { name: 'Recent Orders', endpoint: '/dashboard/recent-orders-admin' },
    { name: 'Quick Stats', endpoint: '/dashboard/quick-stats' },
  ];
  
  const results: TestResult[] = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.endpoint);
    results.push(result);
    
    if (result.status === 'success') {
      console.log(`✅ ${result.name}: ${result.responseTime}`);
    } else {
      console.log(`❌ ${result.name}: ${result.error}`);
    }
  }
  
  console.log('');
  console.log('📊 Test Summary:');
  console.log(`✅ Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`❌ Failed: ${results.filter(r => r.status === 'error').length}`);
  
  // Show detailed results
  console.log('');
  console.log('🔍 Detailed Results:');
  results.forEach(result => {
    console.log(`\n${result.status === 'success' ? '✅' : '❌'} ${result.name}:`);
    if (result.responseTime) console.log(`   Response Time: ${result.responseTime}`);
    if (result.error) console.log(`   Error: ${result.error}`);
    if (result.details) {
      console.log('   Details:', JSON.stringify(result.details, null, 4));
    }
  });
  
  // Exit with error code if any tests failed
  const hasErrors = results.some(r => r.status === 'error');
  if (hasErrors) {
    console.log('\n⚠️  Some tests failed. Check your backend connection and configuration.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed! Backend is responding correctly.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});
