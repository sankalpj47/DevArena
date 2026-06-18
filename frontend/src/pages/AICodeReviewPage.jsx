import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Send, Copy, CheckCheck, Zap, Terminal, Trash2 } from "lucide-react";
import { GROQ_API_KEY, GROQ_URL, GROQ_MODEL } from "../utils/constants";

const ACCENT = "#00ff87";
const ACCENT_BG = "rgba(0,255,135,0.12)";
const ACCENT_BORDER = "rgba(0,255,135,0.25)";
const PURPLE = "#a78bfa";
const PURPLE_BG = "rgba(167,139,250,0.12)";
const PURPLE_BORDER = "rgba(167,139,250,0.25)";

const LANGS = ["javascript","typescript","python","java","go","rust","cpp","sql","bash","jsx","tsx"];

const fmtText = t => t
  .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, l, c) =>
    `<div class="code-block"><div class="code-header"><span>${l||"code"}</span></div><pre>${c.trim()}</pre></div>`)
  .replace(/\*\*(.*?)\*\*/g, "<strong style='color:var(--text)'>$1</strong>")
  .replace(/`([^`]+)`/g, "<code style='background:rgba(0,255,135,.08);color:var(--green);padding:1px 5px;border-radius:4px;font-family:var(--mono);font-size:11px'>$1</code>")
  .replace(/^### (.*)/gm, "<p style='font-size:13px;font-weight:700;color:var(--text);margin:14px 0 5px;text-transform:uppercase;letter-spacing:.5px'>$1</p>")
  .replace(/^## (.*)/gm, "<p style='font-size:15px;font-weight:700;color:var(--text);margin:16px 0 6px'>$1</p>")
  .replace(/^\* (.*)/gm, "<div style='display:flex;gap:8px;margin:4px 0;align-items:flex-start'><span style='color:var(--green);margin-top:2px;flex-shrink:0'>▸</span><span>$1</span></div>")
  .replace(/^- (.*)/gm, "<div style='display:flex;gap:8px;margin:4px 0;align-items:flex-start'><span style='color:var(--green);margin-top:2px;flex-shrink:0'>▸</span><span>$1</span></div>")
  .replace(/\n/g, "<br/>");

export default function AICodeReviewPage() {
  const user = useSelector(s => s.user);
  const [code, setCode] = useState("");
  const [lang, setLang] = useState("javascript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState("review");

  const MODES = [
    { id: "review",   icon: "🔍", label: "Full Review",  desc: "Bugs, improvements, best practices" },
    { id: "bugs",     icon: "🐛", label: "Find Bugs",    desc: "Only find bugs & security issues" },
    { id: "optimize", icon: "⚡", label: "Optimize",     desc: "Performance & efficiency improvements" },
    { id: "explain",  icon: "📖", label: "Explain Code", desc: "Line-by-line explanation" },
  ];

  const PROMPTS = {
    review: `You are an expert code reviewer. Review this ${lang} code and provide:
1. **Overall Assessment** (1-2 sentences)
2. **Bugs & Issues** (list specific bugs with line references)
3. **Security Issues** (any security vulnerabilities)
4. **Performance** (optimization opportunities)
5. **Best Practices** (coding standards improvements)
6. **Improved Version** (rewrite key parts with fixes)

Be specific, practical, and developer-focused. Use markdown.`,
    bugs: `Find ALL bugs, errors, and security vulnerabilities in this ${lang} code. For each:
- Line reference
- What the bug is
- Why it's a problem
- How to fix it
Also provide a fixed version of the code.`,
    optimize: `Optimize this ${lang} code for maximum performance. Provide:
1. **Performance Issues Found**
2. **Time Complexity Analysis** 
3. **Optimized Version** with comments explaining improvements
4. **Benchmark difference** (estimated improvement)`,
    explain: `Explain this ${lang} code in detail:
1. **What it does** (simple explanation)
2. **How it works** (step by step, reference line numbers)
3. **Key concepts used**
4. **Potential use cases`
  };

  const review_ = async () => {
    if (!code.trim()) { setError("Paste your code first"); return; }
    setLoading(true); setReview(""); setError("");
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: PROMPTS[mode] },
            { role: "user", content: `Here is my ${lang} code:\n\n\`\`\`${lang}\n${code}\n\`\`\`` }
          ],
          max_tokens: 2000, temperature: 0.3,
        }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error?.message || `Error ${res.status}`); }
      const data = await res.json();
      setReview(data.choices?.[0]?.message?.content || "No review generated");
    } catch(e) { setError(e.message || "Review failed. Check your Groq API key."); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "var(--text)", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
            <Code size={24} color={ACCENT} />
            AI Code <span style={{ color: ACCENT }}>Review</span>
          </h1>
          <span className="tag-p" style={{ fontSize: "10px" }}>Groq Free</span>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div className="online-dot" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
            <span style={{ fontSize: "11px", color: ACCENT, fontFamily: "var(--mono)" }}>Online</span>
          </div>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text2)", margin: 0 }}>
          Powered by Groq Llama 3 · Paste code, pick a mode, get instant expert review
        </p>
      </motion.div>

      {/* Mode selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            style={{
              padding: "10px 16px",
              display: "flex", alignItems: "center", gap: "8px",
              borderRadius: "10px",
              border: `1px solid ${mode === m.id ? ACCENT_BORDER : "rgba(255,255,255,0.06)"}`,
              background: mode === m.id ? ACCENT_BG : "rgba(255,255,255,0.02)",
              color: mode === m.id ? ACCENT : "var(--text2)",
              cursor: "pointer", transition: "all 0.2s",
              fontFamily: "var(--font)",
            }}>
            <span style={{ fontSize: "15px" }}>{m.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, lineHeight: 1.3 }}>{m.label}</div>
              <div style={{ fontSize: "10px", opacity: 0.65, lineHeight: 1.3 }}>{m.desc}</div>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

        {/* Left — code input */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
          className="glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "500px" }}>

          <div style={{ height: "2px", background: `linear-gradient(90deg,transparent,${ACCENT},transparent)` }} />

          <div style={{ padding: "12px 16px", borderBottom: `1px solid rgba(0,255,135,0.08)`, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <Terminal size={13} color={ACCENT} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", flex: 1 }}>Your Code</span>
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: "7px", padding: "4px 10px", fontSize: "11px", color: ACCENT, fontFamily: "var(--mono)", cursor: "pointer", outline: "none" }}>
              {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <button onClick={copy} disabled={!code.trim()}
              style={{ background: "none", border: "none", cursor: code.trim() ? "pointer" : "not-allowed", color: copied ? ACCENT : "var(--text3)", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: "var(--mono)", opacity: code.trim() ? 1 : 0.4, transition: "color 0.2s" }}>
              {copied ? <CheckCheck size={12} /> : <Copy size={12} />}{copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={() => setCode("")} disabled={!code.trim()}
              style={{ background: "none", border: "none", cursor: code.trim() ? "pointer" : "not-allowed", color: "var(--text3)", opacity: code.trim() ? 1 : 0.4, display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontFamily: "var(--mono)" }}>
              <Trash2 size={12} />Clear
            </button>
          </div>

          <textarea
            value={code} onChange={e => setCode(e.target.value)}
            placeholder={`// Paste your ${lang} code here...\n// Example:\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}`}
            style={{ flex: 1, resize: "none", background: "#020905", border: "none", outline: "none", padding: "16px", fontFamily: "var(--mono)", fontSize: "12px", color: ACCENT, lineHeight: 1.75, minHeight: "400px" }}
          />

          <div style={{ padding: "12px 16px", borderTop: `1px solid rgba(0,255,135,0.08)` }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={review_} disabled={loading || !code.trim()}
              className="btn-prime"
              style={{ width: "100%", padding: "11px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: !code.trim() ? 0.45 : 1, fontSize: "13px", fontWeight: 600 }}>
              {loading
                ? <div style={{ width: "14px", height: "14px", border: "2px solid #040d08", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                : <Zap size={14} fill="#040d08" />}
              {loading ? "Analyzing..." : `Run ${MODES.find(m => m.id === mode)?.label}`}
            </motion.button>
          </div>
        </motion.div>

        {/* Right — review output */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="glass" style={{ display: "flex", flexDirection: "column", overflow: "hidden", minHeight: "500px" }}>

          <div style={{ height: "2px", background: `linear-gradient(90deg,transparent,${PURPLE},transparent)` }} />

          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${PURPLE_BORDER}`, display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={13} color={PURPLE} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", flex: 1 }}>AI Review</span>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <div className="online-dot" style={{ background: PURPLE, boxShadow: `0 0 6px ${PURPLE}`, width: "6px", height: "6px" }} />
              <span style={{ fontSize: "10px", color: PURPLE, fontFamily: "var(--mono)" }}>Groq Llama 3</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "20px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "16px", height: "16px", border: `2px solid ${ACCENT_BG}`, borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 1s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "var(--text2)", fontFamily: "var(--mono)" }}>Analyzing code...</span>
                  </div>
                  {["Checking syntax and logic...", "Scanning for security issues...", "Generating improvements..."].map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.7 + 0.4 }}
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: ACCENT, opacity: 0.5, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "var(--text3)", fontFamily: "var(--mono)" }}>{t}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ padding: "14px 16px", borderRadius: "10px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontSize: "12px", color: "#f87171", fontFamily: "var(--mono)", lineHeight: 1.6 }}>
                  ⚠ {error}
                </motion.div>
              ) : review ? (
                <motion.div key="review" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{ __html: fmtText(review) }} />
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "300px", textAlign: "center", gap: "14px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Code size={24} color={ACCENT} />
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>Ready to review</p>
                    <p style={{ fontSize: "12px", color: "var(--text3)", lineHeight: 1.7, margin: 0 }}>
                      Paste code on the left → pick a mode → hit Run
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Quick examples */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "10px", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "1px" }}>
          Quick review examples →
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            { label: "Review bubble sort", code: "function bubbleSort(arr) {\n  for(let i=0;i<arr.length;i++){\n    for(let j=0;j<arr.length-i-1;j++){\n      if(arr[j]>arr[j+1]) {\n        let t=arr[j]; arr[j]=arr[j+1]; arr[j+1]=t;\n      }\n    }\n  }\n  return arr;\n}", lang: "javascript" },
            { label: "Review SQL query", code: "SELECT * FROM users WHERE id = '" + "user_input'", lang: "sql" },
            { label: "Review async code", code: "async function fetchData() {\n  const res = await fetch('/api/data');\n  const data = res.json();\n  return data;\n}", lang: "javascript" },
          ].map(ex => (
            <button key={ex.label} onClick={() => { setCode(ex.code); setLang(ex.lang); }}
              style={{ padding: "7px 14px", fontSize: "11px", background: ACCENT_BG, border: `1px solid ${ACCENT_BORDER}`, borderRadius: "8px", color: ACCENT, cursor: "pointer", fontFamily: "var(--mono)", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,255,135,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = ACCENT_BG; }}>
              {ex.label}
            </button>
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}