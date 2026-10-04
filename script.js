const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress + cursor glow
addEventListener('scroll', () => {
  $('#bar').style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
}, { passive: true });
addEventListener('pointermove', e => { const g = $('#glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });

// Typing roles
const roles = ['AI chatbots', 'lead automations', 'Flask web apps', 'smart workflows'];
let r = 0, c = 0, del = false;
(function type() {
  const w = roles[r];
  $('#type').textContent = w.slice(0, c);
  if (reduce) { $('#type').textContent = roles[0]; return; }
  if (!del && c === w.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 80);
})();

// Reveal on scroll + counters
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
$$('.rv').forEach(el => io.observe(el));
$$('.stats b').forEach(b => {
  const n = +b.dataset.n; let i = 0;
  const t = setInterval(() => { b.textContent = ++i; if (i >= n) clearInterval(t); }, 260);
});

// 3D tilt on cards
if (!reduce) $$('.tilt').forEach(el => {
  el.addEventListener('pointermove', e => {
    const b = el.getBoundingClientRect(), x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    el.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
});

// Project filter
$$('.filters button').forEach(btn => btn.onclick = () => {
  $$('.filters button').forEach(b => b.classList.toggle('on', b === btn));
  $$('.proj article').forEach(a => a.classList.toggle('hide', btn.dataset.f !== 'all' && !a.dataset.c.includes(btn.dataset.f)));
});

// Copy email
const toast = m => { const t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); };
$('#copy').onclick = () => navigator.clipboard.writeText('zaminafzal8@gmail.com').then(() => toast('Email copied'), () => toast('zaminafzal8@gmail.com'));

// AI assistant (answers from Zamin's own data, works offline)
const KB = [
  [['skill', 'tech', 'know', 'language'], 'Zamin works with Python, SQL, HTML, C and C++ (basic), plus Flask, REST, Git, GitHub and Make.com. He is also learning Machine Learning and Linear Algebra.'],
  [['automation', 'make', 'chatbot', 'bot', 'lead'], 'He builds AI automations in Make.com: lead-support workflows that capture and follow up on inquiries, and AI chatbots that answer customer questions.'],
  [['autonexa', 'website', 'agency'], 'AUTONEXA AI is his AI automation brand and website: chatbots, lead automation, appointment systems, AI agents and CRM workflows. Visit autonexa-ai.vercel.app.'],
  [['project', 'work', 'built', 'portfolio'], 'Main projects: AUTONEXA AI, the Online Doctor Appointment System (Flask), Resume Analyzer, and AI Impact on Jobs 2010 to 2025.'],
  [['doctor', 'appointment', 'flask', 'odas'], 'The Online Doctor Appointment System is a full-stack Flask app with patient booking, a doctor panel, an admin dashboard, SHA-256 password hashing and session login.'],
  [['study', 'education', 'university', 'semester', 'course', 'degree'], 'Zamin is a 4th-semester BS Artificial Intelligence student at Superior University, Lahore. Now studying Machine Learning (with lab), DSA, SQL databases, Linear Algebra and AI Programming.'],
  [['certif', 'cisco'], 'He holds two Cisco Networking Academy certifications from May 2026: Data Science Essentials with Python and Introduction to Modern AI.'],
  [['hire', 'job', 'intern', 'available', 'role'], 'He is open to internships and junior roles in AI, automation or development.'],
  [['contact', 'email', 'phone', 'reach', 'linkedin', 'github'], 'Email zaminafzal8@gmail.com, phone 0304-4277292, GitHub zaminaliafzal-oss, LinkedIn zamin-ali-afzal.'],
  [['hello', 'hi', 'hey', 'salam'], 'Hi! Ask me about Zamin\'s skills, projects, studies or how to contact him.']
];
const msgs = $('#msgs');
const say = (t, who) => { const d = document.createElement('div'); d.className = 'm ' + who; d.textContent = t; msgs.append(d); msgs.scrollTop = msgs.scrollHeight; return d; };
const answer = q => { q = q.toLowerCase(); const hit = KB.find(([k]) => k.some(w => q.includes(w))); return hit ? hit[1] : 'I can answer questions about Zamin\'s skills, projects, studies, certifications and contact details. Try one of the suggestions below.'; };
const ask = q => {
  if (!q.trim()) return;
  say(q, 'me');
  const d = say('...', 'bot');
  setTimeout(() => d.textContent = answer(q), reduce ? 0 : 600);
};
['Skills', 'Projects', 'Studies', 'Hire Zamin', 'Contact'].forEach(s => {
  const b = document.createElement('button'); b.textContent = s;
  b.onclick = () => ask(s === 'Hire Zamin' ? 'hire' : s); $('#sugg').append(b);
});
const open = v => { $('#chat').hidden = !v; if (v && !msgs.children.length) say('Hi! I\'m Zamin\'s AI assistant. What would you like to know?', 'bot'); if (v) $('#q').focus(); };
$('#fab').onclick = () => open($('#chat').hidden);
$('#askOpen').onclick = () => open(true);
$('#close').onclick = () => open(false);
$('#form').onsubmit = e => { e.preventDefault(); ask($('#q').value); $('#q').value = ''; };
