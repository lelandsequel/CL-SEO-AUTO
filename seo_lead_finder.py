#!/usr/bin/env python3
"""
Simple SEO Lead Finder - Command Line Version
Finds local businesses and analyzes their SEO to generate leads.
"""

import os
import sys
import json
import argparse
import requests
from typing import List, Dict, Optional
import csv
from datetime import datetime


def get_api_keys() -> tuple:
    """Get API keys from environment variables."""
    google_key = os.environ.get('GOOGLE_PLACES_API_KEY')
    psi_key = os.environ.get('PSI_API_KEY')
    
    if not google_key:
        print("ERROR: GOOGLE_PLACES_API_KEY environment variable not set")
        sys.exit(1)
    
    return google_key, psi_key


def search_places(location: str, industry: str, api_key: str) -> List[Dict]:
    """Search for businesses using Google Places API."""
    query = f"{industry} in {location}"
    url = f"https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        'query': query,
        'key': api_key
    }
    
    print(f"Searching for: {query}...")
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get('status') != 'OK':
            print(f"Warning: Places API returned status: {data.get('status')}")
            return []
        
        return data.get('results', [])
    except requests.exceptions.RequestException as e:
        print(f"Error searching places: {e}")
        return []


def get_place_details(place_id: str, api_key: str) -> Dict:
    """Get detailed information about a place."""
    url = f"https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        'place_id': place_id,
        'fields': 'name,formatted_phone_number,website,rating,user_ratings_total',
        'key': api_key
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('result', {})
    except requests.exceptions.RequestException as e:
        print(f"Error getting place details: {e}")
        return {}


def analyze_seo(website: str, psi_key: Optional[str]) -> tuple:
    """Analyze website SEO using PageSpeed Insights API."""
    if not website or not psi_key:
        return 30, ['No website found']
    
    url = f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        'url': website,
        'key': psi_key,
        'category': 'seo',
        'category': 'performance'
    }
    
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        lighthouse = data.get('lighthouseResult', {})
        categories = lighthouse.get('categories', {})
        audits = lighthouse.get('audits', {})
        
        seo_score = int((categories.get('seo', {}).get('score', 0.5)) * 100)
        perf_score = categories.get('performance', {}).get('score', 0.5)
        
        issues = []
        if perf_score < 0.5:
            issues.append('Slow page speed')
        if seo_score < 70:
            issues.append('SEO improvements needed')
        if audits.get('meta-description', {}).get('score') == 0:
            issues.append('Missing meta descriptions')
        if audits.get('viewport', {}).get('score') == 0:
            issues.append('No mobile optimization')
        if audits.get('structured-data', {}).get('score') == 0:
            issues.append('Missing schema markup')
        
        if not issues:
            issues = ['No major issues detected']
        
        return seo_score, issues
        
    except requests.exceptions.RequestException as e:
        print(f"Warning: Could not analyze SEO for {website}: {e}")
        return 50, ['Could not analyze SEO']


def categorize_lead(score: int) -> str:
    """Categorize lead based on SEO score."""
    if score >= 70:
        return 'COLD (Good SEO)'
    elif score >= 50:
        return 'WARM'
    else:
        return 'HOT (Poor SEO)'


def find_leads(location: str, industries: List[str], max_per_industry: int = 3) -> List[Dict]:
    """Find SEO leads for given location and industries."""
    google_key, psi_key = get_api_keys()
    
    all_leads = []
    
    for industry in industries:
        places = search_places(location, industry, google_key)
        
        for place in places[:max_per_industry]:
            print(f"  Analyzing: {place.get('name')}...")
            
            details = get_place_details(place['place_id'], google_key)
            website = details.get('website', 'N/A')
            
            seo_score, issues = analyze_seo(website if website != 'N/A' else None, psi_key)
            
            lead = {
                'business': details.get('name', place.get('name')),
                'industry': industry,
                'location': location,
                'website': website,
                'phone': details.get('formatted_phone_number', 'N/A'),
                'seo_score': seo_score,
                'category': categorize_lead(seo_score),
                'issues': '; '.join(issues),
                'rating': details.get('rating', 0),
                'reviews': details.get('user_ratings_total', 0),
            }
            
            all_leads.append(lead)
    
    return all_leads


def display_results(leads: List[Dict], output_format: str = 'table'):
    """Display results in specified format."""
    if not leads:
        print("\nNo leads found.")
        return
    
    if output_format == 'json':
        print(json.dumps(leads, indent=2))
    elif output_format == 'csv':
        # Print to stdout
        fieldnames = ['business', 'industry', 'location', 'website', 'phone', 
                     'seo_score', 'category', 'issues', 'rating', 'reviews']
        writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leads)
    else:  # table format
        print("\n" + "="*100)
        print(f"{'Business':<30} {'Industry':<15} {'SEO Score':<10} {'Category':<20} {'Website':<25}")
        print("="*100)
        
        for lead in sorted(leads, key=lambda x: x['seo_score']):
            print(f"{lead['business'][:29]:<30} "
                  f"{lead['industry'][:14]:<15} "
                  f"{lead['seo_score']:<10} "
                  f"{lead['category']:<20} "
                  f"{lead['website'][:24]:<25}")
        
        print("="*100)
        print(f"\nTotal leads found: {len(leads)}")
        
        # Summary by category
        hot = sum(1 for l in leads if 'HOT' in l['category'])
        warm = sum(1 for l in leads if 'WARM' in l['category'])
        cold = sum(1 for l in leads if 'COLD' in l['category'])
        
        print(f"  🔥 HOT (Poor SEO): {hot}")
        print(f"  🟡 WARM: {warm}")
        print(f"  ❄️  COLD (Good SEO): {cold}")


def save_to_file(leads: List[Dict], filename: str):
    """Save leads to a CSV file."""
    if not leads:
        print("No leads to save.")
        return
    
    fieldnames = ['business', 'industry', 'location', 'website', 'phone', 
                 'seo_score', 'category', 'issues', 'rating', 'reviews']
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(leads)
    
    print(f"\n✅ Results saved to: {filename}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Find local businesses with SEO issues to generate leads.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s "Seattle, WA" --industries "dentists,plumbers,HVAC"
  %(prog)s "Austin, TX" --auto
  %(prog)s "Miami, FL" --industries "lawyers" --output json
  %(prog)s "Portland, OR" --industries "landscaping" --save leads.csv
        """
    )
    
    parser.add_argument('location', help='Location to search (e.g., "Seattle, WA")')
    parser.add_argument('--industries', '-i', help='Comma-separated industries to search')
    parser.add_argument('--auto', action='store_true', 
                       help='Use default high-value industries (dentists, plumbers, HVAC, lawyers, landscaping)')
    parser.add_argument('--max-per-industry', '-m', type=int, default=3,
                       help='Maximum results per industry (default: 3)')
    parser.add_argument('--output', '-o', choices=['table', 'json', 'csv'], default='table',
                       help='Output format (default: table)')
    parser.add_argument('--save', '-s', help='Save results to CSV file')
    
    args = parser.parse_args()
    
    # Determine industries
    if args.auto:
        industries = ['dentists', 'plumbers', 'HVAC', 'lawyers', 'landscaping']
    elif args.industries:
        industries = [i.strip() for i in args.industries.split(',')]
    else:
        parser.error("Must specify either --industries or --auto")
    
    print(f"\n🔍 SEO Lead Finder")
    print(f"Location: {args.location}")
    print(f"Industries: {', '.join(industries)}")
    print(f"Max per industry: {args.max_per_industry}\n")
    
    # Find leads
    leads = find_leads(args.location, industries, args.max_per_industry)
    
    # Display results
    display_results(leads, args.output)
    
    # Save to file if requested
    if args.save:
        save_to_file(leads, args.save)


if __name__ == '__main__':
    main()
