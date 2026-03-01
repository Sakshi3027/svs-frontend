"use client";
import { useState, useEffect } from "react";
import { Search, Brain, ExternalLink, Clock } from "lucide-react";
import { search, smartSearch, getVideos, SearchResult, Video } from "@/lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState("all");
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isSmartSearch, setIsSmartSearch] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState("");
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getVideos().then(r => setVideos(r.data.filter(v => v.status === "completed")));
  }, []);

  const handleSearch = async (smart: boolean) => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);
    setExpandedQuery("");
    setIsSmartSearch(smart);

    try {
      const videoId = selectedVideo === "all" ? undefined : selectedVideo;
      const fn = smart ? smartSearch : search;
      const res = await fn(query, videoId, topK);
      setResults(res.data.results);
      setLatency(res.data.latency_ms);
      if (smart && (res.data as any).expanded_query) {
        setExpandedQuery((res.data as any).expanded_query);
      }
    } catch (e) {
      setError("Search failed. Make sure the API is running.");
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "What causes procrastination?",
    "How does the panic monster work?",
    "What happens without deadlines?",
    "Life advice and taking action",
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0e1117", padding: "40px 24px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fafafa", marginBottom: "8px" }}>
            🔍 Search Videos
          </h1>
          <p style={{ color: "#8b949e", fontSize: "16px" }}>
            Search across your video library using natural language
          </p>
        </div>

        {/* Search Input */}
        <div style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px"
        }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch(false)}
              placeholder='e.g. "why do people avoid hard tasks"'
              style={{
                flex: 1,
                backgroundColor: "#0e1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#fafafa",
                fontSize: "16px",
                outline: "none",
              }}
            />
            <select
              value={topK}
              onChange={e => setTopK(Number(e.target.value))}
              style={{
                backgroundColor: "#0e1117",
                border: "1px solid #30363d",
                borderRadius: "8px",
                padding: "12px 16px",
                color: "#fafafa",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              {[3, 5, 10].map(n => <option key={n} value={n}>Top {n}</option>)}
            </select>
          </div>

          {/* Video Filter */}
          <select
            value={selectedVideo}
            onChange={e => setSelectedVideo(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "#0e1117",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#fafafa",
              fontSize: "14px",
              marginBottom: "16px",
              cursor: "pointer",
            }}
          >
            <option value="all">All Videos</option>
            {videos.map(v => (
              <option key={v.id} value={v.id}>
                {v.title || v.id}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => handleSearch(false)}
              disabled={loading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#1f6feb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Search size={18} />
              {loading && !isSmartSearch ? "Searching..." : "Search"}
            </button>
            <button
              onClick={() => handleSearch(true)}
              disabled={loading}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                backgroundColor: "#6e40c9",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Brain size={18} />
              {loading && isSmartSearch ? "Thinking..." : "🧠 Smart Search"}
            </button>
          </div>
        </div>

        {/* Example queries */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ color: "#8b949e", fontSize: "13px", marginBottom: "10px" }}>
            💡 Try these examples:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {examples.map(ex => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                style={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #30363d",
                  borderRadius: "20px",
                  padding: "6px 14px",
                  color: "#8b949e",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: "#3d1f1f",
            border: "1px solid #f85149",
            borderRadius: "8px",
            padding: "12px 16px",
            color: "#f85149",
            marginBottom: "24px"
          }}>
            {error}
          </div>
        )}

        {/* Results header */}
        {results.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ color: "#fafafa", fontSize: "20px", fontWeight: "600" }}>
                Found {results.length} results
                {latency && (
                  <span style={{ color: "#8b949e", fontSize: "14px", fontWeight: "400", marginLeft: "8px" }}>
                    in {latency.toFixed(0)}ms
                  </span>
                )}
              </h2>
              {isSmartSearch && (
                <span style={{
                  backgroundColor: "#2d1f6e",
                  border: "1px solid #6e40c9",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "12px",
                  color: "#a371f7"
                }}>
                  🧠 AI Enhanced
                </span>
              )}
            </div>
            {expandedQuery && (
              <p style={{ color: "#8b949e", fontSize: "13px", marginTop: "4px" }}>
                Expanded: {expandedQuery}
              </p>
            )}
          </div>
        )}

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {results.map((result, i) => (
            <div key={i} style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "12px",
              padding: "20px",
              borderLeft: "3px solid #1f6feb",
            }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{
                  backgroundColor: "#1f3a5f",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "#58a6ff",
                  fontWeight: "600"
                }}>
                  ⚡ {(result.score * 100).toFixed(0)}% match
                </span>
                <span style={{
                  backgroundColor: "#1f3a2f",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "#3fb950"
                }}>
                  ⏱ {result.timestamp_formatted}
                </span>
                <span style={{
                  backgroundColor: "#2d1f3a",
                  borderRadius: "20px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "#a371f7"
                }}>
                  {result.type === "audio" ? "🎙 Audio" : "👁 Visual"}
                </span>
                <span style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  color: "#8b949e"
                }}>
                  Video: {result.video_id}
                </span>
              </div>

              {/* Text */}
              <p style={{
                color: "#e6edf3",
                fontSize: "15px",
                lineHeight: "1.6",
                marginBottom: "16px"
              }}>
                {result.text}
              </p>

              {/* YouTube Link */}
              {result.youtube_url ? (
                <a
                  href={result.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#58a6ff",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  <ExternalLink size={14} />
                  Jump to {result.timestamp_formatted} on YouTube
                </a>
              ) : null}
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#8b949e" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <p>{isSmartSearch ? "AI is thinking..." : "Searching..."}</p>
          </div>
        )}

      </div>
    </div>
  );
}