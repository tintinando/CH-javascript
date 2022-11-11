const DateTime = luxon.DateTime;

class Profesionales {
  constructor(id, nombreCompleto) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.visible = true;
  }
}

class Especialidades {
  constructor(id, titulo) {
    this.id = id;
    this.titulo = titulo;
    this.visible = true;
  }
}

class Turnos {
  constructor(idPaciente, idProfesional, fecha) {
    this.idPaciente = idPaciente;
    this.idProfesional = idProfesional;
    this.fecha = fecha;
  }
}

// tabla de unión para que un profesional pueda tener varias especialidades
class EspecialidadesProfesionales {
  constructor(idEspecialidad, idProfesional) {
    this.idEspecialidad = idEspecialidad;
    this.idProfesional = idProfesional;
    this.visible = true;
  }
}

class Pacientes {
  constructor(id, nombreCompleto, fechaNac) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.fechaNac = fechaNac;
    this.visible = true;
  }
}

// -------- LOCAL STORAGE --------
// función para recuperar objeto Date, obtenida de https://cwestblog.com/2022/02/07/json-parse-reviver-for-dates/
function dateReviver(key, value) {
  // If the value is a string and if it roughly looks like it could be a
  // JSON-style date string go ahead and try to parse it as a Date object.
  const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?/i;
  if (typeof value === 'string' && regex.test(value)) {
    const date = new DateTime.fromISO(value);
    // If the date is valid then go ahead and return the date object.
    if (+date === +date) {
      return date;
    }
  }
  // If a date was not returned, return the value that was passed in.
  return value;
}

// globales
let listaProfesionales = [];
let especialidades = [];
let listaPacientes = [];
let especialidadProfesionales = [];
let listaTurnos = [];

// guarda DB en LocalStorage
function setDBLS() {
  localStorage.setItem('listaProfesionales', JSON.stringify(listaProfesionales));
  localStorage.setItem('especialidades', JSON.stringify(especialidades));
  localStorage.setItem('listaPacientes', JSON.stringify(listaPacientes));
  setTurnosDBLS();
  localStorage.setItem('especialidadProfesionales', JSON.stringify(especialidadProfesionales));
}
function setTurnosDBLS() {
  localStorage.setItem('listaTurnos', JSON.stringify(listaTurnos));
}

// obtiene DB del LocalStorage
function getDBLS() {
  listaProfesionales = JSON.parse(localStorage.getItem('listaProfesionales'));
  especialidades = JSON.parse(localStorage.getItem('especialidades'));
  listaPacientes = JSON.parse(localStorage.getItem('listaPacientes'));
  listaTurnos = JSON.parse(localStorage.getItem('listaTurnos'), dateReviver);
  especialidadProfesionales = JSON.parse(localStorage.getItem('especialidadProfesionales'));
}

// permite saber si la version de LocalStorage es obsoleta
const versionDB = 1;
function existeDBLS() {
  const versionDBLS = localStorage.getItem('versionDB');
  if (versionDBLS !== null || versionDBLS >= versionDB) {
    obtenerDB(false); // usar DBLS
  } else {
    localStorage.clear();
    obtenerDB(true); // crear DB
  }
}
existeDBLS();

async function obtenerDB(DB) {
  if (DB) {
    const allPromise = await Promise.all([
      fetch('./DB/especialidades.json'),
      fetch('./DB/especialidadesProfesionales.json'),
      fetch('./DB/pacientes.json'),
      fetch('./DB/profesionales.json'),
      fetch('./DB/turnos.json'),
    ]);
    /// text() en vez de json() para poder usar dateReviver
    let allList = await Promise.all(allPromise.map((r) => {
      return r.text();
    }));
    allList = allList.map((r) => JSON.parse(r, dateReviver));

    especialidades = allList[0];
    especialidadProfesionales = allList[1];
    listaPacientes = allList[2];
    listaProfesionales = allList[3];
    listaTurnos = allList[4];
    setDBLS();
    localStorage.setItem('versionDB', versionDB);
  } else {
    getDBLS();
  }

  crearSelectorPacientes();
}