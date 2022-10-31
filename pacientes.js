const selectPaciente = document.getElementById('selectPaciente');
const selectEspecialidad = document.getElementById('selectEspecialidad');
const selectProfesional = document.getElementById('selectProfesional');

// carga de elementos el selector pacientes
for (const paciente of listaPacientes) {
  if (paciente.visible) {
    const option = document.createElement('option');
    option.value = paciente.id;
    option.innerText = paciente.nombreCompleto;
    selectPaciente.append(option);
  }
}

// muestra en pantalla los turnos del paciente 
selectPaciente.addEventListener('change', () => {
  const arrTurnos = listaTurnos.filter((id) => {
    return id.idPaciente == selectPaciente.value;
  });
  const pacientesTurnos = document.getElementById('pacientes--turnos');
  let registroTurno = '';

  for (const turno of arrTurnos) {
    const miProfesional = listaProfesionales.find((x) => {
      return x.id == turno.idProfesional;
    });

    registroTurno += `
    <tr>
      <td>${miProfesional.nombreCompleto}</td>
      <td>${turno.fecha.toLocaleString(DateTime.DATETIME_MED)}</td>
      <td class="row-edit"><i class="fa-solid fa-rectangle-xmark"></i></td>
    </tr>
    `;
  }

  pacientesTurnos.innerHTML = `
  <table>
    <tr><th colspan=2>Turnos del paciente</th></tr>
    <tr><th colspan=2>Implementación parcial. No se pueden borrar registros</th></tr>
    <tr>
      <th>Profesional</th>
      <th>Fecha</th>
    </tr>
    ${registroTurno}
  </table>
  `;
});

// carga de elementos al selector especialidades
for (const especialidad of especialidades) {
  if (especialidad.visible) {
    const option = document.createElement('option');
    option.value = especialidad.id;
    option.innerText = especialidad.titulo;
    selectEspecialidad.append(option);
  }
}

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
    return x.idEspecialidad == selectEspecialidad.value;
  });
  // busca en la tabla recién filltrada los profesionales
  const profesionalesSelector = listaProfesionales.filter((x) => {
    return profesionalesSelectorId.some((y) => {
      return y.idProfesional === x.id;
    });
  });

  // carga de elementos al selector Profesionales
  for (const profesional of profesionalesSelector) {
    if (profesional.visible) {
      const option = document.createElement('option');
      option.value = profesional.id;
      option.innerText = profesional.nombreCompleto;
      selectProfesional.append(option);
    }
  }
});


// al elegir profesional genera un calendario
selectProfesional.addEventListener('change', () => {
  let turnoElegido = null;
  //devuelve array con TODOS los turnos del profesional
  const busyHoursPrev = listaTurnos.filter((f) => {
    return f.idProfesional == selectProfesional.value;
  });
  const busyHours = busyHoursPrev.map((map) => map.fecha);

  // generar calendario en pantalla
  let miCal = new Calendar('calendar--container');

  // deshabilitar horas ocupadas
  miCal.setBusy(busyHours);
  miCal.getElement().addEventListener('change', () => {
    turnoElegido = miCal.value();
  });
  miCal.getElement().addEventListener('submit', () => {
    if (selectPaciente.value !== '' && turnoElegido !== null) {
      listaTurnos.push(new Turnos(parseInt(selectPaciente.value), parseInt(selectProfesional.value), turnoElegido));
      setTurnosDBLS();
      alert(`Turno agendado con éxito`);
      turnoElegido = null;
      miCal.remove();
    }
  });
});
