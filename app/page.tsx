"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nexify-history");

    if (saved) {
      setClips(JSON.parse(saved));
    }
  }, []);

  const generateClips = async () => {
    if (!url) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (data.error) {
        alert(data.error);
        return;
      }

      const cleanJson = data.result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleanJson);

      setClips(parsed);

      localStorage.setItem(
        "nexify-history",
        JSON.stringify(parsed)
      );
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to generate clips");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Nexify AI
        </h1>

        <p className="text-center text-gray-400 text-xl mb-10">
          Turn Long Videos Into Viral Shorts With AI
        </p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-green-500"
          />

          <button
            onClick={generateClips}
            className="w-full mt-4 p-5 rounded-2xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 transition"
          >
            {loading ? "Generating..." : "Generate Clips"}
          </button>
        </div>

        {loading && (
          <div className="text-center mt-8">
            <p className="text-green-400">
              AI is finding viral moments...
            </p>
          </div>
        )}

        {clips.length > 0 && (
          <div className="flex justify-between items-center mt-8">
            <p className="text-gray-400">
              {clips.length} Viral Clips Generated
            </p>

            <button
              onClick={() => {
                localStorage.removeItem("nexify-history");
                setClips([]);
              }}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600"
            >
              Clear History
            </button>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {clips.map((clip, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  🔥 Clip #{index + 1}
                </h2>

                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                  {clip.score}/100
                </span>
              </div>

              <p className="text-2xl font-semibold mb-3">
                {clip.title}
              </p>

              <p className="text-green-400 font-medium mb-4">
                ⏱ {clip.start} → {clip.end}
              </p>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Title: ${clip.title}
Start: ${clip.start}
End: ${clip.end}
Score: ${clip.score}/100`
                  );

                  alert("Copied!");
                }}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}