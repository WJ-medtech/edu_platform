import { useState, useEffect } from "react";

// ============================================================
// DATA STRUCTURE
// ============================================================
const CURRICULUM = {
  id: "collagen",
  name: "膠原病内科",
  active: true,
  sections: [
    {
      id: "general",
      name: "総論",
      units: [
        { id: "general-1", name: "①免疫系の基本構造と機能" },
        { id: "general-2", name: "②自然免疫と補体系の働き" },
        { id: "general-3", name: "③抗原提示と獲得免疫の活性化" },
      ],
    },
    {
      id: "approach",
      name: "リウマチ性疾患へのアプローチ",
      units: [],
    },
    {
      id: "ra",
      name: "関節リウマチと類縁疾患",
      units: [
        { id: "ra-1", name: "Part1：関節リウマチ、悪性関節リウマチ" },
        { id: "ra-2", name: "Part2：成人発症スチル病、リウマチ性多発筋痛症" },
        { id: "ra-3", name: "Part3：関節リウマチに対する非薬物治療" },
      ],
    },
    {
      id: "sle",
      name: "全身性エリテマトーデスと抗リン脂質抗体症候群",
      units: [
        { id: "sle-1", name: "Part1：全身性エリテマトーデス" },
        { id: "sle-2", name: "Part2：抗リン脂質抗体症候群" },
      ],
    },
    {
      id: "ssc",
      name: "全身性硬化症と混合性結合組織病",
      units: [
        { id: "ssc-1", name: "Part1：全身性硬化症" },
        { id: "ssc-2", name: "Part2：混合性結合組織病" },
      ],
    },
    {
      id: "myositis",
      name: "特発性炎症性筋疾患",
      units: [],
    },
    {
      id: "behcet",
      name: "ベーチェット病",
      units: [],
    },
    {
      id: "sjogren",
      name: "シェーグレン症候群",
      units: [],
    },
    {
      id: "vasculitis",
      name: "血管炎",
      units: [
        { id: "vas-1", name: "Part1：巨細胞性動脈炎、高安動脈炎" },
        { id: "vas-2", name: "Part2：結節性多発動脈炎、ANCA関連血管炎" },
      ],
    },
    {
      id: "spa",
      name: "脊椎性関節炎と類縁疾患",
      units: [
        { id: "spa-1", name: "Part1：脊椎性関節炎総論、強直性脊椎炎" },
        { id: "spa-2", name: "Part2：乾癬性関節炎、反応性関節炎、掌蹠膿疱症性（骨）関節炎" },
      ],
    },
    {
      id: "other",
      name: "その他のリウマチ性疾患",
      units: [
        { id: "other-1", name: "Part1：結晶誘発性関節炎、線維筋痛症" },
        { id: "other-2", name: "Part2：IgG4関連疾患、自己炎症性疾患" },
      ],
    },
    {
      id: "molecular",
      name: "膠原病リウマチ内科における分子標的治療",
      units: [],
    },
  ],
};

const DISABLED_DEPARTMENTS = [
  "循環器内科", "消化器内科", "呼吸器内科", "神経内科",
  "内分泌代謝内科", "腎臓内科", "血液内科", "感染症内科",
];

// ============================================================
// DEMO QUIZ DATA (テンプレート用)
// ============================================================
const DEMO_QUIZ = {
  "general-1": [
    {
      q: "自然免疫の主要なエフェクター細胞として最も適切なのはどれか？",
      options: ["NK細胞", "B細胞", "形質細胞", "記憶T細胞"],
      correct: 0,
      explanation: "NK（ナチュラルキラー）細胞は自然免疫系の代表的なエフェクター細胞で、感染細胞や腫瘍細胞を非特異的に傷害します。B細胞・形質細胞・記憶T細胞は獲得免疫系に属します。",
    },
    {
      q: "MHCクラスIIが提示するペプチドは、主にどのような経路で処理されるか？",
      options: ["エンドソーム/リソソーム経路", "プロテアソーム経路", "ER膜上直接結合", "Golgi装置内加水分解"],
      correct: 0,
      explanation: "細胞外から取り込まれた抗原はエンドソーム・リソソーム内で分解され、MHCクラスII分子に提示されます。これが抗原提示細胞によるCD4+ T細胞の活性化の出発点です。",
    },
  ],
  "ra-1": [
    {
      q: "関節リウマチの診断において、2010年ACR/EULAR分類基準で最低何点以上が必要か？",
      options: ["4点", "5点", "6点", "7点"],
      correct: 2,
      explanation: "2010年ACR/EULAR分類基準では、関節侵襲（0-5点）・血清学（0-3点）・急性期反応物質（0-1点）・罹患期間（0-1点）の合計10点満点中、6点以上で関節リウマチと分類されます。",
    },
  ],
};

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================
const STORAGE_KEY = "med_edu_completion_v1";

function loadCompletion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCompletion(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ============================================================
// ICONS
// ============================================================
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7.5" fill="#10b981" stroke="#10b981"/>
    <path d="M4.5 8L7 10.5L11.5 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="6" width="10" height="7" rx="1.5" fill="#94a3b8"/>
    <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="#94a3b8" strokeWidth="1.4"/>
  </svg>
);

const ChevronRight = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.25s ease" }}>
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 3h5.5c1.1 0 2 .9 2 2v9c0-1.1-.9-2-2-2H3V3z" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="1.3"/>
    <path d="M10.5 3H16v9h-5.5c-1.1 0-2 .9-2 2V5c0-1.1.9-2 2-2z" fill="#6366f1" fillOpacity="0.2" stroke="#6366f1" strokeWidth="1.3"/>
  </svg>
);

// ============================================================
// QUIZ COMPONENT
// ============================================================
function QuizPanel({ unitId, onComplete, completed }) {
  const questions = DEMO_QUIZ[unitId] || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return (
      <div style={{
        background: "rgba(99,102,241,0.08)", border: "1px dashed #6366f1",
        borderRadius: 12, padding: "20px 24px", marginTop: 24, textAlign: "center",
      }}>
        <p style={{ color: "#6366f1", fontSize: 14, margin: 0 }}>
          📋 このユニットのクイズは準備中です。コンテンツ追加後に有効になります。
        </p>
        {!completed && (
          <button onClick={onComplete} style={{
            marginTop: 12, background: "#6366f1", color: "#fff",
            border: "none", borderRadius: 8, padding: "8px 20px",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>
            ✓ 完了としてマーク
          </button>
        )}
      </div>
    );
  }

  const q = questions[current];

  function handleSelect(i) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      if (score + (selected === q.correct ? 1 : 0) === questions.length) {
        onComplete();
      }
    }
  }

  if (done) {
    const finalScore = score;
    const perfect = finalScore === questions.length;
    return (
      <div style={{
        background: perfect ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.08)",
        border: `1px solid ${perfect ? "#10b981" : "#f59e0b"}`,
        borderRadius: 12, padding: "24px", marginTop: 24, textAlign: "center",
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{perfect ? "🎉" : "📖"}</div>
        <p style={{ fontWeight: 700, fontSize: 16, color: perfect ? "#10b981" : "#f59e0b", margin: "0 0 6px" }}>
          {perfect ? "全問正解！ユニット完了" : `${finalScore} / ${questions.length} 正解`}
        </p>
        <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
          {perfect ? "チェックマークが追加されました。" : "もう一度学習して再挑戦してみましょう。"}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "#f8fafc", border: "1px solid #e2e8f0",
      borderRadius: 12, padding: "24px", marginTop: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", letterSpacing: 1 }}>
          QUIZ {current + 1} / {questions.length}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>正解でユニット完了</span>
      </div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", lineHeight: 1.7, marginBottom: 18 }}>
        {q.q}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = "#fff", border = "#e2e8f0", color = "#334155";
          if (answered) {
            if (i === q.correct) { bg = "#d1fae5"; border = "#10b981"; color = "#065f46"; }
            else if (i === selected) { bg = "#fee2e2"; border = "#ef4444"; color = "#7f1d1d"; }
          } else if (selected === i) {
            bg = "#ede9fe"; border = "#6366f1";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{
              background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
              padding: "11px 16px", textAlign: "left", fontSize: 14, color,
              cursor: answered ? "default" : "pointer", fontFamily: "inherit",
              transition: "all 0.15s", lineHeight: 1.5,
            }}>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 8, padding: "12px 16px", marginBottom: 12,
          }}>
            <p style={{ fontSize: 13, color: "#92400e", margin: 0, lineHeight: 1.6 }}>
              💡 {q.explanation}
            </p>
          </div>
          <button onClick={handleNext} style={{
            background: "#6366f1", color: "#fff", border: "none",
            borderRadius: 8, padding: "10px 24px", fontSize: 14,
            cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
          }}>
            {current < questions.length - 1 ? "次の問題 →" : "結果を確認"}
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// UNIT LEARNING VIEW
// ============================================================
function UnitView({ section, unit, onBack, completion, onComplete }) {
  const unitId = unit.id;
  const isCompleted = !!completion[unitId];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 60px" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <button onClick={() => onBack("section")} style={crumbBtn}>膠原病内科</button>
        <span style={{ color: "#cbd5e1" }}>›</span>
        <button onClick={() => onBack("units")} style={crumbBtn}>{section.name}</button>
        <span style={{ color: "#cbd5e1" }}>›</span>
        <span style={{ fontSize: 13, color: "#475569" }}>{unit.name}</span>
      </div>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -20, top: -20, width: 120, height: 120,
          borderRadius: "50%", background: "rgba(255,255,255,0.08)",
        }}/>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "0 0 8px", letterSpacing: 1 }}>
          {section.name.toUpperCase()}
        </p>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 12px", lineHeight: 1.4 }}>
          {unit.name}
        </h2>
        {isCompleted && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.5)",
            borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#6ee7b7",
          }}>
            <CheckIcon /> 完了済み
          </span>
        )}
      </div>

      {/* Content Placeholder */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: 16, padding: "32px", marginBottom: 8,
      }}>
        <div style={{
          background: "#f1f5f9", borderRadius: 8, padding: "48px 32px",
          textAlign: "center", border: "2px dashed #cbd5e1",
        }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
          <p style={{ color: "#64748b", fontSize: 15, fontWeight: 600, margin: "0 0 8px" }}>
            学習コンテンツエリア
          </p>
          <p style={{ color: "#94a3b8", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            PDFから変換した講義資料・図表・解説が<br/>ここに表示されます
          </p>
        </div>

        {/* Example content sections */}
        <div style={{ marginTop: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", borderLeft: "3px solid #6366f1", paddingLeft: 12, marginBottom: 16 }}>
            学習目標
          </h3>
          <ul style={{ color: "#475569", fontSize: 14, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            <li>このユニットの主要概念を説明できる</li>
            <li>臨床的意義を他の疾患と関連づけて考察できる</li>
            <li>診断・治療アプローチの根拠を述べられる</li>
          </ul>
        </div>
      </div>

      {/* Quiz */}
      <QuizPanel unitId={unitId} onComplete={() => onComplete(unitId)} completed={isCompleted} />
    </div>
  );
}

const crumbBtn = {
  background: "none", border: "none", color: "#6366f1", fontSize: 13,
  cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline",
  textDecorationStyle: "dotted",
};

// ============================================================
// SECTION UNITS LIST
// ============================================================
function SectionView({ section, onBack, onSelectUnit, completion }) {
  const totalUnits = section.units.length;
  const completedCount = section.units.filter(u => completion[u.id]).length;
  const pct = totalUnits > 0 ? Math.round((completedCount / totalUnits) * 100) : 0;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
        <button onClick={onBack} style={crumbBtn}>膠原病内科</button>
        <span style={{ color: "#cbd5e1" }}>›</span>
        <span style={{ fontSize: 13, color: "#475569" }}>{section.name}</span>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        borderRadius: 16, padding: "28px 32px", marginBottom: 28,
      }}>
        <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 6px", letterSpacing: 1 }}>膠原病内科</p>
        <h2 style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700, margin: "0 0 20px" }}>
          {section.name}
        </h2>
        {totalUnits > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#94a3b8", fontSize: 13 }}>進捗</span>
              <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>{completedCount} / {totalUnits} 完了</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6 }}>
              <div style={{
                height: 6, borderRadius: 99, width: `${pct}%`,
                background: pct === 100 ? "#10b981" : "#6366f1",
                transition: "width 0.6s ease",
              }}/>
            </div>
          </>
        )}
      </div>

      {totalUnits === 0 ? (
        <div style={{
          background: "#f8fafc", border: "1px dashed #cbd5e1",
          borderRadius: 12, padding: "40px", textAlign: "center",
        }}>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            🚧 このセクションのユニットは準備中です
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {section.units.map((unit, i) => {
            const done = !!completion[unit.id];
            return (
              <button key={unit.id} onClick={() => onSelectUnit(unit)} style={{
                background: "#fff", border: `1.5px solid ${done ? "#10b981" : "#e2e8f0"}`,
                borderRadius: 12, padding: "18px 20px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                transition: "all 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: done ? "#d1fae5" : "#f1f5f9",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: done ? "#10b981" : "#64748b",
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, lineHeight: 1.5 }}>
                    {unit.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {done && <CheckIcon />}
                  <ChevronRight />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PROGRESS RING
// ============================================================
function ProgressRing({ pct, size = 52, stroke = 5 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={pct === 100 ? "#10b981" : "#6366f1"} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
    </svg>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
export default function App() {
  const [view, setView] = useState("dashboard"); // dashboard | section | unit
  const [activeSection, setActiveSection] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null);
  const [completion, setCompletion] = useState(loadCompletion);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => { saveCompletion(completion); }, [completion]);

  function handleCompleteUnit(unitId) {
    setCompletion(prev => ({ ...prev, [unitId]: true }));
  }

  // Global stats
  const allUnits = CURRICULUM.sections.flatMap(s => s.units);
  const totalUnits = allUnits.length;
  const completedTotal = allUnits.filter(u => completion[u.id]).length;
  const globalPct = totalUnits > 0 ? Math.round((completedTotal / totalUnits) * 100) : 0;

  if (view === "unit") {
    return (
      <Shell>
        <UnitView
          section={activeSection} unit={activeUnit}
          onBack={(to) => {
            if (to === "section") { setView("dashboard"); setActiveSection(null); setActiveUnit(null); }
            else { setView("section"); setActiveUnit(null); }
          }}
          completion={completion} onComplete={handleCompleteUnit}
        />
      </Shell>
    );
  }

  if (view === "section") {
    return (
      <Shell>
        <SectionView
          section={activeSection}
          onBack={() => { setView("dashboard"); setActiveSection(null); }}
          onSelectUnit={(unit) => { setActiveUnit(unit); setView("unit"); }}
          completion={completion}
        />
      </Shell>
    );
  }

  // Dashboard
  return (
    <Shell>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Hero Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          borderRadius: 20, padding: "32px 36px", marginBottom: 32,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 20,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <BookIcon />
              <span style={{ color: "#818cf8", fontSize: 12, fontWeight: 700, letterSpacing: 2 }}>
                MEDICAL EDU PLATFORM
              </span>
            </div>
            <h1 style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 800, margin: "0 0 6px", lineHeight: 1.3 }}>
              膠原病・リウマチ内科
            </h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              能動的学習 × Active Recall
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <ProgressRing pct={globalPct} size={64} stroke={6}/>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>{globalPct}% 完了</span>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28,
        }}>
          {[
            { label: "総ユニット数", value: totalUnits, color: "#6366f1" },
            { label: "完了済み", value: completedTotal, color: "#10b981" },
            { label: "残り", value: totalUnits - completedTotal, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "16px 20px", textAlign: "center",
            }}>
              <p style={{ fontSize: 24, fontWeight: 800, color: s.color, margin: "0 0 4px" }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Layer 1: Department Tabs */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 14 }}>
            診療科選択
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button style={{
              background: "#6366f1", color: "#fff", border: "none",
              borderRadius: 99, padding: "8px 18px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              膠原病内科
            </button>
            {DISABLED_DEPARTMENTS.map(d => (
              <button key={d} disabled style={{
                background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0",
                borderRadius: 99, padding: "8px 18px", fontSize: 13,
                cursor: "not-allowed", fontFamily: "inherit", position: "relative",
              }}>
                <LockIcon /> {d}
                <span style={{
                  position: "absolute", top: -6, right: -4,
                  background: "#f1f5f9", border: "1px solid #e2e8f0",
                  borderRadius: 99, padding: "1px 6px", fontSize: 10, color: "#94a3b8",
                }}>準備中</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layer 2+3: Sections with drill-down */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: 2, marginBottom: 14 }}>
            学習セクション
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CURRICULUM.sections.map(section => {
              const sUnits = section.units;
              const sCompleted = sUnits.filter(u => completion[u.id]).length;
              const sPct = sUnits.length > 0 ? Math.round((sCompleted / sUnits.length) * 100) : 0;
              const isExpanded = expandedSection === section.id;

              return (
                <div key={section.id} style={{
                  background: "#fff", border: "1.5px solid #e2e8f0",
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}>
                  {/* Section Header */}
                  <button
                    onClick={() => {
                      if (sUnits.length === 0) {
                        // No units — open section view with placeholder
                        setActiveSection(section);
                        setView("section");
                      } else {
                        setExpandedSection(isExpanded ? null : section.id);
                      }
                    }}
                    style={{
                      width: "100%", background: "none", border: "none",
                      padding: "16px 20px", cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                      {sUnits.length > 0 && sPct === 100 ? (
                        <CheckIcon />
                      ) : (
                        <div style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: sUnits.length === 0 ? "#e2e8f0" : "#6366f1", flexShrink: 0,
                        }}/>
                      )}
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: "#1e293b",
                        textAlign: "left", lineHeight: 1.4,
                      }}>
                        {section.name}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      {sUnits.length > 0 && (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          {sCompleted}/{sUnits.length}
                        </span>
                      )}
                      {sUnits.length === 0 ? (
                        <span style={{
                          fontSize: 11, color: "#94a3b8",
                          background: "#f8fafc", border: "1px solid #e2e8f0",
                          borderRadius: 99, padding: "2px 8px",
                        }}>準備中</span>
                      ) : (
                        <ChevronRight open={isExpanded} />
                      )}
                    </div>
                  </button>

                  {/* Progress bar */}
                  {sUnits.length > 0 && sPct > 0 && (
                    <div style={{ height: 3, background: "#f1f5f9" }}>
                      <div style={{
                        height: 3, width: `${sPct}%`,
                        background: sPct === 100 ? "#10b981" : "#6366f1",
                        transition: "width 0.4s ease",
                      }}/>
                    </div>
                  )}

                  {/* Layer 3: Units */}
                  {isExpanded && sUnits.length > 0 && (
                    <div style={{ borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
                      {sUnits.map((unit, i) => {
                        const done = !!completion[unit.id];
                        return (
                          <button
                            key={unit.id}
                            onClick={() => {
                              setActiveSection(section);
                              setActiveUnit(unit);
                              setView("unit");
                            }}
                            style={{
                              width: "100%", background: "none", border: "none",
                              borderBottom: i < sUnits.length - 1 ? "1px solid #f1f5f9" : "none",
                              padding: "13px 20px 13px 44px",
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              cursor: "pointer", fontFamily: "inherit",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: "50%",
                                background: done ? "#d1fae5" : "#fff",
                                border: `1.5px solid ${done ? "#10b981" : "#e2e8f0"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0,
                              }}>
                                {done && <span style={{ fontSize: 10, color: "#10b981" }}>✓</span>}
                              </div>
                              <span style={{ fontSize: 13, color: done ? "#10b981" : "#475569", textAlign: "left", lineHeight: 1.5 }}>
                                {unit.name}
                              </span>
                            </div>
                            <ChevronRight />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Shell>
  );
}

// ============================================================
// SHELL LAYOUT
// ============================================================
function Shell({ children }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      {/* Top Nav */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e2e8f0",
        padding: "14px 24px", display: "flex", alignItems: "center", gap: 12,
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: "#6366f1",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 14 }}>M</span>
        </div>
        <span style={{ fontWeight: 800, fontSize: 15, color: "#1e293b" }}>
          MedEdu Platform
        </span>
        <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 4 }}>MVP v0.1</span>
      </div>

      <div style={{ padding: "28px 20px" }}>
        {children}
      </div>
    </div>
  );
}
