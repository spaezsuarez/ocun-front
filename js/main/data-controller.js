window.addEventListener("load", (event) => {
    const players = JSON.parse(sessionStorage.getItem('players'));
    if(players){
        document.getElementById('label-player-1').innerText = players["firstPlyer"].name;
        document.getElementById('label-player-2').innerText = players["secondPlayer"].name;
        document.getElementById('label-player-3').innerText = players["thirdPlayer"].name;
        document.getElementById('label-player-4').innerText = players["fourthPlayer"].name;
    }
    
});