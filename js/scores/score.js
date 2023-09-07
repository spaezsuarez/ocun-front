const tableBody = document.getElementById('table-body-rows');

function getTextPlayers(players){
    let response = '';
    players.forEach(element => {
        response += `<p>${element.name}(${element.correctQuestions}): ${element.score}</p>`;
    });
    return response;
}

document.addEventListener('DOMContentLoaded', async () => {
    if(localStorage.getItem('server') === undefined){
        Swal.fire('Error', 'Dirección del servidor nulo', 'error');
        return;
    }
    const response = await get(`/scores`);
    let htmlBody = ``;
    for(let i = 0; i < response.length; i++){
        htmlBody += `<tr>
        <th scope="row">${i+1}</th>
        <td>${response[i].team}</td>
        <td>${response[i].type}</td>
        <td>${getTextPlayers(response[i].players)}</td>
      </tr>`;
    }
    tableBody.innerHTML = htmlBody;
});