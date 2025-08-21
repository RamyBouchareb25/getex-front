#!/bin/bash

echo "🔍 Bellat Production Diagnostics"
echo "=================================="
echo "Timestamp: $(date -Iseconds)"
echo "Container ID: $(hostname)"
echo "User: $(whoami)"
echo "Working Directory: $(pwd)"
echo ""

echo "📋 Environment Variables:"
echo "NODE_ENV: $NODE_ENV"
echo "BACKEND_URL: $BACKEND_URL"
echo "BACKEND_HOST: $BACKEND_HOST"
echo "BACKEND_PROTOCOL: $BACKEND_PROTOCOL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "NEXTAUTH_SECRET: $(if [ -n "$NEXTAUTH_SECRET" ]; then echo '[SET]'; else echo '[NOT SET]'; fi)"
echo "PORT: $PORT"
echo "HOSTNAME_ENV: $HOSTNAME"
echo ""

echo "🌐 Network Configuration:"
echo "Container hostname: $(hostname)"
echo "Container IP: $(hostname -I 2>/dev/null || echo 'Unable to determine')"
echo ""

echo "📁 File System Check:"
echo "Current directory contents:"
ls -la
echo ""
echo ".next directory exists: $(if [ -d .next ]; then echo 'YES'; else echo 'NO'; fi)"
echo "server.js exists: $(if [ -f server.js ]; then echo 'YES'; else echo 'NO'; fi)"
echo "node_modules exists: $(if [ -d node_modules ]; then echo 'YES'; else echo 'NO'; fi)"
echo ""

echo "🔌 Network Connectivity Tests:"
if [ -n "$BACKEND_URL" ]; then
    echo "Testing backend connectivity to: $BACKEND_URL"
    
    # Parse the URL to get host and port
    BACKEND_HOST_ONLY=$(echo $BACKEND_URL | sed -E 's|^https?://([^:/]+).*|\1|')
    BACKEND_PORT=$(echo $BACKEND_URL | sed -E 's|^https?://[^:]+:?([0-9]+)?.*|\1|')
    
    if [ -z "$BACKEND_PORT" ]; then
        if [[ $BACKEND_URL == https://* ]]; then
            BACKEND_PORT=443
        else
            BACKEND_PORT=80
        fi
    fi
    
    echo "Parsed backend host: $BACKEND_HOST_ONLY"
    echo "Parsed backend port: $BACKEND_PORT"
    
    # DNS resolution test
    echo "DNS resolution test:"
    if command -v nslookup >/dev/null 2>&1; then
        nslookup $BACKEND_HOST_ONLY || echo "DNS lookup failed"
    else
        echo "nslookup not available"
    fi
    
    # Ping test (if ping is available)
    echo "Ping test:"
    if command -v ping >/dev/null 2>&1; then
        ping -c 3 $BACKEND_HOST_ONLY 2>/dev/null || echo "Ping failed or not allowed"
    else
        echo "ping not available"
    fi
    
    # Port connectivity test
    echo "Port connectivity test:"
    if command -v nc >/dev/null 2>&1; then
        timeout 5 nc -zv $BACKEND_HOST_ONLY $BACKEND_PORT || echo "Port connection failed"
    elif command -v telnet >/dev/null 2>&1; then
        timeout 5 telnet $BACKEND_HOST_ONLY $BACKEND_PORT || echo "Telnet connection failed"
    else
        echo "Neither nc nor telnet available for port testing"
    fi
    
    # HTTP test using curl
    echo "HTTP connectivity test:"
    if command -v curl >/dev/null 2>&1; then
        echo "Testing $BACKEND_URL/health"
        curl -v --max-time 10 --connect-timeout 5 "$BACKEND_URL/health" 2>&1 || echo "HTTP request failed"
    else
        echo "curl not available"
    fi
else
    echo "BACKEND_URL not set - skipping connectivity tests"
fi
echo ""

echo "🏥 Application Health Check:"
echo "Local health endpoint test:"
if command -v curl >/dev/null 2>&1; then
    curl -s "http://localhost:$PORT/api/health" || echo "Local health check failed"
else
    echo "curl not available for health check"
fi
echo ""

echo "🔧 Process Information:"
echo "Current processes:"
ps aux | head -20
echo ""

echo "💾 Memory Information:"
if command -v free >/dev/null 2>&1; then
    free -h
else
    echo "free command not available"
fi
echo ""

echo "📊 System Load:"
if [ -f /proc/loadavg ]; then
    echo "Load average: $(cat /proc/loadavg)"
else
    echo "Load average not available"
fi
echo ""

echo "🔍 Kubernetes Environment Variables:"
echo "Environment variables are injected by Kubernetes:"
echo "NEXTAUTH_SECRET: $(if [ -n "$NEXTAUTH_SECRET" ]; then echo '[SET]'; else echo '[NOT SET]'; fi)"
echo "BACKEND_URL: $BACKEND_URL"
echo "BACKEND_HOST: $BACKEND_HOST"
echo "BACKEND_PROTOCOL: $BACKEND_PROTOCOL"
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo ""

echo "✅ Diagnostic completed at $(date -Iseconds)"
