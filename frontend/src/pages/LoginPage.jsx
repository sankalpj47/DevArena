import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";
import axios from "axios";
import { addUser } from "../utils/store";
import GridTrailEffect from "../components/GridTrialEffect";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !pass) {
      setError("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const r = await axios.post("/login", {
        emailId: email,
        password: pass,
      });

      dispatch(addUser(r.data.user || r.data));
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <GridTrailEffect />

      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          position: "relative",
          overflow: "hidden",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "500px",
            height: "300px",
            background: "radial-gradient(ellipse, rgba(0,255,135,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "var(--green)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(0,255,135,0.5)",
            }}
          >
            <Zap size={20} color="#040d08" fill="#040d08" />
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "var(--text)",
              fontFamily: "var(--mono)",
            }}
          >
            DEV<span style={{ color: "var(--green)", textShadow: "0 0 20px rgba(0,255,135,0.6)" }}>ARENA</span>
          </span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "rgba(7,21,16,0.92)",
            border: "1px solid rgba(0,255,135,0.15)",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 0 60px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ height: "2px", background: "linear-gradient(90deg,transparent,var(--green),transparent)" }} />

          <div style={{ padding: "36px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)", textAlign: "center", marginBottom: "6px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text2)", textAlign: "center", marginBottom: "28px" }}>
              Sign in to continue your mission
            </p>

            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: "7px" }}>
                Email
              </label>
              <div
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  boxShadow: emailFocused ? "0 0 0 3px rgba(0,255,135,0.12)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: emailFocused ? "var(--green)" : "var(--text3)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="you@example.com"
                  className="inp"
                  autoComplete="email"
                  style={{ paddingLeft: "42px", fontSize: "14px" }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "7px" }}>
                <label style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 500 }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: "12px", color: "var(--green)", textDecoration: "none" }}>
                  Forgot password?
                </Link>
              </div>
              <div
                style={{
                  position: "relative",
                  borderRadius: "10px",
                  boxShadow: passFocused ? "0 0 0 3px rgba(0,255,135,0.12)" : "none",
                  transition: "box-shadow 0.2s",
                }}
              >
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: passFocused ? "var(--green)" : "var(--text3)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  type={show ? "text" : "password"}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  placeholder="Enter your password"
                  className="inp"
                  style={{ paddingLeft: "42px", paddingRight: "42px", fontSize: "14px" }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text3)",
                    display: "flex",
                  }}
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  fontSize: "13px",
                  color: "#f87171",
                  marginTop: "16px",
                }}
              >
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={login}
              disabled={loading}
              className="btn-prime"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: "14px",
                marginTop: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid #040d08",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin .8s linear infinite",
                  }}
                />
              ) : null}
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>

            <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text3)", marginTop: "22px" }}>
              No account?{" "}
              <Link to="/signup" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 600 }}>
                Create one →
              </Link>
            </p>
            <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text3)", marginTop: "10px" }}>
              <Link to="/about" style={{ color: "var(--text3)", textDecoration: "none" }}>
                Learn about DevArena →
              </Link>
            </p>
          </div>
        </motion.div>

        <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "24px", fontFamily: "var(--mono)" }}>
          © 2026 DevArena · Built by{" "}
          <a href="https://github.com/sankalpj47" target="_blank" rel="noreferrer" style={{ color: "var(--green)", textDecoration: "none" }}>
            Sankalp Joshi
          </a>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::-ms-reveal, input::-ms-clear { display: none; }
        input[type=password]::-webkit-credentials-auto-fill-button { display: none; }
      `}</style>
    </div>
  );
}