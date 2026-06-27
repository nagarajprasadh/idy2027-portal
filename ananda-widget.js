/* ─────────────────────────────────────────
   Ananda · IDY 2027 Chat Assistant
   Modern UI · Bilingual EN / TH
───────────────────────────────────────── */
(function () {
  if (document.getElementById('ananda-root')) return;

  function loadScript(src, id) {
    return new Promise(resolve => {
      if (document.getElementById(id)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src; s.id = id; s.onload = resolve; s.onerror = resolve;
      document.head.appendChild(s);
    });
  }

  const FB = {
    apiKey:      'AIzaSyCJ31EusilYxaGWaorwYjqffVgV5crSecM',
    databaseURL: 'https://idy2027-dba28-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId:   'idy2027-dba28',
    authDomain:  'idy2027-dba28.firebaseapp.com',
  };

  /* ─── Language state (independent of page) ─── */
  let L = 'en';

  const TEXT = {
    en: {
      online:      'Online · Ready to help',
      input_ph:    'Type a message…',
      lang_toggle: 'TH',
      greet_title: 'Hi there! I\'m Ananda 🙏',
      greet_body:  'Your guide for the 13th International Day of Yoga 2027. I can help you find your QR code, learn about T-shirts, mats, and more.',
      qr_label:    '🔍  Retrieve my QR code',
      reg_label:   '🔢  Registration number',
      shirt_label: '👕  T-shirt collection',
      mat_label:   '🧘  Yoga mats',
      water_label: '💧  Hydration',
      event_label: '📅  Event details',

      qr_intro: '<strong>Let\'s find your QR code</strong><br>No email is sent — your QR was shown on-screen when you registered. Fill in your details and I\'ll pull it up right now.',
      reg_intro: '<strong>Let\'s find your pass</strong><br>Your registration number is on your pass. Enter your details below.',

      f_email:   'Email used at registration',
      f_email_ph:'your@email.com',
      f_yob:     'Year of Birth',
      f_yob_ph:  'e.g. 1985  or  2528 (BE)',
      f_submit:  'Find my pass',
      f_loading: 'Searching…',
      f_err_email:   'Please enter a valid email address.',
      f_err_yob:     'Year of birth doesn\'t match. Please check and try again.',
      f_err_none:    'No registration found for this email.',
      f_err_conn:    'Connection error — please try again.',
      f_found:       n => `Found ${n} pass${n>1?'es':''}  ·  screenshot to save!`,
      f_pass_note:   '📸  Screenshot your pass — needed for entry and T-shirt collection.',

      shirt: '<strong>👕  T-shirt collection</strong><br><br>✅  One T-shirt per registered participant.<br>✅  Show your QR code at the counter — no QR, no shirt.<br>🚫  No bulk collection. Each person collects in person.<br>🚫  Unclaimed shirts won\'t be held after closing time.<br><br>📍  Collection counter is at the event entrance.',
      mat:   '<strong>🧘  Yoga mats</strong><br><br>✅  Mats will be laid out for every participant — nothing to bring.<br><br>If you prefer your own mat for comfort or hygiene, you\'re welcome to bring it.',
      water: '<strong>💧  Hydration</strong><br><br>✅  Bring your own water bottle — Bangkok in June is warm!<br>✅  Water refill stations are available on-site.<br><br>We recommend at least 500 ml – 1 L. Avoid heavy meals 1–2 hours before the session.',
      event: '<strong>📅  Event details</strong><br><br>🗓  Sunday, <strong>20 June 2027</strong><br>📍  <strong>Chulalongkorn University</strong>, Bangkok<br><br>Bring your QR code and a water bottle. Mats and T-shirts are handled on-site.',
      bulk:  '<strong>🚫  No bulk collection</strong><br><br>T-shirts cannot be collected on behalf of others. Each participant must show up in person with their own QR code.',
      lost:  '<strong>QR code missing?</strong><br><br>No email confirmation is sent — your QR was only shown on-screen at registration.<br><br>Tap <em>Retrieve my QR code</em> above and I\'ll get it for you right now.',
      checkin:'<strong>✅  Check-in on the day</strong><br><br>1. Head to the <strong>check-in counter</strong> at Chulalongkorn University.<br>2. Show your <strong>QR code</strong> (phone or printed).<br>3. Then visit the T-shirt counter with the same QR code.<br><br>💡  Have your QR ready before joining the queue!',
      travel: '<strong>🚌  Getting there</strong><br><br><strong>BTS</strong> — Sala Daeng or National Stadium<br><strong>MRT</strong> — Sam Yan (short walk to campus)<br><br>Limited campus parking. Public transport is strongly recommended.',
      thanks: 'You\'re welcome! 🙏  See you on 20 June 2027 at Chulalongkorn University! 🪷',
      hello:  'Namaste! 🙏  I\'m Ananda. Ask me anything or choose a topic below!',
      fallback:'I\'m not sure about that — try one of the topics below, or ask about your QR code, T-shirts, mats, or the event.',
    },
    th: {
      online:      'ออนไลน์ · พร้อมช่วยเหลือ',
      input_ph:    'พิมพ์ข้อความ…',
      lang_toggle: 'EN',
      greet_title: 'สวัสดีค่ะ! ฉันคืออานันดา 🙏',
      greet_body:  'ผู้ช่วยงานวันโยคะสากล 2027 ครั้งที่ 13 ฉันช่วยหา QR code ของคุณ ให้ข้อมูลเรื่องเสื้อ เสื่อ น้ำ และรายละเอียดงานได้เลยค่ะ',
      qr_label:    '🔍  ดึง QR code ของฉัน',
      reg_label:   '🔢  เลขลงทะเบียน',
      shirt_label: '👕  รับเสื้อ',
      mat_label:   '🧘  เสื่อโยคะ',
      water_label: '💧  น้ำดื่ม',
      event_label: '📅  รายละเอียดงาน',

      qr_intro: '<strong>มาหา QR code ของคุณกันเลย</strong><br>ไม่มีการส่งอีเมล — QR code จะแสดงบนหน้าจอตอนลงทะเบียนเท่านั้น กรอกข้อมูลด้านล่างแล้วฉันจะดึงให้ทันทีเลยค่ะ',
      reg_intro: '<strong>มาหาบัตรผ่านของคุณกัน</strong><br>เลขลงทะเบียนอยู่บนบัตรผ่าน กรอกข้อมูลด้านล่างได้เลยค่ะ',

      f_email:   'อีเมลที่ใช้ลงทะเบียน',
      f_email_ph:'อีเมลของท่าน@example.com',
      f_yob:     'ปีเกิด',
      f_yob_ph:  'เช่น 1985 หรือ 2528',
      f_submit:  'ค้นหาบัตรผ่าน',
      f_loading: 'กำลังค้นหา…',
      f_err_email:   'กรุณากรอกที่อยู่อีเมลให้ถูกต้อง',
      f_err_yob:     'ปีเกิดไม่ตรงกัน กรุณาตรวจสอบและลองใหม่',
      f_err_none:    'ไม่พบข้อมูลการลงทะเบียนสำหรับอีเมลนี้',
      f_err_conn:    'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่',
      f_found:       n => `พบ ${n} บัตรผ่าน · ถ่ายภาพหน้าจอเก็บไว้!`,
      f_pass_note:   '📸  ถ่ายภาพหน้าจอบัตรนี้ — ใช้สำหรับเข้างานและรับเสื้อ',

      shirt: '<strong>👕  การรับเสื้อ</strong><br><br>✅  1 ตัวต่อผู้ลงทะเบียน 1 คน<br>✅  แสดง QR code ที่จุดรับเสื้อ — ไม่มี QR ไม่ได้รับเสื้อ<br>🚫  ไม่รับแทน ผู้เข้าร่วมแต่ละคนต้องมารับด้วยตนเอง<br>🚫  เสื้อที่ไม่ได้รับภายในเวลาจะไม่ถูกจัดเก็บ<br><br>📍  จุดรับเสื้ออยู่บริเวณทางเข้างาน',
      mat:   '<strong>🧘  เสื่อโยคะ</strong><br><br>✅  มีเสื่อปูไว้ให้ทุกคน ไม่ต้องนำมาเอง<br><br>หากต้องการใช้เสื่อส่วนตัวเพื่อความสะดวกหรือสุขอนามัย สามารถนำมาได้',
      water: '<strong>💧  น้ำดื่ม</strong><br><br>✅  นำขวดน้ำส่วนตัวมาด้วย — อากาศกรุงเทพฯ เดือนมิถุนายนร้อนมาก!<br>✅  มีจุดเติมน้ำในงาน<br><br>แนะนำให้มีน้ำอย่างน้อย 500 มล.–1 ล. และหลีกเลี่ยงอาหารหนัก 1–2 ชั่วโมงก่อนเริ่ม',
      event: '<strong>📅  รายละเอียดงาน</strong><br><br>🗓  วันอาทิตย์ที่ <strong>20 มิถุนายน 2570</strong><br>📍  <strong>จุฬาลงกรณ์มหาวิทยาลัย</strong> กรุงเทพฯ<br><br>นำ QR code และขวดน้ำมาด้วย มีเสื่อและเสื้อจัดไว้ในงาน',
      bulk:  '<strong>🚫  ไม่รับแทน</strong><br><br>ไม่สามารถรับเสื้อแทนผู้อื่นได้ ผู้เข้าร่วมแต่ละคนต้องมาแสดง QR code ของตนเองด้วยตนเอง',
      lost:  '<strong>QR code หาย?</strong><br><br>ไม่มีการส่งอีเมล — QR code จะแสดงบนหน้าจอตอนลงทะเบียนเท่านั้น<br><br>กด <em>ดึง QR code ของฉัน</em> ด้านบน แล้วฉันจะดึงให้ทันทีเลย',
      checkin:'<strong>✅  การเช็คอินในวันงาน</strong><br><br>1. ไปที่ <strong>จุดเช็คอิน</strong> ที่จุฬาลงกรณ์มหาวิทยาลัย<br>2. แสดง <strong>QR code</strong> (โทรศัพท์หรือพิมพ์ออกมา)<br>3. จากนั้นไปรับเสื้อที่จุดรับเสื้อด้วย QR code เดิม<br><br>💡  เตรียม QR ให้พร้อมก่อนต่อคิว!',
      travel: '<strong>🚌  การเดินทาง</strong><br><br><strong>BTS</strong> — สาลาแดง หรือ สนามกีฬาแห่งชาติ<br><strong>MRT</strong> — สามย่าน (เดินเข้าจุฬาฯ)<br><br>ที่จอดรถในมหาวิทยาลัยมีจำกัด แนะนำให้ใช้ขนส่งสาธารณะ',
      thanks: 'ด้วยความยินดีค่ะ! 🙏  เจอกันวันที่ 20 มิถุนายน 2570 ที่จุฬาลงกรณ์มหาวิทยาลัย! 🪷',
      hello:  'นมัสเต! 🙏  ฉันคืออานันดา ถามได้เลยหรือเลือกหัวข้อด้านล่างค่ะ!',
      fallback:'ขออภัย ฉันไม่แน่ใจเรื่องนั้น ลองเลือกหัวข้อด้านล่าง หรือถามเรื่อง QR code เสื้อ เสื่อ หรือรายละเอียดงานได้เลยค่ะ',
    }
  };

  /* ─── Inject styles ─── */
  const css = document.createElement('style');
  css.textContent = `
    #ananda-root { font-family: 'Noto Sans Thai','Noto Sans',system-ui,sans-serif; }
    #ananda-root * { box-sizing:border-box; margin:0; padding:0; }

    /* Launcher */
    #an-launch {
      position:fixed; bottom:28px; right:28px; z-index:9999;
      width:58px; height:58px; border-radius:16px; border:none; cursor:pointer;
      background:linear-gradient(145deg,#1a4a9e,#002D6E);
      box-shadow:0 4px 20px rgba(0,45,110,.40), 0 1px 3px rgba(0,0,0,.15);
      display:flex; align-items:center; justify-content:center;
      font-size:26px; transition:transform .18s, box-shadow .18s;
    }
    #an-launch:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,45,110,.45); }
    #an-launch:active { transform:translateY(0); }
    #an-badge {
      position:absolute; top:-6px; right:-6px;
      width:20px; height:20px; background:#FF9933; color:#fff;
      font-size:11px; font-weight:700; border-radius:50%; border:2px solid #fff;
      display:none; align-items:center; justify-content:center;
    }

    /* Window */
    #an-win {
      position:fixed; bottom:100px; right:28px; z-index:9998;
      width:370px; max-height:580px; border-radius:20px;
      background:#ffffff;
      box-shadow:0 12px 48px rgba(0,45,110,.18), 0 2px 8px rgba(0,0,0,.08);
      display:flex; flex-direction:column; overflow:hidden;
      opacity:0; pointer-events:none;
      transform:translateY(12px) scale(.96);
      transition:opacity .2s ease, transform .2s ease;
    }
    #an-win.open { opacity:1; pointer-events:all; transform:none; }

    /* Header */
    #an-hdr {
      background:linear-gradient(135deg,#002D6E 0%,#1a3a8c 100%);
      padding:16px 16px 14px; flex-shrink:0;
      display:flex; align-items:center; gap:12px;
    }
    .an-av-wrap { position:relative; flex-shrink:0; }
    .an-av {
      width:42px; height:42px; border-radius:14px;
      background:linear-gradient(135deg,#FF9933,#e07700);
      display:flex; align-items:center; justify-content:center;
      font-size:20px;
    }
    .an-online-dot {
      position:absolute; bottom:-2px; right:-2px;
      width:11px; height:11px; background:#22c55e;
      border-radius:50%; border:2px solid #002D6E;
    }
    #an-hdr-info { flex:1; min-width:0; }
    .an-name { color:#fff; font-size:15px; font-weight:700; letter-spacing:-.01em; }
    .an-status { color:rgba(255,255,255,.6); font-size:11px; margin-top:2px; }

    /* Language + close */
    .an-hdr-actions { display:flex; align-items:center; gap:7px; flex-shrink:0; }
    #an-lang {
      background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.22);
      color:#fff; border-radius:8px; padding:5px 10px;
      font-size:12px; font-weight:600; font-family:inherit; cursor:pointer;
      letter-spacing:.03em; transition:background .15s;
    }
    #an-lang:hover { background:rgba(255,255,255,.22); }
    #an-close {
      background:rgba(255,255,255,.1); border:none; color:rgba(255,255,255,.8);
      width:30px; height:30px; border-radius:8px;
      font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:background .15s;
    }
    #an-close:hover { background:rgba(255,255,255,.2); color:#fff; }

    /* Tricolor */
    #an-tri { display:flex; height:3px; flex-shrink:0; }
    #an-tri span:nth-child(1){flex:1;background:#FF9933}
    #an-tri span:nth-child(2){flex:1;background:#e8e0d0}
    #an-tri span:nth-child(3){flex:1;background:#138808}

    /* Messages */
    #an-msgs {
      flex:1; overflow-y:auto; padding:16px 14px 8px;
      display:flex; flex-direction:column; gap:10px; min-height:0;
      background:#f8f9fc;
    }
    #an-msgs::-webkit-scrollbar { width:4px; }
    #an-msgs::-webkit-scrollbar-thumb { background:#dde2ee; border-radius:4px; }

    .an-msg { display:flex; gap:8px; align-items:flex-end; max-width:86%; }
    .an-msg.bot  { align-self:flex-start; }
    .an-msg.user { align-self:flex-end; flex-direction:row-reverse; }

    .an-msg-av {
      width:28px; height:28px; border-radius:9px; flex-shrink:0;
      background:linear-gradient(135deg,#FF9933,#e07700);
      display:flex; align-items:center; justify-content:center; font-size:13px;
    }
    .an-bbl {
      padding:10px 13px; border-radius:16px;
      font-size:13.5px; line-height:1.58;
    }
    .an-msg.bot  .an-bbl {
      background:#fff; color:#1a1a2e;
      border-radius:4px 16px 16px 16px;
      box-shadow:0 1px 4px rgba(0,0,0,.07);
    }
    .an-msg.user .an-bbl {
      background:linear-gradient(135deg,#002D6E,#1a4a9e);
      color:#fff;
      border-radius:16px 4px 16px 16px;
    }
    .an-bbl strong { color:#002D6E; }
    .an-msg.user .an-bbl strong { color:#FF9933; }
    .an-bbl br+br { display:block; margin-top:4px; content:''; }

    /* Typing */
    .an-typing { display:flex; gap:4px; padding:10px 14px; }
    .an-typing span {
      width:7px; height:7px; background:#b0bbd0; border-radius:50%;
      animation:an-bounce 1.3s infinite ease-in-out;
    }
    .an-typing span:nth-child(2){animation-delay:.18s}
    .an-typing span:nth-child(3){animation-delay:.36s}
    @keyframes an-bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

    /* Quick-reply chips */
    #an-chips {
      padding:8px 14px 10px; display:flex; flex-wrap:wrap; gap:6px;
      background:#f8f9fc; flex-shrink:0;
      border-top:1px solid #eef0f5;
    }
    .an-chip {
      background:#fff; border:1.5px solid #e0e5f0;
      color:#002D6E; border-radius:8px;
      padding:7px 12px; font-size:12.5px; font-weight:500;
      font-family:inherit; cursor:pointer;
      transition:all .15s; box-shadow:0 1px 3px rgba(0,0,0,.05);
      text-align:left; line-height:1.3;
    }
    .an-chip:hover {
      background:#002D6E; color:#fff; border-color:#002D6E;
      box-shadow:0 3px 10px rgba(0,45,110,.25);
      transform:translateY(-1px);
    }

    /* Input */
    #an-input-row {
      display:flex; align-items:center; gap:8px;
      padding:10px 14px 14px; background:#fff; flex-shrink:0;
      border-top:1px solid #eef0f5;
    }
    #an-inp {
      flex:1; padding:10px 14px; border:1.5px solid #e0e5f0;
      border-radius:12px; font-size:13.5px; font-family:inherit;
      outline:none; color:#1a1a2e; background:#f8f9fc;
      transition:border-color .18s, background .18s;
    }
    #an-inp:focus { border-color:#002D6E; background:#fff; }
    #an-inp::placeholder { color:#a0aec0; }
    #an-send {
      width:40px; height:40px; border-radius:12px; border:none;
      background:linear-gradient(135deg,#1a4a9e,#002D6E);
      color:#fff; font-size:16px; cursor:pointer; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 2px 8px rgba(0,45,110,.3);
      transition:transform .15s, box-shadow .15s;
    }
    #an-send:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,45,110,.38); }
    #an-send:active { transform:none; }

    /* Retrieve form */
    .an-form {
      margin-top:10px; background:#f4f6fb;
      border:1.5px solid #e0e5f0; border-radius:12px; padding:14px;
    }
    .an-form-row { margin-bottom:10px; }
    .an-form label {
      display:block; font-size:11.5px; font-weight:600;
      color:#6b7280; text-transform:uppercase; letter-spacing:.04em; margin-bottom:5px;
    }
    .an-form input {
      width:100%; padding:9px 12px; border:1.5px solid #dde2ee;
      border-radius:9px; font-size:13px; font-family:inherit;
      outline:none; background:#fff; color:#1a1a2e;
      transition:border-color .18s;
    }
    .an-form input:focus { border-color:#002D6E; }
    .an-form-btn {
      width:100%; padding:10px; border:none; border-radius:9px;
      background:linear-gradient(135deg,#1a4a9e,#002D6E);
      color:#fff; font-size:13px; font-weight:600;
      font-family:inherit; cursor:pointer;
      box-shadow:0 2px 8px rgba(0,45,110,.25);
      transition:opacity .15s;
    }
    .an-form-btn:disabled { opacity:.55; cursor:not-allowed; }
    .an-form-err { color:#dc2626; font-size:12px; margin-bottom:8px; }

    /* Pass card */
    .an-pass {
      margin-top:10px; background:#fff;
      border:1.5px solid #e0e5f0; border-radius:14px;
      padding:14px; text-align:center;
      box-shadow:0 2px 10px rgba(0,0,0,.06);
    }
    .an-pass-name { font-size:15px; font-weight:700; color:#002D6E; }
    .an-pass-meta { font-size:12px; color:#6b7280; margin:4px 0 10px; }
    .an-pass-reg  { display:inline-flex; align-items:center; gap:5px; background:#ecfdf5; color:#138808; border:1.5px solid #86efac; border-radius:8px; font-size:11px; font-weight:700; padding:3px 10px; margin-bottom:12px; }
    .an-pass-ci   { display:inline-flex; align-items:center; gap:5px; background:#fef3c7; color:#b45309; border:1.5px solid #fcd34d; border-radius:8px; font-size:11px; font-weight:700; padding:3px 10px; margin-bottom:12px; }
    .an-pass-note { font-size:11px; color:#6b7280; margin-top:8px; }

    /* Greeting card */
    .an-greet-card {
      background:linear-gradient(135deg,#002D6E,#1a3a8c);
      border-radius:14px; padding:16px; color:#fff;
    }
    .an-greet-card h3 { font-size:15px; font-weight:700; margin-bottom:6px; }
    .an-greet-card p  { font-size:13px; line-height:1.55; color:rgba(255,255,255,.82); }

    @media(max-width:430px){
      #an-win { width:calc(100vw - 24px); right:12px; bottom:90px; }
      #an-launch { right:16px; bottom:16px; }
    }
  `;
  document.head.appendChild(css);

  /* ─── HTML skeleton ─── */
  const root = document.createElement('div');
  root.id = 'ananda-root';
  root.innerHTML = `
    <button id="an-launch">🧘<span id="an-badge"></span></button>
    <div id="an-win">
      <div id="an-hdr">
        <div class="an-av-wrap">
          <div class="an-av">🧘</div>
          <div class="an-online-dot"></div>
        </div>
        <div id="an-hdr-info">
          <div class="an-name">Ananda</div>
          <div class="an-status" id="an-status-txt"></div>
        </div>
        <div class="an-hdr-actions">
          <button id="an-lang"></button>
          <button id="an-close">✕</button>
        </div>
      </div>
      <div id="an-tri"><span></span><span></span><span></span></div>
      <div id="an-msgs"></div>
      <div id="an-chips"></div>
      <div id="an-input-row">
        <input id="an-inp" type="text" autocomplete="off">
        <button id="an-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>`;
  document.body.appendChild(root);

  /* ─── DOM refs ─── */
  const win    = document.getElementById('an-win');
  const msgs   = document.getElementById('an-msgs');
  const inp    = document.getElementById('an-inp');
  const badge  = document.getElementById('an-badge');
  const chips  = document.getElementById('an-chips');
  const langB  = document.getElementById('an-lang');
  const statEl = document.getElementById('an-status-txt');

  /* ─── Apply language ─── */
  function applyLang() {
    const t = TEXT[L];
    statEl.textContent = t.online;
    langB.textContent  = t.lang_toggle;
    inp.placeholder    = t.input_ph;
    chips.innerHTML    = '';
    [['qr',t.qr_label],['reg',t.reg_label],['shirt',t.shirt_label],
     ['mat',t.mat_label],['water',t.water_label],['event',t.event_label]
    ].forEach(([k,lbl]) => {
      const b = document.createElement('button');
      b.className = 'an-chip'; b.textContent = lbl;
      b.onclick = () => chipClick(k);
      chips.appendChild(b);
    });
  }

  langB.addEventListener('click', () => { L = L==='en'?'th':'en'; applyLang(); });
  document.getElementById('an-close').addEventListener('click', () => win.classList.remove('open'));
  document.getElementById('an-launch').addEventListener('click', () => {
    const opening = !win.classList.contains('open');
    win.classList.toggle('open');
    if (opening) { badge.style.display='none'; inp.focus(); if(!_greeted) greet(); }
  });
  document.getElementById('an-send').addEventListener('click', send);
  inp.addEventListener('keydown', e => { if (e.key==='Enter') send(); });

  /* ─── Messages ─── */
  function botBubble(html) {
    const row = document.createElement('div'); row.className='an-msg bot';
    const av  = document.createElement('div'); av.className='an-msg-av'; av.textContent='🧘';
    const b   = document.createElement('div'); b.className='an-bbl'; b.innerHTML=html;
    row.appendChild(av); row.appendChild(b);
    msgs.appendChild(row); msgs.scrollTop=msgs.scrollHeight; return b;
  }
  function userBubble(text) {
    const row = document.createElement('div'); row.className='an-msg user';
    const b   = document.createElement('div'); b.className='an-bbl'; b.textContent=text;
    row.appendChild(b); msgs.appendChild(row); msgs.scrollTop=msgs.scrollHeight;
  }
  function typing() {
    const row = document.createElement('div'); row.className='an-msg bot'; row.id='an-typing';
    const av  = document.createElement('div'); av.className='an-msg-av'; av.textContent='🧘';
    const b   = document.createElement('div'); b.className='an-bbl an-typing'; b.innerHTML='<span></span><span></span><span></span>';
    row.appendChild(av); row.appendChild(b); msgs.appendChild(row); msgs.scrollTop=msgs.scrollHeight;
  }
  function rmTyping() { const e=document.getElementById('an-typing'); if(e) e.remove(); }

  /* ─── QR retrieval form ─── */
  async function showForm(bubble) {
    await Promise.all([
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',      'an-fb-app'),
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js', 'an-fb-db'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',  'an-qrlib'),
    ]);
    try {
      if (!window._anFbApp) window._anFbApp = firebase.initializeApp(FB, 'ananda');
      window._anDb = firebase.app('ananda').database();
    } catch(e) { window._anDb = firebase.database(); }

    const t=TEXT[L]; const uid=Date.now();
    const form = document.createElement('div'); form.className='an-form'; form.id='anf-'+uid;
    form.innerHTML = `
      <div class="an-form-row">
        <label>${t.f_email}</label>
        <input id="ane-${uid}" type="email" placeholder="${t.f_email_ph}">
      </div>
      <div class="an-form-row">
        <label>${t.f_yob}</label>
        <input id="any-${uid}" type="text" placeholder="${t.f_yob_ph}">
      </div>
      <div class="an-form-err" id="aner-${uid}" style="display:none"></div>
      <button class="an-form-btn" id="anb-${uid}" onclick="_anSubmit(${uid})">${t.f_submit}</button>`;
    const resDiv = document.createElement('div'); resDiv.id='anr-'+uid;
    bubble.appendChild(form); bubble.appendChild(resDiv);
    msgs.scrollTop=msgs.scrollHeight;
    // Focus email
    setTimeout(()=>{ const el=document.getElementById('ane-'+uid); if(el) el.focus(); },200);
  }

  window._anSubmit = async function(uid) {
    const t=TEXT[L];
    const email=(document.getElementById('ane-'+uid).value||'').trim().toLowerCase();
    const yob  =(document.getElementById('any-'+uid).value||'').trim();
    const errEl=document.getElementById('aner-'+uid);
    const btnEl=document.getElementById('anb-'+uid);
    const resEl=document.getElementById('anr-'+uid);
    errEl.style.display='none';
    if (!email||!email.includes('@')) { errEl.textContent=t.f_err_email; errEl.style.display='block'; return; }
    btnEl.disabled=true; btnEl.textContent=t.f_loading;
    const eKey = e=>e.replace(/\./g,',').replace(/@/g,'_at_');
    const normY= v=>{ const y=parseInt((v||'').trim()); if(!y||y<1900) return null; return y>2400?y-543:y; };
    try {
      const snap=await window._anDb.ref('registrations/'+eKey(email)).once('value');
      if (!snap.exists()) { errEl.textContent=t.f_err_none; errEl.style.display='block'; btnEl.disabled=false; btnEl.textContent=t.f_submit; return; }
      const reg=snap.val();
      if (reg.yearOfBirth) {
        const y=normY(yob);
        if (!y||y!==reg.yearOfBirth) { errEl.textContent=t.f_err_yob; errEl.style.display='block'; btnEl.disabled=false; btnEl.textContent=t.f_submit; return; }
      }
      const passes=(await Promise.all((reg.participantIds||[]).map(id=>window._anDb.ref('participants/'+id).once('value').then(s=>s.val())))).filter(Boolean);
      document.getElementById('anf-'+uid).style.display='none';
      const note=document.createElement('p');
      note.style.cssText='font-size:12px;color:#138808;font-weight:700;margin:10px 0 6px;';
      note.textContent=t.f_found(passes.length); resEl.appendChild(note);
      passes.forEach((p,i)=>{
        const card=document.createElement('div'); card.className='an-pass';
        const qDiv=document.createElement('div'); qDiv.style.cssText='margin:0 auto 8px;width:140px;'; qDiv.id='anqr-'+uid+'-'+i;
        card.innerHTML=`<div class="an-pass-name">${p.name||''}</div><div class="an-pass-meta">Reg # ${p.regNum}  ·  ${p.tshirtSize||''} T-Shirt</div><span class="${p.status==='checked_in'?'an-pass-ci':'an-pass-reg'}">${p.status==='checked_in'?'✓ Checked in':'✓ Registered'}</span>`;
        card.appendChild(qDiv);
        card.innerHTML+=`<div class="an-pass-note">${t.f_pass_note}</div>`;
        resEl.appendChild(card);
        const qrData=p.qrToken?`${p.regNum}|${p.qrToken}`:String(p.regNum);
        setTimeout(()=>new QRCode(document.getElementById('anqr-'+uid+'-'+i),{text:qrData,width:140,height:140,correctLevel:QRCode.CorrectLevel.M}),120);
      });
      msgs.scrollTop=msgs.scrollHeight;
    } catch(e) { errEl.textContent=t.f_err_conn; errEl.style.display='block'; }
    if (btnEl) { btnEl.disabled=false; btnEl.textContent=t.f_submit; }
  };

  /* ─── Chip click ─── */
  function chipClick(key) {
    chips.style.display='none';
    const t=TEXT[L];
    const labels={qr:t.qr_label,reg:t.reg_label,shirt:t.shirt_label,mat:t.mat_label,water:t.water_label,event:t.event_label};
    userBubble(labels[key]);
    typing();
    setTimeout(async ()=>{
      rmTyping();
      if (key==='qr'||key==='reg') {
        const b=botBubble(key==='qr'?t.qr_intro:t.reg_intro);
        await showForm(b);
      } else {
        botBubble({shirt:t.shirt,mat:t.mat,water:t.water,event:t.event}[key]);
      }
    }, 550+Math.random()*300);
  }

  /* ─── Text input ─── */
  function send() {
    const text=inp.value.trim(); if (!text) return; inp.value='';
    userBubble(text); chips.style.display='none';
    typing();
    setTimeout(async ()=>{
      rmTyping();
      const tl=text.toLowerCase(); const t=TEXT[L];
      if (/qr|retrieve|pass|บัตร|คิวอาร์|ดึง/.test(tl)) {
        const b=botBubble(t.qr_intro); await showForm(b);
      } else if (/reg.*num|number|เลขลง|รหัส/.test(tl)) {
        const b=botBubble(t.reg_intro); await showForm(b);
      } else if (/shirt|เสื้อ/.test(tl))      { botBubble(t.shirt);
      } else if (/mat|เสื่อ/.test(tl))         { botBubble(t.mat);
      } else if (/water|hydrat|น้ำ/.test(tl))  { botBubble(t.water);
      } else if (/event|date|venue|chula|งาน|วันที่|สถาน/.test(tl)) { botBubble(t.event);
      } else if (/bulk|behalf|แทน/.test(tl))   { botBubble(t.bulk);
      } else if (/lost|หาย/.test(tl))          { botBubble(t.lost);
      } else if (/check.?in|เช็คอิน/.test(tl)) { botBubble(t.checkin);
      } else if (/park|bts|mrt|travel|เดินทาง/.test(tl)) { botBubble(t.travel);
      } else if (/thank|ขอบคุณ/.test(tl))      { botBubble(t.thanks);
      } else if (/hi|hello|hey|namaste|สวัสดี|หวัดดี/.test(tl)) { botBubble(t.hello);
      } else { botBubble(t.fallback); }
    }, 550+Math.random()*300);
  }

  /* ─── Greeting ─── */
  let _greeted=false;
  function greet() {
    _greeted=true;
    setTimeout(()=>{
      const t=TEXT[L];
      botBubble(`<div class="an-greet-card"><h3>${t.greet_title}</h3><p>${t.greet_body}</p></div>`);
    },350);
  }

  /* ─── Init ─── */
  applyLang();
  setTimeout(()=>{ if (!win.classList.contains('open')) { badge.style.display='flex'; badge.textContent='1'; }},2000);
})();
