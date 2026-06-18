import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Github, Globe, Star, Code, Sparkles } from "lucide-react";
import axios from "axios";
import { addFeed, removeFromFeed } from "../utils/store";
import { useToast } from "../components/ToastProvider";
import PlatformConnect from "../components/PlatformConnect";
import { getAvatarUrl, BASE_URL } from "../utils/constants";

const DevCard = ({ user, onIgnore, onConnect }) => {
  if (!user) return null;
  const userPhoto = user.useAvatar === false && user.photoUrl
    ? `${BASE_URL}${user.photoUrl}`
    : getAvatarUrl(user.avatarSeed || user.firstName || "dev");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="dev-card"
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", minWidth: 0 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img src={userPhoto} style={{ width: "68px", height: "68px", borderRadius: "16px", border: "1px solid rgba(0,255,135,0.2)", objectFit: "cover" }} />
            <div className="online-dot" style={{ position: "absolute", bottom: "-2px", right: "-2px", border: "2px solid var(--bg2)" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.firstName} {user.lastName}
            </h3>
            <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "var(--mono)", marginBottom: "8px" }}>
              {user.role || "Developer"}{user.age ? ` · Age ${user.age}` : ""}
            </p>
            <span className="tag-g" style={{ fontSize: "10px", padding: "2px 8px" }}>Open to collab</span>
          </div>
        </div>
      </div>

      <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7, marginBottom: "16px" }}>
        {user.about || "Passionate developer always building something new and exciting."}
      </p>

      {user.skills?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
          {user.skills.slice(0, 5).map((s, i) => (
            <span key={s} className={i === 0 ? "tag-g" : "tag-n"} style={{ fontSize: "11px" }}>{s}</span>
          ))}
          {user.skills.length > 5 && <span className="tag-n" style={{ fontSize: "11px" }}>+{user.skills.length - 5}</span>}
        </div>
      )}

      {user.githubStats && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text2)", fontFamily: "var(--mono)", padding: "3px 8px", border: "1px solid var(--border)", borderRadius: "6px" }}>
            <Github size={10} /> {user.githubStats.publicRepos} repos
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#fb923c", fontFamily: "var(--mono)", padding: "3px 8px", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "6px" }}>
            <Star size={10} /> {user.githubStats.totalStars} stars
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--green)", fontFamily: "var(--mono)", padding: "3px 8px", border: "1px solid var(--border)", borderRadius: "6px" }}>
            <Code size={10} /> {user.githubStats.topLanguage}
          </span>
        </div>
      )}

      {user.leetcodeStats && (
        <div style={{ marginBottom: "14px", padding: "8px 12px", background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.15)", borderRadius: "8px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", color: "#fb923c", fontFamily: "var(--mono)" }}>LC: <strong>{user.leetcodeStats.totalSolved}</strong> solved</span>
          <span style={{ fontSize: "11px", color: "var(--text3)", fontFamily: "var(--mono)" }}>Rank #{user.leetcodeStats.ranking?.toLocaleString()}</span>
        </div>
      )}

      {(user.github || user.portfolio) && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
          {user.github && (
            <a href={user.github} target="_blank" rel="noreferrer" className="dev-link">
              <Github size={11} /> GitHub
            </a>
          )}
          {user.portfolio && (
            <a href={user.portfolio} target="_blank" rel="noreferrer" className="dev-link">
              <Globe size={11} /> Portfolio
            </a>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onIgnore} className="btn-sec" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <X size={15} /> Pass
        </motion.button>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onConnect} className="btn-prime" style={{ flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <Heart size={15} /> Connect
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const dispatch = useDispatch();
  const feed = useSelector(s => s.feed);
  const user = useSelector(s => s.user);
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const viewedRef = React.useRef(new Set());

  const recordView = React.useCallback((targetId) => {
    if (!targetId || viewedRef.current.has(targetId)) return;
    viewedRef.current.add(targetId);
    axios.post(`/profile/view/${targetId}`).catch(() => {});
  }, []);

  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [matchFlash, setMatchFlash] = useState(false);

  const connectedPlatforms = {
    github: user?.githubStats?.username ? user.githubStats : (user?.github ? { username: user.github } : null),
    leetcode: user?.leetcodeStats?.username ? user.leetcodeStats : (user?.leetcode ? { username: user.leetcode } : null),
    linkedin: user?.linkedin ? { username: user.linkedin, profileUrl: user.linkedin } : null,
    gfg: user?.gfg ? { username: user.gfg, profileUrl: user.gfg } : null,
  };

  useEffect(() => {
    const fetch = async () => {
      try { const r = await axios.get("/feed"); dispatch(addFeed(r.data || [])); }
      catch (e) { console.error(e.message); }
      finally { setLoading(false); }
    };
    if (feed.length === 0) fetch(); else setLoading(false);
  }, []);

  useEffect(() => {
    if (feed[0]?._id) {
      axios.post(`/profile/view/${feed[0]._id}`).catch(() => {});
    }
  }, [feed[0]?._id]);

  const handleSearch = async (q) => {
    setSearchQ(q);
    if (!q.trim()) { setSearchResults(null); return; }
    setSearching(true);
    try {
      const r = await axios.get(`/search?q=${encodeURIComponent(q)}`);
      setSearchResults(r.data || []);
    } catch (e) { console.error(e); }
    finally { setSearching(false); }
  };

  const handleIgnore = async () => {
    if (!feed[0]) return;
    try { await axios.post(`/request/send/ignore/${feed[0]._id}`); dispatch(removeFromFeed(feed[0]._id)); toast("Passed on this developer", "info"); }
    catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const handleInterested = async () => {
    if (!feed[0]) return;
    try {
      const r = await axios.post(`/request/send/interested/${feed[0]._id}`);
      dispatch(removeFromFeed(feed[0]._id));
      if (r.data.match) { setMatchFlash(true); setTimeout(() => setMatchFlash(false), 2500); toast("It is a match!", "success"); }
      else toast("Connection request sent!", "success");
    } catch (e) { toast(e.response?.data?.message || "Error", "error"); }
  };

  const userPhoto = user?.useAvatar === false && user?.photoUrl
    ? `${BASE_URL}${user.photoUrl}`
    : getAvatarUrl(user?.avatarSeed || user?.firstName || "dev");

  const activityStats = [
    { label: "Connections", value: 0, color: "var(--green)" },
    { label: "Requests", value: 0, color: "#38bdf8" },
    { label: "Matches", value: 0, color: "#fb923c" },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

      <AnimatePresence>
        {matchFlash && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          >
            <div style={{ textAlign: "center", padding: "48px", background: "rgba(7,21,16,0.95)", border: "1px solid rgba(0,255,135,0.3)", borderRadius: "24px", boxShadow: "0 0 60px rgba(0,255,135,0.3)" }}>
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }} style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <Sparkles size={48} color="var(--green)" />
              </motion.div>
              <h2 style={{ fontSize: "28px", fontWeight: 700, color: "var(--green)", fontFamily: "var(--mono)", marginBottom: "8px", textShadow: "0 0 30px rgba(0,255,135,0.5)" }}>
                It's a match!
              </h2>
              <p style={{ color: "var(--text2)", fontSize: "14px" }}>New connection established</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "28px" }}>
        <span className="tag-g" style={{ fontSize: "11px", marginBottom: "10px", display: "inline-flex" }}>
          <span className="online-dot" style={{ width: "6px", height: "6px", boxShadow: "none" }} /> Live feed
        </span>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>
          Explore <span style={{ color: "var(--green)", textShadow: "0 0 20px rgba(0,255,135,0.4)" }}>developers</span>
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text2)" }}>Find your next collaborator — matched by tech stack and goals</p>
      </motion.div>

      {/* Layout */}
      <div className="home-grid" style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", gap: "20px", alignItems: "start" }}>

        {/* Left: activity + profile */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div className="glass" style={{ padding: "20px" }}>
            <div className="section-label">Your activity</div>
            {activityStats.map(s => (
              <div key={s.label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text2)" }}>{s.label}</span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: s.color, fontFamily: "var(--mono)" }}>{s.value}</span>
                </div>
                <div className="prog">
                  <div className="prog-fill" style={{ width: `${Math.min(s.value, 100)}%`, background: `linear-gradient(90deg, ${s.color}80, ${s.color})` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img src={userPhoto} style={{ width: "40px", height: "40px", borderRadius: "10px", border: "1px solid rgba(0,255,135,0.2)", objectFit: "cover" }} />
                <div className="online-dot" style={{ position: "absolute", bottom: "-2px", right: "-2px", border: "2px solid var(--bg)" }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <span className="tag-g" style={{ fontSize: "10px", padding: "1px 7px" }}>Developer</span>
              </div>
            </div>
            {user?.githubStats && (
              <p style={{ fontSize: "11px", color: "var(--green)", fontFamily: "var(--mono)" }}>
                {user.githubStats.totalStars} stars · {user.githubStats.publicRepos} repos
              </p>
            )}
            {user?.leetcodeStats && (
              <p style={{ fontSize: "11px", color: "#fb923c", fontFamily: "var(--mono)", marginTop: "3px" }}>
                LC: {user.leetcodeStats.totalSolved} solved
              </p>
            )}
          </div>
        </motion.div>

        {/* Center: card feed */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", minHeight: "480px", justifyContent: loading || feed.length === 0 ? "center" : "flex-start" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: "36px", height: "36px", border: "2px solid rgba(0,255,135,0.2)", borderTopColor: "var(--green)", borderRadius: "50%" }} />
              <p style={{ fontSize: "13px", color: "var(--text3)", fontFamily: "var(--mono)" }}>Loading developers...</p>
            </div>
          ) : feed.length > 0 ? (
            <>
              <AnimatePresence mode="wait">
                <DevCard key={feed[0]._id} user={feed[0]} onIgnore={handleIgnore} onConnect={handleInterested} />
              </AnimatePresence>
              <p style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "var(--mono)" }}>
                {feed.length} developer{feed.length !== 1 ? "s" : ""} in feed
              </p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: "48px 40px", textAlign: "center", maxWidth: "380px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                <Sparkles size={40} color="var(--green)" />
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "8px" }}>All caught up</h3>
              <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.6 }}>You have explored all available developers. Check back soon!</p>
            </motion.div>
          )}
        </div>

        {/* Right: platform connect */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="glass" style={{ padding: "20px" }}>
          <div className="section-label">Link your profiles</div>
          <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "14px", lineHeight: 1.6 }}>
            Real stats auto-load. Saved permanently to your profile.
          </p>
          <PlatformConnect connectedPlatforms={connectedPlatforms} />
        </motion.div>
      </div>

      <style>{`
        .dev-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text3);
          text-decoration: none;
          padding: 5px 10px;
          border: 1px solid var(--border);
          border-radius: 6px;
          transition: all 0.2s;
        }
        .dev-link:hover {
          color: var(--green);
          border-color: rgba(0,255,135,0.3);
        }
        @media (max-width: 1024px) {
          .home-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}