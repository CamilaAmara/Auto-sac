/**
 * chatbot.js – Auto-SAC v2
 * IA: Groq | Email: EmailJS | Nuevas funciones: Movilidad + Permisos Académicos
 */

/* ══════════════════════════════════════════════
   CONTACTOS
══════════════════════════════════════════════ */
function loadContacts() {
  try { return JSON.parse(localStorage.getItem('autosac_contacts') || '{}'); } catch { return {}; }
}
function saveContact(name, email) {
  if (!email || !email.includes('@')) return;
  const c = loadContacts();
  const k = email.toLowerCase().trim();
  if (!c[k]) { c[k] = name || email; localStorage.setItem('autosac_contacts', JSON.stringify(c)); }
}
function getContactsAsText() {
  const c = loadContacts();
  const e = Object.entries(c);
  if (!e.length) return '';
  return '\nCONTACTOS PREVIOS:\n' + e.map(([email, name]) => `- ${name}: ${email}`).join('\n');
}

/* ══════════════════════════════════════════════
   SYSTEM PROMPT DINÁMICO
══════════════════════════════════════════════ */
function buildSystemPrompt() {
  const cfg = getAdminConfig();

  const cuposText = cfg.cupos.map(c => {
    const estado = c.disponible ? '✅ DISPONIBLE' : '❌ SIN CUPO';
    const nota   = c.nota ? ` (${c.nota})` : '';
    return `- ${c.materia} [${c.tipo}]: ${estado}${nota}`;
  }).join('\n');

  const correosText = cfg.correos.map(c =>
    `- ${c.area}: ${c.email} → Responsable: ${c.responsable}`
  ).join('\n');

  const profsText = cfg.profesores.map(p =>
    `- ${p.nombre} → ${p.email} (${p.materias})`
  ).join('\n');

  const anuncio = cfg.mensajeExtra
    ? `\n⚠️ ANUNCIO ESPECIAL: ${cfg.mensajeExtra}\n`
    : '';

  const nombreBot = cfg.nombreBot || 'Auto-SAC';

  return `Eres ${nombreBot} 🎓, el asistente virtual oficial de la Facultad de Ingeniería de Telecomunicaciones de la Universidad Santo Tomás (USTA), sede Bucaramanga. Eres rápido, simpático, proactivo y resolutivo. Tienes personalidad, usas emojis con moderación y hablas de manera cercana y natural. Ahora tienes conocimiento ampliado sobre MÚLTIPLES procesos universitarios.

REGLAS ABSOLUTAS:
1. Solo hablas de temas académicos/administrativos de la USTA Bucaramanga.
2. Nunca inventas datos, correos o procesos que no conozcas.
3. SIEMPRE confirmas antes de enviar un correo mostrando el borrador con el marcador [EMAIL_DRAFT].
4. Puedes enviar correos a CUALQUIER dirección que el estudiante indique.
5. El correo del estudiante es: mariacamila.amara@ustabuca.edu.co
6. NO puedes abrir ni cerrar cupos directamente.
7. Responde en español colombiano, natural y conversacional.
${anuncio}
INFORMACIÓN DEL ESTUDIANTE:
Nombre: María Camila Amara Hernández | Código: 1097493972
Programa: Ingeniería de Telecomunicaciones – Plan 5 | Semestre: 7
Correo: mariacamila.amara@ustabuca.edu.co

════════════════════════════════════════════════
TEMPORADA DE MATRÍCULA
════════════════════════════════════════════════
Estado actual: ${cfg.matriculaActiva ? '✅ ACTIVA – puedes orientar al estudiante en matrícula' : '❌ FUERA DE TEMPORADA'}
Semestre: ${cfg.semestreActual || '2025-1'}
${!cfg.matriculaActiva ? `\nSi preguntan por matrícula responde: "${cfg.mensajeMatricula}"` : ''}

════════════════════════════════════════════════
DISPONIBILIDAD DE CUPOS
════════════════════════════════════════════════
${cuposText}

════════════════════════════════════════════════
DIRECTORIO DE CORREOS PRINCIPALES
════════════════════════════════════════════════
${correosText}

════════════════════════════════════════════════
DECANO DE LA FACULTAD
════════════════════════════════════════════════
- Decano División Ingenierías: Cesar Hernando Valencia Niño
  Correo: cesar.valencia@ustabuca.edu.co
  Función: Aprobación de salidas académicas, cartas de compromiso, permisos, firmar documentos de la facultad, avales de movilidad y cualquier solicitud que requiera firma del decano.

════════════════════════════════════════════════
PROFESORES DE TELECOMUNICACIONES
════════════════════════════════════════════════
${profsText}

════════════════════════════════════════════════
PENSUM PLAN 5 – ING. TELECOMUNICACIONES
════════════════════════════════════════════════
[TC]=Telecomunicaciones (siempre cupo), [CB]=Ciencias Básicas, [HUM]=Humanidades, [ID]=Idiomas

SEM 1: Cátedra Henry Didón[HUM], Química[CB], Cálculo Diferencial[CB], Álgebra Lineal[CB], Introducción a la Ingeniería[TC], Lengua Extranjera 1[ID]
SEM 2: Taller Lecto-escritura[HUM], Cálculo Integral[CB], Física Mecánica[CB], Electrónica Básica[TC], Lógica de Programación[TC], Lengua Extranjera 2[ID]
SEM 3: Antropología[HUM], Cálculo Vectorial[CB], Ecuaciones Diferenciales[CB], Electrónica Aplicada[TC], POO[TC], Proyecto Integrador 1[TC], Lengua Extranjera 3[ID]
SEM 4: Electricidad y Magnetismo[CB], Probabilidad y Estadística[CB], Sistemas Digitales[TC], Programación Aplicada[TC], Señales y Sistemas[TC], Epistemología[HUM], Lengua Extranjera 4[ID]
SEM 5: Campos y Ondas EM[TC], Teletráfico[TC], Sistemas Operativos[TC], Sistemas de Telecomunicaciones[TC], Procesamiento de la Información[TC], Lengua Extranjera 5[ID]
SEM 6: Medios de Transmisión[TC], Seminario de Investigación[TC], Telemática I[TC], Sistemas de Codificación[TC], Cultura Teológica[HUM], Gestión de Proyectos[TC], Lengua Extranjera 6[ID]
SEM 7 (ACTUAL): Antenas y Propagación[TC]✔, Telemática II[TC]✔, Electiva I[TC]✔, Servicios Multimedia[TC]✔, Filosofía Política[HUM]⚠, Cátedra Optativa[TC]✔
SEM 8-10: materias avanzadas TC + trabajo de grado

════════════════════════════════════════════════
🌍 MOVILIDAD ACADÉMICA ESTUDIANTIL (RI-BG-PR-001)
════════════════════════════════════════════════
CONTACTO DRI (Dirección de Relaciones Internacionales):
- Correo movilidad saliente: movilidad.saliente@ustabuca.edu.co (o contactar directamente a la DRI)
- Correo DRI general: dri@ustabuca.edu.co
- WhatsApp DRI: 314 218 8190
- Directora DRI: Gladys Alicia Rey Castellanos

TIPOS DE MOVILIDAD:
- Movilidad SALIENTE: Estudiante USTA va a estudiar a otra universidad (nacional o internacional)
- Movilidad ENTRANTE: Estudiante de otra universidad viene a la USTA
- Modalidades: Presencial y Virtual

REQUISITOS PARA APLICAR A MOVILIDAD SALIENTE (el estudiante debe cumplir TODOS):
1. Promedio académico acumulado igual o superior al mínimo exigido
2. Ser estudiante regular que haya aprobado AL MENOS LA MITAD del plan de estudios (para presencial) o tercer semestre (virtual)
3. NO tener sanciones disciplinarias
4. Acreditar dominio del idioma del país destino (si aplica) – CILCE o examen de suficiencia
5. Realizar solicitud a través de la DRI: https://movilidadsaliente.ustabuca.edu.co/

DOCUMENTOS QUE DEBE ADJUNTAR EL ESTUDIANTE PARA POSTULARSE:
📋 Lista completa de documentos requeridos:
1. Plan de estudios
2. Aval de movilidad de su facultad (PDF) – lo firma el Decano
3. Carta de compromiso (PDF) – formato RI-N-F-003 o RI-N-F-004 según modalidad
4. Pasaporte con vigencia no menor a 6 meses (PDF)
5. Carta de exposición de motivos para realizar la movilidad dirigida a la universidad destino (PDF)
6. Certificado de vacunación Covid-19 (si aplica)
7. Fotografía a color tipo pasaporte, fondo blanco, sin anteojos ni gorra (4x5 cm, JPG)
8. Hoja de vida o curriculum vitae (PDF)
9. Cédula de Ciudadanía
10. Certificado de notas USTABUCA
11. Certificación de actividades extracurriculares emitida por la unidad correspondiente
12. Certificación de dominio del idioma de acuerdo al país de destino (si aplica)
13. Historial académico SAC
14. Carta aval dirigida a la Dirección de Relaciones Internacionales (firmada por el decano)

PROCESO PASO A PASO PARA MOVILIDAD SALIENTE:
1. Consultar convocatorias disponibles con la DRI (WhatsApp: 314 218 8190)
2. Obtener aval de movilidad del Decano (cesar.valencia@ustabuca.edu.co)
3. Verificar requisitos con el docente de internacionalización
4. Registrar solicitud en la plataforma: https://movilidadsaliente.ustabuca.edu.co/
5. Cargar todos los documentos en la plataforma
6. Esperar revisión del docente de internacionalización y decano
7. La DRI postula al estudiante ante la universidad destino
8. Esperar carta de aceptación
9. Completar matrícula académica de movilidad

LO QUE HACE LA UNIVERSIDAD (NO el estudiante):
- La DRI verifica documentos, postula candidatos, emite cartas de aceptación
- El Consejo de Facultad aprueba o rechaza la solicitud
- Registro y Control genera el polígrafo de movilidad
- Tesorería verifica términos financieros
- La Secretaria de División carga notas en el SAC al regreso

Auto-SAC puede: informar sobre el proceso, listar los documentos requeridos, redactar correos a la DRI, al decano para solicitar el aval, y orientar en cada paso.

════════════════════════════════════════════════
🏫 PERMISOS Y SALIDAS ACADÉMICAS (DA-BG-PR-002)
════════════════════════════════════════════════
Las salidas académicas son actividades pedagógicas que se desarrollan FUERA de la universidad, como visitas a empresas, prácticas de campo, investigación, proyección social, bienestar universitario.

APLICA PARA: Actividades fuera del área metropolitana de Bucaramanga que requieran transporte y alojamiento.

RESPONSABLES:
- Decano de Facultad: César Hernando Valencia Niño (cesar.valencia@ustabuca.edu.co) → aprueba la salida
- Docente líder: gestiona documentación y logística
- Dirección de Compras: inscripción de proveedores y seguro estudiantil
- Oficina Jurídica: verifica legalidad de proveedores

QUÉ DEBE HACER EL ESTUDIANTE PARA UNA SALIDA ACADÉMICA:
1. Entregar certificado de EPS activo (con al menos 1 mes de anticipación)
2. Diligenciar el formato GL-N-F-007 "Carta de Compromiso Para Actividad Académica" (descargable del SIAC en línea)
   - Si es menor de edad: debe venir firmado por padres o tutor
3. Seguir el cronograma y protocolo de comportamiento que socialice el docente

QUÉ HACE LA UNIVERSIDAD (NO el estudiante):
- El decano verifica el Syllabus y aprueba la salida
- Busca y contrata proveedores (transporte, hospedaje, alimentación)
- La oficina jurídica valida documentos de proveedores
- La Dirección de Compras notifica a la aseguradora para cobertura
- El decano informa a SST la salida del docente

DOCUMENTOS CLAVE:
- GL-N-F-007: Carta de Compromiso Para Actividad Académica → disponible en SIAC en línea
- GL-N-IN-001: Protocolo de actividades y salidas académicas → en SIAC en línea
- Formato Plan de Trabajo Salida Académica → https://madri.ustabuca.edu.co/

Auto-SAC puede: explicar el proceso, decir qué documentos necesita el estudiante, redactar correos al decano o al docente lider, y orientar en el proceso.

NOTA IMPORTANTE: La solicitud de salida académica se radica por el docente en PROMOUSTA: https://madri.ustabuca.edu.co/ (mínimo 2 semanas antes de la salida)

════════════════════════════════════════════════
💰 PAGOS EN LÍNEA
════════════════════════════════════════════════
Portal oficial: https://pagosenlinea.usantotomas.edu.co/
Pasos: 1) Ingresar, 2) Seleccionar "Pago de matrícula", 3) Código 1097493972, 4) PSE o tarjeta, 5) Descargar comprobante.
Financiación: crediusta@ustabuca.edu.co

════════════════════════════════════════════════
📬 EXCUSAS MÉDICAS
════════════════════════════════════════════════
- Servicios Médicos Floridablanca: sermeflo@ustabuca.edu.co
- Si afecta evaluaciones: también CC a sec.divingenierias@ustabuca.edu.co
- Necesitas: fechas de incapacidad y materias afectadas

════════════════════════════════════════════════
📄 CERTIFICADOS
════════════════════════════════════════════════
- SAC → Proceso Certificados → Solicitud de certificados para estudiantes
- Problemas: sec.divingenierias@ustabuca.edu.co
- Firmas: el Secretario(a) General firma según Art. 70 Reglamento Estudiantil

${getContactsAsText()}
════════════════════════════════════════════════
FORMATO PARA CORREOS (OBLIGATORIO)
════════════════════════════════════════════════
[EMAIL_DRAFT]
PARA: correo@destino.com
CC: correo@cc.com
ASUNTO: El asunto
MENSAJE:
Estimado/a [nombre]:

[cuerpo]

Atentamente,
María Camila Amara Hernández
Estudiante – Ingeniería de Telecomunicaciones
Código: 1097493972
Universidad Santo Tomás – Sede Bucaramanga
[EMAIL_DRAFT_END]

Si no hay CC omite esa línea. Después escribe algo natural.`.trim();
}

/* ══════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════ */
let botOpen     = false;
let botTyping   = false;
let history     = [];
let pendingMail = null;

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof emailjs !== 'undefined') emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);

  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.target.classList.contains('visible')) {
        observer.disconnect();
        const cfg    = getAdminConfig();
        const nombre = cfg.nombreBot || 'Auto-SAC';
        const nh     = document.getElementById('botNameHeader');
        if (nh) nh.textContent = nombre;

        setTimeout(() => {
          const bienvenida = cfg.mensajeBienvenida ||
            `¡Hola! 👋 Soy **${nombre}**, tu asistente virtual de la Facultad de Telecomunicaciones USTA 🎓\n\n` +
            `Puedo ayudarte con:\n• 📝 Matrículas y cupos\n• 🌍 Movilidad académica e intercambios\n• 🏫 Permisos y salidas académicas\n• 📄 Certificados y excusas médicas\n• 💳 Pagos en línea\n• ✉️ Envío de correos a las dependencias\n\n¡Dime en qué te puedo ayudar!`;
          pushBot(bienvenida);
          document.getElementById('fabBadge').style.display = 'block';
        }, 900);
      }
    }
  });
  observer.observe(document.getElementById('sacScreen'), { attributes: true, attributeFilter: ['class'] });
});

/* ══════════════════════════════════════════════
   TOGGLE
══════════════════════════════════════════════ */
function toggleBot() {
  botOpen = !botOpen;
  const win = document.getElementById('botWindow');
  botOpen ? win.classList.add('open') : win.classList.remove('open');
  if (botOpen) {
    document.getElementById('fabBadge').style.display = 'none';
    setTimeout(() => document.getElementById('botInput').focus(), 250);
  }
}

/* ══════════════════════════════════════════════
   ENVIAR MENSAJE
══════════════════════════════════════════════ */
function handleBotKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBotMsg(); }
}

function quickMsg(txt) {
  if (!botOpen) toggleBot();
  document.getElementById('botQuick').style.display = 'none';
  document.getElementById('botInput').value = txt;
  sendBotMsg();
}

async function sendBotMsg() {
  const inp  = document.getElementById('botInput');
  const text = inp.value.trim();
  if (!text || botTyping) return;
  inp.value = '';
  document.getElementById('botQuick').style.display = 'none';

  if (pendingMail) {
    const lo  = text.toLowerCase();
    const yes = ['sí','si','yes','confirmar','confirmo','enviar','envíalo','ok','dale','listo','claro','hazlo','mándalo','adelante','va','venga'].some(k => lo.includes(k));
    const no  = ['no','cancelar','cancela','no envíes','no mandes','espera'].some(k => lo.includes(k));
    if (yes) { pushUser(text); await doSendEmail(); return; }
    if (no)  { pendingMail = null; pushUser(text); pushBot('Correo cancelado 😊 ¿Necesitas algo más?'); return; }
    pendingMail = null;
  }

  pushUser(text);
  await callGroq(text);
}

/* ══════════════════════════════════════════════
   GROQ API
══════════════════════════════════════════════ */
async function callGroq(userMsg) {
  history.push({ role: 'user', content: userMsg });
  botTyping = true;
  document.getElementById('botSendBtn').disabled = true;
  const tid = showTyping();

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${getAdminConfig().groqApiKey || CONFIG.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model:    CONFIG.GROQ_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...history,
        ],
        temperature: 0.72,
        max_tokens:  1300,
        top_p:       0.9,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${res.status}`);
    }

    const data  = await res.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    history.push({ role: 'assistant', content: reply });
    removeTyping(tid);
    parseAndRender(reply);

  } catch (err) {
    removeTyping(tid);
    console.error('Groq error:', err);
    pushBot(`❌ Ups, tuve un problema: *${err.message}*. Intenta de nuevo 🙏`);
  } finally {
    botTyping = false;
    document.getElementById('botSendBtn').disabled = false;
  }
}

/* ══════════════════════════════════════════════
   PARSEAR RESPUESTA
══════════════════════════════════════════════ */
function parseAndRender(raw) {
  const rx = /\[EMAIL_DRAFT\]([\s\S]*?)\[EMAIL_DRAFT_END\]/;
  const m  = raw.match(rx);
  if (!m) { pushBot(raw); return; }

  const mail  = parseDraft(m[1].trim());
  pendingMail = mail;
  const before = raw.slice(0, raw.indexOf('[EMAIL_DRAFT]')).trim();
  const after  = raw.slice(raw.indexOf('[EMAIL_DRAFT_END]') + '[EMAIL_DRAFT_END]'.length).trim();
  if (before) pushBot(before);
  renderEmailDraft(mail, after);
}

function parseDraft(block) {
  const lines  = block.split('\n').map(l => l.trim());
  const mail   = { to: '', cc: '', subject: '', message: '' };
  let inMsg    = false;
  const mLines = [];
  for (const ln of lines) {
    if (ln.startsWith('PARA:'))    { mail.to      = ln.replace('PARA:', '').trim(); continue; }
    if (ln.startsWith('CC:'))      { mail.cc      = ln.replace('CC:', '').trim();  continue; }
    if (ln.startsWith('ASUNTO:'))  { mail.subject = ln.replace('ASUNTO:', '').trim(); continue; }
    if (ln.startsWith('MENSAJE:')) { inMsg = true; continue; }
    if (inMsg) mLines.push(ln);
  }
  mail.message = mLines.join('\n');
  return mail;
}

/* ══════════════════════════════════════════════
   EMAILJS
══════════════════════════════════════════════ */
async function doSendEmail() {
  if (!pendingMail) return;
  if (typeof emailjs === 'undefined') {
    pushBot('❌ No pude cargar EmailJS.');
    pendingMail = null; return;
  }
  const tid      = showTyping();
  const mailCopy = { ...pendingMail };
  pendingMail    = null;

  try {
    await emailjs.send(CONFIG.EMAILJS_SERVICE_ID, CONFIG.EMAILJS_TEMPLATE_ID, {
      to_email:  mailCopy.to,
      to_name:   '',
      cc_email:  mailCopy.cc || '',
      subject:   mailCopy.subject,
      message:   mailCopy.message,
      from_name: CONFIG.BOT_EMAIL_NAME,
      reply_to:  CONFIG.BOT_EMAIL,
    });

    saveContact(mailCopy.to.split('@')[0], mailCopy.to);
    if (mailCopy.cc) saveContact(mailCopy.cc.split('@')[0], mailCopy.cc);

    removeTyping(tid);
    pushBot(
      `✅ **¡Correo enviado!** 📤\n📬 **Para:** ${mailCopy.to}\n` +
      (mailCopy.cc ? `📋 **CC:** ${mailCopy.cc}\n` : '') +
      `📝 **Asunto:** ${mailCopy.subject}\n\nGuardé ese contacto 😊 ¿Necesitas algo más?`
    );
    showToast('✅ Correo enviado', 'ok');

  } catch (err) {
    removeTyping(tid);
    pushBot(`❌ No pude enviar el correo: ${err?.text || err?.message}. Envíalo manualmente a **${mailCopy.to}**`);
    showToast('❌ Error al enviar', 'err');
  }
}

/* ══════════════════════════════════════════════
   RENDER
══════════════════════════════════════════════ */
function pushUser(text) {
  const area = document.getElementById('botMessages');
  const row  = document.createElement('div');
  row.className = 'mrow user';
  row.innerHTML = `<div class="mbubble">${esc(text)}</div>`;
  area.appendChild(row); scrollBot();
}

function pushBot(text) {
  const area = document.getElementById('botMessages');
  const row  = document.createElement('div');
  row.className = 'mrow bot';
  row.innerHTML = `<div class="mavatar">🎓</div><div class="mbubble">${md(text)}</div>`;
  area.appendChild(row); scrollBot();
}

function renderEmailDraft(mail, afterText) {
  const area = document.getElementById('botMessages');
  const row  = document.createElement('div');
  row.className = 'mrow bot';
  const uid       = 'draft_' + Date.now();
  const ccHtml    = mail.cc    ? `<div class="draft-line"><strong>CC:</strong> ${esc(mail.cc)}</div>` : '';
  const afterHtml = afterText  ? `<div style="margin-top:9px;font-size:12.5px">${md(afterText)}</div>` : '';

  row.innerHTML = `
    <div class="mavatar">🎓</div>
    <div class="mbubble">
      <div>Preparé este correo 📝</div>
      <div class="email-draft">
        <div class="draft-head">✉️ Borrador de correo</div>
        <div class="draft-line"><strong>Para:</strong> ${esc(mail.to)}</div>
        ${ccHtml}
        <div class="draft-line"><strong>Asunto:</strong> ${esc(mail.subject)}</div>
        <div class="draft-body">${esc(mail.message)}</div>
      </div>
      <div class="draft-actions" id="${uid}_actions">
        <button class="dbtn-yes" onclick="confirmEmail('${uid}')">✅ Sí, envíalo</button>
        <button class="dbtn-no"  onclick="cancelEmail('${uid}')">❌ Cancelar</button>
      </div>
      ${afterHtml}
    </div>`;
  area.appendChild(row); scrollBot();
}

function confirmEmail(uid) {
  document.querySelectorAll(`#${uid}_actions button`).forEach(b => b.disabled = true);
  doSendEmail();
}
function cancelEmail(uid) {
  document.querySelectorAll(`#${uid}_actions button`).forEach(b => b.disabled = true);
  pendingMail = null;
  pushBot('Correo cancelado 😊 ¿Lo ajustamos o necesitas otra cosa?');
}

function showTyping() {
  const area = document.getElementById('botMessages');
  const row  = document.createElement('div');
  const id   = 'typing_' + Date.now();
  row.id = id; row.className = 'mrow bot';
  row.innerHTML = `<div class="mavatar">🎓</div><div class="typing-wrap"><div class="td"></div><div class="td"></div><div class="td"></div></div>`;
  area.appendChild(row); scrollBot();
  return id;
}
function removeTyping(id) { document.getElementById(id)?.remove(); }
function scrollBot() { const a = document.getElementById('botMessages'); a.scrollTop = a.scrollHeight; }

function showToast(msg, type = '') {
  const el = document.getElementById('toastMsg');
  el.textContent = msg; el.className = `toast-msg ${type}`;
  void el.offsetWidth; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3400);
}

function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function md(text) {
  let h = esc(text);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  h = h.replace(/`(.+?)`/g, '<code style="background:#e4eeff;padding:1px 4px;border-radius:3px;font-size:11.5px">$1</code>');
  h = h.replace(/(https?:\/\/[^\s<"]+)/g, '<a href="$1" target="_blank" style="color:#1b50b8;text-decoration:underline">$1</a>');
  h = h.replace(/\n/g, '<br>');
  return h;
}
