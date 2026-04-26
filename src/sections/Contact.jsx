import { useRef, useMemo, memo, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

const WHATSAPP_URL = "https://wa.me/2349128218436?text=Hello%20Darwin%2C%20I%20came%20across%20your%20portfolio%20and%20I%27d%20love%20to%20collaborate%20with%20you%20on%20a%20project.%20Let%27s%20build%20something%20remarkable%20together!";
const EMAIL = "fuoseighadarwin@gmail.com";

const EJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const currentYear = new Date().getFullYear();
/* ─── SplitHeader ─── */
const SplitHeader = memo(({ text, style, delay = 0, triggerRef }) => {
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const chars = wrapRef.current.querySelectorAll(".sh-char");
    gsap.set(chars, { yPercent: 110, skewY: 6, opacity: 0 });
    const a = gsap.to(chars, {
      yPercent: 0,
      skewY: 0,
      opacity: 1,
      duration: 0.75,
      ease: "power4.out",
      stagger: 0.032,
      delay,
      scrollTrigger: {
        trigger: triggerRef?.current || wrapRef.current,
        start: "top 92%",
        toggleActions: "play none none reverse",
      },
    });
    return () => {
      if (a.scrollTrigger) a.scrollTrigger.kill();
      a.kill();
    };
  }, [delay, triggerRef]);

  return (
    <span
      ref={wrapRef}
      style={{ display: "block", overflow: "hidden", ...style }}
      aria-label={text}
    >
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="sh-char"
          style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
});
SplitHeader.displayName = "SplitHeader";

const Contact = memo(() => {
  const sectionRef = useRef(null);
  const heroRef    = useRef(null);
  const infoRef    = useRef(null);
  const formRef    = useRef(null);

  const [copied,  setCopied]  = useState(false);
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");
  const [form,    setForm]    = useState({ name: "", email: "", message: "" });

  const currentYear = new Date().getFullYear();

  const isMobile = useMemo(() =>
    typeof window !== "undefined" && window.innerWidth < 768, []
  );

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChange = (e) => {
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setError("");
    try {
      await emailjs.send(
        EJS_SERVICE_ID, EJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message, reply_to: form.email },
        EJS_PUBLIC_KEY
      );
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Something went wrong. Please try WhatsApp or email directly.");
    } finally {
      setSending(false);
    }
  };

  useGSAP(() => {
    if (!sectionRef.current) return;
    const cleanups = [];

    [infoRef, formRef].forEach((ref) => {
      if (!ref.current) return;
      const a = gsap.from(ref.current, {
        y: 30, opacity: 0, duration: 0.8, ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current, start: "top 94%",
          toggleActions: "play none none reverse",
        },
      });
      cleanups.push(a);
    });

    return () => {
      cleanups.forEach((a) => {
        if (a.scrollTrigger) a.scrollTrigger.kill();
        a.kill();
      });
    };
  }, [isMobile]);

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    padding: "12px 0",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "12px",
    letterSpacing: ".04em",
    color: "rgba(255,255,255,0.7)",
    outline: "none",
    resize: "none",
    transition: "border-color 0.2s",
  };

  return (
    <section
      ref={sectionRef}
      id="Contact"
      className="bg-black text-white overflow-hidden"
      style={{ fontFamily: "'IBM Plex Mono', monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400&display=swap');
        .ct-input::placeholder { color: rgba(255,255,255,0.2); }
        .ct-input:focus { border-bottom-color: rgba(229,255,71,0.5) !important; }
        .ct-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 9px; letter-spacing: .18em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding-bottom: 2px;
          transition: color 0.2s, border-color 0.2s;
        }
        .ct-link:hover { color: rgba(255,255,255,0.8); border-color: rgba(255,255,255,0.3); }
        @keyframes ct-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-white/[0.07] lg:px-16">
        <span className="text-[10px] tracking-[.2em] uppercase text-white/25">Contact — Info</span>
        <span className="text-[10px] text-white/15 tracking-[.1em]">FD / {currentYear}</span>
      </div>

      {/* ── Hero heading — split animated ── */}
      <div ref={heroRef} className="px-5 pt-8 pb-6 lg:px-16 lg:pt-14">
        <SplitHeader
          text="Let's"
          triggerRef={heroRef}
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(62px, 17vw, 155px)",
            lineHeight: 0.88,
            color: "#fff",
          }}
        />

        {/* "Work" + "together." inline */}
        <div className="flex flex-wrap items-end gap-4" style={{ overflow: "hidden" }}>
          <SplitHeader
            text="Work"
            delay={0.07}
            triggerRef={heroRef}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(62px, 17vw, 155px)",
              lineHeight: 0.88,
              color: "rgba(255,255,255,0.2)",
              display: "inline-block",
            }}
          />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(10px, 1.3vw, 13px)",
            letterSpacing: ".08em",
            color: "rgba(255,255,255,0.3)",
            paddingBottom: "clamp(8px, 1.5vw, 18px)",
            display: "inline-block",
          }}>
            together.
          </span>
        </div>

        {/* Badge */}
        <div className="mt-4 inline-flex items-center gap-2 border border-white/[0.1] px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e5ff47] animate-pulse flex-shrink-0" />
          <span className="text-[10px] tracking-[.15em] uppercase text-white/40">
            Available for new projects — Lagos, NG
          </span>
        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="overflow-hidden border-y border-white/[0.06] py-3 whitespace-nowrap">
        <div style={{ display: "inline-block", animation: "ct-marquee 18s linear infinite" }}>
          {[
            "Get in touch", "Let's build", "Start a project", "Collaborate",
            "Get in touch", "Let's build", "Start a project", "Collaborate",
          ].map((item, i) => (
            <span key={i} className="inline-block text-[10px] tracking-[.22em] uppercase text-white/15 px-8">
              {item} <span className="text-[#e5ff47] opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 border-b border-white/[0.07]">

        {/* Left — contact info */}
        <div ref={infoRef} className="px-5 py-10 border-b border-white/[0.07] lg:border-b-0 lg:border-r lg:px-16 lg:py-14">
          <div className="mb-8" style={{ fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)" }}>
            Contact info
          </div>

          <div className="mb-8">
            <div style={{ fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: "8px" }}>Email</div>
            <div className="flex items-center gap-3 flex-wrap">
              <span style={{ fontSize: "clamp(13px, 1.8vw, 16px)", letterSpacing: ".02em", color: "rgba(255,255,255,0.75)" }}>{EMAIL}</span>
              <button
                onClick={copyEmail}
                style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: ".14em",
                  textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                  color: copied ? "#e5ff47" : "rgba(255,255,255,0.3)", padding: "4px 10px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div style={{ fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: "8px" }}>Location</div>
            <div style={{ fontSize: "14px", letterSpacing: ".02em", color: "rgba(255,255,255,0.7)" }}>Lagos, Nigeria — WAT (UTC+1)</div>
          </div>

          <div className="mb-10">
            <div style={{ fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: "8px" }}>Response time</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#e5ff47", boxShadow: "0 0 8px rgba(229,255,71,0.6)", flexShrink: 0 }} />
              <span style={{ fontSize: "14px", letterSpacing: ".02em", color: "rgba(255,255,255,0.7)" }}>Usually within 24 hours</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px" }}>
            <div style={{ fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)", marginBottom: "14px" }}>Find me on</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "GitHub",   href: "https://github.com/fDarwin626" },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/fuoseigha-darwin-b29168326/" },
                { label: "WhatsApp", href: WHATSAPP_URL },
              ].map((link) => (
                <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="ct-link">
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div ref={formRef} className="px-5 py-10 lg:px-16 lg:py-14">
          <div style={{ fontSize: "9px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "32px" }}>
            Send a message
          </div>

          {sent ? (
            <div style={{ paddingTop: "40px" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 0.9, color: "#e5ff47", marginBottom: "12px" }}>
                Message sent.
              </div>
              <p style={{ fontSize: "12px", letterSpacing: ".04em", color: "rgba(255,255,255,0.35)", lineHeight: 1.75 }}>
                Thanks for reaching out — I'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  marginTop: "24px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px",
                  letterSpacing: ".16em", textTransform: "uppercase", background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.3)", padding: "8px 16px", cursor: "pointer",
                }}
              >
                Send another →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {[
                { name: "name",    label: "Your name",     type: "text",  placeholder: "Fuoseigha Darwin" },
                { name: "email",   label: "Email address", type: "email", placeholder: "you@example.com" },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.50)", marginBottom: "8px" }}>
                    {f.label}
                  </label>
                  <input
                    name={f.name} type={f.type} value={form[f.name]}
                    onChange={handleChange} placeholder={f.placeholder}
                    className="ct-input" style={inputStyle} required autoComplete="off"
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.50)", marginBottom: "8px" }}>
                  Message
                </label>
                <textarea
                  name="message" value={form.message} onChange={handleChange}
                  placeholder="Hi Darwin, I'd love to collaborate on..."
                  rows={5} className="ct-input" style={{ ...inputStyle, resize: "none" }} required
                />
              </div>

              {error && (
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".04em", color: "#ff6b6b", margin: 0 }}>
                  ✕ {error}
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <button
                  type="submit" disabled={sending}
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".18em",
                    textTransform: "uppercase", background: sending ? "rgba(229,255,71,0.6)" : "#e5ff47",
                    color: "#000", border: "none", padding: "12px 24px",
                    cursor: sending ? "not-allowed" : "pointer", transition: "opacity 0.2s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}
                >
                  {sending ? "Sending..." : "Send message →"}
                </button>
                <span style={{ fontSize: "9px", letterSpacing: ".12em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>or</span>
                <a
                  href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: ".15em",
                    textTransform: "uppercase", background: "#25D366", color: "#000", border: "none",
                    padding: "12px 20px", display: "inline-flex", alignItems: "center", gap: "7px",
                    textDecoration: "none", transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Footer bar ── */}
      <div className="flex justify-between items-center px-5 py-5 lg:px-16">
        <span style={{ fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)" }}>
          © {currentYear} @CoconutStudios
        </span>
        <span style={{ fontSize: "9px", letterSpacing: ".12em", color: "rgba(255,255,255,0.38)" }}>
          Built with ♥ in Lagos
        </span>
      </div>
    </section>
  );
});

Contact.displayName = "Contact";
export default Contact;