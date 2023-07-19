//Inicialización de objetos a utilizar
const btnStart = document.getElementById('btn-start');
const btnSettings = document.getElementById('btn-settings');
const btnsGroups = document.getElementsByClassName('btn-selection');

const players = (sessionStorage.getItem('players') !== null) ? JSON.parse(sessionStorage.getItem('players')) : {
    "firstPlyer": null,
    "secondPlayer": null,
    "thirdPlayer": null,
    "fourthPlayer": null
};

const settings = {
    "team":'',
    "members":0,
    "type":''
}
//Declaración de funciones
async function createPlayer(position, asignation) {
    if (players[asignation] !== null) {
        return;
    }

    const { value: nickName } = await Swal.fire({
        title: `Ingrese nombre de jugador ${position}`,
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
        players[asignation] = {
            "name": nickName,
            "score": 0,
            "correctQuestions": 0
        };
    }
}

function savePlayers() {
    let isValidPlayersData = true;
    for (let currentPlayer in players) {
        if (players[currentPlayer] === null) {
            isValidPlayersData = false;
            break;
        }
    }
    if (isValidPlayersData) {
        sessionStorage.setItem('players', JSON.stringify(players));
        window.location.replace("pages/main.html");
    } else {
        Swal.fire('Error', 'Asegurese de completar la información de los jugadores', 'error');
    }
}

function loadGroupData(event){
    const value = Number(event.target.innerText);
    settings.members = value;
}

// Uso de las funciones en la logica del boton para iniciar el juego
btnStart.addEventListener('click', async () => {
    await createPlayer(1, 'firstPlyer');
    await createPlayer(2, 'secondPlayer');
    await createPlayer(3, 'thirdPlayer');
    await createPlayer(4, 'fourthPlayer');
    savePlayers();
});

window.addEventListener('load',() => {
    for(let i = 0; i < btnsGroups.length; i++){
        btnsGroups[i].addEventListener('click',loadGroupData);
    }
});

btnSettings.addEventListener('click',() => {
    console.log(document.getElementById('nameGroupInput'));
    settings.team = document.getElementById('nameGroupInput').value;
    settings.type = document.getElementById('typeTest').value;
    sessionStorage.setItem('settings', JSON.stringify(settings));
    console.log(settings);
});