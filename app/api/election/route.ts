import { NextRequest, NextResponse } from 'next/server';
import { parseElectionResponse } from '@/lib/election-parser';

const API_URL = 'https://boraservices.bora.dopa.go.th/api/election/v1/nenuit';

export async function POST(request: NextRequest) {
  try {
    const { thaiId } = await request.json();

    // Validate Thai ID
    if (!thaiId || thaiId.length !== 13) {
      return NextResponse.json(
        { source: 'election', error: 'Invalid Thai ID' },
        { status: 400 }
      );
    }

    // Fetch from API
    const response = await fetch(`${API_URL}/${thaiId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the response
    const parsed = parseElectionResponse(data);

    return NextResponse.json({
      source: 'election',
      ...parsed,
      rawData: data,
    });

  } catch (error: any) {
    console.error('Election API Error:', error);
    return NextResponse.json(
      {
        source: 'election',
        error: error.message || 'Failed to fetch election data',
      },
      { status: 500 }
    );
  }
}
