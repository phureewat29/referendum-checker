"use client";

import { useState } from "react";

interface ElectionResult {
  source: string;
  region?: string;
  location?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  pollingStation?: string;
  error?: string;
  rawData?: any;
}

export default function Home() {
  const [thaiId, setThaiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    election?: ElectionResult;
    electionPm?: ElectionResult;
  }>({});
  const [comparison, setComparison] = useState<string>("");

  const validateThaiId = (id: string): boolean => {
    if (id.length !== 13) return false;
    if (!/^\d+$/.test(id)) return false;

    // Thai ID checksum validation
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(id.charAt(i)) * (13 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(id.charAt(12));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateThaiId(thaiId)) {
      alert("เลขบัตรประชาชนไม่ถูกต้อง / Invalid Thai ID");
      return;
    }

    setLoading(true);
    setResults({});
    setComparison("");

    try {
      const [electionRes, electionPmRes] = await Promise.all([
        fetch("/api/election", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thaiId }),
        }),
        fetch("/api/election-pm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ thaiId }),
        }),
      ]);

      const electionData = await electionRes.json();
      const electionPmData = await electionPmRes.json();

      setResults({
        election: electionData,
        electionPm: electionPmData,
      });

      compareResults(electionData, electionPmData);
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด / Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  const compareResults = (result1: ElectionResult, result2: ElectionResult) => {
    if (result1.error || result2.error) {
      setComparison("⚠️ ไม่สามารถเปรียบเทียบได้");
      return;
    }

    const region1 = result1.region || result1.location || result1.district;
    const region2 = result2.region || result2.location || result2.district;

    if (region1 === region2) {
      setComparison("✓ ตรงกัน");
    } else {
      setComparison("✗ ไม่ตรงกัน");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-light text-white mb-2">
            ตรวจสอบเขตเลือกตั้ง
          </h1>
          <p className="text-gray-400 text-sm">Thai Election Checker</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={thaiId}
            onChange={(e) =>
              setThaiId(e.target.value.replace(/\D/g, "").slice(0, 13))
            }
            placeholder="เลขบัตรประชาชน 13 หลัก"
            className="w-full bg-transparent border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-gray-500 text-center text-lg tracking-wider mb-2"
            maxLength={13}
            required
            autoComplete="off"
          />
          <div className="text-center text-gray-600 text-xs mb-4">
            {thaiId.length}/13
          </div>
          <button
            type="submit"
            disabled={loading || thaiId.length !== 13}
            className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "กำลังตรวจสอบ..." : "ตรวจสอบ"}
          </button>
        </form>

        {comparison && (
          <div
            className={`text-center py-3 px-4 rounded-lg mb-6 ${
              comparison.includes("✓")
                ? "bg-green-900/30 border border-green-800 text-green-400"
                : comparison.includes("✗")
                  ? "bg-red-900/30 border border-red-800 text-red-400"
                  : "bg-yellow-900/30 border border-yellow-800 text-yellow-400"
            }`}
          >
            <p className="font-medium">{comparison}</p>
          </div>
        )}

        {(results.election || results.electionPm) && (
          <div className="space-y-4">
            {results.election && (
              <div className="border border-gray-800 rounded-lg p-4">
                <h2 className="text-gray-500 text-xs uppercase mb-3">สส.</h2>
                {results.election.error ? (
                  <p className="text-red-400 text-sm">
                    {results.election.error}
                  </p>
                ) : (
                  <div className="space-y-2 text-white text-sm">
                    {results.election.province && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">จังหวัด:</span>
                        <span>{results.election.province}</span>
                      </div>
                    )}
                    {results.election.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">อำเภอ:</span>
                        <span>{results.election.district}</span>
                      </div>
                    )}
                    {results.election.subdistrict && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ตำบล:</span>
                        <span>{results.election.subdistrict}</span>
                      </div>
                    )}
                    {results.election.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">เขต:</span>
                        <span>{results.election.region}</span>
                      </div>
                    )}
                    {results.election.pollingStation && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">หน่วย:</span>
                        <span>{results.election.pollingStation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {results.electionPm && (
              <div className="border border-gray-800 rounded-lg p-4">
                <h2 className="text-gray-500 text-xs uppercase mb-3">
                  ประชามติ
                </h2>
                {results.electionPm.error ? (
                  <p className="text-red-400 text-sm">
                    {results.electionPm.error}
                  </p>
                ) : (
                  <div className="space-y-2 text-white text-sm">
                    {results.electionPm.province && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">จังหวัด:</span>
                        <span>{results.electionPm.province}</span>
                      </div>
                    )}
                    {results.electionPm.district && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">อำเภอ:</span>
                        <span>{results.electionPm.district}</span>
                      </div>
                    )}
                    {results.electionPm.subdistrict && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">ตำบล:</span>
                        <span>{results.electionPm.subdistrict}</span>
                      </div>
                    )}
                    {results.electionPm.region && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">เขต:</span>
                        <span>{results.electionPm.region}</span>
                      </div>
                    )}
                    {results.electionPm.pollingStation && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">หน่วย:</span>
                        <span>{results.electionPm.pollingStation}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
