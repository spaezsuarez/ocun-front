//HTML elements
/*const boton_empezar_juego = document.querySelector(".boton-top");
const pila_inicial = document.querySelector("#pila-inicial");
const carta_mazo = document.querySelector(".carta-mazo");
const seleccionada = document.querySelector("#seleccionada");*/
const btnEndGame = document.getElementById('btn-end-game');
const btnStart = document.getElementById("boton-beginning");
const btnStop = document.getElementById("boton-finish");
const btnRestart = document.getElementById("boton-pass");

//Variables del juego
const questions =
  sessionStorage.getItem("questions") !== null
    ? JSON.parse(sessionStorage.getItem("questions"))
    : [];
let currentQuestion = {};

function actualizarNombreJugador(nombre) {
  document.getElementById("jugador-actual").innerText = nombre;
  console.log(nombre);
}

// Llamamos a la función para cambiar los nombres cuando sea necesario
function turnoActual(turno) {
  switch (turno) {
    case 0:
      actualizarNombreJugador("Error");
      break;
    case 1:
      actualizarNombreJugador(
        document.getElementById("label-player-1").innerText
      );
      break;

    case 2:
      actualizarNombreJugador(
        document.getElementById("label-player-1").innerText
      );
      break;
    case 3:
      actualizarNombreJugador(
        document.getElementById("label-player-1").innerText
      );
      break;
    case 4:
      actualizarNombreJugador(
        document.getElementById("label-player-1").innerText
      );
      break;
  }
}
//turnoActual(1);
// Datos

//  ---------- TABLERO INICIAL ----------

//  ---------- JUEGO ----------
let segundos = 180; // Tiempo inicial en segundos
let intervalo; // Variable para almacenar el intervalo del cronómetro

function mostrarTiempo() {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  const formatoMinutos = minutos < 10 ? "0" + minutos : minutos;
  const formatoSegundos = segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes;
  document.getElementById("timer").innerText = formatoMinutos + ":" + formatoSegundos;
}

function iniciarCronometro() {
  if (intervalo) {
    detenerCronometro();
  }
  intervalo = setInterval(() => {
    segundos--;
    mostrarTiempo();
    if (segundos <= 0) {
      alert("¡Tiempo finalizado!");
      detenerCronometro();
    }
  }, 1000);
}

function detenerCronometro() {
  clearInterval(intervalo);
  mostrarTiempo();
}

function reiniciarCronometro() {
  segundos = 180; // Tiempo inicial en segundos
  mostrarTiempo();
}


//Manejo de eventos
document.addEventListener('DOMContentLoaded', () => {
  currentQuestion = questions[0];
  loadDetailQuesion(currentQuestion);
});

btnStart.addEventListener('click', iniciarCronometro);
btnStop.addEventListener('click', detenerCronometro);
btnRestart.addEventListener('click', reiniciarCronometro);
btnEndGame.addEventListener('click',endGame);