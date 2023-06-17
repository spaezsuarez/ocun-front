//HTML elements
const boton_empezar_juego = document.querySelector(".boton-top");
const pila_inicial = document.querySelector("#pila-inicial");
const carta_mazo = document.querySelector(".carta-mazo");
const seleccionada = document.querySelector("#seleccionada");


// Constants
// Obtenemos los datos del archivo .csv con fetch()
fetch('datos.csv')
  .then(response => response.text())
  .then(data => {
    // Analizamos los datos con Papa Parse y los convertimos en un objeto JavaScript
    const parsedData = Papa.parse(data, { header: true }).data;
    // Hacemos algo con los datos, por ejemplo, los mostramos en la consola
    console.log(parsedData);
  });


// Datos


//  ---------- TABLERO INICIAL ----------

//  ---------- JUEGO ----------

// ---------- Funciones auxiliares ----------

window.addEventListener("load", (event) => {
  console.log("page is fully loaded");
});