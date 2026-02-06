interface ResultCardProps {
  title: string;
  result: {
    error?: string;
    location?: string;
    province?: string;
    district?: string;
    subdistrict?: string;
    region?: string;
    pollingStation?: string;
  };
}

export function ResultCard({ title, result }: ResultCardProps) {
  if (result.error) {
    return (
      <div className="border border-gray-800 rounded-lg p-4">
        <h2 className="text-gray-500 text-lg uppercase mb-3">{title}</h2>
        <p className="text-red-400 text-sm">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-800 rounded-lg p-4">
      <h2 className="text-gray-500 text-lg uppercase mb-3">{title}</h2>
      <div className="space-y-2 text-white text-sm">
        {result.location && (
          <div className="mb-3 pb-3 border-b border-gray-700">
            <div className="text-gray-500 text-xs mb-1">สถานที่เลือกตั้ง:</div>
            <div className="text-white text-sm">{result.location}</div>
          </div>
        )}
        {result.province && (
          <InfoRow label="จังหวัด" value={result.province} />
        )}
        {result.district && (
          <InfoRow label="อำเภอ" value={result.district} />
        )}
        {result.subdistrict && (
          <InfoRow label="ตำบล" value={result.subdistrict} />
        )}
        {result.region && (
          <InfoRow label="เขต" value={result.region} />
        )}
        {result.pollingStation && (
          <InfoRow label="หน่วย" value={result.pollingStation} />
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
