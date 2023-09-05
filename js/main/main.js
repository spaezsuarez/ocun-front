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

function updateDeck(){
  const originalQuestions = [...questions];
  for(let i = 0; i < originalQuestions.length; i++){
    if(originalQuestions[i].game_data.isCorrectAnswered){
      console.log('Caso 1, respondido correctamente');
      originalQuestions.splice(i, 1);
    }else if(originalQuestions[i].game_data.hasSecondLife){
      console.log('Caso 2, Agregada a baraja de palabras incorrectas');
      console.log(questions);
      incorrectQuestions.push({...originalQuestions[i]});
      originalQuestions.splice(i, 1);
      console.log(originalQuestions);
      // console.log(incorrectQuestions);
    }
  }
  const originalIncorrectQuestions = [...incorrectQuestions];
  incorrectQuestions = originalIncorrectQuestions.filter(item => !item.game_data.needToBeDeleted);
  questions = originalQuestions;
  currentQuestion.index = 0;
  currentIncorrectDeckQuestion.index = 0;
  currentQuestion.question = questions[currentQuestion.index];
  console.log(questions.length);
  
  //TODO: Validar cuando no queden cartas en el mazo
  if(questions.length === 0){

  }
}

function changeShift() {
  //TODO: remplazar los puntajes de las preguntas que fueron respondidas incorrectamente,sacar las preguntas ya resultas
  //updateDeck();
  //loadDetailQuesion(currentQuestion.question);
  //TODO: Cambiar de jugador
  $('#errorQuestion').modal('hide');
  $('#detailquestion').modal('hide');
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
  $('#boton-beginning').prop('disabled', true);
  updateCurrentLabelPlayer();
  startTimer();
}

//Manejo de eventos
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  currentQuestion.question = {...questions[0]};
  currentQuestion.index = 0;
  currentPlayer.index = 0;
  currentPlayer.player = players[0];
  loadDetailQuesion(currentQuestion.question);

});

btnStart.addEventListener('click', (event) => {
  startGame();
});
btnStop.addEventListener('click', stopTimer);
btnEndGame.addEventListener('click', endGame);
btnPassTurn.addEventListener('click', () => {
  changePlayer();
  restartTimer();
  updateCurrentLabelPlayer();
  updateDeck();
});

function validateAnswer(realQuestion,selectedAnswer){
  console.log(realQuestion.answer);
  console.log(selectedAnswer);
  if(realQuestion.type === 'Respuesta múltiple'){
    const options = realQuestion.answer.split('@');
    return options.includes(selectedAnswer);
  }else {
    console.log('Caso Normal');
    return realQuestion.answer === selectedAnswer;
  }
}

//Logica principal al oprimir reponder pregunta de la baraja principal
btnRespondAnswer.addEventListener('click', () => {
  if (isActiveGame) {
    console.log(questions.length);
    console.log(incorrectQuestions.length);
    if(questions.length === 0 && incorrectQuestions.length === 0){
      $('#detailquestion').modal('hide');
      $('#errorQuestion').modal('hide');
      alert('ACABO');
      return;
    }

    if (validateAnswer(currentQuestion.question,currentAnswer)) {
      console.log('Correcto');
      currentPlayer.player.score = currentPlayer.player.score + (currentQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      questions[currentQuestion.index].game_data.isCorrectAnswered = true;
      currentQuestion.index += 1;
      currentQuestion.question = {...questions[currentQuestion.index]};
      updateDeck();
      if(questions.length !== 0) {
        loadDetailQuesion(currentQuestion.question);
      }else {
        $('#detailquestion').modal('hide');
      }
      updateCurrentLabelPlayer();
    } else {
      console.log('Incorrecto');
      let tempScorePlayer = currentPlayer.player.score - (currentQuestion.question.difficulty * 100);
      currentPlayer.player.score = (tempScorePlayer < 0) ? 0 : tempScorePlayer;
      questions[currentQuestion.index].difficulty /= 2;
      questions[currentQuestion.index].game_data.hasSecondLife = true;
      currentQuestion.index += 1;
      currentQuestion.question = {...questions[currentQuestion.index]};
      //currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      $('#detailquestion').modal('hide');
      updateDeck();
      changeShift();
      loadDetailQuesion(currentQuestion.question);
      restartTimer();
    }
  }else{
    Swal.fire('Error','Asegurese de iniciar la partida','error');
  }
});


//Logica para responder pregunta en la baraja de preguntas incorrectas
btnRespondErrorAnswer.addEventListener('click',() => {
  if (isActiveGame) {
    //TODO: Tener en cuenta tipo para comparar mpas de una posible respuesta
    if (validateAnswer(currentIncorrectDeckQuestion.question,currentIncorrectAnswer)) {
      console.log('Correcto 2');
      currentPlayer.player.score = currentPlayer.player.score + (currentQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      //correctQuestions.push(currentQuestion.question);
      //incorrectQuestions.splice(currentIncorrectDeckQuestion.index,1);
      incorrectQuestions[currentIncorrectDeckQuestion.index].game_data.needToBeDeleted = true;
      currentIncorrectDeckQuestion.index += 1;
      currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      if(currentIncorrectDeckQuestion.question !== undefined){
        currentIncorrectDeckQuestion.index = 0;
        updateDeck();
        loadErrorQuesion(currentIncorrectDeckQuestion.question);
      }else{
        $('#errorQuestion').modal('hide');
      }
      updateCurrentLabelPlayer();
    } else {
      console.log('Incorrecto 2');
      let tempScorePlayer = currentPlayer.player.score - (currentIncorrectDeckQuestion.question.difficulty * 100);
      currentPlayer.player.score = (tempScorePlayer < 0) ? 0 : tempScorePlayer;
      currentIncorrectDeckQuestion.question.game_data.needToBeDeleted = true;
      currentIncorrectDeckQuestion.index += 1;
      currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      $('#errorQuestion').modal('hide');
      updateDeck();
      changeShift();
    }
    //TODO:Borrar preguntas incorrectas ya respondidas
    //updateDeck(true);
  }else{
    Swal.fire('Error','Asegurese de iniciar la partida','error');
  }
});

document.getElementById('incorrectAnswerButton').addEventListener('click', () => {
  if(incorrectQuestions[currentIncorrectDeckQuestion.index] !== undefined){
    currentIncorrectDeckQuestion.question = {...incorrectQuestions[currentIncorrectDeckQuestion.index]}
    loadErrorQuesion(currentIncorrectDeckQuestion.question);
    $('#errorQuestion').modal('show');
  }
});
