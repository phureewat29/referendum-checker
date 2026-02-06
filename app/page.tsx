"use client";

import { useState } from "react";
import { validateThaiId } from "@/lib/thai-id-validator";
import { ResultCard } from "@/components/ResultCard";
import { StatusBanner } from "@/components/StatusBanner";

interface ElectionResult {
  source: string;
  region?: string;
  location?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  pollingStation?: string;
  hasEarlyVoted?: boolean;
  earlyVoteInfo?: any;
  error?: string;
  rawData?: any;
}

interface Results {
  election?: ElectionResult;
  electionPm?: ElectionResult;
}

export default function Home() {
  const [thaiId, setThaiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>({});
  const [comparison, setComparison] = useState<string>("");

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

  const hasEarlyVoted =
    results.election?.hasEarlyVoted || results.electionPm?.hasEarlyVoted;

  const getComparisonType = () => {
    if (comparison.includes("✓")) return "match";
    if (comparison.includes("✗")) return "mismatch";
    return "warning";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-2xl font-light text-white mb-2">
            ตรวจสอบเขตเลือกตั้งและประชามติ
          </h1>
        </header>

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

        {hasEarlyVoted ? (
          <StatusBanner
            type="early-vote"
            message="คุณลงทะเบียนเลือกตั้งล่วงหน้า"
          />
        ) : (
          comparison && (
            <StatusBanner type={getComparisonType()} message={comparison} />
          )
        )}

        {(results.election || results.electionPm) && (
          <div className="space-y-4">
            {results.election && (
              <ResultCard title="สส." result={results.election} />
            )}
            {results.electionPm && (
              <ResultCard title="ประชามติ" result={results.electionPm} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
