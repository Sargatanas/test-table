function loadTable() {
    let people = JSON.parse(localStorage.getItem('data'));

    // Количество записей на странице
    let size = document.getElementById('size').value;

    // Пагинация
    createPages(people.countStr, size);
    let currentPage = 1;

    // Вывод таблицы
    constructTable(people, currentPage, size);
}

// Вывод пагинации
function createPages(total, size) {
    let countPage = Math.ceil(total / size);

    let pages = document.getElementById('pages');
    pages.innerHTML = '';

    for (let i = 1; i <= countPage; i++) {
        let optionPage = document.createElement('option');
        optionPage.value = i;
        if (i === 1) {
            optionPage.setAttribute('selected','true');
        }
        optionPage.innerText = i.toString();

        pages.appendChild(optionPage);
    }
}

// Отрисовка таблицы
function constructTable(dataArray, currentPage, size) {
    let table = document.getElementById('table');

    let firstStringNum = size * (currentPage - 1);
    let lastStringNum = size * currentPage;
    let totalStringNum = dataArray.countStr;

    // Отображение шапки таблицы
    let str = document.createElement('tr');
    for (let j = 0; j <= dataArray.countCol; j++) {
        let col = document.createElement('th');
        col.innerText = j === 0 ? 'ФИО' : 'Поле ' + j;
        str.appendChild(col);
    }
    table.appendChild(str);

    // Отображение контента
    for (let i = firstStringNum; i < lastStringNum; i++) {

        str = document.createElement('tr');
        if (i <= totalStringNum) {
            for (let j = 0; j <= dataArray.countCol; j++) {
                let col = document.createElement('td');
                col.innerText = j === 0 ?
                    dataArray.data[i].name :
                    dataArray.data[i].facts['Fact_' + j];
                str.appendChild(col);
            }
        }
        table.appendChild(str);
    }
}