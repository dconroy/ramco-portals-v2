// ── STATE ────────────────────────────────────────────────────────────────────
let currentPage = 'dashboard';
let cart = [];
let votedElections = new Set();
let paidInvoices = new Set();

// ── WIDGET STORAGE ────────────────────────────────────────────────────────────
const WIDGETS_KEY = 'ra_portal_widgets';

function loadWidgets() {
  try { return JSON.parse(localStorage.getItem(WIDGETS_KEY)) || []; }
  catch(e) { return []; }
}
function saveWidgets(widgets) {
  localStorage.setItem(WIDGETS_KEY, JSON.stringify(widgets));
}
function deleteWidget(idx) {
  const widgets = loadWidgets();
  widgets.splice(idx, 1);
  saveWidgets(widgets);
  navigate('dashboard');
}

const WIDGET_SNIPPETS = [
  {
    label: 'YouTube video',
    html: '<iframe width="100%" height="160" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen style="border-radius:8px"></iframe>'
  },
  {
    label: 'Announcement banner',
    html: '<div style="background:#dbeafe;border:1px solid #93c5fd;border-radius:8px;padding:12px 14px;font-size:.84rem;line-height:1.5"><strong>📢 Board Announcement</strong><br>Edit this text to share news with your members.</div>'
  },
  {
    label: 'External link card',
    html: '<div style="border:1px solid #e2e8f0;border-radius:8px;padding:14px"><p style="font-size:.84rem;font-weight:600;margin-bottom:6px">🔗 Quick Link</p><a href="https://www.nar.realtor" target="_blank" style="font-size:.8rem;color:#1d4ed8">Visit NAR.realtor →</a></div>'
  },
  {
    label: 'Simple HTML notice',
    html: '<div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:8px;padding:12px 14px;font-size:.84rem">✅ <strong>Dues deadline approaching</strong> — renew by <strong>March 30</strong> to avoid a late fee.</div>'
  },
];

function openWidgetEditor(editIdx = null) {
  const widgets = loadWidgets();
  const editing = editIdx !== null ? widgets[editIdx] : null;

  const snippetButtons = WIDGET_SNIPPETS.map((s, i) =>
    `<button class="btn btn-secondary btn-xs" style="margin:2px" onclick="insertSnippet(${i})">${s.label}</button>`
  ).join('');

  showModal(`
    <h3>${editing ? 'Edit Widget' : 'Add Custom Widget'}</h3>
    <p class="modal-sub">Paste any HTML, iframe embed, or JavaScript snippet.</p>

    <div style="margin-bottom:12px">
      <label style="font-size:.78rem;font-weight:600;color:var(--muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Widget Title</label>
      <input id="widget-title" type="text" placeholder="e.g. Market Statistics, Board News..."
        value="${editing ? editing.title.replace(/"/g, '&quot;') : ''}"
        style="width:100%;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:.88rem;font-family:Inter,sans-serif;outline:none;color:var(--text)">
    </div>

    <div style="margin-bottom:8px">
      <label style="font-size:.78rem;font-weight:600;color:var(--muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">HTML / Embed Code</label>
      <textarea id="widget-html" rows="6" placeholder="Paste HTML, an iframe embed, or a script tag here..."
        style="width:100%;border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:.82rem;font-family:monospace;outline:none;resize:vertical;color:var(--text)">${editing ? editing.html.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</textarea>
    </div>

    <div style="margin-bottom:14px">
      <div style="font-size:.72rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:6px">Quick snippets</div>
      <div>${snippetButtons}</div>
    </div>

    <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--bg);min-height:60px;margin-bottom:4px">
      <div style="font-size:.7rem;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Preview</div>
      <div id="widget-preview"></div>
    </div>
    <div style="font-size:.7rem;color:var(--muted);margin-bottom:4px">
      <button onclick="previewWidget()" class="btn btn-secondary btn-xs">Refresh Preview</button>
    </div>

    <div class="modal-footer">
      ${editing ? `<button class="btn btn-danger btn-sm" onclick="deleteWidget(${editIdx});closeModal()">Delete</button>` : ''}
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveWidget(${editIdx !== null ? editIdx : 'null'})">
        ${editing ? 'Save Changes' : 'Add Widget'}
      </button>
    </div>`);
}

function insertSnippet(idx) {
  const ta = document.getElementById('widget-html');
  if (!ta) return;
  ta.value = WIDGET_SNIPPETS[idx].html;
  if (!document.getElementById('widget-title').value)
    document.getElementById('widget-title').value = WIDGET_SNIPPETS[idx].label;
  previewWidget();
}

function previewWidget() {
  const html = document.getElementById('widget-html')?.value || '';
  const preview = document.getElementById('widget-preview');
  if (preview) preview.innerHTML = html;
}

function saveWidget(editIdx) {
  const title = (document.getElementById('widget-title')?.value || '').trim();
  const html  = (document.getElementById('widget-html')?.value  || '').trim();
  if (!title) { showToast('Please enter a widget title'); return; }
  if (!html)  { showToast('Please enter some HTML content'); return; }

  const widgets = loadWidgets();
  if (editIdx !== null && editIdx !== undefined) {
    widgets[editIdx] = { title, html };
  } else {
    widgets.push({ title, html });
  }
  saveWidgets(widgets);
  closeModal();
  navigate('dashboard');
  showToast(`✓ Widget "${title}" saved`);
}

// ── NAV CONFIG ────────────────────────────────────────────────────────────────
const NAV = [
  { group: 'Overview' },
  { id:'dashboard',  icon:'🏠', label:'Dashboard' },
  { group: 'Participation' },
  { id:'calendar',   icon:'📅', label:'Calendar of Events' },
  { id:'courses',    icon:'🎓', label:'Course List',     badge:'2',    badgeClass:'info' },
  { id:'meetings',   icon:'📋', label:'Meeting List',    badge:'!',    badgeClass:'' },
  { id:'committees', icon:'🏛️', label:'Committees' },
  { id:'elections',  icon:'🗳️', label:'Elections',       badge:'Vote', badgeClass:'' },
  { id:'contribute', icon:'💚', label:'Contribute' },
  { group: 'Account' },
  { id:'directory',  icon:'👥', label:'Member Directory' },
  { id:'billing',    icon:'💳', label:'Billing',         badge:'$79',  badgeClass:'warn' },
  { id:'store',      icon:'🛍️', label:'Online Store' },
  { id:'resources',  icon:'🔗', label:'Resources & SSO' },
];

const PAGE_META = {
  dashboard:  { title:'Dashboard',            sub:'Welcome back, Jordan' },
  calendar:   { title:'Calendar of Events',   sub:'March 2026' },
  courses:    { title:'Course List',          sub:'Continuing education & certifications' },
  meetings:   { title:'Meeting List',         sub:'Committee & governance meetings' },
  directory:  { title:'Member Directory',     sub:'4,200+ active members' },
  contribute: { title:'Contribute',           sub:'RPAC & advocacy fund' },
  committees: { title:'Committees',           sub:'Your memberships & applications' },
  billing:    { title:'Billing',              sub:'Invoices & payment methods' },
  elections:  { title:'Elections',            sub:'Voting open through March 21' },
  store:      { title:'Online Store',         sub:'Forms, toolkits & resources' },
  resources:  { title:'Resources & SSO',      sub:'Integrated services & single sign-on' },
};

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function navigate(pageId) {
  currentPage = pageId;
  const meta = PAGE_META[pageId] || {};
  document.getElementById('topbar-title').textContent = meta.title || pageId;
  document.getElementById('topbar-sub').textContent   = meta.sub   || '';
  document.getElementById('main-content').innerHTML   = (Pages[pageId] || Pages.dashboard)();
  renderNav();
  if (PageInit[pageId]) PageInit[pageId]();
  closeSidebar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderNav() {
  let html = '';
  NAV.forEach(item => {
    if (item.group) {
      html += `<div class="nav-group-label">${item.group}</div>`;
    } else {
      const active = currentPage === item.id ? ' active' : '';
      const badge  = item.badge ? `<span class="nav-badge ${item.badgeClass||''}" id="nav-badge-${item.id}">${item.badge}</span>` : '';
      html += `<button class="nav-item${active}" onclick="navigate('${item.id}')">
        <span class="nav-icon">${item.icon}</span> ${item.label}${badge}
      </button>`;
    }
  });
  document.getElementById('nav-items').innerHTML = html;
}

// ── MOBILE SIDEBAR ────────────────────────────────────────────────────────────
function openSidebar()  { document.getElementById('sidebar').classList.add('open'); document.getElementById('overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('open'); document.body.style.overflow = ''; }

// ── MODAL ─────────────────────────────────────────────────────────────────────
function showModal(html) {
  document.getElementById('modal-box').innerHTML = html;
  document.getElementById('modal-backdrop').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-backdrop').classList.remove('open');
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ── TABS ──────────────────────────────────────────────────────────────────────
function switchTab(btn, group, tabId) {
  const wrap = btn.closest('[data-tabgroup]') || document.getElementById('main-content');
  wrap.querySelectorAll(`.tab-btn[data-group="${group}"]`).forEach(b => b.classList.remove('active'));
  wrap.querySelectorAll(`.tab-panel[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = wrap.querySelector(`.tab-panel[data-group="${group}"][data-tab="${tabId}"]`);
  if (panel) panel.classList.add('active');
}

// ── CART ──────────────────────────────────────────────────────────────────────
function addToCart(productId) {
  const product = DATA.products.find(p => p.id === productId);
  if (!product) return;
  cart.push({ ...product });
  updateCartBadge();
  showToast(`"${product.name}" added to cart (${cart.length} item${cart.length > 1 ? 's' : ''})`);
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  updateCartBadge();
  // Refresh cart modal if open
  const box = document.getElementById('modal-box');
  if (box && box.querySelector('.cart-item')) openCart();
}

function updateCartBadge() {
  const el = document.getElementById('cart-count-badge');
  if (el) { el.textContent = cart.length; el.style.display = cart.length ? 'inline-flex' : 'none'; }
}

function openCart() {
  const items = cart.map((p, i) => `
    <div class="cart-item">
      <span class="cart-item-icon">${p.icon}</span>
      <div class="cart-item-info">
        <strong>${p.name}</strong>
        <span>${p.priceText}</span>
      </div>
      <span class="cart-item-price">${p.priceText}</span>
      <button class="btn btn-danger btn-xs" onclick="removeFromCart(${i})">Remove</button>
    </div>`).join('');

  const total = cart.reduce((s, p) => s + p.price, 0);
  const totalStr = total > 0 ? `$${total}` : 'Free';

  showModal(`
    <h3>🛍️ Your Cart</h3>
    <p class="modal-sub">${cart.length} item${cart.length !== 1 ? 's' : ''}</p>
    ${cart.length ? items + `<div class="cart-total"><span>Total</span><span>${totalStr}</span></div>` : '<p class="text-sm text-muted">Your cart is empty.</p>'}
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Continue Shopping</button>
      ${cart.length ? `<button class="btn btn-primary" onclick="checkout()">Checkout →</button>` : ''}
    </div>`);
}

function checkout() {
  cart = [];
  updateCartBadge();
  closeModal();
  showToast('✓ Order placed — confirmation sent to your email');
}

// ── MEMBER PROFILE ────────────────────────────────────────────────────────────
function openMemberProfile(memberId) {
  const m = DATA.members.find(x => x.id === memberId);
  if (!m) return;
  showModal(`
    <div class="flex-row" style="margin-bottom:18px;gap:16px;">
      <div style="width:60px;height:60px;border-radius:50%;background:${m.color};color:#fff;display:grid;place-items:center;font-size:20px;font-weight:700;flex-shrink:0;">${m.initials}</div>
      <div>
        <h3 style="margin-bottom:2px;">${m.name}</h3>
        <div class="text-sm text-muted">${m.designation} &bull; ${m.specialty}</div>
        <div class="text-xs text-primary mt-4" style="font-weight:600;">District ${m.district} &bull; NRDS# ${m.nrds} &bull; Member since ${m.memberSince}</div>
      </div>
    </div>
    <p class="text-sm" style="line-height:1.65;color:var(--text-2);margin-bottom:16px;">${m.bio}</p>
    <div class="grid-2" style="margin-bottom:16px;">
      <div>
        <div class="text-xs text-muted font-700" style="text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Contact</div>
        <div class="text-sm mb-12"><a href="mailto:${m.email}" style="color:var(--primary)">${m.email}</a></div>
        <div class="text-sm">${m.phone}</div>
      </div>
      <div>
        <div class="text-xs text-muted font-700" style="text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Committees</div>
        ${m.committees.map(c => `<div class="text-sm mb-12">${c}</div>`).join('')}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      <a href="mailto:${m.email}" class="btn btn-primary">Send Email</a>
    </div>`);
}

// ── PAY INVOICE ───────────────────────────────────────────────────────────────
function openPayModal(invoiceId) {
  const inv = DATA.invoices.find(i => i.id === invoiceId);
  if (!inv) return;
  showModal(`
    <h3>Pay Invoice ${inv.num}</h3>
    <p class="modal-sub">${inv.desc}</p>
    <div style="background:var(--bg);border-radius:9px;padding:14px;margin-bottom:14px;">
      <div class="flex-between text-sm mb-12"><span>${inv.desc}</span><strong>$${inv.amount}.00</strong></div>
      <div class="flex-between text-xs text-muted"><span>Payment method</span><span>ACH ending 0402 (default)</span></div>
    </div>
    <p class="text-sm text-muted">You authorize a one-time payment of $${inv.amount}.00 from your ACH account ending 0402.</p>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmPayment('${invoiceId}')">Confirm Payment →</button>
    </div>`);
}

function confirmPayment(invoiceId) {
  paidInvoices.add(invoiceId);
  closeModal();
  showToast('✓ Payment confirmed — receipt sent to your email');
  // Remove billing badge
  const badge = document.getElementById('nav-badge-billing');
  if (badge) badge.style.display = 'none';
  // If on billing page, re-render
  if (currentPage === 'billing') navigate('billing');
}

// ── VOTE ──────────────────────────────────────────────────────────────────────
function openVoteModal(electionId) {
  const el = DATA.elections.find(e => e.id === electionId);
  if (!el) return;
  if (votedElections.has(electionId)) { showToast('You have already voted in this election'); return; }
  const inputs = el.candidates.map(c => `
    <div class="modal-radio">
      <label>
        <input type="${el.multi ? 'checkbox' : 'radio'}" name="vote-${electionId}" value="${c.id}">
        <div>
          <div class="cand-name">${c.name}</div>
          <div class="cand-bio">${c.bio}</div>
        </div>
      </label>
    </div>`).join('');
  showModal(`
    <h3>Vote: ${el.title}</h3>
    <p class="modal-sub">${el.subtitle} &bull; Closes March 21, 2026</p>
    <div id="vote-inputs">${inputs}</div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="submitVote('${electionId}')">Submit Vote →</button>
    </div>`);
}

function submitVote(electionId) {
  const el = DATA.elections.find(e => e.id === electionId);
  const chosen = [...document.querySelectorAll(`input[name="vote-${electionId}"]:checked`)];
  if (!chosen.length) { showToast('Please make a selection first'); return; }
  votedElections.add(electionId);
  closeModal();
  showToast('✓ Your vote has been submitted securely');
  if (votedElections.size >= DATA.elections.length) {
    const badge = document.getElementById('nav-badge-elections');
    if (badge) badge.textContent = '✓';
  }
  if (currentPage === 'elections') navigate('elections');
}

// ── CALENDAR FILTER ───────────────────────────────────────────────────────────
function filterEvents(btn, type) {
  document.querySelectorAll('#events-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#events-list .event-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type || (type === 'registered' && card.dataset.registered)) ? '' : 'none';
  });
}

// ── DIRECTORY SEARCH ──────────────────────────────────────────────────────────
function filterDirectory(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('#member-grid .member-card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

// ── PAGE POST-RENDER HOOKS ────────────────────────────────────────────────────
const PageInit = {
  store() {
    updateCartBadge();
  },
  directory() {
    const inp = document.getElementById('dir-search');
    if (inp) inp.addEventListener('input', e => filterDirectory(e.target.value));
  },
};

// ── PAGE RENDERERS ────────────────────────────────────────────────────────────
const Pages = {

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  dashboard() {
    const activity = DATA.activity.map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${a.dot}"></div>
        <div class="activity-body"><p>${a.text}</p><span>${a.sub}</span></div>
        <span class="activity-time">${a.time}</span>
      </div>`).join('');

    const ceProgress = DATA.courses.inProgress.map(c => `
      <div class="progress-wrap">
        <div class="progress-meta"><span>${c.title}</span><strong>${c.pct}%</strong></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${c.pct}%"></div></div>
        <div class="progress-sub">Deadline: ${c.deadline} &bull; ${c.module}</div>
      </div>`).join('');

    return `
      <div class="page-header">
        <h2>Good morning, Jordan &#128075;</h2>
        <p>Monday, March 2, 2026 &bull; You have <strong>4 action items</strong> requiring attention.</p>
      </div>
      <div class="stats-row">
        <div class="stat-card success"><div class="stat-label">Membership</div><div class="stat-value success">Active</div><div class="stat-sub">REALTOR&reg; &bull; Dist. 4 &bull; Since 2018</div></div>
        <div class="stat-card danger"><div class="stat-label">Balance Due</div><div class="stat-value danger">$79</div><div class="stat-sub">Invoice #5021 &bull; Due Mar 30</div></div>
        <div class="stat-card warn"><div class="stat-label">CE Credits</div><div class="stat-value warn">10 / 14</div><div class="stat-sub">4 remaining &bull; Deadline Jun 30</div></div>
        <div class="stat-card"><div class="stat-label">Open Actions</div><div class="stat-value">4</div><div class="stat-sub">RSVP, vote, invoice, CE module</div></div>
      </div>
      <div class="card-title" style="margin-bottom:12px;">Quick Launch</div>
      <div class="tile-grid section-gap">
        <div class="tile" onclick="navigate('calendar')"><div class="tile-icon">📅</div><div class="tile-label">Calendar</div><div class="tile-sub">8 events in March</div><span class="tile-badge info">3 open</span></div>
        <div class="tile" onclick="navigate('courses')"><div class="tile-icon">🎓</div><div class="tile-label">My Courses</div><div class="tile-sub">2 in progress</div><span class="tile-badge info">2 active</span></div>
        <div class="tile" onclick="navigate('meetings')"><div class="tile-icon">📋</div><div class="tile-label">Meetings</div><div class="tile-sub">1 RSVP overdue</div><span class="tile-badge action">Overdue</span></div>
        <div class="tile" onclick="navigate('directory')"><div class="tile-icon">👥</div><div class="tile-label">Directory</div><div class="tile-sub">4,200+ members</div><span class="tile-badge neutral">Search</span></div>
        <div class="tile" onclick="navigate('contribute')"><div class="tile-icon">💚</div><div class="tile-label">Contribute</div><div class="tile-sub">50% of RPAC goal</div><span class="tile-badge warn">50%</span></div>
        <div class="tile" onclick="navigate('committees')"><div class="tile-icon">🏛️</div><div class="tile-label">Committees</div><div class="tile-sub">2 active memberships</div><span class="tile-badge ok">Active</span></div>
        <div class="tile" onclick="navigate('billing')"><div class="tile-icon">💳</div><div class="tile-label">Billing</div><div class="tile-sub">1 invoice outstanding</div><span class="tile-badge action">$79 due</span></div>
        <div class="tile" onclick="navigate('elections')"><div class="tile-icon">🗳️</div><div class="tile-label">Elections</div><div class="tile-sub">Voting open Mar 21</div><span class="tile-badge action">Vote now</span></div>
        <div class="tile" onclick="navigate('store')"><div class="tile-icon">🛍️</div><div class="tile-label">Online Store</div><div class="tile-sub">Forms &amp; toolkits</div><span class="tile-badge neutral">Browse</span></div>
        <div class="tile" onclick="navigate('resources')"><div class="tile-icon">🔗</div><div class="tile-label">Resources &amp; SSO</div><div class="tile-sub">MLS, zipForm, DotLoop...</div><span class="tile-badge ok">6 links</span></div>
      </div>
      <div class="grid-2 section-gap">
        <div class="card"><div class="card-title">Recent Activity <a href="#" onclick="return false">View all</a></div>${activity}</div>
        <div class="card">
          <div class="card-title">CE Progress <a href="#" onclick="navigate('courses');return false">My Courses</a></div>
          ${ceProgress}
          <div class="mt-12"><button class="btn btn-primary btn-sm" onclick="navigate('courses')">Continue Learning &rarr;</button></div>
        </div>
      </div>
      <div class="card section-gap">
        <div class="card-title">Integrated Services <a href="#" onclick="navigate('resources');return false">All resources</a></div>
        <div class="tile-grid" style="grid-template-columns:repeat(4,minmax(0,1fr));margin-bottom:0">
          ${DATA.ssoServices.slice(0,4).map(s => `<div class="tile" onclick="navigate('resources')"><div class="tile-icon">${s.icon}</div><div class="tile-label">${s.name.split('—')[0].trim()}</div></div>`).join('')}
        </div>
      </div>
      <div class="card-title" style="margin-bottom:12px;margin-top:22px;">Board Content <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:.78rem;color:var(--muted)">&mdash; Boards can embed custom HTML, JS, or iframes below</span></div>
      <div class="widget-grid">
        <div class="widget-card">
          <div class="card-title" style="margin-bottom:8px;">Market Statistics</div>
          <div style="font-size:.76rem;color:var(--muted);margin-bottom:4px">Active listings (Nov–Mar)</div>
          <div class="mini-chart"><div class="bar" style="height:30%"></div><div class="bar" style="height:55%"></div><div class="bar" style="height:45%"></div><div class="bar hi" style="height:80%"></div><div class="bar hi" style="height:70%"></div></div>
          <div class="chart-labels"><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span></div>
          <div style="font-size:.7rem;color:var(--muted);margin-top:6px;font-style:italic">Replace with your market data embed</div>
        </div>
        <div class="widget-card">
          <div class="card-title" style="margin-bottom:10px;">Board News</div>
          <div class="activity-item" style="padding:7px 0"><div class="activity-body"><p><strong>2026 Legislative Priorities Released</strong></p><span>Feb 28 &bull; Government Affairs</span></div></div>
          <div class="activity-item" style="padding:7px 0"><div class="activity-body"><p><strong>New forms library update live</strong></p><span>Feb 22 &bull; Education</span></div></div>
          <div class="activity-item" style="padding:7px 0"><div class="activity-body"><p><strong>Member appreciation event &mdash; Apr 4</strong></p><span>Feb 15 &bull; Events</span></div></div>
        </div>
        ${loadWidgets().map((w, i) => `
        <div class="widget-card" style="position:relative">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
            <div class="card-title" style="margin:0">${w.title}</div>
            <button onclick="openWidgetEditor(${i})" style="background:none;border:none;cursor:pointer;font-size:.7rem;color:var(--muted);padding:2px 6px;border-radius:4px;line-height:1" title="Edit widget">Edit</button>
          </div>
          ${w.html}
        </div>`).join('')}
        <div class="widget-add-card" onclick="openWidgetEditor()">
          <div style="font-size:24px;color:var(--muted)">+</div>
          <div style="font-size:.82rem;font-weight:600;color:var(--muted)">Add Custom Widget</div>
          <div style="font-size:.74rem;color:#cbd5e1;text-align:center">Paste HTML, an iframe, or<br>any embed code here.</div>
        </div>
      </div>`;
  },

  // ── CALENDAR ───────────────────────────────────────────────────────────────
  calendar() {
    const cards = DATA.events.map(e => {
      const reg = e.badgeText.includes('Registered') ? 'data-registered="1"' : '';
      return `<div class="event-card ${e.border}" data-type="${e.type}" ${reg}>
        <div class="event-date"><span class="day">${e.day}</span><span class="mo">${e.mo}</span></div>
        <div class="event-info">
          <strong>${e.title}${e.credits ? ` <span class="badge badge-blue">${e.credits}</span>` : ''}</strong>
          <div class="meta">${e.location}</div>
        </div>
        <div class="event-actions">
          <span class="badge ${e.badge}">${e.badgeText}</span>
          <button class="btn ${e.btn} btn-sm" onclick="showToast('${e.btnText}: ${e.title}')">${e.btnText}</button>
        </div>
      </div>`;
    }).join('');

    return `
      <div class="page-header flex-between">
        <div><h2>Calendar of Events</h2><p>March 2026 &bull; 8 upcoming events</p></div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Full events catalog would open here')">+ Browse all events</button>
      </div>
      <div class="filter-tabs" id="events-filter">
        <button class="filter-btn active"  onclick="filterEvents(this,'all')">All Events</button>
        <button class="filter-btn"         onclick="filterEvents(this,'registered')">Registered</button>
        <button class="filter-btn"         onclick="filterEvents(this,'meeting')">Meetings</button>
        <button class="filter-btn"         onclick="filterEvents(this,'education')">Education</button>
      </div>
      <div id="events-list">${cards}</div>`;
  },

  // ── COURSES ────────────────────────────────────────────────────────────────
  courses() {
    const inProg = DATA.courses.inProgress.map(c => `
      <div class="course-card">
        <div class="course-head">
          <div><div class="course-title">${c.title}</div><div class="course-meta">${c.credits} CE credits &bull; Deadline: ${c.deadline} &bull; ${c.module}</div></div>
          <span class="badge badge-amber">${c.pct}% Complete</span>
        </div>
        <div class="progress-bar mb-12"><div class="progress-fill" style="width:${c.pct}%"></div></div>
        <div class="flex-row">
          <button class="btn btn-primary btn-sm" onclick="showToast('Launching: ${c.title}')">Continue &rarr;</button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Opening course details')">Course Details</button>
          <span class="text-xs text-muted">Last activity: ${c.lastActivity}</span>
        </div>
      </div>`).join('');

    const avail = DATA.courses.available.map(c => `
      <div class="course-card">
        <div class="course-head">
          <div><div class="course-title">${c.title}</div><div class="course-meta">${c.credits} CE credits &bull; ${c.format} &bull; ${c.price}</div></div>
          <button class="btn ${c.price === 'Free' || c.price === 'Included' ? 'btn-success' : 'btn-primary'} btn-sm" onclick="showToast('Enrolling in: ${c.title}')">
            ${c.price === 'Free' || c.price === 'Included' ? 'Enroll Free' : 'Enroll — ' + c.price}
          </button>
        </div>
      </div>`).join('');

    const completed = DATA.courses.completed.map(c => `
      <tr><td><strong>${c.title}</strong></td><td>${c.date}</td>
      <td><span class="badge badge-green">${c.credits} credits</span></td>
      <td><button class="btn btn-secondary btn-xs" onclick="showToast('Downloading certificate...')">Download</button></td></tr>`).join('');

    const certs = DATA.courses.completed.map(c => `
      <div class="card flex-row">
        <div style="font-size:32px">🎓</div>
        <div style="flex:1"><div class="font-700">${c.title}</div><div class="text-xs text-muted mt-4">Earned ${c.date} &bull; ${c.credits} CE credits</div></div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Downloading PDF certificate...')">Download PDF</button>
      </div>`).join('');

    return `
      <div class="page-header flex-between">
        <div><h2>Course List</h2><p>Continuing education, certifications &amp; training</p></div>
        <span class="badge badge-blue" style="font-size:.82rem;padding:6px 12px;">10 / 14 CE credits earned</span>
      </div>
      <div class="tabs" data-tabgroup="courses">
        <button class="tab-btn active" data-group="courses" onclick="switchTab(this,'courses','in-progress')">In Progress</button>
        <button class="tab-btn" data-group="courses" onclick="switchTab(this,'courses','available')">Available Courses</button>
        <button class="tab-btn" data-group="courses" onclick="switchTab(this,'courses','completed')">Completed</button>
        <button class="tab-btn" data-group="courses" onclick="switchTab(this,'courses','certificates')">My Certificates</button>
      </div>
      <div data-tabgroup="courses">
        <div class="tab-panel active" data-group="courses" data-tab="in-progress">${inProg}</div>
        <div class="tab-panel" data-group="courses" data-tab="available">${avail}</div>
        <div class="tab-panel" data-group="courses" data-tab="completed">
          <div class="table-wrap"><table><thead><tr><th>Course</th><th>Completed</th><th>CE Credits</th><th>Certificate</th></tr></thead><tbody>${completed}</tbody></table></div>
        </div>
        <div class="tab-panel" data-group="courses" data-tab="certificates"><div class="grid-2">${certs}</div></div>
      </div>`;
  },

  // ── MEETINGS ───────────────────────────────────────────────────────────────
  meetings() {
    const rows = DATA.meetings.map(m => `
      <tr>
        <td>${m.date}</td>
        <td><strong>${m.title}</strong><br><span class="text-xs text-muted">${m.location}</span></td>
        <td>${m.committee}</td>
        <td>${m.role}</td>
        <td><span class="badge ${m.status}">${m.statusText}</span></td>
        <td><button class="btn ${m.btnClass} btn-xs" onclick="showToast('${m.btnText}: ${m.title}')">${m.btnText}</button></td>
      </tr>`).join('');

    const myMeetings = DATA.meetings.filter(m => m.statusText === 'Confirmed' || m.statusText === 'RSVP Overdue').map(m => `
      <div class="meeting-row">
        <div class="meeting-dot" style="background:${m.dot}"></div>
        <div class="meeting-info"><strong>${m.title}</strong><span>${m.date} &bull; ${m.location}</span></div>
        <span class="badge ${m.status}">${m.statusText}</span>
      </div>`).join('');

    return `
      <div class="page-header"><h2>Meeting List</h2><p>Upcoming committee &amp; governance meetings</p></div>
      <div class="tabs" data-tabgroup="meetings">
        <button class="tab-btn active" data-group="meetings" onclick="switchTab(this,'meetings','upcoming')">Upcoming</button>
        <button class="tab-btn" data-group="meetings" onclick="switchTab(this,'meetings','my')">My Meetings</button>
        <button class="tab-btn" data-group="meetings" onclick="switchTab(this,'meetings','all')">All Meetings</button>
      </div>
      <div data-tabgroup="meetings">
        <div class="tab-panel active" data-group="meetings" data-tab="upcoming">
          <div class="table-wrap"><table>
            <thead><tr><th>Date</th><th>Meeting</th><th>Committee</th><th>My Role</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </div>
        <div class="tab-panel" data-group="meetings" data-tab="my">
          <div class="card"><div class="card-title">My Confirmed &amp; Pending Meetings</div>${myMeetings || '<p class="text-sm text-muted">No confirmed meetings yet.</p>'}</div>
        </div>
        <div class="tab-panel" data-group="meetings" data-tab="all">
          <div class="card"><div class="card-title">All Meetings — March 2026</div>
            ${DATA.meetings.map(m => `<div class="meeting-row"><div class="meeting-dot" style="background:${m.dot}"></div><div class="meeting-info"><strong>${m.title}</strong><span>${m.date} &bull; ${m.committee}</span></div></div>`).join('')}
          </div>
        </div>
      </div>`;
  },

  // ── DIRECTORY ──────────────────────────────────────────────────────────────
  directory() {
    const cards = DATA.members.map(m => `
      <div class="member-card">
        <div class="member-avatar" style="background:${m.color}">${m.initials}</div>
        <div class="member-name">${m.name}</div>
        <div class="member-role">${m.designation} &bull; ${m.specialty}</div>
        <div class="member-district">District ${m.district}</div>
        <button class="btn btn-secondary btn-sm mt-8" style="width:100%" onclick="openMemberProfile('${m.id}')">View Profile</button>
      </div>`).join('');

    return `
      <div class="page-header flex-between">
        <div><h2>Member Directory</h2><p>4,200+ active members across 6 districts</p></div>
      </div>
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" id="dir-search" placeholder="Search by name, specialty, or district…">
      </div>
      <div class="filter-tabs">
        <button class="filter-btn active">All Members</button>
        <button class="filter-btn" onclick="showToast('Filtering to your district...')">My District</button>
        <button class="filter-btn" onclick="showToast('Filtering brokers...')">Brokers</button>
        <button class="filter-btn" onclick="showToast('Filtering affiliates...')">Affiliates</button>
      </div>
      <div class="member-grid" id="member-grid">${cards}</div>`;
  },
};

// (continuing Pages object — contribute, committees, billing, elections, store, resources)
Object.assign(Pages, {

  // ── CONTRIBUTE ─────────────────────────────────────────────────────────────
  contribute() {
    const history = DATA.contributions.map(c => `
      <tr><td>${c.date}</td><td><strong>${c.amount}</strong></td><td>${c.campaign}</td>
      <td><button class="btn btn-secondary btn-xs" onclick="showToast('Downloading receipt...')">Download</button></td></tr>`).join('');

    return `
      <div class="page-header"><h2>Contribute</h2><p>RPAC and advocacy fund contributions</p></div>
      <div class="grid-2 section-gap">
        <div class="card">
          <div class="card-title">2026 RPAC Pledge</div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary)">$150</div>
          <div class="text-sm text-muted mt-4">of $300 annual pledge &bull; 50% complete</div>
          <div class="pledge-bar-wrap"><div class="pledge-bar-fill" style="width:50%"></div></div>
          <div class="flex-row mt-8">
            <button class="btn btn-primary" onclick="showToast('Redirecting to secure contribution page...')">Make a Contribution</button>
            <button class="btn btn-secondary btn-sm" onclick="showToast('Update pledge form opened')">Update Pledge</button>
          </div>
        </div>
        <div class="card">
          <div class="card-title">Chapter Goal</div>
          <p class="text-sm" style="line-height:1.6;color:var(--text-2)">Your RPAC contributions directly fund state and local advocacy campaigns protecting homeowners and real estate professionals. The chapter is currently <strong>83% of its $25,000 chapter goal</strong>.</p>
          <div class="mt-12">
            <div class="flex-between text-xs text-muted mb-12"><span>Chapter goal 2026</span><span>$20,750 / $25,000</span></div>
            <div class="pledge-bar-wrap"><div class="pledge-bar-fill" style="width:83%"></div></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Contribution History</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Date</th><th>Amount</th><th>Campaign</th><th>Receipt</th></tr></thead>
          <tbody>${history}</tbody>
        </table></div>
      </div>`;
  },

  // ── COMMITTEES ─────────────────────────────────────────────────────────────
  committees() {
    const myRows = [
      { name:'Government Affairs',    role:'Member',     next:'Mar 6 &bull; Zoom',                 status:'badge-green', statusText:'Active' },
      { name:'Education Advisory Board', role:'<strong>Vice Chair</strong>', next:'Mar 11 &bull; Assoc. Office', status:'badge-green', statusText:'Active' },
      { name:'Community Outreach',    role:'Member',     next:'Mar 22 &bull; Zoom',                status:'badge-green', statusText:'Active' },
    ].map(r => `<tr><td><strong>${r.name}</strong></td><td>${r.role}</td><td>${r.next}</td><td><span class="badge ${r.status}">${r.statusText}</span></td><td><button class="btn btn-secondary btn-xs" onclick="showToast('Opening committee details')">Details</button></td></tr>`).join('');

    const openComm = [
      { name:'Professional Standards',    desc:'Reviews member ethics cases and Code of Ethics complaints.' },
      { name:'Risk Management Council',   desc:'Advises on member risk, liability, and industry standards.' },
      { name:'Young Professionals Network', desc:'Supports members in their first 5 years in the industry.' },
      { name:'Commercial Real Estate',    desc:'Focuses on commercial market trends and advocacy.' },
    ].map(c => `
      <div class="card" style="background:var(--bg)">
        <div class="font-700">${c.name}</div>
        <div class="text-xs text-muted mt-4">${c.desc}</div>
        <button class="btn btn-primary btn-sm mt-8" onclick="showToast('Application submitted for: ${c.name}')">Apply</button>
      </div>`).join('');

    return `
      <div class="page-header"><h2>Committees</h2><p>Your active memberships and open applications</p></div>
      <div class="card section-gap">
        <div class="card-title">My Active Committees</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Committee</th><th>Role</th><th>Next Meeting</th><th>Status</th><th></th></tr></thead>
          <tbody>${myRows}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-title">Apply for a Committee <span style="font-weight:400;text-transform:none;letter-spacing:0;font-size:.78rem;color:var(--muted)">&mdash; Applications open through Jun 30</span></div>
        <div class="grid-2">${openComm}</div>
      </div>`;
  },

  // ── BILLING ────────────────────────────────────────────────────────────────
  billing() {
    const rows = DATA.invoices.map(inv => {
      const isPaid = paidInvoices.has(inv.id) || inv.paid;
      return `<tr>
        <td><strong>${inv.num}</strong></td>
        <td>${inv.desc}</td>
        <td><strong>$${inv.amount}.00</strong></td>
        <td>${inv.due}</td>
        <td>${isPaid ? '<span class="badge badge-green">Paid</span>' : '<span class="badge badge-red">Unpaid</span>'}</td>
        <td>${isPaid
          ? '<button class="btn btn-secondary btn-xs" onclick="showToast(\'Downloading receipt...\')">Receipt</button>'
          : `<button class="btn btn-primary btn-xs" onclick="openPayModal('${inv.id}')">Pay Now</button>`
        }</td>
      </tr>`;
    }).join('');

    const hasUnpaid = DATA.invoices.some(i => !paidInvoices.has(i.id) && !i.paid);

    return `
      <div class="page-header flex-between">
        <div><h2>Billing</h2><p>Invoices, payment history &amp; payment methods</p></div>
        ${hasUnpaid ? '<span class="badge badge-red" style="font-size:.84rem;padding:7px 14px;">$79 Outstanding</span>' : '<span class="badge badge-green" style="font-size:.84rem;padding:7px 14px;">All Paid ✓</span>'}
      </div>
      ${hasUnpaid ? `<div class="billing-alert"><span style="font-size:20px">⚠️</span><p>Invoice #5021 &mdash; MLS Analytics Add-on &mdash; <strong>$79 due March 30, 2026</strong></p><button class="btn btn-primary btn-sm" onclick="openPayModal('i1')">Pay Now</button></div>` : ''}
      <div class="card section-gap">
        <div class="card-title">Invoices</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Invoice #</th><th>Description</th><th>Amount</th><th>Due / Paid</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-title">Payment Methods</div>
        <div class="flex-row mb-12">
          <div style="background:var(--bg);border:1px solid var(--border);border-radius:9px;padding:12px 16px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:20px">🏦</span>
            <div><div class="font-600 text-sm">ACH Bank Transfer</div><div class="text-xs text-muted">Checking account ending 0402 &bull; Default</div></div>
            <span class="badge badge-green" style="margin-left:8px">Default</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Payment method form would open here')">+ Add Payment Method</button>
      </div>`;
  },

  // ── ELECTIONS ──────────────────────────────────────────────────────────────
  elections() {
    const elCards = DATA.elections.map(el => {
      const voted = votedElections.has(el.id);
      const cands = el.candidates.map(c => `
        <div class="candidate"><strong>${c.name}</strong><span>${c.bio}</span></div>`).join('');
      return `
        <div class="election-card">
          <div class="flex-between mb-12">
            <div>
              <div class="election-title">${el.title}</div>
              <div class="election-meta">🕐 Voting open through Mar 21, 2026 &bull; ${el.subtitle}</div>
            </div>
            ${voted ? '<span class="badge badge-green">✓ Voted</span>' : '<span class="badge badge-amber">Vote Required</span>'}
          </div>
          <div class="candidates">${cands}</div>
          <button class="btn ${voted ? 'btn-secondary' : 'btn-primary'}" onclick="openVoteModal('${el.id}')">
            ${voted ? '✓ Vote submitted' : 'Cast Your Vote →'}
          </button>
        </div>`;
    }).join('');

    return `
      <div class="page-header"><h2>Elections</h2><p>Active ballot &bull; Voting closes March 21, 2026</p></div>
      ${elCards}
      <div class="card">
        <div class="card-title">Past Elections</div>
        <div class="table-wrap"><table>
          <thead><tr><th>Election</th><th>Year</th><th>Result</th><th>Your Vote</th></tr></thead>
          <tbody>
            <tr><td><strong>Association President</strong></td><td>2025</td><td>Jane Torres elected</td><td>&#10003; Voted</td></tr>
            <tr><td><strong>Treasurer</strong></td><td>2024</td><td>Michael Rios elected</td><td>&#10003; Voted</td></tr>
          </tbody>
        </table></div>
      </div>`;
  },

  // ── STORE ──────────────────────────────────────────────────────────────────
  store() {
    const cards = DATA.products.map(p => `
      <div class="store-card">
        <div class="store-icon">${p.icon}</div>
        <div class="store-name">${p.name}</div>
        <div class="store-desc">${p.desc}</div>
        <div class="store-footer">
          <span class="store-price ${p.free ? 'free' : ''}">${p.priceText}</span>
          <button class="btn btn-${p.free ? 'success' : 'primary'} btn-sm" onclick="${p.free ? `showToast('Downloading: ${p.name}...')` : `addToCart('${p.id}')`}">
            ${p.free ? 'Download' : 'Add to Cart'}
          </button>
        </div>
      </div>`).join('');

    return `
      <div class="page-header flex-between">
        <div><h2>Online Store</h2><p>Forms, toolkits &amp; member resources</p></div>
        <div class="flex-row">
          <span class="badge badge-blue" id="cart-count-badge" style="display:none">${cart.length} items</span>
          <button class="btn btn-secondary btn-sm" onclick="openCart()">🛍️ View Cart</button>
        </div>
      </div>
      <div class="store-grid">${cards}</div>`;
  },

  // ── RESOURCES ──────────────────────────────────────────────────────────────
  resources() {
    const ssoTiles = DATA.ssoServices.map(s => `
      <div class="sso-tile">
        <div class="sso-icon">${s.icon}</div>
        <div class="sso-name">${s.name}</div>
        <div class="sso-desc">${s.desc}</div>
        <button class="btn btn-primary btn-sm" style="margin-top:8px;align-self:flex-start" onclick="showToast('Launching ${s.name.split('—')[0].trim()} via SSO...')">Launch &rarr;</button>
      </div>`).join('');

    const comingSoon = [
      { icon:'🏠', name:'MLS Direct SSO',   note:'Pending 2FA rollout on Cobalt\'s new release' },
      { icon:'📄', name:'Forms Library v2', note:'Next-gen forms with integrated e-sign and audit trail' },
      { icon:'📅', name:'ShowingTime+',      note:'Enhanced showing management with agent scheduler' },
    ].map(s => `
      <div class="sso-tile coming-soon">
        <div class="sso-icon">${s.icon}</div>
        <div class="sso-name">${s.name}</div>
        <div class="sso-desc">${s.note}</div>
        <span class="badge badge-gray">Pending 2FA</span>
      </div>`).join('');

    return `
      <div class="page-header">
        <h2>Resources &amp; Integrated Services</h2>
        <p>These links connect to services using your association login. Once 2FA is enabled via Cobalt's new release, this hub will serve as your IdP for MLS, forms, transaction management, ShowingTime, and more.</p>
      </div>
      <div class="card-title" style="margin-bottom:12px">Active Single Sign-On Services</div>
      <div class="sso-grid section-gap">${ssoTiles}</div>
      <div class="card-title" style="margin-bottom:12px">Coming Soon <span style="font-weight:400;font-size:.76rem;text-transform:none;letter-spacing:0">&mdash; Pending 2FA enablement &amp; IdP configuration on Cobalt</span></div>
      <div class="sso-grid section-gap">${comingSoon}</div>
      <div class="card">
        <div class="card-title">Custom Resource Links <a href="#" onclick="showToast('Admin link manager opens here');return false">Manage links</a></div>
        <p class="text-sm text-muted" style="margin-bottom:14px">Boards can add custom links to member resources, internal tools, or external services below.</p>
        <div class="grid-3">
          <div style="border:1px solid var(--border);border-radius:9px;padding:12px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:18px">📖</span>
            <div style="flex:1"><div class="font-600 text-sm">Member Handbook</div><div class="text-xs text-muted">PDF &bull; 2026 edition</div></div>
            <button class="btn btn-secondary btn-xs" onclick="showToast('Opening member handbook...')">Open</button>
          </div>
          <div style="border:1px solid var(--border);border-radius:9px;padding:12px;display:flex;align-items:center;gap:10px;">
            <span style="font-size:18px">📞</span>
            <div style="flex:1"><div class="font-600 text-sm">Staff Directory</div><div class="text-xs text-muted">Association office contacts</div></div>
            <button class="btn btn-secondary btn-xs" onclick="showToast('Opening staff directory...')">Open</button>
          </div>
          <div style="border:2px dashed #cbd5e1;border-radius:9px;padding:12px;display:flex;align-items:center;gap:10px;cursor:pointer" onclick="showToast('Admin: add new resource link here')">
            <span style="font-size:18px;color:var(--muted)">+</span>
            <div><div class="text-sm" style="color:var(--muted)">Add resource link</div><div class="text-xs text-muted">Admin only</div></div>
          </div>
        </div>
      </div>`;
  },

}); // end Object.assign(Pages, ...)

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  navigate('dashboard');

  document.getElementById('hamburger').addEventListener('click', openSidebar);
  document.getElementById('overlay').addEventListener('click', closeSidebar);

  document.getElementById('modal-backdrop').addEventListener('click', e => {
    if (e.target.id === 'modal-backdrop') closeModal();
  });
});
