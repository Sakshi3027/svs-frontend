"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Clock, Layers } from "lucide-react";
import { getVideos, submitVideo, deleteVideo, Video } from "@/lib/api";

const statusColor: Record<string, string> = {
  completed: "#3fb950",
  pending: "#d29922",
  downloading: "#58a6ff",
  transcribing: "#a371f7",
  failed: "#f85149",
};

const statusBg: Record<string, string> = {
  completed: "#1f3a2f",
  pending: "#3a2f1f",
  downloading: "#1f2d3a",
  transcribing: "#2d1f3a",
  failed: "#3a1f1f",
};

export default function LibraryPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await getVideos();
      setVideos(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setSubmitting(true);
    setMessage("");
    try {
      await submitVideo(url);
      setUrl("");
      setShowForm(false);
      setMessage("✅ Video submitted! Processing will begin shortly.");
      fetchVideos();
    } catch (e) {
      setMessage("❌ Failed to submit video. Check the URL and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title || id}"?`)) return;
    try {
      await deleteVideo(id);
      setVideos(prev => prev.filter(v => v.id !== id));
    } catch (e) {
      alert("Failed to delete video.");
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0e1117", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px"
        }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fafafa", marginBottom: "8px" }}>
              📚 Video Library
            </h1>
            <p style={{ color: "#8b949e", fontSize: "16px" }}>
              {videos.length} videos indexed
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#1f6feb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <Plus size={18} />
            Add Video
          </button>
        </div>

        {/* Add Video Form */}
        {showForm && (
          <div style={{
            backgroundColor: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h3 style={{ color: "#fafafa", fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              Add New Video
            </h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{
                  flex: 1,
                  backgroundColor: "#0e1117",
                  border: "1px solid #30363d",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#fafafa",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  backgroundColor: "#1f6feb",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Submitting..." : "🚀 Process"}
              </button>
            </div>
            <p style={{ color: "#8b949e", fontSize: "13px", marginTop: "8px" }}>
              Supports any YouTube URL. Processing takes 1-2 minutes per video.
            </p>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            backgroundColor: message.startsWith("✅") ? "#1f3a2f" : "#3a1f1f",
            border: `1px solid ${message.startsWith("✅") ? "#3fb950" : "#f85149"}`,
            borderRadius: "8px",
            padding: "12px 16px",
            color: message.startsWith("✅") ? "#3fb950" : "#f85149",
            marginBottom: "24px",
            fontSize: "14px"
          }}>
            {message}
          </div>
        )}

        {/* Refresh button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <button
            onClick={fetchVideos}
            style={{
              backgroundColor: "transparent",
              border: "1px solid #30363d",
              borderRadius: "8px",
              padding: "8px 16px",
              color: "#8b949e",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* Videos Grid */}
        {loading && videos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#8b949e" }}>
            Loading...
          </div>
        ) : videos.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px",
            color: "#8b949e",
            backgroundColor: "#161b22",
            borderRadius: "12px",
            border: "1px solid #30363d"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>No videos yet</p>
            <p style={{ fontSize: "14px" }}>Add a YouTube URL above to get started</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {videos.map(video => (
              <div key={video.id} style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
              }}>
                {/* Thumbnail */}
                {video.thumbnail_url ? (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title || "Video"}
                    style={{
                      width: "140px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div style={{
                    width: "140px",
                    height: "80px",
                    backgroundColor: "#0e1117",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#8b949e",
                    flexShrink: 0,
                  }}>
                    🎬
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{
                      color: "#fafafa",
                      fontSize: "16px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "500px"
                    }}>
                      {video.title || "Processing..."}
                    </h3>
                    <span style={{
                      backgroundColor: statusBg[video.status] || "#1f2937",
                      color: statusColor[video.status] || "#8b949e",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      flexShrink: 0,
                      marginLeft: "12px",
                      textTransform: "uppercase"
                    }}>
                      {video.status}
                    </span>
                  </div>

                  <p style={{ color: "#8b949e", fontSize: "13px", marginBottom: "12px" }}>
                    ID: <code style={{ color: "#58a6ff" }}>{video.id}</code>
                    {video.duration && ` · Duration: ${formatDuration(video.duration)}`}
                  </p>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    {video.status === "completed" && (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8b949e", fontSize: "13px" }}>
                          <Layers size={14} />
                          {video.total_chunks} chunks
                        </div>
                        {video.processing_time && (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#8b949e", fontSize: "13px" }}>
                            <Clock size={14} />
                            {video.processing_time.toFixed(0)}s processing
                          </div>
                        )}
                      </>
                    )}
                    {video.error_message && (
                      <p style={{ color: "#f85149", fontSize: "13px" }}>
                        Error: {video.error_message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(video.id, video.title || "")}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                    padding: "8px",
                    color: "#f85149",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}