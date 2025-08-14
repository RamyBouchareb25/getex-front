#!/bin/bash

# Read secrets from files and export as environment variables
if [ -f "/run/secrets/NEXTAUTH_SECRET" ]; then
    export NEXTAUTH_SECRET=$(cat /run/secrets/NEXTAUTH_SECRET)
fi

if [ -f "/run/secrets/NEXTAUTH_URL" ]; then
    export NEXTAUTH_URL=$(cat /run/secrets/NEXTAUTH_URL)
fi

if [ -f "/run/secrets/NEXT_PUBLIC_BACKEND_URL" ]; then
    export NEXT_PUBLIC_BACKEND_URL=$(cat /run/secrets/NEXT_PUBLIC_BACKEND_URL)
fi

if [ -f "/run/secrets/BACKEND_HOST" ]; then
    export BACKEND_HOST=$(cat /run/secrets/BACKEND_HOST)
fi

if [ -f "/run/secrets/BACKEND_PROTOCOL" ]; then
    export BACKEND_PROTOCOL=$(cat /run/secrets/BACKEND_PROTOCOL)
fi

if [ -f "/run/secrets/NODE_TLS_REJECT_UNAUTHORIZED" ]; then
    export NODE_TLS_REJECT_UNAUTHORIZED=$(cat /run/secrets/NODE_TLS_REJECT_UNAUTHORIZED)
fi

# Start the application
exec "$@"