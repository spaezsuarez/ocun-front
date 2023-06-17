window.addEventListener("load", (event) => {
    const players = JSON.parse(localStorage.getItem('players'));
    document.getElementById('label-player-1').innerText = players["firstPlyer"];
    document.getElementById('label-player-2').innerText = players["secondPlayer"];
    document.getElementById('label-player-3').innerText = players["thirdPlayer"];
    document.getElementById('label-player-4').innerText = players["fourthPlayer"];
});