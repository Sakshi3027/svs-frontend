"use client";
import { useState, useEffect } from "react";
import { getVideos, Video } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#3fb950", "#d29922", "#58a6ff", "#f85149", "#a371f7"];

export default function AnalyticsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideos().then(r => {
      setVideos(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const completed = videos.filter(v => v.status === "completed");
  const totalChunks = videos.reduce((sum, v) => sum + v.total_chunks, 0);
  const avgProcessingTime = completed.length
    ? completed.reduce((sum, v) => sum + (v.processing_time || 0), 0) / completed.length
    : 0;
  const successRate = videos.length
    ? ((completed.length / videos.length) * 100).toFixed(0)
    : 0;

  // Status distribution for pie chart
  const statusData = Object.entries(
    videos.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // Processing time bar chart
  const processingData = completed
    .filter(v => v.processing_time)
    .map(v => ({
      name: v.title ? v.title.slice(0, 20) + "..." : v.id,
      time: Math.round(v.processing_time || 0),
      chunks: v.total_chunks,
    }));

  // Chunks bar chart
  const chunksData = completed.map(v => ({
    name: v.title ? v.title.slice(0, 20) + "..." : v.id,
    audio: v.audio_chunks,
    visual: v.visual_chunks,
  }));

  const stats = [
    { label: "Total Videos", value: videos.length, color: "#58a6ff", icon: "🎬" },
    { label: "Completed", value: completed.length, color: "#3fb950", icon: "✅" },
    { label: "Total Chunks", value: totalChunks, color: "#a371f7", icon: "🧩" },
    { label: "Avg Process Time", value: `${avgProcessingTime.toFixed(0)}s`, color: "#d29922", icon: "⚡" },
    { label: "Success Rate", value: `${successRate}%`, color: "#3fb950", icon: "📈" },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0e1117", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#8b949e", fontSize: "18px" }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0e1117", padding: "40px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "700", color: "#fafafa", marginBottom: "8px" }}>
            📊 Analytics
          </h1>
          <p style={{ color: "#8b949e", fontSize: "16px" }}>
            Overview of your video library performance
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "40px"
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              backgroundColor: "#161b22",
              border: "1px solid #30363d",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{stat.icon}</div>
              <div style={{ fontSize: "32px", fontWeight: "700", color: stat.color, marginBottom: "4px" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "#8b949e" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginBottom: "32px"
        }}>
          {/* Status Pie Chart */}
          <div style={{
            backgroundColor: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h3 style={{ color: "#fafafa", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Video Status Distribution
            </h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name: string, percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {statusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "8px" }}
                    labelStyle={{ color: "#fafafa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>No data yet</div>
            )}
          </div>

          {/* Processing Time Bar Chart */}
          <div style={{
            backgroundColor: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h3 style={{ color: "#fafafa", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
              Processing Time (seconds)
            </h3>
            {processingData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={processingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                  <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "8px" }}
                    labelStyle={{ color: "#fafafa" }}
                  />
                  <Bar dataKey="time" fill="#58a6ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>No completed videos yet</div>
            )}
          </div>
        </div>

        {/* Chunks Bar Chart */}
        <div style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "32px"
        }}>
          <h3 style={{ color: "#fafafa", fontSize: "16px", fontWeight: "600", marginBottom: "24px" }}>
            Chunks per Video
          </h3>
          {chunksData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chunksData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 11 }} />
                <YAxis tick={{ fill: "#8b949e", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "8px" }}
                  labelStyle={{ color: "#fafafa" }}
                />
                <Legend wrapperStyle={{ color: "#8b949e" }} />
                <Bar dataKey="audio" fill="#3fb950" radius={[4, 4, 0, 0]} name="Audio Chunks" />
                <Bar dataKey="visual" fill="#a371f7" radius={[4, 4, 0, 0]} name="Visual Chunks" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#8b949e" }}>No data yet</div>
          )}
        </div>

        {/* Video Table */}
        <div style={{
          backgroundColor: "#161b22",
          border: "1px solid #30363d",
          borderRadius: "12px",
          overflow: "hidden"
        }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #30363d" }}>
            <h3 style={{ color: "#fafafa", fontSize: "16px", fontWeight: "600" }}>
              All Videos
            </h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#0e1117" }}>
                  {["Title", "Status", "Duration", "Chunks", "Process Time", "Created"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      color: "#8b949e",
                      fontSize: "13px",
                      fontWeight: "600",
                      borderBottom: "1px solid #30363d"
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {videos.map((v, i) => (
                  <tr key={v.id} style={{
                    borderBottom: i < videos.length - 1 ? "1px solid #30363d" : "none",
                  }}>
                    <td style={{ padding: "12px 16px", color: "#e6edf3", fontSize: "14px", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {v.title || "Processing..."}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        backgroundColor: v.status === "completed" ? "#1f3a2f" : v.status === "failed" ? "#3a1f1f" : "#3a2f1f",
                        color: v.status === "completed" ? "#3fb950" : v.status === "failed" ? "#f85149" : "#d29922",
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase"
                      }}>
                        {v.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: "14px" }}>
                      {v.duration ? `${Math.floor(v.duration / 60)}m ${Math.floor(v.duration % 60)}s` : "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: "14px" }}>{v.total_chunks}</td>
                    <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: "14px" }}>
                      {v.processing_time ? `${v.processing_time.toFixed(0)}s` : "N/A"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#8b949e", fontSize: "14px" }}>
                      {new Date(v.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}