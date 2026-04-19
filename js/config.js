/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║              AUTO-SAC – CONFIGURACIÓN                    ║
 * ╚══════════════════════════════════════════════════════════╝
 */

const CONFIG = {

  /* ── GROQ API ─────────────────────────────────────────── */
  GROQ_API_KEY: '',
  GROQ_MODEL:   'llama-3.1-8b-instant',

  /* ── EMAILJS ─────────────────────────────────────────── */
  EMAILJS_PUBLIC_KEY:   'PmDzm89ndtXj-SKXB',
  EMAILJS_SERVICE_ID:   'service_hjvcuto',
  EMAILJS_TEMPLATE_ID:  'template_t5xuc9f',

  /* ── REMITENTE ───────────────────────────────────────── */
  BOT_EMAIL_NAME: 'Auto-SAC – Asistente USTA Teleco',
  BOT_EMAIL:      'mariacamila.amara@ustabuca.edu.co',

  /* ── ESTUDIANTE ──────────────────────────────────────── */
  STUDENT_NAME:     'María Camila Amara Hernández',
  STUDENT_CODE:     '1097493972',
  STUDENT_PROGRAM:  'Ingeniería de Telecomunicaciones',
  STUDENT_SEMESTER: 7,

  /* ── LOGIN ───────────────────────────────────────────── */
  LOGIN_USER:  '1097493972',
  LOGIN_PASS:  '1097493972',
  ADMIN_USER:  '1097493972',
  ADMIN_PASS:  '1097493972',
};

/* ══════════════════════════════════════════════════════════
   FUNCIONES DE ADMIN CONFIG (localStorage)
══════════════════════════════════════════════════════════ */

function getAdminConfig() {
  try {
    const stored = localStorage.getItem('autosac_admin_config');
    if (stored) return JSON.parse(stored);
  } catch(e) {}

  // Configuración por defecto
  return {
    matriculaActiva: false,
    mensajeMatricula: 'Aún no estamos en temporada de matrículas. Pronto habilitaremos el proceso. ¡Pendiente! 📅',

    cupos: [
      { materia: 'Antenas y Propagación',     tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Telemática II',              tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Electiva I',                 tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Servicios Multimedia',       tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Filosofía Política',         tipo: 'HUM', disponible: true, nota: 'Cupo puede ser limitado' },
      { materia: 'Cátedra Optativa',           tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Comunicaciones Móviles',     tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Redes Ópticas',              tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Redes Convergentes',         tipo: 'TC', disponible: true,  nota: '' },
      { materia: 'Cálculo Diferencial',        tipo: 'CB', disponible: true,  nota: '' },
      { materia: 'Álgebra Lineal',             tipo: 'CB', disponible: true,  nota: '' },
      { materia: 'Química',                    tipo: 'CB', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 1',        tipo: 'ID', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 2',        tipo: 'ID', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 3',        tipo: 'ID', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 4',        tipo: 'ID', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 5',        tipo: 'ID', disponible: true,  nota: '' },
      { materia: 'Lengua Extranjera 6',        tipo: 'ID', disponible: true,  nota: '' },
    ],

    correos: [
      { area: 'Matrículas Teleco',        email: 'matriculasteleco@ustabuca.edu.co',     responsable: 'Secretaría de Teleco',                    descripcion: 'Cupos, adición y cancelación de materias de Telecomunicaciones' },
      { area: 'División Ing. Dirección',  email: 'dir.divingenierias@ustabuca.edu.co',   responsable: 'Fray Juan David Montes Flórez, O.P.',      descripcion: 'Dirección de la División de Ingenierías y Arquitecturas' },
      { area: 'División Ing. Secretaría', email: 'sec.divingenierias@ustabuca.edu.co',   responsable: 'Secretaria División Ingenierías',          descripcion: 'Certificados, grados, trámites generales de ingeniería' },
      { area: 'Comité Curricular',        email: 'ccurricular.teleco@ustabuca.edu.co',   responsable: 'Comité Curricular Teleco',                 descripcion: 'Homologaciones, validaciones, cambios en el plan de estudios' },
      { area: 'Docentes Teleco',          email: 'docentes_teleco@ustabuca.edu.co',      responsable: 'Cuerpo Docente Teleco',                    descripcion: 'Comunicaciones generales a todos los docentes de Teleco' },
      { area: 'Secretaría Teleco',        email: 'sectele@ustabuca.edu.co',              responsable: 'Secretaria de Telecomunicaciones',         descripcion: 'Trámites administrativos de la carrera' },
      { area: 'Ciencias Básicas CEDII',   email: 'cedii@ustabuca.edu.co',               responsable: 'Centro CEDII',                            descripcion: 'Materias de ciencias básicas: cálculo, física, química' },
      { area: 'C. Básicas Secretaría',    email: 'sec.cienciasbasicas@ustabuca.edu.co',  responsable: 'Secretaria Ciencias Básicas',              descripcion: 'Trámites administrativos de ciencias básicas' },
      { area: 'Humanidades Secretaría',   email: 'sec.humanidades@ustabuca.edu.co',      responsable: 'Secretaria Humanidades',                   descripcion: 'Materias de humanidades, idiomas y filosofía' },
      { area: 'Pagos / Crédito USTA',     email: 'crediusta@ustabuca.edu.co',            responsable: 'Oficina de Crédito USTA',                  descripcion: 'Financiación, crédito educativo, becas' },
      { area: 'Servicios Médicos',        email: 'sermeflo@ustabuca.edu.co',             responsable: 'Servicios Médicos Floridablanca',          descripcion: 'Excusas médicas, incapacidades, certificados médicos' },
      { area: 'Admisiones Pregrado',      email: 'admisiones.pregrado@usta.edu.co',      responsable: 'Dirección de Admisiones y Marketing',      descripcion: 'Proceso de admisión, matrícula nuevos estudiantes' },
    ],

    profesores: [
      { nombre: 'Edgar Mauricio Velasco Díaz',    email: 'edgar.velasco@ustabuca.edu.co',   materias: 'Telecomunicaciones, Antenas' },
      { nombre: 'Silene Beatriz Viloria Soto',    email: 'silene.viloria@ustabuca.edu.co',  materias: 'Telemática, Redes' },
      { nombre: 'Elizabeth Gelves Gelves',        email: 'elizabeth.gelves@ustabuca.edu.co',materias: 'Sistemas, Programación' },
      { nombre: 'Yuli Andrea Álvarez Pizarro',    email: 'yuli.alvarez01@ustabuca.edu.co',  materias: 'Humanidades, Cultura' },
      { nombre: 'Francisco Javier Dietes Cárdenas',email: 'francisco.dietes@ustabuca.edu.co',materias: 'Electrónica, Señales' },
      { nombre: 'Elvis Galvis',                   email: 'elvis.galvis@ustabuca.edu.co',    materias: 'Redes, Comunicaciones' },
    ],

    mensajeExtra: '',
    nombreBot: 'Auto-SAC',
    semestreActual: '2025-1',
  };
}

function saveAdminConfig(cfg) {
  localStorage.setItem('autosac_admin_config', JSON.stringify(cfg));
}
