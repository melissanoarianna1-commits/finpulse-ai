import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e17",
  bgCard: "#111827",
  bgCardHover: "#1a2235",
  accent: "#3b82f6",
  accentGlow: "rgba(59, 130, 246, 0.15)",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#475569",
  border: "#1e293b",
  borderLight: "#334155",
};

const FONTS = {
  display: "'DM Sans', sans-serif",
  body: "'IBM Plex Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Mock data
const mockPapers = [
  { id: 1, title: "Systemic Risk Propagation in Interbank Networks Under Climate Stress", source: "SSRN", authors: "K. Fischer, M. Bruni", date: "2026-03-01", relevance: 0.96, tags: ["systemic risk", "climate finance", "networks"], summary: "Novel agent-based model simulating climate-driven credit shocks across European interbank networks. Finds non-linear amplification above 2.1°C warming scenarios.", trending: true },
  { id: 2, title: "LLM-Augmented Credit Scoring: Fairness and Interpretability Trade-offs", source: "arXiv", authors: "Y. Chen, R. Patel, S. Okonkwo", date: "2026-02-28", relevance: 0.93, tags: ["credit risk", "LLM", "fairness"], summary: "Proposes a framework for integrating large language models into credit scoring pipelines while maintaining regulatory compliance under EU AI Act constraints.", trending: true },
  { id: 3, title: "Monetary Policy Transmission via Digital Payment Rails", source: "BIS Working Papers", authors: "A. Carstens, J. Frost", date: "2026-02-27", relevance: 0.89, tags: ["monetary policy", "digital payments", "CBDC"], summary: "Empirical analysis of how central bank digital currencies alter the speed and magnitude of interest rate pass-through to retail deposits." },
  { id: 4, title: "Tail Risk Contagion in Decentralized Finance Protocols", source: "Journal of Finance", authors: "L. Barbon, A. Ranaldo", date: "2026-02-26", relevance: 0.87, tags: ["DeFi", "tail risk", "contagion"], summary: "First comprehensive study of liquidation cascades across DeFi lending protocols using on-chain data from 2021-2025." },
  { id: 5, title: "Regulatory Sandboxes and Innovation: A Natural Experiment from the FCA", source: "ECB Working Paper", authors: "D. Vives, P. Bolton", date: "2026-02-25", relevance: 0.84, tags: ["regulation", "fintech", "innovation"], summary: "Causal identification of fintech innovation effects using staggered adoption of regulatory sandboxes across 14 EU jurisdictions." },
  { id: 6, title: "Dynamic Hedge Fund Allocation Under Regime Switching", source: "SSRN", authors: "M. Dahlquist, A. Gomes", date: "2026-02-24", relevance: 0.81, tags: ["hedge funds", "portfolio", "regime switching"], summary: "Bayesian regime-switching model for optimal allocation across hedge fund styles. Demonstrates 140bp annual improvement over static approaches." },
];

const mockNews = [
  { id: 1, title: "ECB Signals March Rate Cut Amid Banking Sector Turbulence", source: "Financial Times", time: "2h ago", sentiment: "negative", impact: "high" },
  { id: 2, title: "Basel IV Implementation Delayed to 2028 for EU Banks", source: "Reuters", time: "4h ago", sentiment: "positive", impact: "high" },
  { id: 3, title: "Deutsche Bank Launches AI-Powered Risk Management Platform", source: "Bloomberg", time: "5h ago", sentiment: "positive", impact: "medium" },
  { id: 4, title: "China PBOC Expands Digital Yuan Cross-Border Settlement", source: "SCMP", time: "7h ago", sentiment: "neutral", impact: "medium" },
  { id: 5, title: "SEC Proposes New Rules for AI-Driven Trading Algorithms", source: "WSJ", time: "9h ago", sentiment: "negative", impact: "high" },
  { id: 6, title: "UK Pension Funds Increase Allocation to Private Credit", source: "The Economist", time: "11h ago", sentiment: "neutral", impact: "low" },
];

const mockTrends = [
  { topic: "Climate Stress Testing", papers: 47, change: +34, momentum: "surging" },
  { topic: "AI Regulation (EU AI Act)", papers: 38, change: +28, momentum: "surging" },
  { topic: "CBDC Cross-Border", papers: 31, change: +15, momentum: "rising" },
  { topic: "DeFi Risk Models", papers: 26, change: +12, momentum: "rising" },
  { topic: "Basel IV Implementation", papers: 22, change: +5, momentum: "steady" },
  { topic: "Quantum Computing in Finance", papers: 14, change: +21, momentum: "surging" },
];

const mockDigest = {
  date: "March 2, 2026",
  papersIngested: 142,
  newsArticles: 87,
  regulatoryUpdates: 6,
  keyInsight: "Significant convergence in literature on climate-financial risk nexus — three major working papers this week from BIS, ECB, and Fed all propose stress testing frameworks. This appears to be coordinated policy groundwork ahead of the June G20 summit.",
  podcastDuration: "12 min",
  podcastReady: true,
};

const chatMessages = [
  { role: "system", content: "FinPulse AI — your research intelligence assistant for Banking & Finance. Ask me about recent papers, trends, or any topic in your domain." },
];

// Components
const GlowDot = ({ color = COLORS.accent, size = 8 }) => (
  <span style={{
    display: "inline-block", width: size, height: size, borderRadius: "50%",
    background: color, boxShadow: `0 0 ${size}px ${color}`, flexShrink: 0,
  }} />
);

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{
    fontSize: 11, fontFamily: FONTS.mono, color, background: `${color}15`,
    border: `1px solid ${color}30`, borderRadius: 4, padding: "2px 8px",
    letterSpacing: 0.5, textTransform: "uppercase", whiteSpace: "nowrap",
  }}>{children}</span>
);

const SentimentDot = ({ sentiment }) => {
  const c = sentiment === "positive" ? COLORS.green : sentiment === "negative" ? COLORS.red : COLORS.textDim;
  return <GlowDot color={c} size={7} />;
};

const RelevanceBar = ({ score }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: 60, height: 4, borderRadius: 2, background: COLORS.border, overflow: "hidden" }}>
      <div style={{
        width: `${score * 100}%`, height: "100%", borderRadius: 2,
        background: score > 0.9 ? COLORS.accent : score > 0.8 ? COLORS.purple : COLORS.textDim,
      }} />
    </div>
    <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>{(score * 100).toFixed(0)}%</span>
  </div>
);

const MomentumBadge = ({ momentum }) => {
  const config = {
    surging: { color: COLORS.green, icon: "▲▲" },
    rising: { color: COLORS.accent, icon: "▲" },
    steady: { color: COLORS.amber, icon: "—" },
  };
  const c = config[momentum] || config.steady;
  return <Badge color={c.color}>{c.icon} {momentum}</Badge>;
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12,
    padding: 20, transition: "all 0.2s ease", cursor: onClick ? "pointer" : "default",
    ...style,
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.borderLight; e.currentTarget.style.background = COLORS.bgCardHover; }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.background = COLORS.bgCard; }}>
    {children}
  </div>
);

const SectionHeader = ({ icon, title, subtitle }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <h2 style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{title}</h2>
    </div>
    {subtitle && <p style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textDim, margin: 0, paddingLeft: 24 }}>{subtitle}</p>}
  </div>
);

// Tabs
const NAV_TABS = [
  { id: "dashboard", label: "Dashboard", icon: "◉" },
  { id: "papers", label: "Papers", icon: "◎" },
  { id: "news", label: "News", icon: "⊕" },
  { id: "trends", label: "Trends", icon: "△" },
  { id: "chat", label: "Ask FinPulse", icon: "⬡" },
  { id: "podcast", label: "Podcast", icon: "▶" },
];

// Dashboard view
const DashboardView = ({ setActiveTab }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {/* Stats row */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
      {[
        { label: "Papers Today", value: mockDigest.papersIngested, icon: "📄", color: COLORS.accent },
        { label: "News Articles", value: mockDigest.newsArticles, icon: "📰", color: COLORS.green },
        { label: "Regulatory Updates", value: mockDigest.regulatoryUpdates, icon: "⚖️", color: COLORS.amber },
        { label: "Podcast Ready", value: mockDigest.podcastDuration, icon: "🎙️", color: COLORS.purple },
      ].map((s, i) => (
        <Card key={i} style={{ textAlign: "center", padding: 16 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
          <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{s.label}</div>
        </Card>
      ))}
    </div>

    {/* Key Insight */}
    <Card style={{ borderLeft: `3px solid ${COLORS.accent}`, background: `linear-gradient(135deg, ${COLORS.bgCard} 0%, ${COLORS.accentGlow} 100%)` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <h3 style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: COLORS.accent, margin: "0 0 8px 0" }}>KEY INSIGHT — {mockDigest.date}</h3>
          <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, margin: 0, lineHeight: 1.6 }}>{mockDigest.keyInsight}</p>
        </div>
      </div>
    </Card>

    {/* Two columns: Top Papers + News */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <SectionHeader icon="🔬" title="Top Papers Today" subtitle="Ranked by relevance to your research" />
        {mockPapers.slice(0, 3).map(p => (
          <Card key={p.id} style={{ marginBottom: 8, padding: 14 }} onClick={() => setActiveTab("papers")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
              <h4 style={{ fontFamily: FONTS.display, fontSize: 13, color: COLORS.text, margin: 0, lineHeight: 1.4, flex: 1 }}>{p.title}</h4>
              {p.trending && <Badge color={COLORS.green}>HOT</Badge>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textDim }}>{p.source} · {p.authors.split(",")[0]} et al.</span>
              <RelevanceBar score={p.relevance} />
            </div>
          </Card>
        ))}
      </div>
      <div>
        <SectionHeader icon="📡" title="Breaking Financial News" subtitle="Sentiment-scored and impact-rated" />
        {mockNews.slice(0, 4).map(n => (
          <Card key={n.id} style={{ marginBottom: 8, padding: 14 }} onClick={() => setActiveTab("news")}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <SentimentDot sentiment={n.sentiment} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontFamily: FONTS.display, fontSize: 13, color: COLORS.text, margin: "0 0 4px 0", lineHeight: 1.4 }}>{n.title}</h4>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: FONTS.body, fontSize: 11, color: COLORS.textDim }}>{n.source} · {n.time}</span>
                  <Badge color={n.impact === "high" ? COLORS.red : n.impact === "medium" ? COLORS.amber : COLORS.textDim}>{n.impact}</Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>

    {/* Trending */}
    <div>
      <SectionHeader icon="📈" title="Trending Research Topics" subtitle="Momentum based on 30-day publication velocity" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {mockTrends.map((t, i) => (
          <Card key={i} style={{ padding: 14, cursor: "pointer" }} onClick={() => setActiveTab("trends")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: FONTS.display, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{t.topic}</span>
              <MomentumBadge momentum={t.momentum} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>{t.papers} papers</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.green }}>+{t.change}% ↑</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Papers view
const PapersView = () => {
  const [expandedId, setExpandedId] = useState(null);
  return (
    <div>
      <SectionHeader icon="📄" title="Research Papers" subtitle={`${mockPapers.length} papers ingested today — sorted by relevance`} />
      {mockPapers.map(p => (
        <Card key={p.id} style={{ marginBottom: 10, padding: 16 }} onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                {p.trending && <GlowDot color={COLORS.green} size={6} />}
                <h3 style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0, lineHeight: 1.4 }}>{p.title}</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <Badge color={COLORS.purple}>{p.source}</Badge>
                <span style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textDim }}>{p.authors}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textDim }}>{p.date}</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tags.map(t => <Badge key={t} color={COLORS.textMuted}>{t}</Badge>)}
              </div>
            </div>
            <RelevanceBar score={p.relevance} />
          </div>
          {expandedId === p.id && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
              <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{p.summary}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

// News view
const NewsView = () => (
  <div>
    <SectionHeader icon="📰" title="Financial News Feed" subtitle="Real-time news with AI-generated sentiment and impact scoring" />
    {mockNews.map(n => (
      <Card key={n.id} style={{ marginBottom: 10, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, paddingTop: 2 }}>
            <SentimentDot sentiment={n.sentiment} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textDim, textTransform: "uppercase" }}>{n.sentiment}</span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 6px 0" }}>{n.title}</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textDim }}>{n.source}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textDim }}>{n.time}</span>
              <Badge color={n.impact === "high" ? COLORS.red : n.impact === "medium" ? COLORS.amber : COLORS.textDim}>
                {n.impact} impact
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

// Trends view
const TrendsView = () => (
  <div>
    <SectionHeader icon="📈" title="Research Trend Radar" subtitle="Emerging topics detected by anomaly detection on publication velocity" />
    {mockTrends.map((t, i) => (
      <Card key={i} style={{ marginBottom: 10, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: FONTS.display, fontSize: 17, fontWeight: 700, color: COLORS.text }}>{t.topic}</span>
            <MomentumBadge momentum={t.momentum} />
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700, color: COLORS.green }}>+{t.change}%</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: COLORS.border, overflow: "hidden" }}>
            <div style={{
              width: `${Math.min(t.papers * 2, 100)}%`, height: "100%", borderRadius: 3,
              background: t.momentum === "surging" ? `linear-gradient(90deg, ${COLORS.green}, ${COLORS.accent})` : t.momentum === "rising" ? COLORS.accent : COLORS.textDim,
              transition: "width 0.8s ease",
            }} />
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.textMuted, whiteSpace: "nowrap" }}>{t.papers} papers (30d)</span>
        </div>
      </Card>
    ))}
  </div>
);

// Chat view
const ChatView = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to FinPulse AI. I have access to 142 papers, 87 news articles, and 6 regulatory updates ingested today. What would you like to explore?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const exampleQueries = [
    "What are the latest papers on climate stress testing for banks?",
    "Summarize today's key regulatory developments",
    "How has DeFi risk modeling evolved in the last month?",
    "Any new working papers on CBDC monetary policy transmission?",
  ];

  const handleSend = (text) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      let response = "";
      if (q.toLowerCase().includes("climate") || q.toLowerCase().includes("stress")) {
        response = "Great question — climate stress testing is one of today's hottest topics (+34% publication velocity). The standout paper today is **Fischer & Bruni (2026)** on SSRN, proposing an agent-based model for climate-driven credit shocks in interbank networks. They find non-linear amplification above 2.1°C scenarios. This builds on last week's BIS Working Paper by Carstens & Frost on monetary policy via digital rails. I'm also tracking the upcoming G20 coordination on climate-financial frameworks — three major central banks released aligned stress testing proposals this week. Want me to pull up all related papers from the last 30 days?";
      } else if (q.toLowerCase().includes("regulatory") || q.toLowerCase().includes("regulation")) {
        response = "Today's 6 regulatory updates break down as follows: The biggest news is **Basel IV implementation delayed to 2028** for EU banks (Reuters, 4h ago). Also notable: the **SEC proposed new rules** for AI-driven trading algorithms (WSJ, 9h ago). On the academic side, Vives & Bolton's ECB Working Paper analyzes the causal effect of regulatory sandboxes on fintech innovation across 14 EU jurisdictions — very relevant if you're looking at the regulation-innovation trade-off in your PhD.";
      } else if (q.toLowerCase().includes("defi") || q.toLowerCase().includes("decentralized")) {
        response = "DeFi risk modeling is trending (+12% momentum). Today's key paper is **Barbon & Ranaldo (2026)** in the Journal of Finance — the first comprehensive study of liquidation cascades across DeFi lending protocols using on-chain data from 2021-2025. This is significant because it's one of the first peer-reviewed (not just working paper) contributions to DeFi systemic risk. Compared to last month, I'm seeing a shift from purely descriptive DeFi analytics toward formal tail-risk models borrowed from traditional finance.";
      } else {
        response = `I searched across today's 142 papers and 87 news articles for "${q}". Here are the most relevant findings:\n\n• Several papers this week touch on related themes, particularly in the intersection of AI and financial regulation.\n• The Chen, Patel & Okonkwo (2026) paper on LLM-augmented credit scoring is particularly relevant — it addresses fairness and interpretability under the EU AI Act.\n• On the news side, Deutsche Bank's launch of an AI-powered risk management platform (Bloomberg, 5h ago) provides an industry context.\n\nWould you like me to go deeper on any of these, or search the knowledge base for a more specific angle?`;
      }
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" }}>
      <SectionHeader icon="⬡" title="Ask FinPulse" subtitle="Chat with your research knowledge base" />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", paddingRight: 8, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12,
          }}>
            <div style={{
              maxWidth: "80%", padding: "12px 16px", borderRadius: 12,
              background: m.role === "user" ? COLORS.accent : COLORS.bgCard,
              border: m.role === "user" ? "none" : `1px solid ${COLORS.border}`,
              color: COLORS.text, fontFamily: FONTS.body, fontSize: 13, lineHeight: 1.7,
              whiteSpace: "pre-wrap",
            }}>
              {m.content.split("**").map((part, j) =>
                j % 2 === 1 ? <strong key={j} style={{ color: COLORS.accent }}>{part}</strong> : <span key={j}>{part}</span>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
            <div style={{ padding: "12px 16px", borderRadius: 12, background: COLORS.bgCard, border: `1px solid ${COLORS.border}` }}>
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.textDim, animation: "pulse 1.5s infinite" }}>● ● ●</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Example queries */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {exampleQueries.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} style={{
              fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, background: COLORS.bgCard,
              border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "6px 14px", cursor: "pointer",
              transition: "all 0.2s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.target.style.borderColor = COLORS.accent; e.target.style.color = COLORS.accent; }}
            onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}>
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ask about papers, trends, news, or any topic..."
          style={{
            flex: 1, fontFamily: FONTS.body, fontSize: 14, color: COLORS.text,
            background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10,
            padding: "12px 16px", outline: "none",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.accent}
          onBlur={e => e.target.style.borderColor = COLORS.border}
        />
        <button onClick={() => handleSend()} style={{
          fontFamily: FONTS.display, fontSize: 14, fontWeight: 600, color: "#fff",
          background: COLORS.accent, border: "none", borderRadius: 10, padding: "12px 24px",
          cursor: "pointer", transition: "opacity 0.2s",
        }}
        onMouseEnter={e => e.target.style.opacity = 0.85}
        onMouseLeave={e => e.target.style.opacity = 1}>
          Send
        </button>
      </div>
    </div>
  );
};

// Podcast view
const PodcastView = () => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => setProgress(p => p >= 100 ? (setPlaying(false), 0) : p + 0.3), 100);
    return () => clearInterval(interval);
  }, [playing]);

  const transcript = [
    { time: "0:00", text: "Good morning. Today's FinPulse briefing covers 142 new papers and 87 news articles in banking and finance." },
    { time: "0:45", text: "The headline story: climate stress testing is surging in the literature, with a 34% increase in publication velocity. Fischer and Bruni's new SSRN paper proposes an agent-based model showing non-linear credit shock amplification above 2.1°C warming scenarios." },
    { time: "2:30", text: "In regulatory news, Basel IV implementation has been delayed to 2028 for EU banks. Meanwhile, the SEC is proposing new rules for AI-driven trading algorithms." },
    { time: "4:15", text: "A significant contribution from Chen, Patel, and Okonkwo on arXiv addresses how to integrate large language models into credit scoring while meeting EU AI Act requirements." },
    { time: "6:00", text: "In the DeFi space, Barbon and Ranaldo's paper in the Journal of Finance provides the first comprehensive peer-reviewed study of liquidation cascades across lending protocols." },
    { time: "8:30", text: "Looking at the trend radar: quantum computing applications in finance saw a 21% surge this month, making it the fastest-growing niche topic. Most papers focus on portfolio optimization and risk simulation." },
    { time: "10:30", text: "Key insight for today: three major central banks — the BIS, ECB, and Fed — all released aligned climate stress testing frameworks this week. This appears to be coordinated groundwork ahead of the June G20 summit. Worth tracking closely for your research." },
  ];

  return (
    <div>
      <SectionHeader icon="🎙️" title="Daily Research Podcast" subtitle={`${mockDigest.date} — ${mockDigest.podcastDuration} briefing`} />

      {/* Player */}
      <Card style={{ marginBottom: 20, borderLeft: `3px solid ${COLORS.purple}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <button onClick={() => setPlaying(!playing)} style={{
            width: 52, height: 52, borderRadius: "50%", border: "none",
            background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.accent})`,
            color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 20px ${COLORS.purple}40`,
          }}>
            {playing ? "⏸" : "▶"}
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 4px 0" }}>
              FinPulse Daily Briefing
            </h3>
            <p style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.textMuted, margin: 0 }}>
              {mockDigest.date} · {mockDigest.papersIngested} papers · {mockDigest.newsArticles} articles · {mockDigest.regulatoryUpdates} regulatory updates
            </p>
          </div>
          <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.textDim }}>{mockDigest.podcastDuration}</span>
        </div>
        {/* Progress bar */}
        <div style={{ width: "100%", height: 4, borderRadius: 2, background: COLORS.border, overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%", borderRadius: 2,
            background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.accent})`,
            transition: "width 0.1s linear",
          }} />
        </div>
      </Card>

      {/* Transcript */}
      <SectionHeader icon="📝" title="Transcript" subtitle="AI-generated summary of today's key developments" />
      {transcript.map((t, i) => (
        <Card key={i} style={{ marginBottom: 8, padding: 14 }}>
          <div style={{ display: "flex", gap: 14 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.purple, whiteSpace: "nowrap", paddingTop: 2 }}>{t.time}</span>
            <p style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.text, lineHeight: 1.7, margin: 0 }}>{t.text}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Main App
export default function FinPulseApp() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardView setActiveTab={setActiveTab} />;
      case "papers": return <PapersView />;
      case "news": return <NewsView />;
      case "trends": return <TrendsView />;
      case "chat": return <ChatView />;
      case "podcast": return <PodcastView />;
      default: return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: FONTS.body, color: COLORS.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.borderLight}; border-radius: 3px; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px", borderBottom: `1px solid ${COLORS.border}`,
        background: `linear-gradient(180deg, ${COLORS.bgCard} 0%, ${COLORS.bg} 100%)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: FONTS.display,
            boxShadow: `0 0 16px ${COLORS.accent}40`,
          }}>F</div>
          <div>
            <h1 style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: COLORS.text, lineHeight: 1 }}>FinPulse AI</h1>
            <p style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textDim, marginTop: 2 }}>Banking & Finance Research Intelligence</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GlowDot color={COLORS.green} size={7} />
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.green }}>LIVE</span>
          <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.textDim, marginLeft: 8 }}>{mockDigest.date}</span>
        </div>
      </div>

      {/* Nav */}
      <div style={{
        display: "flex", gap: 2, padding: "8px 28px",
        borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bg,
      }}>
        {NAV_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            fontFamily: FONTS.display, fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? COLORS.accent : COLORS.textDim,
            background: activeTab === tab.id ? COLORS.accentGlow : "transparent",
            border: `1px solid ${activeTab === tab.id ? COLORS.accent + "40" : "transparent"}`,
            borderRadius: 8, padding: "8px 16px", cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
          onMouseEnter={e => { if (activeTab !== tab.id) e.target.style.color = COLORS.text; }}
          onMouseLeave={e => { if (activeTab !== tab.id) e.target.style.color = COLORS.textDim; }}>
            <span style={{ fontSize: 12 }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 28px", maxWidth: 1100, margin: "0 auto" }}>
        {renderContent()}
      </div>
    </div>
  );
}
