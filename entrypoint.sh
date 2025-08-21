#!/bin/bash

set -e

echo "🚀 Starting Bellat Web Application"
echo "=================================="

# Read secrets from files and export as environment variables
echo "📋 Loading configuration from secrets..."

if [ -f "/run/secrets/NEXTAUTH_SECRET" ]; then
    export NEXTAUTH_SECRET=$(cat /run/secrets/NEXTAUTH_SECRET)
    echo "✅ NEXTAUTH_SECRET loaded from secret"
else
    echo "⚠️  NEXTAUTH_SECRET not found in secrets"
fi

if [ -f "/run/secrets/NEXTAUTH_URL" ]; then
    export NEXTAUTH_URL=$(cat /run/secrets/NEXTAUTH_URL)
    echo "✅ NEXTAUTH_URL loaded from secret: $NEXTAUTH_URL"
else
    echo "⚠️  NEXTAUTH_URL not found in secrets"
fi

if [ -f "/run/secrets/NEXT_PUBLIC_BACKEND_URL" ]; then
    export NEXT_PUBLIC_BACKEND_URL=$(cat /run/secrets/NEXT_PUBLIC_BACKEND_URL)
    echo "✅ NEXT_PUBLIC_BACKEND_URL loaded from secret: $NEXT_PUBLIC_BACKEND_URL"
else
    echo "⚠️  NEXT_PUBLIC_BACKEND_URL not found in secrets"
fi

if [ -f "/run/secrets/BACKEND_URL" ]; then
    export BACKEND_URL=$(cat /run/secrets/BACKEND_URL)
    echo "✅ BACKEND_URL loaded from secret: $BACKEND_URL"
else
    echo "⚠️  BACKEND_URL not found in secrets"
fi

if [ -f "/run/secrets/BACKEND_HOST" ]; then
    export BACKEND_HOST=$(cat /run/secrets/BACKEND_HOST)
    echo "✅ BACKEND_HOST loaded from secret: $BACKEND_HOST"
else
    echo "⚠️  BACKEND_HOST not found in secrets"
fi

if [ -f "/run/secrets/BACKEND_PROTOCOL" ]; then
    export BACKEND_PROTOCOL=$(cat /run/secrets/BACKEND_PROTOCOL)
    echo "✅ BACKEND_PROTOCOL loaded from secret: $BACKEND_PROTOCOL"
else
    echo "⚠️  BACKEND_PROTOCOL not found in secrets"
fi

if [ -f "/run/secrets/NODE_TLS_REJECT_UNAUTHORIZED" ]; then
    export NODE_TLS_REJECT_UNAUTHORIZED=$(cat /run/secrets/NODE_TLS_REJECT_UNAUTHORIZED)
    echo "✅ NODE_TLS_REJECT_UNAUTHORIZED loaded from secret: $NODE_TLS_REJECT_UNAUTHORIZED"
else
    echo "⚠️  NODE_TLS_REJECT_UNAUTHORIZED not found in secrets"
fi

echo ""
echo "🔍 Environment Summary:"
echo "NODE_ENV: $NODE_ENV"
echo "BACKEND_URL: $BACKEND_URL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "PORT: $PORT"
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