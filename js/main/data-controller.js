const playersContainer = document.getElementsByClassName('players-container');
let htmlPlayerLabel = ``;

window.addEventListener("load", () => {
    const players = JSON.parse(sessionStorage.getItem('players'));
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    if(!players || !settings){
        Swal.fire('Error', 'Asegurese de realizar los ajustes de la partida', 'error');
        window.location.replace("index.html");
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
});