#!/bin/bash

# Quick test script for production API
# Replace with your actual domain

DOMAIN="https://ietcsbs.tech"

echo "🧪 Testing Production API Functions"
echo "===================================="
echo ""

echo "1️⃣ Testing Ping..."
curl -s "$DOMAIN/api/ping" | jq '.' || curl -s "$DOMAIN/api/ping"
echo ""
echo ""

echo "2️⃣ Testing Debug..."
curl -s "$DOMAIN/api/debug" | jq '.' || curl -s "$DOMAIN/api/debug"
echo ""
echo ""

echo "3️⃣ Testing Auth Test..."
curl -s "$DOMAIN/api/auth/test" | jq '.' || curl -s "$DOMAIN/api/auth/test"
echo ""
echo ""

echo "✅ Basic tests complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check Netlify dashboard for build status"
echo "   2. Test your website at $DOMAIN"
echo "   3. Try logging in if you have admin access"
echo "   4. Check gallery/notes/papers pages"
echo ""
echo "🔍 Monitor deployment at:"
echo "   https://app.netlify.com/sites/YOUR_SITE_NAME/deploys"
