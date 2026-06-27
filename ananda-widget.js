/* ─────────────────────────────────────────────
   Ananda — IDY 2027 Floating Chatbot Widget
   Include once before </body> on any page.
───────────────────────────────────────────── */
(function () {
  if (document.getElementById('ananda-root')) return;

  /* ── External deps (load if not already on page) ── */
  function loadScript(src, id) {
    return new Promise(resolve => {
      if (document.getElementById(id) || window[id === 'ananda-qrlib' ? 'QRCode' : '_']) { resolve(); return; }
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
    storageBucket:'idy2027-dba28.appspot.com',
  };

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #ananda-root * { box-sizing:border-box; margin:0; padding:0; font-family:'Noto Sans',system-ui,sans-serif; }

    #ananda-launcher {
      position:fixed; bottom:24px; right:24px;
      width:62px; height:62px;
      background:linear-gradient(135deg,#002D6E,#1a4a9e);
      border-radius:50%;
      box-shadow:0 4px 18px rgba(0,45,110,.38);
      cursor:pointer; border:none;
      display:flex; align-items:center; justify-content:center;
      font-size:27px; z-index:9999;
      transition:transform .2s,box-shadow .2s;
      animation:a-pulse 2.8s infinite;
    }
    #ananda-launcher:hover { transform:scale(1.1); }
    @keyframes a-pulse {
      0%,100% { box-shadow:0 4px 18px rgba(0,45,110,.38),0 0 0 0 rgba(255,153,51,.45); }
      55%      { box-shadow:0 4px 18px rgba(0,45,110,.38),0 0 0 11px rgba(255,153,51,0); }
    }

    #ananda-badge {
      position:absolute; top:-3px; right:-3px;
      width:18px; height:18px;
      background:#FF9933; color:#fff;
      font-size:10px; font-weight:700;
      border-radius:50%; border:2px solid #fff;
      display:none; align-items:center; justify-content:center;
    }

    #ananda-window {
      position:fixed; bottom:98px; right:24px;
      width:364px; max-height:560px;
      background:#F4F6FB; border-radius:18px;
      box-shadow:0 8px 40px rgba(0,45,110,.22);
      display:flex; flex-direction:column;
      z-index:9998; overflow:hidden;
      opacity:0; pointer-events:none;
      transform:translateY(14px) scale(.97);
      transition:opacity .22s,transform .22s;
    }
    #ananda-window.open { opacity:1; pointer-events:all; transform:translateY(0) scale(1); }

    #ananda-hdr {
      background:#002D6E; padding:13px 16px;
      display:flex; align-items:center; gap:10px; flex-shrink:0;
    }
    .a-av { width:38px; height:38px; background:linear-gradient(135deg,#FF9933,#e07700); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
    .a-hname { color:#fff; font-size:14px; font-weight:700; }
    .a-hsub  { color:rgba(255,255,255,.6); font-size:11px; margin-top:1px; }
    .a-dot   { display:inline-block; width:7px; height:7px; background:#4ade80; border-radius:50%; margin-right:4px; vertical-align:middle; }
    #ananda-x { background:rgba(255,255,255,.12); border:none; color:#fff; width:28px; height:28px; border-radius:50%; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:auto; flex-shrink:0; }
    #ananda-x:hover { background:rgba(255,255,255,.24); }

    #ananda-tri { display:flex; height:4px; flex-shrink:0; }
    #ananda-tri .at-s { flex:1; background:#FF9933; }
    #ananda-tri .at-w { flex:1; background:#fff; }
    #ananda-tri .at-g { flex:1; background:#138808; }

    #ananda-msgs {
      flex:1; overflow-y:auto;
      padding:12px 12px 6px;
      display:flex; flex-direction:column; gap:8px;
      min-height:0;
    }
    #ananda-msgs::-webkit-scrollbar { width:3px; }
    #ananda-msgs::-webkit-scrollbar-thumb { background:#DDE2EE; border-radius:3px; }

    .a-msg { display:flex; align-items:flex-end; gap:6px; max-width:92%; }
    .a-msg.bot  { align-self:flex-start; }
    .a-msg.user { align-self:flex-end; flex-direction:row-reverse; }

    .a-mav { width:26px; height:26px; background:linear-gradient(135deg,#FF9933,#e07700); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
    .a-bbl { padding:9px 13px; border-radius:16px; font-size:13px; line-height:1.52; }
    .a-msg.bot  .a-bbl { background:#fff; border:1px solid #DDE2EE; border-bottom-left-radius:4px; color:#1A1A2E; }
    .a-msg.user .a-bbl { background:#002D6E; color:#fff; border-bottom-right-radius:4px; }
    .a-bbl strong { color:#002D6E; }
    .a-msg.user .a-bbl strong { color:#FF9933; }
    .a-bbl .at { display:inline-block; background:#FFF3E0; color:#c45a00; border:1px solid #FFD580; border-radius:5px; font-size:11px; font-weight:600; padding:1px 6px; margin:2px 2px 0 0; }
    .a-bbl .ok { color:#138808; font-weight:700; }
    .a-bbl .no { color:#DC2626; font-weight:700; }
    .a-bbl ol,.a-bbl ul { padding-left:16px; margin-top:5px; }
    .a-bbl li { margin-bottom:3px; }
    .a-bbl hr { border:none; border-top:1px solid #DDE2EE; margin:7px 0; }

    /* Typing dots */
    .a-dots { display:flex; gap:4px; padding:9px 13px; }
    .a-dots span { width:6px; height:6px; background:#6B7280; border-radius:50%; animation:a-b 1.2s infinite; }
    .a-dots span:nth-child(2){ animation-delay:.2s; }
    .a-dots span:nth-child(3){ animation-delay:.4s; }
    @keyframes a-b { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

    /* Quick replies */
    #ananda-qr-btns { padding:6px 12px 8px; display:flex; flex-wrap:wrap; gap:5px; flex-shrink:0; }
    .a-qb { background:#fff; border:1.5px solid #002D6E; color:#002D6E; border-radius:14px; padding:5px 11px; font-size:12px; font-family:inherit; cursor:pointer; transition:all .15s; font-weight:500; }
    .a-qb:hover { background:#002D6E; color:#fff; }

    /* Input bar */
    #ananda-bar { display:flex; gap:7px; padding:8px 12px 12px; flex-shrink:0; border-top:1px solid #DDE2EE; }
    #ananda-inp { flex:1; padding:9px 14px; border:1.5px solid #DDE2EE; border-radius:20px; font-size:13px; font-family:inherit; outline:none; background:#fff; color:#1A1A2E; transition:border-color .2s; }
    #ananda-inp:focus { border-color:#002D6E; }
    #ananda-inp::placeholder { color:#6B7280; }
    #ananda-snd { width:38px; height:38px; background:#002D6E; border:none; border-radius:50%; color:#fff; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background .15s; }
    #ananda-snd:hover { background:#1a4a9e; }

    /* ── Inline QR retrieval form ── */
    .a-qr-form { background:#F4F6FB; border:1px solid #DDE2EE; border-radius:12px; padding:12px; margin-top:8px; }
    .a-qr-form label { display:block; font-size:12px; font-weight:600; color:#002D6E; margin-bottom:4px; }
    .a-qr-form input { width:100%; padding:8px 11px; border:1.5px solid #DDE2EE; border-radius:8px; font-size:13px; font-family:inherit; outline:none; margin-bottom:8px; color:#1A1A2E; }
    .a-qr-form input:focus { border-color:#002D6E; }
    .a-qr-form button { width:100%; padding:9px; background:#002D6E; color:#fff; border:none; border-radius:8px; font-size:13px; font-family:inherit; font-weight:600; cursor:pointer; transition:background .15s; }
    .a-qr-form button:hover { background:#1a4a9e; }
    .a-qr-form button:disabled { background:#9ca3af; cursor:not-allowed; }
    .a-qr-err { color:#DC2626; font-size:12px; margin-top:-4px; margin-bottom:6px; }

    /* Pass cards inside bot */
    .a-pass-card { background:#fff; border:1px solid #DDE2EE; border-radius:10px; padding:12px; margin-top:8px; text-align:center; }
    .a-pass-name { font-weight:700; font-size:14px; color:#002D6E; }
    .a-pass-meta { font-size:12px; color:#6B7280; margin:3px 0 10px; }
    .a-pass-status-reg { display:inline-block; background:#ECFDF5; color:#138808; border:1px solid #86efac; border-radius:6px; font-size:11px; font-weight:700; padding:2px 9px; margin-bottom:10px; }
    .a-pass-status-in  { display:inline-block; background:#FEF3C7; color:#b45309; border:1px solid #fcd34d; border-radius:6px; font-size:11px; font-weight:700; padding:2px 9px; margin-bottom:10px; }
    .a-pass-qr { margin:0 auto 8px; }
    .a-pass-note { font-size:11px; color:#6B7280; }

    @media(max-width:420px){
      #ananda-window { width:calc(100vw - 20px); right:10px; bottom:86px; }
      #ananda-launcher { right:12px; bottom:12px; }
    }
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
          <div class="a-hsub"><span class="a-dot"></span>IDY 2027 Assistant</div>
        </div>
        <button id="ananda-x" title="Close">✕</button>
      </div>
      <div id="ananda-tri"><div class="at-s"></div><div class="at-w"></div><div class="at-g"></div></div>
      <div id="ananda-msgs"></div>
      <div id="ananda-qr-btns">
        <button class="a-qb" onclick="anandaQ('retrieve_qr')">🔍 Get my QR code</button>
        <button class="a-qb" onclick="anandaQ('reg_number')">🔢 Reg. number</button>
        <button class="a-qb" onclick="anandaQ('tshirt')">👕 T-shirt</button>
        <button class="a-qb" onclick="anandaQ('mat')">🧘 Mats</button>
        <button class="a-qb" onclick="anandaQ('hydration')">💧 Hydration</button>
        <button class="a-qb" onclick="anandaQ('event')">📅 Event details</button>
      </div>
      <div id="ananda-bar">
        <input id="ananda-inp" type="text" placeholder="Ask me anything…" autocomplete="off">
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

  document.getElementById('ananda-launcher').addEventListener('click', toggleChat);
  document.getElementById('ananda-x').addEventListener('click', () => win.classList.remove('open'));
  document.getElementById('ananda-snd').addEventListener('click', sendFromInput);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') sendFromInput(); });

  function toggleChat() {
    const opening = !win.classList.contains('open');
    win.classList.toggle('open');
    if (opening) { badge.style.display = 'none'; inp.focus(); if (!_greeted) greet(); }
  }

  /* ── Message rendering ── */
  function botMsg(html) {
    const w = document.createElement('div'); w.className = 'a-msg bot';
    const av = document.createElement('div'); av.className = 'a-mav'; av.textContent = '🧘';
    const b  = document.createElement('div'); b.className  = 'a-bbl'; b.innerHTML = html;
    w.appendChild(av); w.appendChild(b); msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight;
    return b; // return bubble so caller can append form etc.
  }
  function userMsg(text) {
    const w = document.createElement('div'); w.className = 'a-msg user';
    const b = document.createElement('div'); b.className  = 'a-bbl'; b.textContent = text;
    w.appendChild(b); msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function showTyping() {
    const w = document.createElement('div'); w.className = 'a-msg bot'; w.id = 'a-typing';
    const av = document.createElement('div'); av.className = 'a-mav'; av.textContent = '🧘';
    const b  = document.createElement('div'); b.className  = 'a-bbl a-dots'; b.innerHTML = '<span></span><span></span><span></span>';
    w.appendChild(av); w.appendChild(b); msgs.appendChild(w);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() { const el = document.getElementById('a-typing'); if (el) el.remove(); }

  /* ── Inline QR Retrieval Form ── */
  async function showRetrieveForm(bubble) {
    // Load Firebase + QRCode if not present
    await Promise.all([
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js',      'ananda-fb-app'),
      loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js', 'ananda-fb-db'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',  'ananda-qrlib'),
    ]);

    // Init Firebase (safe to call multiple times)
    let db;
    try {
      if (!window._anandaFbApp) {
        window._anandaFbApp = firebase.initializeApp(FIREBASE_CONFIG, 'ananda');
      }
      db = firebase.app('ananda').database();
    } catch(e) {
      // If default app already exists on page, reuse it
      db = firebase.database();
    }

    const formId  = 'a-form-' + Date.now();
    const errId   = 'a-err-'  + Date.now();
    const resId   = 'a-res-'  + Date.now();
    const btnId   = 'a-btn-'  + Date.now();

    bubble.innerHTML += `
      <div class="a-qr-form" id="${formId}">
        <label>Email used at registration</label>
        <input id="${formId}-email" type="email" placeholder="your@email.com">
        <label>Year of Birth</label>
        <input id="${formId}-yob" type="text" placeholder="e.g. 1985 or 2528">
        <div class="a-qr-err" id="${errId}" style="display:none"></div>
        <button id="${btnId}" onclick="anandaDoRetrieve('${formId}','${errId}','${resId}','${btnId}')">Find My Pass ➤</button>
      </div>
      <div id="${resId}"></div>`;
    msgs.scrollTop = msgs.scrollHeight;

    // Store db reference for retrieval function
    window._anandaDb = db;
  }

  window.anandaDoRetrieve = async function(formId, errId, resId, btnId) {
    const emailRaw = (document.getElementById(formId + '-email').value || '').trim().toLowerCase();
    const yobRaw   = (document.getElementById(formId + '-yob').value   || '').trim();
    const errEl    = document.getElementById(errId);
    const resEl    = document.getElementById(resId);
    const btnEl    = document.getElementById(btnId);

    errEl.style.display = 'none';
    if (!emailRaw || !emailRaw.includes('@')) {
      errEl.textContent = 'Please enter a valid email address.'; errEl.style.display = 'block'; return;
    }

    btnEl.disabled = true; btnEl.textContent = 'Searching…';

    function emailToKey(e) { return e.toLowerCase().replace(/\./g,',').replace(/@/g,'_at_'); }
    function normalizeYOB(v) { const y = parseInt((v||'').trim()); if (!y||y<1900) return null; return y>2400?y-543:y; }

    try {
      const db   = window._anandaDb;
      const snap = await db.ref('registrations/' + emailToKey(emailRaw)).once('value');

      if (!snap.exists()) {
        errEl.textContent = 'No registration found for this email. Please check and try again.';
        errEl.style.display = 'block'; btnEl.disabled = false; btnEl.textContent = 'Find My Pass ➤'; return;
      }

      const reg = snap.val();

      if (reg.yearOfBirth) {
        const yobIn = normalizeYOB(yobRaw);
        if (!yobIn || yobIn !== reg.yearOfBirth) {
          errEl.textContent = 'Year of birth does not match. Please check and try again.';
          errEl.style.display = 'block'; btnEl.disabled = false; btnEl.textContent = 'Find My Pass ➤'; return;
        }
      }

      const ids    = reg.participantIds || [];
      const passes = (await Promise.all(
        ids.map(id => db.ref('participants/' + id).once('value').then(s => s.val()))
      )).filter(Boolean);

      // Hide form
      document.getElementById(formId).style.display = 'none';

      // Render passes
      const note = document.createElement('p');
      note.style.cssText = 'font-size:12px;color:#138808;font-weight:700;margin:8px 0 4px;';
      note.textContent = `✓ Found ${passes.length} pass${passes.length>1?'es':''} — screenshot to save!`;
      resEl.appendChild(note);

      passes.forEach((p, i) => {
        const card = document.createElement('div'); card.className = 'a-pass-card';
        const qrDiv = document.createElement('div'); qrDiv.className = 'a-pass-qr'; qrDiv.id = 'a-qr-canvas-' + i;

        card.innerHTML = `
          <div class="a-pass-name">${p.name || 'Participant'}</div>
          <div class="a-pass-meta">Reg #${p.regNum} · ${p.tshirtSize || ''} T-Shirt</div>
          <span class="${p.status === 'checked_in' ? 'a-pass-status-in' : 'a-pass-status-reg'}">
            ${p.status === 'checked_in' ? '✓ CHECKED IN' : 'REGISTERED'}
          </span>`;
        card.appendChild(qrDiv);
        card.innerHTML += `<div class="a-pass-note">📸 Screenshot this pass — needed for entry & T-shirt</div>`;
        resEl.appendChild(card);

        const qrData = p.qrToken ? `${p.regNum}|${p.qrToken}` : String(p.regNum);
        setTimeout(() => {
          new QRCode(document.getElementById('a-qr-canvas-' + i), {
            text: qrData, width: 140, height: 140, correctLevel: QRCode.CorrectLevel.M
          });
        }, 100);
      });

      msgs.scrollTop = msgs.scrollHeight;

    } catch(e) {
      errEl.textContent = 'Connection error. Please try again.';
      errEl.style.display = 'block';
    }
    if (btnEl) { btnEl.disabled = false; btnEl.textContent = 'Find My Pass ➤'; }
  };

  /* ── Knowledge Base ── */
  const KB = {
    retrieve_qr: {
      label: 'How do I get my QR code?',
      answer: async (bubble) => {
        bubble.innerHTML = `<strong>📲 Retrieve Your QR Code</strong><br><br>
          <span class="no">✘</span> <strong>No email is sent</strong> — the QR code is shown on-screen at registration and must be saved/screenshotted then.<br><br>
          Enter your details below and I'll pull it up for you right now:`;
        await showRetrieveForm(bubble);
      }
    },
    reg_number: {
      label: 'How do I find my registration number?',
      answer: async (bubble) => {
        bubble.innerHTML = `<strong>🔢 Registration Number</strong><br><br>
          Your registration number is shown on your pass. Let me retrieve it for you:`;
        await showRetrieveForm(bubble);
      }
    },
    tshirt: {
      label: 'T-shirt collection',
      answer: () => `<strong>👕 T-Shirt Collection</strong><br><br>
        <span class="ok">✔</span> <strong>1 T-shirt per participant</strong> — no exceptions.<br>
        <span class="ok">✔</span> Show your <strong>QR code</strong> at the collection counter.<br>
        <span class="no">✘</span> <strong>No bulk collection</strong> — each person must be present with their own QR code.<br>
        <span class="no">✘</span> Unclaimed shirts will not be held after the window closes.<br><br>
        <span class="at">📍 Counter</span> At the event entrance — follow signage.`
    },
    mat: {
      label: 'Do I need to bring a yoga mat?',
      answer: () => `<strong>🧘 Yoga Mats</strong><br><br>
        <span class="ok">✔</span> <strong>Mats will be laid out</strong> for all participants — no need to bring your own.<br><br>
        Just arrive, check in, and find your spot. Personal mats are welcome if you prefer.`
    },
    hydration: {
      label: 'Water and hydration',
      answer: () => `<strong>💧 Hydration</strong><br><br>
        <span class="ok">✔</span> <strong>Bring your own water bottle</strong> — Bangkok in June is warm!<br>
        <span class="ok">✔</span> Water refill stations on-site.<br><br>
        Aim for at least <strong>500ml–1L</strong>. Avoid heavy meals 1–2 hours before.`
    },
    event: {
      label: 'Event details',
      answer: () => `<strong>📅 13th International Day of Yoga 2027</strong><br><br>
        <span class="at">Date</span> Sunday, <strong>20 June 2027</strong><br>
        <span class="at">Venue</span> <strong>Chulalongkorn University</strong>, Bangkok<br><br>
        On the day bring your <strong>QR code</strong> and a <strong>water bottle</strong>. Mats and T-shirts provided on-site.`
    },
  };

  /* Text-based keyword fallback */
  const TEXT_KB = [
    { k:['bulk','collect for','on behalf','others','friend','family'], a:() => `<strong>🚫 No Bulk Collection</strong><br><br><span class="no">✘</span> T-shirts cannot be collected on behalf of others.<br><span class="ok">✔</span> Each participant must present their <strong>own QR code</strong> in person.` },
    { k:['lost','no email','didn\'t receive','not received','lost qr','lost pass'], a:() => `<strong>🔎 Lost Your QR Code?</strong><br><br><span class="no">✘</span> No email confirmation is sent — the QR is only shown on-screen at registration.<br><br>Tap <strong>"Get my QR code"</strong> below and I'll retrieve it for you right now!` },
    { k:['wear','attire','dress','clothing','what to bring'], a:() => `<strong>👗 What to Bring</strong><br><ul><li>Comfortable <strong>yoga/sportswear</strong></li><li>Your <strong>QR code</strong></li><li>A <strong>water bottle</strong></li></ul><span class="no">✘</span> No need for a yoga mat — provided on-site.` },
    { k:['check in','checkin','check-in','entry','arrive','arrival'], a:() => `<strong>✅ Check-in on Event Day</strong><br><ol><li>Go to the <strong>Check-in Counter</strong> at Chulalongkorn University.</li><li>Show your <strong>QR code</strong>.</li><li>Then visit the <strong>T-shirt Counter</strong> with the same QR.</li></ol><span class="at">Tip</span> Have QR ready before joining the queue!` },
    { k:['parking','transport','bts','mrt','how to get','getting there'], a:() => `<strong>🚗 Getting There</strong><br><br>BTS — Sala Daeng / National Stadium<br>MRT — Sam Yan (short walk)<br><br>Limited campus parking; public transport strongly recommended.` },
    { k:['thank','thanks','thank you','bye','great','perfect','ok','got it'], a:() => `You're welcome! 🙏 See you on <strong>20 June 2027</strong> at Chulalongkorn University! 🪷` },
    { k:['hi','hello','hey','namaste','good morning','sawadee'], a:() => `Namaste! 🙏 I'm <strong>Ananda</strong>, your IDY 2027 assistant. Tap a button below or ask me anything!` },
  ];

  function findTextAnswer(text) {
    const t = text.toLowerCase();
    for (const item of TEXT_KB) { if (item.k.some(k => t.includes(k))) return item.a(); }
    // Check KB keys too
    if (t.includes('qr') || t.includes('qr code') || t.includes('retrieve')) return null; // trigger retrieve flow
    if (t.includes('reg') || t.includes('number')) return null; // trigger retrieve flow
    if (t.includes('tshirt') || t.includes('t-shirt') || t.includes('shirt')) return KB.tshirt.answer();
    if (t.includes('mat')) return KB.mat.answer();
    if (t.includes('water') || t.includes('hydrat')) return KB.hydration.answer();
    if (t.includes('event') || t.includes('date') || t.includes('venue') || t.includes('chula')) return KB.event.answer();
    return `I'm not sure about that. Try the quick-reply buttons below, or ask about:<br>
      <ul><li>🔍 QR code retrieval</li><li>👕 T-shirt collection</li><li>🧘 Yoga mats</li><li>💧 Hydration</li></ul>`;
  }

  /* ── Send ── */
  function sendFromInput() {
    const text = inp.value.trim(); if (!text) return; inp.value = '';
    userMsg(text); qrBtns.style.display = 'none';
    showTyping();
    setTimeout(async () => {
      removeTyping();
      const t = text.toLowerCase();
      // Check if it's a retrieve-type question
      if (t.includes('qr') || t.includes('retrieve') || t.includes('lost') && t.includes('pass') || t.includes('get my pass')) {
        const b = botMsg(''); await KB.retrieve_qr.answer(b);
      } else if (t.includes('reg') && (t.includes('number') || t.includes('num') || t.includes('no'))) {
        const b = botMsg(''); await KB.reg_number.answer(b);
      } else {
        const ans = findTextAnswer(text);
        if (ans === null) { const b = botMsg(''); await KB.retrieve_qr.answer(b); }
        else botMsg(ans);
      }
    }, 600 + Math.random() * 300);
  }

  /* Global quick-reply handler */
  window.anandaQ = function(key) {
    qrBtns.style.display = 'none';
    const item = KB[key];
    userMsg(item.label);
    showTyping();
    setTimeout(async () => {
      removeTyping();
      const result = item.answer(null);
      if (result && typeof result.then === 'function') {
        // async (retrieve flow) — bubble already handled inside answer()
      } else if (typeof result === 'string') {
        botMsg(result);
      } else {
        // answer() was called with null bubble for retrieve flow — call properly
        const b = botMsg('');
        await item.answer(b);
      }
    }, 600 + Math.random() * 300);
  };

  /* ── Greet ── */
  let _greeted = false;
  function greet() {
    _greeted = true;
    setTimeout(() => botMsg(`Namaste! 🙏 I'm <strong>Ananda</strong>, your assistant for the <strong>13th International Day of Yoga 2027</strong>.<br><br>
      I can retrieve your <strong>QR code</strong> right here, or answer questions about T-shirts, mats, hydration, and the event. How can I help?`), 300);
  }

  /* Badge after 2s */
  setTimeout(() => { if (!win.classList.contains('open')) badge.style.display = 'flex'; }, 2000);

})();
