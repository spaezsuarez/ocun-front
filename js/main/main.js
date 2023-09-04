//HTML elements
const btnEndGame = document.getElementById('btn-end-game');
const btnStart = document.getElementById("boton-beginning");
const btnStop = document.getElementById("boton-finish");
const btnRestart = document.getElementById("btnRestartGame");
const btnRespondAnswer = document.getElementById('btnRespondAnswer');
const btnRespondErrorAnswer = document.getElementById('btnRespondErrorAnswer');
const btnPassTurn = document.getElementById('boton-pass');
//Variables del juego
let isActiveGame = false;
let currentPlayer = {
  index: 0,
  player: {}
};
let currentQuestion = {
  index: 0,
  question: {}
};
let currentIncorrectDeckQuestion = {
  index: 0,
  question: {}
};
let incorrectQuestions = [];
let correctQuestions = [];
let correctQuestionsIterator = 0;
let incorectQuestionsIterator = 0;
let segundos = 180; // Tiempo inicial en segundos
let intervalo; // Variable para almacenar el intervalo del cronómetro
let questions = sessionStorage.getItem("questions") !== null ? JSON.parse(sessionStorage.getItem("questions")) : [];

function showTimeStamp() {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  const formatoMinutos = minutos < 10 ? "0" + minutos : minutos;
  const formatoSegundos = segundosRestantes < 10 ? "0" + segundosRestantes : segundosRestantes;
  document.getElementById("timer").innerText = formatoMinutos + ":" + formatoSegundos;
}

function changePlayer() {
  players[currentPlayer.index].score = currentPlayer.player.score;
  players[currentPlayer.index].correctQuestions = currentPlayer.player.correctQuestions;
  if (currentPlayer.index === (players.length-1)) {
    currentPlayer.index = 0;
  } else {
    currentPlayer.index += 1;
  }
  currentPlayer.player = players[currentPlayer.index];
}

function changeShift(removeErrorCard = false) {
  //TODO: remplazar los puntajes de las preguntas que fueron respondidas incorrectamente,sacar las preguntas ya resultas
  currentQuestion.index = 0;
  const originalQuestions = [...questions];
  
  for(let i = 0; i < originalQuestions.length; i++){
    if(correctQuestions[correctQuestionsIterator] !== undefined && originalQuestions[i].number === correctQuestions[correctQuestionsIterator].number){
      console.log('Entro a borrar respuesta correcta ' + i);
      originalQuestions.splice(i, 1);
      correctQuestionsIterator++;
    }
    if(incorrectQuestions[incorectQuestionsIterator] !== undefined && originalQuestions[i].number === incorrectQuestions[incorectQuestionsIterator].number){
      console.log('Entro a borrar respuesta incorrecta ' + i);
      originalQuestions.splice(i, 1);
      incorectQuestionsIterator++;
    }
  }
  if(removeErrorCard){ç
    incorrectQuestions.splice(currentIncorrectDeckQuestion.index,1);
  }
  questions = originalQuestions;
  currentQuestion.question = questions[currentQuestion.index];
  loadDetailQuesion(currentQuestion.question);
  //TODO: Cambiar de jugador
  changePlayer();
  updateCurrentLabelPlayer();
  startTimer();

}

function startTimer() {
  if (intervalo) {
    stopTimer();
  }
  intervalo = setInterval(() => {
    segundos--;
    showTimeStamp();
    if (segundos <= 0) {
      stopTimer();
      restartTimer();
      changeShift();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalo);
  showTimeStamp();
}

function restartTimer() {
  segundos = 180; // Tiempo inicial en segundos
  showTimeStamp();
}

function updateCurrentLabelPlayer() {
  document.getElementById('jugador-actual').innerText = currentPlayer.player.name;
  document.getElementById('puntaje-actual').innerText = currentPlayer.player.score;
}

function startGame() {
  isActiveGame = true;
  updateCurrentLabelPlayer();
  startTimer();
}

//Manejo de eventos
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  currentQuestion.question = questions[0];
  currentPlayer.index = 0;
  currentPlayer.player = players[0];
  loadDetailQuesion(currentQuestion.question);

});

btnStart.addEventListener('click', startGame);
btnStop.addEventListener('click', stopTimer);
btnEndGame.addEventListener('click', endGame);
btnPassTurn.addEventListener('click', () => {
  changePlayer();
  updateCurrentLabelPlayer();
});

//Logica principal al oprimir reponder pregunta de la baraja principal
btnRespondAnswer.addEventListener('click', () => {
  if (isActiveGame) {
    if (currentQuestion.question.answer === currentAnswer) {
      console.log('Correcto');
      currentPlayer.player.score = currentPlayer.player.score + (currentQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      correctQuestions.push(currentQuestion.question);
      currentQuestion.index += 1;
      currentQuestion.question = questions[currentQuestion.index];
      loadDetailQuesion(currentQuestion.question);
      updateCurrentLabelPlayer();
    } else {
      restartTimer();
      let tempScorePlayer = currentPlayer.player.score - (currentQuestion.question.difficulty * 100);
      currentPlayer.player.score = (tempScorePlayer < 0) ? 0 : tempScorePlayer;
      currentQuestion.question.difficulty /= 2;
      incorrectQuestions.push(currentQuestion.question);
      currentQuestion.index += 1;
      currentQuestion.question = questions[currentQuestion.index];
      $('#detailquestion').modal('hide')
      changeShift();
    }
  }else{
    Swal.fire('Error','Asegurese de iniciar la partida','error');
  }
});

//Logica para responder pregunta en la baraja de preguntas incorrectas
btnRespondErrorAnswer.addEventListener('click',() => {
  console.log('click');
  if (isActiveGame) {
    if (currentIncorrectDeckQuestion.question.answer === currentIncorrectAnswer) {
      console.log('Correcto 2');
      currentPlayer.player.score = currentPlayer.player.score + (currentQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      //correctQuestions.push(currentQuestion.question);
      console.table(incorrectQuestions);
      incorrectQuestions.splice(currentIncorrectDeckQuestion.index,1);
      console.table(incorrectQuestions);
      currentIncorrectDeckQuestion.index += 1;
      currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      if(currentIncorrectDeckQuestion.question !== undefined){
        loadErrorQuesion(currentIncorrectDeckQuestion.question);
      }else{
        $('#errorQuestion').modal('hide');
      }
      updateCurrentLabelPlayer();
    } else {
      console.log('Incorrecto 2');
      currentIncorrectDeckQuestion.index = 0;
      currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      $('#errorQuestion').modal('hide')
      changeShift(true);
    }
    //TODO:Borrar preguntas incorrectas ya respondidas
  }else{
    Swal.fire('Error','Asegurese de iniciar la partida','error');
  }
});

document.getElementById('incorrectAnswerButton').addEventListener('click', () => {
  if(incorrectQuestions.length !== 0){
    loadErrorQuesion(incorrectQuestions[0]);
    $('#errorQuestion').modal('show');
  }
});
