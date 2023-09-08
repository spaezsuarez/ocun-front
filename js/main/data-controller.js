const playersContainer = document.getElementsByClassName('players-container');
const infoHeader = document.getElementById('info-header');
const infoBody = document.getElementById('info-body');
const errorHeader = document.getElementById('error-header');
const errorBody = document.getElementById('error-body');
let currentAnswer;
let multupleCurrentAnswer = new Set();
let multipleErrorAnswers = new Set();
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

function setMultipleAnswer(event){
    const isElementChecked = document.getElementById(`${event.target.getAttribute('for')}`).checked;
    if(!isElementChecked){
        multupleCurrentAnswer.add(event.target.innerText);
    }else{
        multupleCurrentAnswer.delete(event.target.innerText);
    }
}

function getDetailQuestionForm(type,questionData){
    let response = '';
    let options = [];
    let multipleOption = '';
    switch(type){
        case 'Verdadero Falso':
            response = `<div class="btn-group multiple-option-wrapper" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="btnradio" id="btntrue" autocomplete="off">
            <label class="btn btn-outline-success" for="btntrue" onclick="setCurrentAnswer(event)">Verdadero</label>
            <input type="radio" class="btn-check" name="btnradio" id="btnfalse" autocomplete="off">
            <label class="btn btn-outline-danger" for="btnfalse" onclick="setCurrentAnswer(event)">Falso</label>
            </div>`;
            return response;

        case 'Opción múltiple':
            options = questionData.options.split('\n');
            for (let i = 0; i < options.length; i++)
                multipleOption += `<input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio${i+1}" autocomplete="off">
                <label class="btn btn-outline-success" onclick="setCurrentAnswer(event)" for="vbtn-radio${i+1}">${options[i]}</label>`;
            response = `<div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">${multipleOption}</div>`;
            return response;

        case 'Respuesta múltiple':
            options = questionData.options.split('\n');
            for (let i = 0; i < options.length; i++)
                multipleOption += `<input type="checkbox" class="btn-check" id="btn-check${i+1}" autocomplete="off">
                <label class="btn btn btn-outline-success" onclick="setMultipleAnswer(event)" for="btn-check${i+1}">${options[i]}</label>`;
            response = `<div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">${multipleOption}</div>`;
            return response;

    }
    return response;
}

function loadDetailQuesion(currentQuestion) {
    console.log(currentQuestion);
    /*const options = (currentQuestion.type !== 'Verdadero Falso') ? currentQuestion.options.split('\n') : [];
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
          <input type="radio" class="btn-check" name="btnradio" id="btntrue" autocomplete="off">
          <label class="btn btn-outline-success" for="btntrue" onclick="setCurrentAnswer(event)">Verdadero</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnfalse" autocomplete="off">
          <label class="btn btn-outline-danger" for="btnfalse" onclick="setCurrentAnswer(event)">Falso</label>
        </div>`;*/

    infoHeader.innerHTML = `<h1 class="modal-title fs-5" id="exampleModalLabel">${currentQuestion.clasification}: ${currentQuestion.subclasification} - ${currentQuestion.type}</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    infoBody.innerHTML = `<p>${currentQuestion.question}</p> ${getDetailQuestionForm(currentQuestion.type,currentQuestion)}`;
}

function setCurrentIncorrectAnswer(event) {
    console.log('Entro a seleccionar respuesta de barajaa incorrecta');
    console.log(currentIncorrectAnswer);
    currentIncorrectAnswer = event.target.innerText;
}

function setMultipleErrorAnswer(event){
    const isElementChecked = document.getElementById(`${event.target.getAttribute('for')}`).checked;
    if(!isElementChecked){
        multipleErrorAnswers.add(event.target.innerText);
    }else{
        multipleErrorAnswers.delete(event.target.innerText);
    }
}

function getDetailQuestionErrorForm(type,questionData){
    let response = '';
    let options = [];
    let multipleOption = '';
    switch(type){
        case 'Verdadero Falso':
            response = `<div class="btn-group multiple-option-wrapper" role="group" aria-label="Basic radio toggle button group">
            <input type="radio" class="btn-check" name="btnradio" id="btn-error-true" autocomplete="off">
            <label class="btn btn-outline-success" for="btn-error-true" onclick="setCurrentIncorrectAnswer(event)">Verdadero</label>
            <input type="radio" class="btn-check" name="btnradio" id="btn-error-false" autocomplete="off">
            <label class="btn btn-outline-danger" for="btn-error-false" onclick="setCurrentIncorrectAnswer(event)">Falso</label>
            </div>`;
            return response;

        case 'Opción múltiple':
            options = questionData.options.split('\n');
            for (let i = 0; i < options.length; i++)
                multipleOption += `<input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-error-radio${i+1}" autocomplete="off">
                <label class="btn btn-outline-success" onclick="setCurrentIncorrectAnswer(event)" for="vbtn-error-radio${i+1}">${options[i]}</label>`;
            response = `<div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">${multipleOption}</div>`;
            return response;

        case 'Respuesta múltiple':
            options = questionData.options.split('\n');
            for (let i = 0; i < options.length; i++)
                multipleOption += `<input type="checkbox" class="btn-check" id="btn-error-check${i+1}" autocomplete="off">
                <label class="btn btn btn-outline-success" onclick="setMultipleErrorAnswer(event)" for="btn-error-check${i+1}">${options[i]}</label>`;
            response = `<div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">${multipleOption}</div>`;
            return response;

    }
    return response;
}

function loadErrorQuesion(errorQuestion) {
    console.log(errorQuestion);
    /*const options = (errorQuestion.type !== 'Verdadero Falso') ? errorQuestion.options.split('\n') : [];
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
          <input type="radio" class="btn-check" name="btnradio" id="errorbtntrue">
          <label class="btn btn-outline-success" for="errorbtntrue" onclick="setCurrentIncorrectAnswer(event)">Verdadero</label>
          <input type="radio" class="btn-check" name="btnradio" id="errorbtnfalse">
          <label class="btn btn-outline-danger" for="errorbtnfalse" onclick="setCurrentIncorrectAnswer(event)">Falso</label>
        </div>`;*/

    errorHeader.innerHTML = `<h1 class="modal-title fs-5" id="exampleModalLabel">${errorQuestion.clasification}: ${errorQuestion.subclasification} - ${errorQuestion.type}</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    errorBody.innerHTML = `<p>${errorQuestion.question}</p> ${getDetailQuestionErrorForm(errorQuestion.type,errorQuestion)}`;
};

window.addEventListener("load", async () => {
    loadData();
    loadPlayers();
});