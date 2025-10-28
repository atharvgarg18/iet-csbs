#!/usr/bin/env node

/**
 * Simple test script to verify new API functions work locally
 * Run: node test-api.js
 */

const testEndpoints = [
  { name: 'Ping', url: 'http://localhost:8888/api/ping', method: 'GET' },
  { name: 'Debug', url: 'http://localhost:8888/api/debug', method: 'GET' },
  { name: 'Auth Test', url: 'http://localhost:8888/api/auth/test', method: 'GET' },
];

async function testAPI() {
  console.log('🧪 Testing New API Functions\n');
  console.log('Make sure you have run: netlify dev\n');

  for (const endpoint of testEndpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: SUCCESS`);
        console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 100));
      } else {
        console.log(`❌ ${endpoint.name}: FAILED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error:`, data);
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ERROR`);
      console.log(`   ${error.message}`);
    }
    console.log('');
  }

  console.log('📝 Note: Auth endpoints require login credentials');
  console.log('📝 Admin endpoints require valid session cookies\n');
}

testAPI();
