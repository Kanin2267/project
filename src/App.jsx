import React, { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

// ========== Scaffolding Levels ==========
const SCAFFOLDING_LEVELS = {
  LEVEL_1_FULL_BLOCKS: "full_blocks",
  LEVEL_2_PARTIAL_BLOCKS: "partial_blocks",
  LEVEL_3_SKELETON: "skeleton",
  LEVEL_4_BLANK: "blank",
  LEVEL_5_FREE: "free"
};

// ========== หัวข้อการเรียนรู้ (Themes) - 8 หัวข้อ ==========
const THEMES = [
  {
    id: "heading",
    name: "หัวข้อ (Heading)",
    description: "เรียนรู้การใช้ h1-h6 สร้างหัวข้อ",
    icon: "🏷️",
    color: "#3b82f6",
    totalLevels: 5,
    learningContent: {
      concept: "🏷️ Tag h1-h6 ใช้สร้างหัวข้อในเว็บ",
      why: "ทำให้เนื้อหามีลำดับชั้น เข้าใจง่าย",
      how: "h1 สำคัญที่สุด, h6 สำคัญน้อยที่สุด",
      example: "<h1>หัวข้อหลัก</h1><h2>หัวข้อย่อย</h2>"
    }
  },
  {
    id: "text",
    name: "ข้อความ (Text Formatting)",
    description: "เรียนรู้การจัดรูปแบบข้อความ",
    icon: "✏️",
    color: "#10b981",
    totalLevels: 5,
    learningContent: {
      concept: "✏️ จัดรูปแบบข้อความให้สวยงาม",
      why: "ทำให้ข้อความโดดเด่น น่าอ่าน",
      how: "b=ตัวหนา, i=ตัวเอียง, u=ขีดเส้นใต้",
      example: "<b>ตัวหนา</b> <i>ตัวเอียง</i>"
    }
  },
  {
    id: "list",
    name: "รายการ (List)",
    description: "เรียนรู้การสร้างรายการแบบต่างๆ",
    icon: "📋",
    color: "#f59e0b",
    totalLevels: 5,
    learningContent: {
      concept: "📋 สร้างรายการข้อมูล",
      why: "แสดงข้อมูลเป็นระเบียบ เข้าใจง่าย",
      how: "ul=รายการหัวข้อย่อย, ol=รายการลำดับ",
      example: "<ul><li>รายการที่1</li></ul>"
    }
  },
  {
    id: "table",
    name: "ตาราง (Table)",
    description: "เรียนรู้การสร้างตารางข้อมูล",
    icon: "📊",
    color: "#ef4444",
    totalLevels: 5,
    learningContent: {
      concept: "📊 ตารางแสดงข้อมูล",
      why: "เปรียบเทียบข้อมูลได้ง่าย",
      how: "table=ตาราง, tr=แถว, td=เซลล์",
      example: "table\ntr\ntdข้อมูล/td\n/tr\n/table"
    }
  },
  {
    id: "form",
    name: "ฟอร์ม (Form)",
    description: "เรียนรู้การสร้างฟอร์มรับข้อมูล",
    icon: "📝",
    color: "#8b5cf6",
    totalLevels: 5,
    learningContent: {
      concept: "📝 ฟอร์มรับข้อมูลผู้ใช้",
      why: "รับข้อมูลจากผู้ใช้ได้ง่าย",
      how: "input=กรอกข้อมูล, button=ปุ่มส่ง",
      example: "<input type='text' placeholder='ชื่อ'>"
    }
  },
  {
    id: "css-color",
    name: "สีและพื้นหลัง (Color)",
    description: "เรียนรู้การตกแต่งสีสัน",
    icon: "🎨",
    color: "#ec4899",
    totalLevels: 5,
    learningContent: {
      concept: "🎨 เปลี่ยนสีและพื้นหลัง",
      why: "ทำให้เว็บสวยงาม น่าสนใจ",
      how: "color=สีตัวอักษร, background=สีพื้นหลัง",
      example: "color: red; background: yellow;"
    }
  },
  {
    id: "css-box",
    name: "กล่องและระยะห่าง (Box Model)",
    description: "เรียนรู้การจัดระยะห่าง",
    icon: "📦",
    color: "#06b6d4",
    totalLevels: 5,
    learningContent: {
      concept: "📦 จัดการขนาดและระยะห่าง",
      why: "ควบคุมตำแหน่งองค์ประกอบ",
      how: "padding=ระยะใน, margin=ระยะนอก",
      example: "padding: 10px; margin: 20px;"
    }
  },
  {
    id: "css-flex",
    name: "การจัดเรียง (Flexbox)",
    description: "เรียนรู้การจัดเรียงด้วย Flex",
    icon: "🧩",
    color: "#14b8a6",
    totalLevels: 5,
    learningContent: {
      concept: "🧩 Flexbox จัดเรียงองค์ประกอบ",
      why: "จัดเรียงแนวนอน/แนวตั้งง่าย",
      how: "display:flex, justify-content, gap",
      example: "display: flex; gap: 20px;"
    }
  }
];

// ========== สร้างโจทย์ทั้งหมด (8 หัวข้อ x 5 ข้อ = 40 ข้อ) ==========
function generateAllLevels() {
  const levels = [];
  let levelId = 1;

  THEMES.forEach((theme) => {
    for (let i = 0; i < 5; i++) {
      const scaffoldingLevel = getScaffoldingForIndex(i);
      levels.push({
        id: levelId++,
        themeId: theme.id,
        themeName: theme.name,
        themeIcon: theme.icon,
        themeColor: theme.color,
        order: i + 1,
        scaffoldingLevel: scaffoldingLevel,
        title: getTitleForTheme(theme, i),
        difficulty: getDifficulty(i),
        goal: getGoalForTheme(theme, i),
        context: getContextForTheme(theme, i),
        hint: getHintForTheme(theme, i),
        starterCode: getStarterCodeForTheme(theme, i, scaffoldingLevel),
        expectedCode: getExpectedCodeForTheme(theme, i),
        learningContent: theme.learningContent,
        previousKnowledge: getPreviousKnowledge(i)
      });
    }
  });

  return levels;
}

function getScaffoldingForIndex(index) {
  const levels = [
    SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS,
    SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS,
    SCAFFOLDING_LEVELS.LEVEL_3_SKELETON,
    SCAFFOLDING_LEVELS.LEVEL_4_BLANK,
    SCAFFOLDING_LEVELS.LEVEL_5_FREE
  ];
  return levels[index];
}

function getDifficulty(index) {
  const difficulties = ["⭐ ง่าย", "⭐⭐ ง่ายปานกลาง", "⭐⭐⭐ ปานกลาง", "⭐⭐⭐⭐ ยาก", "⭐⭐⭐⭐⭐ ยากมาก"];
  return difficulties[index];
}

function getPreviousKnowledge(index) {
  const knowledges = [
    ["ไม่มีความรู้เดิม"],
    ["HTML พื้นฐาน"],
    ["HTML, CSS พื้นฐาน"],
    ["HTML, CSS ระดับกลาง"],
    ["HTML, CSS ระดับสูง"]
  ];
  return knowledges[index];
}

function getTitleForTheme(theme, index) {
  const titles = {
    heading: ["สร้างหัวข้อหลัก", "หัวข้อย่อย", "หัวข้อพร้อมสี", "หัวข้อตกแต่ง", "หัวข้ออนิเมชัน"],
    text: ["ตัวหนาและตัวเอียง", "ขีดเส้นใต้", "ขนาดตัวอักษร", "สีและฟอนต์", "ข้อความเงา"],
    list: ["รายการแบบจุด", "รายการแบบตัวเลข", "รายการซ้อนกัน", "รายการพร้อมสัญลักษณ์", "เมนูนำทาง"],
    table: ["ตารางพื้นฐาน", "ตารางมีหัวข้อ", "ตารางขอบสวย", "ตารางสลับสี", "ตารางสินค้า"],
    form: ["ฟอร์มชื่อ", "ฟอร์มชื่อ-เบอร์โทร", "ฟอร์มความเห็น", "ฟอร์มลงทะเบียน", "ฟอร์มติดต่อสวยงาม"],
    "css-color": ["เปลี่ยนสีตัวอักษร", "เปลี่ยนพื้นหลัง", "ไล่สีพื้นหลัง", "ปุ่มสีสัน", "การ์ดสีสวย"],
    "css-box": ["ระยะห่างภายใน", "ระยะห่างภายนอก", "ขอบกล่อง", "กล่องเงา", "การ์ดสินค้า"],
    "css-flex": ["จัดเรียงแนวนอน", "จัดกึ่งกลาง", "จัดเรียงแนวตั้ง", "เว้นระยะเท่ากัน", "เมนู responsive"]
  };
  return titles[theme.id]?.[index] || `${theme.name} ข้อ ${index + 1}`;
}

function getGoalForTheme(theme, index) {
  const goals = {
    heading: [
      "สร้างหัวข้อ h1 ข้อความ 'ยินดีต้อนรับ'",
      "สร้างหัวข้อ h2 ข้อความ 'สินค้ามาใหม่'",
      "สร้างหัวข้อ h1 สีน้ำเงิน ข้อความ 'ร้านของเรา'",
      "สร้างหัวข้อ h1 ตกแต่งด้วยเงาและขอบล่าง",
      "สร้างหัวข้อที่มี h1, h2, h3 พร้อมอนิเมชัน"
    ],
    text: [
      "สร้างข้อความ 'HTML' เป็นตัวหนา และ 'CSS' เป็นตัวเอียง",
      "สร้างข้อความ 'สำคัญมาก' ขีดเส้นใต้",
      "สร้างข้อความขนาด 24px ฟอนต์ 'Prompt'",
      "สร้างข้อความสีแดง ฟอนต์ใหญ่ ตัวหนา",
      "สร้างข้อความที่มีเงาและ gradient สี"
    ],
    list: [
      "สร้างรายการสินค้า 3 อย่างด้วย ul",
      "สร้างรายการขั้นตอน 3 ขั้นตอนด้วย ol",
      "สร้างรายการเมนูอาหารแบบซ้อนกัน",
      "สร้างรายการพร้อมสัญลักษณ์ ✓ แทนจุด",
      "สร้างเมนูนำทางแนวนอนด้วย ul + flex"
    ],
    table: [
      "สร้างตาราง 2x2 แสดงชื่อและอายุ",
      "สร้างตารางมีหัวข้อ: ชื่อ, อายุ, เมือง",
      "สร้างตารางขอบมน ขอบสีเทา",
      "สร้างตารางสลับสีแถว",
      "สร้างตารางแสดงสินค้า: รายการ, ราคา, คงเหลือ"
    ],
    form: [
      "สร้างฟอร์มรับชื่อ (input text)",
      "สร้างฟอร์มรับชื่อและเบอร์โทร",
      "สร้างฟอร์มชื่อ, อีเมล, ข้อความ",
      "สร้างฟอร์มลงทะเบียน 4 ช่อง + ปุ่ม",
      "สร้างฟอร์มติดต่อสวยงามพร้อมไอคอน"
    ],
    "css-color": [
      "ทำให้ตัวอักษรเป็นสีแดง",
      "ทำให้พื้นหลังเป็นสีเหลืองอ่อน",
      "ทำให้พื้นหลังเป็น linear-gradient",
      "สร้างปุ่มสีเขียว ขอบมน",
      "สร้างการ์ดพื้นหลังไล่สีสวยงาม"
    ],
    "css-box": [
      "กำหนด padding: 10px ให้ div",
      "กำหนด margin: 20px ให้ div",
      "กำหนด border: 2px solid blue",
      "กำหนด box-shadow ให้ div",
      "สร้างการ์ดมี padding, margin, border-radius, shadow"
    ],
    "css-flex": [
      "จัด div สองตัวเรียงแนวนอน",
      "จัด div กึ่งกลางแนวนอน",
      "จัด div เรียงแนวตั้ง居中",
      "จัด div เว้นระยะเท่ากัน",
      "สร้างแถบเมนู responsive แนวนอน"
    ]
  };
  return goals[theme.id]?.[index] || `ทำ ${theme.name} ข้อ ${index + 1}`;
}

function getContextForTheme(theme, index) {
  const contexts = {
    heading: ["🏠 หน้าแรกเว็บไซต์", "🛍️ หน้าร้านค้า", "🎨 ตกแต่งหัวข้อ", "✨ หัวข้อโดดเด่น", "🎯 หัวข้อน่าสนใจ"],
    text: ["📝 เน้นข้อความสำคัญ", "✏️ จัดรูปแบบข้อความ", "🎨 แต่งตัวอักษร", "💬 ข้อความโปรโมชั่น", "✨ ข้อความต้อนรับ"],
    list: ["📋 แสดงเมนูอาหาร", "🔢 แสดงขั้นตอน", "🍽️ เมนูพร้อมหมวดหมู่", "✅ รายการสิ่งที่ต้องทำ", "🧭 เมนูนำทาง"],
    table: ["📊 ข้อมูลนักเรียน", "📈 รายงานผล", "✨ ตารางสวยงาม", "🎨 ตารางสลับสี", "🛒 ตารางราคาสินค้า"],
    form: ["📝 สมัครสมาชิก", "📞 ติดต่อกลับ", "💬 ความเห็น", "📋 ลงทะเบียน", "📧 ติดต่อร้านค้า"],
    "css-color": ["🎨 แต่งสีเว็บ", "🌈 เปลี่ยนพื้นหลัง", "✨ พื้นหลังไล่สี", "🔘 ปุ่มสวยงาม", "💳 การ์ดสีสัน"],
    "css-box": ["📦 จัดระยะห่าง", "📏 ควบคุมระยะ", "🖼️ ขอบกรอบ", "✨ เพิ่มเงา", "💳 การ์ดสินค้า"],
    "css-flex": ["📱 จัดเรียงเมนู", "🎯 จัดกึ่งกลาง", "📐 จัดแนวตั้ง", "⚖️ เว้นระยะ", "🍔 เมนู responsive"]
  };
  return contexts[theme.id]?.[index] || `📦 แบบฝึกหัดที่ ${index + 1}`;
}

function getHintForTheme(theme, index) {
  const hints = {
    heading: [
      "ใช้ <h1> และ </h1> ครอบข้อความ",
      "ใช้ <h2> และ </h2> ครอบข้อความ",
      "ใช้ style='color: blue' หรือ CSS class",
      "ใช้ text-shadow และ border-bottom",
      "ใช้ CSS animation หรือ transition"
    ],
    text: [
      "ใช้ <b> และ <i> ครอบข้อความ",
      "ใช้ <u> ครอบข้อความสำคัญ",
      "ใช้ style='font-size: 24px; font-family: Prompt'",
      "ใช้ color, font-size, font-weight",
      "ใช้ text-shadow: 2px 2px 4px gray"
    ],
    list: [
      "ใช้ <ul> และ <li> สร้างรายการ",
      "ใช้ <ol> และ <li> สร้างรายการลำดับ",
      "ใช้ ul ซ้อน ul",
      "ใช้ list-style-type: none; แล้วใส่ content: '✓'",
      "ใช้ display: flex; gap: 20px;"
    ],
    table: [
      "ใช้ table, tr, td",
      "ใช้ <th> สำหรับหัวข้อตาราง",
      "ใช้ border-collapse และ border-radius",
      "ใช้ :nth-child(even) หรือ :nth-child(odd)",
      "ใช้ border, padding, text-align"
    ],
    form: [
      "ใช้ <input type='text'>",
      "ใช้ <input type='tel'> และ <input type='text'>",
      "ใช้ <textarea> สำหรับข้อความยาว",
      "ใช้ <form> ครอบ input ต่างๆ",
      "ใช้ CSS ตกแต่ง input, button"
    ],
    "css-color": [
      "ใช้ color: red;",
      "ใช้ background-color: #fff3cd;",
      "ใช้ background: linear-gradient(45deg, #ff6b6b, #4ecdc4);",
      "ใช้ background-color, border-radius, padding",
      "ใช้ gradient และ box-shadow"
    ],
    "css-box": [
      "ใช้ padding: 10px;",
      "ใช้ margin: 20px;",
      "ใช้ border: 2px solid blue; border-radius: 8px;",
      "ใช้ box-shadow: 2px 2px 10px rgba(0,0,0,0.1);",
      "ใช้ padding, margin, border-radius, box-shadow ร่วมกัน"
    ],
    "css-flex": [
      "ใช้ display: flex;",
      "ใช้ justify-content: center; align-items: center;",
      "ใช้ flex-direction: column;",
      "ใช้ justify-content: space-between;",
      "ใช้ flex-wrap: wrap; และ media query"
    ]
  };
  return hints[theme.id]?.[index] || "ใช้ความรู้ HTML/CSS ที่เรียนมา";
}

function getStarterCodeForTheme(theme, index, scaffoldingLevel) {
  const expectedCode = getExpectedCodeForTheme(theme, index);

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS) {
    return "";
  }

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS) {
    const firstTagMatch = expectedCode.match(/<[^>]+>/);
    if (firstTagMatch) {
      const firstTag = firstTagMatch[0];
      const rest = expectedCode.substring(firstTag.length);
      const modifiedFirstTag = firstTag.replace(/>/, ">______");
      return modifiedFirstTag + rest;
    }
    return expectedCode.replace(/>([^<]+)</, ">______<");
  }

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_3_SKELETON) {
    return getSkeletonForTheme(theme, index);
  }

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_4_BLANK) {
    return "<!-- เขียนโค้ด HTML/CSS ของคุณที่นี่ -->";
  }

  return "";
}

function getSkeletonForTheme(theme, index) {
  const skeletons = {
    heading: [
      `<h1>______</h1>`,
      `<h2>______</h2>`,
      `<h1 style="______">ร้านของเรา</h1>`,
      `<h1 class="title">______</h1>\n<style>\n.title {\n  text-shadow: ______;\n  border-bottom: ______;\n}\n</style>`,
      `<h1 class="main-title">______</h1>\n<style>\n.main-title { animation: fadeIn 1s; }\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n</style>`
    ],
    text: [
      `<p><b>______</b> และ <i>______</i></p>`,
      `<p><u>______</u></p>`,
      `<p style="______">ข้อความขนาดใหญ่</p>`,
      `<p class="promo">______</p>\n<style>.promo { color: ______; font-size: ______; font-weight: ______; }</style>`,
      `<h1 class="glow">______</h1>\n<style>.glow { text-shadow: ______; }</style>`
    ],
    list: [
      `<ul>\n  <li>______</li>\n  <li>______</li>\n  <li>______</li>\n</ul>`,
      `<ol>\n  <li>______</li>\n  <li>______</li>\n  <li>______</li>\n</ol>`,
      `<ul>\n  <li>อาหาร\n    <ul>\n      <li>______</li>\n      <li>______</li>\n    </ul>\n  </li>\n</ul>`,
      `<ul class="custom-list">\n  <li>______</li>\n</ul>\n<style>.custom-list li::before { content: "______"; }</style>`,
      `<ul class="nav-menu">\n  <li>______</li>\n  <li>______</li>\n  <li>______</li>\n</ul>\n<style>.nav-menu { display: ______; gap: ______; }</style>`
    ],
    table: [
      `<table border="1">\n  <tr>\n    <td>______</td>\n    <td>______</td>\n  </tr>\n</table>`,
      `<table border="1">\n  <tr>\n    <th>______</th>\n    <th>______</th>\n  </tr>\n  <tr>\n    <td>______</td>\n    <td>______</td>\n  </tr>\n</table>`,
      `<table class="fancy-table">\n  <tr><th>______</th><th>______</th></tr>\n</table>\n<style>.fancy-table { border-radius: ______; }</style>`,
      `<table class="striped">\n  <tr><th>______</th><th>______</th></tr>\n</table>\n<style>.striped tr:nth-child(even) { background: ______; }</style>`,
      `<table class="product-table">\n  <tr><th>______</th><th>______</th><th>______</th></tr>\n</table>`
    ],
    form: [
      `<form>\n  <input type="text" placeholder="______">\n</form>`,
      `<form>\n  <input type="text" placeholder="______">\n  <input type="tel" placeholder="______">\n</form>`,
      `<form>\n  <input type="text" placeholder="______">\n  <textarea placeholder="______"></textarea>\n</form>`,
      `<form>\n  <input type="text" placeholder="______">\n  <input type="email" placeholder="______">\n  <button>______</button>\n</form>`,
      `<form class="contact-form">\n  <input type="text" placeholder="______">\n  <button>______</button>\n</form>\n<style>.contact-form { padding: ______; border-radius: ______; }</style>`
    ],
    "css-color": [
      `<p style="color: ______;">ข้อความสีแดง</p>`,
      `<div style="background-color: ______;">พื้นหลังสีเหลืองอ่อน</div>`,
      `<div style="background: ______;">พื้นหลังไล่สี</div>`,
      `<button class="btn">______</button>\n<style>.btn { background: ______; border-radius: ______; }</style>`,
      `<div class="card">______</div>\n<style>.card { background: ______; border-radius: ______; }</style>`
    ],
    "css-box": [
      `<div style="padding: ______;">เนื้อหา</div>`,
      `<div style="margin: ______;">เนื้อหา</div>`,
      `<div style="border: ______; border-radius: ______;">ขอบกล่อง</div>`,
      `<div class="shadow-box">______</div>\n<style>.shadow-box { box-shadow: ______; }</style>`,
      `<div class="card">______</div>\n<style>.card { padding: ______; margin: ______; border-radius: ______; }</style>`
    ],
    "css-flex": [
      `<div style="display: ______;">\n  <div>A</div>\n  <div>B</div>\n</div>`,
      `<div style="display: flex; justify-content: ______;">\n  <div>居中</div>\n</div>`,
      `<div style="display: flex; flex-direction: ______;">\n  <div>บน</div>\n  <div>ล่าง</div>\n</div>`,
      `<div style="display: flex; justify-content: ______;">\n  <div>ซ้าย</div>\n  <div>กลาง</div>\n  <div>ขวา</div>\n</div>`,
      `<ul class="nav">\n  <li>______</li>\n  <li>______</li>\n  <li>______</li>\n</ul>\n<style>.nav { display: ______; gap: ______; }</style>`
    ]
  };
  return skeletons[theme.id]?.[index] || "<!-- เขียนโค้ดของคุณที่นี่ -->";
}

// ========== EXPECTED CODE FOR EACH THEME AND LEVEL ==========
function getExpectedCodeForTheme(theme, index) {
  const expected = {
    heading: [
      "<h1>ยินดีต้อนรับ</h1>",
      "<h2>สินค้ามาใหม่</h2>",
      "<h1 style='color: blue'>ร้านของเรา</h1>",
      "<h1 class='title'>หัวข้อสวยงาม</h1>\n<style>\n.title {\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n  border-bottom: 3px solid #333;\n}\n</style>",
      "<h1 class='main-title'>ยินดีต้อนรับ</h1>\n<style>\n.main-title { animation: fadeIn 1s; }\n@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n</style>"
    ],
    text: [
      "<p><b>HTML</b> และ <i>CSS</i></p>",
      "<p><u>สำคัญมาก</u></p>",
      "<p style='font-size: 24px; font-family: Prompt'>ข้อความขนาดใหญ่</p>",
      "<p class='promo'>ลด 50% ทั่วประเทศ!</p>\n<style>.promo { color: red; font-size: 32px; font-weight: bold; }</style>",
      "<h1 class='glow'>ข้อความสวยงาม</h1>\n<style>.glow { text-shadow: 2px 2px 4px gray; }</style>"
    ],
    list: [
      "<ul>\n  <li>ข้าวผัด</li>\n  <li>ผัดไทย</li>\n  <li>ต้มยำกุ้ง</li>\n</ul>",
      "<ol>\n  <li>เลือกสินค้า</li>\n  <li>เพิ่มในตะกร้า</li>\n  <li>ชำระเงิน</li>\n</ol>",
      "<ul>\n  <li>อาหาร\n    <ul>\n      <li>ข้าวผัด</li>\n      <li>ผัดไทย</li>\n    </ul>\n  </li>\n</ul>",
      "<ul class='custom-list'>\n  <li>งานบ้านเสร็จ</li>\n</ul>\n<style>.custom-list li::before { content: '✓ '; color: green; }</style>",
      "<ul class='nav-menu'>\n  <li>หน้าแรก</li>\n  <li>สินค้า</li>\n  <li>ติดต่อ</li>\n</ul>\n<style>.nav-menu { display: flex; gap: 20px; }</style>"
    ],
    table: [
      "<table border='1'>\n  <tr>\n    <td>ชื่อ</td>\n    <td>อายุ</td>\n  </tr>\n  <tr>\n    <td>สมชาย</td>\n    <td>25</td>\n  </tr>\n</table>",
      "<table border='1'>\n  <tr>\n    <th>ชื่อ</th>\n    <th>อายุ</th>\n    <th>เมือง</th>\n  </tr>\n  <tr>\n    <td>สมชาย</td>\n    <td>25</td>\n    <td>กรุงเทพฯ</td>\n  </tr>\n</table>",
      "<table class='fancy-table'>\n  <tr><th>ชื่อ</th><th>คะแนน</th></tr>\n  <tr><td>สมชาย</td><td>85</td></tr>\n</table>\n<style>.fancy-table { border-radius: 12px; }</style>",
      "<table class='striped'>\n  <tr><th>ชื่อ</th><th>คะแนน</th></tr>\n  <tr><td>สมชาย</td><td>85</td></tr>\n  <tr><td>สมหญิง</td><td>92</td></tr>\n</table>\n<style>.striped tr:nth-child(even) { background: #f2f2f2; }</style>",
      "<table class='product-table'>\n  <tr><th>สินค้า</th><th>ราคา</th><th>คงเหลือ</th></tr>\n  <tr><td>เสื้อ</td><td>500</td><td>10</td></tr>\n</table>"
    ],
    form: [
      "<form>\n  <input type='text' placeholder='กรุณากรอกชื่อ'>\n</form>",
      "<form>\n  <input type='text' placeholder='ชื่อ'>\n  <input type='tel' placeholder='เบอร์โทร'>\n</form>",
      "<form>\n  <input type='text' placeholder='ชื่อ'>\n  <textarea placeholder='ข้อความ'></textarea>\n</form>",
      "<form>\n  <input type='text' placeholder='ชื่อผู้ใช้'>\n  <input type='email' placeholder='อีเมล'>\n  <button>ลงทะเบียน</button>\n</form>",
      "<form class='contact-form'>\n  <input type='text' placeholder='ชื่อ'>\n  <button>ส่งข้อความ</button>\n</form>\n<style>.contact-form { padding: 20px; border-radius: 12px; background: #f5f5f5; }</style>"
    ],
    "css-color": [
      "<p style='color: red;'>ข้อความสีแดง</p>",
      "<div style='background-color: #fff3cd;'>พื้นหลังสีเหลืองอ่อน</div>",
      "<div style='background: linear-gradient(45deg, #ff6b6b, #4ecdc4);'>พื้นหลังไล่สี</div>",
      "<button class='btn'>ปุ่มสวยงาม</button>\n<style>.btn { background: #10b981; border-radius: 12px; color: white; padding: 12px 24px; }</style>",
      "<div class='card'>การ์ดสวยงาม</div>\n<style>.card { background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 16px; padding: 20px; color: white; }</style>"
    ],
    "css-box": [
      "<div style='padding: 10px; border: 1px solid black;'>เนื้อหา</div>",
      "<div style='margin: 20px; border: 1px solid black;'>เนื้อหา</div>",
      "<div style='border: 2px solid blue; border-radius: 8px; padding: 10px;'>ขอบกล่อง</div>",
      "<div class='shadow-box'>กล่องมีเงา</div>\n<style>.shadow-box { box-shadow: 2px 2px 10px rgba(0,0,0,0.15); padding: 20px; }</style>",
      "<div class='card'>สินค้าพิเศษ</div>\n<style>.card { padding: 20px; margin: 10px; border-radius: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }</style>"
    ],
    "css-flex": [
      "<div style='display: flex;'>\n  <div>A</div>\n  <div>B</div>\n</div>",
      "<div style='display: flex; justify-content: center;'>\n  <div>居中</div>\n</div>",
      "<div style='display: flex; flex-direction: column;'>\n  <div>บน</div>\n  <div>ล่าง</div>\n</div>",
      "<div style='display: flex; justify-content: space-between;'>\n  <div>ซ้าย</div>\n  <div>กลาง</div>\n  <div>ขวา</div>\n</div>",
      "<ul class='nav'>\n  <li>หน้าแรก</li>\n  <li>สินค้า</li>\n  <li>ติดต่อ</li>\n</ul>\n<style>.nav { display: flex; gap: 20px; }</style>"
    ]
  };
  return expected[theme.id]?.[index] || "";
}

// ========== สร้างบล็อกสำหรับระดับ 1 และ 2 ==========
function getBlocksForTheme(themeId, index, scaffoldingLevel) {
  const theme = { id: themeId };
  const expectedCode = getExpectedCodeForTheme(theme, index);

  if (!expectedCode) return [];

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS) {
    const blocks = [];
    let i = 0;
    const code = expectedCode;

    while (i < code.length) {
      if (code[i] === "<") {
        let j = i;
        let tagContent = "";

        while (j < code.length) {
          tagContent += code[j];
          if (code[j] === ">") {
            if (tagContent.trim()) {
              blocks.push(tagContent.trim());
            }
            i = j + 1;
            break;
          }
          j++;
        }

        if (j >= code.length) {
          if (tagContent.trim()) {
            blocks.push(tagContent.trim());
          }
          break;
        }
      } else {
        let j = i;
        let textContent = "";

        while (j < code.length && code[j] !== "<") {
          textContent += code[j];
          j++;
        }

        if (textContent.trim()) {
          blocks.push(textContent.trim());
        }
        i = j;
      }
    }

    const filtered = blocks.filter((b) => b && b.length > 0 && b !== "\n" && b !== " ");
    return filtered.length > 0 ? filtered : [expectedCode];
  }

  if (scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS) {
    const blocks = [];
    const openTagMatch = expectedCode.match(/<[^>/][^>]*>/);
    if (openTagMatch) {
      const openTag = openTagMatch[0];
      const afterOpenTag = expectedCode.substring(openTag.length);

      let blockWithBlank = openTag;
      if (openTag.endsWith(">")) {
        blockWithBlank = openTag.slice(0, -1) + ">______";
      } else {
        blockWithBlank = openTag + "______";
      }

      const remaining = afterOpenTag.length > 80 ? afterOpenTag.substring(0, 80) + "..." : afterOpenTag;
      blocks.push(blockWithBlank + remaining);
    } else {
      blocks.push(`${expectedCode.substring(0, 50)}______`);
    }

    return blocks;
  }

  return [];
}

function buildPreview(code) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 20px;
    background: #f8f9fa;
    min-height: 100vh;
  }
</style>
</head>
<body>
${code || "<!-- รอการเขียนโค้ด -->"}
</body>
</html>`;
}

function shuffle(arr) {
  if (!arr || arr.length === 0) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getBlockType(block) {
  const s = block.trim();
  if (s.startsWith("<style") || s.includes("{") || s.includes(":")) {
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
    html: { bg: active ? "#dbeafe" : "#eff6ff", border: "#60a5fa", text: "#1e40af" },
    css: { bg: active ? "#dcfce7" : "#f0fdf4", border: "#4ade80", text: "#166534" },
    text: { bg: active ? "#fef3c7" : "#fffbeb", border: "#f59e0b", text: "#92400e" }
  };
  return map[type];
}

// ========== Validation Helpers ==========
function normalizeText(text = "") {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}

function normalizeCode(code = "") {
  return code.replace(/\s+/g, " ").replace(/['"]/g, '"').trim().toLowerCase();
}

function includesAny(text, keywords = []) {
  const t = normalizeText(text);
  return keywords.some((k) => t.includes(normalizeText(k)));
}

function validateHeading(doc, level) {
  const order = level.order;

  if (order === 1) {
    const h1 = doc.querySelector("h1");
    if (!h1) return { isValid: false, validationMessage: "ต้องมี <h1>" };
    if (!includesAny(h1.textContent, ["ยินดีต้อนรับ"])) {
      return { isValid: false, validationMessage: "ข้อความใน h1 ต้องเป็น 'ยินดีต้อนรับ'" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const h2 = doc.querySelector("h2");
    if (!h2) return { isValid: false, validationMessage: "ต้องมี <h2>" };
    if (!includesAny(h2.textContent, ["สินค้ามาใหม่"])) {
      return { isValid: false, validationMessage: "ข้อความใน h2 ต้องเป็น 'สินค้ามาใหม่'" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const h1 = doc.querySelector("h1");
    if (!h1) return { isValid: false, validationMessage: "ต้องมี <h1>" };
    if (!includesAny(h1.textContent, ["ร้านของเรา"])) {
      return { isValid: false, validationMessage: "ข้อความใน h1 ต้องเป็น 'ร้านของเรา'" };
    }

    const styleAttr = normalizeCode(h1.getAttribute("style") || "");
    if (!styleAttr.includes("color")) {
      return { isValid: false, validationMessage: "h1 ต้องกำหนดสี" };
    }
    if (!styleAttr.includes("blue") && !styleAttr.includes("#0000ff") && !styleAttr.includes("rgb(0,0,255)") && !styleAttr.includes("rgb(0, 0, 255)")) {
      return { isValid: false, validationMessage: "h1 ต้องเป็นสีน้ำเงิน" };
    }

    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const h1 = doc.querySelector("h1");
    const styleTag = doc.querySelector("style");
    if (!h1) return { isValid: false, validationMessage: "ต้องมี <h1>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };

    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("text-shadow")) {
      return { isValid: false, validationMessage: "ต้องมี text-shadow" };
    }
    if (!css.includes("border-bottom")) {
      return { isValid: false, validationMessage: "ต้องมี border-bottom" };
    }

    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const h1 = doc.querySelector("h1");
    const styleTag = doc.querySelector("style");
    if (!h1) return { isValid: false, validationMessage: "ต้องมี <h1>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };

    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("animation") && !css.includes("@keyframes")) {
      return { isValid: false, validationMessage: "ต้องมี animation หรือ @keyframes" };
    }

    const hasH2 = !!doc.querySelector("h2");
    const hasH3 = !!doc.querySelector("h3");
    if (!hasH2 || !hasH3) {
      return { isValid: false, validationMessage: "โจทย์ข้อนี้ควรมี h1, h2 และ h3" };
    }

    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateText(doc, level) {
  const order = level.order;

  if (order === 1) {
    const b = doc.querySelector("b, strong");
    const i = doc.querySelector("i, em");
    if (!b) return { isValid: false, validationMessage: "ต้องมีข้อความตัวหนา" };
    if (!i) return { isValid: false, validationMessage: "ต้องมีข้อความตัวเอียง" };
    if (!includesAny(b.textContent, ["html"])) {
      return { isValid: false, validationMessage: "ข้อความตัวหนาต้องเป็น HTML" };
    }
    if (!includesAny(i.textContent, ["css"])) {
      return { isValid: false, validationMessage: "ข้อความตัวเอียงต้องเป็น CSS" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const u = doc.querySelector("u");
    if (!u) return { isValid: false, validationMessage: "ต้องมี <u>" };
    if (!includesAny(u.textContent, ["สำคัญมาก"])) {
      return { isValid: false, validationMessage: "ข้อความที่ขีดเส้นใต้ต้องเป็น 'สำคัญมาก'" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const p = doc.querySelector("p");
    if (!p) return { isValid: false, validationMessage: "ต้องมี <p>" };

    const styleAttr = normalizeCode(p.getAttribute("style") || "");
    if (!styleAttr.includes("font-size") || !styleAttr.includes("24px")) {
      return { isValid: false, validationMessage: "ต้องกำหนด font-size: 24px" };
    }
    if (!styleAttr.includes("font-family") || !styleAttr.includes("prompt")) {
      return { isValid: false, validationMessage: "ต้องกำหนด font-family: Prompt" };
    }

    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const p = doc.querySelector("p");
    const styleTag = doc.querySelector("style");
    if (!p) return { isValid: false, validationMessage: "ต้องมี <p>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };

    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("color")) return { isValid: false, validationMessage: "ต้องกำหนดสีข้อความ" };
    if (!css.includes("font-size")) return { isValid: false, validationMessage: "ต้องกำหนดขนาดตัวอักษร" };
    if (!css.includes("font-weight")) return { isValid: false, validationMessage: "ต้องกำหนดตัวหนา" };

    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const styleTag = doc.querySelector("style");
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("text-shadow")) {
      return { isValid: false, validationMessage: "ต้องมี text-shadow" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateList(doc, level) {
  const order = level.order;

  if (order === 1) {
    const ul = doc.querySelector("ul");
    const items = doc.querySelectorAll("ul > li");
    if (!ul) return { isValid: false, validationMessage: "ต้องมี <ul>" };
    if (items.length < 3) return { isValid: false, validationMessage: "ต้องมีรายการอย่างน้อย 3 รายการ" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const ol = doc.querySelector("ol");
    const items = doc.querySelectorAll("ol > li");
    if (!ol) return { isValid: false, validationMessage: "ต้องมี <ol>" };
    if (items.length < 3) return { isValid: false, validationMessage: "ต้องมีอย่างน้อย 3 ขั้นตอน" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const nested = doc.querySelector("ul ul");
    if (!nested) return { isValid: false, validationMessage: "ต้องมีรายการซ้อนกัน" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const ul = doc.querySelector("ul");
    const styleTag = doc.querySelector("style");
    if (!ul) return { isValid: false, validationMessage: "ต้องมี <ul>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("content")) {
      return { isValid: false, validationMessage: "ต้องมี content สำหรับสัญลักษณ์ ✓" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const ul = doc.querySelector("ul");
    const styleTag = doc.querySelector("style");
    if (!ul) return { isValid: false, validationMessage: "ต้องมี <ul>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("display:flex") && !css.includes("display: flex")) {
      return { isValid: false, validationMessage: "เมนูต้องใช้ display: flex" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateTable(doc, level) {
  const order = level.order;
  const table = doc.querySelector("table");
  if (!table) return { isValid: false, validationMessage: "ต้องมี <table>" };

  if (order === 1) {
    const rows = table.querySelectorAll("tr");
    const cells = table.querySelectorAll("td");
    if (rows.length < 2) return { isValid: false, validationMessage: "ตารางต้องมีอย่างน้อย 2 แถว" };
    if (cells.length < 4) return { isValid: false, validationMessage: "ตารางต้องมีข้อมูลอย่างน้อย 4 ช่อง" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const ths = table.querySelectorAll("th");
    if (ths.length < 3) return { isValid: false, validationMessage: "ต้องมีหัวตาราง 3 ช่อง" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const styleTag = doc.querySelector("style");
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("border-radius")) {
      return { isValid: false, validationMessage: "ต้องมี border-radius" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const styleTag = doc.querySelector("style");
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("nth-child")) {
      return { isValid: false, validationMessage: "ต้องมี nth-child สำหรับสลับสีแถว" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const ths = table.querySelectorAll("th");
    if (ths.length < 3) return { isValid: false, validationMessage: "ต้องมีหัวตาราง 3 ช่อง" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateForm(doc, level) {
  const order = level.order;
  const form = doc.querySelector("form");
  if (!form) return { isValid: false, validationMessage: "ต้องมี <form>" };

  if (order === 1) {
    const textInput = form.querySelector("input[type='text']");
    if (!textInput) return { isValid: false, validationMessage: "ต้องมี input type='text'" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const textInput = form.querySelector("input[type='text']");
    const telInput = form.querySelector("input[type='tel']");
    if (!textInput || !telInput) {
      return { isValid: false, validationMessage: "ต้องมี input ชื่อ และ เบอร์โทร" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const textInput = form.querySelector("input[type='text']");
    const textarea = form.querySelector("textarea");
    if (!textInput || !textarea) {
      return { isValid: false, validationMessage: "ต้องมี input และ textarea" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const inputs = form.querySelectorAll("input");
    const button = form.querySelector("button");
    if (inputs.length < 2 || !button) {
      return { isValid: false, validationMessage: "ต้องมี input หลายช่องและปุ่ม" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const button = form.querySelector("button");
    const styleTag = doc.querySelector("style");
    if (!button) return { isValid: false, validationMessage: "ต้องมีปุ่ม" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี CSS ตกแต่งฟอร์ม" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateCssColor(doc, level) {
  const order = level.order;

  if (order === 1) {
    const p = doc.querySelector("p");
    if (!p) return { isValid: false, validationMessage: "ต้องมี <p>" };
    const styleAttr = normalizeCode(p.getAttribute("style") || "");
    if (!styleAttr.includes("color") || !styleAttr.includes("red")) {
      return { isValid: false, validationMessage: "ข้อความต้องเป็นสีแดง" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const div = doc.querySelector("div");
    if (!div) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(div.getAttribute("style") || "");
    if (!styleAttr.includes("background-color")) {
      return { isValid: false, validationMessage: "ต้องกำหนด background-color" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const div = doc.querySelector("div");
    if (!div) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(div.getAttribute("style") || "");
    if (!styleAttr.includes("linear-gradient")) {
      return { isValid: false, validationMessage: "ต้องใช้ linear-gradient" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    const button = doc.querySelector("button");
    const styleTag = doc.querySelector("style");
    if (!button) return { isValid: false, validationMessage: "ต้องมี <button>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("background")) return { isValid: false, validationMessage: "ปุ่มต้องมี background" };
    if (!css.includes("border-radius")) return { isValid: false, validationMessage: "ปุ่มต้องมีขอบมน" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const styleTag = doc.querySelector("style");
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี CSS ของการ์ด" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("linear-gradient")) return { isValid: false, validationMessage: "การ์ดต้องมีพื้นหลังไล่สี" };
    if (!css.includes("border-radius")) return { isValid: false, validationMessage: "การ์ดต้องมีขอบมน" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateCssBox(doc, level) {
  const order = level.order;
  const div = doc.querySelector("div");
  const styleTag = doc.querySelector("style");
  if (!div) return { isValid: false, validationMessage: "ต้องมี <div>" };

  if (order === 1) {
    const styleAttr = normalizeCode(div.getAttribute("style") || "");
    if (!styleAttr.includes("padding") || !styleAttr.includes("10px")) {
      return { isValid: false, validationMessage: "ต้องกำหนด padding: 10px" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    const styleAttr = normalizeCode(div.getAttribute("style") || "");
    if (!styleAttr.includes("margin") || !styleAttr.includes("20px")) {
      return { isValid: false, validationMessage: "ต้องกำหนด margin: 20px" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    const styleAttr = normalizeCode(div.getAttribute("style") || "");
    if (!styleAttr.includes("border")) {
      return { isValid: false, validationMessage: "ต้องกำหนด border" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("box-shadow")) {
      return { isValid: false, validationMessage: "ต้องมี box-shadow" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("padding")) return { isValid: false, validationMessage: "ต้องมี padding" };
    if (!css.includes("margin")) return { isValid: false, validationMessage: "ต้องมี margin" };
    if (!css.includes("border-radius")) return { isValid: false, validationMessage: "ต้องมี border-radius" };
    if (!css.includes("box-shadow")) return { isValid: false, validationMessage: "ต้องมี box-shadow" };
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateCssFlex(doc, level) {
  const order = level.order;
  const firstDiv = doc.querySelector("div");
  const styleTag = doc.querySelector("style");

  if (order === 1) {
    if (!firstDiv) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(firstDiv.getAttribute("style") || "");
    if (!styleAttr.includes("display:flex") && !styleAttr.includes("display: flex")) {
      return { isValid: false, validationMessage: "ต้องใช้ display: flex" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 2) {
    if (!firstDiv) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(firstDiv.getAttribute("style") || "");
    if (!styleAttr.includes("justify-content:center") && !styleAttr.includes("justify-content: center")) {
      return { isValid: false, validationMessage: "ต้องใช้ justify-content: center" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 3) {
    if (!firstDiv) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(firstDiv.getAttribute("style") || "");
    if (!styleAttr.includes("flex-direction:column") && !styleAttr.includes("flex-direction: column")) {
      return { isValid: false, validationMessage: "ต้องใช้ flex-direction: column" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 4) {
    if (!firstDiv) return { isValid: false, validationMessage: "ต้องมี <div>" };
    const styleAttr = normalizeCode(firstDiv.getAttribute("style") || "");
    if (!styleAttr.includes("space-between")) {
      return { isValid: false, validationMessage: "ต้องใช้ justify-content: space-between" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  if (order === 5) {
    const ul = doc.querySelector("ul");
    if (!ul) return { isValid: false, validationMessage: "ต้องมี <ul>" };
    if (!styleTag) return { isValid: false, validationMessage: "ต้องมี <style>" };
    const css = normalizeCode(styleTag.textContent);
    if (!css.includes("display:flex") && !css.includes("display: flex")) {
      return { isValid: false, validationMessage: "เมนูต้องใช้ display: flex" };
    }
    return { isValid: true, validationMessage: "✅ โค้ดถูกต้อง" };
  }

  return { isValid: false, validationMessage: "ไม่พบเงื่อนไขของโจทย์นี้" };
}

function validateByTheme(doc, level) {
  switch (level.themeId) {
    case "heading":
      return validateHeading(doc, level);
    case "text":
      return validateText(doc, level);
    case "list":
      return validateList(doc, level);
    case "table":
      return validateTable(doc, level);
    case "form":
      return validateForm(doc, level);
    case "css-color":
      return validateCssColor(doc, level);
    case "css-box":
      return validateCssBox(doc, level);
    case "css-flex":
      return validateCssFlex(doc, level);
    default:
      return { isValid: false, validationMessage: "ไม่รู้จักประเภทแบบฝึกหัด" };
  }
}

function validateByDOM(htmlCode, level) {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(htmlCode);
    doc.close();

    setTimeout(() => {
      try {
        const result = validateByTheme(doc, level);
        document.body.removeChild(iframe);
        resolve(result);
      } catch (error) {
        document.body.removeChild(iframe);
        resolve({
          isValid: false,
          validationMessage: "เกิดข้อผิดพลาดในการตรวจคำตอบ"
        });
      }
    }, 150);
  });
}

const animations = `
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animations;
  document.head.appendChild(styleSheet);
}

// ========== หน้า 1: กรอกข้อมูลส่วนตัว ==========
function RegisterPage({ firstName, setFirstName, lastName, setLastName, studentId, setStudentId, onStart }) {
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !studentId.trim()) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setError("");
    onStart();
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.registerCard}>
        <div style={styles.logoWrapper}>
          <div style={styles.logoCircle}>
            <span>&lt;/&gt;</span>
          </div>
        </div>

        <h1 style={styles.registerTitle}>HTML & CSS<br />Coding Adventure</h1>
        <p style={styles.registerSubtitle}>เรียนรู้ HTML และ CSS ผ่านการเล่นเกม</p>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <div style={styles.featureText}>8 หัวข้อการเรียนรู้</div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📚</div>
            <div style={styles.featureText}>5 ระดับความยาก</div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🧩</div>
            <div style={styles.featureText}>Scaffolding Fading</div>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏆</div>
            <div style={styles.featureText}>ระบบสะสมคะแนน</div>
          </div>
        </div>

        <div style={styles.registerForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📝</span>
              ชื่อจริง
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="กรุณากรอกชื่อจริง"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📝</span>
              นามสกุล
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="กรุณากรอกนามสกุล"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔢</span>
              เลขที่
            </label>
            <input
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="เลขที่ในห้องเรียน"
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          {error && <div style={styles.errorMsg}>⚠️ {error}</div>}
          <button onClick={handleSubmit} style={styles.startBtn}>
            <span>🚀</span> เริ่มการผจญภัย
          </button>
        </div>

        <div style={styles.totalStats}>
          <div style={styles.totalStatItem}>
            <span style={styles.totalStatNumber}>40</span>
            <span style={styles.totalStatLabel}>แบบฝึกหัด</span>
          </div>
          <div style={styles.totalStatItem}>
            <span style={styles.totalStatNumber}>8</span>
            <span style={styles.totalStatLabel}>หัวข้อ</span>
          </div>
          <div style={styles.totalStatItem}>
            <span style={styles.totalStatNumber}>5</span>
            <span style={styles.totalStatLabel}>ระดับ</span>
          </div>
        </div>

        <div style={styles.registerFooter}>
          <p>พัฒนาโดย นางสาวพิทยาภรณ์ การะเวก</p>
          <p>มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี | ปีการศึกษา 2569</p>
        </div>
      </div>
    </div>
  );
}

// ========== หน้า 2: เลือกหัวข้อที่อยากเรียน ==========
function ThemeSelectPage({ themes, onSelectTheme, completedLevels }) {
  const getThemeProgress = (themeId) => {
    const themeLevels = LEVELS.filter((l) => l.themeId === themeId);
    const completed = themeLevels.filter((l) => completedLevels.includes(l.id)).length;
    return {
      completed,
      total: themeLevels.length,
      percent: themeLevels.length > 0 ? (completed / themeLevels.length) * 100 : 0
    };
  };

  return (
    <div style={styles.themeSelectContainer}>
      <div style={styles.themeSelectHeader}>
        <div style={styles.headerBadge}>🎮</div>
        <h1 style={styles.themeSelectTitle}>เลือกหัวข้อที่อยากเรียน</h1>
        <p style={styles.themeSelectSubtitle}>แต่ละหัวข้อมี 5 ระดับ พร้อมระบบลดความช่วยเหลือ (Scaffolding Fading)</p>
      </div>

      <div style={styles.themeGrid}>
        {themes.map((theme, idx) => {
          const progress = getThemeProgress(theme.id);
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme.id)}
              style={{ ...styles.themeCard, animationDelay: `${idx * 0.05}s` }}
            >
              <div style={{ ...styles.themeCardBorder, background: theme.color }} />
              <div style={styles.themeCardContent}>
                <div style={{ ...styles.themeIcon, background: `${theme.color}15`, color: theme.color }}>
                  {theme.icon}
                </div>
                <div style={styles.themeInfo}>
                  <h3 style={styles.themeName}>{theme.name}</h3>
                  <p style={styles.themeDesc}>{theme.description}</p>
                </div>
              </div>

              <div style={styles.progressWrapper}>
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${progress.percent}%`, background: theme.color }} />
                </div>
                <div style={styles.progressStats}>
                  <span>📊 {progress.completed}/{progress.total} ข้อ</span>
                  <span>🎯 {Math.round(progress.percent)}%</span>
                </div>
              </div>

              <div style={styles.themeTags}>
                <span style={styles.tag}>⭐ 5 ระดับ</span>
                <span style={styles.tag}>🧩 Scaffolding</span>
                <span style={{ ...styles.tag, background: `${theme.color}15`, color: theme.color }}>
                  {theme.icon}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={styles.scaffoldingGuide}>
        <h4>📚 ระดับความช่วยเหลือ (Scaffolding Fading)</h4>
        <div style={styles.levelGuide}>
          <div style={styles.levelItem}>
            <span style={styles.levelIcon}>🧩</span>
            <div>
              <strong>ระดับ 1</strong>
              <p>ลากบล็อกเต็มรูปแบบ</p>
            </div>
          </div>
          <div style={styles.levelItem}>
            <span style={styles.levelIcon}>⚠️</span>
            <div>
              <strong>ระดับ 2</strong>
              <p>ลากบล็อกมีช่องว่าง</p>
            </div>
          </div>
          <div style={styles.levelItem}>
            <span style={styles.levelIcon}>✏️</span>
            <div>
              <strong>ระดับ 3</strong>
              <p>โค้ดโครงร่างให้เติม</p>
            </div>
          </div>
          <div style={styles.levelItem}>
            <span style={styles.levelIcon}>📝</span>
            <div>
              <strong>ระดับ 4</strong>
              <p>เขียนโค้ดตามโจทย์</p>
            </div>
          </div>
          <div style={styles.levelItem}>
            <span style={styles.levelIcon}>💪</span>
            <div>
              <strong>ระดับ 5</strong>
              <p>อิสระเต็มที่</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== หน้า 3: เล่นเกม ==========
function GamePage({
  theme, levels, currentLevelIndex, setCurrentLevelIndex,
  firstName, lastName, studentId, score, setScore,
  completedLevels, setCompletedLevels,
  onBackToThemes, onThemeComplete
}) {
  const [mode, setMode] = useState("block");
  const [pool, setPool] = useState([]);
  const [workspace, setWorkspace] = useState([]);
  const [codeEditorValue, setCodeEditorValue] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [status, setStatus] = useState("playing");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [isDropping, setIsDropping] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const timerRef = useRef(null);

  const currentLevel = levels[currentLevelIndex];
  const fullName = `${firstName} ${lastName}`.trim();
  const themeProgress = {
    completed: levels.filter((l) => completedLevels.includes(l.id)).length,
    total: levels.length,
    percent: levels.length > 0 ? (levels.filter((l) => completedLevels.includes(l.id)).length / levels.length) * 100 : 0
  };

  const codeText = useMemo(() => {
    if (
      currentLevel &&
      (
        currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
        currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS
      )
    ) {
      return workspace.join("");
    }
    return codeEditorValue;
  }, [workspace, codeEditorValue, currentLevel]);

  const previewDoc = useMemo(() => buildPreview(codeText), [codeText]);

  useEffect(() => {
    if (currentLevel) {
      initLevel(currentLevelIndex);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentLevelIndex, currentLevel?.id]);

  useEffect(() => {
    if (status !== "playing" || !currentLevel) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setStatus("timeout");
          setShowTimeoutModal(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, currentLevelIndex, currentLevel]);

  function showErrorNotification(msg) {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  }

  function showSuccessNotification(msg) {
    setErrorMessage(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  }

  function initLevel(index) {
    const lvl = levels[index];
    if (!lvl) return;

    setSecondsLeft(lvl.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_5_FREE ? 300 : 180);
    setMessage(`ข้อ ${lvl.order}: ${lvl.goal}`);
    setFeedback([`💡 ${lvl.hint}`, `📦 ${lvl.context}`]);
    setStatus("playing");
    setShowTimeoutModal(false);
    setShowCompleteModal(false);

    if (
      lvl.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
      lvl.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS
    ) {
      setMode("block");
      const blocks = getBlocksForTheme(lvl.themeId, lvl.order - 1, lvl.scaffoldingLevel);
      setPool(shuffle(blocks && blocks.length > 0 ? blocks : [lvl.expectedCode]));
      setWorkspace([]);
      setCodeEditorValue("");
    } else {
      setMode("code");
      setPool([]);
      setWorkspace([]);
      setCodeEditorValue(lvl.starterCode || "");
    }

    setIsInitialized(true);
  }

  async function checkAnswer() {
    if (!currentLevel) return;

    let currentCode = "";
    if (
      currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
      currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS
    ) {
      currentCode = workspace.join("");
    } else {
      currentCode = codeEditorValue;
    }

    const fullHtml = buildPreview(currentCode);
    const result = await validateByDOM(fullHtml, currentLevel);

    if (!result.isValid) {
      setMessage(`❌ ${result.validationMessage}`);
      showErrorNotification(`❌ ${result.validationMessage}`);
      return;
    }

    const timeBonus = Math.max(10, secondsLeft);
    const levelScore = 100;
    const nextScore = score + levelScore + timeBonus;

    setScore(nextScore);
    setCompletedLevels((prev) => (prev.includes(currentLevel.id) ? prev : [...prev, currentLevel.id]));
    setMessage(`✅ ผ่านข้อ ${currentLevel.order} สำเร็จ!`);
    setFeedback([`🎉 ได้ ${levelScore + timeBonus} คะแนน (โบนัสเวลา ${timeBonus})`]);
    showSuccessNotification(`🎉 ผ่านข้อ ${currentLevel.order}!`);

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });

    nextLevel(nextScore);
  }

  async function testCurrentCode() {
    if (!currentLevel) return;

    let currentCode = "";
    if (
      currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
      currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS
    ) {
      currentCode = workspace.join("");
    } else {
      currentCode = codeEditorValue;
    }

    const fullHtml = buildPreview(currentCode);
    const result = await validateByDOM(fullHtml, currentLevel);

    if (result.isValid) {
      showSuccessNotification(`✅ ${result.validationMessage}`);
    } else {
      showErrorNotification(`❌ ${result.validationMessage}`);
      setFeedback([`🔍 ${result.validationMessage}`, `💡 ${currentLevel.hint}`]);
    }
  }

  function nextLevel() {
    if (currentLevelIndex === levels.length - 1) {
      setStatus("won");
      setShowCompleteModal(true);
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.65 } });
      return;
    }

    const nextIndex = currentLevelIndex + 1;
    setCurrentLevelIndex(nextIndex);
  }

  function onDragStart(source, index) {
    if (status !== "playing" || mode !== "block") return;
    setDragItem({ source, index });
  }

  function onDragEnd() {
    setDragItem(null);
  }

  function handleWorkspaceDrop(insertAt) {
    if (!dragItem || isDropping || status !== "playing" || mode !== "block") return;
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
      showSuccessNotification("➕ เพิ่มบล็อก");
    }

    if (source === "workspace") {
      setWorkspace((prevWs) => {
        if (index < 0 || index >= prevWs.length) return prevWs;
        const item = prevWs[index];
        const nextWs = prevWs.filter((_, i) => i !== index);
        let safeIndex = insertAt;
        if (index < safeIndex) safeIndex -= 1;
        safeIndex = Math.min(Math.max(safeIndex, 0), nextWs.length);
        nextWs.splice(safeIndex, 0, item);
        return nextWs;
      });
    }

    setDragItem(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  function handlePoolDrop() {
    if (!dragItem || isDropping || status !== "playing" || mode !== "block") return;
    if (dragItem.source !== "workspace") return;

    setIsDropping(true);
    setWorkspace((prevWs) => {
      if (dragItem.index < 0 || dragItem.index >= prevWs.length) return prevWs;
      const item = prevWs[dragItem.index];
      const nextWs = prevWs.filter((_, i) => i !== dragItem.index);
      setPool((prevPool) => [...prevPool, item]);
      return nextWs;
    });
    showErrorNotification("🗑️ ลบบล็อก");
    setDragItem(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  function handleReset() {
    initLevel(currentLevelIndex);
  }

  function handleBackToThemes() {
    if (timerRef.current) clearInterval(timerRef.current);
    onBackToThemes();
  }

  function handleComplete() {
    onThemeComplete(score);
  }

  if (!currentLevel || !isInitialized) {
    return (
      <div style={styles.gameBg}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  const scaffoldingNames = {
    [SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS]: { name: "🧩 ระดับ 1: ลากบล็อกเต็มรูปแบบ", desc: "ลากบล็อกมาวางเรียงตามลำดับ", color: "#10b981" },
    [SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS]: { name: "⚠️ ระดับ 2: ลากบล็อกมีช่องว่าง", desc: "เติมคำสั่งในช่องว่างให้ถูกต้อง", color: "#f59e0b" },
    [SCAFFOLDING_LEVELS.LEVEL_3_SKELETON]: { name: "✏️ ระดับ 3: โค้ดโครงร่าง", desc: "เติมคำสั่งในช่องว่าง (______)", color: "#8b5cf6" },
    [SCAFFOLDING_LEVELS.LEVEL_4_BLANK]: { name: "📝 ระดับ 4: เขียนโค้ดเอง", desc: "เขียนโค้ดทั้งหมดจากโจทย์", color: "#ec4899" },
    [SCAFFOLDING_LEVELS.LEVEL_5_FREE]: { name: "💪 ระดับ 5: อิสระเต็มที่", desc: "ออกแบบและเขียนโค้ดได้อิสระ", color: "#ef4444" }
  };
  const scaffoldingInfo = scaffoldingNames[currentLevel.scaffoldingLevel];

  return (
    <div style={styles.gameBg}>
      {showError && <div style={styles.errorNotification}>⚠️ {errorMessage}</div>}
      {showSuccess && <div style={styles.successNotification}>🎉 {errorMessage}</div>}

      {showTimeoutModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>😭</div>
            <h2>หมดเวลา!</h2>
            <p>คุณใช้เวลาทำแบบฝึกหัดเกินกำหนด</p>
            <button onClick={handleBackToThemes} style={styles.modalButton}>🏠 กลับไปเลือกหัวข้อ</button>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalIcon}>🏆🎉</div>
            <h2>ยินดีด้วย! จบหัวข้อแล้ว!</h2>
            <p>คุณเรียนรู้ {theme.name} ครบ 5 ข้อแล้ว!</p>
            <div style={styles.scoreSummary}>
              <div>✅ ผ่านครบ {themeProgress.completed}/5 ข้อ</div>
              <div>⭐ คะแนนรวม <strong style={{ color: "#f59e0b", fontSize: "24px" }}>{score}</strong> คะแนน</div>
            </div>
            <button onClick={handleComplete} style={styles.modalButtonSuccess}>🏆 เลือกหัวข้ออื่น 🏆</button>
          </div>
        </div>
      )}

      <div style={styles.gameShell}>
        <div style={styles.topBar}>
          <div style={styles.playerInfo}>
            <div style={styles.playerName}>{fullName} <span style={styles.noBadge}>#{studentId}</span></div>
            <div style={{ ...styles.themeBadge, background: theme.color }}>{theme.icon} {theme.name}</div>
          </div>
          <div style={styles.topStats}>
            <button onClick={() => setShowLearningPopup(true)} style={styles.learningBtn}>📖 เอกสาร</button>
            <div style={styles.statPill}>⭐ {score}</div>
            <div style={styles.statPill}>⏱️ {secondsLeft}s</div>
            <div style={styles.statPill}>📋 {currentLevel.order}/5</div>
          </div>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${themeProgress.percent}%` }} />
          </div>
          <div style={styles.progressText}>
            <span>📊 ความคืบหน้า {theme.name}</span>
            <span>{Math.round(themeProgress.percent)}%</span>
          </div>
        </div>

        <div style={{ ...styles.scaffoldingCard, borderLeftColor: scaffoldingInfo.color }}>
          <div style={styles.scaffoldingCardHeader}>
            <span style={{ ...styles.scaffoldingBadge, background: scaffoldingInfo.color }}>
              {scaffoldingInfo.name.split(":")[0]}
            </span>
            <span>ข้อ {currentLevel.order}/5</span>
          </div>
          <div style={styles.scaffoldingCardContent}>
            <span style={{ fontSize: 24 }}>
              {currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS && "🧩"}
              {currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS && "⚠️"}
              {currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_3_SKELETON && "✏️"}
              {currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_4_BLANK && "📝"}
              {currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_5_FREE && "💪"}
            </span>
            <div>
              <div style={{ fontWeight: "bold" }}>{scaffoldingInfo.name}</div>
              <div style={{ fontSize: 13, color: "#666" }}>{scaffoldingInfo.desc}</div>
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.leftPanel}>
            <div style={styles.panelCard}>
              <div style={styles.levelTitle}>ข้อ {currentLevel.order}: {currentLevel.title}</div>
              <div style={styles.levelMeta}>
                <span style={styles.difficultyBadge(currentLevel.difficulty)}>{currentLevel.difficulty}</span>
                <span style={styles.contextBadge}>📦 {currentLevel.context}</span>
              </div>
              <div style={styles.goalText}>🎯 {currentLevel.goal}</div>
              <div style={styles.hintText}>💡 Hint: {currentLevel.hint}</div>
              {feedback.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  {feedback.map((item, idx) => (
                    <div key={idx} style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{item}</div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.editorCard}>
              <div style={styles.cardTitle}>
                {(currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
                  currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS)
                  ? "🧩 พื้นที่ลากบล็อก"
                  : "✏️ โค้ดเอดิเตอร์"}
              </div>

              {(currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
                currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS) ? (
                <>
                  <div style={styles.dragSectionTitle}>📚 บล็อกคำสั่ง ({pool.length})</div>
                  <div
                    style={styles.blockWrap}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handlePoolDrop}
                  >
                    {pool.length === 0 ? (
                      <div style={styles.emptyBlockArea}>✅ ใช้บล็อกครบแล้ว!</div>
                    ) : (
                      pool.map((block, idx) => {
                        const c = getBlockStyle(block, false);
                        const isBlank = block.includes("___") || block.includes("______");
                        return (
                          <div
                            key={idx}
                            draggable={status === "playing"}
                            onDragStart={() => onDragStart("pool", idx)}
                            onDragEnd={onDragEnd}
                            style={{
                              ...styles.blockBtn,
                              background: isBlank ? "#fef3c7" : c.bg,
                              borderColor: isBlank ? "#f59e0b" : c.border,
                              color: c.text,
                              border: isBlank ? "2px dashed #f59e0b" : `2px solid ${c.border}`
                            }}
                          >
                            {isBlank && <span style={styles.blankIcon}>❓</span>}
                            {block.length > 40 ? block.substring(0, 40) + "..." : block}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div style={styles.dragSectionTitle}>🔧 พื้นที่จัดเรียง ({workspace.length})</div>
                  <div style={styles.answerZone} onDragOver={(e) => e.preventDefault()}>
                    {workspace.length === 0 ? (
                      <div
                        style={styles.emptyDropZone}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleWorkspaceDrop(0);
                        }}
                      >
                        🎯 ลากบล็อกมาวางที่นี่
                      </div>
                    ) : (
                      <div style={styles.workspaceContainer}>
                        {workspace.map((block, idx) => {
                          const c = getBlockStyle(block, true);
                          const isBlank = block.includes("___") || block.includes("______");
                          return (
                            <div key={idx} style={styles.workspaceItemWrapper}>
                              <div
                                draggable={status === "playing"}
                                onDragStart={() => onDragStart("workspace", idx)}
                                onDragEnd={onDragEnd}
                                style={{
                                  ...styles.blockBtn,
                                  ...styles.workspaceBlock,
                                  background: isBlank ? "#fef3c7" : c.bg,
                                  borderColor: isBlank ? "#f59e0b" : c.border,
                                  color: c.text,
                                  border: isBlank ? "2px dashed #f59e0b" : `2px solid ${c.border}`
                                }}
                              >
                                <span style={styles.blockNumber}>{idx + 1}</span>
                                {isBlank && <span style={styles.blankIcon}>❓</span>}
                                {block.length > 40 ? block.substring(0, 40) + "..." : block}
                                <span style={styles.dragHandle}>⋮⋮</span>
                              </div>
                            </div>
                          );
                        })}
                        <div
                          style={styles.appendDropZone}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleWorkspaceDrop(workspace.length);
                          }}
                        >
                          + เพิ่มบล็อกต่อท้าย
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={styles.codePreviewSection}>
                    <div style={styles.codePreviewTitle}>📝 โค้ดที่ได้</div>
                    <pre style={styles.codePreviewBlock}>
                      <code>{workspace.length > 0 ? workspace.join("\n") : "// ยังไม่มีบล็อก"}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <textarea
                  value={codeEditorValue}
                  onChange={(e) => setCodeEditorValue(e.target.value)}
                  style={styles.codeTextarea}
                  placeholder={
                    currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_3_SKELETON
                      ? "เติมคำสั่งในช่องว่าง (______)..."
                      : "เขียนโค้ด HTML/CSS ของคุณที่นี่..."
                  }
                  spellCheck={false}
                />
              )}

              <div style={styles.actionRow}>
                <button onClick={checkAnswer} style={styles.primaryBtn}>✅ ตรวจคำตอบ</button>
                <button onClick={testCurrentCode} style={styles.testBtn}>🔍 ทดสอบ</button>
                {(currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_1_FULL_BLOCKS ||
                  currentLevel.scaffoldingLevel === SCAFFOLDING_LEVELS.LEVEL_2_PARTIAL_BLOCKS) && (
                  <button onClick={handleReset} style={styles.secondaryBtn}>🔄 รีเซ็ต</button>
                )}
                <button onClick={handleBackToThemes} style={styles.secondaryBtn}>🏠 กลับเลือกหัวข้อ</button>
              </div>

              <div style={styles.messageBox}>
                <strong>📢 สถานะ:</strong> {message || "รอการตรวจคำตอบ"}
              </div>
            </div>
          </div>

          <div style={styles.rightPanel}>
            <div style={styles.previewCard}>
              <div style={styles.cardTitle}>👁️ ตัวอย่างผลลัพธ์</div>
              <iframe
                title="preview"
                srcDoc={previewDoc}
                sandbox="allow-same-origin allow-scripts"
                style={styles.previewFrame}
              />
            </div>
          </div>
        </div>
      </div>

      {showLearningPopup && (
        <div style={styles.modalOverlay} onClick={() => setShowLearningPopup(false)}>
          <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.popupClose} onClick={() => setShowLearningPopup(false)}>✕</button>
            <div style={styles.popupHeader}>
              <span style={styles.popupIcon}>{currentLevel.themeIcon}</span>
              <h2>{currentLevel.themeName}</h2>
            </div>
            <div style={styles.learningSection}>
              <h3>🎯 เป้าหมาย</h3>
              <p>{currentLevel.goal}</p>
              <div style={styles.contextBox}>📦 {currentLevel.context}</div>
            </div>
            <div style={styles.learningSection}>
              <h3>💡 แนวคิด</h3>
              <div style={styles.conceptCard}>{currentLevel.learningContent.concept}</div>
            </div>
            <div style={styles.learningSection}>
              <h3>🤔 ทำไมต้องใช้?</h3>
              <div style={styles.whyCard}>{currentLevel.learningContent.why}</div>
            </div>
            <div style={styles.learningSection}>
              <h3>⚙️ วิธีการใช้งาน</h3>
              <div style={styles.howCard}>{currentLevel.learningContent.how}</div>
            </div>
            <div style={styles.learningSection}>
              <h3>📝 ตัวอย่าง</h3>
              <div style={styles.exampleCard}>{currentLevel.learningContent.example}</div>
            </div>
            <button style={styles.gotItBtn} onClick={() => setShowLearningPopup(false)}>เข้าใจแล้ว</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== Main App ==========
export default function App() {
  const [page, setPage] = useState("register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  const themeLevels = selectedTheme ? LEVELS.filter((l) => l.themeId === selectedTheme) : [];
  const selectedThemeObj = THEMES.find((t) => t.id === selectedTheme);

  useEffect(() => {
    const raw = localStorage.getItem("html-css-leaderboard");
    if (raw) {
      try {
        setLeaderboard(JSON.parse(raw));
      } catch {
        setLeaderboard([]);
      }
    }
  }, []);

  function handleRegisterComplete() {
    setPage("themes");
  }

  function handleSelectTheme(themeId) {
    setSelectedTheme(themeId);
    setCurrentLevelIndex(0);
    setScore(0);
    setCompletedLevels([]);
    setPage("game");
  }

  function handleBackToThemes() {
    setPage("themes");
    setSelectedTheme(null);
    setCurrentLevelIndex(0);
  }

  function handleThemeComplete(finalScore) {
    const entry = {
      id: Date.now(),
      name: `${firstName} ${lastName}`,
      no: studentId,
      theme: selectedThemeObj?.name,
      score: finalScore,
      levelsPassed: themeLevels.length,
      date: new Date().toLocaleDateString("th-TH")
    };
    const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem("html-css-leaderboard", JSON.stringify(updated));
    setPage("themes");
    setSelectedTheme(null);
    setCurrentLevelIndex(0);
    setScore(0);
    setCompletedLevels([]);
  }

  if (page === "register") {
    return (
      <RegisterPage
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        studentId={studentId}
        setStudentId={setStudentId}
        onStart={handleRegisterComplete}
      />
    );
  }

  if (page === "themes") {
    return (
      <ThemeSelectPage
        themes={THEMES}
        onSelectTheme={handleSelectTheme}
        completedLevels={completedLevels}
      />
    );
  }

  if (page === "game" && selectedThemeObj) {
    return (
      <GamePage
        key={selectedTheme}
        theme={selectedThemeObj}
        levels={themeLevels}
        currentLevelIndex={currentLevelIndex}
        setCurrentLevelIndex={setCurrentLevelIndex}
        firstName={firstName}
        lastName={lastName}
        studentId={studentId}
        score={score}
        setScore={setScore}
        completedLevels={completedLevels}
        setCompletedLevels={setCompletedLevels}
        onBackToThemes={handleBackToThemes}
        onThemeComplete={handleThemeComplete}
      />
    );
  }

  return null;
}

const styles = {
  pageContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  registerCard: {
    background: "white",
    borderRadius: 40,
    padding: 40,
    maxWidth: 500,
    width: "100%",
    boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
    animation: "fadeInUp 0.6s ease-out"
  },
  logoWrapper: { textAlign: "center", marginBottom: 24 },
  logoCircle: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderRadius: 25,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    boxShadow: "0 10px 25px rgba(102,126,234,0.3)"
  },
  registerTitle: {
    fontSize: 32,
    fontWeight: 800,
    textAlign: "center",
    marginBottom: 12,
    color: "#1f2937",
    letterSpacing: "-0.5px"
  },
  registerSubtitle: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
    marginBottom: 32
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
    marginBottom: 32
  },
  featureCard: {
    background: "#f3f4f6",
    borderRadius: 16,
    padding: 12,
    textAlign: "center",
    transition: "transform 0.2s",
    cursor: "default"
  },
  featureIcon: { fontSize: 24, marginBottom: 8 },
  featureText: { fontSize: 13, fontWeight: 500, color: "#374151" },
  registerForm: { marginBottom: 24 },
  inputGroup: { marginBottom: 20 },
  label: { display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#374151" },
  labelIcon: { marginRight: 8 },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
    borderRadius: 16,
    border: "2px solid #e5e7eb",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  errorMsg: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
    padding: 12,
    background: "#fee",
    borderRadius: 12
  },
  startBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: 40,
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  totalStats: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: 24,
    padding: "16px 0",
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb"
  },
  totalStatItem: { textAlign: "center" },
  totalStatNumber: { display: "block", fontSize: 28, fontWeight: 800, color: "#667eea" },
  totalStatLabel: { fontSize: 12, color: "#6b7280", marginTop: 4 },
  registerFooter: { textAlign: "center", fontSize: 12, color: "#9ca3af" },

  themeSelectContainer: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: 40
  },
  themeSelectHeader: { textAlign: "center", marginBottom: 48, color: "white" },
  headerBadge: { fontSize: 48, marginBottom: 16 },
  themeSelectTitle: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 12,
    letterSpacing: "-1px"
  },
  themeSelectSubtitle: { fontSize: 16, opacity: 0.9 },
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: 24,
    maxWidth: 1200,
    margin: "0 auto 48px"
  },
  themeCard: {
    background: "white",
    borderRadius: 24,
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    textAlign: "left",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    position: "relative",
    animation: "slideIn 0.5s ease-out forwards",
    opacity: 0,
    transform: "translateX(-20px)"
  },
  themeCardBorder: { height: 4, width: "100%" },
  themeCardContent: { display: "flex", alignItems: "center", gap: 16, padding: 20 },
  themeIcon: {
    width: 56,
    height: 56,
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28
  },
  themeInfo: { flex: 1 },
  themeName: { fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#1f2937" },
  themeDesc: { fontSize: 13, color: "#6b7280", margin: 0 },
  progressWrapper: { padding: "0 20px 16px 20px" },
  progressBar: { background: "#e5e7eb", borderRadius: 10, height: 8, overflow: "hidden" },
  progressFill: { height: "100%", transition: "width 0.3s" },
  progressStats: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 12,
    color: "#6b7280"
  },
  themeTags: { display: "flex", gap: 8, padding: "0 20px 20px 20px" },
  tag: { background: "#f3f4f6", padding: "4px 12px", borderRadius: 20, fontSize: 11, color: "#374151" },
  scaffoldingGuide: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: 24,
    padding: 24,
    maxWidth: 1000,
    margin: "0 auto",
    color: "white"
  },
  levelGuide: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 16,
    marginTop: 16
  },
  levelItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 13,
    background: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 12
  },
  levelIcon: { fontSize: 24 },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh"
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    border: "4px solid #e5e7eb",
    borderTopColor: "#667eea",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },

  gameBg: { minHeight: "100vh", padding: 20, background: "#f0f4f8" },
  gameShell: { maxWidth: 1400, margin: "0 auto" },
  errorNotification: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#ef4444",
    color: "white",
    padding: "12px 24px",
    borderRadius: 12,
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out"
  },
  successNotification: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#10b981",
    color: "white",
    padding: "12px 24px",
    borderRadius: 12,
    zIndex: 1000,
    animation: "slideIn 0.3s ease-out"
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12
  },
  playerInfo: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  playerName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#1f2937",
    background: "white",
    padding: "8px 16px",
    borderRadius: 40
  },
  noBadge: { background: "#e5e7eb", padding: "2px 8px", borderRadius: 20, fontSize: 12, marginLeft: 8 },
  themeBadge: { padding: "8px 16px", borderRadius: 40, fontSize: 14, color: "white", fontWeight: 600 },
  topStats: { display: "flex", gap: 12, flexWrap: "wrap" },
  learningBtn: { background: "#8b5cf6", color: "white", border: "none", padding: "8px 16px", borderRadius: 40, cursor: "pointer", fontWeight: 600 },
  statPill: { background: "white", padding: "8px 16px", borderRadius: 40, fontSize: 14, fontWeight: 600, color: "#374151" },
  progressContainer: { marginBottom: 20 },
  progressBar2: { background: "#e5e7eb", borderRadius: 20, height: 12, overflow: "hidden" },
  progressText: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 14, color: "#6b7280" },
  scaffoldingCard: {
    background: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderLeft: "4px solid",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  },
  scaffoldingCardHeader: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  scaffoldingBadge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, color: "white" },
  scaffoldingCardContent: { display: "flex", alignItems: "center", gap: 12 },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 400px", gap: 20 },
  leftPanel: { display: "flex", flexDirection: "column", gap: 20 },
  rightPanel: { display: "flex", flexDirection: "column", gap: 20 },
  panelCard: { background: "white", borderRadius: 20, padding: 20 },
  editorCard: { background: "white", borderRadius: 20, padding: 20 },
  previewCard: { background: "white", borderRadius: 20, padding: 20 },
  cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" },
  levelTitle: { fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 8 },
  levelMeta: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  difficultyBadge: (difficulty) => ({
    background: difficulty.includes("⭐⭐⭐⭐⭐")
      ? "#fee2e2"
      : difficulty.includes("⭐⭐⭐")
      ? "#fef3c7"
      : "#d1fae5",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600
  }),
  contextBadge: { background: "#e0e7ff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  goalText: { fontSize: 16, color: "#4b5563", marginBottom: 12 },
  hintText: { fontSize: 14, color: "#6b7280", fontStyle: "italic" },
  dragSectionTitle: { fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 12, color: "#374151" },
  blockWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    padding: 16,
    background: "#f9fafb",
    borderRadius: 16,
    minHeight: 100
  },
  blockBtn: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "2px solid",
    cursor: "grab",
    userSelect: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    fontWeight: 500
  },
  blankIcon: {
    fontSize: 12,
    background: "#f59e0b",
    color: "white",
    borderRadius: "50%",
    width: 20,
    height: 20,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center"
  },
  answerZone: {
    background: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
    border: "2px dashed #cbd5e1"
  },
  emptyDropZone: { display: "flex", alignItems: "center", justifyContent: "center", height: 150, color: "#9ca3af", fontSize: 14 },
  emptyBlockArea: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%", color: "#10b981", fontSize: 14 },
  workspaceContainer: { display: "flex", flexDirection: "column", gap: 8 },
  workspaceItemWrapper: { position: "relative" },
  workspaceBlock: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  blockNumber: { background: "#e5e7eb", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 },
  dragHandle: { cursor: "grab", opacity: 0.5, fontSize: 18 },
  appendDropZone: {
    marginTop: 12,
    padding: 12,
    textAlign: "center",
    background: "#f3f4f6",
    borderRadius: 12,
    color: "#6b7280",
    fontSize: 13,
    cursor: "pointer",
    border: "1px dashed #cbd5e1"
  },
  codePreviewSection: { marginTop: 16, padding: 12, background: "#1e293b", borderRadius: 12 },
  codePreviewTitle: { fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8 },
  codePreviewBlock: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 8,
    overflow: "auto",
    fontSize: 12,
    color: "#e2e8f0",
    fontFamily: "monospace"
  },
  codeTextarea: {
    width: "100%",
    minHeight: 300,
    padding: 16,
    fontSize: 14,
    fontFamily: "monospace",
    borderRadius: 12,
    border: "2px solid #e5e7eb",
    resize: "vertical",
    background: "#1e293b",
    color: "#e2e8f0"
  },
  actionRow: { display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" },
  primaryBtn: {
    flex: 1,
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14
  },
  testBtn: {
    flex: 1,
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14
  },
  secondaryBtn: {
    background: "#6b7280",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14
  },
  messageBox: { marginTop: 16, padding: 16, background: "#f3f4f6", borderRadius: 12, fontSize: 14 },
  previewFrame: { width: "100%", height: 400, border: "1px solid #e5e7eb", borderRadius: 12, background: "white" },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3000
  },
  modalContent: { background: "white", borderRadius: 32, padding: 40, textAlign: "center", maxWidth: 400, width: "90%" },
  modalIcon: { fontSize: 64, marginBottom: 20 },
  modalButton: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: 40,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    width: "100%",
    marginTop: 20
  },
  modalButtonSuccess: {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: 40,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    width: "100%",
    marginTop: 20
  },
  scoreSummary: { background: "#f3f4f6", borderRadius: 16, padding: 16, margin: "20px 0" },

  popupContent: {
    background: "white",
    borderRadius: 32,
    maxWidth: 600,
    width: "90%",
    maxHeight: "85vh",
    overflow: "auto",
    padding: 32,
    position: "relative"
  },
  popupClose: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "#f3f4f6",
    border: "none",
    width: 32,
    height: 32,
    borderRadius: 16,
    cursor: "pointer",
    fontSize: 18
  },
  popupHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  popupIcon: { fontSize: 40 },
  learningSection: { marginBottom: 20 },
  conceptCard: { background: "#dbeafe", padding: 16, borderRadius: 16 },
  whyCard: { background: "#fef3c7", padding: 16, borderRadius: 16 },
  howCard: { background: "#d1fae5", padding: 16, borderRadius: 16, fontFamily: "monospace" },
  exampleCard: { background: "#f3e8ff", padding: 16, borderRadius: 16, fontFamily: "monospace" },
  contextBox: { background: "#e0e7ff", padding: 12, borderRadius: 12, marginTop: 12, fontSize: 14 },
  gotItBtn: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "14px 32px",
    borderRadius: 40,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
    width: "100%"
  }
};

if (typeof document !== "undefined") {
  const styleSheet2 = document.createElement("style");
  styleSheet2.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet2);
}

const LEVELS = generateAllLevels();
