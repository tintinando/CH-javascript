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
  let regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?([zZ]|([+-])([01]\d|2[0-3]):?([0-5]\d)?)?/i;
  if ('string' === typeof value && regex.test(value)) {
    let date = new DateTime.fromISO(value);
    // If the date is valid then go ahead and return the date object.
    if (+date === +date) {
      return date;
    }
  }
  // If a date was not returned, return the value that was passed in.
  return value;
}

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

let listaProfesionales = [];
let especialidades = [];
let listaPacientes = [];
let especialidadProfesionales = [];
let listaTurnos = [];

// inicializo DB
// marca que permite saber si se inició LocalStorage antes
const existeDB = localStorage.getItem('helloWorld');
if (existeDB === null) {
  listaProfesionales = [
    new Profesionales(120, "Romeo Santos"),
    new Profesionales(121, "Ramona García"),
    new Profesionales(122, 'Edmundo Parra'),
    new Profesionales(123, 'Guadalupe Quispe'),
    new Profesionales(124, 'Ramona Estigarribia'),
  ];

  especialidades = [
    new Especialidades(1, "Clínica"),
    new Especialidades(2, "Traumatología"),
    new Especialidades(3, 'Oftalmología'),
    new Especialidades(4, 'Nutrición'),
  ];

  especialidadProfesionales = [
    new EspecialidadesProfesionales(1, 120),
    new EspecialidadesProfesionales(2, 121),
    new EspecialidadesProfesionales(3, 122),
    new EspecialidadesProfesionales(4, 123),
    new EspecialidadesProfesionales(1, 123),
    new EspecialidadesProfesionales(1, 122),
    new EspecialidadesProfesionales(3, 123),
  ];

  listaPacientes = [
    new Pacientes(37000000, 'José Benítez', new DateTime.fromISO('2002-10-31')),
    new Pacientes(30000000, 'Florencia Correa', new DateTime.fromISO('1985-05-14')),
    new Pacientes(36000007, 'Analía Sandoval', new DateTime.fromISO('1981-08-17')),
    new Pacientes(14000000, 'Carlos Viale', new DateTime.fromISO('1954-11-20')),
  ];

  listaTurnos = [
    new Turnos(37000000, 120, new DateTime.fromISO('2022-11-07T09:00')),
    new Turnos(36000007, 121, new DateTime.fromISO('2022-11-07T09:30')),
    new Turnos(30000000, 122, new DateTime.fromISO('2022-11-07T10:00')),
    new Turnos(14000000, 123, new DateTime.fromISO('2022-11-07T10:30')),
    new Turnos(36000007, 124, new DateTime.fromISO('2022-11-07T11:00')),
    new Turnos(30000000, 121, new DateTime.fromISO('2022-11-07T12:30')),
  ];
  localStorage.setItem('helloWorld', '');
  setDBLS();
} else {
  getDBLS();
}
