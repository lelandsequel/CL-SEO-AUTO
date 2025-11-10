# 🐍 SEO Lead Finder - Python CLI Version

A simple command-line tool to find local businesses with SEO issues. Perfect for generating leads for web design and SEO services.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up API Keys

You need Google Cloud API keys (same ones work for both APIs):

```bash
export GOOGLE_PLACES_API_KEY="your_google_api_key_here"
export PSI_API_KEY="your_pagespeed_api_key_here"
```

Or create a `.env` file (not tracked in git):
```
GOOGLE_PLACES_API_KEY=your_google_api_key_here
PSI_API_KEY=your_pagespeed_api_key_here
```

### 3. Run the Tool

```bash
# Search specific industries
python seo_lead_finder.py "Seattle, WA" --industries "dentists,plumbers,HVAC"

# Use default high-value industries
python seo_lead_finder.py "Austin, TX" --auto

# Save results to CSV
python seo_lead_finder.py "Miami, FL" --industries "lawyers" --save leads.csv

# Output as JSON
python seo_lead_finder.py "Portland, OR" --industries "landscaping" --output json
```

## 📖 Usage

```
usage: seo_lead_finder.py [-h] [--industries INDUSTRIES] [--auto] 
                          [--max-per-industry MAX_PER_INDUSTRY]
                          [--output {table,json,csv}] [--save SAVE]
                          location

positional arguments:
  location              Location to search (e.g., "Seattle, WA")

optional arguments:
  -h, --help            show this help message and exit
  --industries INDUSTRIES, -i INDUSTRIES
                        Comma-separated industries to search
  --auto                Use default high-value industries
  --max-per-industry MAX_PER_INDUSTRY, -m MAX_PER_INDUSTRY
                        Maximum results per industry (default: 3)
  --output {table,json,csv}, -o {table,json,csv}
                        Output format (default: table)
  --save SAVE, -s SAVE  Save results to CSV file
```

## 🎯 How It Works

1. **Searches Google Places** - Finds businesses in your target location and industry
2. **Analyzes SEO** - Uses Google PageSpeed Insights to check their website's SEO
3. **Scores & Categories** - Ranks businesses by SEO quality:
   - 🔥 **HOT** (Score < 50) - Poor SEO, best leads!
   - 🟡 **WARM** (Score 50-69) - Some SEO issues
   - ❄️ **COLD** (Score 70+) - Good SEO, harder to convert

## 📊 Output Formats

### Table (Default)
Clean, readable table in your terminal:
```
====================================================================================================
Business                       Industry        SEO Score  Category             Website
====================================================================================================
Joe's Plumbing                 plumbers        35         HOT (Poor SEO)       joesplumbing.com
Smith Dental                   dentists        55         WARM                 smithdental.com
ABC HVAC                       HVAC            75         COLD (Good SEO)      abchvac.com
====================================================================================================
```

### CSV
Comma-separated values, perfect for importing into spreadsheets:
```bash
python seo_lead_finder.py "Seattle, WA" --auto --output csv > leads.csv
```

### JSON
Structured data for further processing:
```bash
python seo_lead_finder.py "Seattle, WA" --auto --output json > leads.json
```

## 🔑 Getting API Keys

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Enable these APIs:
   - Places API
   - PageSpeed Insights API
4. Create credentials (API Key)
5. Use the same API key for both environment variables

**Note:** Google Cloud offers free tiers for both APIs, but you may need to set up billing.

## 💡 Tips

- **Focus on small businesses** - They often have the worst SEO
- **Target service industries** - Dentists, plumbers, lawyers, HVAC, etc.
- **Look for low scores** - Businesses with scores under 50 are the best leads
- **Save your results** - Use `--save leads.csv` to keep track of prospects
- **Adjust max results** - Use `-m 5` to get more results per industry

## 🆚 vs. Next.js Web Version

This Python CLI tool is the **original, simple version** of the SEO Lead Finder. It:

- ✅ Works entirely from the command line
- ✅ Requires no database setup
- ✅ Outputs results immediately
- ✅ Perfect for quick lead generation
- ✅ Easy to schedule with cron jobs

The Next.js web version (in this repo) adds:
- Beautiful UI
- Database storage (Supabase)
- Automation scheduling
- Password protection
- Results dashboard

## 📝 Examples

### Find lawyers in New York
```bash
python seo_lead_finder.py "New York, NY" --industries "lawyers,attorneys" --save ny-lawyers.csv
```

### Quick search with defaults
```bash
python seo_lead_finder.py "Los Angeles, CA" --auto
```

### Search multiple industries and save
```bash
python seo_lead_finder.py "Chicago, IL" \
  --industries "dentists,plumbers,electricians,roofers,landscaping" \
  --max-per-industry 5 \
  --save chicago-leads.csv
```

### Get JSON for custom processing
```bash
python seo_lead_finder.py "Boston, MA" --auto --output json | jq '.[] | select(.seo_score < 50)'
```

## 🤝 Contributing

This is a simple, standalone tool. Feel free to modify it for your needs!

## 📄 License

Use it however you want! Built by C&L Page Services.

---

**Need the fancy web version?** Check out the main README.md for the Next.js version with UI, database, and automation features.
