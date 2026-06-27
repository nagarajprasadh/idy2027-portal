/* ─────────────────────────────────────────────
   Ananda — IDY 2027 Floating Chatbot Widget
   Bilingual: English / Thai
───────────────────────────────────────────── */
(function () {
  if (document.getElementById('ananda-root')) return;

  /* ── Load external scripts ── */
  function loadScript(src, id) {
    return new Promise(resolve => {
      if (document.getElementById(id)) { resolve(); return; }
      const s = document.createElement('script'); s.src = src; s.id = id;
      s.onload = resolve; s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  const FIREBASE_CONFIG = {
    apiKey:      'AIzaSyCJ31EusilYxaGWaorwYjqffVgV5crSecM',
    databaseURL: 'https://idy2027-dba28-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId:   'idy2027-dba28',
    authDomain:  'idy2027-dba28.firebaseapp.com',
  };

  /* ── Language — auto-detect from page, fallback EN ── */
  let _lang = (typeof window.lang !== 'undefined' ? window.lang : 'en');

  /* ── Translations ── */
  const T = {
    en: {
      sub:       'IDY 2027 Assistant',
      greet:     `Namaste! 🙏 I'm <strong>Ananda</strong>, your assistant for the <strong>13th International Day of Yoga 2027</strong>.<br><br>I can retrieve your <strong>QR code</strong> right here, or answer questions about T-shirts, mats, hydration, and the event. How can I help?`,
      placeholder: 'Ask me anything…',
      qb: { qr:'🔍 Get my QR code', reg:'🔢 Reg. number', tshirt:'👕 T-shirt', mat:'🧘 Mats', water:'💧 Hydration', event:'📅 Event details' },
      kb: {
        retrieve_qr: {
          label: 'How do I get my QR code?',
          intro: `<strong>📲 Retrieve Your QR Code</strong><br><br><span class="no">✘</span> <strong>No email is sent</strong> — your QR code is shown on-screen at registration and must be saved/screenshotted then.<br><br>Enter your details below and I'll pull it up for you:`,
        },
        reg_number: {
          label: 'How do I find my registration number?',
          intro: `<strong>🔢 Registration Number</strong><br><br>Your registration number is on your pass. Let me retrieve it for you:`,
        },
        tshirt: `<strong>👕 T-Shirt Collection</strong><br><br><span class="ok">✔</span> <strong>1 T-shirt per participant</strong> — no exceptions.<br><span class="ok">✔</span> Show your <strong>QR code</strong> at the collection counter.<br><span class="no">✘</span> <strong>No bulk collection</strong> — each person must be present with their own QR code.<br><span class="no">✘</span> Unclaimed shirts will not be held after the window closes.<br><br><span class="at">📍 Counter</span> At the event entrance — follow signage.`,
        mat:    `<strong>🧘 Yoga Mats</strong><br><br><span class="ok">✔</span> <strong>Mats will be laid out</strong> for all participants — no need to bring your own.<br><br>Just arrive, check in, and find your spot. Personal mats are welcome if you prefer.`,
        water:  `<strong>💧 Hydration</strong><br><br><span class="ok">✔</span> <strong>Bring your own water bottle</strong> — Bangkok in June is warm!<br><span class="ok">✔</span> Water refill stations on-site.<br><br>Aim for at least <strong>500ml–1L</strong>. Avoid heavy meals 1–2 hours before.`,
        event:  `<strong>📅 13th International Day of Yoga 2027</strong><br><br><span class="at">Date</span> Sunday, <strong>20 June 2027</strong><br><span class="at">Venue</span> <strong>Chulalongkorn University</strong>, Bangkok<br><br>Bring your <strong>QR code</strong> and a <strong>water bottle</strong>. Mats provided on-site.`,
      },
      form: {
        emailLbl: 'Email used at registration',
        emailPH:  'your@email.com',
        yobLbl:   'Year of Birth',
        yobPH:    'e.g. 1985 or 2528',
        btn:      'Find My Pass ➤',
        searching:'Searching…',
        errEmail: 'Please enter a valid email address.',
        errMatch: 'Year of birth does not match. Please check and try again.',
        errNotFound: 'No registration found for this email. Please check and try again.',
        errConn:  'Connection error. Please try again.',
        found:    (n) => `✓ Found ${n} pass${n>1?'es':''} — screenshot to save!`,
        note:     '📸 Screenshot this pass — needed for entry & T-shirt collection.',
      },
      fallback: `I'm not sure about that. Try the quick-reply buttons, or ask about QR code, T-shirt, mats, hydration, or the event.`,
      text_kb: [
        { k:['bulk','collect for','on behalf','others','friend','family'], a:`<strong>🚫 No Bulk Collection</strong><br><br><span class="no">✘</span> T-shirts cannot be collected on behalf of others.<br><span class="ok">✔</span> Each participant must present their <strong>own QR code</strong> in person.` },
        { k:['lost','lost qr','lost pass'], a:`<strong>🔎 Lost Your QR Code?</strong><br><br><span class="no">✘</span> No email is sent — QR is only shown on-screen at registration.<br><br>Tap <strong>"Get my QR code"</strong> and I'll retrieve it right here!` },
        { k:['wear','attire','dress','clothing','what to bring'], a:`<strong>👗 What to Bring</strong><br><ul><li>Comfortable <strong>yoga/sportswear</strong></li><li>Your <strong>QR code</strong></li><li>A <strong>water bottle</strong></li></ul><span class="no">✘</span> No need for a mat — provided on-site.` },
        { k:['check in','checkin','check-in','entry','arrive'], a:`<strong>✅ Check-in on Event Day</strong><br><ol><li>Go to the <strong>Check-in Counter</strong>.</li><li>Show your <strong>QR code</strong>.</li><li>Collect your T-shirt at the same counter.</li></ol>` },
        { k:['parking','transport','bts','mrt','how to get'], a:`<strong>🚗 Getting There</strong><br><br>BTS — Sala Daeng / National Stadium<br>MRT — Sam Yan (short walk to Chulalongkorn University)<br><br>Public transport strongly recommended.` },
        { k:['thank','thanks','bye','great','perfect','ok','got it'], a:`You're welcome! 🙏 See you on <strong>20 June 2027</strong>! 🪷` },
        { k:['hi','hello','hey','namaste','good morning','sawadee'], a:`Namaste! 🙏 I'm <strong>Ananda</strong>. Ask me anything or tap a button below!` },
      ],
      switchLang: 'ภาษาไทย',
    },
    th: {
      sub:       'ผู้ช่วย IDY 2027',
      greet:     `นมัสเต! 🙏 ฉันชื่อ <strong>อานันดา</strong> ผู้ช่วยงาน <strong>วันโยคะสากล 2027 ครั้งที่ 13</strong><br><br>ฉันช่วยดึง <strong>QR code</strong> ของคุณได้ทันที หรือตอบคำถามเกี่ยวกับเสื้อ เสื่อ น้ำ และรายละเอียดงาน ต้องการอะไรคะ?`,
      placeholder: 'พิมพ์คำถามที่นี่…',
      qb: { qr:'🔍 ดู QR code', reg:'🔢 เลขลงทะเบียน', tshirt:'👕 รับเสื้อ', mat:'🧘 เสื่อโยคะ', water:'💧 น้ำดื่ม', event:'📅 รายละเอียดงาน' },
      kb: {
        retrieve_qr: {
          label: 'ฉันจะดู QR code ได้อย่างไร?',
          intro: `<strong>📲 ดึง QR Code ของคุณ</strong><br><br><span class="no">✘</span> <strong>ไม่มีการส่งอีเมล</strong> — QR code จะแสดงบนหน้าจอทันทีหลังลงทะเบียน ต้องถ่ายภาพหน้าจอเก็บไว้<br><br>กรอกข้อมูลด้านล่าง แล้วฉันจะดึง QR code ให้คุณทันที:`,
        },
        reg_number: {
          label: 'ฉันจะหาเลขลงทะเบียนได้ที่ไหน?',
          intro: `<strong>🔢 เลขลงทะเบียน</strong><br><br>เลขลงทะเบียนอยู่บนบัตรผ่านของคุณ ให้ฉันช่วยดึงข้อมูลให้:`,
        },
        tshirt: `<strong>👕 การรับเสื้อ</strong><br><br><span class="ok">✔</span> <strong>1 ตัวต่อผู้ลงทะเบียน 1 คน</strong> ไม่มีข้อยกเว้น<br><span class="ok">✔</span> แสดง <strong>QR code</strong> ที่จุดรับเสื้อ<br><span class="no">✘</span> <strong>ไม่รับแทน</strong> — ผู้เข้าร่วมแต่ละคนต้องมารับด้วยตนเองพร้อม QR code ของตนเอง<br><span class="no">✘</span> เสื้อที่ไม่ได้รับภายในเวลาที่กำหนดจะไม่ถูกจัดเก็บไว้<br><br><span class="at">📍 จุดรับเสื้อ</span> บริเวณทางเข้างาน — ดูป้ายบอกทาง`,
        mat:   `<strong>🧘 เสื่อโยคะ</strong><br><br><span class="ok">✔</span> <strong>มีเสื่อปูไว้ให้</strong> สำหรับผู้เข้าร่วมทุกคน ไม่ต้องนำมาเอง<br><br>มาถึงงาน เช็คอิน แล้วหาจุดของคุณได้เลย หากต้องการใช้เสื่อส่วนตัวสามารถนำมาได้`,
        water: `<strong>💧 น้ำดื่ม</strong><br><br><span class="ok">✔</span> <strong>นำขวดน้ำส่วนตัวมาด้วย</strong> — อากาศกรุงเทพฯ เดือนมิถุนายนร้อนมาก<br><span class="ok">✔</span> มีจุดเติมน้ำในงาน<br><br>ควรมีน้ำอย่างน้อย <strong>500ml–1L</strong> และหลีกเลี่ยงอาหารหนัก 1–2 ชั่วโมงก่อนเริ่ม`,
        event: `<strong>📅 วันโยคะสากล 2027 ครั้งที่ 13</strong><br><br><span class="at">วันที่</span> วันอาทิตย์ที่ <strong>20 มิถุนายน 2570</strong><br><span class="at">สถานที่</span> <strong>จุฬาลงกรณ์มหาวิทยาลัย</strong> กรุงเทพฯ<br><br>นำ <strong>QR code</strong> และ <strong>ขวดน้ำ</strong> มาด้วย มีเสื่อให้ในงาน`,
      },
      form: {
        emailLbl: 'อีเมลที่ใช้ลงทะเบียน',
        emailPH:  'อีเมลของท่าน@example.com',
        yobLbl:   'ปีเกิด',
        yobPH:    'เช่น 1985 หรือ 2528',
        btn:      'ค้นหาบัตรผ่านของฉัน ➤',
        searching:'กำลังค้นหา…',
        errEmail: 'กรุณากรอกที่อยู่อีเมลให้ถูกต้อง',
        errMatch: 'ปีเกิดไม่ตรงกัน กรุณาตรวจสอบและลองใหม่',
        errNotFound: 'ไม่พบข้อมูลการลงทะเบียนสำหรับอีเมลนี้ กรุณาตรวจสอบและลองใหม่',
        errConn:  'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
        found:    (n) => `✓ พบ ${n} บัตรผ่าน — ถ่ายภาพหน้าจอเก็บไว้!`,
        note:     '📸 ถ่ายภาพหน้าจอบัตรนี้ — จำเป็นสำหรับการเข้างานและรับเสื้อ',
      },
      fallback: `ขออภัย ฉันไม่เข้าใจคำถาม ลองกดปุ่มด้านล่างหรือถามเกี่ยวกับ QR code เสื้อ เสื่อ น้ำ หรือรายละเอียดงาน`,
      text_kb: [
        { k:['รับแทน','แทน','เพื่อน','ครอบครัว','bulk'], a:`<strong>🚫 ไม่รับเสื้อแทน</strong><br><br><span class="no">✘</span> ไม่สามารถรับเสื้อแทนผู้อื่นได้<br><span class="ok">✔</span> ผู้เข้าร่วมแต่ละคนต้องมารับด้วยตนเองพร้อม <strong>QR code</strong> ของตนเอง` },
        { k:['หาย','ไม่ได้รับ','ไม่มี qr','lost'], a:`<strong>🔎 QR Code หาย?</strong><br><br><span class="no">✘</span> ไม่มีการส่งอีเมล — QR แสดงบนหน้าจอตอนลงทะเบียนเท่านั้น<br><br>กด <strong>"ดู QR code"</strong> แล้วฉันจะดึงให้ทันที!` },
        { k:['สวัสดี','หวัดดี','นมัสเต'], a:`นมัสเต! 🙏 ฉันคืออานันดา ถามฉันได้เลยหรือกดปุ่มด้านล่าง!` },
        { k:['ขอบคุณ','เข้าใจแล้ว','โอเค','ok'], a:`ด้วยความยินดี! 🙏 เจอกันวันที่ <strong>20 มิถุนายน 2570</strong>! 🪷` },
      ],
      switchLang: 'English',
    }
  };

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #ananda-root * { box-sizing:border-box; margin:0; padding:0; font-family:'Noto Sans Thai','Noto Sans',system-ui,sans-serif; }
    #ananda-launcher { position:fixed; bottom:24px; right:24px; width:62px; height:62px; background:linear-gradient(135deg,#002D6E,#1a4a9e); border-radius:50%; box-shadow:0 4px 18px rgba(0,45,110,.38); cursor:pointer; border:none; display:flex; align-items:center; justify-content:center; font-size:27px; z-index:9999; transition:transform .2s; animation:a-pulse 2.8s infinite; }
    #ananda-launcher:hover { transform:scale(1.1); }
    @keyframes a-pulse { 0%,100%{box-shadow:0 4px 18px rgba(0,45,110,.38),0 0 0 0 rgba(255,153,51,.45)} 55%{box-shadow:0 4px 18px rgba(0,45,110,.38),0 0 0 11px rgba(255,153,51,0)} }
    #ananda-badge { position:absolute; top:-3px; right:-3px; width:18px; height:18px; background:#FF9933; color:#fff; font-size:10px; font-weight:700; border-radius:50%; border:2px solid #fff; display:none; align-items:center; justify-content:center; }
    #ananda-window { position:fixed; bottom:98px; right:24px; width:364px; max-height:570px; background:#F4F6FB; border-radius:18px; box-shadow:0 8px 40px rgba(0,45,110,.22); display:flex; flex-direction:column; z-index:9998; overflow:hidden; opacity:0; pointer-events:none; transform:translateY(14px) scale(.97); transition:opacity .22s,transform .22s; }
    #ananda-window.open { opacity:1; pointer-events:all; transform:translateY(0) scale(1); }
    #ananda-hdr { background:#002D6E; padding:13px 16px; display:flex; align-items:center; gap:10px; flex-shrink:0; }
    .a-av { width:38px; height:38px; background:linear-gradient(135deg,#FF9933,#e07700); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
    .a-hname { color:#fff; font-size:14px; font-weight:700; }
    .a-hsub  { color:rgba(255,255,255,.6); font-size:11px; margin-top:1px; }
    .a-dot   { display:inline-block; width:7px; height:7px; background:#4ade80; border-radius:50%; margin-right:4px; vertical-align:middle; }
    #ananda-lang { background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.3); color:#fff; border-radius:12px; padding:3px 9px; font-size:11px; font-family:inherit; cursor:pointer; white-space:nowrap; }
    #ananda-lang:hover { background:rgba(255,255,255,.25); }
    #ananda-x { background:rgba(255,255,255,.12); border:none; color:#fff; width:28px; height:28px; border-radius:50%; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    #ananda-x:hover { background:rgba(255,255,255,.24); }
    #ananda-tri { display:flex; height:4px; flex-shrink:0; }
    #ananda-tri .at-s{flex:1;background:#FF9933} .at-w{flex:1;background:#fff} .at-g{flex:1;background:#138808}
    #ananda-msgs { flex:1; overflow-y:auto; padding:12px 12px 6px; display:flex; flex-direction:column; gap:8px; min-height:0; }
    #ananda-msgs::-webkit-scrollbar{width:3px} #ananda-msgs::-webkit-scrollbar-thumb{background:#DDE2EE;border-radius:3px}
    .a-msg { display:flex; align-items:flex-end; gap:6px; max-width:92%; }
    .a-msg.bot { align-self:flex-start; } .a-msg.user { align-self:flex-end; flex-direction:row-reverse; }
    .a-mav { width:26px; height:26px; background:linear-gradient(135deg,#FF9933,#e07700); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
    .a-bbl { padding:9px 13px; border-radius:16px; font-size:13px; line-height:1.55; }
    .a-msg.bot  .a-bbl { background:#fff; border:1px solid #DDE2EE; border-bottom-left-radius:4px; color:#1A1A2E; }
    .a-msg.user .a-bbl { background:#002D6E; color:#fff; border-bottom-right-radius:4px; }
    .a-bbl strong{color:#002D6E} .a-msg.user .a-bbl strong{color:#FF9933}
    .a-bbl .at{display:inline-block;background:#FFF3E0;color:#c45a00;border:1px solid #FFD580;border-radius:5px;font-size:11px;font-weight:600;padding:1px 6px;margin:2px 2px 0 0}
    .a-bbl .ok{color:#138808;font-weight:700} .a-bbl .no{color:#DC2626;font-weight:700}
    .a-bbl ol,.a-bbl ul{padding-left:16px;margin-top:5px} .a-bbl li{margin-bottom:3px} .a-bbl hr{border:none;border-top:1px solid #DDE2EE;margin:7px 0}
    .a-dots{display:flex;gap:4px;padding:9px 13px} .a-dots span{width:6px;height:6px;background:#6B7280;border-radius:50%;animation:a-b 1.2s infinite} .a-dots span:nth-child(2){animation-delay:.2s} .a-dots span:nth-child(3){animation-delay:.4s}
    @keyframes a-b{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
    #ananda-qr-btns{padding:6px 12px 8px;display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0}
    .a-qb{background:#fff;border:1.5px solid #002D6E;color:#002D6E;border-radius:14px;padding:5px 11px;font-size:12px;font-family:inherit;cursor:pointer;transition:all .15s;font-weight:500}
    .a-qb:hover{background:#002D6E;color:#fff}
    #ananda-bar{display:flex;gap:7px;padding:8px 12px 12px;flex-shrink:0;border-top:1px solid #DDE2EE}
    #ananda-inp{flex:1;padding:9px 14px;border:1.5px solid #DDE2EE;border-radius:20px;font-size:13px;font-family:inherit;outline:none;background:#fff;color:#1A1A2E;transition:border-color .2s}
    #ananda-inp:focus{border-color:#002D6E} #ananda-inp::placeholder{color:#6B7280}
    #ananda-snd{width:38px;height:38px;background:#002D6E;border:none;border-radius:50%;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    #ananda-snd:hover{background:#1a4a9e}
    .a-qr-form{background:#F4F6FB;border:1px solid #DDE2EE;border-radius:12px;padding:12px;margin-top:8px}
    .a-qr-form label{display:block;font-size:12px;font-weight:600;color:#002D6E;margin-bottom:4px}
    .a-qr-form input{width:100%;padding:8px 11px;border:1.5px solid #DDE2EE;border-radius:8px;font-size:13px;font-family:inherit;outline:none;margin-bottom:8px;color:#1A1A2E}
    .a-qr-form input:focus{border-color:#002D6E}
    .a-qr-form button{width:100%;padding:9px;background:#002D6E;color:#fff;border:none;border-radius:8px;font-size:13px;font-family:inherit;font-weight:600;cursor:pointer}
    .a-qr-form button:hover{background:#1a4a9e} .a-qr-form button:disabled{background:#9ca3af;cursor:not-allowed}
    .a-qr-err{color:#DC2626;font-size:12px;margin-top:-4px;margin-bottom:6px}
    .a-pass-card{background:#fff;border:1px solid #DDE2EE;border-radius:10px;padding:12px;margin-top:8px;text-align:center}
    .a-pass-name{font-weight:700;font-size:14px;color:#002D6E} .a-pass-meta{font-size:12px;color:#6B7280;margin:3px 0 10px}
    .a-pass-status-reg{display:inline-block;background:#ECFDF5;color:#138808;border:1px solid #86efac;border-radius:6px;font-size:11px;font-weight:700;padding:2px 9px;margin-bottom:10px}
    .a-pass-status-in{display:inline-block;background:#FEF3C7;color:#b45309;border:1px solid #fcd34d;border-radius:6px;font-size:11px;font-weight:700;padding:2px 9px;margin-bottom:10px}
    .a-pass-qr{margin:0 auto 8px} .a-pass-note{font-size:11px;color:#6B7280}
    @media(max-width:420px){#ananda-window{width:calc(100vw - 20px);right:10px;bottom:86px} #ananda-launcher{right:12px;bottom:12px}}
  `;
  document.head.appendChild(style);

  /* ── Markup ── */
  const root = document.createElement('div');
  root.id = 'ananda-root';
  root.innerHTML = `
    <button id="ananda-launcher" title="Chat with Ananda">🧘<span id="ananda-badge">1</span></button>
    <div id="ananda-window">
      <div id="ananda-hdr">
        <div class="a-av">🧘</div>
        <div style="flex:1">
          <div class="a-hname">Ananda</div>
          <div class="a-hsub"><span class="a-dot"></span><span id="a-sub-txt"></span></div>
        </div>
        <button id="ananda-lang"></button>
        <button id="ananda-x" title="Close">✕</button>
      </div>
      <div id="ananda-tri"><div class="at-s"></div><div class="at-w"></div><div class="at-g"></div></div>
      <div id="ananda-msgs"></div>
      <div id="ananda-qr-btns"></div>
      <div id="ananda-bar">
        <input id="ananda-inp" type="text" autocomplete="off">
        <button id="ananda-snd">➤</button>
      </div>
    </div>`;
  document.body.appendChild(root);

  /* ── DOM refs ── */
  const win     = document.getElementById('ananda-window');
  const msgs    = document.getElementById('ananda-msgs');
  const inp     = document.getElementById('ananda-inp');
  const badge   = document.getElementById('ananda-badge');
  const qrBtns  = document.getElementById('ananda-qr-btns');
  const langBtn = document.getElementById('ananda-lang');
  const subTxt  = document.getElementById('a-sub-txt');

  /* ── Apply language UI ── */
  function applyLang() {
    const t = T[_lang];
    subTxt.textContent    = t.sub;
    inp.placeholder       = t.placeholder;
    langBtn.textContent   = t.switchLang;
    // Rebuild quick reply buttons
    qrBtns.innerHTML = '';
    const qb = t.qb;
    [['retrieve_qr', qb.qr], ['reg_number', qb.reg], ['tshirt', qb.tshirt],
     ['mat', qb.mat], ['water', qb.water], ['event', qb.event]].forEach(([key, label]) => {
      const b = document.createElement('button');
      b.className = 'a-qb';
      b.textContent = label;
      b.onclick = () => anandaQ(key);
      qrBtns.appendChild(b);
    });
  }

  langBtn.addEventListener('click', () => {
    _lang = _lang === 'en' ? 'th' : 'en';
    applyLang();
  });

  /* ── Toggle chat ── */
  document.getElementById('ananda-launcher').addEventListener('click', () => {
    const opening = !win.classList.contains('open');
    win.classList.toggle('open');
    if (opening) { badge.style.display = 'none'; inp.focus(); if (!_greeted) greet(); }
  });
  document.getElementById('ananda-x').addEventListener('click', () => win.classList.remove('open'));
  document.getElementById('ananda-snd').addEventListener('click', sendFromInput);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') sendFromInput(); });

  /* ── Message helpers ── */
  function botMsg(html) {
    const w = document.createElement('div'); w.className = 'a-msg bot';
    const av = document.createElement('div'); av.className = 'a-mav'; av.textContent = '🧘';
    const b  = document.createElement('div'); b.className  = 'a-bbl'; b.innerHTML = html;
    w.appendChild(av); w.appendChild(b); msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight; return b;
  }
  function userMsg(text) {
    const w = document.createElement('div'); w.className = 'a-msg user';
    const b = document.createElement('div'); b.className  = 'a-bbl'; b.textContent = text;
    w.appendChild(b); msgs.appendChild(w); msgs.scrollTop = msgs.scrollHeight;
  }
  function showTyping() {
    const w = document.createElement('div'); w.className = 'a-msg bot'; w.id = 'a-typing';
    const av = document.createElement('div'); av.className = 'a-mav'; av.textContent = '🧘';
    const b  = document.createElement('div'); b.className  = 'a-bbl a-dots'; b.innerHTML = '<span></span><span></span><span></span>';
    w.appendChild(av); w.appendChild(b); msgs.appendChild(w); msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() { const el = document.getElementById('a-typing'); if (el) el.remove(); }

  /* ── Inline QR retrieval ── */
  async function showRetrieveForm(bubble) {
    await Promise.all([
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',      'ananda-fb-app'),
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js', 'ananda-fb-db'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',  'ananda-qrlib'),
    ]);
    try {
      if (!window._anandaFbApp) window._anandaFbApp = firebase.initializeApp(FIREBASE_CONFIG, 'ananda');
      window._anandaDb = firebase.app('ananda').database();
    } catch(e) { window._anandaDb = firebase.database(); }

    const f = T[_lang].form;
    const uid = Date.now();
    bubble.innerHTML += `
      <div class="a-qr-form" id="af-${uid}">
        <label>${f.emailLbl}</label>
        <input id="af-em-${uid}" type="email" placeholder="${f.emailPH}">
        <label>${f.yobLbl}</label>
        <input id="af-yb-${uid}" type="text" placeholder="${f.yobPH}">
        <div class="a-qr-err" id="af-er-${uid}" style="display:none"></div>
        <button id="af-bt-${uid}" onclick="anandaDoRetrieve(${uid})">${f.btn}</button>
      </div>
      <div id="af-rs-${uid}"></div>`;
    msgs.scrollTop = msgs.scrollHeight;
  }

  window.anandaDoRetrieve = async function(uid) {
    const f      = T[_lang].form;
    const email  = (document.getElementById('af-em-'+uid).value||'').trim().toLowerCase();
    const yob    = (document.getElementById('af-yb-'+uid).value||'').trim();
    const errEl  = document.getElementById('af-er-'+uid);
    const resEl  = document.getElementById('af-rs-'+uid);
    const btnEl  = document.getElementById('af-bt-'+uid);

    errEl.style.display = 'none';
    if (!email || !email.includes('@')) { errEl.textContent = f.errEmail; errEl.style.display='block'; return; }

    btnEl.disabled = true; btnEl.textContent = f.searching;

    const emailToKey = e => e.toLowerCase().replace(/\./g,',').replace(/@/g,'_at_');
    const normYOB    = v => { const y=parseInt((v||'').trim()); if(!y||y<1900) return null; return y>2400?y-543:y; };

    try {
      const snap = await window._anandaDb.ref('registrations/'+emailToKey(email)).once('value');
      if (!snap.exists()) { errEl.textContent=f.errNotFound; errEl.style.display='block'; btnEl.disabled=false; btnEl.textContent=f.btn; return; }

      const reg = snap.val();
      if (reg.yearOfBirth) {
        const y = normYOB(yob);
        if (!y || y !== reg.yearOfBirth) { errEl.textContent=f.errMatch; errEl.style.display='block'; btnEl.disabled=false; btnEl.textContent=f.btn; return; }
      }

      const passes = (await Promise.all(
        (reg.participantIds||[]).map(id => window._anandaDb.ref('participants/'+id).once('value').then(s=>s.val()))
      )).filter(Boolean);

      document.getElementById('af-'+uid).style.display = 'none';

      const note = document.createElement('p');
      note.style.cssText = 'font-size:12px;color:#138808;font-weight:700;margin:8px 0 4px;';
      note.textContent = f.found(passes.length);
      resEl.appendChild(note);

      passes.forEach((p, i) => {
        const card = document.createElement('div'); card.className = 'a-pass-card';
        const qDiv = document.createElement('div'); qDiv.className = 'a-pass-qr'; qDiv.id = 'aqr-'+uid+'-'+i;
        card.innerHTML = `<div class="a-pass-name">${p.name||''}</div><div class="a-pass-meta">Reg #${p.regNum} · ${p.tshirtSize||''} T-Shirt</div><span class="${p.status==='checked_in'?'a-pass-status-in':'a-pass-status-reg'}">${p.status==='checked_in'?'✓ CHECKED IN':'REGISTERED'}</span>`;
        card.appendChild(qDiv);
        card.innerHTML += `<div class="a-pass-note">${f.note}</div>`;
        resEl.appendChild(card);
        const qrData = p.qrToken ? `${p.regNum}|${p.qrToken}` : String(p.regNum);
        setTimeout(() => new QRCode(document.getElementById('aqr-'+uid+'-'+i), { text:qrData, width:140, height:140, correctLevel:QRCode.CorrectLevel.M }), 100);
      });
      msgs.scrollTop = msgs.scrollHeight;
    } catch(e) { errEl.textContent=f.errConn; errEl.style.display='block'; }
    if (btnEl) { btnEl.disabled=false; btnEl.textContent=f.btn; }
  };

  /* ── KB answers ── */
  function getKB(key) { return T[_lang].kb[key]; }

  async function handleRetrieve(key, bubble) {
    const item = getKB(key);
    bubble.innerHTML = item.intro;
    await showRetrieveForm(bubble);
  }

  function isRetrieveKey(key) { return key === 'retrieve_qr' || key === 'reg_number'; }

  window.anandaQ = function(key) {
    qrBtns.style.display = 'none';
    const t = T[_lang];
    const item = t.kb[key];
    userMsg(typeof item === 'object' ? item.label : t.qb[key] || key);
    showTyping();
    setTimeout(async () => {
      removeTyping();
      if (isRetrieveKey(key)) {
        const b = botMsg('');
        await handleRetrieve(key, b);
      } else {
        botMsg(typeof item === 'string' ? item : item.label);
      }
    }, 600 + Math.random() * 300);
  };

  function sendFromInput() {
    const text = inp.value.trim(); if (!text) return; inp.value = '';
    userMsg(text); qrBtns.style.display = 'none';
    showTyping();
    setTimeout(async () => {
      removeTyping();
      const tl = text.toLowerCase();
      const t  = T[_lang];

      // Check retrieve triggers
      if (tl.includes('qr') || tl.includes('retrieve') || tl.includes('pass') || tl.includes('qr code') ||
          tl.includes('บัตร') || tl.includes('คิวอาร์') || tl.includes('ดึง')) {
        const b = botMsg(''); await handleRetrieve('retrieve_qr', b); return;
      }
      if ((tl.includes('reg') && (tl.includes('num') || tl.includes('number'))) ||
          tl.includes('เลขลง') || tl.includes('รหัส')) {
        const b = botMsg(''); await handleRetrieve('reg_number', b); return;
      }
      // Check text KB
      for (const item of t.text_kb) {
        if (item.k.some(k => tl.includes(k))) { botMsg(item.a); return; }
      }
      // Check main KB
      for (const [key, val] of Object.entries(t.kb)) {
        if (typeof val === 'string' && tl.includes(key.replace('_',' '))) { botMsg(val); return; }
      }
      botMsg(t.fallback);
    }, 600 + Math.random() * 300);
  }

  /* ── Greeting ── */
  let _greeted = false;
  function greet() {
    _greeted = true;
    setTimeout(() => botMsg(T[_lang].greet), 300);
  }

  /* ── Init ── */
  applyLang();
  setTimeout(() => { if (!win.classList.contains('open')) badge.style.display = 'flex'; }, 2000);

})();
