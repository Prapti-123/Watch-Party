import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from '../components/Nav'
/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const Icon = {
  Share: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  Leave: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Prev: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
    </svg>
  ),
  Next: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
    </svg>
  ),
  Play: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  ),
  Pause: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  ),
  Heart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Playlist: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  MusicNote: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════ */
const Navbar = () => (
  <motion.header
    initial={{ opacity: 0, y: -24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, ease: "easeOut" }}
    style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 68,
      background: "rgba(30,28,20,0.55)", backdropFilter: "blur(18px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "relative", zIndex: 20, flexShrink: 0,
    }}
  >
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%", background: "#6EDC5F",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 14px rgba(110,220,95,0.55)",
      }}>
        <Icon.MusicNote />
      </div>
      <span style={{ color: "white", fontWeight: 700, fontSize: 18, fontFamily: "'DM Sans',sans-serif", letterSpacing: "-0.02em" }}>
        Groic
      </span>
    </div>

    {/* Room info */}
    <div style={{ textAlign: "center" }}>
      <div style={{ color: "white", fontWeight: 700, fontSize: 17, letterSpacing: "0.04em", fontFamily: "'DM Sans',sans-serif" }}>
        o04qvb
      </div>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, marginTop: 2 }}>
        1 member listening
      </div>
    </div>

    {/* Actions */}
    <div style={{ display: "flex", gap: 10 }}>
      {[
        { label: "Share", icon: <Icon.Share />, primary: false },
        { label: "Leave", icon: <Icon.Leave />, primary: false },
      ].map(({ label, icon }) => (
        <motion.button
          key={label}
          whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.12)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 20, padding: "8px 16px",
            color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {icon} {label}
        </motion.button>
      ))}
    </div>
  </motion.header>
);

/* ═══════════════════════════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════════════════════════ */
const ProgressBar = ({ progress = 0.01 }) => {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>0:00</span>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>-64:18</span>
      </div>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          width: "100%", height: hover ? 5 : 3,
          background: "rgba(255,255,255,0.18)",
          borderRadius: 99, cursor: "pointer",
          transition: "height 0.15s ease", position: "relative",
        }}
      >
        <div style={{
          width: `${progress * 100}%`, height: "100%",
          background: "#fff", borderRadius: 99, position: "relative",
        }}>
          <div style={{
            position: "absolute", right: -5, top: "50%",
            transform: "translateY(-50%)",
            width: hover ? 12 : 0, height: hover ? 12 : 0,
            background: "white", borderRadius: "50%",
            transition: "all 0.15s ease",
          }} />
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   PLAYBACK CONTROLS
═══════════════════════════════════════════════════════════════ */
const PlaybackControls = ({ playing, onToggle }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex" }}
    >
      <Icon.Prev />
    </motion.button>

    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
      animate={playing ? {} : { boxShadow: ["0 0 0px rgba(255,255,255,0.3)", "0 0 18px rgba(255,255,255,0.15)", "0 0 0px rgba(255,255,255,0.3)"] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "white", border: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#1a1a1a",
        boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
      }}
    >
      {playing ? <Icon.Pause /> : <Icon.Play />}
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex" }}
    >
      <Icon.Next />
    </motion.button>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR ICONS
═══════════════════════════════════════════════════════════════ */
const SidebarMenu = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 28, paddingTop: 16,
  }}>
    {[
      { icon: <Icon.Heart />, label: "Liked Songs" },
      { icon: <Icon.Playlist />, label: "Playlists" },
    ].map(({ icon, label }) => (
      <motion.button
        key={label}
        whileHover={{ scale: 1.1, color: "#6EDC5F" }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: "none", border: "none",
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 6,
          cursor: "pointer", color: "rgba(255,255,255,0.65)",
        }}
      >
        {icon}
        <span style={{ fontSize: 10, fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.02em" }}>
          {label}
        </span>
      </motion.button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   PLAYER SECTION (LEFT)
═══════════════════════════════════════════════════════════════ */
const PlayerSection = () => {
  const [playing, setPlaying] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.15 }}
      style={{
        display: "flex", flex: "0 0 auto",
        width: "min(500px, 70%)",
        flexDirection: "column", gap: 0,
        padding: "24px 24px 24px 24px",
      }}
    >
      {/* Video card */}
      <div style={{
        borderRadius: 16, overflow: "hidden",
        background: "#111",
        boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
        aspectRatio: "8/10", width: "100%",
        position: "relative",
      }}>
        {/* Mock YouTube player */}
        <div style={{
          width: "100%", height: "100%",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
          display: "flex", alignItems: "flex-start",
          flexDirection: "column",
        }}>
          {/* YouTube-style top bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 14px", width: "100%",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#888,#444)" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                [playlist] you are sharing earphon...
              </span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18 }}>⋮</div>
          </div>

          {/* Video area */}
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />
          </div>

          {/* YouTube-style controls bar */}
          <div style={{
            padding: "6px 12px 8px",
            width: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
          }}>
            {/* Progress bar */}
            <div style={{ width: "100%", height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 99, marginBottom: 8, position: "relative" }}>
              <div style={{ width: "1%", height: "100%", background: "#f00", borderRadius: 99 }} />
              <div style={{
                position: "absolute", left: "1%", top: "50%", transform: "translateY(-50%)",
                width: 11, height: 11, borderRadius: "50%", background: "#f00",
              }} />
            </div>
            {/* Controls row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>⏸</button>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 16 }}>🔊</button>
              <span style={{ color: "white", fontSize: 11, fontFamily: "monospace" }}>0:00 / 1:04:17</span>
              <div style={{ flex: 1 }} />
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>CC</button>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 13 }}>⚙</button>
              <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>YouTube</span>
              <button style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 14 }}>⛶</button>
            </div>
          </div>
        </div>
      </div>

      
      
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════════════════ */
const TABS = ["Search", "Chat", "Up Next"];

const TabsBar = ({ active, setActive }) => (
  <div style={{
    display: "flex", borderBottom: "1px solid rgba(255,255,255,0.1)",
    marginBottom: 0,
  }}>
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => setActive(tab)}
        style={{
          flex: 1, background: "none", border: "none",
          color: active === tab ? "white" : "rgba(255,255,255,0.4)",
          fontWeight: active === tab ? 700 : 400,
          fontSize: 14, fontFamily: "'DM Sans',sans-serif",
          padding: "14px 0", cursor: "pointer",
          position: "relative", transition: "color 0.2s",
        }}
      >
        {tab}
        {active === tab && (
          <motion.div
            layoutId="tab-underline"
            style={{
              position: "absolute", bottom: 0, left: "15%", right: "15%",
              height: 2, background: "white", borderRadius: 99,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </button>
    ))}
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   CHAT MESSAGE
═══════════════════════════════════════════════════════════════ */
const ChatMessage = ({ username }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0" }}
  >
    <div style={{
      background: "rgba(255,255,255,0.1)",
      borderRadius: 20, padding: "8px 16px",
      color: "rgba(255,255,255,0.85)", fontSize: 14,
      fontFamily: "'DM Sans',sans-serif",
      maxWidth: "85%",
    }}>
      {username}
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   CHAT INPUT
═══════════════════════════════════════════════════════════════ */
const ChatInput = () => {
  const [msg, setMsg] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center",
      background: "rgba(255,255,255,0.07)",
      border: `1px solid ${focused ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: 99, padding: "10px 14px 10px 20px",
      gap: 10, transition: "border-color 0.2s",
      boxShadow: focused ? "0 0 0 3px rgba(110,220,95,0.12)" : "none",
    }}>
      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Type a message..."
        style={{
          flex: 1, background: "none", border: "none", outline: "none",
          color: "rgba(255,255,255,0.85)", fontSize: 14,
          fontFamily: "'DM Sans',sans-serif",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.12, color: "#6EDC5F" }}
        whileTap={{ scale: 0.9 }}
        style={{
          background: "none", border: "none",
          color: "rgba(255,255,255,0.5)", cursor: "pointer",
          display: "flex", padding: 4,
        }}
      >
        <Icon.Send />
      </motion.button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CHAT PANEL (RIGHT)
═══════════════════════════════════════════════════════════════ */
const ChatPanel = () => {
  const [activeTab, setActiveTab] = useState("Chat");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut", delay: 0.25 }}
      style={{
        flex: "1 1 0",
        margin: "24px 24px 24px 0",
        background: "rgba(20,20,14,0.65)",
        backdropFilter: "blur(24px)",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.1)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Tabs */}
      <TabsBar active={activeTab} setActive={setActiveTab} />

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <AnimatePresence mode="wait">
          {activeTab === "Chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 20px 0" }}
            >
              {/* Messages area */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                <ChatMessage username="praptitiwari" />
              </div>
            </motion.div>
          )}

          {activeTab === "Search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
                Search for songs...
              </p>
            </motion.div>
          )}

          {activeTab === "Up Next" && (
            <motion.div
              key="upnext"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>
                Queue is empty
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input always at bottom */}
      <div style={{ padding: "16px 20px 20px" }}>
        <ChatInput />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════════════════════════ */
const Background = () => (
  <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
    {/* Base dark earthy tone */}
    <div style={{ position: "absolute", inset: 0, background: "#2a2516" }} />
    {/* Green-yellow radial glow top-left */}
    <div style={{
      position: "absolute", top: "-10%", left: "5%",
      width: "60%", height: "70%", borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(90,100,30,0.55) 0%, transparent 70%)",
    }} />
    {/* Warm orange glow bottom */}
    <div style={{
      position: "absolute", bottom: "-10%", right: "10%",
      width: "50%", height: "60%", borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(80,60,20,0.45) 0%, transparent 70%)",
    }} />
    {/* Dark vignette edges */}
    <div style={{
      position: "absolute", inset: 0,
      background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
    }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function GroicRoom() {
  return (
    <div style={{
      width: "100vw", height: "100vh",
      overflow: "hidden",
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
      display: "flex", flexDirection: "column",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 99px; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        button { font-family: 'DM Sans', sans-serif; }

        @media (max-width: 768px) {
          .room-body { flex-direction: column !important; overflow-y: auto !important; }
          .player-section { width: 100% !important; }
          .chat-panel { margin: 0 16px 16px !important; }
        }
      `}</style>

      <Background />

      {/* Z-layer above background */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
        <Navbar />

        {/* Main body */}
        <div
          className="room-body"
          style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}
        >
          {/* Left sidebar icons */}
          <div style={{
            width: 72, flexShrink: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center",
            paddingTop: 24,
          }}>
            <SidebarMenu />
          </div>

          {/* Player */}
          <div className="player-section" style={{ flex: "0 0 auto", width: "min(520px,48%)", overflow: "hidden" }}>
            <PlayerSection />
          </div>

          {/* Chat */}
          <div style={{ flex: 1, display: "flex", minWidth: 0, overflow: "hidden" }}>
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}