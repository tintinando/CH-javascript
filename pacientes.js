const selectPaciente = document.getElementById('selectPaciente');
const botonVerTurnos = document.getElementById('verTurnos');
const botonPedirTurnos = document.getElementById('pedirTurnos');
const pacientesTurnos = document.getElementById('pacientes--turnos');
const formProfesional = document.getElementById('formProfesional');
let miCal = null;

function crearSelectorPacientes() {
  // carga de elementos el selector pacientes
  const listaPacientes2 = listaPacientes.sort((a, b) => {
    if (a.nombreCompleto > b.nombreCompleto) return 1;
    if (a.nombreCompleto < b.nombreCompleto) return -1;
    return 0;
  });

  for (const paciente of listaPacientes2) {
    if (paciente.visible) {
      const option = document.createElement('option');
      option.value = paciente.id;
      option.innerText = paciente.nombreCompleto;
      selectPaciente.append(option);
    }
  }

  // al modificar paciente limpia la página
  selectPaciente.addEventListener('change', () => {
    pacientesTurnos.innerHTML = '';
    formProfesional.innerHTML = '';
  });
}
function listarTurnos() {
  // muestra en pantalla los turnos del paciente
  const arrTurnos = listaTurnos.filter((id) => id.idPaciente === parseInt(selectPaciente.value, 10));

  let registroTurno = '';

  for (const turno of arrTurnos) {
    // busca el nombre del profesional de este registro de turno
    const miProfesional = listaProfesionales.find((x) => x.id === turno.idProfesional);

    registroTurno += `
    <tr>
      <td>${miProfesional.nombreCompleto}</td>
      <td>${turno.fecha.toLocaleString(DateTime.DATETIME_MED)}</td>
      <td class="row-edit">
        <i data-profesional=${miProfesional.id} data-fecha=${turno.fecha.toISO()} class="fa-solid fa-rectangle-xmark"></i></td>
    </tr>
    `;
  }

  if (arrTurnos.length === 0) {
    registroTurno = `
      <tr>
        <td colspan=2>No se encontraron turnos</td>
      </tr>
    `;
  }

  pacientesTurnos.innerHTML = `
  <table>
    <tr><th colspan=2>Turnos del paciente</th></tr>
    <tr>
      <th>Profesional</th>
      <th>Fecha</th>
    </tr>
    ${registroTurno}
  </table>
  `;

  addEventListenerTurnos();
}

function addEventListenerTurnos() {
  // botones eliminar de Lista Turnos
  const botonEliminar = pacientesTurnos.querySelectorAll('.row-edit');

  botonEliminar.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      const turnoProfesional = e.target.dataset.profesional;
      const turnoFecha = e.target.dataset.fecha;
      // buscar índice donde está el turno a eliminar
      const indiceBorrar = listaTurnos.findIndex((x) => {
        return x.idProfesional === parseInt(turnoProfesional, 10) && x.fecha.toISO() === turnoFecha;
      });

      // eliminar turno
      listaTurnos.splice(indiceBorrar, 1);
      setTurnosDBLS();
      listarTurnos();
    });
  });
}

function crearSelectorProfesionales() {
  pacientesTurnos.innerHTML = '';
  formProfesional.innerHTML = '';
  if (miCal instanceof Calendar) miCal.remove();

  // crea los selectores especialidades y Profesonales
  const selectEspecialidad = document.createElement('select');
  const selectProfesional = document.createElement('select');

  // carga de elementos al selector especialidades
  // encabezado
  const optionEsp = document.createElement('option');
  optionEsp.setAttribute('disabled', '');
  optionEsp.setAttribute('selected', '');
  optionEsp.setAttribute('hidden', '');
  optionEsp.innerText = 'Especialidad';
  selectEspecialidad.append(optionEsp);

  // valores
  const especialidades2 = especialidades.sort((a, b) => {
    if (a.titulo > b.titulo) return 1;
    if (a.titulo < b.titulo) return -1;
    return 0;
  });

  for (const especialidad of especialidades2) {
    const option = document.createElement('option');
    option.value = especialidad.id;
    option.innerText = especialidad.titulo;
    selectEspecialidad.append(option);
  }

  // agrego el selector Especialidad al formulario
  formProfesional.appendChild(selectEspecialidad);

  // al elegir especialidad carga profesionales
  selectEspecialidad.addEventListener('change', () => {
    selectProfesional.innerHTML = '';
    // encabezado
    const option = document.createElement('option');
    option.setAttribute('disabled', '');
    option.setAttribute('selected', '');
    option.setAttribute('hidden', '');
    option.innerText = 'Elija profesional';
    selectProfesional.append(option);

    // filtra la tabla de union mostrando solo la especialidad elegida
    const profesionalesSelectorId = especialidadProfesionales.filter((x) => {
      return x.idEspecialidad === parseInt(selectEspecialidad.value, 10);
    });

    // busca en la tabla recién filltrada los profesionales
    let profesionalesSelector = listaProfesionales.filter((x) => {
      return profesionalesSelectorId.some((y) => {
        return y.idProfesional === x.id;
      });
    });

    // carga de elementos al selector Profesionales
    profesionalesSelector = profesionalesSelector.sort((a, b) => {
      if (a.nombreCompleto > b.nombreCompleto) return 1;
      if (a.nombreCompleto < b.nombreCompleto) return -1;
      return 0;
    });

    for (const profesional of profesionalesSelector) {
      if (profesional.visible) {
        const optionProf = document.createElement('option');
        optionProf.value = profesional.id;
        optionProf.innerText = profesional.nombreCompleto;
        selectProfesional.append(optionProf);
      }
    }
    formProfesional.appendChild(selectProfesional);
  });

  // al elegir profesional genera un calendario
  selectProfesional.addEventListener('change', () => {
    let turnoElegido = null;
    // devuelve array con TODOS los turnos del profesional
    const busyHoursPrev = listaTurnos.filter((f) => {
      return f.idProfesional === parseInt(selectProfesional.value, 10);
    });
    // genera un array con solo las fechas
    const busyHours = busyHoursPrev.map((map) => map.fecha);

    // generar calendario en pantalla
    miCal = new Calendar('calendar--container');

    // deshabilitar horas ocupadas
    miCal.setBusy(busyHours);

    // genera nuevo turno cuando se dio aceptar en el calendario
    miCal.getElement().addEventListener('submit', () => {
      turnoElegido = miCal.value();
      if (selectPaciente.value !== '' && turnoElegido !== null) {
        listaTurnos.push(
          new Turnos(
            parseInt(selectPaciente.value, 10),
            parseInt(selectProfesional.value, 10),
            turnoElegido,
          ),
        );
        setTurnosDBLS();
        const gcal = confirm('Turno agendado con éxito\n¿Guardar en Google Calendar?');
        if (gcal) {
          // recupero nombre del profesional
          const miProfesional = listaProfesionales.find((x) => {
            return x.id === parseInt(selectProfesional.value, 10);
          });

          // genero URL de Google Calendar
          window.open(`http://www.google.com/calendar/event?action=TEMPLATE&text=Visita%20con%20${miProfesional.nombreCompleto}&dates=${turnoElegido.toFormat("yyyyLLdd'T'HHmmss")}/${turnoElegido.plus(1800000).toFormat("yyyyLLdd'T'HHmmss")}`, '_blank');
        }

        turnoElegido = null;
        miCal.remove();
        listarTurnos();
      }
    });
  });
}

// lista los turnos con un clic, solo si se eligió paciente
botonVerTurnos.addEventListener('click', (e) => {
  e.preventDefault();
  if (selectPaciente.value !== 'selectPacienteDefault') listarTurnos();
});

// genera selector de especialidades para pedir turno
botonPedirTurnos.addEventListener('click', (e) => {
  e.preventDefault();
  crearSelectorProfesionales();
});
