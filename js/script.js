(function loadTable() {
    let people = JSON.parse(localStorage.getItem('data'));

    // Количество записей на странице
    let vSize = document.getElementById('v-size');
    let hSize = document.getElementById('h-size');

    // Первичный вывод таблицы
    createPages(people, vSize.value, hSize.value);
    constructTable(people, 1, vSize.value, hSize.value, 0);

    // Обновление таблицы
    vSize.addEventListener('change', function () {
        vSize = document.getElementById('v-size');

        constructTable(people, 1, vSize.value, hSize.value, 0);
        createPages(people, vSize.value, hSize.value);
    });
    hSize.addEventListener('change', function () {
        hSize = document.getElementById('h-size');

        constructTable(people, 1, vSize.value, hSize.value, 0);
        createPages(people, vSize.value, hSize.value);
    });
})();


// Вывод пагинации
function createPages(dataArray, vSize, hSize) {
    let countPage = Math.ceil(dataArray.countStr / vSize);

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
        constructTable(dataArray, pages.value, vSize, hSize, 0);
    });
}


// Отрисовка таблицы
function constructTable(dataArray, currentPage, vSize, hSize, hShift) {
    let table = document.getElementById('table');
    table.innerText = '';

    // Рассчет границ вывода
    vSize = Number(vSize);
    hSize = Number(hSize);
    hShift = Number(hShift);

    let totalStringNum = dataArray.countStr;
    let firstStringNum = vSize * (currentPage - 1);
    let lastStringNum = vSize * currentPage;
    lastStringNum = Math.min(lastStringNum, totalStringNum);

    let totalColumnNum = dataArray.countCol;

    let firstColumnNum = hShift + 1;
    let lastColumnNum = firstColumnNum + hSize - 1;
    lastColumnNum = Math.min(lastColumnNum, totalColumnNum);

    // Отображение шапки таблицы
    let str = document.createElement('tr');
    let col = document.createElement('th');
    col.innerText = 'ФИО';
    str.appendChild(col);

    // Добавление кнопки прокрутки столбцов назад
    col = document.createElement('th');
    col.rowSpan = vSize + 1;

    let colButton  = document.createElement('button');
    colButton.innerText = '<';
    colButton.addEventListener('click', function () {
        if ( hShift !== Math.max(0, hShift - 1)) {
            constructTable(dataArray, currentPage, vSize, hSize, hShift - 1);
        }
    });
    col.appendChild(colButton);

    str.appendChild(col);

    for (let i = firstColumnNum; i <= lastColumnNum; i++) {
        col = document.createElement('th');
        col.innerText = 'Поле ' + i;
        str.appendChild(col);
    }
    table.appendChild(str);

    // Добавление кнопки прокрутки столбцов вперед
    col = document.createElement('th');
    col.rowSpan = vSize + 1;

    colButton  = document.createElement('button');
    colButton.innerText = '>';
    colButton.addEventListener('click', function () {
        if ( hShift !== Math.min(hShift + 1, totalColumnNum - hSize)) {
            constructTable(dataArray, currentPage, vSize, hSize, hShift + 1);
        }
    });
    col.appendChild(colButton);

    str.appendChild(col);

    // Отображение контента
    for (let i = firstStringNum; i < lastStringNum; i++) {

        str = document.createElement('tr');

        let col = document.createElement('td');
        col.innerText = dataArray.data[i].name;
        str.appendChild(col);

        for (let j = firstColumnNum; j <= lastColumnNum; j++) {
            col = document.createElement('td');
            col.innerText = dataArray.data[i].facts['Fact_' + j];
            str.appendChild(col);
        }
        table.appendChild(str);
    }
}
