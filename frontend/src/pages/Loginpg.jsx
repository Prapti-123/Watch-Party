import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav'
// ─── Google Icon SVG ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);



// ─── Primary Button ───────────────────────────────────────────────────────────
const PrimaryButton = ({ children, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03, filter: "brightness(1.12)" }}
    whileTap={{ scale: 0.97 }}
    transition={{ type: "spring", stiffness: 400, damping: 20 }}
    style={{
      width: "100%",
      background: "#6EDC5F",
      color: "#0a2200",
      border: "none",
      borderRadius: 14,
      padding: "15px 0",
      fontSize: "1rem",
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "inherit",
      letterSpacing: "0.01em",
    }}
    aria-label={children}
  >
    {children}
  </motion.button>
);

// ─── Google Button ────────────────────────────────────────────────────────────
const GoogleButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      animate={{
        boxShadow: hovered
          ? "0 0 0 1.5px rgba(255,255,255,0.35), 0 0 18px rgba(255,255,255,0.08)"
          : "0 0 0 1.5px rgba(255,255,255,0.18)",
      }}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        color: "white",
        border: "1.5px solid rgba(255,255,255,0.18)",
        borderRadius: 14,
        padding: "14px 0",
        fontSize: "1rem",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        letterSpacing: "0.01em",
      }}
      aria-label="Continue with Google"
    >
      <GoogleIcon />
      Continue with Google
    </motion.button>
  );
};

// ─── Auth Card ────────────────────────────────────────────────────────────────
const AuthCard = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, y: 24 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.1 }}
    style={{
      background: "rgba(10,10,10,0.97)",
      borderRadius: 24,
      padding: "44px 40px 36px",
      width: "100%",
      maxWidth: 440,
      boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}
  >
    {/* Heading */}
    <motion.h1
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      style={{
        color: "white",
        fontSize: "2.1rem",
        fontWeight: 800,
        textAlign: "center",
        marginBottom: 8,
        letterSpacing: "-0.02em",
        fontFamily: "inherit",
      }}
    >
      Hey There!
    </motion.h1>

    {/* Subtext */}
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32, duration: 0.5 }}
      style={{
        color: "rgba(255,255,255,0.45)",
        fontSize: "0.92rem",
        textAlign: "center",
        marginBottom: 32,
        letterSpacing: "0.02em",
        fontFamily: "inherit",
      }}
    >
      Glad to see you. Let's get started
    </motion.p>

    {/* Buttons */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <PrimaryButton>Sign up for free</PrimaryButton>
      <GoogleButton />
    </motion.div>

    {/* Sign in link */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.52, duration: 0.5 }}
      style={{ textAlign: "center", marginTop: 22 }}
    >
      <motion.button
        whileHover={{ opacity: 0.75 }}
        transition={{ duration: 0.15 }}
        style={{
          background: "transparent",
          border: "none",
          color: "white",
          fontSize: "0.97rem",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          textDecoration: "none",
          letterSpacing: "0.01em",
        }}
        aria-label="Sign in"
      >
        Sign in
      </motion.button>
    </motion.div>

    {/* Divider */}
    <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "24px 0 20px" }} />

    {/* Footer */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      style={{
        textAlign: "center",
        color: "rgba(255,255,255,0.35)",
        fontSize: "0.78rem",
        lineHeight: 1.7,
        fontFamily: "inherit",
      }}
    >
      <span>By continuing, you agree to Watch Party's </span>
      <motion.span
        whileHover={{ color: "rgba(255,255,255,0.85)" }}
        style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600, cursor: "pointer" }}
      >
        Terms of Use
      </motion.span>
      <span>.</span>
      <br />
      <span>Read our </span>
      <motion.span
        whileHover={{ color: "rgba(255,255,255,0.85)" }}
        style={{ color: "rgba(255,255,255,0.65)", fontWeight: 600, cursor: "pointer" }}
      >
        Privacy Policy
      </motion.span>
    </motion.div>
  </motion.div>
);

// ─── App Store Badges ─────────────────────────────────────────────────────────
const StoreBadges = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.5 }}
    style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      display: "flex",
      gap: 10,
      zIndex: 10,
    }}
  >
    {/* Google Play */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 8,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "white" }}>
        <path d="M3.18 23.76c.37.21.8.22 1.2.04l12.55-7.25-2.88-2.88L3.18 23.76zm-1.12-20.5C2.03 3.48 2 3.73 2 4v16c0 .27.03.52.06.74l10.69-10.69L2.06 3.26zM20.82 10.5l-2.78-1.6-3.13 3.13 3.13 3.13 2.81-1.62c.8-.46.8-1.58-.03-2.04zM4.38.2C3.98.02 3.55.03 3.18.24l10.87 10.87 2.88-2.88L4.38.2z"/>
      </svg>
      <div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.55rem", fontFamily: "inherit" }}>ANDROID APP ON</div>
        <div style={{ color: "white", fontSize: "0.75rem", fontWeight: 700, fontFamily: "inherit" }}>Google play</div>
      </div>
    </motion.div>

    {/* App Store */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      style={{
        background: "rgba(0,0,0,0.85)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 8,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.55rem", fontFamily: "inherit" }}>Download on the</div>
        <div style={{ color: "white", fontSize: "0.75rem", fontWeight: 700, fontFamily: "inherit" }}>App Store</div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function GroicLogin() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      background: "#000",
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #000; }

        @media (max-width: 500px) {
          .auth-card-inner { padding: 32px 22px 28px !important; }
          .auth-heading { font-size: 1.7rem !important; }
        }
      `}</style>

      <AuthCard />

      {/* Store badges */}
      <StoreBadges />
    </div>
  );
}