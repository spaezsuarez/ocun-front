const nameGroup = document.getElementById('nameGroupInput');
const typeTest = document.getElementById('typeTest');

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    nameGroup.value = String((settings.team !== null)?settings.team:'');
    for (let i = 0; i < btnsGroups.length; i++) {
        const stylesCurrentNode = btnsGroups[i].classList;
        if(Number(btnsGroups[i].innerHTML) === settings.members){
            stylesCurrentNode.add('radio-selection');
        }
    }
    typeTest.value = settings.type;
});
  