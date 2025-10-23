/* S-E-L Frontend App (split JS) */

// Demo users (20)
const DEMO_USERS = [
  { id: 'u1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop' },
  { id: 'u2', name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=121&auto=format&fit=crop' },
  { id: 'u3', name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=121&auto=format&fit=crop' },
  { id: 'u4', name: 'Sam Rivera', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=121&auto=format&fit=crop' },
  { id: 'u5', name: 'Taylor Brooks', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=122&auto=format&fit=crop' },
  { id: 'u6', name: 'Noah Kim', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=122&auto=format&fit=crop' },
  { id: 'u7', name: 'Ava Martinez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=123&auto=format&fit=crop' },
  { id: 'u8', name: "Liam O'Neil", avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=124&auto=format&fit=crop' },
  { id: 'u9', name: 'Zoe Johnson', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=124&auto=format&fit=crop' },
  { id: 'u10', name: 'Ethan Park', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=124&auto=format&fit=crop' },
  { id: 'u11', name: 'Olivia Nguyen', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=125&auto=format&fit=crop' },
  { id: 'u12', name: 'Lucas White', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=125&auto=format&fit=crop' },
  { id: 'u13', name: 'Mila Rossi', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=126&auto=format&fit=crop' },
  { id: 'u14', name: 'Isaac Green', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=127&auto=format&fit=crop' },
  { id: 'u15', name: 'Ruby Clark', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=126&auto=format&fit=crop' },
  { id: 'u16', name: 'Kai Yamamoto', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop' },
  { id: 'u17', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=129&auto=format&fit=crop' },
  { id: 'u18', name: 'Leo Garcia', avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=129&auto=format&fit=crop' },
  { id: 'u19', name: 'Chloe Brown', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=130&auto=format&fit=crop' },
  { id: 'u20', name: 'Nina Petrov', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=131&auto=format&fit=crop' },
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Simple store helpers
const store = {
  get(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  push(key, item) { const arr = store.get(key, []); arr.push(item); store.set(key, arr); }
};

// List paging state (front-end only)
const PAGE_SIZES = { network: 6, jobs: 6, events: 6, housing: 8 };
const paging = { network: PAGE_SIZES.network, jobs: PAGE_SIZES.jobs, events: PAGE_SIZES.events, housing: PAGE_SIZES.housing };

// Notifications store and helpers
const NOTIF_KEY = 'sel:notifs';
function pushNotification(n){
  const list = store.get(NOTIF_KEY, []);
  const withMeta = { id: 'n'+Date.now()+Math.random().toString(36).slice(2,6), ts: Date.now(), read: false, ...n };
  list.push(withMeta);
  store.set(NOTIF_KEY, list.slice(-50)); // cap at 50
  updateUnreadBadge();
  return withMeta;
}
function getNotifications(){ return (store.get(NOTIF_KEY, [])||[]).slice().sort((a,b)=> b.ts - a.ts); }
function unreadCount(){ return getNotifications().filter(x=>!x.read).length; }
function markAllRead(){ store.set(NOTIF_KEY, getNotifications().map(n=>({ ...n, read:true }))); updateUnreadBadge(); }
function clearAllNotifs(){ store.set(NOTIF_KEY, []); updateUnreadBadge(); renderNotifications(); }
function updateUnreadBadge(){ const b = document.getElementById('notifBadge'); if (!b) return; const c = unreadCount(); if (c>0){ b.textContent = c>9?'9+':String(c); b.classList.remove('hidden'); } else b.classList.add('hidden'); }
function timeAgo(ts){ const s=Math.floor((Date.now()-ts)/1000); if(s<60) return `${s}s`; const m=Math.floor(s/60); if(m<60) return `${m}m`; const h=Math.floor(m/60); if(h<24) return `${h}h`; return `${Math.floor(h/24)}d`; }
function renderNotifications(){
  const listEl = document.getElementById('notifList'); if (!listEl) return;
  const list = getNotifications();
  listEl.innerHTML='';
  list.forEach(n=>{
    const row = document.createElement('button');
    const variant = n.variant||'default';
    const styles = {
      announce: 'border-yellow-400/40 bg-yellow-500/10',
      market: 'border-green-400/40 bg-green-500/10',
      housing: 'border-sky-400/40 bg-sky-500/10',
      chat: 'border-purple-400/40 bg-purple-500/10',
      event: 'border-orange-400/40 bg-orange-500/10',
      study: 'border-cyan-400/40 bg-cyan-500/10',
      default: 'border-white/10'
    };
    const chip = (txt)=> `<span class='text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10'>${txt}</span>`;
    row.className = `w-full text-left glass rounded-2xl p-3 border ${styles[variant]||styles.default} ${n.read? 'opacity-80' : ''}`;
    row.innerHTML = `<div class="flex items-start gap-3"><div class="text-xl">${n.icon||'🔔'}</div><div class="flex-1"><div class="flex items-center justify-between"><div class="font-semibold flex items-center gap-2">${n.title} ${n.type?chip(n.type):''}</div><div class="text-xs text-white/60">${timeAgo(n.ts)}</div></div><div class="text-sm text-white/80">${n.msg}</div></div></div>`;
    row.onclick = ()=>{ showView(n.nav||'home'); // mark read on open
      const all = getNotifications().map(x=> x.id===n.id ? ({...x, read:true}) : x); store.set(NOTIF_KEY, all); updateUnreadBadge(); };
    listEl.appendChild(row);
  });
}

// Session and presence
const session = { id: null, user: null };

function pickProfile(email) {
  if (!email) return DEMO_USERS[Math.floor(Math.random()*DEMO_USERS.length)];
  const hash = [...email].reduce((a,c)=>a+c.charCodeAt(0),0);
  return DEMO_USERS[hash % DEMO_USERS.length];
}

function signIn(email) {
  const profile = pickProfile(email);
  session.id = profile.id + ':' + Math.random().toString(36).slice(2,7);
  session.user = { id: profile.id, name: profile.name, avatar: profile.avatar, email: email || null };
  store.set('sel:session', session);
  // presence
  const active = store.get('sel:presence', {});
  active[session.id] = { user: session.user, ts: Date.now() };
  store.set('sel:presence', active);
  window.dispatchEvent(new StorageEvent('storage', { key: 'sel:presence' }));
  updateHeader();
  renderSelfProfile();
  // After login, direct to Geo page to guide connection requirements
  showView('geo');
  updatePresence();
  updateOnlineButton();
  // If online toggle was previously on, restore simulated presence
  const wasOnline = !!store.get('sel:online', false);
  if (wasOnline) setSimulatedPresence(true);
}

function signOut() {
  const active = store.get('sel:presence', {});
  if (session.id && active[session.id]) { delete active[session.id]; store.set('sel:presence', active); }
  localStorage.removeItem('sel:session');
  // turn offline and clear simulated presence
  store.set('sel:online', false);
  // remove any simulated users
  const act2 = store.get('sel:presence', {});
  for (const k of Object.keys(act2)) if (k.startsWith('sim:')) delete act2[k];
  store.set('sel:presence', act2);
  session.id = null; session.user = null;
  updateHeader();
  showView('login');
  updatePresence();
  updateOnlineButton();
}

function updateHeader() {
  const nameEl = $('#appUserName');
  const avatarEl = $('#appUserAvatar');
  if (session.user) {
    nameEl.textContent = session.user.name;
    avatarEl.src = session.user.avatar;
    $('#btnSignOut').classList.remove('hidden');
  } else {
    nameEl.textContent = 'Guest';
    $('#btnSignOut').classList.add('hidden');
  }
}

// Navigation with animations
function animateIn(el) {
  if (!window.gsap || !el) return;
  gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' });
  // Stagger in prominent cards for more visual interest
  const items = el.querySelectorAll('.glass, .rounded-3xl, .rounded-2xl');
  if (items && items.length) {
    gsap.from(items, { opacity: 0, y: 6, duration: 0.18, stagger: 0.04, ease: 'power2.out', delay: 0.02 });
  }
}
function animateOut(el, onDone) {
  if (!window.gsap || !el) { if (onDone) onDone(); return; }
  gsap.to(el, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in', onComplete: onDone });
}

function showView(key) {
  const map = {
    login: '#viewLogin', home: '#viewHome', profile: '#viewProfile', chat: '#viewChat', geo: '#viewGeo', academic: '#viewAcademic', core: '#viewCore', network: '#viewNetwork', board: '#viewBoard', jobs: '#viewJobs', study: '#viewStudy', market: '#viewMarket', housing: '#viewHousing', gaming: '#viewGaming', notifs: '#viewNotifs'
  };
  const current = document.querySelector('.tab.active');
  const next = document.querySelector(map[key]);
  if (!next) return;

  const activate = () => {
    // Toggle visibility between tabs by syncing 'active' and 'hidden'
    $$('.tab').forEach(t => {
      if (t === next) { t.classList.add('active'); t.classList.remove('hidden'); }
      else { t.classList.remove('active'); t.classList.add('hidden'); }
    });
    // nav highlight
    $$('#bottomNav .navbtn').forEach(b=>b.classList.remove('bg-white/10'));
    const btn = $(`#bottomNav .navbtn[data-nav="${key}"]`);
    if (btn) btn.classList.add('bg-white/10');
    if (key !== 'more') $('#moreMenu').classList.add('hidden');
    animateIn(next);
    if (key==='notifs') renderNotifications();
    if (key==='geo') {
      // Reset connection state so the user must Check location first each visit
      store.set('sel:geoInside', false);
      store.set('sel:geoChecked', false);
      store.set('sel:geoNear', false);
      store.set('sel:geoDistance', null);
      updateGeoUI();
      renderGeoTempNotifs();
    }
  };

  if (current && current !== next) animateOut(current, activate); else activate();
}

function toggleMore() { $('#moreMenu').classList.toggle('hidden'); }

// Animate More menu when opening
function animateMoreMenu() {
  const menu = $('#moreMenu');
  if (!menu || !window.gsap) return;
  const items = Array.from(menu.querySelectorAll('button[data-nav]'));
  gsap.from(items, { opacity: 0, y: 8, duration: 0.18, stagger: 0.04, ease: 'power2.out' });
}

// Global online indicator
function updateGlobalOnline() {
  const el = $('#globalOnline');
  if (!el) return;
  const active = store.get('sel:presence', {});
  const users = Object.values(active).map(a=>a.user);
  const others = Math.max(0, users.length - (session.user ? 1 : 0));
  const isOnline = !!store.get('sel:online', false) && (navigator.onLine !== false);
  el.textContent = isOnline ? `${others} online` : 'Offline';
  if (isOnline) {
    el.className = 'px-2 py-1 rounded-full text-[10px] bg-green-500/15 text-green-300 border border-green-400/30';
  } else {
    el.className = 'px-2 py-1 rounded-full text-[10px] bg-red-500/15 text-red-300 border border-red-400/30';
  }
  if (window.gsap) gsap.fromTo(el, { scale: 0.95, opacity: 0.8 }, { scale: 1, opacity: 1, duration: 0.18 });
}

// Online simulation helpers
function updateOnlineButton() {
  const btn = $('#btnToggleOnline');
  if (!btn) return;
  const on = !!store.get('sel:online', false);
  btn.textContent = on ? 'Go Offline' : 'Go Online';
  updateGlobalOnline();
}

// --- Large campus simulation helpers ---
const FNAMES = ['Alex','Maya','Jordan','Sam','Taylor','Noah','Ava','Liam','Zoe','Ethan','Olivia','Lucas','Mila','Isaac','Ruby','Kai','Emma','Leo','Chloe','Nina','Diego','Aisha','Priya','Ben','Cara','Dylan','Esme','Felix','Grace','Hannah','Ivan','Jade','Kofi','Lana','Mateo','Nora','Omar','Pia','Quinn','Ravi','Sana','Theo','Uma','Vik','Wren','Xavi','Yara','Zane'];
const LNAMES = ['Chen','Patel','Lee','Rivera','Brooks','Kim','Martinez','ONeil','Johnson','Park','Nguyen','White','Rossi','Green','Clark','Yamamoto','Wilson','Garcia','Brown','Petrov','Singh','Lopez','Khan','Baker','Carter','Diaz','Evans','Foster','Gupta','Hall','Ibrahim','Jones','Keller','Liu','Mendez','Nakamura','Owens','Parker','Quincy','Reed','Sharma','Turner','Usman','Vargas','Wang','Xu','Young','Zhou'];
function genStudent(i){
  const fn = FNAMES[i % FNAMES.length];
  const ln = LNAMES[(i*7) % LNAMES.length];
  return { id: `sim${i}`, name: `${fn} ${ln}`, avatar: `https://picsum.photos/seed/selcampus${i}/100` };
}

function setSimulatedPresence(on) {
  const active = store.get('sel:presence', {}) || {};
  // Remove existing simulated entries
  for (const k of Object.keys(active)) if (k.startsWith('sim:')) delete active[k];
  if (on) {
    const now = Date.now();
    // Simulate a large campus: target ~120 peers online
    const target = 120;
    const demo = DEMO_USERS.filter(u => !session.user || u.id !== session.user.id);
    const others = [...demo];
    let i = 1;
    while (others.length < target) { others.push(genStudent(i++)); }
    store.set('sel:simIx', i);
    others.forEach((u, idx) => { active[`sim:${u.id}`] = { user: u, ts: now - (idx % 5) * 1000 }; });
    // Ensure self is present too
    if (session.user && session.id) active[session.id] = { user: session.user, ts: now };
  } else {
    // Remove self presence on going offline
    if (session.id && active[session.id]) delete active[session.id];
  }
  store.set('sel:presence', active);
  window.dispatchEvent(new StorageEvent('storage', { key: 'sel:presence' }));
  updatePresence();
  updateGlobalOnline();
}

// Presence churn for realism
function getNextSimIndex(){ const n = store.get('sel:simIx', 1); store.set('sel:simIx', n+1); return n; }
function churnSimPresence(){
  if (!store.get('sel:online', false)) return;
  const active = store.get('sel:presence', {}) || {};
  const keys = Object.keys(active);
  const simKeys = keys.filter(k=> k.startsWith('sim:'));
  const current = simKeys.length;
  // keep between 90 and 150
  const minT=90, maxT=150, base=120;
  let delta = Math.floor(Math.random()*7) - 3; // -3..+3
  if (current+delta < minT) delta = Math.abs(delta);
  if (current+delta > maxT) delta = -Math.abs(delta);
  if (delta > 0){
    for (let j=0;j<delta;j++){
      const i = getNextSimIndex();
      const stu = genStudent(i);
      active[`sim:${stu.id}`] = { user: stu, ts: Date.now() - (j%5)*1000 };
    }
  } else if (delta < 0){
    const toRemove = simKeys.sort(()=>Math.random()-0.5).slice(0, Math.min(simKeys.length, Math.abs(delta)));
    toRemove.forEach(k=> delete active[k]);
  }
  store.set('sel:presence', active);
  window.dispatchEvent(new StorageEvent('storage', { key: 'sel:presence' }));
  updatePresence();
}

function toggleOnline() {
  const next = !store.get('sel:online', false);
  store.set('sel:online', next);
  setSimulatedPresence(next);
  updateOnlineButton();
}

// Presence rendering
function initials(name) { return name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase(); }

function updatePresence() {
  const active = store.get('sel:presence', {});
  const now = Date.now();
  for (const k of Object.keys(active)) { if (now - active[k].ts > 10*60*1000) delete active[k]; }
  store.set('sel:presence', active);
  const users = Object.values(active).map(a=>a.user);
  $('#onlineCount').textContent = Math.max(1, users.length);
  const wrap = $('#onlineAvatars');
  if (wrap) {
    wrap.innerHTML = '';
    // If we ever re-enable, show a different subset here to avoid duplicating the global strip
    const startIx = 8; // global shows up to 8
    users.slice(startIx, startIx+6).forEach((u,i)=>{
      const btn = document.createElement('button');
      btn.className = 'outline-none';
      btn.title = `${u.name} — view profile`;
      const img = document.createElement('img');
      img.src = u.avatar; img.alt = u.name;
      img.className = 'w-8 h-8 rounded-full ring-2 ring-white/20 floaty';
      btn.appendChild(img);
      btn.onclick = ()=> openProfile(u.id);
      wrap.appendChild(btn);
      if (window.gsap) gsap.from(img, { opacity: 0, y: 6, delay: i*0.02, duration: 0.2 });
    });
  }
  // Global avatars strip
  const gwrap = $('#globalAvatars');
  if (gwrap) {
    gwrap.innerHTML = '';
    users.slice(0,8).forEach((u,i)=>{
      const img = document.createElement('img');
      img.src = u.avatar; img.alt = u.name;
      img.className = 'w-7 h-7 rounded-full ring-2 ring-white/10';
      gwrap.appendChild(img);
      if (window.gsap) gsap.from(img, { opacity: 0, y: 6, delay: i*0.02, duration: 0.18 });
    });
  }
  updateGlobalOnline();
}

// Profile details (deterministic mock data)
const MAJORS = ['Computer Science','Business','Biology','Psychology','Mechanical Eng','Data Science','Economics','Design'];
const BIOS = [
  'Curious problem-solver who loves hack nights and coffee.',
  'Passionate about learning and building helpful tools.',
  'Team player, always looking for study buddies and scrims.',
  'Interested in research and community impact.',
];
const INTERESTS = ['AI','UX','Robotics','Health','eSports','Photography','Music','Finance','Startups','Writing'];

function hashInt(str) { return [...str].reduce((a,c)=> (a*31 + c.charCodeAt(0))>>>0, 7); }
function detailsFor(user) {
  const h = hashInt(user.id);
  const major = MAJORS[h % MAJORS.length];
  const year = 1 + (h % 4);
  const bio = BIOS[h % BIOS.length];
  const picks = [];
  for (let i=0;i<4;i++) picks.push(INTERESTS[(h + i*3) % INTERESTS.length]);
  return { major, year: `Year ${year}`, bio, interests: Array.from(new Set(picks)) };
}

function renderSelfProfile() {
  if (!session.user) return;
  const d = detailsFor(session.user);
  $('#profAvatar').src = session.user.avatar;
  $('#profName').textContent = session.user.name;
  $('#profEmail').textContent = session.user.email || 'Anonymous test account';
  $('#profMajor').textContent = d.major;
  $('#profYear').textContent = d.year;
  $('#profBio').textContent = d.bio;
  const tags = $('#profInterests'); tags.innerHTML='';
  d.interests.forEach(t=>{
    const span = document.createElement('span');
    span.className = 'px-2 py-1 rounded-lg bg-white/10 text-xs';
    span.textContent = t; tags.appendChild(span);
  });
}

// View other profile (modal)
function openProfile(userId) {
  const all = DEMO_USERS;
  const u = all.find(x=>x.id===userId) || session.user;
  if (!u) return;
  const d = detailsFor(u);
  const m = document.createElement('div');
  m.className = 'fixed inset-0 flex items-center justify-center p-4';
  m.innerHTML = `
    <div class="absolute inset-0 bg-black/60 modal-backdrop"></div>
    <div class="relative glass rounded-2xl p-4 w-full max-w-sm">
      <div class="flex items-center gap-3">
        <img class="w-14 h-14 rounded-xl object-cover ring-2 ring-white/20" src="${u.avatar}">
        <div>
          <div class="font-semibold text-lg">${u.name}</div>
          <div class="text-xs text-white/60">${u.email || 'Student'}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mt-3">
        <div class="rounded-lg bg-white/5 border border-white/10 p-2"><div class="text-xs text-white/60">Major</div><div>${d.major}</div></div>
        <div class="rounded-lg bg-white/5 border border-white/10 p-2"><div class="text-xs text-white/60">Year</div><div>${d.year}</div></div>
        <div class="col-span-2 rounded-lg bg-white/5 border border-white/10 p-2"><div class="text-xs text-white/60">Bio</div><div>${d.bio}</div></div>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">${d.interests.map(t=>`<span class='px-2 py-1 rounded-lg bg-white/10 text-xs'>${t}</span>`).join('')}</div>
      <div class="flex justify-end mt-3"><button class="px-3 py-1.5 rounded-lg bg-white/10" id="profileClose">Close</button></div>
    </div>`;
  m.querySelector('#profileClose').onclick = ()=> document.body.removeChild(m);
  m.addEventListener('click', (e)=>{ if (e.target===m) document.body.removeChild(m); });
  document.body.classList.add('modal-open');
  document.body.appendChild(m);
  if (window.gsap) gsap.fromTo(m.querySelector('.relative'), { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: 'power2.out' });
}

// CHAT
function renderChat() {
  const msgs = store.get('sel:chat', []);
  const list = $('#chatList');
  list.innerHTML = '';
  msgs.slice(-100).forEach(m=>{
    const me = session.user && m.userId === session.user.id;
    const row = document.createElement('div');
    row.className = `flex ${me ? 'justify-end' : 'justify-start'}`;
    row.innerHTML = `
      <div class="max-w-[80%] ${me ? 'bg-brand-500' : 'bg-white/10'} rounded-2xl px-3 py-2">
        <div class="text-xs text-white/70">${m.userName} • ${new Date(m.ts).toLocaleTimeString()}</div>
        <div>${m.text}</div>
      </div>`;
    list.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 8, duration: 0.2 });
  });
  list.scrollTop = list.scrollHeight;
}

let typingTimer;
function updateTyping(status) {
  store.set('sel:typing', { user: session.user, status, ts: Date.now() });
  window.dispatchEvent(new StorageEvent('storage', { key: 'sel:typing' }));
}

// GEO
// Dome location and distance helpers
const DOME = (()=>{
  const cfg = (window.SEL_DOME||{});
  return {
    lat: typeof cfg.lat === 'number' ? cfg.lat : 43.0379, // default: Carrier Dome, Syracuse
    lon: typeof cfg.lon === 'number' ? cfg.lon : -76.1367,
    radius: typeof cfg.radius === 'number' ? cfg.radius : 50 // meters
  };
})();

function haversineMeters(lat1, lon1, lat2, lon2){
  const toRad = (d)=> d*Math.PI/180;
  const R = 6371000; // meters
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}
function formatMeters(m){ if (m==null) return ''; if (m<1) return `${(m*100).toFixed(0)} cm`; if (m<1000) return `${m.toFixed(0)} m`; return `${(m/1000).toFixed(2)} km`; }
function updateGeoUI() {
  const inside = !!store.get('sel:geoInside', false);
  const near = !!store.get('sel:geoNear', false);
  const online = !!store.get('sel:online', false) && (navigator.onLine !== false);
  const dist = store.get('sel:geoDistance', null);
  const checkedOnce = !!store.get('sel:geoChecked', false);
  const tgl = $('#geoToggle');
  if (tgl) {
    tgl.checked = inside;
    // Disable the connect toggle until user has checked location and we're online
    const canToggle = online && checkedOnce;
    tgl.disabled = !canToggle;
    // adjust pointer cursor on the label/track
    const label = tgl.closest('label');
    if (label) {
      label.classList.toggle('cursor-pointer', canToggle);
      label.classList.toggle('cursor-not-allowed', !canToggle);
      const track = label.querySelector('.w-8.h-4');
      if (track) track.style.opacity = canToggle ? '1' : '0.5';
    }
  }
  // Require location check first, then allow manual connect
  let statusTxt = 'Outside zone';
  if (!online) statusTxt = 'Offline — go online';
  else if (!checkedOnce) statusTxt = 'Tap “Check location” to continue';
  else if (!near) statusTxt = 'Outside zone' + (dist!=null?` • ${formatMeters(dist)} away`:'');
  else if (!inside) statusTxt = `Ready — ${dist!=null?`${formatMeters(dist)} from Dome — `:''}toggle to connect`;
  else statusTxt = 'Inside zone' + (dist!=null?` • ${formatMeters(dist)} from Dome`: '');
  $('#geoStatus').textContent = statusTxt;
  $('#geoStatus').className = 'font-semibold ' + (inside ? 'text-success' : 'text-danger');
  $('#geoDot').className = 'w-4 h-4 rounded-full transition ' + (inside ? 'bg-success translate-x-4' : 'bg-danger translate-x-0');
  $('#geoPostBtn').disabled = !inside;
  const alert = $('#geoAlert');
  if (alert) {
    let show = true, msg = '';
    if (!online) { msg = 'You must be online to connect and use geo features.'; }
    else if (!store.get('sel:geoChecked', false)) { msg = 'First, tap “Check location” to get your distance. Then toggle Connect.'; }
    else if (!near) { msg = `You must be within ${DOME.radius} m of the Dome to use geo features.`; }
    else if (!inside) { msg = 'Toggle Connect to enter the campus zone.'; }
    else { show = false; }
    alert.textContent = msg || alert.textContent;
    alert.classList.toggle('hidden', !show);
  }
  // Hide campus updates list when not connected
  const tempWrap = document.getElementById('geoTempWrap');
  if (tempWrap) tempWrap.classList.toggle('hidden', !inside);
  // Disable controls only while connecting; otherwise, allow attempts
  const checkBtn = $('#btnGeoCheck');
  if (checkBtn) checkBtn.disabled = false;
}

function renderGeoFeed() {
  const posts = store.get('sel:geoPosts', []);
  const feed = $('#geoFeed');
  feed.innerHTML = '';
  posts.slice().reverse().forEach(p=>{
    const card = document.createElement('div');
    card.className = 'rounded-2xl bg-white/5 border border-white/10 p-3';
    card.innerHTML = `
      <div class="text-xs text-white/60">${initials(p.userName)} • ${new Date(p.ts).toLocaleString()}</div>
      <div class="mt-1">${p.text}</div>`;
    feed.appendChild(card);
    if (window.gsap) gsap.from(card, { opacity: 0, y: 10, duration: 0.2 });
  });
}

// KB Search (mock)
const KB = [
  { title: 'How to ace CS 201 exams', snippet: 'Active recall, spaced repetition, and past papers…' },
  { title: 'Micro‑hours: getting the most out of 15 minutes', snippet: 'Prepare focused questions and bring recent work…' },
  { title: 'Math clarity toolkit', snippet: 'Concept mapping, error logs, and peer teaching…' },
  { title: 'Motivation slump? Quick wins', snippet: '2‑minute rule, accountability buddies, habit stacking…' },
  { title: 'Build a study group that lasts', snippet: 'Shared goals, consistent cadence, rotating facilitators…' },
];

// Networking mock
let NETWORK = [
  { title: 'UX Alum Q&A • Today 5pm', desc: 'Portfolio feedback and career stories', spots: 12 },
  { title: 'AI in Healthcare • Wed 6pm', desc: 'Clinical NLP and safety', spots: 8 },
  { title: 'Startup Chats • Fri 4pm', desc: 'From idea to MVP', spots: 20 },
];

// Jobs & Events mock
let JOBS = [
  { role: 'Library Assistant', org: 'Campus Library', pay: '$18/hr' },
  { role: 'IT Helpdesk', org: 'Tech Services', pay: '$20/hr' },
  { role: 'Research Assistant', org: 'Bio Lab', pay: '$22/hr' },
];
let EVENTS = [
  { title: 'Job Fair', when: 'Fri 10‑2', where: 'Main Hall' },
  { title: 'Hack Night', when: 'Sat 6‑11', where: 'Innovation Hub' },
  { title: 'Wellness Walk', when: 'Sun 9am', where: 'Riverside' },
];

// Study groups mock
const GROUPS_KEY = 'sel:groups';

// Marketplace mock
let MARKET = [
  { id: 'm1', title: 'iPad (9th gen)', price: 220, img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=400&auto=format&fit=crop' },
  { id: 'm2', title: 'Textbook: Linear Algebra', price: 35, img: 'https://images.unsplash.com/photo-1519730722595-a5ff788dea4a?q=80&w=400&auto=format&fit=crop' },
  { id: 'm3', title: 'Dorm mini‑fridge', price: 60, img: 'https://images.unsplash.com/photo-1622015663312-4f2ff6a5e104?q=80&w=400&auto=format&fit=crop' },
  { id: 'm4', title: 'Gaming headset', price: 45, img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=400&auto=format&fit=crop' },
  { id: 'm5', title: 'TI‑84 Plus Calculator', price: 50, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop' },
  { id: 'm6', title: 'Mechanical Keyboard', price: 70, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' },
  { id: 'm7', title: 'Monitor 24" 1080p', price: 85, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' },
  { id: 'm8', title: 'Noise‑canceling Earbuds', price: 55, img: 'https://images.unsplash.com/photo-1518441902113-c1d3b2a21e49?q=80&w=400&auto=format&fit=crop' },
  { id: 'm9', title: 'Textbook: Organic Chem', price: 40, img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop' },
  { id: 'm10', title: 'Office Chair', price: 65, img: 'https://images.unsplash.com/photo-1582582621959-48d3a00f74b6?q=80&w=400&auto=format&fit=crop' },
  { id: 'm11', title: 'Laptop Stand', price: 20, img: 'https://images.unsplash.com/photo-1490135900376-4a0b66d97a2d?q=80&w=400&auto=format&fit=crop' },
  { id: 'm12', title: 'LED Desk Lamp', price: 18, img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop' },
  { id: 'm13', title: 'Textbook: Calculus I', price: 30, img: 'https://images.unsplash.com/photo-1519730722595-a5ff788dea4a?q=80&w=400&auto=format&fit=crop' },
  { id: 'm14', title: 'Nintendo Switch (used)', price: 180, img: 'https://images.unsplash.com/photo-1585079542156-2755d9c37a5f?q=80&w=400&auto=format&fit=crop' },
  { id: 'm15', title: 'Portable SSD 1TB', price: 75, img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400&auto=format&fit=crop' },
  { id: 'm16', title: 'Graph Paper Notebooks (pack)', price: 8, img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop' },
  { id: 'm17', title: 'Whiteboard + markers', price: 22, img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=400&auto=format&fit=crop' },
  { id: 'm18', title: 'Bluetooth Speaker', price: 28, img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=crop' },
  { id: 'm19', title: 'Microwave (compact)', price: 45, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?q=80&w=400&auto=format&fit=crop' },
  { id: 'm20', title: 'Textbook: Data Structures', price: 35, img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=400&auto=format&fit=crop' },
];

// Housing mock
let HOUSING = [
  { title: 'Studio near campus', rent: 950, img: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=400&auto=format&fit=crop' },
  { title: 'Room in 3‑bed', rent: 650, img: 'https://images.unsplash.com/photo-1444419988131-046ed4e5ffd6?q=80&w=400&auto=format&fit=crop' },
  { title: '2‑bed apartment', rent: 1400, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400&auto=format&fit=crop' },
];

// Gaming mock
const ROOMS = [
  { name: 'Overwatch • Gold', players: 6 },
  { name: 'Overwatch • Casual', players: 8 },
  { name: 'Overwatch • Scrim Team', players: 10 },
  { name: 'Valorant • Ranked', players: 12 },
  { name: 'Valorant • Customs', players: 7 },
  { name: 'Rocket League • 3v3', players: 9 },
  { name: 'CS2 • Wingman', players: 5 },
  { name: 'Fortnite • Zero Build', players: 11 },
  { name: 'Minecraft • Survival', players: 14 },
  { name: 'League of Legends • Flex', players: 13 },
  { name: 'Apex Legends • Trios', players: 8 },
  { name: 'Dota 2 • Normal', players: 6 },
];

// Render helpers for sections
function renderKB() {
  const q = ($('#kbQuery').value || '').toLowerCase();
  const res = KB.filter(x => x.title.toLowerCase().includes(q) || x.snippet.toLowerCase().includes(q));
  const box = $('#kbResults');
  box.innerHTML = '';
  res.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'rounded-xl bg-white/5 border border-white/10 p-3';
    card.innerHTML = `<div class="font-medium">${r.title}</div><div class="text-sm text-white/70">${r.snippet}</div>`;
    box.appendChild(card);
    if (window.gsap) gsap.from(card, { opacity: 0, y: 14, duration: 0.25 });
  });
  if (!res.length) box.innerHTML = '<div class="text-sm text-white/60">No results. Try broader terms.</div>';
}

function openBooking() {
  const slots = ['Today 5:00', 'Today 5:30', 'Today 6:00', 'Tomorrow 10:00', 'Tomorrow 10:30', 'Tomorrow 11:00'];
  const box = $('#modalSlots'); box.innerHTML = '';
  slots.forEach(s=>{
    const b = document.createElement('button');
    b.className = 'px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20';
    b.textContent = s; b.onclick = () => box.querySelectorAll('button').forEach(x=>x.classList.remove('bg-brand-500')) || (b.classList.add('bg-brand-500'), b.dataset.sel='1');
    box.appendChild(b);
  });
  $('#modal').classList.remove('hidden'); $('#modal').classList.add('flex');
  if (window.gsap) gsap.fromTo($('#modal .relative'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
}

function confirmBooking() {
  const sel = Array.from($('#modalSlots').querySelectorAll('button')).find(b=>b.dataset.sel==='1');
  alert(sel ? `Booked: ${sel.textContent}` : 'Select a time');
  closeModal();
}
function closeModal() { $('#modal').classList.add('hidden'); $('#modal').classList.remove('flex'); }

// Generic modal opener (for quick games)
function openModal(id){ const m = document.getElementById(id); if (!m) return; m.classList.remove('hidden'); m.classList.add('flex'); if (window.gsap) gsap.fromTo(m.querySelector('.relative'), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }); }
function closeModalById(id){ const m = document.getElementById(id); if (!m) return; m.classList.add('hidden'); m.classList.remove('flex'); }

// --- Expand mock data to simulate a busy campus ---
function ensureRichMockData() {
  // Networking: ensure at least 18 sessions
  if (NETWORK.length < 18) {
    const titles = ['Coffee Chat with Alum','Resume Review','Mentor Office Hours','Portfolio Workshop','Internship Panel','Alumni Panel','Research Roundtable','Startup Founders AMA','Design Crit Night','Data Science Lightning Talks'];
    const descs = ['1:1 career chats','Bring your resume','Drop‑in guidance','Hands‑on feedback','Break into industry','Alumni stories','Share your work','Ask anything','Peer critique','Short talks'];
    let i = 0;
    while (NETWORK.length < 18) {
      NETWORK.push({ title: `${titles[i%titles.length]} • ${['Mon','Tue','Wed','Thu','Fri'][i%5]} ${4+(i%6)}pm`, desc: descs[i%descs.length], spots: 6 + (i*3)%24 });
      i++;
    }
  }

  // Jobs: ensure at least 24 postings
  if (JOBS.length < 24) {
    const roles = ['Barista','Tutor','TA','Lab Assistant','Front Desk','Campus Guide','Event Staff','Fitness Attendant','Data Entry','Library Shelver','Media Tech','Marketing Ambassador'];
    const orgs = ['Dining','Library','Math Dept','Chem Lab','Rec Center','Admissions','Bookstore','IT Services','Athletics','Housing','Career Services','Writing Center'];
    let i = 0;
    while (JOBS.length < 24) {
      const role = roles[i % roles.length];
      const org = orgs[(i*5) % orgs.length];
      const pay = `$${15 + (i%14)}/hr`;
      JOBS.push({ role: `${role}`, org: org, pay });
      i++;
    }
  }

  // Events: ensure at least 24 events
  if (EVENTS.length < 24) {
    const titles = ['Hack Night','Game Jam','Study Sprint','Career Panel','Open Mic','Volunteering','Film Night','Cultural Fest','Startup Pitch','Wellness Yoga','DS Meetup','Robotics Demo','Art Walk','Photography Sprint'];
    const whens = ['Mon 6pm','Tue 7pm','Wed 5pm','Thu 6pm','Fri 4pm','Sat 1pm','Sun 10am'];
    const wheres = ['Main Hall','Auditorium A','Innovation Hub','Quad','Library 210','Gym Court','Rec Lawn'];
    let i = 0;
    while (EVENTS.length < 24) {
      EVENTS.push({ title: titles[i%titles.length], when: whens[i%whens.length], where: wheres[(i*3)%wheres.length] });
      i++;
    }
  }

  // Housing: ensure at least 36 listings
  if (HOUSING.length < 36) {
    const kinds = ['Studio','Room in 4‑bed','Shared room','1‑bed','2‑bed','Loft','Basement suite','Townhome room'];
    const locs = ['2 min walk','5 min walk','8 min walk','On‑campus','Near bus line','Downtown','Riverside'];
    let i = 0;
    while (HOUSING.length < 36) {
      const kind = kinds[i % kinds.length];
      const where = locs[(i*7)%locs.length];
      const rent = 500 + ((i*37) % 1200);
      HOUSING.push({ title: `${kind} • ${where}`, rent, img: `https://picsum.photos/seed/selhousing${i}/320/200` });
      i++;
    }
  }
}

function renderNetwork() {
  const box = $('#networkList'); box.innerHTML='';
  const list = NETWORK.slice(0, paging.network);
  list.forEach(n=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${n.title}</div><div class="text-xs text-white/60">${n.desc}</div></div><button class="px-3 py-1.5 rounded-lg bg-brand-500">Join</button>`;
    box.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  if (NETWORK.length > paging.network){
    const more = document.createElement('button');
    more.className='w-full mt-2 px-3 py-2 rounded-xl bg-white/10';
    more.textContent = 'Load more sessions';
    more.onclick = ()=>{ paging.network += PAGE_SIZES.network; renderNetwork(); };
    box.appendChild(more);
  }
}

function renderBoard() {
  const posts = store.get('sel:board', []);
  const box = $('#boardList'); box.innerHTML='';
  posts.slice().reverse().forEach((p,ix)=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3';
    row.innerHTML = `<div class="text-xs text-white/60">${p.pinned ? '📌 Pinned • ' : ''}${p.user} • ${new Date(p.ts).toLocaleString()}</div><div class="mt-1">${p.text}</div>`;
    const pin = document.createElement('button'); pin.className='text-xs mt-2 bg-white/10 px-2 py-1 rounded-lg'; pin.textContent = p.pinned ? 'Unpin' : 'Pin';
    pin.onclick = ()=>{ p.pinned=!p.pinned; posts[posts.length-1-ix]=p; store.set('sel:board', posts); renderBoard(); };
    row.appendChild(pin);
    box.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
}

function renderJobsEvents() {
  const jl = $('#jobsList'); jl.innerHTML='';
  const jlist = JOBS.slice(0, paging.jobs);
  jlist.forEach(j=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${j.role}</div><div class="text-xs text-white/60">${j.org} • ${j.pay}</div></div>`;
    const btn = document.createElement('button'); btn.className='px-3 py-1.5 rounded-lg bg-brand-500'; btn.textContent='Apply'; btn.onclick=()=>alert('Application submitted!');
    row.appendChild(btn);
    jl.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  if (JOBS.length > paging.jobs){
    const more = document.createElement('button');
    more.className='w-full mt-2 px-3 py-2 rounded-xl bg-white/10';
    more.textContent = 'Load more jobs';
    more.onclick = ()=>{ paging.jobs += PAGE_SIZES.jobs; renderJobsEvents(); };
    jl.appendChild(more);
  }
  const el = $('#eventsList'); el.innerHTML='';
  const ev = EVENTS.slice(0, paging.events);
  ev.forEach(e=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${e.title}</div><div class="text-xs text-white/60">${e.when} • ${e.where}</div></div>`;
    const btn = document.createElement('button'); btn.className='px-3 py-1.5 rounded-lg bg-white/10'; btn.textContent='RSVP'; btn.onclick=()=>alert('RSVP recorded!');
    row.appendChild(btn);
    el.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  if (EVENTS.length > paging.events){
    const more = document.createElement('button');
    more.className='w-full mt-2 px-3 py-2 rounded-xl bg-white/10';
    more.textContent = 'Load more events';
    more.onclick = ()=>{ paging.events += PAGE_SIZES.events; renderJobsEvents(); };
    el.appendChild(more);
  }
}

function renderGroups() {
  const groups = store.get(GROUPS_KEY, []);
  const box = $('#groupList'); box.innerHTML='';
  groups.forEach((g,i)=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${g.name}</div><div class="text-xs text-white/60">Members: ${g.members.length}</div></div>`;
    const btn = document.createElement('button'); btn.className='px-3 py-1.5 rounded-lg bg-brand-500'; btn.textContent=g.members.includes(session.user?.id) ? 'Joined' : 'Join';
    btn.onclick=()=>{ if (!g.members.includes(session.user.id)) { g.members.push(session.user.id); groups[i]=g; store.set(GROUPS_KEY, groups); renderGroups(); }}
    row.appendChild(btn); box.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  if (!groups.length) box.innerHTML='<div class="text-sm text-white/60">No groups yet. Create one!</div>';
}

function renderMarket() {
  const grid = $('#marketGrid'); grid.innerHTML='';
  MARKET.forEach(m=>{
    const card = document.createElement('div');
    card.className='rounded-xl overflow-hidden bg-white/5 border border-white/10';
    card.innerHTML = `<img loading="lazy" class="w-full h-28 object-cover" src="${m.img}" alt="${m.title}">
      <div class="p-2">
        <div class="font-medium text-sm">${m.title}</div>
        <div class="text-xs text-white/60">$${m.price}</div>
        <div class="mt-2 flex gap-2">
          <button class="flex-1 px-2 py-1 rounded-lg bg-brand-500">Add</button>
          <button class="px-2 py-1 rounded-lg bg-white/10 contact">Contact</button>
        </div>
      </div>`;
    card.querySelector('.contact').onclick = ()=>{ $('#contactModal').classList.remove('hidden'); $('#contactModal').classList.add('flex'); if (window.gsap) gsap.fromTo($('#contactModal .relative'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 }); };
    grid.appendChild(card);
    if (window.gsap) gsap.from(card, { opacity: 0, y: 12, duration: 0.2 });
  });
}

function renderHousing() {
  const min = parseInt($('#rentMin').value||'0',10);
  const max = parseInt($('#rentMax').value||'99999',10);
  const list = $('#housingList'); list.innerHTML='';
  const filtered = HOUSING.filter(h=>h.rent>=min && h.rent<=max);
  const items = filtered.slice(0, paging.housing);
  items.forEach(h=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex gap-3';
    row.innerHTML = `<img loading="lazy" class="w-16 h-16 rounded-lg object-cover" src="${h.img}"><div class="flex-1"><div class="font-medium">${h.title}</div><div class="text-xs text-white/60">$${h.rent}/mo</div></div>`;
    const btn = document.createElement('button'); btn.className='px-3 py-1.5 rounded-lg bg-white/10'; btn.textContent='Contact'; btn.onclick=()=>alert('Owner contacted!');
    row.appendChild(btn); list.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  if (filtered.length > paging.housing){
    const more = document.createElement('button');
    more.className='w-full mt-2 px-3 py-2 rounded-xl bg-white/10';
    more.textContent = 'Load more housing';
    more.onclick = ()=>{ paging.housing += PAGE_SIZES.housing; renderHousing(); };
    list.appendChild(more);
  }
}

function renderGaming() {
  const box = $('#gameRooms'); box.innerHTML='';
  ROOMS.forEach(r=>{
    const row = document.createElement('div');
    row.className='rounded-xl bg-white/5 border border-white/10 p-3 flex items-center justify-between';
    row.innerHTML = `<div><div class="font-medium">${r.name}</div><div class="text-xs text-white/60">Players: ${r.players}</div></div>`;
    const btn = document.createElement('button'); btn.className='px-3 py-1.5 rounded-lg bg-brand-500'; btn.textContent='Join'; btn.onclick=()=>alert('Joined room!');
    row.appendChild(btn); box.appendChild(row);
    if (window.gsap) gsap.from(row, { opacity: 0, y: 10, duration: 0.2 });
  });
  // Populate quick games grid
  const qg = document.getElementById('quickGames');
  if (qg) {
    qg.innerHTML = '';
    const items = [
      { id:'ttt', name:'Tic Tac Toe', emoji:'⭕️❌', modal:'tttModal' },
      { id:'wordle', name:'Wordle Mini', emoji:'🟩🟨⬛', modal:'wordleModal' }
    ];
    items.forEach((g,i)=>{
      const card = document.createElement('button');
      card.className = 'rounded-2xl bg-white/5 border border-white/10 p-3 text-left hover:bg-white/10 transition';
      card.innerHTML = `<div class="text-2xl">${g.emoji}</div><div class="font-medium mt-1">${g.name}</div>`;
      card.onclick = ()=> openModal(g.modal);
      qg.appendChild(card);
      if (window.gsap) gsap.from(card, { opacity: 0, y: 8, duration: 0.2, delay: i*0.03 });
    });
  }
}

// CORE Pulse save + triage
function updatePulseLabels() {
  $('#valStress').textContent = $('#sliderStress').value;
  $('#valClarity').textContent = $('#sliderClarity').value;
  $('#valMotivation').textContent = $('#sliderMotivation').value;
  const s = +$('#sliderStress').value, c = +$('#sliderClarity').value;
  const risky = (s >= 4 && c <= 2);
  $('#triage').classList.toggle('hidden', !risky);
}

function savePulse() {
  const item = {
    userId: session.user?.id,
    userName: session.user?.name,
    stress: +$('#sliderStress').value,
    clarity: +$('#sliderClarity').value,
    motivation: +$('#sliderMotivation').value,
    ts: Date.now()
  };
  store.push('sel:pulse', item);
  alert('Pulse saved');
  if (window.firebase && window.SEL_FIREBASE?.enabled) {
    try { const db = firebase.firestore(); db.collection('pulse').add(item); } catch (e) { console.warn('Firestore not available', e); }
  }
}

// INIT
function hydrateFromLocal() {
  const saved = store.get('sel:session');
  if (saved && saved.user) { session.id = saved.id; session.user = saved.user; }
  updateHeader();
  if (saved) { renderSelfProfile(); showView('geo'); } else { showView('login'); }
  updatePresence();
  renderChat();
  // ensure defaults
  if (store.get('sel:geoNear') == null) store.set('sel:geoNear', false);
  if (store.get('sel:geoInside') == null) store.set('sel:geoInside', false);
  updateGeoUI(); renderGeoFeed();
  ensureRichMockData();
  renderKB(); renderNetwork(); renderBoard(); renderJobsEvents(); renderGroups(); renderMarket(); renderHousing(); renderGaming();
  // entry animations
  if (window.gsap) {
    gsap.from('header .glass', { opacity: 0, y: -12, duration: 0.35, ease: 'power2.out' });
    gsap.from('#bottomNav .glass', { opacity: 0, y: 12, duration: 0.35, ease: 'power2.out', delay: 0.05 });
  }
  // Restore online toggle state and simulated users
  updateOnlineButton();
  const on = !!store.get('sel:online', false);
  if (on) setSimulatedPresence(true);
  updateUnreadBadge();
}

// Global events
document.addEventListener('DOMContentLoaded', () => {
  hydrateFromLocal();

  // header actions
  $('#btnSignOut').addEventListener('click', signOut);

  // login
  $('#btnEmailLogin').addEventListener('click', ()=> signIn($('#email').value || null));
  $('#btnAnonLogin').addEventListener('click', ()=> signIn(null));

  // auth guard for nav
  function requireAuth(next) { if (!session.user && next!=='login') { showView('login'); return false; } return true; }
  // nav
  $$('#bottomNav [data-nav]').forEach(b=> b.addEventListener('click', (e)=>{
    const key = e.currentTarget.getAttribute('data-nav');
    if (key==='more') { toggleMore(); animateMoreMenu(); return; }
    if (!requireAuth(key)) return;
    if (key==='profile') renderSelfProfile();
    showView(key);
  }));
  $('#closeMore').addEventListener('click', toggleMore);
  // hook More menu items
  $$('#moreMenu [data-nav]').forEach(b=> b.addEventListener('click', (e)=>{
    const key = e.currentTarget.getAttribute('data-nav');
    if (!requireAuth(key)) return;
    showView(key);
    $('#moreMenu').classList.add('hidden');
  }));

  // quick actions in home
  $$('#viewHome [data-nav]').forEach(b=> b.addEventListener('click', (e)=>{
    const key = e.currentTarget.getAttribute('data-nav');
    if (!requireAuth(key)) return;
    showView(key);
  }));
  // online toggle
  const tgl = $('#btnToggleOnline');
  if (tgl) tgl.addEventListener('click', ()=>{ if (!session.user) { showView('login'); return; } toggleOnline(); });
  const globalOnline = $('#globalOnline');
  if (globalOnline) globalOnline.addEventListener('click', ()=>{ if (!session.user) { showView('login'); return; } toggleOnline(); });

  // chat
  $('#chatSend').addEventListener('click', ()=>{
    const text = $('#chatInput').value.trim(); if (!text || !session.user) return;
    store.push('sel:chat', { text, userId: session.user.id, userName: session.user.name, ts: Date.now() });
    $('#chatInput').value='';
    window.dispatchEvent(new StorageEvent('storage', { key:'sel:chat' }));
    renderChat();
  });
  $('#chatInput').addEventListener('input', ()=>{ clearTimeout(typingTimer); updateTyping(true); typingTimer = setTimeout(()=> updateTyping(false), 800); });

  // geo
  $('#geoToggle').addEventListener('change', (e)=>{
    const checked = e.target.checked;
    const near = !!store.get('sel:geoNear', false);
    const online = !!store.get('sel:online', false) && (navigator.onLine !== false);
    const hasChecked = !!store.get('sel:geoChecked', false);
    // Guard: require Check Location first
    if (checked && !hasChecked) {
      e.target.checked = false;
      updateGeoUI();
      return;
    }
    if (checked) {
      if (!online) { e.target.checked = false; updateGeoUI(); return; }
      if (!near) { e.target.checked = false; updateGeoUI(); return; }
      showConnecting(()=>{ store.set('sel:geoInside', true); updateGeoUI(); triggerGeoConnectNotifications(); });
    } else {
      store.set('sel:geoInside', false); updateGeoUI();
    }
  });
  const geoCheck = $('#btnGeoCheck');
  if (geoCheck) geoCheck.addEventListener('click', ()=> checkLocation());
  $('#geoPostBtn').addEventListener('click', ()=>{
    const text = $('#geoPostInput').value.trim(); if (!text || !session.user) return;
    store.push('sel:geoPosts', { text, userId: session.user.id, userName: session.user.name, ts: Date.now() });
    $('#geoPostInput').value=''; renderGeoFeed(); window.dispatchEvent(new StorageEvent('storage', { key:'sel:geoPosts' }));
  });

  // academic
  $('#kbSearch').addEventListener('click', renderKB);
  $('#bookMentor').addEventListener('click', openBooking);
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalConfirm').addEventListener('click', confirmBooking);

  // core
  ['sliderStress','sliderClarity','sliderMotivation'].forEach(id=> $('#'+id).addEventListener('input', updatePulseLabels));
  updatePulseLabels();
  $('#savePulse').addEventListener('click', savePulse);
  $('#triageDismiss').addEventListener('click', ()=> $('#triage').classList.add('hidden'));

  // board
  $('#boardPost').addEventListener('click', ()=>{
    const text = $('#boardInput').value.trim(); if (!text || !session.user) return;
    const posts = store.get('sel:board', []); posts.push({ text, user: session.user.name, pinned: false, ts: Date.now() }); store.set('sel:board', posts);
    $('#boardInput').value=''; renderBoard();
  });

  // study groups
  $('#groupCreate').addEventListener('click', ()=>{
    const name = $('#groupName').value.trim(); if (!name || !session.user) return;
    const groups = store.get(GROUPS_KEY, []); groups.push({ name, members: [session.user.id] }); store.set(GROUPS_KEY, groups);
    $('#groupName').value=''; renderGroups();
  });

  // marketplace
  $('#contactClose').addEventListener('click', ()=>{ $('#contactModal').classList.add('hidden'); $('#contactModal').classList.remove('flex'); });

  // housing
  $('#rentApply').addEventListener('click', renderHousing);

  // quick games modal close handlers
  const tttClose = document.getElementById('tttClose'); if (tttClose) tttClose.addEventListener('click', ()=> closeModalById('tttModal'));
  const wordleClose = document.getElementById('wordleClose'); if (wordleClose) wordleClose.addEventListener('click', ()=> closeModalById('wordleModal'));
  const tttModal = document.getElementById('tttModal'); if (tttModal) tttModal.addEventListener('click', (e)=>{ if (e.target===tttModal) closeModalById('tttModal'); });
  const wordleModal = document.getElementById('wordleModal'); if (wordleModal) wordleModal.addEventListener('click', (e)=>{ if (e.target===wordleModal) closeModalById('wordleModal'); });

  // gaming tabs
  const tabRooms = document.getElementById('tabGameRooms');
  const tabQuick = document.getElementById('tabQuickGames');
  if (tabRooms && tabQuick){
    const setTab = (which)=>{
      const isRooms = which==='rooms';
      tabRooms.classList.toggle('bg-brand-500', isRooms);
      tabRooms.classList.toggle('text-white', isRooms);
      tabQuick.classList.toggle('bg-brand-500', !isRooms);
      tabQuick.classList.toggle('text-white', !isRooms);
      document.getElementById('gameRooms').classList.toggle('hidden', !isRooms);
      document.getElementById('quickGames').classList.toggle('hidden', isRooms);
    };
    tabRooms.addEventListener('click', ()=> setTab('rooms'));
    tabQuick.addEventListener('click', ()=> setTab('quick'));
    setTab('rooms');
  }

  // notifications UI
  const bell = document.getElementById('btnNotifs'); if (bell) bell.addEventListener('click', ()=>{ if (!session.user) { showView('login'); return; } showView('notifs'); });
  const btnMarkAll = document.getElementById('btnNotifMarkAll'); if (btnMarkAll) btnMarkAll.addEventListener('click', ()=>{ markAllRead(); renderNotifications(); });
  const btnClear = document.getElementById('btnNotifClear'); if (btnClear) btnClear.addEventListener('click', ()=> clearAllNotifs());

  // storage listeners for cross‑tab realtime
  window.addEventListener('storage', (e)=>{
    if (e.key==='sel:chat') renderChat();
    if (e.key==='sel:geoPosts') renderGeoFeed();
    if (e.key==='sel:presence') updatePresence();
    if (e.key==='sel:typing') {
      const payload = store.get('sel:typing');
      if (payload?.status && payload.user?.id !== session.user?.id) {
        $('#typingStatus').textContent = `${payload.user.name} is typing…`;
        setTimeout(()=> $('#typingStatus').textContent='\u00A0', 1000);
      }
    }
  });

  // reflect real network online/offline in UI
  window.addEventListener('online', ()=>{ updateGlobalOnline(); updateGeoUI(); });
  window.addEventListener('offline', ()=>{ updateGlobalOnline(); updateGeoUI(); });

  // keep presence alive every 2 minutes
  setInterval(()=>{
    if (!session.id) return;
    const active = store.get('sel:presence', {}); active[session.id] = { user: session.user, ts: Date.now() }; store.set('sel:presence', active);
    window.dispatchEvent(new StorageEvent('storage', { key: 'sel:presence' }));
  }, 120000);

  // subtle presence churn for realism
  setInterval(churnSimPresence, 15000);
});

// Geo connecting and location simulation
let geoDotsTL;
function showConnecting(done){
  const overlay = $('#geoConnecting');
  if (!overlay) { if (done) done(); return; }
  overlay.classList.remove('hidden'); overlay.classList.add('flex');
  if (window.gsap){
    const dots = overlay.querySelectorAll('#geoDots span');
    geoDotsTL && geoDotsTL.kill();
    geoDotsTL = gsap.timeline({ repeat: -1 });
    geoDotsTL.to(dots, { opacity: 0.2, stagger: 0.1, duration: 0.2 })
             .to(dots, { opacity: 1, stagger: 0.1, duration: 0.2 }, '<0.15');
  }
  setTimeout(()=>{
    overlay.classList.add('hidden'); overlay.classList.remove('flex');
    if (geoDotsTL) geoDotsTL.kill();
    if (done) done();
  }, 1400);
}

function checkLocation(){
  const simulateNear = ()=>{
    // For testing: everywhere is treated as the Dome. Random nearby distance under radius.
    const fakeD = Math.max(1, Math.min(DOME.radius - 1, Math.round( (Math.random()* (DOME.radius*0.9)) + 0.5 )));
    store.set('sel:geoDistance', fakeD);
    store.set('sel:geoNear', true);
    // Do not auto-enter zone; require user to toggle Connect
    store.set('sel:geoInside', false);
    // Mark that the user has performed a location check this session
    store.set('sel:geoChecked', true);
    updateGeoUI();
  };

  const onError = (err)=>{
    console.warn('Geolocation error (simulating near)', err);
    simulateNear();
  };
  if (!navigator.geolocation) { simulateNear(); return; }
  showConnecting(()=>{
    navigator.geolocation.getCurrentPosition((pos)=>{
      // We ignore real distance during testing; we still call geolocation to request permission.
      // Optionally store the real distance for debug but not used for gating.
      try {
        const { latitude, longitude } = pos.coords;
        const realD = haversineMeters(latitude, longitude, DOME.lat, DOME.lon);
        store.set('sel:geoLastRealDist', realD);
      } catch {}
      simulateNear();
    }, onError, { enableHighAccuracy: true, timeout: 7000, maximumAge: 15000 });
  });
}

// ---- Notifications after geo connect ----
function triggerGeoConnectNotifications(){
  const last = store.get('sel:geoLastNotifyTs', 0);
  const now = Date.now();
  if (now - last < 60*1000) return; // avoid spamming within 60s
  store.set('sel:geoLastNotifyTs', now);

  const items = buildGeoNotifications();
  // persist and animate
  items.forEach(it=> pushNotification(it));
  showToastsSequential(items);
  simulateChatBurst(10, 24);
  setGeoTempNotifs(items);
}

function buildGeoNotifications(){
  // Announcement cards from school
  const announces = [
    { type: 'Announcement', variant:'announce', title: 'Exam Retake Signup', msg: 'Don’t forget to sign up for retakes by Friday 5pm.', nav: 'academic', icon: '📢' },
    { type: 'Announcement', variant:'announce', title: 'Collect Student ID', msg: 'Pick up your ID at the Student Center (Mon–Fri 9–5).', nav: 'home', icon: '🪪' },
    { type: 'Announcement', variant:'announce', title: 'Parking Permit Deadline', msg: 'Permits due this week; avoid citations on campus.', nav: 'home', icon: '🅿️' },
  ];

  // Market and Housing highlights
  const mk = MARKET.slice(0,3).map(m=> ({ type:'Marketplace', variant:'market', title:'New student listing', msg:`${m.title} • $${m.price}`, nav:'market', icon:'�' }));
  const hs = HOUSING.slice(0,2).map(h=> ({ type:'Housing', variant:'housing', title:'New apartment near you', msg:`${h.title} • $${h.rent}/mo`, nav:'housing', icon:'🏠' }));

  // Event and Study prompts
  const eventCard = { type:'Event', variant:'event', title:'Happening soon', msg:'Alumni Panel in Auditorium B starts in 10 minutes.', nav:'network', icon:'🎤' };
  const studyCard = { type:'Study', variant:'study', title:'Study sprint today', msg:'Data Science sprint at 6pm • Innovation Hub.', nav:'study', icon:'📚' };

  // Chat nudge (paired with actual chat simulation below)
  const chatCard = { type:'Chat', variant:'chat', title:'New campus chat', msg:'Lots of activity—jump in and say hi!', nav:'chat', icon:'�' };

  return [...announces, eventCard, studyCard, chatCard, ...mk, ...hs];
}

function showToastsSequential(items){
  const stack = $('#notifyStack'); if (!stack) return;
  let tl = window.gsap ? gsap.timeline() : null;
  items.forEach((n, idx)=>{
    const el = document.createElement('button');
    const variant = n.variant||'default';
    const styles = {
      announce: 'border-yellow-400/40 bg-yellow-500/10',
      market: 'border-green-400/40 bg-green-500/10',
      housing: 'border-sky-400/40 bg-sky-500/10',
      chat: 'border-purple-400/40 bg-purple-500/10',
      event: 'border-orange-400/40 bg-orange-500/10',
      study: 'border-cyan-400/40 bg-cyan-500/10',
      default: 'border-white/10'
    };
    el.className = `pointer-events-auto text-left glass rounded-2xl p-3 border ${styles[variant]||styles.default} shadow-md focus:outline-none`;
    el.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-xl leading-none">${n.icon}</div>
        <div class="flex-1">
          <div class="font-semibold">${n.title}</div>
          <div class="text-sm text-white/80">${n.msg}</div>
        </div>
      </div>`;
    el.onclick = ()=>{ showView(n.nav); el.remove(); };
    el.style.opacity = '0'; el.style.transform = 'translateY(-6px)';
    stack.appendChild(el);

    const appear = ()=>{
      if (window.gsap) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' });
      } else { el.style.opacity = '1'; el.style.transform='none'; }
      // auto dismiss
      setTimeout(()=> dismissToast(el), 4200 + idx*200);
    };

    if (tl) tl.add(appear, `+=${idx?0.35:0.1}`); else setTimeout(appear, 400*idx);
  });
}

function dismissToast(el){
  if (!el) return;
  if (window.gsap) gsap.to(el, { opacity: 0, y: -8, duration: 0.18, ease: 'power2.in', onComplete: ()=> el.remove() });
  else el.remove();
}

// ---- Geo temporary notifications (swipe to dismiss/pin) ----
const GEO_TEMP_KEY = 'sel:geoTemp';
function setGeoTempNotifs(list){
  const obj = { ts: Date.now(), items: list.map(n=>({ ...n, pinned:false, tempId: 'gt'+Math.random().toString(36).slice(2,7) })) };
  // keep only latest batch
  store.set(GEO_TEMP_KEY, obj);
  renderGeoTempNotifs();
}
function getGeoTemp(){ return store.get(GEO_TEMP_KEY, { ts:0, items:[] }); }
function renderGeoTempNotifs(){
  const wrap = document.getElementById('geoTempWrap');
  const listEl = document.getElementById('geoTempNotifs');
  if (!wrap || !listEl) return;
  // Do not show campus updates when not connected
  const inside = !!store.get('sel:geoInside', false);
  if (!inside) { wrap.classList.add('hidden'); listEl.innerHTML=''; return; }
  const data = getGeoTemp();
  const items = (data.items||[]).slice().sort((a,b)=> (b.pinned?1:0) - (a.pinned?1:0));
  wrap.classList.toggle('hidden', items.length===0);
  listEl.innerHTML='';
  items.forEach(n=>{
    const row = document.createElement('div');
    row.className = `rounded-2xl p-3 glass border ${n.variant==='announce'?'border-yellow-400/40': n.variant==='market'?'border-green-400/40': n.variant==='housing'?'border-sky-400/40': n.variant==='chat'?'border-purple-400/40': n.variant==='event'?'border-orange-400/40': n.variant==='study'?'border-cyan-400/40':'border-white/10'} ${n.pinned?'ring-1 ring-yellow-400/40':''}`;
    row.style.touchAction = 'pan-y';
    row.innerHTML = `<div class="flex items-start gap-3">
        <div class="text-xl">${n.icon||'🔔'}</div>
        <div class="flex-1">
          <div class="flex items-center gap-2"><div class="font-semibold">${n.title}</div>${n.pinned?'<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-400/30">Pinned</span>':''}</div>
          <div class="text-sm text-white/80">${n.msg}</div>
        </div>
      </div>`;
    // click to navigate & remove
    row.addEventListener('click', ()=>{
      showView(n.nav||'home');
      removeGeoTemp(n.tempId);
    });
    // swipe handling
    let startX=0, curX=0, dragging=false;
    function onStart(e){ dragging=true; startX = (e.touches?e.touches[0].clientX:e.clientX); row.style.transition='none'; }
    function onMove(e){ if(!dragging) return; curX=(e.touches?e.touches[0].clientX:e.clientX); const dx=curX-startX; row.style.transform=`translateX(${dx}px)`; row.style.opacity = `${Math.max(0.4, 1 - Math.abs(dx)/160)}`; }
    function onEnd(){ if(!dragging) return; dragging=false; row.style.transition='transform .18s ease, opacity .18s ease'; const dx = curX - startX;
      if (dx < -60){ // dismiss
        row.style.transform='translateX(-120px)'; row.style.opacity='0'; setTimeout(()=> removeGeoTemp(n.tempId), 160);
      } else if (dx > 60){ // pin
        pinGeoTemp(n.tempId);
        row.style.transform='translateX(0)'; row.style.opacity='1';
      } else {
        row.style.transform='translateX(0)'; row.style.opacity='1';
      }
    }
    row.addEventListener('touchstart', onStart, {passive:true});
    row.addEventListener('touchmove', onMove, {passive:true});
    row.addEventListener('touchend', onEnd);
    row.addEventListener('mousedown', onStart);
    row.addEventListener('mousemove', onMove);
    row.addEventListener('mouseup', onEnd);
    listEl.appendChild(row);
  });
}
function removeGeoTemp(id){ const data=getGeoTemp(); data.items = (data.items||[]).filter(x=>x.tempId!==id); store.set(GEO_TEMP_KEY, data); renderGeoTempNotifs(); }
function pinGeoTemp(id){ const data=getGeoTemp(); data.items = (data.items||[]).map(x=> x.tempId===id?({...x, pinned:true}):x); store.set(GEO_TEMP_KEY, data); renderGeoTempNotifs(); }

// Simulate a burst of chat messages among multiple participants
function simulateChatBurst(participants=10, count=24){
  const baseUsers = DEMO_USERS.slice();
  while (baseUsers.length < participants){ baseUsers.push(genStudent(baseUsers.length+1)); }
  const picks = baseUsers.sort(()=>Math.random()-0.5).slice(0, participants);
  const phrases = [
    'Anyone at the Hub right now?',
    'Room 210 is free for study!',
    'Who’s going to the Alumni Panel?',
    'Need a calc for midterm—borrow/trade?',
    'GGs last night in Valorant!',
    'Coffee line is long—save a spot?',
    'Shared the notes in drive 📂',
    'Ping me if you need the slides',
    'Let’s form a group for DS project',
    'Reminder: retake signup by Fri',
    'I posted a dorm fridge for $60',
    'Anyone seen the new study rooms?' 
  ];
  const msgs = store.get('sel:chat', []);
  const now = Date.now();
  for (let i=0;i<count;i++){
    const u = picks[i % picks.length];
    msgs.push({ text: phrases[(i*3)%phrases.length], userId: u.id, userName: u.name, ts: now - (count-i)*3000 });
  }
  store.set('sel:chat', msgs.slice(-200));
  window.dispatchEvent(new StorageEvent('storage', { key:'sel:chat' }));
  renderChat();
}

