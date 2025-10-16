import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { location, industries, mode } = await request.json();

    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const PSI_API_KEY = process.env.PSI_API_KEY;

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API key not configured' },
        { status: 500 }
      );
    }

    // Determine industries to search
    let industriesToSearch: string[] = [];
    
    if (mode === 'auto') {
      // Default high-value industries
      industriesToSearch = ['dentists', 'plumbers', 'HVAC', 'lawyers', 'landscaping'];
    } else if (mode === 'manual' && industries) {
      industriesToSearch = industries.split(',').map((i: string) => i.trim());
    } else if (mode === 'hybrid') {
      const customIndustries = industries ? industries.split(',').map((i: string) => i.trim()) : [];
      industriesToSearch = [...new Set([...customIndustries, 'dentists', 'plumbers', 'HVAC'])];
    }

    const results: any[] = [];

    // Search each industry
    for (const industry of industriesToSearch.slice(0, 3)) {
      try {
        // Google Places Text Search
        const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          `${industry} in ${location}`
        )}&key=${GOOGLE_PLACES_API_KEY}`;

        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();

        if (placesData.results && placesData.results.length > 0) {
          // Take first 3 results per industry
          for (const place of placesData.results.slice(0, 3)) {
            // Get place details
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,rating,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
            
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            const details = detailsData.result || {};

            let seoScore = 50; // Default score
            let issues: string[] = [];

            // If we have a website, check PageSpeed
            if (details.website && PSI_API_KEY) {
              try {
                const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
                  details.website
                )}&key=${PSI_API_KEY}&category=seo&category=performance`;

                const psiResponse = await fetch(psiUrl);
                const psiData = await psiResponse.json();

                if (psiData.lighthouseResult) {
                  const seoCategory = psiData.lighthouseResult.categories.seo;
                  const perfCategory = psiData.lighthouseResult.categories.performance;
                  
                  seoScore = Math.round((seoCategory.score || 0.5) * 100);

                  // Analyze issues
                  if (perfCategory.score < 0.5) {
                    issues.push('Slow page speed');
                  }
                  if (seoCategory.score < 0.7) {
                    issues.push('SEO improvements needed');
                  }
                  
                  const audits = psiData.lighthouseResult.audits;
                  if (audits['meta-description']?.score === 0) {
                    issues.push('Missing meta descriptions');
                  }
                  if (audits['viewport']?.score === 0) {
                    issues.push('No mobile optimization');
                  }
                  if (audits['structured-data']?.score === 0) {
                    issues.push('Missing schema markup');
                  }
                }
              } catch (psiError) {
                console.error('PSI error:', psiError);
                issues.push('Could not analyze SEO');
              }
            } else {
              issues.push('No website found');
              seoScore = 30;
            }

            results.push({
              business: details.name || place.name,
              industry,
              location,
              website: details.website || 'N/A',
              seo_score: seoScore,
              phone: details.formatted_phone_number || 'N/A',
              email: 'N/A', // Would need Hunter.io API
              issues: issues.length > 0 ? issues : ['No major issues detected'],
              rating: details.rating || 0,
              reviews: details.user_ratings_total || 0,
            });
          }
        }
      } catch (industryError) {
        console.error(`Error searching ${industry}:`, industryError);
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search for leads' },
      { status: 500 }
    );
  }
}

