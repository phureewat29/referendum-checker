import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { thaiId } = await request.json();

    if (!thaiId || thaiId.length !== 13) {
      return NextResponse.json(
        { source: 'election', error: 'Invalid Thai ID' },
        { status: 400 }
      );
    }

    const API_URL = `https://boraservices.bora.dopa.go.th/api/election/v1/nenuit/${thaiId}`;

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Parse the response - data is an array with nvpop object
    const nvpop = data[0]?.nvpop;

    if (!nvpop) {
      throw new Error('No data found for this Thai ID');
    }

    // Parse location string: "location# subdistrict, district, province"
    const locationParts = nvpop.desp?.split('#') || [];
    const addressText = locationParts[1]?.trim() || '';

    // Extract province (last word after last space)
    const provinceMatch = addressText.match(/\s([^\s]+)$/);
    const province = provinceMatch ? provinceMatch[1] : '';

    // Extract district (words before province, after "เขต")
    const districtMatch = addressText.match(/เขต([^\s]+)/);
    const district = districtMatch ? `เขต${districtMatch[1]}` : '';

    // Extract subdistrict (words after "แขวง")
    const subdistrictMatch = addressText.match(/แขวง([^\s]+)/);
    const subdistrict = subdistrictMatch ? `แขวง${subdistrictMatch[1]}` : '';

    return NextResponse.json({
      source: 'election',
      region: `เขต ${nvpop.earea}`,
      pollingStation: `หน่วยที่ ${nvpop.eunit}`,
      location: nvpop.desp,
      province,
      district,
      subdistrict,
      rawData: data,
    });

  } catch (error: any) {
    console.error('Election API Error:', error);
    return NextResponse.json(
      {
        source: 'election',
        error: error.message || 'Failed to fetch from election API',
      },
      { status: 500 }
    );
  }
}
