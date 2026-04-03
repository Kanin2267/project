import React, { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

const LEVELS = [
  {
    id: 1,
    title: "ด่าน 1: หัวข้อเว็บไซต์",
    difficulty: "ง่าย",
    timeLimit: 90,
    goal: "ลากบล็อกให้เป็นหัวข้อ h1 ที่แสดงคำว่า Hello Web",
    hint: "เรียงเป็นแท็กเปิด → ข้อความ → แท็กปิด",
    blocks: ["<h1>", "Hello Web", "</h1>"],
    answer: ["<h1>", "Hello Web", "</h1>"],
  },
  {
    id: 2,
    title: "ด่าน 2: ย่อหน้าและสี",
    difficulty: "ง่าย",
    timeLimit: 90,
    goal: "ลากบล็อกให้ได้ย่อหน้า CSS Basics และทำตัวอักษรสีน้ำเงิน",
    hint: "วาง style ก่อน แล้วตามด้วย p",
    blocks: ["<style>", "p { color: blue; }", "</style>", "<p>CSS Basics</p>"],
    answer: ["<style>", "p { color: blue; }", "</style>", "<p>CSS Basics</p>"],
  },
  {
    id: 3,
    title: "ด่าน 3: ปุ่มเริ่มต้น",
    difficulty: "ง่าย",
    timeLimit: 90,
    goal: "ลากบล็อกให้ได้ปุ่ม Start พื้นหลังสีเขียว",
    hint: "วาง CSS ของปุ่มก่อน แล้วตามด้วยปุ่ม",
    blocks: ["<style>", "button { background-color: green; }", "</style>", "<button>Start</button>"],
    answer: ["<style>", "button { background-color: green; }", "</style>", "<button>Start</button>"],
  },
  {
    id: 4,
    title: "ด่าน 4: ลิงก์เชื่อมโยง",
    difficulty: "ง่าย",
    timeLimit: 90,
    goal: "สร้างลิงก์ไปที่ https://example.com ข้อความว่า Click Here",
    hint: "ใช้แท็ก a พร้อม href attribute",
    blocks: ['<a href="https://example.com">', "Click Here", "</a>"],
    answer: ['<a href="https://example.com">', "Click Here", "</a>"],
  },
  {
    id: 5,
    title: "ด่าน 5: รูปภาพ",
    difficulty: "ปานกลาง",
    timeLimit: 100,
    goal: "แสดงรูปภาพจาก https://picsum.photos/200/150",
    hint: "ใช้แท็ก img พร้อม src attribute",
    blocks: ['<img src="https://picsum.photos/200/150" alt="Sample Image">'],
    answer: ['<img src="https://picsum.photos/200/150" alt="Sample Image">'],
  },
  {
    id: 6,
    title: "ด่าน 6: รายการสิ่งของ",
    difficulty: "ปานกลาง",
    timeLimit: 100,
    goal: "สร้างรายการแบบลำดับ: แอปเปิ้ล, กล้วย, ส้ม",
    hint: "ใช้ ul และ li ในการสร้างรายการ",
    blocks: ["<ul>", "<li>แอปเปิ้ล</li>", "<li>กล้วย</li>", "<li>ส้ม</li>", "</ul>"],
    answer: ["<ul>", "<li>แอปเปิ้ล</li>", "<li>กล้วย</li>", "<li>ส้ม</li>", "</ul>"],
  },
  {
    id: 7,
    title: "ด่าน 7: ตารางข้อมูล",
    difficulty: "ปานกลาง",
    timeLimit: 110,
    goal: "สร้างตาราง 2x2 แสดง Name และ Age",
    hint: "ใช้ table, tr, td ในการสร้างตาราง",
    blocks: ["<table border='1'>", "<tr>", "<td>Name</td>", "<td>Age</td>", "</tr>", "<tr>", "<td>John</td>", "<td>25</td>", "</tr>", "</table>"],
    answer: ["<table border='1'>", "<tr>", "<td>Name</td>", "<td>Age</td>", "</tr>", "<tr>", "<td>John</td>", "<td>25</td>", "</tr>", "</table>"],
  },
  {
    id: 8,
    title: "ด่าน 8: ฟอร์มพื้นฐาน",
    difficulty: "ยาก",
    timeLimit: 110,
    goal: "สร้างฟอร์มที่มีช่องกรอกชื่อและปุ่ม Submit",
    hint: "ใช้ form, input, button",
    blocks: ["<form>", "<input type='text' placeholder='ชื่อของคุณ'>", "<button type='submit'>", "Submit", "</button>", "</form>"],
    answer: ["<form>", "<input type='text' placeholder='ชื่อของคุณ'>", "<button type='submit'>", "Submit", "</button>", "</form>"],
  },
  {
    id: 9,
    title: "ด่าน 9: การ์ด CSS",
    difficulty: "ยาก",
    timeLimit: 120,
    goal: "สร้างการ์ดที่มีพื้นหลังสีเทา, ขอบมน, และ padding",
    hint: "ใช้ div และ CSS properties: background, border-radius, padding",
    blocks: ["<style>", ".card { background: #f0f0f0; border-radius: 10px; padding: 20px; }", "</style>", "<div class='card'>", "เนื้อหาในการ์ด", "</div>"],
    answer: ["<style>", ".card { background: #f0f0f0; border-radius: 10px; padding: 20px; }", "</style>", "<div class='card'>", "เนื้อหาในการ์ด", "</div>"],
  },
  {
    id: 10,
    title: "ด่าน 10: ปุ่ม CSS Hover",
    difficulty: "ยาก",
    timeLimit: 120,
    goal: "สร้างปุ่มที่มีพื้นหลังสีฟ้า และเมื่อ hover เปลี่ยนเป็นสีเขียว",
    hint: "ใช้ CSS pseudo-class :hover",
    blocks: ["<style>", ".btn { background: blue; color: white; padding: 10px 20px; border: none; cursor: pointer; }", ".btn:hover { background: green; }", "</style>", "<button class='btn'>", "Hover Me", "</button>"],
    answer: ["<style>", ".btn { background: blue; color: white; padding: 10px 20px; border: none; cursor: pointer; }", ".btn:hover { background: green; }", "</style>", "<button class='btn'>", "Hover Me", "</button>"],
  },
];

function buildPreview(code) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>body{font-family:Arial,sans-serif;padding:16px;margin:0;}</style>
</head>
<body>
${code}
</body>
</html>`;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBlockType(block) {
  const s = block.trim();
  if (
    s.startsWith("<style") ||
    s.startsWith("</style") ||
    s.includes("{") ||
    s.includes("color:") ||
    s.includes("background") ||
    s.includes("border:") ||
    s.includes("border-radius") ||
    s.includes("padding") ||
    s.includes("cursor")
  ) {
    return "css";
  }
  if (s.startsWith("<") || s.startsWith("</")) {
    return "html";
  }
  return "text";
}

function getBlockStyle(block, active = false) {
  const type = getBlockType(block);
  const map = {
    html: {
      bg: active ? "#dbeafe" : "#eff6ff",
      border: "#60a5fa",
      text: "#111827",
    },
    css: {
      bg: active ? "#dcfce7" : "#f0fdf4",
      border: "#4ade80",
      text: "#111827",
    },
    text: {
      bg: active ? "#fef3c7" : "#fffbeb",
      border: "#f59e0b",
      text: "#111827",
    },
  };
  return map[type];
}

function moveItem(list, fromIndex, toIndex) {
  const copy = [...list];
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

const animationStyle = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(255,0,0,0.5); }
  50% { box-shadow: 0 0 20px rgba(255,0,0,0.8); }
}
`;

export default function App() {
  const [page, setPage] = useState("intro");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNo, setStudentNo] = useState("");

  const [currentLevel, setCurrentLevel] = useState(0);
  const [pool, setPool] = useState(shuffle(LEVELS[0].blocks));
  const [workspace, setWorkspace] = useState([]);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(LEVELS[0].timeLimit);
  const [message, setMessage] = useState("ลากบล็อกมาวางในพื้นที่ต่อบล็อก");
  const [feedback, setFeedback] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [status, setStatus] = useState("playing");
  const [completedLevels, setCompletedLevels] = useState([]);
  const [dropIndex, setDropIndex] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [dragItem, setDragItem] = useState(null);
  const [isDropping, setIsDropping] = useState(false);

  const timerRef = useRef(null);
  const errorTimeoutRef = useRef(null);
  const successTimeoutRef = useRef(null);

  const level = LEVELS[currentLevel];
  const fullName = `${firstName} ${lastName}`.trim();

  const codeText = useMemo(() => workspace.join("\n"), [workspace]);
  const previewDoc = useMemo(() => buildPreview(codeText), [codeText]);

  useEffect(() => {
    const raw = localStorage.getItem("blockly-like-rank");
    if (raw) {
      try {
        setLeaderboard(JSON.parse(raw));
      } catch {
        setLeaderboard([]);
      }
    }
  }, []);

  useEffect(() => {
    if (page !== "game" || status !== "playing") return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStatus("timeout");
          setMessage("หมดเวลา");
          showErrorNotification("หมดเวลา! กรุณาเริ่มใหม่");
          saveRank(score, completedLevels.length, "หมดเวลา");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [page, status, currentLevel, score, completedLevels.length]);

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    };
  }, []);

  function showErrorNotification(msg) {
    setErrorMessage(msg);
    setShowError(true);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    errorTimeoutRef.current = setTimeout(() => {
      setShowError(false);
    }, 3000);
  }

  function showSuccessNotification(msg) {
    setErrorMessage(msg);
    setShowSuccess(true);
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    successTimeoutRef.current = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }

  function startGame() {
    if (!firstName.trim() || !lastName.trim() || !studentNo.trim()) {
      showErrorNotification("กรุณากรอกชื่อ นามสกุล และเลขที่");
      return;
    }
    setPage("game");
    setCurrentLevel(0);
    setPool(shuffle(LEVELS[0].blocks));
    setWorkspace([]);
    setScore(0);
    setSecondsLeft(LEVELS[0].timeLimit);
    setMessage("ลากบล็อกมาวางในพื้นที่ต่อบล็อก");
    setFeedback([]);
    setStatus("playing");
    setCompletedLevels([]);
  }

  function resetGame() {
    clearInterval(timerRef.current);
    setPage("intro");
    setCurrentLevel(0);
    setPool(shuffle(LEVELS[0].blocks));
    setWorkspace([]);
    setScore(0);
    setSecondsLeft(LEVELS[0].timeLimit);
    setMessage("ลากบล็อกมาวางในพื้นที่ต่อบล็อก");
    setFeedback([]);
    setStatus("playing");
    setCompletedLevels([]);
    setDragItem(null);
    setDropIndex(null);
  }

  function nextLevel(nextScore) {
    if (currentLevel === LEVELS.length - 1) {
      setStatus("won");
      setMessage("ยินดีด้วย คุณผ่านครบทุกด่านแล้ว");
      showSuccessNotification("🎉 ยินดีด้วย! คุณเป็นผู้ชนะ 🎉");
      saveRank(nextScore, LEVELS.length, "ผ่านครบทุกด่าน");
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.65 } });
      return;
    }

    const nextIndex = currentLevel + 1;
    setCurrentLevel(nextIndex);
    setPool(shuffle(LEVELS[nextIndex].blocks));
    setWorkspace([]);
    setSecondsLeft(LEVELS[nextIndex].timeLimit);
    setMessage(`ผ่านแล้ว! ไปต่อด่าน ${nextIndex + 1}`);
    showSuccessNotification(`✅ ผ่านด่าน ${currentLevel + 1}! ไปด่าน ${nextIndex + 1}`);
    setFeedback([]);
    setDropIndex(null);
    setDragItem(null);
  }

  function checkAnswer() {
    const ok = JSON.stringify(workspace) === JSON.stringify(level.answer);
    if (!ok) {
      setMessage("ลำดับบล็อกยังไม่ถูกต้อง");
      setFeedback([level.hint]);
      showErrorNotification(`❌ ไม่ถูกต้อง! ${level.hint}`);
      
      // ทำให้พื้นที่ workspace สั่นเพื่อเตือน
      const workspaceElement = document.querySelector('.answerZone');
      if (workspaceElement) {
        workspaceElement.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
          workspaceElement.style.animation = '';
        }, 500);
      }
      return;
    }

    const timeBonus = Math.max(10, secondsLeft);
    const nextScore = score + 100 + timeBonus;
    setScore(nextScore);
    setCompletedLevels((prev) => [...prev, level.id]);
    setMessage(`ผ่านด่าน ${level.id} สำเร็จ! ได้ ${100 + timeBonus} คะแนน`);
    setFeedback([`🎉 ได้ ${100 + timeBonus} คะแนน (${timeBonus} คะแนนโบนัสเวลา)`]);
    showSuccessNotification(`🎉 ผ่านด่าน ${level.id}! ได้ ${100 + timeBonus} คะแนน 🎉`);
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    nextLevel(nextScore);
  }

  function saveRank(finalScore, levelsPassed, result) {
    const entry = {
      id: Date.now(),
      name: fullName,
      no: studentNo,
      score: finalScore,
      levelsPassed,
      result,
    };
    const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem("blockly-like-rank", JSON.stringify(updated));
  }

  function onDragStart(source, index) {
    if (status !== "playing") return;
    setDragItem({ source, index });
  }

  function onDragEnd() {
    setDragItem(null);
    setDropIndex(null);
  }

  function handleWorkspaceDrop(insertAt) {
    if (!dragItem || isDropping || status !== "playing") return;
    setIsDropping(true);

    const { source, index } = dragItem;

    if (source === "pool") {
      const item = pool[index];
      if (!item) {
        setIsDropping(false);
        return;
      }
      
      setPool((prevPool) => prevPool.filter((_, i) => i !== index));
      setWorkspace((prevWs) => {
        const safeIndex = Math.min(Math.max(insertAt, 0), prevWs.length);
        const nextWs = [...prevWs];
        nextWs.splice(safeIndex, 0, item);
        return nextWs;
      });
    }

    if (source === "workspace") {
      setWorkspace((prevWs) => {
        if (index < 0 || index >= prevWs.length) return prevWs;
        let safeIndex = Math.min(Math.max(insertAt, 0), prevWs.length);
        if (index < safeIndex) safeIndex -= 1;
        return moveItem(prevWs, index, safeIndex);
      });
    }

    setDragItem(null);
    setDropIndex(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  function handlePoolDrop() {
    if (!dragItem || isDropping || status !== "playing") return;
    if (dragItem.source !== "workspace") return;

    setIsDropping(true);

    setWorkspace((prevWs) => {
      if (dragItem.index < 0 || dragItem.index >= prevWs.length) return prevWs;
      const item = prevWs[dragItem.index];
      const nextWs = prevWs.filter((_, i) => i !== dragItem.index);
      setPool((prevPool) => [...prevPool, item]);
      return nextWs;
    });

    setDragItem(null);
    setDropIndex(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  if (page === "intro") {
    return (
      <>
        <style>{animationStyle}</style>
        <div style={styles.appBg}>
          <div style={styles.heroContainer}>
            <div style={styles.floatingOrbs}>
              <div style={styles.orb1}></div>
              <div style={styles.orb2}></div>
              <div style={styles.orb3}></div>
              <div style={styles.orb4}></div>
            </div>
            
            <div style={styles.heroContent}>
              <div style={styles.heroLeft}>
                <div style={styles.logoWrapper}>
                  <div style={styles.logoBubble}>
                    <span style={styles.logoText}>&lt;/&gt;</span>
                  </div>
                  <div style={styles.logoBadge}>🎮 Coding Game</div>
                </div>
                <h1 style={styles.mainTitle}>
                  HTML & CSS<br />
                  <span style={styles.gradientText}>Blockly-Like Game</span>
                </h1>
                <div style={styles.featureGrid}>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>🧩</span>
                    <span>10 ด่าน ท้าทาย</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>👁️</span>
                    <span>แสดงผล Real-time</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>🎯</span>
                    <span>จากง่ายไปยาก</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>🏆</span>
                    <span>ลีดเดอร์บอร์ด</span>
                  </div>
                </div>
                <div style={styles.statsBar}>
                  <div style={styles.statItem}>
                    <span style={styles.statNumber}>10</span>
                    <span style={styles.statLabel}>ด่านการเรียนรู้</span>
                  </div>
                  <div style={styles.statDivider}></div>
                  <div style={styles.statItem}>
                    <span style={styles.statNumber}>90-120</span>
                    <span style={styles.statLabel}>วินาทีต่อด่าน</span>
                  </div>
                  <div style={styles.statDivider}></div>
                  <div style={styles.statItem}>
                    <span style={styles.statNumber}>100%</span>
                    <span style={styles.statLabel}>คะแนนสะสม</span>
                  </div>
                </div>
              </div>

              <div style={styles.formCard}>
                <div style={styles.formHeader}>
                  <div style={styles.formIcon}>👋</div>
                  <h2 style={styles.formTitle}>เริ่มการผจญภัย</h2>
                  <p style={styles.formSubtitle}>กรอกข้อมูลเพื่อเริ่มเล่น</p>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>ชื่อจริง</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="เช่น สมชาย"
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>นามสกุล</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="เช่น ใจดี"
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>เลขที่</label>
                  <input
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                    placeholder="เลขที่ในห้องเรียน"
                    style={styles.input}
                  />
                </div>
                <button onClick={startGame} style={styles.startBtn}>
                  <span>🚀</span> เริ่มเล่นเลย!
                </button>
                <div style={styles.formFooter}>
                  <span style={styles.footerIcon}>💡</span>
                  <span>ลากบล็อกไปวางในพื้นที่ทำงาน เรียงให้ถูกต้อง</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{animationStyle}</style>
      <div style={styles.gameBg}>
        {showError && (
          <div style={styles.errorNotification}>
            <span style={styles.errorIcon}>⚠️</span>
            {errorMessage}
          </div>
        )}
        {showSuccess && (
          <div style={styles.successNotification}>
            <span style={styles.successIcon}>🎉</span>
            {errorMessage}
          </div>
        )}
        
        <div style={styles.gameShell}>
          <div style={styles.topBar}>
            <div>
              <div style={styles.playerName}>
                {fullName} <span style={styles.noBadge}>เลขที่ {studentNo}</span>
              </div>
              <div style={styles.smallText}>🎮 ลากวางแบบ Blockly</div>
            </div>
            <div style={styles.topStats}>
              <div style={styles.statPill}>⭐ คะแนน {score}</div>
              <div style={styles.statPill}>⏱️ เวลา {secondsLeft}s</div>
              <div style={styles.statPill}>
                📋 ด่าน {currentLevel + 1}/{LEVELS.length}
              </div>
            </div>
          </div>

          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${((currentLevel + 1) / LEVELS.length) * 100}%`}} />
          </div>

          <div style={styles.mainGrid}>
            <div style={styles.leftPanel}>
              <div style={styles.panelCard}>
                <div style={styles.levelHeader}>
                  <div>
                    <div style={styles.levelTitle}>{level.title}</div>
                    <div style={styles.levelMeta}>
                      ระดับ {level.difficulty} • จำกัดเวลา {level.timeLimit} วินาที
                    </div>
                  </div>
                  <div style={styles.goalBadge}>🎯 Mission</div>
                </div>
                <div style={styles.goalText}>{level.goal}</div>
                <div style={styles.hintText}>💡 Hint: {level.hint}</div>
              </div>

              <div style={styles.editorCard}>
                <div style={styles.cardTitle}>📦 Block Area</div>

                <div style={styles.dragSectionTitle}>📚 บล็อกคำสั่ง ({pool.length} บล็อก)</div>
                <div
                  style={styles.blockWrap}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePoolDrop();
                  }}
                >
                  {pool.length === 0 ? (
                    <div style={styles.emptyText}>✅ ใช้บล็อกครบแล้ว! ตรวจคำตอบได้เลย</div>
                  ) : (
                    pool.map((block, idx) => {
                      const c = getBlockStyle(block, false);
                      return (
                        <div
                          key={`pool-${block}-${idx}`}
                          draggable={status === "playing"}
                          onDragStart={() => onDragStart("pool", idx)}
                          onDragEnd={onDragEnd}
                          style={{
                            ...styles.blockBtn,
                            background: c.bg,
                            borderColor: c.border,
                            color: c.text,
                          }}
                        >
                          {block}
                        </div>
                      );
                    })
                  )}
                </div>

                <div style={styles.dragSectionTitle}>🔧 พื้นที่ต่อบล็อก ({workspace.length} บล็อก)</div>
                <div className="answerZone" style={styles.answerZone}>
                  {workspace.length === 0 ? (
                    <div
                      style={styles.dropSlot}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropIndex(0);
                      }}
                      onDragLeave={() => setDropIndex(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleWorkspaceDrop(0);
                      }}
                    >
                      📍 ลากบล็อกมาวางที่นี่
                    </div>
                  ) : (
                    <>
                      {workspace.map((block, idx) => {
                        const c = getBlockStyle(block, true);
                        return (
                          <React.Fragment key={`ws-${block}-${idx}`}>
                            <div
                              style={{
                                ...styles.inlineDropSlot,
                                ...(dropIndex === idx ? styles.inlineDropSlotActive : {}),
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setDropIndex(idx);
                              }}
                              onDragLeave={() => setDropIndex(null)}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleWorkspaceDrop(idx);
                              }}
                            />
                            <div
                              draggable={status === "playing"}
                              onDragStart={() => onDragStart("workspace", idx)}
                              onDragEnd={onDragEnd}
                              style={{
                                ...styles.blockBtn,
                                background: c.bg,
                                borderColor: c.border,
                                color: c.text,
                              }}
                            >
                              {block}
                            </div>
                          </React.Fragment>
                        );
                      })}
                      <div
                        style={{
                          ...styles.inlineDropSlot,
                          ...(dropIndex === workspace.length ? styles.inlineDropSlotActive : {}),
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDropIndex(workspace.length);
                        }}
                        onDragLeave={() => setDropIndex(null)}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleWorkspaceDrop(workspace.length);
                        }}
                      />
                    </>
                  )}
                </div>

                <div style={{ marginTop: 14 }}>
                  <div style={styles.dragSectionTitle}>💻 โค้ดที่ต่อได้</div>
                  <textarea value={codeText} readOnly style={styles.editor} />
                </div>

                <div style={styles.actionRow}>
                  <button onClick={checkAnswer} style={styles.primaryBtn}>
                    ✅ ตรวจคำตอบ
                  </button>
                  <button
                    onClick={() => {
                      setPool(shuffle(level.blocks));
                      setWorkspace([]);
                      setFeedback([]);
                      setMessage("🔄 สุ่มบล็อกใหม่แล้ว");
                    }}
                    style={styles.secondaryBtn}
                  >
                    🔄 สุ่มบล็อกใหม่
                  </button>
                  <button onClick={resetGame} style={styles.secondaryBtn}>
                    🏠 กลับหน้าแรก
                  </button>
                </div>

                <div style={styles.messageBox}>
                  <div>
                    <strong>📢 สถานะ:</strong> {message}
                  </div>
                  {feedback.length > 0 && (
                    <ul style={{ margin: "8px 0 0 18px" }}>
                      {feedback.map((item, idx) => (
                        <li key={`fb-${idx}`}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div style={styles.rightPanel}>
              <div style={styles.previewCard}>
                <div style={styles.cardTitle}>👁️ Simulation Preview</div>
                <iframe title="preview" srcDoc={previewDoc} sandbox="" style={styles.previewFrame} />
              </div>

              <div style={styles.rankCard}>
                <div style={styles.cardTitle}>🏆 Leaderboard</div>
                {leaderboard.length === 0 ? (
                  <div style={styles.emptyText}>ยังไม่มีข้อมูลการจัดอันดับ</div>
                ) : (
                  leaderboard.map((item, index) => (
                    <div key={item.id} style={styles.rankItem}>
                      <div>
                        <div style={styles.rankName}>
                          {index === 0 && "🥇 "} {index === 1 && "🥈 "} {index === 2 && "🥉 "} 
                          {index > 2 && `${index + 1}. `}{item.name}
                        </div>
                        <div style={styles.rankMeta}>
                          เลขที่ {item.no} • ผ่าน {item.levelsPassed} ด่าน
                        </div>
                      </div>
                      <div style={styles.rankScore}>{item.score}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {status === "won" && <div style={styles.successBanner}>🎉 ยินดีด้วย คุณผ่านครบทุกด่านแล้ว! 🎉</div>}
          {status === "timeout" && <div style={styles.timeoutBanner}>⏰ หมดเวลา ลองเริ่มใหม่อีกครั้ง</div>}
        </div>
      </div>
    </>
  );
}

const styles = {
  appBg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflow: "hidden",
  },
  heroContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    position: "relative",
  },
  floatingOrbs: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  orb1: {
    position: "absolute",
    top: "10%",
    right: "5%",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
    animation: "float 8s ease-in-out infinite",
  },
  orb2: {
    position: "absolute",
    bottom: "10%",
    left: "5%",
    width: 250,
    height: 250,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
    animation: "float 10s ease-in-out infinite reverse",
  },
  orb3: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)",
    transform: "translate(-50%, -50%)",
  },
  orb4: {
    position: "absolute",
    top: "70%",
    right: "15%",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%)",
    animation: "float 12s ease-in-out infinite",
  },
  heroContent: {
    maxWidth: 1280,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1.2fr 0.9fr",
    gap: 32,
    position: "relative",
    zIndex: 2,
  },
  heroLeft: {
    color: "white",
    padding: 20,
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  logoBubble: {
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffd89b, #c7e9fb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#667eea",
  },
  logoBadge: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    padding: "8px 16px",
    borderRadius: 40,
    fontSize: 14,
    fontWeight: 600,
  },
  mainTitle: {
    fontSize: 52,
    lineHeight: 1.2,
    margin: "0 0 20px 0",
    fontWeight: 800,
  },
  gradientText: {
    background: "linear-gradient(135deg, #ffd89b, #c7e9fb)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    margin: "32px 0",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    padding: "10px 16px",
    borderRadius: 12,
    fontSize: 14,
  },
  featureIcon: {
    fontSize: 20,
  },
  statsBar: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    borderRadius: 16,
    padding: "16px 24px",
    marginTop: 24,
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    background: "rgba(255,255,255,0.3)",
  },
  formCard: {
    background: "white",
    borderRadius: 32,
    padding: 32,
    boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
    animation: "fadeIn 0.5s ease-out",
  },
  formHeader: {
    textAlign: "center",
    marginBottom: 24,
  },
  formIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#333",
    margin: 0,
  },
  formSubtitle: {
    color: "#666",
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 600,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    borderRadius: 12,
    border: "2px solid #e0e0e0",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.3s",
    fontFamily: "inherit",
  },
  startBtn: {
    width: "100%",
    border: "none",
    borderRadius: 12,
    padding: "16px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: 18,
    cursor: "pointer",
    marginTop: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "transform 0.2s",
  },
  formFooter: {
    marginTop: 20,
    padding: "12px",
    background: "#f5f5f5",
    borderRadius: 12,
    fontSize: 13,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
  footerIcon: {
    fontSize: 16,
  },
  gameBg: {
    minHeight: "100vh",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    background: "linear-gradient(135deg, #f8fbff 0%, #eef2ff 100%)",
    position: "relative",
  },
  gameShell: {
    maxWidth: 1320,
    margin: "0 auto",
  },
  errorNotification: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#ef4444",
    color: "white",
    padding: "12px 20px",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontWeight: 600,
  },
  successNotification: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#10b981",
    color: "white",
    padding: "12px 20px",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    zIndex: 1000,
    animation: "fadeIn 0.3s ease-out",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontWeight: 600,
  },
  errorIcon: {
    fontSize: 20,
  },
  successIcon: {
    fontSize: 20,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    gap: 16,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 800,
    color: "#111827",
  },
  noBadge: {
    fontSize: 14,
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 10px",
    borderRadius: 999,
    marginLeft: 10,
    verticalAlign: "middle",
  },
  smallText: {
    color: "#64748b",
    marginTop: 6,
  },
  topStats: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  statPill: {
    background: "white",
    border: "1px solid #dbe3f0",
    borderRadius: 999,
    padding: "10px 14px",
    fontWeight: 700,
    color: "#334155",
    boxShadow: "0 6px 20px rgba(15,23,42,0.05)",
  },
  progressBar: {
    height: 8,
    background: "#e2e8f0",
    borderRadius: 4,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.9fr",
    gap: 20,
  },
  leftPanel: {
    display: "grid",
    gap: 18,
  },
  rightPanel: {
    display: "grid",
    gap: 18,
  },
  panelCard: {
    background: "linear-gradient(135deg, #1e1b4b, #4338ca)",
    color: "white",
    borderRadius: 26,
    padding: 22,
    boxShadow: "0 18px 40px rgba(79,70,229,0.25)",
  },
  levelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: 12,
  },
  levelTitle: {
    fontSize: 26,
    fontWeight: 800,
  },
  levelMeta: {
    color: "#c7d2fe",
    marginTop: 6,
  },
  goalBadge: {
    padding: "8px 12px",
    background: "rgba(255,255,255,0.14)",
    borderRadius: 999,
    fontWeight: 700,
  },
  goalText: {
    fontSize: 18,
    lineHeight: 1.7,
    marginTop: 14,
  },
  hintText: {
    marginTop: 12,
    color: "#dbeafe",
  },
  editorCard: {
    background: "white",
    borderRadius: 26,
    padding: 20,
    boxShadow: "0 10px 35px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  previewCard: {
    background: "white",
    borderRadius: 26,
    padding: 20,
    boxShadow: "0 10px 35px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  rankCard: {
    background: "white",
    borderRadius: 26,
    padding: 20,
    boxShadow: "0 10px 35px rgba(15,23,42,0.06)",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: 12,
  },
  dragSectionTitle: {
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 6,
  },
  blockWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    minHeight: 76,
    padding: 10,
    borderRadius: 16,
    border: "2px dashed #dbe3f0",
    background: "#ffffff",
  },
  answerZone: {
    minHeight: 90,
    border: "2px dashed #cbd5e1",
    borderRadius: 16,
    padding: 12,
    background: "#f8fafc",
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
  },
  blockBtn: {
    border: "2px solid #cbd5e1",
    borderRadius: 14,
    padding: "10px 14px",
    cursor: "grab",
    fontWeight: 700,
    color: "#111827",
    boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
    userSelect: "none",
    transition: "transform 0.2s",
  },
  dropSlot: {
    minHeight: 48,
    width: "100%",
    borderRadius: 12,
    border: "2px dashed #94a3b8",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },
  inlineDropSlot: {
    width: 18,
    minHeight: 40,
    borderRadius: 10,
    background: "transparent",
    border: "2px dashed transparent",
  },
  inlineDropSlotActive: {
    background: "#ddd6fe",
    border: "2px dashed #7c3aed",
  },
  editor: {
    width: "100%",
    minHeight: 220,
    border: "none",
    borderRadius: 20,
    background: "#0f172a",
    color: "#86efac",
    padding: 18,
    fontFamily: "Consolas, monospace",
    fontSize: 15,
    boxSizing: "border-box",
    outline: "none",
  },
  actionRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 14,
  },
  primaryBtn: {
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  secondaryBtn: {
    border: "1px solid #cbd5e1",
    borderRadius: 14,
    padding: "12px 16px",
    background: "#f8fafc",
    color: "#334155",
    fontWeight: 700,
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  messageBox: {
    marginTop: 14,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 14,
    color: "#334155",
    lineHeight: 1.6,
  },
  previewFrame: {
    width: "100%",
    minHeight: 420,
    borderRadius: 20,
    border: "1px solid #cbd5e1",
    background: "white",
  },
  emptyText: {
    color: "#64748b",
    padding: "8px 0",
  },
  rankItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    background: "#f8fafc",
  },
  rankName: {
    fontWeight: 700,
    color: "#0f172a",
  },
  rankMeta: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  rankScore: {
    fontWeight: 800,
    fontSize: 22,
    color: "#4f46e5",
  },
  successBanner: {
    marginTop: 18,
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
    padding: 16,
    borderRadius: 18,
    fontWeight: 800,
    textAlign: "center",
    fontSize: 18,
  },
  timeoutBanner: {
    marginTop: 18,
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fcd34d",
    padding: 16,
    borderRadius: 18,
    fontWeight: 800,
    textAlign: "center",
    fontSize: 18,
  },
};