(function loadTable() {
    // Начальные данные
    let config = {
        array: JSON.parse(localStorage.getItem('data')),
        page: 1,
        width: Number(document.getElementById('h-size').value),
        height: Number(document.getElementById('v-size').value),
        getShift: 0
    };

    // Первичный вывод таблицы
    createPages(config);
    constructTable(config);

    // Обновление таблицы
    document.getElementById('v-size').addEventListener('change', function () {
        config.height = Number(document.getElementById('v-size').value);
        config.page = 1;
        createPages(config);
        constructTable(config);
    });

    document.getElementById('h-size').addEventListener('change', function () {
        config.width = Number(document.getElementById('h-size').value);
        config.getShift = 0;
        constructTable(config);
    });
})();


// Вывод пагинации
function createPages(config) {
    let countPage = Math.ceil(config.array.countStr / config.height);

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
        config.page = Number(pages.value);
        constructTable(config);
    });
}

// Отрисовка таблицы
function constructTable(config) {
    let table = document.getElementById('table');
    table.innerText = '';

    // Расчет границ по высоте
    let firstStringNum = config.height * (config.page - 1);
    let lastStringNum = config.height * config.page;
    lastStringNum = Math.min(lastStringNum, config.array.countStr);
    config['strStart'] = firstStringNum;
    config['strEnd'] = lastStringNum;

    // расчет границ по ширине
    let firstColumnNum = config.getShift + 1;
    let lastColumnNum = firstColumnNum + config.width - 1;
    lastColumnNum = Math.min(lastColumnNum, config.array.countCol);
    config['colStart'] = firstColumnNum;
    config['colEnd'] = lastColumnNum;

    table.appendChild(constructTableHeader(config));

    constructTableBody(config).forEach(function(tableRow) {
        table.appendChild(tableRow);
    });

}

// Отрисовка шапки таблицы
function constructTableHeader(config) {
    let row = document.createElement('tr');
    row.classList.add('table-main-content__row');
    row.classList.add('table-main-content__row_header');

    let cell = document.createElement('th');
    cell.innerText = 'ФИО';
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_header');
    cell.classList.add('table-main-content__cell_name');

    row.appendChild(cell);

    // Добавление кнопки прокрутки столбцов влево
    row.appendChild(setButtonLeft(config));

    for (let i = config.colStart; i <= config.colEnd; i++) {
        cell = document.createElement('th');
        cell.innerText = 'Поле ' + i;
        cell.classList.add('table-main-content__cell');
        cell.classList.add('table-main-content__cell_header');

        row.appendChild(cell);
    }

    // Добавление кнопки прокрутки столбцов вперед
    row.appendChild(setButtonRight(config));

    return row;
}

// Добавление кнопки прокрутки влево
function setButtonLeft(config) {
    let cell = document.createElement('th');
    cell.rowSpan = config.height + 1;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_left');

    cellButton.addEventListener('click', function () {
        if ( config.getShift !== Math.max(0, config.getShift - 1)) {
            config.getShift--;
            constructTable(config);
        }
    });
    cell.appendChild(cellButton);

    return cell;
}

// Добавление кнопки прокрутки вправо
function setButtonRight(config) {
    let cell = document.createElement('th');
    cell.rowSpan = config.height + 1;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_right');

    cellButton.addEventListener('click', function () {
        if ( config.getShift !== Math.min(config.getShift + 1, config.array.countCol - config.width)) {
            config.getShift++;
            constructTable(config);
        }
    });
    cell.appendChild(cellButton);

    return cell;
}

// Отрисовка контента таблицы
function constructTableBody(config) {
    let body = [];

    for (let i = config.strStart; i < config.strEnd; i++) {
        let row = document.createElement('tr');
        row.classList.add('table-main-content__row');

        let cell = document.createElement('td');
        cell.innerText = config.array.data[i].name;
        cell.classList.add('table-main-content__cell');
        cell.classList.add('table-main-content__cell_name');

        row.appendChild(cell);

        for (let j = config.colStart; j <= config.colEnd; j++) {
            cell = document.createElement('td');
            cell.innerText = config.array.data[i].facts['Fact_' + j];
            cell.classList.add('table-main-content__cell');

            row.appendChild(cell);
        }
        body.push(row);
    }

    return body;
}