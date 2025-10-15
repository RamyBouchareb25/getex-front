#!/bin/bash

set -e

echo "🚀 Starting Jacket's Club Web Application"
echo "=================================="

# Environment variables are now injected directly by Kubernetes
echo "📋 Using environment variables from Kubernetes secrets..."

echo "🔍 Environment Summary:"
echo "NODE_ENV: $NODE_ENV"
echo "BACKEND_URL: $BACKEND_URL"
echo "BACKEND_HOST: $BACKEND_HOST"
echo "BACKEND_PROTOCOL: $BACKEND_PROTOCOL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_SECRET: $NEXTAUTH_SECRET"
echo "NEXT_PUBLIC_BACKEND_URL: $NEXT_PUBLIC_BACKEND_URL"
echo "PORT: $PORT"

# Handle relative BACKEND_URL by setting fallback host/protocol
if [[ "$BACKEND_URL" == /api* ]] && [ -z "$BACKEND_HOST" ]; then
    echo "⚠️  BACKEND_URL is relative but BACKEND_HOST not set, using fallback"
    export BACKEND_HOST="${BACKEND_HOST:-localhost:3000}"
    export BACKEND_PROTOCOL="${BACKEND_PROTOCOL:-http}"
fi

echo ""

# Validate required environment variables
MISSING_VARS=""
if [ -z "$BACKEND_URL" ]; then
    MISSING_VARS="$MISSING_VARS BACKEND_URL"
fi
if [ -z "$NEXTAUTH_URL" ]; then
    MISSING_VARS="$MISSING_VARS NEXTAUTH_URL"
fi
if [ -z "$NEXTAUTH_SECRET" ]; then
    MISSING_VARS="$MISSING_VARS NEXTAUTH_SECRET"
fi

if [ -n "$MISSING_VARS" ]; then
    echo "❌ Missing required environment variables:$MISSING_VARS"
    echo "🔍 Running diagnostics..."
    /usr/local/bin/diagnose
    echo ""
    echo "⚠️  Application will continue but may not work correctly"
else
    echo "✅ All required environment variables are set"
fi

echo "🏁 Starting the application..."
echo ""

# Start the application
exec "$@"