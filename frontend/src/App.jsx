import { useState, useEffect, useRef } from "react";

// 🔹 SUB-COMPONENT: Handles image switching for each phone card
const PhoneGallery = ({ images, isDetailView, styles }) => {
  const [activeView, setActiveView] = useState("front");

  // Get only the views that have a valid URL
  const availableViews = images ? Object.keys(images).filter((v) => images[v]) : [];

  if (availableViews.length === 0) {
    return (
      <div style={isDetailView ? styles.detailGallery : styles.cardGallery}>
        <img 
          src="https://inventstore.in/wp-content/uploads/2023/04/iPhone_13_Green.webp" 
          alt="placeholder" 
          style={isDetailView ? styles.detailImage : styles.cardImage} 
        />
      </div>
    );
  }

  return (
    <div style={isDetailView ? styles.detailGallery : styles.cardGallery}>
      <img
        src={images[activeView]}
        alt={activeView}
        style={isDetailView ? styles.detailImage : styles.cardImage}
      />
      {availableViews.length > 1 && (
        <div style={styles.viewTabs}>
          {availableViews.map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              style={{
                ...styles.tabBtn,
                borderBottom: activeView === view ? "2px solid #3b82f6" : "none",
                color: activeView === view ? "#3b82f6" : "#666",
              }}
            >
              {view.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { user: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { bot: data }]);
      setHistory((prev) => [
        ...prev,
        { sender: "user", text: userMsg },
        { sender: "bot", text: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { bot: { reply: "⚠️ Connection error." } }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}>📱 MobileExpert <span style={styles.badge}>AI</span></h2>
        <p style={{ fontSize: "0.8rem", opacity: 0.8 }}>Real-time Smartphone Assistant</p>
      </header>

      <div style={styles.chatWindow}>
        {messages.length === 0 && (
          <div style={styles.welcome}>
            <h3>How can I help you today?</h3>
            <p>Try: "Show me phones under 30k" or "Compare iPhone 15 with Galaxy S24"</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={m.user ? styles.userRow : styles.botRow}>
            <div style={m.user ? styles.userBubble : styles.botBubble}>
              {m.user ? (
                m.user
              ) : (
                <>
                  <p style={{ margin: "0 0 10px 0" }}>{m.bot.reply}</p>

                  {/* 🔹 SELECT VARIANT SPEC SHEET */}
                  {m.bot.variant_details && (
                    <div style={styles.variantCard}>
                      <div style={styles.variantHeader}>
                        <span style={styles.variantIcon}>⚙️</span>
                        <div>
                          <div style={styles.variantLabel}>Selected Configuration</div>
                          <div style={styles.variantTitle}>{m.bot.variant_details.model_name}</div>
                        </div>
                      </div>
                      
                      <div style={styles.variantBody}>
                        <div style={styles.variantRow}>
                          <span>RAM</span>
                          <strong>{m.bot.variant_details.selected_ram}</strong>
                        </div>
                        <div style={styles.variantRow}>
                          <span>Storage</span>
                          <strong>{m.bot.variant_details.selected_storage}</strong>
                        </div>
                        <div style={styles.variantRow}>
                          <span>Color</span>
                          <strong>{m.bot.variant_details.color}</strong>
                        </div>
                        <div style={styles.variantRow}>
                          <span>Status</span>
                          <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                            {m.bot.variant_details.availability}
                          </span>
                        </div>
                        <div style={styles.variantPriceRow}>
                          <span>Final Price</span>
                          <span style={styles.variantPrice}>{m.bot.variant_details.exact_price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 🔹 COMPARISON GRID */}
                  {m.bot.comparison_table && m.bot.comparison_table.length > 0 && (
                    <div style={styles.tableWrapper}>
                      <table style={styles.table}>
                        <thead>
                          <tr style={styles.tableHeader}>
                            <th style={{padding: '8px'}}>Feature</th>
                            {m.bot.comparison_table.map((col, idx) => (
                              <th key={idx} style={{padding: '8px'}}>{col.model}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {["display", "battery", "ram", "storage", "rear_camera", "price_range"].map((key) => (
                            <tr key={key} style={styles.tableRow}>
                              <td style={styles.tableLabel}>{key.replace("_", " ").toUpperCase()}</td>
                              {m.bot.comparison_table.map((col, idx) => (
                                <td key={idx} style={{padding: '8px'}}>{col[key]}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 🔹 TECH EXPLANATION CARD */}
                  {m.bot.explanation && (
                    <div style={styles.explanationCard}>
                      <div style={styles.explanationHeader}>
                        <span style={styles.explanationIcon}>💡</span>
                        <div>
                          <div style={styles.explanationLabel}>Tech Glossary</div>
                          <div style={styles.explanationTerm}>{m.bot.explanation.term}</div>
                        </div>
                      </div>
                      <div style={styles.explanationBody}>{m.bot.explanation.definition}</div>
                      {m.bot.explanation.why_it_matters && (
                        <div style={styles.explanationImpact}>
                          <strong>Pro Tip:</strong> {m.bot.explanation.why_it_matters}
                        </div>
                      )}
                    </div>
                  )}


                  {/* 🔹 RECOMMENDATION CARDS */}
                  <div style={styles.cardContainer}>
                    {m.bot.recommendations?.map((p) => {
                      const isDetailView = m.bot.recommendations.length === 1;

                      return (
                        <div key={p.id} style={isDetailView ? styles.detailCard : styles.card}>
                          
                          {/* 📸 IMAGES SECTION */}
                          <PhoneGallery images={p.images} isDetailView={isDetailView} styles={styles} />

                          <div style={styles.cardHeader}>
                            <div>
                              <span style={{ fontSize: '0.8rem', color: '#888' }}>{p.brand}</span>
                              <div style={styles.modelName}>{p.model}</div>
                            </div>
                            {p.highlight_tag && <span style={styles.highlightBadge}>{p.highlight_tag}</span>}
                          </div>
                          
                          <div style={styles.priceTag}>{p.price_range}</div>

                          <div style={isDetailView ? styles.detailSpecsGrid : styles.specsGrid}>
                            <div style={styles.specItem}>
                              <span style={styles.specIcon}>🔋</span>
                              <div>
                                <div style={styles.specLabel}>Battery</div>
                                <div style={styles.specValue}>{p.battery} mAh</div>
                              </div>
                            </div>
                            <div style={styles.specItem}>
                              <span style={styles.specIcon}>📸</span>
                              <div>
                                <div style={styles.specLabel}>Main Camera</div>
                                <div style={styles.specValue}>{p.rear_camera}</div>
                              </div>
                            </div>
                            <div style={styles.specItem}>
                              <span style={styles.specIcon}>📱</span>
                              <div>
                                <div style={styles.specLabel}>Display</div>
                                <div style={styles.specValue}>{p.display}" OLED</div>
                              </div>
                            </div>
                            <div style={styles.specItem}>
                              <span style={styles.specIcon}>📶</span>
                              <div>
                                <div style={styles.specLabel}>Network</div>
                                <div style={styles.specValue}>{p["_5G_enabled"] ? "5G Ready" : "4G LTE"}</div>
                              </div>
                            </div>
                            {isDetailView && p.processor && (
                              <div style={styles.specItem}>
                                <span style={styles.specIcon}>⚙️</span>
                                <div>
                                  <div style={styles.specLabel}>Processor</div>
                                  <div style={styles.specValue}>{p.processor}</div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div style={styles.reasonBox}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '5px' }}>✨ AI EXPERT INSIGHT</div>
                            {p.reason}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={styles.botRow}>
            <div style={styles.botBubble}><div style={styles.loadingText}>AI is analyzing inventory...</div></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your requirement..."
          style={styles.input}
        />
        <button onClick={send} style={styles.button}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  // 🔹 Main Layout & App Container
  container: { 
    maxWidth: "800px", 
    height: "95vh", 
    margin: "10px auto", 
    display: "flex", 
    flexDirection: "column", 
    backgroundColor: "#f4f7f6", 
    fontFamily: "Segoe UI, sans-serif", 
    borderRadius: "15px", 
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
    overflow: "hidden" 
  },
  header: { 
    padding: "20px", 
    backgroundColor: "#1a1a1a", 
    color: "white", 
    textAlign: "center" 
  },
  badge: { 
    backgroundColor: "#3b82f6", 
    padding: "2px 8px", 
    borderRadius: "5px", 
    fontSize: "0.7rem", 
    verticalAlign: "middle" 
  },
  chatWindow: { 
    flex: 1, 
    overflowY: "auto", 
    padding: "20px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "15px" 
  },
  welcome: { 
    textAlign: "center", 
    color: "#666", 
    marginTop: "50px" 
  },

  // 🔹 Chat Bubbles & Rows
  userRow: { display: "flex", justifyContent: "flex-end" },
  botRow: { display: "flex", justifyContent: "flex-start" },
  userBubble: { 
    backgroundColor: "#3b82f6", 
    color: "white", 
    padding: "12px 18px", 
    borderRadius: "18px 18px 2px 18px", 
    maxWidth: "80%" 
  },
  botBubble: { 
    backgroundColor: "white", 
    color: "#333", 
    padding: "15px", 
    borderRadius: "18px 18px 18px 2px", 
    maxWidth: "95%", 
    border: "1px solid #eee",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
  },
  loadingText: { 
    fontSize: "0.9rem", 
    color: "#888", 
    fontStyle: "italic" 
  },

  // 🔹 Input Area
  inputArea: { 
    padding: "20px", 
    backgroundColor: "white", 
    display: "flex", 
    gap: "10px", 
    borderTop: "1px solid #eee" 
  },
  input: { 
    flex: 1, 
    padding: "12px 15px", 
    borderRadius: "25px", 
    border: "1px solid #ddd", 
    outline: "none" 
  },
  button: { 
    padding: "0 25px", 
    borderRadius: "25px", 
    border: "none", 
    backgroundColor: "#1a1a1a", 
    color: "white", 
    cursor: "pointer", 
    fontWeight: "bold" 
  },

  // 🔹 Recommendation Cards (Standard & Elegant Detail)
  cardContainer: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "12px", 
    marginTop: "10px" 
  },
  card: { 
    border: "1px solid #f0f0f0", 
    borderRadius: "12px", 
    padding: "15px", 
    backgroundColor: "#fafafa" 
  },
  detailCard: { 
    border: "none", 
    borderRadius: "20px", 
    padding: "24px", 
    backgroundColor: "#ffffff", 
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)", 
    borderLeft: "5px solid #3b82f6", 
    marginTop: "15px" 
  },
  cardHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  brandName: { 
    fontSize: "0.8rem", 
    textTransform: "uppercase", 
    letterSpacing: "1px", 
    color: "#888" 
  },
  modelName: { 
    fontWeight: "bold", 
    fontSize: "1.2rem", 
    color: "#1a1a1a" 
  },
  highlightBadge: { 
    backgroundColor: "#dcfce7", 
    color: "#166534", 
    padding: "2px 8px", 
    borderRadius: "10px", 
    fontSize: "0.7rem", 
    fontWeight: "bold" 
  },
  priceTag: { 
    color: "#3b82f6", 
    fontWeight: "800", 
    fontSize: "1.1rem", 
    margin: "8px 0" 
  },

  // 🔹 Specs Grid System
  specsGrid: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    fontSize: "0.85rem", 
    gap: "8px", 
    color: "#555" 
  },
  detailSpecsGrid: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "20px", 
    margin: "20px 0", 
    padding: "15px", 
    backgroundColor: "#f8f9fa", 
    borderRadius: "12px" 
  },
  specItem: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px" 
  },
  specIcon: { fontSize: "1.2rem" },
  specLabel: { 
    fontSize: "0.7rem", 
    color: "#888", 
    fontWeight: "bold", 
    textTransform: "uppercase" 
  },
  specValue: { 
    fontSize: "0.9rem", 
    fontWeight: "600", 
    color: "#333" 
  },
  reasonBox: { 
    marginTop: "10px", 
    fontSize: "0.85rem", 
    borderTop: "1px solid #eee", 
    paddingTop: "8px", 
    color: "#444", 
    lineHeight: "1.4" 
  },

  // 🔹 Image Gallery Switcher
  cardGallery: { 
    textAlign: "center", 
    padding: "10px", 
    background: "#fff", 
    borderRadius: "8px", 
    marginBottom: "10px" 
  },
  detailGallery: { 
    textAlign: "center", 
    padding: "20px", 
    background: "linear-gradient(to bottom, #ffffff, #f8f9fa)", 
    borderRadius: "15px", 
    marginBottom: "20px", 
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)" 
  },
  cardImage: { 
    height: "120px", 
    objectFit: "contain", 
    maxWidth: "100%" 
  },
  detailImage: { 
    height: "250px", 
    objectFit: "contain", 
    maxWidth: "100%", 
    filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" 
  },
  viewTabs: { 
    display: "flex", 
    justifyContent: "center", 
    gap: "15px", 
    marginTop: "10px" 
  },
  tabBtn: { 
    background: "none", 
    border: "none", 
    fontSize: "0.65rem", 
    fontWeight: "bold", 
    cursor: "pointer", 
    padding: "5px 0", 
    transition: "0.2s" 
  },

  // 🔹 Comparison Table
  tableWrapper: { 
    overflowX: "auto", 
    margin: "15px 0", 
    borderRadius: "10px", 
    border: "1px solid #eee" 
  },
  table: { 
    width: "100%", 
    borderCollapse: "collapse", 
    fontSize: "0.85rem" 
  },
  tableHeader: { 
    backgroundColor: "#f8f9fa", 
    textAlign: "left" 
  },
  tableRow: { borderTop: "1px solid #eee" },
  tableLabel: { 
    fontWeight: "bold", 
    color: "#666", 
    padding: "10px", 
    backgroundColor: "#fafafa" 
  },

  // 🔹 Tech Glossary Card (Indigo Theme)
  explanationCard: {
    backgroundColor: "#f5f3ff",
    border: "1px solid #ddd6fe",
    borderRadius: "15px",
    padding: "18px",
    marginTop: "10px",
    boxShadow: "0 2px 8px rgba(124, 58, 237, 0.08)",
  },
  explanationHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
  },
  explanationIcon: {
    fontSize: "1.5rem",
    backgroundColor: "white",
    width: "45px",
    height: "45px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  explanationLabel: {
    fontSize: "0.65rem",
    fontWeight: "bold",
    color: "#7c3aed",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  explanationTerm: {
    fontSize: "1.2rem",
    fontWeight: "800",
    color: "#1e1b4b",
  },
  explanationBody: {
    fontSize: "0.95rem",
    lineHeight: "1.5",
    color: "#4338ca",
    marginBottom: "10px",
  },
  explanationImpact: {
    fontSize: "0.85rem",
    color: "#5b21b6",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "8px",
    borderLeft: "4px solid #7c3aed",
  },

  // 🔹 Configuration Spec Sheet (Silver/Slate Theme)
  variantCard: {
    backgroundColor: "#ffffff",
    border: "2px solid #e2e8f0",
    borderRadius: "15px",
    padding: "20px",
    marginTop: "10px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  variantHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "12px",
    marginBottom: "15px",
  },
  variantIcon: {
    fontSize: "1.2rem",
    backgroundColor: "#f8fafc",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  variantLabel: {
    fontSize: "0.65rem",
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  variantTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "#0f172a",
  },
  variantBody: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  variantRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    color: "#475569",
    padding: "4px 0",
    borderBottom: "1px dashed #f1f5f9",
  },
  variantPriceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "2px solid #f1f5f9",
  },
  variantPrice: {
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#1a1a1a",
  },
};
export default App;