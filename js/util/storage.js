let players = {};

let settings = {};

function loadData() {
  players =
    sessionStorage.getItem("players") !== null
      ? JSON.parse(sessionStorage.getItem("players"))
      : [];
  settings =
    sessionStorage.getItem("settings") !== null
      ? JSON.parse(sessionStorage.getItem("settings"))
      : {
          team: null,
          members: null,
          type: null,
        };
}

function endGame(){
  sessionStorage.clear();
  window.location.replace(String(window.location).replace('pages/main.html','index.html'));
}