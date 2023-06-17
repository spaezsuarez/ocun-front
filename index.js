const btnStart = document.getElementById('btn-start');
const players = {
    "firstPlyer":null,
    "secondPlayer":null,
    "thirdPlayer":null,
    "fourthPlayer":null
};

async function obtainName(position,asignation) {
    const { value: namePlayer } = await Swal.fire({
        title: `Ingrese nombre de jugador ${position}`,
        input: 'text',
        inputLabel: 'Nombre:',
        showCancelButton: false,
        inputValidator: (value) => {
            if (!value) {
                return 'El nombre no puede ser vacio'
            }
        }
    })
    if (namePlayer)
        players[asignation] = namePlayer;

    console.table(players);
}

function savePlayers(){
    localStorage.setItem('players',JSON.stringify(players));
    window.location.replace("pages/main.html");
}

btnStart.addEventListener('click', async () => {
    await obtainName(1,'firstPlyer');
    await obtainName(2,'secondPlayer');
    await obtainName(3,'thirdPlayer');
    await obtainName(4,'fourthPlayer');
    savePlayers();
});