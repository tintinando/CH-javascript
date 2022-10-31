// globales
const formAdmin = document.getElementById('administrar');
const selectAdmin = document.querySelector('#administrar select');
const tablaAdmin = document.getElementById('tablaAdmin');
const ventanaModal = document.getElementById('modalAdminEdit');

// renderiza tabla de administración
function renderizarTabla(id) {
  tablaAdmin.innerHTML = '';
  let arr = [];

  // elijo qué array usar según parámetro id
  switch (id) {
    case 'especialidades':
      arr = especialidades;
      break;

    case 'listaProfesionales':
      arr = listaProfesionales;
      break;

    case 'listaPacientes':
      arr = listaPacientes;
      break;
  }

  const table = document.createElement('table');
  // encabezado
  const thead = document.createElement('thead');
  const trth = document.createElement('tr');
  // creo los nombres de los campos
  for (const x of Object.keys(arr[0])) {
    const th = document.createElement('th');
    th.innerText = x;
    trth.append(th);
  }
  // celda cautiva arriba de los botones edit
  const th = document.createElement('th');
  th.className = 'row-edit';

  trth.append(th);
  thead.append(trth);
  table.append(thead);
  tablaAdmin.append(table);

  // cuerpo
  for (let obj of arr) {
    const tr = document.createElement('tr');
    // creo los campos del registro
    for (const x in obj) {
      const td = document.createElement('td');
      td.innerText = obj[x];
      tr.append(td);
    }
    // botón editar registro
    const td = document.createElement('td');
    td.className = 'row-edit';
    td.id = `edit-${id}-${obj.id}`; // ej: edit-especialidades-1
    td.dataset.open = 'modalAdminEdit';
    const ico = document.createElement('i');
    ico.className = 'fa-solid fa-pen';
    td.append(ico);
    tr.append(td);

    // agrego registro en la tabla
    table.append(tr);

    // evento editar registro
    const boton = document.getElementById(`edit-${id}-${obj.id}`);
    boton.addEventListener('click', () => {
      editarRegistro(obj,arr);
    });
  }
}
function editarRegistro(objeto,array) {
  console.log(objeto,array);
  // hago visible la ventana modal
  ventanaModal.classList.add('is-visible');

  // contenido de la ventana modal
  const modal = document.querySelector('#modalAdminEdit>div');
  modal.innerHTML = '';

  // formulario de edición
  for (const obj in objeto) {
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.innerText = obj;
    const input = document.createElement('input');
    if (typeof objeto[obj] === 'boolean') {
      input.type = 'checkbox';
      input.checked = objeto[obj];
    } else {
      input.value = objeto[obj];
    }
    div.append(label);
    div.append(input);
    modal.append(div);
  }

  // aceptar y cancelar
  const div = document.createElement('div');
  div.className = 'submit';
  const button = document.createElement('button');
  button.id = 'aceptarRegistro';
  button.type = 'submit';
  button.innerText = 'Aceptar';
  div.append(button);
  const button2 = document.createElement('button');
  button2.id = 'cancelarRegistro';
  button2.innerText = 'Cancelar';
  div.append(button2);
  modal.append(div);

  const aceptarRegistro = document.getElementById('aceptarRegistro');
  const cancelarRegistro = document.getElementById('cancelarRegistro');
  
  aceptarRegistro.addEventListener('click', () => {
    ventanaModal.classList.remove('is-visible');
    
  });

  cancelarRegistro.addEventListener('click', () => {
    ventanaModal.classList.remove('is-visible');
  });
}

// botón Administrar
formAdmin.addEventListener('submit', (event) => {
  event.preventDefault();
  // renderiza diferente tabla según el selector
  renderizarTabla(selectAdmin.value);
});