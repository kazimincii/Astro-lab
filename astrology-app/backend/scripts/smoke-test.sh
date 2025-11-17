#!/bin/bash

# Smoke Tests - Quick validation after deployment

set -e

# Configuration
API_URL=${API_URL:-http://localhost:3000/api/v1}
TIMEOUT=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 Running smoke tests against: $API_URL"
echo ""

# Test counter
PASSED=0
FAILED=0

# Helper function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local data=$5

    echo -n "Testing: $description... "

    if [ -z "$data" ]; then
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            --max-time $TIMEOUT \
            "$API_URL$endpoint" 2>&1)
    else
        response=$(curl -s -o /dev/null -w "%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            --max-time $TIMEOUT \
            "$API_URL$endpoint" 2>&1)
    fi

    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $response)"
        PASSED=$((PASSED+1))
    else
        echo -e "${RED}❌ FAILED${NC} (Expected: $expected_status, Got: $response)"
        FAILED=$((FAILED+1))
    fi
}

# 1. Health Check
test_endpoint "GET" "/health" "200" "Health endpoint"

# 2. Health Liveness
test_endpoint "GET" "/health/live" "200" "Liveness probe"

# 3. Health Readiness
test_endpoint "GET" "/health/ready" "200" "Readiness probe"

# 4. Auth endpoints (should return validation errors, not 500)
test_endpoint "POST" "/auth/register" "400" "Register with no data"

test_endpoint "POST" "/auth/login" "400" "Login with no data"

# 5. Protected endpoint without auth (should return 401)
test_endpoint "GET" "/profiles" "401" "Protected endpoint without auth"

# 6. Non-existent endpoint (should return 404)
test_endpoint "GET" "/nonexistent" "404" "Non-existent endpoint"

echo ""
echo "================================"
echo -e "Total tests: $((PASSED+FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "================================"

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ Smoke tests failed${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All smoke tests passed${NC}"
    exit 0
fi
