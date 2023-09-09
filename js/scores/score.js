const tableBody = document.getElementById('table-body-rows');

function getTextPlayers(players){
    let response = '';
    players.forEach(element => {
        response += `<p>${element.name}(${element.correctQuestions}): ${element.score}</p>`;
    });
    return response;
}

function getTypeIcon(type){
    if(type === 'Avanzado'){
        return '<img src="../img/beer-table.svg" class="icon_table_beer">';
    }else if(type === 'Amateur'){
        return '<img src="../img/beer-table-amateur.svg" class="icon_table_beer">';
    }
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
        <th scope="row"><p>${i+1}</p></th>
        <td><p>${response[i].team}</p></td>
        <td><p class='score_table_type'>${response[i].type}:${getTypeIcon(response[i].type)}</p></td>
        <td><p class='score_table_column'>${getTextPlayers(response[i].players)}</p></td>
      </tr>`;
    }
    tableBody.innerHTML = htmlBody;
});

document.getElementById('btnHome').addEventListener('click',() => {
    window.location.replace(String(window.location).replace('pages/scores.html', 'index.html'));
});