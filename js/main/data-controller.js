const playersContainer = document.getElementsByClassName('players-container');
const modalWrapper = document.getElementById("detailquestion");
const modalHeader = document.getElementsByClassName('modal-header')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];

function loadPlayers(){
    let htmlPlayerLabel = ``;
    const players = JSON.parse(sessionStorage.getItem('players'));
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    if(!players || !settings){
        Swal.fire('Error', 'Asegurese de realizar los ajustes de la partida', 'error');
        endGame();
        return;
    }
    for(let index = 0; index < settings.members; index++){
        const id = `label-player-${index+1}`;
        htmlPlayerLabel += `
        <div class="player">
            <div id="${id}">${players[index].name}</div>
            <div class="score">0</div>
        </div>`;
    }
    playersContainer[0].innerHTML = htmlPlayerLabel;
}

function loadDetailQuesion (currentQuestion) {
    const options = (currentQuestion.type !== 'Verdadero Falso') ?currentQuestion.options.split('\n') : [];
    let multipleOption = '';

    for(let i = 0; i < options.length; i++){
        multipleOption += `<input type="radio" class="btn-check" name="vbtn-radio" id="vbtn-radio${i+1}" autocomplete="off">
        <label class="btn btn-outline-success" for="vbtn-radio${i+1}">${options[i]}</label>`;
    }
    
    let answerOptions = currentQuestion.type === 'Opción múltiple'
        ? ` <div class="btn-group-vertical" role="group" aria-label="Vertical radio toggle button group">
              ${multipleOption}
        </div>`
      : `<div class="btn-group multiple-option-wrapper" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="btntrue" autocomplete="off" checked>
          <label class="btn btn-outline-success" for="btntrue">Verdadero</label>
          <input type="radio" class="btn-check" name="btnradio" id="btnfalse" autocomplete="off">
          <label class="btn btn-outline-danger" for="btnfalse">Falso</label>
        </div>`;
  
    modalHeader.innerHTML = `<h1 class="modal-title fs-5" id="exampleModalLabel">${currentQuestion.clasification}: ${currentQuestion.subclasification} - ${currentQuestion.type}</h1>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`;
    modalBody.innerHTML = `<p>${currentQuestion.question}</p> ${answerOptions}`;
  
  };

window.addEventListener("load", async () => {
    loadData();
    loadPlayers();
});