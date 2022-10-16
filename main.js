/* eslint-disable no-unused-vars */

// --------  CLASES --------
class Pacientes {
  constructor(id, nombreCompleto, fechaNac) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.fechaNac = fechaNac;
  }
}

class Profesionales {
  constructor(id, nombreCompleto, idEspecialidad) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.idEspecialidad = idEspecialidad;
  }
}

class Turnos {
  constructor(idPaciente, idProfesional, fecha) {
    this.idPaciente = idPaciente;
    this.idProfesional = idProfesional;
    this.fecha = fecha;
  }
}

class Especialidades {
  constructor(idEspecialidad, titulo) {
    this.idEspecialidad = idEspecialidad;
    this.titulo = titulo;
  }
}

// ------ FALSA BASE DE DATOS --------
let especialidades = [
  new Especialidades(1, "Clínica"),
  new Especialidades(2, "Traumatología"),
];

let listaProfesionales = [
  new Profesionales(120, "Romeo Santos", 2),
  new Profesionales(121, "Ramona García", 1),
];

let listaPacientes = [
  new Pacientes(38000000, "José Benítez", new Date("2002-10-31")),
  new Pacientes(30000000, "Florencia Correa", new Date("1985-05-14")),
];

let listaTurnos = [
  new Turnos(38000000, 120, new Date(2022, 11, 15, 10, 30, 0, 0)),
];

// -------- FUNCIONES --------
// fn para pedir un número por prompt
const numUser = (texto) => {
  if (texto === undefined) texto = "Ingrese un número";
  let num = parseInt(prompt(texto));
  if (isNaN(num)) num = 0;
  return num;
};

// fn que pide fecha por prompt y devuelvo objeto Date
const pedirFecha = () => {
  const day = numUser("Ingrese día");
  const month = numUser("Ingrese mes");
  const year = numUser("Ingrese año");
  const hour = numUser("Ingrese hora");
  const minute = numUser("Ingrese minutos");
  return new Date(year, month, day, hour, minute, 0, 0);
};

// fn que convierte el objeto Date a un string amigable
const fechaString = (date) => {
  let arrayFecha = [
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
  ];
  for (let i = 0; i < arrayFecha.length; i++) {
    arrayFecha[i] = arrayFecha[i].toString().padStart(2, "0");
  }
  return `${arrayFecha[0]}/${arrayFecha[1]}/${arrayFecha[2]} a las ${arrayFecha[3]}:${arrayFecha[4]}`;
};

// fn que busca paciente en la DB y si no está lo agrega
const buscarPaciente = (id) => {
  let pacienteBuscado = listaPacientes.find((idLista) => idLista.id === id);
  if (pacienteBuscado === undefined) {
    listaPacientes.push(new Pacientes(id, prompt("Ingrese nombre"), prompt("Ingrese fecha de nacimiento")));
    pacienteBuscado = listaPacientes[listaPacientes.length - 1];
  }
  return pacienteBuscado;
};

// fn que busca si el paciente tiene turno
// limitación: solo devuelve un turno por paciente
const alertarTurno = (id) => {
  const turnoBuscado = listaTurnos.find((idLista) => idLista.idPaciente === id);
  const nomPaciente = listaPacientes.find((idLista) => idLista.id === id).nombreCompleto;

  if (turnoBuscado === undefined) {
    alert(`Paciente ${nomPaciente} no tiene turnos`);
  } else {
    const fechaTurno = fechaString(turnoBuscado.fecha);
    const profesionalTurno = listaProfesionales.find((idLista) => idLista.id === turnoBuscado.idProfesional).nombreCompleto;
    alert(`Paciente ${nomPaciente} tiene el turno ${fechaTurno} con ${profesionalTurno}`);
  }
};

// fn que recibe la consulta del turno. Devuelve booleano
const pedirTurno = (idPaciente, idProfesional, fecha) => {
  const turnoOcupado = listaTurnos.find((idFilter) => {
    return idFilter.fecha.getTime() === fecha.getTime() && idFilter.idProfesional === idProfesional;
  });

  if (turnoOcupado === undefined) {
    listaTurnos.push(new Turnos(idPaciente, idProfesional, fecha));
    return true;
  } else return false;
};

// -------- IMPLEMENTACION --------
// probar poniendo 38000000 (38 millones)
// alertarTurno(buscarPaciente(parseInt(prompt("Ingrese ID del paciente"))).id);

// intentar pedir turno para 38000000 profesional 120 15/11/2022 10:30
const hayTurno = pedirTurno(38000000, 120, new Date(2022, 11, 15, 10, 30, 0, 0));
console.log(hayTurno);