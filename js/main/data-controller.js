const playersContainer = document.getElementsByClassName('players-container');
const infoHeader = document.getElementById('info-header');
const infoBody = document.getElementById('info-body');
const errorHeader = document.getElementById('error-header');
const errorBody = document.getElementById('error-body');
let currentAnswer;
let currentIncorrectAnswer;

function loadPlayers() {
    let htmlPlayerLabel = ``;
    const players = JSON.parse(sessionStorage.getItem('players'));
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    if (!players || !settings) {
        Swal.fire('Error', 'Asegurese de realizar los ajustes de la partida', 'error');
        endGame();
        return;
    }
    for (let index = 0; index < settings.members; index++) {
        const id = `label-player-${index + 1}`;
        htmlPlayerLabel += `
        <div class="player">
            <div id="${id}">${players[index].name}</div>
            <div class="score">0</div>
        </div>`;
    }
    playersContainer[0].innerHTML = htmlPlayerLabel;
}

function setCurrentAnswer(event) {
    currentAnswer = event.target.innerText;
}

function loadDetailQuesion(currentQuestion) {
    console.table(currentQuestion);
    const options = (currentQuestion.type !== 'Verdadero Falso') ? currentQuestion.options.split('\n') : [];
    let multipleOption = '';

    for (let i = 0; i < options.length; i++) {
        multipleOption += `<input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio${i + 1}" autocomplete="off">
        <label class="btn btn-outline-success" onclick="setCurrentAnswer(event)" for="vbtn-radio${i + 1}">${options[i]}</label>`;
    }

    let answerOptions = currentQuestion.type !== 'Verdadero Falso'
        ? ` <div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
              ${multipleOption}
        </div>`
        : `<div class="btn-group multiple-option-wrapper" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="btntrue" autocomplete="off" checked>
          <label class="btn btn-outline-success" for="btntrue" onclick="setCurrentAnswer(event)">Verdadero</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnfalse" autocomplete="off">
          <label class="btn btn-outline-danger" for="btnfalse" onclick="setCurrentAnswer(event)">Falso</label>
        </div>`;

    infoHeader.innerHTML = `<h1 class="modal-title fs-5" id="exampleModalLabel">${currentQuestion.clasification}: ${currentQuestion.subclasification} - ${currentQuestion.type}</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    infoBody.innerHTML = `<p>${currentQuestion.question}</p> ${answerOptions}`;
};

function setCurrentIncorrectAnswer(event) {
    console.log('Entro a seleccionar respuesta de barajaa incorrecta')
    currentIncorrectAnswer = event.target.innerText;
}

function loadErrorQuesion(errorQuestion) {
    console.table(errorQuestion);
    const options = (errorQuestion.type !== 'Verdadero Falso') ? errorQuestion.options.split('\n') : [];
    let multipleOption = '';

    for (let i = 0; i < options.length; i++) {
        multipleOption += `<input type="radio" class="btn-check" name="vbtn-radio" id="errorvbtn-radio${i + 1}" autocomplete="off">
        <label class="btn btn-outline-success" onclick="setCurrentIncorrectAnswer(event)" for="errorvbtn-radio${i + 1}">${options[i]}</label>`;
    }

    let answerOptions = errorQuestion.type !== 'Verdadero Falso'
        ? ` <div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
              ${multipleOption}
        </div>`
        : `<div class="btn-group multiple-option-wrapper" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="errorbtntrue" autocomplete="off" checked>
          <label class="btn btn-outline-success" for="errorbtntrue" onclick="setCurrentIncorrectAnswer(event)">Verdadero</label>
          <input type="radio" class="btn-check" name="btnradio" id="errorbtnfalse" autocomplete="off">
          <label class="btn btn-outline-danger" for="errorbtnfalse" onclick="setCurrentIncorrectAnswer(event)">Falso</label>
        </div>`;

    errorHeader.innerHTML = `<h1 class="modal-title fs-5" id="exampleModalLabel">${errorQuestion.clasification}: ${errorQuestion.subclasification} - ${errorQuestion.type}</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    errorBody.innerHTML = `<p>${errorQuestion.question}</p> ${answerOptions}`;
};

window.addEventListener("load", async () => {
    loadData();
    loadPlayers();
});