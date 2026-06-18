import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronDown, LogOut, User, Users, Inbox, MessageSquare, Bot, Menu, X, Trophy, BarChart2, Briefcase, Code2, FileText, Globe, Moon, Sun, Settings, Github,  Gamepad2,Dna } from "lucide-react";
import axios from "axios";
import { removeUser, clearFeed, clearConnections } from "../utils/store";
import { getAvatarUrl, BASE_URL } from "../utils/constants";
import NotificationsPanel from "./NotificationsPanel";
import useTheme from "../hooks/useTheme";

export default function Navbar({ socket }) {
  const user = useSelector(s => s.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mob, setMob] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef(null);
  const mobRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
      if (mobRef.current && !mobRef.current.contains(e.target)) setMob(false);
    };
    if (open || mob) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, mob]);

  useEffect(() => { setOpen(false); setMob(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mob ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mob]);

  const logout = async () => {
    try { await axios.post("/logout"); } catch {}
    dispatch(removeUser());
    dispatch(clearFeed());
    dispatch(clearConnections());
    navigate("/login");
  };

  const active = (p) => p === "/" ? pathname === "/" : pathname.startsWith(p);

  const getPhoto = (u) =>
    u?.useAvatar === false && u?.photoUrl
      ? (u.photoUrl.startsWith("http") ? u.photoUrl : `${BASE_URL}${u.photoUrl}`)
      : getAvatarUrl(u?.avatarSeed || u?.firstName || "dev");

  const links = [
    { to: "/", label: "Explore" },
    { to: "/connections", label: "Connections" },
    { to: "/requests", label: "Requests" },
    { to: "/chat", label: "Messages" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/ai", label: "Dev AI" },
    { to: "/code-review", label: "Code Review" },
  ];

  const menuItems = [
    { icon: <User size={13} />, label: "Profile", to: "/profile" },
    { icon: <Users size={13} />, label: "Connections", to: "/connections" },
    { icon: <Inbox size={13} />, label: "Requests", to: "/requests" },
    { icon: <MessageSquare size={13} />, label: "Messages", to: "/chat" },
    { icon: <Trophy size={13} />, label: "Leaderboard", to: "/leaderboard" },
    { icon: <BarChart2 size={13} />, label: "Analytics", to: "/analytics" },
    { icon: <Briefcase size={13} />, label: "Collab Board", to: "/collab" },
    { icon: <Globe size={13} />, label: "Jobs", to: "/jobs" },
{
  icon: <Gamepad2 size={14} />,
  label: "Dev Games",
  to: "/games",
},
{
  icon: <Dna size={14} />,
  label: "Dev DNA",
  to: "/dev-dna",
},
{
  icon: <Trophy size={14} />,
  label: "World Cup",
  to: "/world-cup",
},
    { icon: <Code2 size={13} />, label: "Hackathons", to: "/hackathons" },
    { icon: <FileText size={13} />, label: "Resume Builder", to: "/resume" },
    { icon: <Github size={13} />, label: "Open Source Match", to: "/opensource" },
    { icon: <Bot size={13} />, label: "Dev AI", to: "/ai" },
    { icon: <Settings size={13} />, label: "Settings", to: "/settings" },
  ];

  return (
    <>
      <nav style={{ background: "rgba(4,13,8,.97)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(0,255,135,.1)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ height: "1px", background: "linear-gradient(90deg,transparent,#00ff87,transparent)", opacity: .5 }} />
        <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 20px", height: "62px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>

          {/* Logo */}
       <Link
  to="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    textDecoration: "none",
    flexShrink: 0,
  }}
>
  <motion.img
    whileHover={{ scale: 1.05 }}
    src="/images/logo.png"
    alt="DevArena Logo"
    style={{
      width: "32px",
      height: "32px",
      objectFit: "contain",
      flexShrink: 0,
    }}
  />

  <span
    style={{
      fontSize: "15px",
      fontWeight: 700,
      letterSpacing: "2px",
      color: "var(--text)",
      fontFamily: "var(--mono)",
    }}
  >
    DEV<span style={{ color: "var(--green)" }}>ARENA</span>
  </span>
</Link>

          {/* Desktop nav links */}
          <div className="nav-desktop-links" style={{ display: "flex", gap: "2px", background: "rgba(0,255,135,.04)", border: "1px solid rgba(0,255,135,.1)", borderRadius: "12px", padding: "4px", overflow: "hidden" }}>
            {links.map(l => (
              <Link key={l.to} to={l.to}
                style={{
                  padding: "7px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 500,
                  color: active(l.to) ? "var(--green)" : l.accent ? "#a78bfa" : "var(--text3)",
                  background: active(l.to) ? "rgba(0,255,135,.1)" : "transparent",
                  boxShadow: active(l.to) ? "0 0 0 1px rgba(0,255,135,.2)" : "none",
                  textDecoration: "none", transition: "all .2s", letterSpacing: ".3px", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>

              {/* Theme toggle — hidden on very small screens */}
              {/* <button onClick={toggleTheme} className="btn-ico nav-theme-btn" title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button> */}

              {/* Notifications */}
              <div className="nav-notif-btn">
                <NotificationsPanel socket={socket} onOpen={() => { setOpen(false); setMob(false); }} />
              </div>

              {/* User menu — desktop */}
              <div className="nav-desktop-user" style={{ position: "relative" }} ref={menuRef}>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => { setOpen(v => !v); setMob(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 10px", borderRadius: "10px", border: "1px solid rgba(0,255,135,.15)", background: "rgba(0,255,135,.04)", cursor: "pointer" }}>
                  <img src={getPhoto(user)} style={{ width: "26px", height: "26px", borderRadius: "7px", border: "1px solid rgba(0,255,135,.2)", objectFit: "cover" }} />
                  <span className="nav-username" style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>{user.firstName}</span>
                  <ChevronDown size={11} color="var(--text3)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </motion.button>

                <AnimatePresence>
                  {open && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: .95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .95 }}
                      style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: "220px", background: "rgba(7,21,16,.97)", border: "1px solid rgba(0,255,135,.15)", borderRadius: "14px", overflow: "hidden", backdropFilter: "blur(20px)", boxShadow: "0 20px 40px rgba(0,0,0,.6)", zIndex: 200 }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(0,255,135,.08)" }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{user.firstName} {user.lastName || ""}</p>
                        <p style={{ fontSize: "11px", color: "var(--green)", fontFamily: "var(--mono)", margin: 0 }}>Score: {user.devScore || 0} pts</p>
                      </div>
                      <div style={{ maxHeight: "320px", overflowY: "auto" }}>
                        {menuItems.map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 16px", fontSize: "13px", color: "var(--text2)", textDecoration: "none", transition: "all .15s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,135,.06)"; e.currentTarget.style.color = "var(--green)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}>
                            <span style={{ color: "var(--text3)" }}>{item.icon}</span>{item.label}
                          </Link>
                        ))}
                      </div>
                      <button onClick={logout}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", fontSize: "13px", color: "#f87171", background: "none", border: "none", cursor: "pointer", borderTop: "1px solid rgba(255,255,255,.05)", fontFamily: "var(--font)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}>
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger — mobile only */}
              <button onClick={() => { setMob(v => !v); setOpen(false); }} className="nav-hamburger btn-ico">
                {mob ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMob(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", zIndex: 150, backdropFilter: "blur(4px)" }}
            />

            {/* Drawer */}
            <motion.div
              ref={mobRef}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(320px, 90vw)", background: "rgba(4,13,8,.98)", borderLeft: "1px solid rgba(0,255,135,.15)", zIndex: 200, display: "flex", flexDirection: "column", overflowY: "auto" }}>

              {/* Drawer header */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,255,135,.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                {user && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <img src={getPhoto(user)} style={{ width: "36px", height: "36px", borderRadius: "9px", border: "1px solid rgba(0,255,135,.25)", objectFit: "cover" }} />
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", margin: "0 0 1px", fontFamily: "var(--mono)" }}>{user.firstName} {user.lastName || ""}</p>
                      <p style={{ fontSize: "11px", color: "var(--green)", margin: 0, fontFamily: "var(--mono)" }}>{user.devScore || 0} pts</p>
                    </div>
                  </div>
                )}
                <button onClick={() => setMob(false)} className="btn-ico"><X size={16} /></button>
              </div>

              {/* Quick actions row */}
              <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(0,255,135,.06)", display: "flex", gap: "8px" }}>
                <button onClick={toggleTheme} className="btn-ico" style={{ flex: 1, justifyContent: "center", fontSize: "11px", gap: "6px", display: "flex", alignItems: "center" }}>
                  {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
                  <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text3)" }}>{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
                <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <NotificationsPanel socket={socket} onOpen={() => setMob(false)} />
                </div>
              </div>

              {/* Nav links */}
              <div style={{ padding: "8px 12px", flex: 1 }}>
                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "var(--mono)", letterSpacing: "1px", textTransform: "uppercase", padding: "8px 8px 4px" }}>Navigation</p>
                {links.map((l, i) => (
                  <motion.div key={l.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to={l.to} onClick={() => setMob(false)}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "11px 12px", borderRadius: "10px", marginBottom: "2px",
                        fontSize: "13px", fontWeight: active(l.to) ? 600 : 400,
                        color: active(l.to) ? "var(--green)" : l.accent ? "#a78bfa" : "var(--text2)",
                        background: active(l.to) ? "rgba(0,255,135,.08)" : "transparent",
                        border: `1px solid ${active(l.to) ? "rgba(0,255,135,.2)" : "transparent"}`,
                        textDecoration: "none", transition: "all .15s",
                      }}>
                      {active(l.to) && <div style={{ width: "3px", height: "16px", borderRadius: "2px", background: "var(--green)", flexShrink: 0 }} />}
                      {l.label}
                    </Link>
                  </motion.div>
                ))}

                <p style={{ fontSize: "10px", color: "var(--text3)", fontFamily: "var(--mono)", letterSpacing: "1px", textTransform: "uppercase", padding: "12px 8px 4px" }}>More</p>
                {menuItems.filter(m => !["/connections","/requests","/chat","/leaderboard","/ai"].includes(m.to)).map((item, i) => (
                  <motion.div key={item.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (links.length + i) * 0.04 }}>
                    <Link to={item.to} onClick={() => setMob(false)}
                      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "10px", marginBottom: "2px", fontSize: "13px", color: "var(--text2)", textDecoration: "none", transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,135,.06)"; e.currentTarget.style.color = "var(--green)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}>
                      <span style={{ color: "var(--text3)", flexShrink: 0 }}>{item.icon}</span>{item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Sign out */}
              <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,.05)", flexShrink: 0 }}>
                <button onClick={logout}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "11px", fontSize: "13px", color: "#f87171", background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)", borderRadius: "10px", cursor: "pointer", fontFamily: "var(--font)", transition: "all .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,.06)"}>
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .nav-hamburger { display: none !important; }
        .nav-desktop-links { display: flex !important; }
        .nav-desktop-user { display: block !important; }

        @media (max-width: 900px) {
          .nav-desktop-links { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-hamburger { display: flex !important; }
          .nav-desktop-user { display: none !important; }
          .nav-username { display: none !important; }
          .nav-theme-btn { display: none !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .nav-hamburger { display: flex !important; }
          .nav-desktop-user { display: flex !important; }
          .nav-username { display: none !important; }
        }
      `}</style>
    </>
  );
}