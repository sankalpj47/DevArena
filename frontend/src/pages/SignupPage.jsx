import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Zap, X, Phone, Check, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import { addUser } from "../utils/store";
import { TECH_SKILLS } from "../utils/constants";
import GridTrailEffect from "../components/GridTrialEffect";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", emailId: "", password: "", confirmPassword: "",
    mobile: "", age: "", gender: "", about: "", skills: [], github: "", portfolio: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [captchaNum1] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaNum2] = useState(Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }));
  const toggleSkill = s => setForm(p => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter(x => x !== s) : [...p.skills, s] }));

  const validate1 = () => {
    if (!form.firstName || form.firstName.trim().length < 2) return "First name must be at least 2 characters";
    if (!form.emailId || !form.emailId.includes("@")) return "Enter a valid email";
    const emailDomain = form.emailId.toLowerCase().split("@")[1];
    if (emailDomain !== "gmail.com") return "Only Gmail addresses (@gmail.com) are accepted";
    if (!form.password || form.password.length < 8) return "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  };

  const next = () => {
    setError("");
    if (step === 1) { const e = validate1(); if (e) { setError(e); return; } }
    setStep(s => s + 1);
  };

  const signup = async () => {
    if (!termsAccepted) { setError("Please accept the Terms & Conditions"); return; }
    if (parseInt(captchaInput) !== captchaNum1 + captchaNum2) { setError("Incorrect CAPTCHA answer. Try again."); return; }
    try {
      setLoading(true); setError("");
      await axios.post("/signup", {
        firstName: form.firstName, lastName: form.lastName,
        emailId: form.emailId, password: form.password,
        mobile: form.mobile, age: form.age ? parseInt(form.age) : undefined,
        gender: form.gender, about: form.about,
        skills: form.skills, github: form.github, portfolio: form.portfolio,
      });
      const r = await axios.post("/login", { emailId: form.emailId, password: form.password });
      dispatch(addUser(r.data.user || r.data));
      navigate("/");
    } catch (e) { setError(e.response?.data?.message || "Signup failed"); }
    finally { setLoading(false); }
  };

  const steps = ["Profile info", "Skills", "Finalize"];
  const captchaCorrect = captchaInput !== "" && parseInt(captchaInput) === captchaNum1 + captchaNum2;

  const Label = ({ children, required }) => (
    <label style={{ fontSize: "12px", color: "var(--text2)", fontWeight: 500, display: "block", marginBottom: "6px" }}>
      {children}{required && <span style={{ color: "var(--green)" }}> *</span>}
    </label>
  );

  const fieldWrap = (focused) => ({
    position: "relative",
    borderRadius: "10px",
    boxShadow: focused ? "0 0 0 3px rgba(0,255,135,0.12)" : "none",
    transition: "box-shadow 0.2s",
  });

  const [focusedField, setFocusedField] = useState(null);
  const isFocused = (name) => focusedField === name;

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
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(0,255,135,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Logo */}
          <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}
>
  <img
    src="/images/logo.png"
    alt="DevArena Logo"
    style={{
      width: "36px",
      height: "36px",
      objectFit: "contain",
      flexShrink: 0,
    }}
  />

  <span
    style={{
      fontSize: "18px",
      fontWeight: 700,
      letterSpacing: "2px",
      color: "var(--text)",
      fontFamily: "var(--mono)",
    }}
  >
    DEV
    <span
      style={{
        color: "var(--green)",
        textShadow: "0 0 20px rgba(0,255,135,0.6)",
      }}
    >
      ARENA
    </span>
  </span>
</motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: "480px", background: "rgba(7,21,16,0.92)", border: "1px solid rgba(0,255,135,0.15)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>
          <div style={{ height: "2px", background: "linear-gradient(90deg,transparent,var(--green),transparent)" }} />
          <div style={{ padding: "32px" }}>
            <h1 style={{ fontSize: "21px", fontWeight: 700, color: "var(--text)", textAlign: "center", marginBottom: "4px" }}>Create your profile</h1>
            <p style={{ fontSize: "13px", color: "var(--text3)", textAlign: "center", marginBottom: "24px" }}>Join developers building together</p>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700, fontFamily: "var(--mono)",
                    background: step >= i + 1 ? "var(--green)" : "transparent",
                    color: step >= i + 1 ? "#040d08" : "var(--text3)",
                    border: step < i + 1 ? "1px solid var(--border2)" : "none",
                    boxShadow: step === i + 1 ? "0 0 15px rgba(0,255,135,0.4)" : "none",
                    transition: "all .3s"
                  }}>
                    {step > i + 1 ? <Check size={13} /> : i + 1}
                  </div>
                  {i < steps.length - 1 && <div style={{ width: "32px", height: "1px", background: step > i + 1 ? "var(--green)" : "var(--border2)", transition: "background .3s" }} />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "22px", marginBottom: "22px" }}>
              {steps.map((s, i) => (
                <span key={i} style={{ fontSize: "11px", color: step === i + 1 ? "var(--green)" : "var(--text3)", fontWeight: step === i + 1 ? 600 : 400 }}>{s}</span>
              ))}
            </div>

            <AnimatePresence mode="wait">

              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <Label required>First name</Label>
                      <div style={fieldWrap(isFocused("firstName"))}>
                        <User size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isFocused("firstName") ? "var(--green)" : "var(--text3)" }} />
                        <input value={form.firstName} onChange={upd("firstName")} onFocus={() => setFocusedField("firstName")} onBlur={() => setFocusedField(null)}
                          placeholder="Jane" className="inp" style={{ paddingLeft: "36px" }} autoFocus autoComplete="given-name" />
                      </div>
                    </div>
                    <div>
                      <Label>Last name</Label>
                      <div style={fieldWrap(isFocused("lastName"))}>
                        <input value={form.lastName} onChange={upd("lastName")} onFocus={() => setFocusedField("lastName")} onBlur={() => setFocusedField(null)}
                          placeholder="Doe" className="inp" autoComplete="family-name" />
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <Label required>Email</Label>
                    <div style={fieldWrap(isFocused("email"))}>
                      <Mail size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isFocused("email") ? "var(--green)" : "var(--text3)" }} />
                      <input type="email" value={form.emailId} onChange={upd("emailId")} onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                        placeholder="you@gmail.com" className="inp" style={{ paddingLeft: "36px" }} autoComplete="email" />
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--text3)", marginTop: "5px" }}>Gmail addresses only</p>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <Label>Mobile (optional)</Label>
                    <div style={fieldWrap(isFocused("mobile"))}>
                      <Phone size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isFocused("mobile") ? "var(--green)" : "var(--text3)" }} />
                      <input type="tel" value={form.mobile} onChange={upd("mobile")} onFocus={() => setFocusedField("mobile")} onBlur={() => setFocusedField(null)}
                        placeholder="Mobile number" className="inp" style={{ paddingLeft: "36px" }} autoComplete="tel" />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <Label required>Password</Label>
                      <div style={fieldWrap(isFocused("password"))}>
                        <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: isFocused("password") ? "var(--green)" : "var(--text3)" }} />
                        <input type={showPass ? "text" : "password"} value={form.password} onChange={upd("password")} onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField(null)}
                          placeholder="At least 8 characters" className="inp" style={{ paddingLeft: "36px", paddingRight: "36px" }} autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? "Hide password" : "Show password"}
                          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex" }}>
                          {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                      {form.password && (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                          <div style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                            <div style={{
                              height: "100%",
                              width: form.password.length < 8 ? "33%" : form.password.length < 12 ? "66%" : "100%",
                              background: form.password.length < 8 ? "#f87171" : form.password.length < 12 ? "#fb923c" : "var(--green)",
                              transition: "all 0.2s",
                            }} />
                          </div>
                          <span style={{ fontSize: "10px", color: form.password.length < 8 ? "#f87171" : form.password.length < 12 ? "#fb923c" : "var(--green)", whiteSpace: "nowrap" }}>
                            {form.password.length < 8 ? "Weak" : form.password.length < 12 ? "Medium" : "Strong"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label required>Confirm</Label>
                      <div style={{
                        ...fieldWrap(isFocused("confirm")),
                        boxShadow: form.confirmPassword && form.confirmPassword !== form.password
                          ? "0 0 0 3px rgba(248,113,113,0.12)"
                          : fieldWrap(isFocused("confirm")).boxShadow,
                      }}>
                        <Lock size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: form.confirmPassword && form.confirmPassword !== form.password ? "#f87171" : isFocused("confirm") ? "var(--green)" : "var(--text3)" }} />
                        <input type="password" value={form.confirmPassword} onChange={upd("confirmPassword")} onFocus={() => setFocusedField("confirm")} onBlur={() => setFocusedField(null)}
                          placeholder="Repeat password" className="inp" style={{ paddingLeft: "36px" }} autoComplete="new-password" />
                      </div>
                      {form.confirmPassword && form.confirmPassword !== form.password && (
                        <p style={{ fontSize: "10px", color: "#f87171", marginTop: "6px" }}>Passwords don't match</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <p style={{ fontSize: "13px", color: "var(--text2)", marginBottom: "12px" }}>
                    Select your tech stack <span style={{ color: "var(--green)" }}>({form.skills.length} selected)</span>
                  </p>
                  {form.skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px", padding: "10px", background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.08)", borderRadius: "8px" }}>
                      {form.skills.map(s => (
                        <span key={s} onClick={() => toggleSkill(s)}
                          style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "6px", fontSize: "11px", background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.25)", color: "var(--green)", cursor: "pointer" }}>
                          {s} <X size={9} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", maxHeight: "220px", overflowY: "auto", padding: "2px" }}>
                    {TECH_SKILLS.map(s => (
                      <button key={s.name} onClick={() => toggleSkill(s.name)} className={`skill ${form.skills.includes(s.name) ? "active" : ""}`}>
                        {s.icon} {s.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <Label>Age</Label>
                      <div style={fieldWrap(isFocused("age"))}>
                        <input type="number" value={form.age} onChange={upd("age")} onFocus={() => setFocusedField("age")} onBlur={() => setFocusedField(null)} placeholder="22" className="inp" />
                      </div>
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <select value={form.gender} onChange={upd("gender")} className="inp" style={{ cursor: "pointer", appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}>
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="others">Others</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <Label>About you</Label>
                    <textarea value={form.about} onChange={upd("about")} rows={3} placeholder="Passionate developer building the future..." className="inp" style={{ resize: "none" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <Label>GitHub URL</Label>
                      <input value={form.github} onChange={upd("github")} placeholder="github.com/username" className="inp" />
                    </div>
                    <div>
                      <Label>Portfolio</Label>
                      <input value={form.portfolio} onChange={upd("portfolio")} placeholder="mysite.dev" className="inp" />
                    </div>
                  </div>

                  {/* Profile summary */}
                  <div style={{ padding: "12px 14px", borderRadius: "10px", background: "rgba(0,255,135,0.04)", border: "1px solid rgba(0,255,135,0.1)", marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Profile preview</p>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "3px" }}>{form.firstName} {form.lastName}</p>
                    <p style={{ fontSize: "12px", color: "var(--text3)" }}>{form.emailId}</p>
                    {form.mobile && <p style={{ fontSize: "12px", color: "var(--text3)" }}>{form.mobile}</p>}
                    {form.skills.length > 0 && (
                      <p style={{ fontSize: "12px", color: "var(--green)", marginTop: "6px" }}>
                        {form.skills.slice(0, 4).join(" · ")}{form.skills.length > 4 ? ` +${form.skills.length - 4}` : ""}
                      </p>
                    )}
                  </div>

                  {/* CAPTCHA */}
                  <div style={{ padding: "14px", borderRadius: "10px", background: "rgba(0,255,135,0.03)", border: "1px solid rgba(0,255,135,0.12)", marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", color: "var(--text2)", marginBottom: "10px" }}>Quick security check</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ padding: "10px 16px", background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.2)", borderRadius: "8px", fontSize: "17px", fontWeight: 700, color: "var(--green)", fontFamily: "var(--mono)", userSelect: "none" }}>
                        {captchaNum1} + {captchaNum2} =
                      </div>
                      <div style={{
                        ...fieldWrap(isFocused("captcha")),
                        width: "84px",
                        boxShadow: captchaCorrect ? "0 0 0 3px rgba(0,255,135,0.2)" : fieldWrap(isFocused("captcha")).boxShadow,
                      }}>
                        <input type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} onFocus={() => setFocusedField("captcha")} onBlur={() => setFocusedField(null)}
                          placeholder="?" className="inp" style={{ textAlign: "center", fontSize: "15px", fontWeight: 700 }} />
                      </div>
                      {captchaCorrect && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--green)", fontWeight: 600 }}>
                          <Check size={14} /> Correct
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div onClick={() => setTermsAccepted(!termsAccepted)} role="checkbox" aria-checked={termsAccepted} tabIndex={0}
                      style={{ width: "18px", height: "18px", borderRadius: "5px", border: `1.5px solid ${termsAccepted ? "var(--green)" : "var(--border2)"}`, background: termsAccepted ? "var(--green)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, marginTop: "1px", transition: "all .2s" }}>
                      {termsAccepted && <Check size={12} color="#040d08" strokeWidth={3} />}
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text2)", lineHeight: 1.6 }}>
                      I agree to the{" "}
                      <span onClick={() => setShowTerms(true)} style={{ color: "var(--green)", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>Terms & Conditions</span>
                      {" "}and{" "}
                      <span onClick={() => setShowTerms(true)} style={{ color: "var(--green)", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}>Privacy Policy</span>
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", fontSize: "12px", color: "#f87171", marginTop: "16px" }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-sec" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              {step < 3 ? (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={next}
                  className="btn-prime" style={{ flex: 2, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  Next <ArrowRight size={14} />
                </motion.button>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={signup} disabled={loading}
                  className="btn-prime" style={{ flex: 2, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: loading ? 0.7 : 1 }}>
                  {loading
                    ? <div style={{ width: "14px", height: "14px", border: "2px solid #040d08", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                    : <Zap size={14} fill="#040d08" />}
                  {loading ? "Creating..." : "Launch profile"}
                </motion.button>
              )}
            </div>

            <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text3)", marginTop: "16px" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 600 }}>Sign in →</Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTerms && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
            onClick={e => e.target === e.currentTarget && setShowTerms(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              style={{ background: "rgba(7,21,16,0.98)", border: "1px solid rgba(0,255,135,0.2)", borderRadius: "20px", width: "100%", maxWidth: "500px", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ height: "2px", background: "linear-gradient(90deg,transparent,var(--green),transparent)" }} />
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,255,135,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text)" }}>Terms & Conditions</h2>
                <button onClick={() => setShowTerms(false)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
                {[
                  { title: "1. Acceptance", text: "By creating an account on DevArena, you agree to these Terms. If you do not agree, please do not use this platform." },
                  { title: "2. Account Responsibility", text: "You are responsible for maintaining the confidentiality of your account credentials. Provide accurate and complete information during registration." },
                  { title: "3. Appropriate Use", text: "DevArena is a professional developer collaboration platform. Do not use it for harassment, spam, or any illegal activities." },
                  { title: "4. Content Policy", text: "You retain ownership of content you post. Do not post offensive, copyrighted, or harmful content." },
                  { title: "5. Privacy & Data", text: "We collect only necessary data to provide our services. Your email and profile are stored securely. We never sell your data." },
                  { title: "6. Platform Stats", text: "GitHub, LeetCode, and other platform data is fetched from public APIs with your consent when you connect these platforms." },
                  { title: "7. Termination", text: "We reserve the right to suspend accounts that violate these terms. You may delete your account at any time." },
                  { title: "8. Disclaimer", text: "DevArena is provided 'as is'. We are not responsible for any damages arising from platform use." },
                  { title: "9. Contact", text: "For questions about these terms, reach out through the platform." },
                ].map(s => (
                  <div key={s.title} style={{ marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "12px", fontWeight: 700, color: "var(--green)", marginBottom: "5px" }}>{s.title}</h3>
                    <p style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.7 }}>{s.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(0,255,135,0.08)", display: "flex", gap: "10px" }}>
                <button onClick={() => setShowTerms(false)} className="btn-sec" style={{ flex: 1, padding: "10px" }}>Close</button>
                <button onClick={() => { setTermsAccepted(true); setShowTerms(false); }} className="btn-prime" style={{ flex: 1.5, padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <Check size={14} /> Accept & continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input::-ms-reveal,input::-ms-clear{display:none}`}</style>
    </div>
  );
}