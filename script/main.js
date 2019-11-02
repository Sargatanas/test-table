(function loadTable() {
    let people = JSON.parse(localStorage.getItem('data'));

    // Количество записей на странице
    let size = document.getElementById('size');

    size.addEventListener('change', function () {
        size = document.getElementById('size');
        constructTable(people, 1, size.value);
        createPages(people, size.value);
    });

    // Пагинация
    createPages(people, size.value);
    let currentPage = 1;

    // Вывод таблицы
    constructTable(people, currentPage, size.value);
})();

// Вывод пагинации
function createPages(dataArray, size) {
    let countPage = Math.ceil(dataArray.countStr / size);

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

    pages.addEventListener('change', function () {
        constructTable(dataArray, pages.value, size);
    });
}

// Отрисовка таблицы
function constructTable(dataArray, currentPage, size) {
    let table = document.getElementById('table');
    table.innerText = '';

    let totalStringNum = dataArray.countStr;
    let firstStringNum = size * (currentPage - 1);
    let lastStringNum = size * currentPage;
    lastStringNum = Math.min(lastStringNum, totalStringNum);

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
        for (let j = 0; j <= dataArray.countCol; j++) {
            let col = document.createElement('td');
            col.innerText = j === 0 ?
                dataArray.data[i].name :
                dataArray.data[i].facts['Fact_' + j];
            str.appendChild(col);
        }
        table.appendChild(str);
    }
}