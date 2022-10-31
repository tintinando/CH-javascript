//  uso función para encapsular las variables
function crearHeader() {
  const miHeader = document.querySelector('header');
  const menu = [
    {
      titulo: 'Inicio',
      url: '/index.html'
    },
    {
      titulo: 'Turnos para pacientes',
      url: '/pages/pacientes.html'
    },
    {
      titulo: 'Administración',
      url: '/pages/admin.html'
    }
  ];

  const nav = document.createElement('nav');
  const ul = document.createElement('ul');

  for (let x of menu) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = x.url;
    a.innerText = x.titulo;
    li.appendChild(a);
    ul.append(li);
  }
  nav.append(ul);
  miHeader.append(nav);
}

crearHeader();