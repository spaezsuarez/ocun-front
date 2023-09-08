//HTML elements
const btnEndGame = document.getElementById('btn-end-game');
const btnStart = document.getElementById("boton-beginning");
const btnStop = document.getElementById("boton-finish");
const btnRestart = document.getElementById("btnRestartGame");
const btnRespondAnswer = document.getElementById('btnRespondAnswer');
const btnRespondErrorAnswer = document.getElementById('btnRespondErrorAnswer');
const btnPassTurn = document.getElementById('boton-pass');
//Variables del juego
let isGameActive = false;
let isGameFinished = false;
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

function updatePlayerScore(){
  players[currentPlayer.index].score = currentPlayer.player.score;
  players[currentPlayer.index].correctQuestions = currentPlayer.player.correctQuestions;
  console.log(players);
  console.log(currentPlayer);
}

function changePlayer() {
  if (currentPlayer.index === (players.length - 1)) {
    currentPlayer.index = 0;
  } else {
    currentPlayer.index += 1;
  }
  currentPlayer.player = {...players[currentPlayer.index]};
}

async function submitGameData(){
  return await post('/scores',{
    players,
    settings
  });
}

function updateDeck() {
  const originalQuestions = [...questions];
  for (let i = 0; i < originalQuestions.length; i++) {
    if (originalQuestions[i].game_data.isCorrectAnswered) {
      console.log('Caso 1, respondido correctamente');
      originalQuestions.splice(i, 1);
    } else if (originalQuestions[i].game_data.hasSecondLife) {
      console.log('Caso 2, Agregada a baraja de palabras incorrectas');
      console.log(questions);
      incorrectQuestions.push({ ...originalQuestions[i] });
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
  if (questions.length === 0 && incorrectQuestions.length === 0) {
    $('#detailquestion').modal('hide');
    $('#errorQuestion').modal('hide');
    isGameActive = false;
    isGameFinished = true;
    submitGameData();
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Felicidades acabaste la partida',
      showConfirmButton: false,
      timer: 1500
    });
    window.location.replace("scores.html");
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
  isGameActive = true;
  $('#boton-beginning').prop('disabled', true);
  updateCurrentLabelPlayer();
  startTimer();
}

function validateAnswer(realQuestion, selectedAnswer, multipleSelectedAnswers) {
  if (realQuestion.type === 'Respuesta múltiple') {
    let comparation = 0;
    const options = realQuestion.answer.split('@');
    multipleSelectedAnswers.forEach((element) => {
      console.log(options);
      console.log(element);
      if(options.includes(element)){
        comparation++;
      }
    });
    return comparation === options.length;
  } else {
    return realQuestion.answer === selectedAnswer;
  }
}

btnStart.addEventListener('click', (event) => {
  startGame();
});
btnStop.addEventListener('click', stopTimer);
btnEndGame.addEventListener('click', endGame);
btnPassTurn.addEventListener('click', () => {
  changePlayer();
  updatePlayerScore();
  restartTimer();
  updateCurrentLabelPlayer();
  updateDeck();
});

//Logica principal al oprimir reponder pregunta de la baraja principal
btnRespondAnswer.addEventListener('click', () => {
  if (isGameActive) {
    //console.log(questions.length);
    //console.log(incorrectQuestions.length);
    if (validateAnswer(currentQuestion.question, currentAnswer, multupleCurrentAnswer)) {
      console.log('Correcto');
      currentPlayer.player.score = currentPlayer.player.score + (currentQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      questions[currentQuestion.index].game_data.isCorrectAnswered = true;
      currentQuestion.index += 1;
      currentQuestion.question = { ...questions[currentQuestion.index] };
      updatePlayerScore();
      updateDeck();
      if (questions.length !== 0) {
        loadDetailQuesion(currentQuestion.question);
      } else {
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
      currentQuestion.question = { ...questions[currentQuestion.index] };
      //currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      $('#detailquestion').modal('hide');
      updatePlayerScore();
      updateDeck();
      changeShift();
      loadDetailQuesion(currentQuestion.question);
      //loadErrorQuesion(currentIncorrectDeckQuestion.question);
      restartTimer();
    }
  } else {
    Swal.fire('Error', 'Asegurese de iniciar la partida', 'error');
  }
});


//Logica para responder pregunta en la baraja de preguntas incorrectas
btnRespondErrorAnswer.addEventListener('click', () => {
  if (isGameActive) {
    if (validateAnswer(currentIncorrectDeckQuestion.question, currentIncorrectAnswer, multipleErrorAnswers)) {
      console.log('Correcto 2');
      currentPlayer.player.score = currentPlayer.player.score + (currentIncorrectDeckQuestion.question.difficulty * 100);
      currentPlayer.player.correctQuestions += 1;
      //correctQuestions.push(currentQuestion.question);
      //incorrectQuestions.splice(currentIncorrectDeckQuestion.index,1);
      incorrectQuestions[currentIncorrectDeckQuestion.index].game_data.needToBeDeleted = true;
      currentIncorrectDeckQuestion.index += 1;
      currentIncorrectDeckQuestion.question = incorrectQuestions[currentIncorrectDeckQuestion.index];
      if (currentIncorrectDeckQuestion.question !== undefined) {
        currentIncorrectDeckQuestion.index = 0;
        updatePlayerScore();
        updateDeck();
        loadErrorQuesion(currentIncorrectDeckQuestion.question);
      } else {
        updateDeck();
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
      updatePlayerScore();
      updateDeck();
      changeShift();
    }
    //TODO:Borrar preguntas incorrectas ya respondidas
    //updateDeck(true);
  } else {
    Swal.fire('Error', 'Asegurese de iniciar la partida', 'error');
  }
});

document.getElementById('incorrectAnswerButton').addEventListener('click', () => {
  if (incorrectQuestions[currentIncorrectDeckQuestion.index] !== undefined) {
    currentIncorrectDeckQuestion.question = { ...incorrectQuestions[currentIncorrectDeckQuestion.index] }
    loadErrorQuesion(currentIncorrectDeckQuestion.question);
    $('#errorQuestion').modal('show');
  }
});

document.getElementById('questionButton').addEventListener('click', () => {
  console.log(isGameActive);
  console.log(questions);
  if (isGameActive && questions.length !== 0) {
    $('#detailquestion').modal('show');
  }
});

//Manejo de eventos
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  currentQuestion.question = { ...questions[0] };
  currentQuestion.index = 0;
  currentPlayer.index = 0;
  currentPlayer.player = {...players[0]};
  loadDetailQuesion(currentQuestion.question);
});
