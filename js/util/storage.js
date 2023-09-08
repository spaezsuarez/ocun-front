let players = {};
let settings = {};
let server = null;

function loadData() {
  players =
    sessionStorage.getItem('players') !== null
      ? JSON.parse(sessionStorage.getItem('players'))
      : [];
  settings =
    sessionStorage.getItem('settings') !== null
      ? JSON.parse(sessionStorage.getItem('settings'))
      : {
        team: null,
        members: null,
        type: null,
      };
  server = localStorage.getItem('server') !== null
    ? String(localStorage.getItem('server'))
    : null;
}

function endGame() {
  sessionStorage.clear();
}