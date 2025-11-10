#!/bin/bash
# Example script showing how to use the SEO Lead Finder Python CLI

echo "========================================"
echo "SEO Lead Finder - Usage Examples"
echo "========================================"
echo ""

echo "Before running these examples, set your API keys:"
echo "  export GOOGLE_PLACES_API_KEY='your_key_here'"
echo "  export PSI_API_KEY='your_key_here'"
echo ""

echo "Example 1: Quick search with auto mode"
echo "  python3 seo_lead_finder.py 'Seattle, WA' --auto"
echo ""

echo "Example 2: Search specific industries"
echo "  python3 seo_lead_finder.py 'Austin, TX' --industries 'dentists,plumbers,HVAC'"
echo ""

echo "Example 3: Save results to CSV"
echo "  python3 seo_lead_finder.py 'Miami, FL' --industries 'lawyers' --save leads.csv"
echo ""

echo "Example 4: Get more results per industry"
echo "  python3 seo_lead_finder.py 'Portland, OR' --industries 'landscaping' --max-per-industry 5"
echo ""

echo "Example 5: Output as JSON for processing"
echo "  python3 seo_lead_finder.py 'Boston, MA' --auto --output json > leads.json"
echo ""

echo "Example 6: Output as CSV to pipe to other tools"
echo "  python3 seo_lead_finder.py 'Chicago, IL' --industries 'dentists' --output csv | column -t -s,"
echo ""

echo "For full help, run:"
echo "  python3 seo_lead_finder.py --help"
