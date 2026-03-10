"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Footer = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const bg      = dark ? "#050508"                   : "#f4f5f9";
  const border  = dark ? "rgba(34,113,240,0.12)"     : "rgba(34,113,240,0.15)";
  const heading = dark ? "rgba(255,255,255,0.85)"    : "rgba(10,10,20,0.85)";
  const body    = dark ? "rgba(255,255,255,0.35)"    : "rgba(10,10,20,0.45)";
  const copy    = dark ? "rgba(255,255,255,0.18)"    : "rgba(10,10,20,0.3)";
  const linkHover = dark ? "#ffffff"                 : "#0a0a14";

  return (
    <footer
      className="w-full pt-14 pb-8 px-6 md:px-12 transition-colors duration-300"
      style={{ background: bg, borderTop: `1px solid ${border}` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">

          <div className="max-w-xs">
            <span
              className="font-black text-2xl tracking-tight"
              style={{
                fontFamily: "'Syne', system-ui, sans-serif",
                background: "linear-gradient(90deg, #2271f0, #d006d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              TRACO
            </span>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: body }}>
              Track every rupee. Understand your habits. Build real financial freedom.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            {[
              {
                label: "Product",
                links: [
                  { name: "Dashboard", href: "/dashboard" },
                  { name: "Add Transaction", href: "/transaction/create" },
                  { name: "Analytics", href: "#" },
                ],
              },
              {
                label: "Company",
                links: [
                  { name: "About", href: "#" },
                  { name: "Blog", href: "#" },
                  { name: "Careers", href: "#" },
                ],
              },
              {
                label: "Legal",
                links: [
                  { name: "Privacy", href: "#" },
                  { name: "Terms", href: "#" },
                  { name: "Security", href: "#" },
                ],
              },
            ].map((col) => (
              <div key={col.label} className="flex flex-col gap-3">
                <span
                  className="font-mono text-xs tracking-[0.2em] uppercase"
                  style={{ color: "rgba(34,113,240,0.8)" }}
                >
                  {col.label}
                </span>
                {col.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm transition-colors duration-200"
                    style={{ color: body }}
                    onMouseEnter={e => e.currentTarget.style.color = linkHover}
                    onMouseLeave={e => e.currentTarget.style.color = body}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-mono"
          style={{ borderTop: `1px solid ${border}`, color: copy }}
        >
          <span>© {new Date().getFullYear()} Traco. All rights reserved.</span>
          <span>Made with ❤️ for smarter finances</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;