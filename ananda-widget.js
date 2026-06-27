/* ════════════════════════════════════════
   Ananda · IDY 2027 · Chat Assistant
   v4 — clean UI, working EN/TH, no overflow
════════════════════════════════════════ */
(function () {
  if (document.getElementById('_ananda')) return;

  /* ── script loader ── */
  const _load = (src, id) => new Promise(res => {
    if (document.getElementById(id)) { res(); return; }
    const s = document.createElement('script');
    s.src = src; s.id = id; s.onload = res; s.onerror = res;
    document.head.appendChild(s);
  });

  const FB_CFG = {
    apiKey:      'AIzaSyCJ31EusilYxaGWaorwYjqffVgV5crSecM',
    databaseURL: 'https://idy2027-dba28-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId:   'idy2027-dba28',
    authDomain:  'idy2027-dba28.firebaseapp.com',
  };

  /* ══════════════════════════════════════
     TRANSLATIONS
  ══════════════════════════════════════ */
  let LANG = 'en';
  const T = {
    en: {
      status:    'IDY 2027 · Always here to help',
      ph:        'Ask me anything…',
      switch:    'ภาษาไทย',
      greet:     'Hi! I\'m <b>Ananda</b> 🙏 Your assistant for the 13th International Day of Yoga 2027.<br><br>I can retrieve your <b>QR code</b> right here, or answer questions about T-shirts, mats, hydration, and the event.',
      topics:    [
        { id:'qr',     icon:'🔍', text:'Get my QR code'      },
        { id:'reg',    icon:'🔢', text:'Registration number'  },
        { id:'shirt',  icon:'👕', text:'T-shirt collection'   },
        { id:'mat',    icon:'🧘', text:'Yoga mats'            },
        { id:'water',  icon:'💧', text:'Hydration'            },
        { id:'event',  icon:'📅', text:'Event details'        },
      ],
      answers: {
        qr:    { title: 'Retrieve your QR code', body: 'No confirmation email is sent. Your QR was displayed on screen right after registration.\n\nEnter your details below and I\'ll pull it up for you now.' },
        reg:   { title: 'Find your pass', body: 'Your registration number is printed on your pass. Enter your details and I\'ll retrieve it.' },
        shirt: { title: 'T-shirt collection 👕', body: '✅ One T-shirt per registered participant\n✅ Show your QR code at the counter\n🚫 No bulk collection — each person collects in person\n🚫 Unclaimed shirts won\'t be held\n\n📍 Counter is at the event entrance' },
        mat:   { title: 'Yoga mats 🧘', body: '✅ Mats will be laid out for every participant — nothing to bring.\n\nIf you prefer your own mat, you\'re welcome to bring it.' },
        water: { title: 'Hydration 💧', body: '✅ Bring your own water bottle — Bangkok in June is warm!\n✅ Water refill stations on-site\n\nAim for at least 500 ml – 1 L. Avoid heavy meals 1–2 hours before.' },
        event: { title: 'Event details 📅', body: '🗓 Sunday, 20 June 2027\n📍 Chulalongkorn University, Bangkok\n\nBring your QR code and a water bottle. Mats and T-shirts are provided on-site.' },
        bulk:  { title: 'No bulk collection 🚫', body: 'T-shirts cannot be collected on behalf of others.\n\nEach participant must be present with their own QR code.' },
        lost:  { title: 'QR code missing?', body: 'No email is sent — your QR was only shown on screen at registration.\n\nTap "Get my QR code" above and I\'ll retrieve it right now.' },
        checkin:{ title: 'Check-in on the day ✅', body: '1. Go to the check-in counter at Chulalongkorn University\n2. Show your QR code (phone or printed)\n3. Collect your T-shirt at the same counter with the same QR\n\n💡 Have your QR ready before joining the queue!' },
        travel: { title: 'Getting there 🚌', body: 'BTS — Sala Daeng or National Stadium\nMRT — Sam Yan (short walk to campus)\n\nLimited parking on campus. Public transport strongly recommended.' },
        thanks: { title: '', body: 'You\'re welcome! 🙏\n\nSee you on 20 June 2027 at Chulalongkorn University! 🪷' },
        hello:  { title: '', body: 'Namaste! 🙏 I\'m Ananda. Choose a topic below or ask me anything!' },
      },
      form: {
        email_lbl: 'Email used at registration',
        email_ph:  'your@email.com',
        yob_lbl:   'Year of Birth',
        yob_ph:    'e.g. 1985  or  2528',
        submit:    'Find my pass →',
        loading:   'Searching…',
        err_email: 'Please enter a valid email address.',
        err_yob:   'Year of birth doesn\'t match. Please check and try again.',
        err_none:  'No registration found for this email.',
        err_conn:  'Connection error — please try again.',
        found:     n => `Found ${n} pass${n>1?'es':''} · Screenshot to save! 📸`,
        pass_note: 'Screenshot this pass — needed for entry and T-shirt collection.',
      },
      fallback: 'I\'m not sure about that. Try one of the topics below, or ask about QR codes, T-shirts, mats, or the event.',
    },
    th: {
      status:    'IDY 2027 · พร้อมช่วยเหลือเสมอ',
      ph:        'พิมพ์คำถาม…',
      switch:    'English',
      greet:     'สวัสดีค่ะ! ฉันคือ <b>อานันดา</b> 🙏 ผู้ช่วยงานวันโยคะสากล 2027 ครั้งที่ 13<br><br>ฉันช่วยดึง <b>QR code</b> ของคุณได้ทันที หรือตอบคำถามเรื่องเสื้อ เสื่อ น้ำ และรายละเอียดงาน',
      topics:    [
        { id:'qr',     icon:'🔍', text:'ดู QR code ของฉัน'    },
        { id:'reg',    icon:'🔢', text:'เลขลงทะเบียน'         },
        { id:'shirt',  icon:'👕', text:'รับเสื้อ'              },
        { id:'mat',    icon:'🧘', text:'เสื่อโยคะ'             },
        { id:'water',  icon:'💧', text:'น้ำดื่ม'               },
        { id:'event',  icon:'📅', text:'รายละเอียดงาน'        },
      ],
      answers: {
        qr:    { title: 'ดึง QR code ของคุณ', body: 'ไม่มีการส่งอีเมลยืนยัน QR code จะแสดงบนหน้าจอทันทีหลังลงทะเบียน\n\nกรอกข้อมูลด้านล่างแล้วฉันจะดึง QR code ให้ทันทีเลยค่ะ' },
        reg:   { title: 'ค้นหาบัตรผ่าน', body: 'เลขลงทะเบียนอยู่บนบัตรผ่านของคุณ กรอกข้อมูลแล้วฉันจะดึงให้' },
        shirt: { title: 'การรับเสื้อ 👕', body: '✅ 1 ตัวต่อผู้ลงทะเบียน 1 คน\n✅ แสดง QR code ที่จุดรับเสื้อ\n🚫 ไม่รับแทน — ผู้เข้าร่วมแต่ละคนต้องมารับด้วยตนเอง\n🚫 เสื้อที่ไม่ได้รับภายในเวลาจะไม่ถูกจัดเก็บ\n\n📍 จุดรับเสื้ออยู่ที่ทางเข้างาน' },
        mat:   { title: 'เสื่อโยคะ 🧘', body: '✅ มีเสื่อปูไว้ให้ทุกคน ไม่ต้องนำมาเอง\n\nหากต้องการใช้เสื่อส่วนตัว สามารถนำมาได้เลย' },
        water: { title: 'น้ำดื่ม 💧', body: '✅ นำขวดน้ำส่วนตัวมาด้วย — อากาศกรุงเทพฯ เดือนมิถุนายนร้อนมาก\n✅ มีจุดเติมน้ำในงาน\n\nแนะนำให้มีน้ำอย่างน้อย 500 มล.–1 ล. และหลีกเลี่ยงอาหารหนัก 1–2 ชั่วโมงก่อน' },
        event: { title: 'รายละเอียดงาน 📅', body: '🗓 วันอาทิตย์ที่ 20 มิถุนายน 2570\n📍 จุฬาลงกรณ์มหาวิทยาลัย กรุงเทพฯ\n\nนำ QR code และขวดน้ำมาด้วย มีเสื่อและเสื้อจัดไว้ในงาน' },
        bulk:  { title: 'ไม่รับแทน 🚫', body: 'ไม่สามารถรับเสื้อแทนผู้อื่นได้\n\nผู้เข้าร่วมแต่ละคนต้องมาแสดง QR code ของตนเองด้วยตนเอง' },
        lost:  { title: 'QR code หาย?', body: 'ไม่มีการส่งอีเมล — QR code จะแสดงบนหน้าจอตอนลงทะเบียนเท่านั้น\n\nกด "ดู QR code ของฉัน" แล้วฉันจะดึงให้ทันที' },
        checkin:{ title: 'การเช็คอินในวันงาน ✅', body: '1. ไปที่จุดเช็คอินที่จุฬาลงกรณ์มหาวิทยาลัย\n2. แสดง QR code (โทรศัพท์หรือพิมพ์)\n3. รับเสื้อที่จุดรับเสื้อด้วย QR code เดิม\n\n💡 เตรียม QR ให้พร้อมก่อนต่อคิว!' },
        travel: { title: 'การเดินทาง 🚌', body: 'BTS — สาลาแดง หรือ สนามกีฬาแห่งชาติ\nMRT — สามย่าน (เดินเข้าจุฬาฯ)\n\nที่จอดรถมีจำกัด แนะนำให้ใช้ขนส่งสาธารณะ' },
        thanks: { title: '', body: 'ด้วยความยินดีค่ะ! 🙏\n\nเจอกันวันที่ 20 มิถุนายน 2570 ที่จุฬาลงกรณ์มหาวิทยาลัย! 🪷' },
        hello:  { title: '', body: 'นมัสเต! 🙏 ฉันคืออานันดา เลือกหัวข้อด้านล่างหรือถามได้เลยค่ะ!' },
      },
      form: {
        email_lbl: 'อีเมลที่ใช้ลงทะเบียน',
        email_ph:  'อีเมล@example.com',
        yob_lbl:   'ปีเกิด',
        yob_ph:    'เช่น 1985 หรือ 2528',
        submit:    'ค้นหาบัตรผ่าน →',
        loading:   'กำลังค้นหา…',
        err_email: 'กรุณากรอกอีเมลให้ถูกต้อง',
        err_yob:   'ปีเกิดไม่ตรงกัน กรุณาตรวจสอบและลองใหม่',
        err_none:  'ไม่พบข้อมูลสำหรับอีเมลนี้',
        err_conn:  'เกิดข้อผิดพลาด กรุณาลองใหม่',
        found:     n => `พบ ${n} บัตรผ่าน · ถ่ายภาพหน้าจอเก็บไว้! 📸`,
        pass_note: 'ถ่ายภาพหน้าจอบัตรนี้ — ใช้เข้างานและรับเสื้อ',
      },
      fallback: 'ขออภัยค่ะ ฉันไม่แน่ใจเรื่องนั้น ลองเลือกหัวข้อด้านล่างหรือถามเรื่อง QR code เสื้อ เสื่อ หรืองาน',
    },
  };

  /* ══════════════════════════════════════
     STYLES — self-contained, no leakage
  ══════════════════════════════════════ */
  const CSS = `
  #_ananda * { box-sizing:border-box; margin:0; padding:0;
    font-family:'Noto Sans Thai','Noto Sans',system-ui,sans-serif; }

  /* ── Launcher ── */
  #_ananda_btn {
    position:fixed; bottom:24px; right:24px; z-index:10000;
    width:56px; height:56px; border-radius:16px; border:none;
    background:linear-gradient(145deg,#002D6E,#1a4a9e);
    box-shadow:0 4px 16px rgba(0,45,110,.40);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-size:26px; transition:transform .2s, box-shadow .2s;
    animation:_an_pulse 3s ease-in-out infinite;
  }
  #_ananda_btn:hover { transform:translateY(-3px); box-shadow:0 8px 24px rgba(0,45,110,.5); }
  @keyframes _an_pulse {
    0%,100% { box-shadow:0 4px 16px rgba(0,45,110,.4),0 0 0 0 rgba(255,153,51,.5); }
    60%     { box-shadow:0 4px 16px rgba(0,45,110,.4),0 0 0 10px rgba(255,153,51,0); }
  }
  #_ananda_dot {
    position:absolute; top:-4px; right:-4px;
    width:16px; height:16px; border-radius:50%;
    background:#FF9933; border:2.5px solid #fff;
    font-size:9px; font-weight:800; color:#fff;
    display:none; align-items:center; justify-content:center;
  }

  /* ── Chat window ── */
  #_ananda_win {
    position:fixed; bottom:92px; right:24px; z-index:9999;
    width:360px;
    display:flex; flex-direction:column;
    border-radius:20px; overflow:hidden;
    background:#f5f6fa;
    box-shadow:0 16px 56px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.1);
    opacity:0; pointer-events:none;
    transform:translateY(16px) scale(.95);
    transition:opacity .22s ease, transform .22s ease;
    max-height:580px;
  }
  #_ananda_win.open {
    opacity:1; pointer-events:all; transform:none;
  }

  /* ── Header ── */
  #_an_hdr {
    background:linear-gradient(135deg,#001845 0%,#002D6E 100%);
    padding:14px 16px; flex-shrink:0;
    display:flex; align-items:center; gap:11px;
  }
  ._an_av {
    width:40px; height:40px; border-radius:14px; flex-shrink:0;
    background:linear-gradient(135deg,#FF9933,#e07700);
    display:flex; align-items:center; justify-content:center;
    font-size:20px; position:relative;
  }
  ._an_av::after {
    content:''; position:absolute; bottom:-2px; right:-2px;
    width:10px; height:10px; border-radius:50%;
    background:#22c55e; border:2px solid #002D6E;
  }
  #_an_info { flex:1; min-width:0; }
  #_an_name { color:#fff; font-size:15px; font-weight:700; letter-spacing:-.02em; }
  #_an_status { color:rgba(255,255,255,.55); font-size:11px; margin-top:2px;
    white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  #_an_hdr_right { display:flex; gap:8px; align-items:center; flex-shrink:0; }

  /* Language toggle — prominent, clear state */
  #_an_lang {
    background:rgba(255,255,255,.12);
    border:1.5px solid rgba(255,255,255,.28);
    color:#fff; border-radius:8px;
    padding:5px 11px; font-size:12px; font-weight:700;
    font-family:inherit; cursor:pointer; letter-spacing:.02em;
    transition:all .15s; white-space:nowrap;
  }
  #_an_lang:hover { background:rgba(255,255,255,.24); border-color:rgba(255,255,255,.5); }
  #_an_lang.th-active { background:#FF9933; border-color:#FF9933; color:#fff; }
  #_an_lang.en-active { background:#FF9933; border-color:#FF9933; color:#fff; }

  #_an_close {
    width:30px; height:30px; border-radius:8px; border:none;
    background:rgba(255,255,255,.1); color:rgba(255,255,255,.7);
    font-size:14px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s;
  }
  #_an_close:hover { background:rgba(255,255,255,.22); color:#fff; }

  /* Tricolor */
  #_an_tri { display:flex; height:3px; flex-shrink:0; }
  #_an_tri span:nth-child(1){flex:1;background:#FF9933}
  #_an_tri span:nth-child(2){flex:1;background:#e8e0d0}
  #_an_tri span:nth-child(3){flex:1;background:#138808}

  /* ── Messages ── */
  #_an_msgs {
    flex:1; overflow-y:auto; overflow-x:hidden;
    padding:14px 12px 8px; min-height:0;
    display:flex; flex-direction:column; gap:8px;
    scroll-behavior:smooth;
  }
  #_an_msgs::-webkit-scrollbar { width:4px; }
  #_an_msgs::-webkit-scrollbar-thumb { background:#d1d5e0; border-radius:4px; }

  ._an_row { display:flex; gap:8px; align-items:flex-end;
    width:100%; flex-shrink:0; }
  ._an_row.bot  { align-self:flex-start; }
  ._an_row.user { align-self:flex-end; flex-direction:row-reverse; }

  ._an_av_sm {
    width:28px; height:28px; border-radius:9px; flex-shrink:0;
    background:linear-gradient(135deg,#FF9933,#e07700);
    display:flex; align-items:center; justify-content:center; font-size:13px;
  }

  /* KEY FIX: bubbles must never overflow */
  ._an_bbl {
    max-width:calc(100% - 44px);
    padding:10px 13px;
    font-size:13.5px; line-height:1.58;
    word-wrap:break-word; overflow-wrap:break-word; word-break:break-word;
    white-space:pre-wrap;
  }
  ._an_row.bot  ._an_bbl {
    background:#fff; color:#111827;
    border-radius:4px 16px 16px 16px;
    box-shadow:0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,45,110,.05);
  }
  ._an_row.user ._an_bbl {
    background:linear-gradient(135deg,#002D6E,#1a4a9e);
    color:#fff; border-radius:16px 4px 16px 16px;
    white-space:normal;
  }
  ._an_bbl b { font-weight:700; }
  ._an_row.bot ._an_bbl b { color:#002D6E; }
  ._an_row.user ._an_bbl b { color:#ffd080; }

  /* Greeting card inside bot bubble */
  ._an_greet {
    background:linear-gradient(135deg,#002D6E,#1a3a8c);
    border-radius:12px; padding:14px 15px; color:#fff;
    word-wrap:break-word; overflow-wrap:break-word;
  }
  ._an_greet ._an_gt { font-size:15px; font-weight:700; margin-bottom:6px; }
  ._an_greet ._an_gb { font-size:13px; line-height:1.58; color:rgba(255,255,255,.82); }

  /* Typing indicator */
  ._an_typing { display:flex; gap:5px; padding:12px 14px;
    background:#fff; border-radius:4px 16px 16px 16px;
    box-shadow:0 1px 3px rgba(0,0,0,.07); }
  ._an_typing span {
    width:7px; height:7px; background:#c0c8d8; border-radius:50%;
    animation:_an_dot 1.3s ease-in-out infinite;
  }
  ._an_typing span:nth-child(2){animation-delay:.18s}
  ._an_typing span:nth-child(3){animation-delay:.36s}
  @keyframes _an_dot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

  /* ── Topic chips ── */
  #_an_chips {
    padding:8px 12px 10px; flex-shrink:0;
    background:#f5f6fa; border-top:1px solid #eaecf2;
    display:flex; flex-wrap:wrap; gap:6px;
  }
  ._an_chip {
    background:#fff; border:1.5px solid #dde3f0;
    color:#002D6E; border-radius:9px;
    padding:7px 12px; font-size:12.5px; font-weight:600;
    font-family:inherit; cursor:pointer; display:flex;
    align-items:center; gap:5px;
    box-shadow:0 1px 3px rgba(0,0,0,.05);
    transition:all .15s; white-space:nowrap;
  }
  ._an_chip:hover {
    background:#002D6E; color:#fff; border-color:#002D6E;
    transform:translateY(-1px); box-shadow:0 3px 10px rgba(0,45,110,.22);
  }

  /* ── Retrieve form — rendered as SEPARATE row, not inside bubble ── */
  ._an_form_row {
    display:flex; gap:8px; align-items:flex-start; width:100%; flex-shrink:0;
  }
  ._an_form_spacer { width:28px; flex-shrink:0; }
  ._an_form_card {
    flex:1; background:#fff; border:1.5px solid #e0e5f0;
    border-radius:4px 16px 16px 16px;
    padding:14px; box-shadow:0 1px 3px rgba(0,0,0,.07), 0 2px 8px rgba(0,45,110,.05);
    min-width:0;
  }
  ._an_fl { display:block; font-size:11px; font-weight:700; color:#6b7280;
    text-transform:uppercase; letter-spacing:.05em; margin-bottom:5px; }
  ._an_fi {
    display:block; width:100%; padding:9px 12px;
    border:1.5px solid #dde3f0; border-radius:9px;
    font-size:13.5px; font-family:inherit; color:#111827;
    outline:none; background:#f8f9fc; transition:border-color .18s, background .18s;
    margin-bottom:10px;
  }
  ._an_fi:focus { border-color:#002D6E; background:#fff; }
  ._an_ferr { color:#dc2626; font-size:12px; margin-bottom:8px;
    display:none; word-wrap:break-word; }
  ._an_fbtn {
    width:100%; padding:10px; border:none; border-radius:9px;
    background:linear-gradient(135deg,#002D6E,#1a4a9e);
    color:#fff; font-size:13px; font-weight:700; font-family:inherit;
    cursor:pointer; box-shadow:0 2px 8px rgba(0,45,110,.25);
    transition:opacity .15s, transform .15s;
  }
  ._an_fbtn:hover:not(:disabled) { opacity:.88; transform:translateY(-1px); }
  ._an_fbtn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

  /* ── Pass card ── */
  ._an_pass {
    background:#fff; border:1.5px solid #e0e5f0;
    border-radius:14px; padding:14px; margin-top:8px;
    text-align:center; box-shadow:0 2px 10px rgba(0,0,0,.06);
  }
  ._an_pname { font-size:14px; font-weight:700; color:#002D6E; }
  ._an_pmeta { font-size:12px; color:#6b7280; margin:4px 0 10px; }
  ._an_preg  { display:inline-block; background:#ecfdf5; color:#138808;
    border:1.5px solid #86efac; border-radius:8px;
    font-size:11px; font-weight:700; padding:3px 10px; margin-bottom:10px; }
  ._an_pci   { display:inline-block; background:#fef3c7; color:#b45309;
    border:1.5px solid #fcd34d; border-radius:8px;
    font-size:11px; font-weight:700; padding:3px 10px; margin-bottom:10px; }
  ._an_pnote { font-size:11px; color:#6b7280; margin-top:8px;
    word-wrap:break-word; }
  ._an_pqr   { margin:0 auto 10px; }

  /* ── Input bar ── */
  #_an_bar {
    display:flex; gap:8px; padding:10px 12px 14px;
    background:#fff; flex-shrink:0; border-top:1px solid #eaecf2;
    align-items:center;
  }
  #_an_inp {
    flex:1; padding:10px 14px; border:1.5px solid #dde3f0;
    border-radius:12px; font-size:13.5px; font-family:inherit;
    outline:none; color:#111827; background:#f5f6fa;
    transition:border-color .18s, background .18s; min-width:0;
  }
  #_an_inp:focus { border-color:#002D6E; background:#fff; }
  #_an_inp::placeholder { color:#9ca3af; }
  #_an_snd {
    width:40px; height:40px; flex-shrink:0; border-radius:12px; border:none;
    background:linear-gradient(135deg,#002D6E,#1a4a9e); color:#fff;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; box-shadow:0 2px 8px rgba(0,45,110,.3);
    transition:transform .15s, box-shadow .15s;
  }
  #_an_snd:hover { transform:translateY(-1px); box-shadow:0 4px 14px rgba(0,45,110,.4); }
  #_an_snd svg { display:block; }

  @media(max-width:430px){
    #_ananda_win { width:calc(100vw - 20px); right:10px; bottom:86px; }
    #_ananda_btn { right:14px; bottom:14px; }
  }`;

  const styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ══════════════════════════════════════
     DOM SKELETON
  ══════════════════════════════════════ */
  const root = document.createElement('div');
  root.id = '_ananda';
  root.innerHTML = `
    <button id="_ananda_btn" title="Chat with Ananda">
      🧘<span id="_ananda_dot"></span>
    </button>

    <div id="_ananda_win">
      <div id="_an_hdr">
        <div class="_an_av">🧘</div>
        <div id="_an_info">
          <div id="_an_name">Ananda</div>
          <div id="_an_status"></div>
        </div>
        <div id="_an_hdr_right">
          <button id="_an_lang"></button>
          <button id="_an_close">✕</button>
        </div>
      </div>
      <div id="_an_tri"><span></span><span></span><span></span></div>
      <div id="_an_msgs"></div>
      <div id="_an_chips"></div>
      <div id="_an_bar">
        <input id="_an_inp" type="text" autocomplete="off">
        <button id="_an_snd" title="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>`;
  document.body.appendChild(root);

  /* ── refs ── */
  const win   = document.getElementById('_ananda_win');
  const msgs  = document.getElementById('_an_msgs');
  const chips = document.getElementById('_an_chips');
  const inp   = document.getElementById('_an_inp');
  const dot   = document.getElementById('_ananda_dot');
  const langB = document.getElementById('_an_lang');

  /* ══════════════════════════════════════
     LANGUAGE
  ══════════════════════════════════════ */
  function t() { return T[LANG]; }

  function applyLang() {
    const tx = t();
    document.getElementById('_an_status').textContent = tx.status;
    document.getElementById('_an_inp').placeholder = tx.ph;
    langB.textContent = tx.switch;
    // Visual state on toggle button
    langB.className = LANG === 'th' ? 'th-active' : 'en-active';
    buildChips();
  }

  langB.addEventListener('click', () => {
    LANG = LANG === 'en' ? 'th' : 'en';
    applyLang();
    // Clear and re-greet in new language
    msgs.innerHTML = '';
    chips.style.display = 'flex';
    setTimeout(() => addGreet(), 250);
  });

  /* ══════════════════════════════════════
     CHIP TOPICS
  ══════════════════════════════════════ */
  function buildChips() {
    chips.innerHTML = '';
    t().topics.forEach(({ id, icon, text }) => {
      const b = document.createElement('button');
      b.className = '_an_chip';
      b.innerHTML = `<span>${icon}</span><span>${text}</span>`;
      b.addEventListener('click', () => chipClick(id));
      chips.appendChild(b);
    });
  }

  /* ══════════════════════════════════════
     MESSAGE HELPERS
  ══════════════════════════════════════ */
  function addRow(side) {
    const row = document.createElement('div');
    row.className = `_an_row ${side}`;
    if (side === 'bot') {
      const av = document.createElement('div');
      av.className = '_an_av_sm'; av.textContent = '🧘';
      row.appendChild(av);
    }
    msgs.appendChild(row);
    scroll();
    return row;
  }

  function botMsg(html, usePre) {
    const row = addRow('bot');
    const b = document.createElement('div');
    b.className = '_an_bbl';
    if (usePre) { b.textContent = html; }   // pre-wrap for multi-line text
    else        { b.innerHTML  = html; }
    row.appendChild(b);
    scroll();
    return b;
  }

  function userMsg(text) {
    const row = addRow('user');
    const b = document.createElement('div');
    b.className = '_an_bbl';
    b.textContent = text;
    row.appendChild(b);
    scroll();
  }

  function addTyping() {
    const row = addRow('bot');
    row.id = '_an_typing_row';
    const b = document.createElement('div');
    b.className = '_an_typing';
    b.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(b);
    scroll();
  }
  function rmTyping() {
    const el = document.getElementById('_an_typing_row');
    if (el) el.remove();
  }

  function scroll() {
    requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; });
  }

  /* ══════════════════════════════════════
     GREETING
  ══════════════════════════════════════ */
  function addGreet() {
    const row = addRow('bot');
    const b = document.createElement('div');
    b.className = '_an_bbl';
    b.style.cssText = 'padding:0;background:transparent;box-shadow:none;';
    const card = document.createElement('div');
    card.className = '_an_greet';
    const gt = document.createElement('div'); gt.className = '_an_gt';
    gt.textContent = LANG === 'en' ? 'Hi! I\'m Ananda 🙏' : 'สวัสดีค่ะ! ฉันคืออานันดา 🙏';
    const gb = document.createElement('div'); gb.className = '_an_gb';
    gb.innerHTML = t().greet;
    card.appendChild(gt); card.appendChild(gb);
    b.appendChild(card); row.appendChild(b);
    scroll();
  }

  /* ══════════════════════════════════════
     ANSWER LOGIC
  ══════════════════════════════════════ */
  function respond(id) {
    const ans = t().answers[id];
    if (!ans) { botMsg(t().fallback, true); return; }

    if (id === 'qr' || id === 'reg') {
      // Show intro then form as separate card
      botMsg((ans.title ? `<b>${ans.title}</b>\n\n` : '') + ans.body, true);
      showForm();
    } else {
      const full = (ans.title ? ans.title + '\n\n' : '') + ans.body;
      botMsg(full, true);
    }
  }

  function chipClick(id) {
    chips.style.display = 'none';
    const topic = t().topics.find(x => x.id === id);
    userMsg(topic ? `${topic.icon} ${topic.text}` : id);
    addTyping();
    setTimeout(() => { rmTyping(); respond(id); }, 550 + Math.random() * 300);
  }

  /* ══════════════════════════════════════
     FREE-TEXT INPUT
  ══════════════════════════════════════ */
  function sendText() {
    const text = inp.value.trim(); if (!text) return;
    inp.value = ''; chips.style.display = 'none';
    userMsg(text);
    addTyping();
    setTimeout(() => {
      rmTyping();
      const tl = text.toLowerCase();
      if (/qr|retrieve|pass|บัตร|คิวอาร์|รหัส/.test(tl))      respond('qr');
      else if (/reg.*num|number|เลขลง/.test(tl))               respond('reg');
      else if (/shirt|เสื้อ/.test(tl))                          respond('shirt');
      else if (/mat|เสื่อ/.test(tl))                            respond('mat');
      else if (/water|hydrat|น้ำ/.test(tl))                     respond('water');
      else if (/event|date|venue|chula|งาน|วัน/.test(tl))       respond('event');
      else if (/bulk|behalf|แทน/.test(tl))                      respond('bulk');
      else if (/lost|หาย|missing/.test(tl))                     respond('lost');
      else if (/check.?in|เช็คอิน|entry/.test(tl))              respond('checkin');
      else if (/park|bts|mrt|travel|เดินทาง/.test(tl))          respond('travel');
      else if (/thank|ขอบคุณ/.test(tl))                         respond('thanks');
      else if (/^(hi|hello|hey|namaste|สวัสดี|หวัดดี)/.test(tl)) respond('hello');
      else botMsg(t().fallback, true);
    }, 550 + Math.random() * 300);
  }

  /* ══════════════════════════════════════
     RETRIEVE FORM — rendered as own card row
  ══════════════════════════════════════ */
  async function showForm() {
    await Promise.all([
      _load('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',      '_an_fb_app'),
      _load('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js', '_an_fb_db'),
      _load('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',  '_an_qrlib'),
    ]);
    try {
      if (!window._anFbApp) window._anFbApp = firebase.initializeApp(FB_CFG, 'ananda');
      window._anDb = firebase.app('ananda').database();
    } catch(e) { try { window._anDb = firebase.database(); } catch(_){} }

    const uid = Date.now();
    const tx  = t().form;

    // Form is its OWN row (not inside a bubble) — this prevents overflow
    const formRow = document.createElement('div');
    formRow.className = '_an_form_row';
    formRow.id = `_anf_row_${uid}`;

    const spacer = document.createElement('div'); spacer.className = '_an_form_spacer';
    const card   = document.createElement('div'); card.className = '_an_form_card';

    card.innerHTML = `
      <label class="_an_fl">${tx.email_lbl}</label>
      <input  class="_an_fi" id="_anf_em_${uid}" type="email" placeholder="${tx.email_ph}">
      <label class="_an_fl">${tx.yob_lbl}</label>
      <input  class="_an_fi" id="_anf_yb_${uid}" type="text"  placeholder="${tx.yob_ph}">
      <div class="_an_ferr" id="_anf_er_${uid}"></div>
      <button class="_an_fbtn" id="_anf_bt_${uid}">${tx.submit}</button>`;

    formRow.appendChild(spacer);
    formRow.appendChild(card);
    msgs.appendChild(formRow);
    scroll();

    // Enter key in YOB field submits
    document.getElementById(`_anf_yb_${uid}`)
      .addEventListener('keydown', e => { if(e.key==='Enter') _anSubmit(uid); });
    document.getElementById(`_anf_bt_${uid}`)
      .addEventListener('click', () => _anSubmit(uid));

    setTimeout(() => {
      document.getElementById(`_anf_em_${uid}`)?.focus();
    }, 200);
  }

  async function _anSubmit(uid) {
    const tx     = t().form;
    const email  = (document.getElementById(`_anf_em_${uid}`)?.value||'').trim().toLowerCase();
    const yob    = (document.getElementById(`_anf_yb_${uid}`)?.value||'').trim();
    const errEl  = document.getElementById(`_anf_er_${uid}`);
    const btnEl  = document.getElementById(`_anf_bt_${uid}`);

    errEl.style.display = 'none';
    if (!email || !email.includes('@')) {
      errEl.textContent = tx.err_email; errEl.style.display = 'block'; return;
    }
    btnEl.disabled = true; btnEl.textContent = tx.loading;

    const eKey = e => e.replace(/\./g,',').replace(/@/g,'_at_');
    const normY = v => { const y=parseInt((v||'').trim()); if(!y||y<1900) return null; return y>2400?y-543:y; };

    try {
      const snap = await window._anDb.ref('registrations/'+eKey(email)).once('value');
      if (!snap.exists()) {
        errEl.textContent = tx.err_none; errEl.style.display = 'block';
        btnEl.disabled=false; btnEl.textContent=tx.submit; return;
      }
      const reg = snap.val();
      if (reg.yearOfBirth) {
        const y = normY(yob);
        if (!y || y !== reg.yearOfBirth) {
          errEl.textContent = tx.err_yob; errEl.style.display = 'block';
          btnEl.disabled=false; btnEl.textContent=tx.submit; return;
        }
      }
      const passes = (await Promise.all(
        (reg.participantIds||[]).map(id=>window._anDb.ref('participants/'+id).once('value').then(s=>s.val()))
      )).filter(Boolean);

      // Hide the form row
      const formRow = document.getElementById(`_anf_row_${uid}`);
      if (formRow) formRow.style.display = 'none';

      // Found message
      botMsg(tx.found(passes.length), true);

      // Each pass as its own card row
      passes.forEach((p, i) => {
        const pRow = document.createElement('div');
        pRow.className = '_an_form_row';
        const sp = document.createElement('div'); sp.className = '_an_form_spacer';
        const card = document.createElement('div'); card.className = '_an_pass';
        const qrDiv = document.createElement('div'); qrDiv.className = '_an_pqr'; qrDiv.id = `_anqr_${uid}_${i}`;
        card.innerHTML = `
          <div class="_an_pname">${p.name||''}</div>
          <div class="_an_pmeta">Reg # ${p.regNum} · ${p.tshirtSize||''} T-Shirt</div>
          <span class="${p.status==='checked_in'?'_an_pci':'_an_preg'}">${p.status==='checked_in'?'✓ Checked In':'✓ Registered'}</span>`;
        card.appendChild(qrDiv);
        card.innerHTML += `<div class="_an_pnote">${tx.pass_note}</div>`;
        pRow.appendChild(sp); pRow.appendChild(card);
        msgs.appendChild(pRow); scroll();
        const qrData = p.qrToken ? `${p.regNum}|${p.qrToken}` : String(p.regNum);
        setTimeout(() => {
          new QRCode(document.getElementById(`_anqr_${uid}_${i}`), {
            text: qrData, width: 130, height: 130, correctLevel: QRCode.CorrectLevel.M
          });
          scroll();
        }, 150);
      });

    } catch(e) {
      errEl.textContent = tx.err_conn; errEl.style.display = 'block';
    }
    if (btnEl) { btnEl.disabled=false; btnEl.textContent=tx.submit; }
  }

  /* ══════════════════════════════════════
     OPEN / CLOSE
  ══════════════════════════════════════ */
  let _opened = false;
  document.getElementById('_ananda_btn').addEventListener('click', () => {
    const opening = !win.classList.contains('open');
    win.classList.toggle('open');
    if (opening) {
      dot.style.display = 'none';
      inp.focus();
      if (!_opened) { _opened = true; setTimeout(addGreet, 350); }
    }
  });
  document.getElementById('_an_close').addEventListener('click', () => win.classList.remove('open'));
  document.getElementById('_an_snd').addEventListener('click', sendText);
  inp.addEventListener('keydown', e => { if (e.key==='Enter') sendText(); });

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  applyLang();
  setTimeout(() => {
    if (!win.classList.contains('open')) {
      dot.style.display = 'flex'; dot.textContent = '1';
    }
  }, 2500);

})();
