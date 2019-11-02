(function createTable() {
    let people = JSON.parse(localStorage.getItem('data'));

    let table = document.getElementById('table');
    for (let i = -1; i < people.countStr; i++) {

        let str = document.createElement('tr');

        for (let j = 0; j <= people.countCol; j++) {
            let col = i === -1 ? document.createElement('th') : document.createElement('td');

            let content;
            if (i === -1) {
                content = j === 0 ? 'ФИО' : 'Поле ' + j;
            } else {
                content = j === 0 ?
                    people.data[i].name :
                    people.data[i].facts['Fact_' + j];
            }
            col.innerText = content;
            str.appendChild(col);
        }
        table.appendChild(str);
    }
})();