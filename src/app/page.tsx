"use client";
import Link from "next/link";
import { Search, Zap, Clock, Youtube, Brain, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Natural Language Search",
    description: "Search video content using plain English. Ask anything and find the exact moment instantly.",
    color: "#58a6ff"
  },
  {
    icon: Brain,
    title: "AI-Enhanced Smart Search",
    description: "Query expansion and cross-encoder re-ranking for dramatically better search results.",
    color: "#a371f7"
  },
  {
    icon: Clock,
    title: "Exact Timestamps",
    description: "Every result links directly to the exact moment in the YouTube video. No scrubbing required.",
    color: "#3fb950"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-600ms search latency on warm queries. Process a 14-minute video in under 95 seconds.",
    color: "#d29922"
  },
  {
    icon: Youtube,
    title: "YouTube Deep Links",
    description: "Click any result to jump directly to that timestamp on YouTube. Works on any device.",
    color: "#f85149"
  },
  {
    icon: BarChart3,
    title: "Auto-Chapter Generation",
    description: "AI automatically identifies topic sections and generates chapters for any video.",
    color: "#58a6ff"
  },
];

const stats = [
  { value: "95s", label: "To process 14-min video" },
  { value: "600ms", label: "Search latency (warm)" },
  { value: "384", label: "Embedding dimensions" },
  { value: "∞", label: "Videos supported" },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0e1117" }}>

      {/* Hero Section */}
      <section style={{
        padding: "100px 24px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#1f2937",
          border: "1px solid #30363d",
          borderRadius: "20px",
          padding: "6px 16px",
          fontSize: "13px",
          color: "#58a6ff",
          marginBottom: "32px"
        }}>
          🔍 Semantic Video Search Engine
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: "800",
          lineHeight: "1.1",
          marginBottom: "24px",
          background: "linear-gradient(135deg, #ffffff 0%, #58a6ff 50%, #a371f7 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Search Videos with Natural Language
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "20px",
          color: "#8b949e",
          lineHeight: "1.6",
          marginBottom: "48px",
          maxWidth: "600px",
          margin: "0 auto 48px",
        }}>
          Find exact moments in any YouTube video using plain English.
          Powered by Whisper, vector embeddings, and AI re-ranking.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/search" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#1f6feb",
            color: "white",
            padding: "14px 32px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            transition: "background 0.2s",
          }}>
            <Search size={18} />
            Try Search
          </Link>
          <Link href="/library" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "transparent",
            color: "#fafafa",
            padding: "14px 32px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            border: "1px solid #30363d",
          }}>
            Add a Video
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "60px 24px",
        borderTop: "1px solid #30363d",
        borderBottom: "1px solid #30363d",
        backgroundColor: "#161b22",
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          textAlign: "center",
        }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{
                fontSize: "48px",
                fontWeight: "800",
                color: "#58a6ff",
                marginBottom: "8px"
              }}>
                {stat.value}
              </div>
              <div style={{ fontSize: "14px", color: "#8b949e" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: "100px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: "40px",
            fontWeight: "700",
            textAlign: "center",
            marginBottom: "16px",
            color: "#fafafa"
          }}>
            Everything you need
          </h2>
          <p style={{
            textAlign: "center",
            color: "#8b949e",
            fontSize: "18px",
            marginBottom: "64px"
          }}>
            Built with production-grade ML infrastructure
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {features.map((feature) => (
              <div key={feature.title} style={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "12px",
                padding: "28px",
                transition: "border-color 0.2s",
              }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: `${feature.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  <feature.icon size={22} color={feature.color} />
                </div>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#fafafa",
                  marginBottom: "8px"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: "14px",
                  color: "#8b949e",
                  lineHeight: "1.6"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section style={{
        padding: "80px 24px",
        backgroundColor: "#161b22",
        borderTop: "1px solid #30363d"
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "48px",
            color: "#fafafa"
          }}>
            Built with production tech
          </h2>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center"
          }}>
            {[
              "faster-whisper", "sentence-transformers", "Pinecone",
              "FastAPI", "Celery", "Redis", "PostgreSQL",
              "Docker", "GCP", "Next.js", "Python"
            ].map((tech) => (
              <span key={tech} style={{
                backgroundColor: "#1f2937",
                border: "1px solid #30363d",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "14px",
                color: "#58a6ff",
                fontWeight: "500"
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 24px", textAlign: "center" }}>
        <h2 style={{
          fontSize: "40px",
          fontWeight: "700",
          marginBottom: "16px",
          color: "#fafafa"
        }}>
          Ready to search smarter?
        </h2>
        <p style={{
          color: "#8b949e",
          fontSize: "18px",
          marginBottom: "40px"
        }}>
          Add any YouTube video and start searching in minutes.
        </p>
        <Link href="/search" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#1f6feb",
          color: "white",
          padding: "16px 40px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
          fontSize: "18px",
        }}>
          <Search size={20} />
          Get Started Free
        </Link>
      </section>

    </div>
  );
}