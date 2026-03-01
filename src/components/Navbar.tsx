"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Library, BarChart3, Settings } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: null },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav style={{
      backgroundColor: "#161b22",
      borderBottom: "1px solid #30363d",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontSize: "20px",
        fontWeight: "bold",
        color: "#58a6ff",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        🔍 VideoSearch AI
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: "8px" }}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: pathname === href ? "#58a6ff" : "#8b949e",
              backgroundColor: pathname === href ? "#1f2937" : "transparent",
              transition: "all 0.2s",
            }}
          >
            {Icon && <Icon size={16} />}
            {label}
          </Link>
        ))}
      </div>

      {/* Status badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        color: "#3fb950"
      }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "#3fb950"
        }} />
        API Live
      </div>
    </nav>
  );
}