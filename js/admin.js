/** admin.js – Panel de administración Auto-SAC */

let cfg = null;

/* ══════════════════════════════════════════════
   LOGIN ADMIN
══════════════════════════════════════════════ */
function doAdminLogin() {
  const u = document.getElementById('adminUser').value.trim();
  const p = document.getElementById('adminPass').value.trim();
  if (u === CONFIG.ADMIN_USER && p === CONFIG.ADMIN_PASS) {
    document.getElementById('adminLoginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    initAdmin();
  } else {
    document.getElementById('adminLoginError').textContent = '❌ Usuario o contraseña incorrectos.';
    document.getElementById('adminPass').value = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('adminPass')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doAdminLogin();
  });
});

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
function initAdmin() {
  cfg = getAdminConfig();
  renderMatricula();
  renderCupos();
  renderCorreos();
  renderProfesores();
  renderChatbotConfig();
  updateSidebarStatus();
}

/* ══════════════════════════════════════════════
   NAVEGACIÓN
══════════════════════════════════════════════ */
function showSection(name, el) {
  document.querySelectorAll('.adm-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.adm-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('sec-' + name).classList.remove('hidden');
  el.classList.add('active');
}

/* ══════════════════════════════════════════════
   MATRÍCULA
══════════════════════════════════════════════ */
function renderMatricula() {
  document.getElementById('matriculaToggle').checked = cfg.matriculaActiva;
  document.getElementById('mensajeNoMatricula').value = cfg.mensajeMatricula;
  document.getElementById('semestreActual').value     = cfg.semestreActual || '';
  updateMatriculaStatus();
}

function updateMatriculaStatus() {
  const on  = document.getElementById('matriculaToggle').checked;
  const el  = document.getElementById('sidebarMatriculaStatus');
  el.textContent = on ? '✅ Activa' : '❌ Inactiva';
  el.className   = 'adm-status-badge ' + (on ? 'on' : 'off');
}

/* ══════════════════════════════════════════════
   CUPOS
══════════════════════════════════════════════ */
let cupoFilter = 'ALL';

function renderCupos(filter) {
  if (filter) cupoFilter = filter;
  const cont = document.getElementById('cuposContainer');
  cont.innerHTML = '';
  const list = cupoFilter === 'ALL' ? cfg.cupos : cfg.cupos.filter(c => c.tipo === cupoFilter);

  list.forEach((c, i) => {
    const realIdx = cfg.cupos.indexOf(c);
    const row = document.createElement('div');
    row.className = 'adm-cupo-row';
    row.innerHTML = `
      <span class="adm-cupo-badge badge-${c.tipo}">${c.tipo}</span>
      <span class="adm-cupo-name">${c.materia}</span>
      <div class="adm-cupo-nota">
        <input type="text" class="adm-input" style="font-size:12px" 
               placeholder="Nota (opcional)" value="${c.nota || ''}"
               onchange="cfg.cupos[${realIdx}].nota = this.value"/>
      </div>
      <div class="adm-cupo-toggle">
        <label style="font-size:12px;color:${c.disponible?'#1b7c2c':'#c02020'};font-weight:700">
          ${c.disponible ? '✅ Cupo disponible' : '❌ Sin cupo'}
        </label>
        <label class="adm-toggle" style="width:44px;height:24px">
          <input type="checkbox" ${c.disponible ? 'checked' : ''}
                 onchange="cfg.cupos[${realIdx}].disponible = this.checked; renderCupos()"/>
          <span class="adm-toggle-slider"></span>
        </label>
        <button class="adm-btn-danger" onclick="removeMateria(${realIdx})">🗑</button>
      </div>`;
    cont.appendChild(row);
  });

  if (list.length === 0) {
    cont.innerHTML = '<div style="color:#888;padding:16px;text-align:center">No hay materias para este filtro.</div>';
  }
}

function filterCupos(tipo, btn) {
  document.querySelectorAll('.adm-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCupos(tipo);
}

function addMateria() {
  const nombre = document.getElementById('newMateria').value.trim();
  const tipo   = document.getElementById('newTipo').value;
  if (!nombre) return;
  cfg.cupos.push({ materia: nombre, tipo, disponible: true, nota: '' });
  document.getElementById('newMateria').value = '';
  renderCupos();
  showToast('Materia agregada ✅', 'ok');
}

function removeMateria(idx) {
  if (!confirm(`¿Eliminar "${cfg.cupos[idx].materia}"?`)) return;
  cfg.cupos.splice(idx, 1);
  renderCupos();
}

/* ══════════════════════════════════════════════
   CORREOS
══════════════════════════════════════════════ */
function renderCorreos() {
  const cont = document.getElementById('correosContainer');
  cont.innerHTML = `
    <div class="adm-correo-header">
      <span>Área / Dependencia</span>
      <span>Correo electrónico</span>
      <span>Responsable</span>
      <span></span>
    </div>`;
  cfg.correos.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'adm-correo-item';
    row.innerHTML = `
      <input type="text" class="adm-input" placeholder="Área" value="${esc(c.area)}"
             onchange="cfg.correos[${i}].area = this.value"/>
      <input type="email" class="adm-input" placeholder="correo@ustabuca.edu.co" value="${esc(c.email)}"
             onchange="cfg.correos[${i}].email = this.value"/>
      <input type="text" class="adm-input" placeholder="Nombre responsable" value="${esc(c.responsable)}"
             onchange="cfg.correos[${i}].responsable = this.value"/>
      <button class="adm-btn-danger" onclick="removeCorreo(${i})">🗑</button>`;
    cont.appendChild(row);
  });
}

function addCorreo() {
  cfg.correos.push({ area: '', email: '', responsable: '', descripcion: '' });
  renderCorreos();
  // scroll al final
  const cont = document.getElementById('correosContainer');
  cont.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
}

function removeCorreo(idx) {
  if (!confirm('¿Eliminar este correo?')) return;
  cfg.correos.splice(idx, 1);
  renderCorreos();
}

/* ══════════════════════════════════════════════
   PROFESORES
══════════════════════════════════════════════ */
function renderProfesores() {
  const cont = document.getElementById('profesoresContainer');
  cont.innerHTML = `
    <div class="adm-prof-header">
      <span>Nombre completo</span>
      <span>Correo electrónico</span>
      <span>Materias que dicta</span>
      <span></span>
    </div>`;
  cfg.profesores.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'adm-prof-item';
    row.innerHTML = `
      <input type="text" class="adm-input" placeholder="Nombre del profesor" value="${esc(p.nombre)}"
             onchange="cfg.profesores[${i}].nombre = this.value"/>
      <input type="email" class="adm-input" placeholder="correo@ustabuca.edu.co" value="${esc(p.email)}"
             onchange="cfg.profesores[${i}].email = this.value"/>
      <input type="text" class="adm-input" placeholder="Materias" value="${esc(p.materias)}"
             onchange="cfg.profesores[${i}].materias = this.value"/>
      <button class="adm-btn-danger" onclick="removeProfesor(${i})">🗑</button>`;
    cont.appendChild(row);
  });
}

function addProfesor() {
  cfg.profesores.push({ nombre: '', email: '', materias: '' });
  renderProfesores();
  document.getElementById('profesoresContainer').lastElementChild?.scrollIntoView({ behavior: 'smooth' });
}

function removeProfesor(idx) {
  if (!confirm('¿Eliminar este profesor?')) return;
  cfg.profesores.splice(idx, 1);
  renderProfesores();
}

/* ══════════════════════════════════════════════
   CONFIG BOT
══════════════════════════════════════════════ */
function renderChatbotConfig() {
  document.getElementById('nombreBot').value         = cfg.nombreBot || 'Auto-SAC';
  document.getElementById('groqApiKey').value = cfg.groqApiKey || '';
  document.getElementById('mensajeBienvenida').value = cfg.mensajeBienvenida || '';
  document.getElementById('mensajeExtra').value      = cfg.mensajeExtra || '';
  updateBotSummary();
}

function updateBotSummary() {
  const cuposOk  = cfg.cupos.filter(c => c.disponible).length;
  const cuposNo  = cfg.cupos.filter(c => !c.disponible).length;
  const correos  = cfg.correos.length;
  const profs    = cfg.profesores.length;
  const matricula= cfg.matriculaActiva ? '✅ Activa' : '❌ Inactiva';

  document.getElementById('botStatusSummary').innerHTML = `
    📅 <strong>Temporada de matrícula:</strong> ${matricula}<br>
    📋 <strong>Cupos disponibles:</strong> ${cuposOk} materias con cupo · ${cuposNo} sin cupo<br>
    📬 <strong>Correos configurados:</strong> ${correos} áreas<br>
    👨‍🏫 <strong>Profesores registrados:</strong> ${profs}<br>
    🤖 <strong>Nombre del bot:</strong> ${cfg.nombreBot || 'Auto-SAC'}<br>
    📢 <strong>Anuncio activo:</strong> ${cfg.mensajeExtra ? '"' + cfg.mensajeExtra.slice(0, 60) + '..."' : 'Ninguno'}
  `;
}

/* ══════════════════════════════════════════════
   GUARDAR
══════════════════════════════════════════════ */
function saveSection(section) {
  collectCurrentValues(section);
  saveAdminConfig(cfg);
  updateSidebarStatus();
  updateBotSummary();
  showToast('✅ Guardado correctamente', 'ok');
  document.getElementById('saveIndicator').textContent = '✅ Guardado ' + new Date().toLocaleTimeString();
}

function saveAll() {
  ['matricula','cupos','correos','profesores','chatbot'].forEach(s => collectCurrentValues(s));
  saveAdminConfig(cfg);
  updateSidebarStatus();
  updateBotSummary();
  showToast('✅ Todo guardado correctamente', 'ok');
  document.getElementById('saveIndicator').textContent = '✅ Guardado ' + new Date().toLocaleTimeString();
}

function collectCurrentValues(section) {
  if (section === 'matricula') {
    cfg.matriculaActiva   = document.getElementById('matriculaToggle').checked;
    cfg.mensajeMatricula  = document.getElementById('mensajeNoMatricula').value;
    cfg.semestreActual    = document.getElementById('semestreActual').value;
  }
  if (section === 'chatbot') {
    cfg.groqApiKey = document.getElementById('groqApiKey').value.trim();
    cfg.nombreBot          = document.getElementById('nombreBot').value;
    cfg.mensajeBienvenida  = document.getElementById('mensajeBienvenida').value;
    cfg.mensajeExtra       = document.getElementById('mensajeExtra').value;
  }
  // cupos, correos y profesores ya se actualizan en tiempo real via onchange
}

function updateSidebarStatus() {
  const on = cfg.matriculaActiva;
  const el = document.getElementById('sidebarMatriculaStatus');
  el.textContent = on ? '✅ Activa' : '❌ Inactiva';
  el.className   = 'adm-status-badge ' + (on ? 'on' : 'off');
}

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */
function showToast(msg, type = '') {
  const el = document.getElementById('admToast');
  el.textContent = msg;
  el.className   = `adm-toast ${type}`;
  void el.offsetWidth;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function esc(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
