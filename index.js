//Inicialización de objetos a utilizar
const btnStart = document.getElementById('btn-start');
const btnSettings = document.getElementById('btn-settings');
const btnsGroups = document.getElementsByClassName('btn-selection');
const btnServerSettings = document.getElementById('btn-url');
const btnRedirectTable = document.getElementById('btn-table');

function saveSettings() {
    settings.team = document.getElementById('nameGroupInput').value;
    settings.type = document.getElementById('typeTest').value;
    sessionStorage.setItem('settings', JSON.stringify(settings));
}

function resetPlayers() {
    players = [];
    sessionStorage.removeItem('players');
}

function saveGameData(questions) {
    let isValidPlayersData = true;
    for (let currentPlayer in players) {
        if (players[currentPlayer] === null) {
            isValidPlayersData = false;
            break;
        }
    }
    if (isValidPlayersData) {
        sessionStorage.setItem('players', JSON.stringify(players));
        sessionStorage.setItem('questions', JSON.stringify(questions));
    } else {
        Swal.fire('Error', 'Asegurese de completar la información de los jugadores', 'error');
    }
}

async function createPlayer(position) {
    if (players[position] !== undefined) {
        return;
    }

    const { value: nickName } = await Swal.fire({
        title: `Ingrese nombre de jugador ${position + 1}`,
        input: 'text',
        inputLabel: 'Nombre:',
        showCancelButton: false,
        allowOutsideClick: false,
        confirmButtonColor: '#4d908e',
        inputValidator: (value) => {
            if (!value) {
                return 'El nombre no puede ser vacio';
            }
        }
    });
    if (nickName !== undefined) {
        players[position] = {
            "name": nickName,
            "score": 0,
            "correctQuestions": 0
        };
    }
}

function loadGroupData(event) {
    for (let i = 0; i < btnsGroups.length; i++) {
        const stylesCurrentNode = btnsGroups[i].classList;
        if (stylesCurrentNode.contains('radio-selection')) {
            stylesCurrentNode.remove('radio-selection');
        }
    }
    settings.members = Number(event.target.innerText);
    event.target.classList.add('radio-selection');
}

async function consultQuestions() {
    try {
        return await get(`/questions?category=${settings.type}`);
    } catch (error) {
        return null;
    }
}

// Manejadores de eventos
window.addEventListener('load', () => {
    loadData();
    for (let i = 0; i < btnsGroups.length; i++) {
        btnsGroups[i].addEventListener('click', loadGroupData);
    }
});

function cleanBooleanValues(questions){
    const response = [...questions];
    for(let i = 0; i < questions.length; i++){
        if(response[i].type === 'Verdadero Falso'){
            response[i].answer = (response[i].answer)? 'Verdadero' : 'Falso';
        }
    }
    return response;
}

btnStart.addEventListener('click', async () => {
    if (settings.members === null) {
        Swal.fire('Error', 'Asegurese de realizar los ajustes de la partida', 'error');
        return;
    }
    for (let position = 0; position < settings.members; position++) {
        await createPlayer(position);
    }
    const questions = await consultQuestions(server);
    if (questions === null) {
        Swal.fire('Error', 'No hay conexion con el servidor o no se encuentra configurado', 'error');
        return;
    }
    saveGameData(cleanBooleanValues(questions));
    window.location.replace("pages/main.html");
});


btnSettings.addEventListener('click', () => {
    saveSettings();
    resetPlayers();
});

btnServerSettings.addEventListener('click', () => {
    const url = String(document.getElementById('serverInput').value);
    if(url === '' || url === null || url === undefined){
        Swal.fire('Error', 'La dirección no puede ser vacia', 'error');
        return;
    }
    localStorage.setItem('server', url);
    Swal.fire('Info', 'Información guardada de forma exitosa', 'success');
});

btnRedirectTable.addEventListener('click',() => {
    window.location.replace("pages/scores.html");
});