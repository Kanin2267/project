import React, { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";

// ========== ระดับความยาก (ปรับให้ง่ายทั้งหมด) ==========
const LEVELS = [
  // ด่าน 1 (คี่): บล็อก
  {
    id: 1,
    title: "ด่าน 1: หัวข้อแรกของฉัน",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างหัวข้อ h1 ที่แสดงคำว่า 'สวัสดีโลก'",
    hint: "ใช้ <h1> และ </h1> ครอบข้อความ",
    blocks: ["<h1>", "สวัสดีโลก", "</h1>"],
    expectedCode: "<h1>สวัสดีโลก</h1>",
    starterCode: "",
    previousKnowledge: [],
    newKnowledge: "Tag h1 คือหัวข้อหลักของหน้าเว็บ",
    learningContent: {
      concept: "🏷️ Tag h1 คือแท็กที่ใช้สำหรับหัวข้อหลักของหน้าเว็บ",
      why: "ทำไมต้องใช้? เพราะช่วยให้รู้ว่าเนื้อหาสำคัญ และผู้ใช้เห็นเป็นหัวข้อใหญ่",
      how: "วิธีใช้: ใส่ข้อความที่ต้องการระหว่าง <h1> และ </h1>",
      example: "ตัวอย่าง: <h1>ชื่อเว็บไซต์</h1> จะแสดงเป็นหัวข้อใหญ่",
      practice: "💡 ลองลาก <h1> มาวาง แล้วใส่ข้อความ 'สวัสดีโลก' ระหว่างแท็ก"
    }
  },
  // ด่าน 2 (คู่): เขียนโค้ดเอง
  {
    id: 2,
    title: "ด่าน 2: หัวข้อรองของฉัน",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างหัวข้อ h2 ที่แสดงคำว่า 'เรียนรู้การเขียนโค้ด'",
    hint: "ใช้ <h2> และ </h2> ครอบข้อความ เหมือน h1 แต่เล็กกว่า",
    blocks: ["<h2>", "เรียนรู้การเขียนโค้ด", "</h2>"],
    expectedCode: "<h2>เรียนรู้การเขียนโค้ด</h2>",
    starterCode: "",
    previousKnowledge: ["Tag h1"],
    newKnowledge: "Tag h2 คือหัวข้อย่อย",
    learningContent: {
      concept: "📝 Tag h2 ใช้สำหรับหัวข้อย่อย รองจาก h1",
      why: "ทำไมต้องใช้? เพื่อแบ่งเนื้อหาเป็นส่วนย่อยๆ ให้อ่านง่าย",
      how: "ใช้เหมือน h1 แต่ตัวอักษรจะเล็กกว่า",
      example: "<h2>หัวข้อย่อย</h2>",
      practice: "💪 ลองสร้าง h2 ที่มีข้อความ 'เรียนรู้การเขียนโค้ด'"
    }
  },
  // ด่าน 3 (คี่): บล็อก
  {
    id: 3,
    title: "ด่าน 3: ย่อหน้าสีสัน",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างย่อหน้าข้อความ 'HTML สนุกมาก' และทำตัวอักษรสีแดง",
    hint: "ใช้ <style> กำหนดสีแดงให้ p",
    blocks: ["<style>", "p { color: red; }", "</style>", "<p>HTML สนุกมาก</p>"],
    expectedCode: "<style>p { color: red; }</style><p>HTML สนุกมาก</p>",
    starterCode: "",
    previousKnowledge: ["Tag HTML พื้นฐาน"],
    newKnowledge: "การเปลี่ยนสีตัวอักษรด้วย CSS",
    learningContent: {
      concept: "🎨 CSS ใช้กำหนดสีตัวอักษรด้วย color",
      why: "ทำไมต้องใช้? ทำให้ข้อความเด่นและสวยงาม",
      how: "p { color: สี; }",
      example: "p { color: blue; }",
      practice: "💡 สร้างย่อหน้าสีแดง ข้อความ 'HTML สนุกมาก'"
    }
  },
  // ด่าน 4 (คู่): เขียนโค้ดเอง
  {
    id: 4,
    title: "ด่าน 4: ย่อหน้าขนาดใหญ่",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างย่อหน้าข้อความ 'CSS ทรงพลัง' และทำตัวอักษรขนาด 24px",
    hint: "ใช้ font-size: 24px ใน CSS",
    blocks: ["<style>", "p { font-size: 24px; }", "</style>", "<p>CSS ทรงพลัง</p>"],
    expectedCode: "<style>p { font-size: 24px; }</style><p>CSS ทรงพลัง</p>",
    starterCode: "",
    previousKnowledge: ["CSS พื้นฐาน"],
    newKnowledge: "การเปลี่ยนขนาดตัวอักษร",
    learningContent: {
      concept: "📏 font-size ใช้กำหนดขนาดตัวอักษร",
      why: "ทำไมต้องใช้? ทำให้ข้อความสำคัญดูโดดเด่น",
      how: "p { font-size: ขนาด; }",
      example: "p { font-size: 20px; }",
      practice: "✨ สร้างย่อหน้าขนาด 24px ข้อความ 'CSS ทรงพลัง'"
    }
  },
  // ด่าน 5 (คี่): บล็อก
  {
    id: 5,
    title: "ด่าน 5: ปุ่มสวยงาม",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างปุ่ม 'กดเลย' พื้นหลังสีน้ำเงิน",
    hint: "ใช้ background-color: blue",
    blocks: ["<style>", "button { background-color: blue; color: white; }", "</style>", "<button>กดเลย</button>"],
    expectedCode: "<style>button { background-color: blue; color: white; }</style><button>กดเลย</button>",
    starterCode: "",
    previousKnowledge: ["Tag HTML", "CSS"],
    newKnowledge: "การตกแต่งปุ่ม",
    learningContent: {
      concept: "🔘 ปุ่มใช้ <button> และตกแต่งด้วย CSS",
      why: "ทำไมต้องใช้? ปุ่มสวยๆ ทำให้ผู้ใช่อยากกด",
      how: "background-color เปลี่ยนสีพื้นหลัง, color เปลี่ยนสีตัวอักษร",
      example: "button { background-color: blue; color: white; }",
      practice: "💪 สร้างปุ่ม 'กดเลย' สีพื้นหลังน้ำเงิน ตัวอักษรขาว"
    }
  },
  // ด่าน 6 (คู่): เขียนโค้ดเอง
  {
    id: 6,
    title: "ด่าน 6: ปุ่มขอบมน",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างปุ่ม 'คลิก' พื้นหลังสีส้ม ขอบมน 10px",
    hint: "ใช้ border-radius: 10px",
    blocks: ["<style>", "button { background-color: orange; border-radius: 10px; padding: 10px; }", "</style>", "<button>คลิก</button>"],
    expectedCode: "<style>button { background-color: orange; border-radius: 10px; padding: 10px; }</style><button>คลิก</button>",
    starterCode: "",
    previousKnowledge: ["CSS"],
    newKnowledge: "การทำขอบมน",
    learningContent: {
      concept: "⭕ border-radius ทำมุมให้โค้งมน",
      why: "ทำไมต้องใช้? ทำให้ปุ่มดูทันสมัย น่ากดกว่า",
      how: "border-radius: ขนาด;",
      example: "border-radius: 10px;",
      practice: "🎨 สร้างปุ่ม 'คลิก' สีส้ม ขอบมน 10px"
    }
  },
  // ด่าน 7 (คี่): บล็อก
  {
    id: 7,
    title: "ด่าน 7: ลิงก์ไปเว็บ",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างลิงก์ไปที่ https://google.com ข้อความ 'ไปค้นหา'",
    hint: "ใช้ <a href='...'>",
    blocks: ['<a href="https://google.com">', "ไปค้นหา", "</a>"],
    expectedCode: '<a href="https://google.com">ไปค้นหา</a>',
    starterCode: "",
    previousKnowledge: ["Tag HTML"],
    newKnowledge: "การสร้างลิงก์",
    learningContent: {
      concept: "🔗 ลิงก์ใช้ <a> เชื่อมต่อไปยังเว็บอื่น",
      why: "ทำไมต้องใช้? เชื่อมโยงข้อมูลระหว่างหน้าเว็บ",
      how: "href='ที่อยู่' กำหนดปลายทาง",
      example: "<a href='https://google.com'>Google</a>",
      practice: "🌐 สร้างลิงก์ไป google.com ข้อความ 'ไปค้นหา'"
    }
  },
  // ด่าน 8 (คู่): เขียนโค้ดเอง
  {
    id: 8,
    title: "ด่าน 8: ลิงก์เปิดในแท็บใหม่",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างลิงก์ไปที่ https://facebook.com ข้อความ 'Facebook' และเปิดในแท็บใหม่",
    hint: "ใช้ target='_blank'",
    blocks: ['<a href="https://facebook.com" target="_blank">', "Facebook", "</a>"],
    expectedCode: '<a href="https://facebook.com" target="_blank">Facebook</a>',
    starterCode: "",
    previousKnowledge: ["ลิงก์"],
    newKnowledge: "การเปิดลิงก์ในแท็บใหม่",
    learningContent: {
      concept: "🆕 target='_blank' ใช้เปิดลิงก์ในแท็บใหม่",
      why: "ทำไมต้องใช้? ไม่ให้ผู้ใช้ออกจากเว็บเรา",
      how: "เพิ่ม target='_blank' ในแท็ก a",
      example: "<a href='...' target='_blank'>",
      practice: "🔗 สร้างลิงก์ไป facebook.com เปิดในแท็บใหม่"
    }
  },
  // ด่าน 9 (คี่): บล็อก
  {
    id: 9,
    title: "ด่าน 9: แสดงรูปภาพ",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "แสดงรูปภาพจาก https://picsum.photos/200/150",
    hint: "ใช้ <img> พร้อม src",
    blocks: ['<img src="https://picsum.photos/200/150">'],
    expectedCode: '<img src="https://picsum.photos/200/150">',
    starterCode: "",
    previousKnowledge: ["Tag HTML"],
    newKnowledge: "การแทรกรูปภาพ",
    learningContent: {
      concept: "🖼️ <img> ใช้แสดงรูปภาพ ไม่ต้องมีแท็กปิด",
      why: "ทำไมต้องใช้? รูปภาพทำให้เว็บสวยงาม",
      how: "src='ที่อยู่รูป'",
      example: "<img src='photo.jpg'>",
      practice: "📷 แสดงรูปจาก picsum.photos ขนาด 200x150"
    }
  },
  // ด่าน 10 (คู่): เขียนโค้ดเอง
  {
    id: 10,
    title: "ด่าน 10: รูปภาพมีคำอธิบาย",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "แสดงรูปภาพจาก https://picsum.photos/300/200 พร้อมคำอธิบาย 'รูปตัวอย่าง'",
    hint: "ใช้ alt attribute",
    blocks: ['<img src="https://picsum.photos/300/200" alt="รูปตัวอย่าง">'],
    expectedCode: '<img src="https://picsum.photos/300/200" alt="รูปตัวอย่าง">',
    starterCode: "",
    previousKnowledge: ["รูปภาพ"],
    newKnowledge: "การเพิ่มคำอธิบายรูป",
    learningContent: {
      concept: "📝 alt ใช้อธิบายรูปเมื่อโหลดไม่ได้",
      why: "ทำไมต้องใช้? ช่วยให้คนตาบอดเข้าใจ และ SEO ดีขึ้น",
      how: "alt='คำอธิบาย'",
      example: "<img src='cat.jpg' alt='แมวน่ารัก'>",
      practice: "🐱 แสดงรูปขนาด 300x200 มี alt='รูปตัวอย่าง'"
    }
  },
  // ด่าน 11 (คี่): บล็อก
  {
    id: 11,
    title: "ด่าน 11: รายการสิ่งของ",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างรายการ: แอปเปิ้ล, กล้วย, ส้ม",
    hint: "ใช้ <ul> และ <li>",
    blocks: ["<ul>", "<li>แอปเปิ้ล</li>", "<li>กล้วย</li>", "<li>ส้ม</li>", "</ul>"],
    expectedCode: "<ul><li>แอปเปิ้ล</li><li>กล้วย</li><li>ส้ม</li></ul>",
    starterCode: "",
    previousKnowledge: ["Tag HTML"],
    newKnowledge: "การสร้างรายการแบบจุด",
    learningContent: {
      concept: "📋 <ul> สร้างรายการแบบมีหัวข้อย่อย",
      why: "ทำไมต้องใช้? แสดงรายการที่ไม่เรียงลำดับ",
      how: "ul = กรอบ, li = แต่ละรายการ",
      example: "<ul><li> item1</li><li> item2</li></ul>",
      practice: "🍎 สร้างรายการผลไม้: แอปเปิ้ล, กล้วย, ส้ม"
    }
  },
  // ด่าน 12 (คู่): เขียนโค้ดเอง
  {
    id: 12,
    title: "ด่าน 12: รายการตัวเลข",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างรายการตัวเลข: ขั้นตอนที่ 1, ขั้นตอนที่ 2, ขั้นตอนที่ 3",
    hint: "ใช้ <ol> แทน <ul>",
    blocks: ["<ol>", "<li>ขั้นตอนที่ 1</li>", "<li>ขั้นตอนที่ 2</li>", "<li>ขั้นตอนที่ 3</li>", "</ol>"],
    expectedCode: "<ol><li>ขั้นตอนที่ 1</li><li>ขั้นตอนที่ 2</li><li>ขั้นตอนที่ 3</li></ol>",
    starterCode: "",
    previousKnowledge: ["รายการ"],
    newKnowledge: "รายการแบบลำดับ (ตัวเลข)",
    learningContent: {
      concept: "🔢 <ol> สร้างรายการแบบมีลำดับ",
      why: "ทำไมต้องใช้? สำหรับขั้นตอนการทำอาหาร วิธีใช้",
      how: "ol = ลำดับ, li = แต่ละขั้นตอน",
      example: "<ol><li>step1</li><li>step2</li></ol>",
      practice: "📝 สร้างรายการขั้นตอน 3 ขั้นตอน"
    }
  },
  // ด่าน 13 (คี่): บล็อก
  {
    id: 13,
    title: "ด่าน 13: กล่องเนื้อหา",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างกล่องสีเทา ขอบมน 10px มีข้อความ 'เนื้อหาในกล่อง'",
    hint: "ใช้ div และ CSS",
    blocks: ["<style>", ".box {", "background: #f0f0f0;", "border-radius: 10px;", "padding: 20px;", "}", "</style>", '<div class="box">เนื้อหาในกล่อง</div>'],
    expectedCode: '<style>.box { background: #f0f0f0; border-radius: 10px; padding: 20px; }</style><div class="box">เนื้อหาในกล่อง</div>',
    starterCode: "",
    previousKnowledge: ["CSS", "class"],
    newKnowledge: "การสร้างกล่องด้วย div",
    learningContent: {
      concept: "📦 <div> ใช้จัดกลุ่มเนื้อหา",
      why: "ทำไมต้องใช้? จัดระเบียบหน้าเว็บ",
      how: "กำหนด class แล้วตกแต่งด้วย CSS",
      example: "<div class='card'>เนื้อหา</div>",
      practice: "🎁 สร้างกล่องสีเทา ขอบมน มีข้อความ"
    }
  },
  // ด่าน 14 (คู่): เขียนโค้ดเอง
  {
    id: 14,
    title: "ด่าน 14: กล่องมีเงา",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างกล่องสีขาว มีเงา ขอบมน 15px",
    hint: "ใช้ box-shadow: 2px 2px 5px gray",
    blocks: ["<style>", ".card {", "background: white;", "border-radius: 15px;", "box-shadow: 2px 2px 5px gray;", "padding: 20px;", "}", "</style>", '<div class="card">การ์ดสวยงาม</div>'],
    expectedCode: '<style>.card { background: white; border-radius: 15px; box-shadow: 2px 2px 5px gray; padding: 20px; }</style><div class="card">การ์ดสวยงาม</div>',
    starterCode: "",
    previousKnowledge: ["CSS", "class"],
    newKnowledge: "การเพิ่มเงาให้กล่อง",
    learningContent: {
      concept: "✨ box-shadow เพิ่มเงาให้ element",
      why: "ทำไมต้องใช้? ทำให้ดูมีมิติ สวยงาม",
      how: "box-shadow: แนวนอน แนวตั้ง เบลอ สี",
      example: "box-shadow: 3px 3px 5px gray;",
      practice: "💎 สร้างกล่องสีขาว ขอบมน 15px มีเงา"
    }
  },
  // ด่าน 15 (คี่): บล็อก
  {
    id: 15,
    title: "ด่าน 15: ตารางข้อมูล",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างตาราง 2 แถว: ชื่อ, อายุ",
    hint: "ใช้ <table>, <tr>, <th>, <tr>",
    blocks: ["<table border='1'>", "<tr>", "<th>ชื่อ</th>", "<th>อายุ</th>", "</tr>", "<tr>", "<td>สมชาย</td>", "<td>20</td>", "</tr>", "</table>"],
    expectedCode: "<table border='1'><tr><th>ชื่อ</th><th>อายุ</th></tr><tr><td>สมชาย</td><td>20</td><tr>|</table>",
    starterCode: "",
    previousKnowledge: ["Tag HTML"],
    newKnowledge: "การสร้างตาราง",
    learningContent: {
      concept: "📊 <table> สร้างตารางแสดงข้อมูล",
      why: "ทำไมต้องใช้? แสดงข้อมูลที่เป็นตาราง",
      how: "table = ตาราง, tr = แถว, th = หัวข้อ, td = ข้อมูล",
      example: "<tr><th>ชื่อ</th><th>อายุ</th></tr>",
      practice: "📋 สร้างตารางหัวข้อ ชื่อ/อายุ มีข้อมูล 1 แถว"
    }
  },
  // ด่าน 16 (คู่): เขียนโค้ดเอง
  {
    id: 16,
    title: "ด่าน 16: ตารางสินค้า",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างตารางสินค้า: สินค้า, ราคา (เสื้อ 500, กางเกง 800)",
    hint: "ใช้ border='1' ให้เห็นเส้นตาราง",
    blocks: ["<table border='1'>", "<tr>", "<th>สินค้า</th>", "<th>ราคา</th>", "</tr>", "<tr>", "<td>เสื้อ</td>", "<td>500</td>", "</tr>", "<tr>", "<td>กางเกง</td>", "<td>800</td>", "</tr>", "</table>"],
    expectedCode: "<table border='1'><tr><th>สินค้า</th><th>ราคา</th></tr><tr><td>เสื้อ</td><td>500</td></td><tr><td>กางเกง</td><td>800</td></tr></table>",
    starterCode: "",
    previousKnowledge: ["ตาราง"],
    newKnowledge: "การสร้างตารางหลายแถว",
    learningContent: {
      concept: "📊 ตารางมีหลายแถวได้",
      why: "ทำไมต้องใช้? แสดงข้อมูลหลายรายการ",
      how: "เพิ่ม <tr>... soft <tr> ให้มากขึ้น",
      example: "<tr><td>item1</td></tr><tr><td>item2</td></tr>",
      practice: "🛍️ สร้างตารางสินค้า 2 แถว: เสื้อ 500, กางเกง 800"
    }
  },
  // ด่าน 17 (คี่): บล็อก
  {
    id: 17,
    title: "ด่าน 17: ฟอร์มรับชื่อ",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างฟอร์มที่มีช่องกรอกชื่อ",
    hint: "ใช้ <input type='text'>",
    blocks: ["<form>", '<input type="text" placeholder="กรอกชื่อ">', '<button>ส่ง</button>', "</form>"],
    expectedCode: '<form><input type="text" placeholder="กรอกชื่อ"><button>ส่ง</button></form>',
    starterCode: "",
    previousKnowledge: ["Tag HTML"],
    newKnowledge: "การสร้างฟอร์ม",
    learningContent: {
      concept: "📝 <form> ใช้รับข้อมูลผู้ใช้",
      why: "ทำไมต้องใช้? สำหรับติดต่อ ลงทะเบียน",
      how: "input = ช่องกรอก, button = ปุ่มส่ง",
      example: "<input type='text'>",
      practice: "✏️ สร้างฟอร์มมีช่องกรอกชื่อและปุ่มส่ง"
    }
  },
  // ด่าน 18 (คู่): เขียนโค้ดเอง
  {
    id: 18,
    title: "ด่าน 18: ฟอร์มพร้อมอีเมล",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างฟอร์มมีช่องกรอกชื่อ และช่องกรอกอีเมล",
    hint: "ใช้ input type='email'",
    blocks: ["<form>", '<input type="text" placeholder="ชื่อ">', '<input type="email" placeholder="อีเมล">', '<button>ส่ง</button>', "</form>"],
    expectedCode: '<form><input type="text" placeholder="ชื่อ"><input type="email" placeholder="อีเมล"><button>ส่ง</button></form>',
    starterCode: "",
    previousKnowledge: ["ฟอร์ม"],
    newKnowledge: "การเพิ่มช่องกรอกอีเมล",
    learningContent: {
      concept: "📧 input type='email' ใช้กรอกอีเมล",
      why: "ทำไมต้องใช้? ตรวจสอบรูปแบบอีเมลอัตโนมัติ",
      how: "type='email' ใน input",
      example: "<input type='email'>",
      practice: "📧 สร้างฟอร์มรับชื่อและอีเมล"
    }
  },
  // ด่าน 19 (คี่): บล็อก
  {
    id: 19,
    title: "ด่าน 19: JavaScript แจ้งเตือน",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างปุ่มเมื่อคลิกแล้วแสดง 'สวัสดีจ้า'",
    hint: "ใช้ onclick และ alert",
    blocks: ['<button onclick="alert(\'สวัสดีจ้า\')">ทักทาย</button>'],
    expectedCode: '<button onclick="alert(\'สวัสดีจ้า\')">ทักทาย</button>',
    starterCode: "",
    previousKnowledge: ["HTML"],
    newKnowledge: "JavaScript เบื้องต้น",
    learningContent: {
      concept: "💻 JavaScript ทำให้เว็บมีปฏิสัมพันธ์",
      why: "ทำไมต้องใช้? ตอบสนองผู้ใช้",
      how: "onclick='คำสั่ง' เมื่อคลิก, alert() แสดง popup",
      example: "onclick=\"alert('Hello')\"",
      practice: "🎯 สร้างปุ่มคลิกแล้ว alert 'สวัสดีจ้า'"
    }
  },
  // ด่าน 20 (คู่): เขียนโค้ดเอง
  {
    id: 20,
    title: "ด่าน 20: เปลี่ยนสีพื้นหลัง",
    difficulty: "ง่าย",
    timeLimit: 120,
    goal: "สร้างปุ่มเมื่อคลิกแล้วพื้นหลังเปลี่ยนเป็นสีเหลือง",
    hint: "ใช้ document.body.style.backgroundColor",
    blocks: ['<button onclick="document.body.style.backgroundColor=\'yellow\'">เปลี่ยนสี</button>'],
    expectedCode: '<button onclick="document.body.style.backgroundColor=\'yellow\'">เปลี่ยนสี</button>',
    starterCode: "",
    previousKnowledge: ["JavaScript"],
    newKnowledge: "การเปลี่ยน CSS ด้วย JS",
    learningContent: {
      concept: "🎨 JavaScript เปลี่ยน CSS ได้",
      why: "ทำไมต้องใช้? สร้าง interactive",
      how: "document.body.style.คุณสมบัติ = 'ค่า'",
      example: "document.body.style.backgroundColor = 'red'",
      practice: "🌈 สร้างปุ่มคลิกแล้วพื้นหลังเป็นสีเหลือง"
    }
  }
];

function buildPreview(code) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: white; }
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
  if (s.startsWith("<style") || s.startsWith("</style") || s.includes("{") || s.includes(":")) {
    return "css";
  }
  if (s.startsWith("<script") || s.includes("function") || s.includes("alert")) {
    return "javascript";
  }
  if (s.startsWith("<") || s.startsWith("</")) {
    return "html";
  }
  return "text";
}

function getBlockStyle(block, active = false) {
  const type = getBlockType(block);
  const map = {
    html: { bg: active ? "#dbeafe" : "#eff6ff", border: "#60a5fa", text: "#1e40af", hover: "#bfdbfe" },
    css: { bg: active ? "#dcfce7" : "#f0fdf4", border: "#4ade80", text: "#166534", hover: "#bbf7d0" },
    javascript: { bg: active ? "#fef3c7" : "#fffbeb", border: "#f59e0b", text: "#92400e", hover: "#fde68a" },
    text: { bg: active ? "#fef3c7" : "#fffbeb", border: "#f59e0b", text: "#92400e", hover: "#fde68a" },
  };
  return map[type];
}

function validateByDOM(htmlCode, levelId) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    
    doc.open();
    doc.write(htmlCode);
    doc.close();
    
    setTimeout(() => {
      let isValid = false;
      let validationMessage = '';
      
      switch(levelId) {
        case 1:
          const h1 = doc.querySelector('h1');
          isValid = h1 !== null && h1.textContent.includes('สวัสดีโลก');
          validationMessage = isValid ? '✅ พบ h1 ที่มีข้อความ "สวัสดีโลก"' : '❌ ไม่พบ h1 หรือข้อความไม่ถูกต้อง';
          break;
        case 2:
          const h2 = doc.querySelector('h2');
          isValid = h2 !== null && h2.textContent.includes('เรียนรู้การเขียนโค้ด');
          validationMessage = isValid ? '✅ พบ h2 ที่มีข้อความ "เรียนรู้การเขียนโค้ด"' : '❌ ไม่พบ h2 หรือข้อความไม่ถูกต้อง';
          break;
        case 3:
          const p = doc.querySelector('p');
          if (p && p.textContent.includes('HTML สนุกมาก')) {
            const color = doc.defaultView.getComputedStyle(p).color;
            isValid = color === 'rgb(255, 0, 0)' || color === 'red';
            validationMessage = isValid ? '✅ ย่อหน้าสีแดง "HTML สนุกมาก"' : '❌ สีไม่ถูกต้อง';
          } else {
            validationMessage = '❌ ไม่พบย่อหน้า "HTML สนุกมาก"';
          }
          break;
        case 4:
          const p2 = doc.querySelector('p');
          if (p2 && p2.textContent.includes('CSS ทรงพลัง')) {
            const fontSize = doc.defaultView.getComputedStyle(p2).fontSize;
            isValid = parseInt(fontSize) >= 24;
            validationMessage = isValid ? '✅ ย่อหน้าขนาด 24px "CSS ทรงพลัง"' : '❌ ขนาดตัวอักษรไม่ถูกต้อง';
          } else {
            validationMessage = '❌ ไม่พบย่อหน้า "CSS ทรงพลัง"';
          }
          break;
        case 5:
          const btn = doc.querySelector('button');
          if (btn && btn.textContent.includes('กดเลย')) {
            const bgColor = doc.defaultView.getComputedStyle(btn).backgroundColor;
            const textColor = doc.defaultView.getComputedStyle(btn).color;
            isValid = (bgColor === 'rgb(0, 0, 255)' || bgColor === 'blue') && 
                     (textColor === 'rgb(255, 255, 255)' || textColor === 'white');
            validationMessage = isValid ? '✅ ปุ่มสีน้ำเงิน "กดเลย"' : '❌ สีไม่ถูกต้อง';
          } else {
            validationMessage = '❌ ไม่พบปุ่ม "กดเลย"';
          }
          break;
        case 6:
          const btn2 = doc.querySelector('button');
          if (btn2 && btn2.textContent.includes('คลิก')) {
            const bgColor = doc.defaultView.getComputedStyle(btn2).backgroundColor;
            const borderRadius = parseFloat(doc.defaultView.getComputedStyle(btn2).borderRadius);
            isValid = (bgColor === 'rgb(255, 165, 0)' || bgColor === 'orange') && borderRadius >= 8;
            validationMessage = isValid ? '✅ ปุ่มสีส้มขอบมน "คลิก"' : '❌ ปุ่มไม่ถูกต้อง';
          } else {
            validationMessage = '❌ ไม่พบปุ่ม "คลิก"';
          }
          break;
        case 7:
          const link = doc.querySelector('a');
          isValid = link !== null && link.getAttribute('href') === 'https://google.com' && link.textContent.includes('ไปค้นหา');
          validationMessage = isValid ? '✅ พบลิงก์ไป google.com' : '❌ ลิงก์ไม่ถูกต้อง';
          break;
        case 8:
          const link2 = doc.querySelector('a');
          isValid = link2 !== null && link2.getAttribute('href') === 'https://facebook.com' && 
                   link2.getAttribute('target') === '_blank' && link2.textContent.includes('Facebook');
          validationMessage = isValid ? '✅ พบลิงก์ Facebook เปิดแท็บใหม่' : '❌ ลิงก์ไม่ถูกต้อง';
          break;
        case 9:
          const img = doc.querySelector('img');
          isValid = img !== null && img.hasAttribute('src') && img.src.includes('picsum.photos/200/150');
          validationMessage = isValid ? '✅ พบรูปภาพ' : '❌ ไม่พบรูปภาพ';
          break;
        case 10:
          const img2 = doc.querySelector('img');
          isValid = img2 !== null && img2.hasAttribute('src') && img2.hasAttribute('alt') && 
                   img2.src.includes('picsum.photos/300/200') && img2.alt === 'รูปตัวอย่าง';
          validationMessage = isValid ? '✅ พบรูปภาพพร้อมคำอธิบาย' : '❌ รูปภาพไม่สมบูรณ์';
          break;
        case 11:
          const ul = doc.querySelector('ul');
          if (ul) {
            const items = ul.querySelectorAll('li');
            isValid = items.length >= 3;
            validationMessage = isValid ? '✅ พบรายการ 3 รายการ' : '❌ รายการไม่ครบ 3 รายการ';
          } else {
            validationMessage = '❌ ไม่พบรายการ';
          }
          break;
        case 12:
          const ol = doc.querySelector('ol');
          if (ol) {
            const items = ol.querySelectorAll('li');
            isValid = items.length >= 3;
            validationMessage = isValid ? '✅ พบรายการลำดับ 3 ขั้นตอน' : '❌ รายการไม่ครบ 3 ขั้นตอน';
          } else {
            validationMessage = '❌ ไม่พบรายการลำดับ';
          }
          break;
        case 13:
          const box = doc.querySelector('.box');
          if (box) {
            const styles = doc.defaultView.getComputedStyle(box);
            const borderRadius = parseFloat(styles.borderRadius);
            isValid = borderRadius >= 8;
            validationMessage = isValid ? '✅ พบกล่องที่มีขอบมน' : '❌ กล่องไม่สมบูรณ์';
          } else {
            validationMessage = '❌ ไม่พบ .box';
          }
          break;
        case 14:
          const card = doc.querySelector('.card');
          if (card) {
            const styles = doc.defaultView.getComputedStyle(card);
            const borderRadius = parseFloat(styles.borderRadius);
            isValid = borderRadius >= 12;
            validationMessage = isValid ? '✅ พบการ์ดมีเงา' : '❌ การ์ดไม่สมบูรณ์';
          } else {
            validationMessage = '❌ ไม่พบ .card';
          }
          break;
        case 15:
          const table = doc.querySelector('table');
          if (table) {
            const rows = table.querySelectorAll('tr');
            isValid = rows.length >= 2;
            validationMessage = isValid ? '✅ พบตาราง' : '❌ ตารางไม่สมบูรณ์';
          } else {
            validationMessage = '❌ ไม่พบตาราง';
          }
          break;
        case 16:
          const table2 = doc.querySelector('table');
          if (table2) {
            const rows = table2.querySelectorAll('tr');
            const headers = table2.querySelectorAll('th');
            isValid = rows.length >= 3 && headers.length >= 2;
            validationMessage = isValid ? '✅ พบตารางสินค้า 2 รายการ' : '❌ ตารางไม่สมบูรณ์';
          } else {
            validationMessage = '❌ ไม่พบตาราง';
          }
          break;
        case 17:
          const form = doc.querySelector('form');
          const input = doc.querySelector('input[type="text"]');
          const submitBtn = doc.querySelector('button');
          isValid = form !== null && input !== null && submitBtn !== null;
          validationMessage = isValid ? '✅ พบฟอร์ม' : '❌ ฟอร์มไม่สมบูรณ์';
          break;
        case 18:
          const form2 = doc.querySelector('form');
          const inputs = doc.querySelectorAll('input');
          const hasText = Array.from(inputs).some(i => i.type === 'text');
          const hasEmail = Array.from(inputs).some(i => i.type === 'email');
          isValid = form2 !== null && hasText && hasEmail;
          validationMessage = isValid ? '✅ พบฟอร์มรับชื่อและอีเมล' : '❌ ฟอร์มไม่สมบูรณ์';
          break;
        case 19:
          const jsBtn = doc.querySelector('button');
          const hasOnclick = jsBtn && jsBtn.hasAttribute('onclick') && jsBtn.textContent.includes('ทักทาย');
          isValid = hasOnclick;
          validationMessage = isValid ? '✅ พบปุ่ม JavaScript' : '❌ ไม่พบ onclick';
          break;
        case 20:
          const changeBtn = doc.querySelector('button');
          isValid = changeBtn !== null && changeBtn.hasAttribute('onclick') && changeBtn.textContent.includes('เปลี่ยนสี');
          validationMessage = isValid ? '✅ พบปุ่มเปลี่ยนสี' : '❌ ไม่พบปุ่มเปลี่ยนสี';
          break;
        default:
          isValid = true;
          validationMessage = '✅ ตรวจสอบผ่าน';
      }
      
      document.body.removeChild(iframe);
      resolve({ isValid, validationMessage });
    }, 100);
  });
}

// CSS Animations
const animations = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes slideInPopup {
  from { opacity: 0; transform: scale(0.9) translateY(-20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animations;
  document.head.appendChild(styleSheet);
}

// Component Learning Popup
function LearningPopup({ level, onClose }) {
  const content = level.learningContent;
  
  return (
    <div style={styles.popupOverlay} onClick={onClose}>
      <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.popupClose} onClick={onClose}>✕</button>
        
        <div style={styles.popupHeader}>
          <span style={styles.popupIcon}>📚</span>
          <h2 style={styles.popupTitle}>เอกสารประกอบการเรียน</h2>
        </div>
        
        <div style={styles.popupBody}>
          <div style={styles.learningSection}>
            <h3>🎯 เป้าหมายของด่านนี้</h3>
            <p style={styles.goalText}>{level.goal}</p>
          </div>
          
          <div style={styles.learningSection}>
            <h3>💡 แนวคิด</h3>
            <div style={styles.conceptCard}>
              <span style={styles.conceptIcon}>📖</span>
              <div>{content.concept}</div>
            </div>
          </div>
          
          <div style={styles.learningSection}>
            <h3>🤔 ทำไมต้องใช้?</h3>
            <div style={styles.whyCard}>{content.why}</div>
          </div>
          
          <div style={styles.learningSection}>
            <h3>⚙️ วิธีการใช้งาน</h3>
            <div style={styles.howCard}>{content.how}</div>
          </div>
          
          <div style={styles.learningSection}>
            <h3>📝 ตัวอย่าง</h3>
            <div style={styles.exampleCard}>{content.example}</div>
          </div>
          
          <div style={styles.learningSection}>
            <h3>💪 ลองทำดู!</h3>
            <div style={styles.practiceCard}>
              <span>🎯</span>
              <p>{content.practice}</p>
            </div>
          </div>
          
          <div style={styles.learningSection}>
            <h3>📌 ความรู้ที่ต้องใช้</h3>
            <div style={styles.knowledgeTags}>
              {level.previousKnowledge.map((knowledge, idx) => (
                <span key={idx} style={styles.knowledgeTag}>✅ {knowledge}</span>
              ))}
              {level.previousKnowledge.length === 0 && (
                <span style={styles.knowledgeTag}>🌟 ด่านแรก ไม่ต้องมีความรู้มาก่อน</span>
              )}
            </div>
          </div>
        </div>
        
        <div style={styles.popupFooter}>
          <button style={styles.gotItBtn} onClick={onClose}>
            เข้าใจแล้ว เริ่มทำด่านนี้!
          </button>
        </div>
      </div>
    </div>
  );
}

// Component Mode Toggle
function ModeToggle({ mode, setMode, currentLevelId }) {
  const isOddLevel = currentLevelId % 2 === 1;
  
  // ถ้าเป็นด่านคี่ ให้ซ่อนปุ่มโหมดเขียนโค้ด (แสดงเฉพาะปุ่มลากบล็อก)
  // ถ้าเป็นด่านคู่ ให้ซ่อนปุ่มโหมดลากบล็อก (แสดงเฉพาะปุ่มเขียนโค้ด)
  if (isOddLevel) {
    return (
      <div style={styles.modeToggleContainer}>
        <div style={styles.modeToggleHeader}>
          <span style={styles.modeToggleTitle}>🎮 โหมดการเล่น</span>
          <span style={styles.modeToggleHint}>🧩 ด่านนี้: โหมดลากบล็อก (บังคับ)</span>
        </div>
        <div style={styles.modeToggleButtons}>
          <button 
            onClick={() => setMode("block")}
            style={{
              ...styles.modeBtn,
              ...styles.modeBtnBlock,
              ...styles.modeBtnActive,
            }}
          >
            <span style={styles.modeBtnIcon}>🧩</span>
            <div style={styles.modeBtnText}>
              <div style={styles.modeBtnTitle}>โหมดลากบล็อก</div>
              <div style={styles.modeBtnDesc}>เหมาะสำหรับด่านคี่</div>
            </div>
            <span style={styles.modeBtnCheck}>✓</span>
          </button>
        </div>
        <div style={styles.modeInfo}>
          💡 ด่านนี้เป็นด่านคี่ เหมาะกับโหมดลากบล็อก
        </div>
      </div>
    );
  } else {
    return (
      <div style={styles.modeToggleContainer}>
        <div style={styles.modeToggleHeader}>
          <span style={styles.modeToggleTitle}>🎮 โหมดการเล่น</span>
          <span style={styles.modeToggleHint}>⌨️ ด่านนี้: โหมดเขียนโค้ด (บังคับ)</span>
        </div>
        <div style={styles.modeToggleButtons}>
          <button 
            onClick={() => setMode("code")}
            style={{
              ...styles.modeBtn,
              ...styles.modeBtnCode,
              ...styles.modeBtnActive,
            }}
          >
            <span style={styles.modeBtnIcon}>⌨️</span>
            <div style={styles.modeBtnText}>
              <div style={styles.modeBtnTitle}>โหมดเขียนโค้ด</div>
              <div style={styles.modeBtnDesc}>เหมาะสำหรับด่านคู่</div>
            </div>
            <span style={styles.modeBtnCheck}>✓</span>
          </button>
        </div>
        <div style={styles.modeInfo}>
          💡 ด่านนี้เป็นด่านคู่ เหมาะกับโหมดเขียนโค้ด
        </div>
      </div>
    );
  }
}

// Component Timeout Modal
function TimeoutModal({ onBackToHome }) {
  return (
    <div style={styles.timeoutOverlay}>
      <div style={styles.timeoutModal}>
        <div style={styles.timeoutIcon}>⏰</div>
        <h2 style={styles.timeoutTitle}>หมดเวลา!</h2>
        <p style={styles.timeoutMessage}>คุณใช้เวลาทำแบบฝึกหัดเกินกำหนด</p>
        <button onClick={onBackToHome} style={styles.timeoutButton}>
          กลับไปหน้าแรก
        </button>
      </div>
    </div>
  );
}

// Component Game Complete Modal
function GameCompleteModal({ onBackToHome, score }) {
  return (
    <div style={styles.timeoutOverlay}>
      <div style={styles.timeoutModal}>
        <div style={styles.gameCompleteIcon}>🏆</div>
        <h2 style={styles.timeoutTitle}>ยินดีด้วย!</h2>
        <p style={styles.timeoutMessage}>คุณเล่นจบเกมทั้งหมด 20 ด่านแล้ว!</p>
        <p style={styles.timeoutMessage}>คะแนนรวมของคุณ: {score} คะแนน</p>
        <button onClick={onBackToHome} style={styles.timeoutButton}>
          กลับไปหน้าแรก
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("intro");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNo, setStudentNo] = useState("");

  const [currentLevel, setCurrentLevel] = useState(0);
  const [mode, setMode] = useState("block");
  const [pool, setPool] = useState([]);
  const [workspace, setWorkspace] = useState([]);
  const [codeEditorValue, setCodeEditorValue] = useState("");
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [message, setMessage] = useState("");
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showGameCompleteModal, setShowGameCompleteModal] = useState(false);

  const timerRef = useRef(null);

  const level = LEVELS[currentLevel];
  const fullName = `${firstName} ${lastName}`.trim();
  const isLastLevel = currentLevel === LEVELS.length - 1;

  const codeText = useMemo(() => {
    if (mode === "block" && workspace.length > 0) {
      return workspace.join("\n");
    }
    return codeEditorValue;
  }, [workspace, codeEditorValue, mode]);

  const previewDoc = useMemo(() => buildPreview(codeText), [codeText]);

  const successPercent = Math.round(((currentLevel + 1) / LEVELS.length) * 100);

  useEffect(() => {
    const raw = localStorage.getItem("hybrid-coding-rank");
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
  }, [page, status, currentLevel]);

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

  function startGame() {
    if (!firstName.trim() || !lastName.trim() || !studentNo.trim()) {
      showErrorNotification("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setPage("game");
    setCurrentLevel(0);
    initLevel(0);
    setScore(0);
    setStatus("playing");
    setCompletedLevels([]);
    setShowTimeoutModal(false);
    setShowGameCompleteModal(false);
  }

  function initLevel(levelIndex) {
    const lvl = LEVELS[levelIndex];
    setSecondsLeft(lvl.timeLimit);
    setMessage(`ด่าน ${levelIndex + 1}: ${lvl.goal}`);
    setFeedback([`📚 ความรู้ใหม่: ${lvl.newKnowledge}`, `💡 ${lvl.hint}`]);
    setDropIndex(null);
    setDragItem(null);
    
    const isOddLevel = lvl.id % 2 === 1;
    setMode(isOddLevel ? "block" : "code");
    
    setPool(shuffle(lvl.blocks));
    setWorkspace([]);
    setCodeEditorValue(lvl.starterCode);
  }

  function resetGame() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPage("intro");
    setCurrentLevel(0);
    setScore(0);
    setStatus("playing");
    setCompletedLevels([]);
    setDragItem(null);
    setDropIndex(null);
    setShowTimeoutModal(false);
    setShowGameCompleteModal(false);
  }

  async function checkAnswer() {
    let currentCode = "";
    
    if (mode === "block") {
      currentCode = workspace.join("");
    } else {
      currentCode = codeEditorValue;
    }
    
    const fullHtml = buildPreview(currentCode);
    const result = await validateByDOM(fullHtml, level.id);
    
    if (!result.isValid) {
      setMessage(`❌ ${result.validationMessage}`);
      showErrorNotification(`❌ ${result.validationMessage}`);
      return;
    }

    const timeBonus = Math.max(10, secondsLeft);
    const levelScore = 100;
    const nextScore = score + levelScore + timeBonus;
    
    setScore(nextScore);
    setCompletedLevels((prev) => [...prev, level.id]);
    setMessage(`✅ ผ่านด่าน ${level.id} สำเร็จ! ${result.validationMessage}`);
    setFeedback([`🎉 ได้ ${levelScore + timeBonus} คะแนน (โบนัสเวลา ${timeBonus})`, `📚 เรียนรู้: ${level.newKnowledge}`]);
    showSuccessNotification(`🎉 ผ่านด่าน ${level.id}!`);
    
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    
    nextLevel(nextScore);
  }

  async function testCurrentCode() {
    let currentCode = "";
    
    if (mode === "block") {
      currentCode = workspace.join("");
    } else {
      currentCode = codeEditorValue;
    }
    
    const fullHtml = buildPreview(currentCode);
    const result = await validateByDOM(fullHtml, level.id);
    
    if (result.isValid) {
      showSuccessNotification(`✅ ${result.validationMessage}`);
    } else {
      showErrorNotification(`❌ ${result.validationMessage}`);
      setFeedback([`🔍 ${result.validationMessage}`, `💡 ${level.hint}`]);
    }
  }

  function nextLevel(nextScore) {
    if (currentLevel === LEVELS.length - 1) {
      setStatus("won");
      setShowGameCompleteModal(true);
      saveRank(nextScore, LEVELS.length, "ผ่านครบทุกด่าน");
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.65 } });
      return;
    }

    const nextIndex = currentLevel + 1;
    setCurrentLevel(nextIndex);
    initLevel(nextIndex);
  }

  function saveRank(finalScore, levelsPassed, result) {
    const entry = {
      id: Date.now(),
      name: fullName || "ผู้เล่น",
      no: studentNo || "-",
      score: finalScore,
      levelsPassed,
      result,
      date: new Date().toLocaleDateString('th-TH')
    };
    const updated = [...leaderboard, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    localStorage.setItem("hybrid-coding-rank", JSON.stringify(updated));
  }

  function onDragStart(source, index) {
    if (status !== "playing" || mode !== "block") return;
    setDragItem({ source, index });
  }

  function onDragEnd() {
    setDragItem(null);
    setDropIndex(null);
    setIsDraggingOver(false);
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
      showSuccessNotification(`➕ เพิ่มบล็อก "${item}"`);
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
    setDropIndex(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  function handlePoolDrop() {
    if (!dragItem || isDropping || status !== "playing" || mode !== "block") return;
    if (dragItem.source !== "workspace") return;

    setIsDropping(true);
    const removedItem = workspace[dragItem.index];
    setWorkspace((prevWs) => {
      if (dragItem.index < 0 || dragItem.index >= prevWs.length) return prevWs;
      const item = prevWs[dragItem.index];
      const nextWs = prevWs.filter((_, i) => i !== dragItem.index);
      setPool((prevPool) => [...prevPool, item]);
      return nextWs;
    });
    showErrorNotification(`🗑️ ลบ "${removedItem}"`);
    setDragItem(null);
    setDropIndex(null);
    setTimeout(() => setIsDropping(false), 50);
  }

  // Intro Page
  if (page === "intro") {
    return (
      <div style={styles.appBg}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.heroLeft}>
              <div style={styles.logoWrapper}>
                <div style={styles.logoBubble}>
                  <span style={styles.logoText}>&lt;/&gt;</span>
                </div>
                <div style={styles.logoBadge}>🎮 Coding Adventure</div>
              </div>
              <h1 style={styles.mainTitle}>
                เรียนเขียนเว็บ<br />
                <span style={styles.gradientText}>จากบล็อกสู่โค้ดจริง</span>
              </h1>
              <p style={styles.subtitle}>
                เรียนรู้ HTML, CSS ผ่านเกม 20 ด่าน<br />
                ด่านคี่: ลากบล็อก | ด่านคู่: เขียนโค้ดเอง
              </p>
              
              <div style={styles.featureGrid}>
                <div style={styles.featureItem}>🎯 20 ด่าน ฝึกทั้งลากและเขียน</div>
                <div style={styles.featureItem}>🧩 ด่านคี่: ลากบล็อก</div>
                <div style={styles.featureItem}>⌨️ ด่านคู่: เขียนโค้ดเอง</div>
                <div style={styles.featureItem}>👁️ เห็นผล Real-time</div>
                <div style={styles.featureItem}>🏆 สะสมคะแนน</div>
                <div style={styles.featureItem}>💡 มีคำแนะนำทุกด่าน</div>
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
                🚀 เริ่มเล่นเลย!
              </button>
            </div>
          </div>
        </div>
        
        {/* เครดิตผู้สร้าง */}
        <div style={styles.creditFooter}>
          <p>พัฒนาโดย นางสาวพิทยาภรณ์ การะเวก</p>
          <p>มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี | ปีการศึกษา 2569</p>
        </div>
      </div>
    );
  }

  // Game Page
  return (
    <div style={styles.gameBg}>
      {showError && (
        <div style={styles.errorNotification}>
          ⚠️ {errorMessage}
        </div>
      )}
      {showSuccess && (
        <div style={styles.successNotification}>
          🎉 {errorMessage}
        </div>
      )}
      
      {/* Timeout Modal */}
      {showTimeoutModal && (
        <TimeoutModal onBackToHome={resetGame} />
      )}
      
      {/* Game Complete Modal */}
      {showGameCompleteModal && (
        <GameCompleteModal onBackToHome={resetGame} score={score} />
      )}
      
      <div style={styles.gameShell}>
        <div style={styles.topBar}>
          <div style={styles.playerInfo}>
            <div style={styles.playerName}>
              {fullName} <span style={styles.noBadge}>#{studentNo}</span>
            </div>
            <div style={styles.knowledgeBadge}>
              📚 กำลังเรียน: {level.newKnowledge}
            </div>
          </div>
          <div style={styles.topStats}>
            <button 
              onClick={() => setShowLearningPopup(true)}
              style={styles.learningBtn}
              title="เปิดเอกสารประกอบการเรียน"
            >
              📖 เอกสารประกอบการเรียน
            </button>
            <div style={styles.statPill}>⭐ {score}</div>
            <div style={styles.statPill}>⏱️ {secondsLeft}s</div>
            <div style={styles.statPill}>📋 {currentLevel + 1}/{LEVELS.length}</div>
          </div>
        </div>

        <div style={styles.progressContainer}>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${successPercent}%`}} />
          </div>
          <div style={styles.progressText}>
            <span>📊 ความคืบหน้า</span>
            <span style={styles.progressPercent}>{successPercent}%</span>
          </div>
        </div>

        <ModeToggle 
          mode={mode}
          setMode={setMode}
          currentLevelId={level.id}
        />

        <div style={styles.mainGrid}>
          <div style={styles.leftPanel}>
            <div style={styles.panelCard}>
              <div style={styles.levelHeader}>
                <div>
                  <div style={styles.levelTitle}>ด่าน {currentLevel + 1}: {level.title}</div>
                  <div style={styles.levelMeta}>
                    <span style={styles.difficultyBadge(level.difficulty)}>
                      {level.difficulty}
                    </span>
                    <span style={styles.modeBadge}>
                      {level.id % 2 === 1 ? "🧩 โหมดลากบล็อก" : "⌨️ โหมดเขียนโค้ด"}
                    </span>
                  </div>
                </div>
              </div>
              <div style={styles.goalText}>🎯 {level.goal}</div>
              <div style={styles.hintText}>💡 Hint: {level.hint}</div>
            </div>

            <div style={styles.editorCard}>
              <div style={styles.cardTitle}>
                {mode === "block" ? "🧩 พื้นที่ลากบล็อก" : "⌨️ โค้ดเอดิเตอร์"}
              </div>
              
              {mode === "block" ? (
                <>
                  <div style={styles.dragSectionTitle}>
                    📚 บล็อกคำสั่ง ({pool.length} บล็อก)
                  </div>
                  <div
                    style={styles.blockWrap}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handlePoolDrop();
                    }}
                  >
                    {pool.length === 0 ? (
                      <div style={styles.emptyBlockArea}>✅ ใช้บล็อกครบแล้ว!</div>
                    ) : (
                      pool.map((block, idx) => {
                        const c = getBlockStyle(block, false);
                        return (
                          <div
                            key={`pool-${idx}`}
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

                  <div style={styles.dragSectionTitle}>
                    🔧 พื้นที่จัดเรียง ({workspace.length} บล็อก)
                  </div>
                  <div 
                    className="answerZone" 
                    style={styles.answerZone}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                  >
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
                          return (
                            <div key={`ws-${idx}`} style={styles.workspaceItemWrapper}>
                              <div
                                draggable={status === "playing"}
                                onDragStart={() => onDragStart("workspace", idx)}
                                onDragEnd={onDragEnd}
                                style={{
                                  ...styles.blockBtn,
                                  ...styles.workspaceBlock,
                                  background: c.bg,
                                  borderColor: c.border,
                                  color: c.text,
                                }}
                              >
                                <span style={styles.blockNumber}>{idx + 1}</span>
                                {block}
                                <span style={styles.dragHandle}>⋮⋮</span>
                              </div>
                            </div>
                          );
                        })}
                        <div
                          style={styles.appendDropZone}
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
                    <div style={styles.codePreviewTitle}>📝 โค้ดที่ได้จากการเรียงบล็อก</div>
                    <pre style={styles.codePreviewBlock}>
                      <code>{workspace.length > 0 ? workspace.join("\n") : "// ยังไม่มีบล็อกที่เรียง"}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <textarea
                  value={codeEditorValue}
                  onChange={(e) => setCodeEditorValue(e.target.value)}
                  style={styles.codeTextarea}
                  placeholder="เขียนโค้ด HTML/CSS ของคุณที่นี่..."
                  spellCheck={false}
                />
              )}

              <div style={styles.actionRow}>
                <button onClick={checkAnswer} style={styles.primaryBtn}>
                  ✅ ตรวจคำตอบ
                </button>
                <button onClick={testCurrentCode} style={styles.testBtn}>
                  🔍 ทดสอบ
                </button>
                {mode === "block" && (
                  <button onClick={() => initLevel(currentLevel)} style={styles.secondaryBtn}>
                    🔄 รีเซ็ต
                  </button>
                )}
                <button onClick={resetGame} style={styles.secondaryBtn}>
                  🏠 กลับหน้าแรก
                </button>
              </div>

              <div style={styles.messageBox}>
                <strong>📢 สถานะ:</strong> {message || "รอการตรวจคำตอบ"}
                {feedback.length > 0 && (
                  <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                    {feedback.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
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

            <div style={styles.rankCard}>
              <div style={styles.cardTitle}>🏆 Leaderboard</div>
              {leaderboard.length === 0 ? (
                <div style={styles.emptyText}>ยังไม่มีข้อมูล</div>
              ) : (
                leaderboard.map((item, index) => (
                  <div key={item.id} style={styles.rankItem}>
                    <div style={styles.rankInfo}>
                      <div style={styles.rankName}>
                        {index === 0 && "🥇 "}
                        {index === 1 && "🥈 "}
                        {index === 2 && "🥉 "}
                        {item.name}
                      </div>
                      <div style={styles.rankMeta}>เลขที่ {item.no} • ผ่าน {item.levelsPassed} ด่าน</div>
                    </div>
                    <div style={styles.rankScore}>{item.score}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showLearningPopup && (
        <LearningPopup 
          level={level} 
          onClose={() => setShowLearningPopup(false)} 
        />
      )}
    </div>
  );
}

const styles = {
  appBg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
  },
  heroContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 24px",
  },
  heroContent: {
    maxWidth: 1200,
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 40,
    alignItems: "center",
  },
  heroLeft: { color: "white" },
  logoWrapper: { display: "flex", alignItems: "center", gap: 16, marginBottom: 32 },
  logoBubble: {
    width: 70,
    height: 70,
    borderRadius: 20,
    background: "linear-gradient(135deg, #ffd89b, #c7e9fb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 32, fontWeight: "bold", color: "#667eea" },
  logoBadge: { background: "rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 40, fontSize: 14 },
  mainTitle: { fontSize: 48, lineHeight: 1.2, marginBottom: 16 },
  gradientText: { background: "linear-gradient(135deg, #ffd89b, #c7e9fb)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" },
  subtitle: { fontSize: 18, opacity: 0.9, marginBottom: 32 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 },
  featureItem: { background: "rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: 12, fontSize: 14 },
  formCard: { background: "white", borderRadius: 32, padding: 40, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" },
  formHeader: { textAlign: "center", marginBottom: 32 },
  formIcon: { fontSize: 48, marginBottom: 12 },
  formTitle: { fontSize: 28, fontWeight: 700, color: "#1f2937" },
  formSubtitle: { color: "#6b7280", marginTop: 8 },
  inputGroup: { marginBottom: 20 },
  label: { display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#374151" },
  input: { width: "100%", padding: "14px 16px", fontSize: 16, borderRadius: 12, border: "2px solid #e5e7eb", boxSizing: "border-box" },
  startBtn: { width: "100%", border: "none", borderRadius: 12, padding: "16px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontWeight: 700, fontSize: 18, cursor: "pointer" },
  creditFooter: {
    textAlign: "center",
    padding: "20px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    marginTop: "40px",
  },
  
  gameBg: { minHeight: "100vh", padding: 20, background: "#f0f4f8" },
  gameShell: { maxWidth: 1400, margin: "0 auto" },
  errorNotification: { position: "fixed", top: 20, right: 20, background: "#ef4444", color: "white", padding: "12px 24px", borderRadius: 12, zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  successNotification: { position: "fixed", top: 20, right: 20, background: "#10b981", color: "white", padding: "12px 24px", borderRadius: 12, zIndex: 1000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  playerInfo: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  playerName: { fontSize: 18, fontWeight: 700, color: "#1f2937", background: "white", padding: "8px 16px", borderRadius: 40 },
  noBadge: { background: "#e5e7eb", padding: "2px 8px", borderRadius: 20, fontSize: 12, marginLeft: 8 },
  knowledgeBadge: { background: "#dbeafe", color: "#1e40af", padding: "8px 16px", borderRadius: 40, fontSize: 14 },
  topStats: { display: "flex", gap: 12 },
  learningBtn: { background: "#8b5cf6", color: "white", border: "none", padding: "8px 16px", borderRadius: 40, cursor: "pointer", fontWeight: 600 },
  statPill: { background: "white", padding: "8px 16px", borderRadius: 40, fontSize: 14, fontWeight: 600, color: "#374151" },
  progressContainer: { marginBottom: 20 },
  progressBar: { background: "#e5e7eb", borderRadius: 20, height: 12, overflow: "hidden" },
  progressFill: { background: "linear-gradient(90deg, #10b981, #34d399)", height: "100%", transition: "width 0.3s ease", borderRadius: 20 },
  progressText: { display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 14, color: "#6b7280" },
  progressPercent: { fontWeight: 700, color: "#10b981" },
  modeToggleContainer: { background: "white", borderRadius: 20, padding: 20, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  modeToggleHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap" },
  modeToggleTitle: { fontWeight: 700, color: "#1f2937" },
  modeToggleHint: { fontSize: 14, color: "#6b7280" },
  modeToggleButtons: { display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" },
  modeBtn: { flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderRadius: 16, border: "2px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", transition: "all 0.2s", position: "relative" },
  modeBtnBlock: { borderLeft: "4px solid #3b82f6" },
  modeBtnCode: { borderLeft: "4px solid #10b981" },
  modeBtnActive: { background: "#eff6ff", borderColor: "#3b82f6" },
  modeBtnIcon: { fontSize: 32 },
  modeBtnText: { flex: 1 },
  modeBtnTitle: { fontWeight: 700, marginBottom: 4, color: "#000000"  },
  modeBtnDesc: { fontSize: 12, color: "#000000" },
  modeBtnCheck: { background: "#10b981", color: "white", borderRadius: 20, padding: "2px 8px", fontSize: 12 },
  modeInfo: { fontSize: 13, color: "#6b7280", padding: 12, background: "#fef3c7", borderRadius: 12 },
  mainGrid: { display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 },
  leftPanel: { display: "flex", flexDirection: "column", gap: 20 },
  rightPanel: { display: "flex", flexDirection: "column", gap: 20 },
  panelCard: { background: "white", borderRadius: 20, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  editorCard: { background: "white", borderRadius: 20, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  previewCard: { background: "white", borderRadius: 20, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  rankCard: { background: "white", borderRadius: 20, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
  cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#1f2937" },
  levelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  levelTitle: { fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 8 },
  levelMeta: { display: "flex", gap: 8, flexWrap: "wrap" },
  difficultyBadge: (difficulty) => ({ background: difficulty === "ง่าย" ? "#d1fae5" : "#fef3c7", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }),
  modeBadge: { background: "#e0e7ff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  goalText: { fontSize: 16, color: "#4b5563", marginBottom: 12 },
  hintText: { fontSize: 14, color: "#6b7280", fontStyle: "italic" },
  dragSectionTitle: { fontSize: 14, fontWeight: 600, marginTop: 16, marginBottom: 12, color: "#374151" },
  blockWrap: { display: "flex", flexWrap: "wrap", gap: 10, padding: 16, background: "#f9fafb", borderRadius: 16, minHeight: 120 },
  blockBtn: { padding: "10px 16px", borderRadius: 12, border: "2px solid", cursor: "grab", userSelect: "none", display: "inline-block", fontSize: 14, fontWeight: 500, transition: "all 0.2s" },
  answerZone: { background: "#f9fafb", borderRadius: 16, padding: 16, minHeight: 200, border: "2px dashed #cbd5e1" },
  emptyDropZone: { display: "flex", alignItems: "center", justifyContent: "center", height: 150, color: "#9ca3af", fontSize: 14 },
  workspaceContainer: { display: "flex", flexDirection: "column", gap: 8 },
  workspaceItemWrapper: { position: "relative" },
  workspaceBlock: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  blockNumber: { background: "#e5e7eb", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 },
  dragHandle: { cursor: "grab", opacity: 0.5, fontSize: 18 },
  appendDropZone: { marginTop: 12, padding: 12, textAlign: "center", background: "#f3f4f6", borderRadius: 12, color: "#6b7280", fontSize: 13, cursor: "pointer", border: "1px dashed #cbd5e1" },
  codePreviewSection: { marginTop: 16, padding: 12, background: "#1e293b", borderRadius: 12 },
  codePreviewTitle: { fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 8 },
  codePreviewBlock: { background: "#0f172a", padding: 12, borderRadius: 8, overflow: "auto", fontSize: 12, color: "#e2e8f0", fontFamily: "monospace" },
  codeTextarea: { width: "100%", minHeight: 300, padding: 16, fontSize: 14, fontFamily: "monospace", borderRadius: 12, border: "2px solid #e5e7eb", resize: "vertical", background: "#1e293b", color: "#e2e8f0" },
  actionRow: { display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" },
  primaryBtn: { flex: 1, background: "#10b981", color: "white", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 14 },
  testBtn: { flex: 1, background: "#3b82f6", color: "white", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 14 },
  secondaryBtn: { background: "#6b7280", color: "white", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 14 },
  messageBox: { marginTop: 16, padding: 16, background: "#f3f4f6", borderRadius: 12, fontSize: 14 },
  previewFrame: { width: "100%", height: 400, border: "1px solid #e5e7eb", borderRadius: 12, background: "white" },
  emptyText: { textAlign: "center", color: "#9ca3af", padding: 20 },
  rankItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" },
  rankInfo: { flex: 1 },
  rankName: { fontWeight: 600, fontSize: 14, marginBottom: 4 },
  rankMeta: { fontSize: 11, color: "#6b7280" },
  rankScore: { fontWeight: 700, color: "#f59e0b", fontSize: 16 },
  popupOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(4px)" },
  popupContent: { background: "white", borderRadius: 32, maxWidth: 600, width: "90%", maxHeight: "85vh", overflow: "auto", padding: 32, position: "relative", animation: "slideInPopup 0.3s ease" },
  popupClose: { position: "absolute", top: 16, right: 16, background: "#f3f4f6", border: "none", width: 32, height: 32, borderRadius: 16, cursor: "pointer", fontSize: 18 },
  popupHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 24 },
  popupIcon: { fontSize: 40 },
  popupTitle: { fontSize: 24, fontWeight: 700, color: "#1f2937", margin: 0 },
  popupBody: { marginBottom: 24 },
  learningSection: { marginBottom: 20 },
  conceptCard: { background: "#dbeafe", padding: 16, borderRadius: 16, display: "flex", gap: 12, alignItems: "center" },
  conceptIcon: { fontSize: 24 },
  whyCard: { background: "#fef3c7", padding: 16, borderRadius: 16 },
  howCard: { background: "#d1fae5", padding: 16, borderRadius: 16, fontFamily: "monospace" },
  exampleCard: { background: "#f3e8ff", padding: 16, borderRadius: 16, fontFamily: "monospace" },
  practiceCard: { background: "#fed7aa", padding: 16, borderRadius: 16, display: "flex", gap: 12, alignItems: "center" },
  knowledgeTags: { display: "flex", flexWrap: "wrap", gap: 8 },
  knowledgeTag: { background: "#e5e7eb", padding: "6px 12px", borderRadius: 20, fontSize: 12 },
  popupFooter: { display: "flex", justifyContent: "center" },
  gotItBtn: { background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", padding: "14px 32px", borderRadius: 40, fontWeight: 600, cursor: "pointer", fontSize: 16 },
  timeoutOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" },
  timeoutModal: { background: "white", borderRadius: 32, padding: 40, textAlign: "center", maxWidth: 400, width: "90%", animation: "modalFadeIn 0.3s ease", boxShadow: "0 25px 50px rgba(0,0,0,0.3)" },
  timeoutIcon: { fontSize: 64, marginBottom: 20 },
  gameCompleteIcon: { fontSize: 64, marginBottom: 20 },
  timeoutTitle: { fontSize: 28, fontWeight: 700, color: "#1f2937", marginBottom: 16 },
  timeoutMessage: { fontSize: 16, color: "#6b7280", marginBottom: 24 },
  timeoutButton: { background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", padding: "14px 32px", borderRadius: 40, fontWeight: 600, cursor: "pointer", fontSize: 16, width: "100%" },
};