import { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
// ─── Illustration SVG ────────────────────────────────────────────────────────
const IllustrationCard = () => (
  <motion.div
    className="relative flex items-center justify-center"
    animate={{ y: [0, -14, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <div
      style={{
        width: 280,
        height: 280,
        borderRadius: "50%",
        background: "#E8424A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 30px 80px rgba(232,66,74,0.4), 0 0 0 8px rgba(232,66,74,0.15)",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Vinyl record */}
      <motion.div
        style={{
          position: "absolute",
          top: -30,
          right: -20,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, #1a1a1a 28%, #2d2d2d 29%, #111 45%, #1a1a1a 46%, #0d0d0d 70%, #1a1a1a 71%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          zIndex: 10,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {/* Center label */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 30, height: 30,
          borderRadius: "50%",
          background: "#f5e6c8",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
        </div>
      </motion.div>

      {/* Hand holding microphone */}
      <svg viewBox="0 0 180 200" width="180" height="200" style={{ position: "relative", zIndex: 5 }}>
        {/* Arm */}
        <path d="M30 200 Q50 160 70 140 L110 130 L130 150 Q110 170 90 200Z" fill="#f7b9a0" />
        {/* Sleeve */}
        <path d="M20 200 Q40 170 55 155 L75 145 L60 165 Q45 185 35 200Z" fill="#1a1a1a" />
        
        {/* Hand */}
        <ellipse cx="105" cy="120" rx="40" ry="35" fill="#f7b9a0" />
        
        {/* Fingers (rock on!) */}
        {/* Index finger */}
        <path d="M85 95 Q82 70 85 55 Q88 48 93 50 Q98 52 97 65 Q96 80 95 95Z" fill="#f7b9a0" stroke="#e8a080" strokeWidth="0.5"/>
        {/* Pinky */}
        <path d="M125 100 Q128 78 130 65 Q132 58 137 60 Q142 62 140 75 Q138 88 135 100Z" fill="#f7b9a0" stroke="#e8a080" strokeWidth="0.5"/>
        {/* Thumb */}
        <path d="M70 130 Q50 128 45 122 Q43 115 50 112 Q58 110 72 118Z" fill="#f7b9a0" stroke="#e8a080" strokeWidth="0.5"/>
        
        {/* Microphone */}
        <rect x="88" y="95" width="28" height="55" rx="14" fill="#5bc8f5" />
        {/* Mic grille lines */}
        <line x1="88" y1="108" x2="116" y2="108" stroke="#3aa8d5" strokeWidth="1.5"/>
        <line x1="88" y1="116" x2="116" y2="116" stroke="#3aa8d5" strokeWidth="1.5"/>
        <line x1="88" y1="124" x2="116" y2="124" stroke="#3aa8d5" strokeWidth="1.5"/>
        <line x1="88" y1="132" x2="116" y2="132" stroke="#3aa8d5" strokeWidth="1.5"/>
        {/* Stars */}
        <text x="75" y="85" fontSize="16" fill="white" fontWeight="bold">✦</text>
        <text x="130" y="105" fontSize="12" fill="#ffd700" fontWeight="bold">✦</text>
        <text x="68" y="110" fontSize="10" fill="white" fontWeight="bold">✦</text>
        <text x="140" y="135" fontSize="18" fill="white" fontWeight="bold">✦</text>
        
        {/* Lightning bolts */}
        <polygon points="55,60 45,85 58,82 48,108 72,78 58,80 68,60" fill="#FFD700" />
        <polygon points="145,55 138,72 147,70 140,90 158,65 147,67 155,55" fill="#FFD700" />
      </svg>

      {/* Sparkle dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 8, height: 8,
            borderRadius: "50%",
            background: ["#fff", "#ffd700", "#ff6b6b", "#fff", "#6edC5f", "#ffd700"][i],
            top: `${[10, 20, 70, 85, 60, 40][i]}%`,
            left: `${[15, 80, 5, 75, 90, 50][i]}%`,
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}
    </div>
  </motion.div>
);

// ─── Navbar ──────────────────────────────────────────────────────────────────
const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    style={{
      position: "absolute", top: 0, left: 0, right: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "20px 32px",
      zIndex: 50,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: "#6EDC5F",
        boxShadow: "0 0 8px #6EDC5F",
        flexShrink: 0,
      }} />
      <span style={{ color: "white", fontSize: 15, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
        Watch Party: Let's Watch Together!
      </span>
    </div>

    <motion.button
      whileHover={{ scale: 1.15, rotate: 30 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400 }}
      style={{
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "rgba(255,255,255,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 6,
        borderRadius: 8,
      }}
      aria-label="Settings"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    </motion.button>
  </motion.nav>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Google font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #000; }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; padding-top: 100px !important; }
          .hero-left { max-width: 100% !important; }
          .cta-row { flex-direction: column !important; align-items: stretch !important; }
          .hero-heading { font-size: 2.4rem !important; }
        }
        @media (max-width: 480px) {
          .hero-heading { font-size: 1.9rem !important; }
        }
      `}</style>

      <Navbar />

      {/* Subtle background glow */}
      <div style={{
        position: "absolute", top: "30%", right: "20%",
        width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(110,220,95,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Hero */}
      <div
        className="hero-grid"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 5% 0 6%",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT */}
        <div
          className="hero-left"
          style={{ maxWidth: 540, flex: "1 1 340px" }}
        >
          <motion.h1
            className="hero-heading"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            style={{
              fontSize: "3.6rem",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              marginBottom: 16,
            }}
          >
            Get a Link<br />
            That you can share
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "0.95rem",
              lineHeight: 1.65,
              maxWidth: 420,
              marginBottom: 36,
            }}
          >
            Tap New Room to get a link that you can share with people you want to listen songs with.
          </motion.p>

          {/* CTA */}
          <motion.div
            className="cta-row"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {/* New Room */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: "0 0 24px rgba(110,220,95,0.5)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400 }}
              style={{
                background: "#6EDC5F",
                color: "#0a2000",
                border: "none",
                borderRadius: 10,
                padding: "14px 26px",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
              aria-label="Create New Room"
            >
              New Room
            </motion.button>

            {/* Input */}
            <motion.div
              animate={{
                boxShadow: focused
                  ? "0 0 0 2px #6EDC5F, 0 0 20px rgba(110,220,95,0.25)"
                  : "0 0 0 1px rgba(255,255,255,0.1)",
              }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: 10, flex: "1 1 140px" }}
            >
              <input
                type="text"
                placeholder="Enter a code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.08)",
                  border: "none",
                  outline: "none",
                  borderRadius: 10,
                  padding: "14px 16px",
                  color: "white",
                  fontSize: "0.93rem",
                  fontFamily: "inherit",
                  "::placeholder": { color: "rgba(255,255,255,0.35)" },
                }}
                aria-label="Enter a room code"
              />
            </motion.div>

            {/* Join */}
            <motion.button
              whileHover={{ scale: 1.06, color: "#6EDC5F" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.85)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "inherit",
                padding: "14px 4px",
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
              }}
              aria-label="Join Room"
            >
              Join
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT — Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
          style={{
            flex: "1 1 280px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 800
            ,
          }}
        >
          <IllustrationCard />
        </motion.div>
      </div>

      {/* Placeholder input caret color fix */}
      <style>{`
        input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}