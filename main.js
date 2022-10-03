/* El presente código simula una carga de datos para posterior registro en una base de datos */
let numArtefacto = -1; // inicializado a un valor inexistente
let registroArtefacto = "";

const solicitarNum = (alert) => {
  // solicita un número al usuario con mensaje opcional, y lo pasa a Float
  let mensaje = alert;
  if (alert === undefined) mensaje = 'Ingrese un número';
  return parseFloat(prompt(mensaje));
};

const adicionArtefacto = (numArtefacto) => {
  // A partir del código devuelve un string con el registro CSV
  const nomArtefacto = prompt("Ingrese el nombre del artefacto");
  const consumoArtefacto = prompt("Ingrese el consumo del artefacto en kwh/hora");
  return numArtefacto + "," + nomArtefacto + "," + consumoArtefacto;
};

while (numArtefacto !== 0) {
  // Pregunta artefacto por artefacto hasta salir
  numArtefacto = solicitarNum("Ingrese número de artefacto. 0 para salir");
  if (numArtefacto !== 0) {
    registroArtefacto = adicionArtefacto(numArtefacto);
  }
}

if (registroArtefacto !== "") alert("El último ingresado fue " + registroArtefacto);