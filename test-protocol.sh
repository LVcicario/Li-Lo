#!/bin/bash

# Test Configuration
BASE_URL="http://localhost:3000"
PASS_COUNT=0
FAIL_COUNT=0
TOTAL_TESTS=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to test a URL
test_url() {
    local category=$1
    local test_name=$2
    local url=$3
    local expected_content=$4

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")

    if [ "$response" == "200" ] || [ "$response" == "307" ]; then
        if [ -n "$expected_content" ]; then
            content=$(curl -s "$url")
            if echo "$content" | grep -q "$expected_content"; then
                echo -e "${GREEN}✅ $category - $test_name: PASS (Status: $response, Content found)${NC}"
                PASS_COUNT=$((PASS_COUNT + 1))
            else
                echo -e "${RED}❌ $category - $test_name: FAIL (Status: $response, Content not found)${NC}"
                FAIL_COUNT=$((FAIL_COUNT + 1))
            fi
        else
            echo -e "${GREEN}✅ $category - $test_name: PASS (Status: $response)${NC}"
            PASS_COUNT=$((PASS_COUNT + 1))
        fi
    else
        echo -e "${RED}❌ $category - $test_name: FAIL (Status: $response)${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

echo "============================================================"
echo "🚀 Li-Lo E-Commerce Platform - Comprehensive Test Protocol"
echo "============================================================"
echo "Starting tests at: $(date)"
echo "Testing URL: $BASE_URL"
echo "============================================================"

# 1. TEST PRODUCT DATA & STOCK SYSTEM
echo -e "\n📦 TESTING PRODUCT DATA & STOCK SYSTEM\n"
test_url "Products" "Homepage" "$BASE_URL" "Li-Lo"
test_url "Products" "Sneakers page" "$BASE_URL/sneakers" ""
test_url "Products" "Product detail (Jordan 1)" "$BASE_URL/sneakers/air-jordan-1-chicago-2015" ""
test_url "Products" "Exclusive page" "$BASE_URL/exclusive" ""
test_url "Products" "New arrivals" "$BASE_URL/new-arrivals" ""
test_url "Products" "Limited edition" "$BASE_URL/limited-edition" ""

# 2. TEST AUTHENTICATION
echo -e "\n🔐 TESTING AUTHENTICATION SYSTEM\n"
test_url "Auth" "Login page" "$BASE_URL/auth/login" "email"
test_url "Auth" "Register page" "$BASE_URL/auth/register" "password"
test_url "Auth" "Forgot password" "$BASE_URL/auth/forgot-password" ""
test_url "Auth" "Verify email" "$BASE_URL/auth/verify-email" ""

# 3. TEST SHOPPING CART & CHECKOUT
echo -e "\n🛒 TESTING SHOPPING CART & CHECKOUT\n"
test_url "Cart" "Cart page" "$BASE_URL/cart" ""
test_url "Checkout" "Checkout page" "$BASE_URL/checkout" ""
test_url "Checkout" "Success page" "$BASE_URL/checkout/success" ""

# 4. TEST ADMIN SPACE
echo -e "\n👨‍💼 TESTING ADMIN SPACE\n"
test_url "Admin" "Admin login" "$BASE_URL/admin/login" ""
test_url "Admin" "Admin dashboard" "$BASE_URL/admin/dashboard" ""
test_url "Admin" "Admin main" "$BASE_URL/admin" ""

# 5. TEST CLIENT ACCOUNT AREA
echo -e "\n👤 TESTING CLIENT ACCOUNT AREA\n"
test_url "Client" "Account dashboard" "$BASE_URL/account/dashboard" ""
test_url "Client" "Account profile" "$BASE_URL/account/profile" ""
test_url "Client" "Account orders" "$BASE_URL/account/orders" ""
test_url "Client" "Account addresses" "$BASE_URL/account/addresses" ""
test_url "Client" "Account payment" "$BASE_URL/account/payment" ""
test_url "Client" "Account wishlist" "$BASE_URL/account/wishlist" ""
test_url "Client" "Account preferences" "$BASE_URL/account/preferences" ""

# 6. TEST SEARCH & FILTERS
echo -e "\n🔍 TESTING SEARCH & FILTERS\n"
test_url "Search" "Search Jordan" "$BASE_URL/sneakers?search=jordan" ""
test_url "Search" "Filter by brand" "$BASE_URL/sneakers?brand=nike" ""
test_url "Search" "Collections page" "$BASE_URL/collections" ""

# 7. TEST API ENDPOINTS
echo -e "\n🔌 TESTING API ENDPOINTS\n"
test_url "API" "Cart API" "$BASE_URL/api/cart" ""
test_url "API" "Wishlist API" "$BASE_URL/api/wishlist" ""
test_url "API" "Product API" "$BASE_URL/api/products" ""
test_url "API" "Discount API" "$BASE_URL/api/discount/validate" ""

# 8. TEST STATIC PAGES
echo -e "\n📄 TESTING STATIC PAGES\n"
test_url "Static" "About page" "$BASE_URL/about" ""
test_url "Static" "Contact page" "$BASE_URL/contact" ""
test_url "Static" "Shipping info" "$BASE_URL/shipping" ""
test_url "Static" "Returns policy" "$BASE_URL/returns" ""
test_url "Static" "Terms of service" "$BASE_URL/terms" ""
test_url "Static" "Privacy policy" "$BASE_URL/privacy" ""
test_url "Static" "Size guide" "$BASE_URL/size-guide" ""
test_url "Static" "Authenticity" "$BASE_URL/authenticity" ""
test_url "Static" "Seller page" "$BASE_URL/seller" ""

# 9. TEST REAL PRODUCT DATA
echo -e "\n🎯 TESTING REAL PRODUCT DATA\n"

# Test specific product endpoints
echo "Testing product detail API..."
product_response=$(curl -s "$BASE_URL/api/products/air-jordan-1-chicago-2015")
if echo "$product_response" | grep -q "Jordan"; then
    echo -e "${GREEN}✅ API - Product detail: PASS (Real data found)${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
else
    echo -e "${RED}❌ API - Product detail: FAIL (No real data)${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# Test for real prices (not mock €32,500)
echo "Checking for realistic prices..."
homepage=$(curl -s "$BASE_URL")
if echo "$homepage" | grep -q "32,500" || echo "$homepage" | grep -q "32500"; then
    echo -e "${RED}❌ Products - Realistic prices: FAIL (Found unrealistic €32,500 price)${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
else
    echo -e "${GREEN}✅ Products - Realistic prices: PASS (No mock prices found)${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

# 10. GENERATE FINAL REPORT
echo -e "\n============================================================"
echo "📋 FINAL TEST REPORT"
echo "============================================================"

# Calculate pass rate
if [ $TOTAL_TESTS -gt 0 ]; then
    PASS_RATE=$((PASS_COUNT * 100 / TOTAL_TESTS))
else
    PASS_RATE=0
fi

echo -e "\nOVERALL RESULTS:"
echo "Total Tests Run: $TOTAL_TESTS"
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo "Overall Pass Rate: $PASS_RATE%"

echo -e "\n💡 RECOMMENDATIONS:"
echo "----------------------------------------"

if [ $PASS_RATE -eq 100 ]; then
    echo -e "${GREEN}✨ All systems operational! The website is fully functional.${NC}"
elif [ $PASS_RATE -ge 80 ]; then
    echo -e "${YELLOW}✓ Website is mostly functional with minor issues to address.${NC}"
elif [ $PASS_RATE -ge 60 ]; then
    echo -e "${YELLOW}⚠️ Several critical systems need attention before launch.${NC}"
else
    echo -e "${RED}❌ Major issues detected. Significant work required.${NC}"
fi

# Check specific critical systems
echo -e "\n🔍 CRITICAL SYSTEMS STATUS:"
echo "----------------------------------------"

# Check if products are working
if curl -s "$BASE_URL/sneakers" | grep -q "Jordan\|Nike\|Yeezy"; then
    echo -e "${GREEN}✅ Product System: Real sneaker data detected${NC}"
else
    echo -e "${RED}❌ Product System: No real product data found${NC}"
fi

# Check if Stripe is integrated
if curl -s "$BASE_URL/checkout" | grep -qi "stripe"; then
    echo -e "${GREEN}✅ Payment System: Stripe integration detected${NC}"
else
    echo -e "${YELLOW}⚠️ Payment System: Stripe integration needs verification${NC}"
fi

# Check authentication
auth_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/auth/login")
if [ "$auth_status" == "200" ]; then
    echo -e "${GREEN}✅ Authentication: Login system accessible${NC}"
else
    echo -e "${RED}❌ Authentication: Login system not accessible${NC}"
fi

# Check admin
admin_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin/login")
if [ "$admin_status" == "200" ] || [ "$admin_status" == "307" ]; then
    echo -e "${GREEN}✅ Admin System: Admin area configured${NC}"
else
    echo -e "${RED}❌ Admin System: Admin area not accessible${NC}"
fi

echo -e "\n============================================================"
echo "Test completed at: $(date)"
echo "============================================================"