"use client";

import React, { useRef } from "react";

const cards = [
  {
    title: "Budgeting",
    description: "Create and manage budgets to keep your spending on track every month.",
    video: "money-bag.mp4",
    accent: "#2271f0",
  },
  {
    title: "Expense Tracking",
    description: "Monitor expenses in real-time with automatic detailed categorization.",
    video: "line-chart.mp4",
    accent: "#d006d4",
  },
  {
    title: "Email Notifications",
    description: "Receive timely alerts for budget limits, due dates, and account activity.",
    video: "message.mp4",
    accent: "#2271f0",
  },
  {
    title: "Effortless Access",
    description: "Your financial data available anytime, on any device, instantly.",
    video: "click.mp4",
    accent: "#d006d4",
  },
  {
    title: "AI-Powered Insights",
    description: "Leverage AI to surface personalized financial insights and recommendations.",
    video: "artificial-intelligence.mp4",
    accent: "#2271f0",
  },
  {
    title: "Save More",
    description: "Identify saving opportunities automatically and reach your goals faster.",
    video: "save-money.mp4",
    accent: "#d006d4",
  },
];

function Card({ card, index }) {
  const videoRef = useRef(null);

  return (
    <div
      className="group relative rounded-2xl p-7 flex flex-col gap-5 cursor-default transition-all duration-300 overflow-hidden"
      style={{
        border: "1px solid rgba(34,113,240,0.12)",
        background: "rgba(255,255,255,0.02)",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${card.accent}55`;
        e.currentTarget.style.background = `${card.accent}08`;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 16px 48px ${card.accent}15`;
        videoRef.current?.play();
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(34,113,240,0.12)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        videoRef.current?.pause();
      }}
    >
      
      <div
        className="absolute top-4 right-5 font-mono font-black select-none pointer-events-none transition-colors duration-300"
        style={{ fontSize: 56, lineHeight: 1, color: "rgba(34,113,240,0.05)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
        style={{
          border: `1px solid ${card.accent}30`,
          background: `${card.accent}10`,
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain rounded-xl"
          loop
          muted
          playsInline
          preload="auto"
          src={card.video}
        />
      </div>

      <div className="relative z-10">
        <h3
          className="font-bold text-base mb-2 text-white tracking-tight"
          style={{ fontFamily: "'Syne', system-ui" }}
        >
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
          {card.description}
        </p>
      </div>

      
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)` }}
      />
    </div>
  );
}

const Cards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card key={index} card={card} index={index} />
      ))}
    </div>
  );
};

export default Cards;