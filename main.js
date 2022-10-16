/* eslint-disable no-unused-vars */

// clases para instaciar objetos en falsa DB
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

// arrays que simularán una base de datos. Limitación: se pierde la DB al refrescar
let especialidades = [
  new Especialidades(1, "Clínica"),
  new Especialidades(2, "Traumatología"),
];

let listaProfesionales = [
  new Profesionales(120, "Romeo Santos", 2),
  new Profesionales(121, "Ramona García", 1),
];

let listaPacientes = [
  new Pacientes(38000000, "José Benítez", "31/10/2002"),
  new Pacientes(30000000, "Florencia Correa", "14/05/1985"),
];

let listaTurnos = [
  new Turnos(38000000, 120, "24/11/2022"),
];

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
    const fechaTurno = turnoBuscado.fecha;
    const profesionalTurno = listaProfesionales.find((idLista) => idLista.id === turnoBuscado.idProfesional).nombreCompleto;
    alert(`Paciente ${nomPaciente} tiene el turno ${fechaTurno} con ${profesionalTurno}`);
  }
};

// probar poniendo 38000000 (38 millones)
alertarTurno(buscarPaciente(parseInt(prompt("Ingrese ID del paciente"))).id);