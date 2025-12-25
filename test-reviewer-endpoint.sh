#!/bin/bash
# Test script to verify reviewer manuscript endpoint returns revision data

TOKEN="your_reviewer_token_here"
MANUSCRIPT_ID="manuscript_id_here"

echo "Testing GET /api/reviews/manuscript/{id}/for-review endpoint"
echo "============================================================"

curl -X GET "http://localhost:3000/api/reviews/manuscript/$MANUSCRIPT_ID/for-review" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -s | jq '.data.manuscript | {currentRound, isRevised, revisionHistory}' 2>/dev/null || \
  echo "Failed - ensure you have a valid token and manuscript ID"

echo ""
echo "Full response structure:"
curl -X GET "http://localhost:3000/api/reviews/manuscript/$MANUSCRIPT_ID/for-review" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -s | jq '.' 2>/dev/null || echo "Failed to parse JSON"
