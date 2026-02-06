/**
 * Parse election data from API response
 * Handles both regular voting and early voting cases
 */

interface NvpopData {
  eledate: number;
  earea: number;
  eunit: number;
  desp: string;
  pid: number;
  tfname: string;
  seq: number;
  mark1: number;
}

interface EarlyVoteData {
  Personal_details: {
    pid: number;
    tfname: string;
    catm_desc: string;
    earea: number;
    reg_type: number;
    reg_date: number;
    voted_flag: number;
  };
  Details_of_requesting_to_exercise_rights: {
    votecc_desc: string;
    vote_name: string;
    seq: number;
    eledate: number;
  };
}

interface ParsedElectionData {
  region: string;
  pollingStation: string;
  location: string;
  province: string;
  district: string;
  subdistrict: string;
  hasEarlyVoted: boolean;
  earlyVoteInfo?: EarlyVoteData;
}

/**
 * Parse location string format: "location# subdistrict, district, province"
 */
function parseLocationString(desp: string) {
  const parts = desp.split('#');
  const addressText = parts[1]?.trim() || '';

  // Extract province (last word)
  const provinceMatch = addressText.match(/\s([^\s]+)$/);
  const province = provinceMatch ? provinceMatch[1] : '';

  // Extract district (after "เขต" or "อำเภอ")
  const districtMatch = addressText.match(/(เขต|อำเภอ)([^\s]+)/);
  const district = districtMatch ? `${districtMatch[1]}${districtMatch[2]}` : '';

  // Extract subdistrict (after "แขวง" or "ตำบล")
  const subdistrictMatch = addressText.match(/(แขวง|ตำบล)([^\s]+)/);
  const subdistrict = subdistrictMatch ? `${subdistrictMatch[1]}${subdistrictMatch[2]}` : '';

  return { province, district, subdistrict };
}

/**
 * Parse early voting data
 */
function parseEarlyVoting(earlyVoteData: EarlyVoteData): ParsedElectionData {
  const { Personal_details, Details_of_requesting_to_exercise_rights } = earlyVoteData;

  return {
    region: `เขต ${Personal_details.earea}`,
    pollingStation: `ลำดับที่ ${Details_of_requesting_to_exercise_rights.seq}`,
    location: Details_of_requesting_to_exercise_rights.vote_name,
    province: Details_of_requesting_to_exercise_rights.votecc_desc,
    district: '',
    subdistrict: '',
    hasEarlyVoted: true,
    earlyVoteInfo: earlyVoteData,
  };
}

/**
 * Parse regular voting data
 */
function parseRegularVoting(nvpop: NvpopData): ParsedElectionData {
  const { province, district, subdistrict } = parseLocationString(nvpop.desp);

  return {
    region: `เขต ${nvpop.earea}`,
    pollingStation: `หน่วยที่ ${nvpop.eunit}`,
    location: nvpop.desp,
    province,
    district,
    subdistrict,
    hasEarlyVoted: false,
  };
}

/**
 * Main parser - handles both regular and early voting
 */
export function parseElectionResponse(data: any[]): ParsedElectionData {
  if (!data || !data[0]) {
    throw new Error('No data found');
  }

  const response = data[0];
  const hasEarlyVoted = !!response.fulloutvote;

  if (hasEarlyVoted) {
    return parseEarlyVoting(response.fulloutvote);
  } else {
    return parseRegularVoting(response.nvpop);
  }
}
