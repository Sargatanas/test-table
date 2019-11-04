(function loadTable() {
    // Начальные данные
    let config = {
        array: JSON.parse(localStorage.getItem('data')),
        width: Number(document.getElementById('h-size').value),
        height: Number(document.getElementById('v-size').value),
        shiftX: 0,
        shiftY: 0
    };

    // Первичный вывод таблицы
    constructTable(config);

    // Обновление таблицы
    document.getElementById('v-size').addEventListener('change', function () {
        config.height = Number(document.getElementById('v-size').value);
        config.page = 1;
        constructTable(config);
    });

    document.getElementById('h-size').addEventListener('change', function () {
        config.width = Number(document.getElementById('h-size').value);
        config.getShift = 0;
        constructTable(config);
    });
})();

// Отрисовка таблицы
function constructTable(config) {
    let table = document.getElementById('table');
    table.innerText = '';

    // Расчет границ по высоте
    let firstStringNum = config.shiftY;
    let lastStringNum = firstStringNum + config.height;
    lastStringNum = Math.min(lastStringNum, config.array.countStr);
    config['strStart'] = firstStringNum;
    config['strEnd'] = lastStringNum;

    // расчет границ по ширине
    let firstColumnNum = config.shiftX + 1;
    let lastColumnNum = firstColumnNum + config.width - 1;
    lastColumnNum = Math.min(lastColumnNum, config.array.countCol);
    config['colStart'] = firstColumnNum;
    config['colEnd'] = lastColumnNum;

    table.appendChild(constructTableHeader(config));

    table.appendChild(setButtonTop(config));

    constructTableBody(config).forEach(function(tableRow) {
        table.appendChild(tableRow);
    });

    table.appendChild(setButtonBottom(config));
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

    cell = document.createElement('th');
    row.appendChild(cell);

    for (let i = config.colStart; i <= config.colEnd; i++) {
        cell = document.createElement('th');
        cell.innerText = 'Поле ' + i;
        cell.classList.add('table-main-content__cell');
        cell.classList.add('table-main-content__cell_header');

        row.appendChild(cell);
    }

    cell = document.createElement('th');
    row.appendChild(cell);

    return row;
}

// Добавление кнопки прокрутки влево
function setButtonLeft(config) {
    let cell = document.createElement('td');
    cell.rowSpan = config.height + 1;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_left');

    cellButton.addEventListener('click', function () {
        if ( config.shiftX !== Math.max(0, config.shiftX - 1)) {
            config.shiftX--;
            constructTable(config);
        }
    });
    cell.appendChild(cellButton);

    return cell;
}

// Добавление кнопки прокрутки вправо
function setButtonRight(config) {
    let cell = document.createElement('td');
    cell.rowSpan = config.height + 1;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_right');

    cellButton.addEventListener('click', function () {
        if ( config.shiftX !== Math.min(config.shiftX + 1, config.array.countCol - config.width)) {
            config.shiftX++;
            constructTable(config);
        }
    });
    cell.appendChild(cellButton);

    return cell;
}

// Добавление кнопки прокрутки вверх
function setButtonTop(config) {
    let row = document.createElement('tr');
    row.id = 'tableRow_first';

    let cell = document.createElement('td');
    row.appendChild(cell);

    row.appendChild(setButtonLeft(config));

    cell = document.createElement('td');
    cell.colSpan = config.width + 3;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_top');

    cellButton.addEventListener('click', function () {
        if ( config.shiftY !== Math.max(0, config.shiftY - 1)) {
            scrollTableUp(config);
        }
    });
    cell.appendChild(cellButton);

    row.appendChild(cell);

    row.appendChild(setButtonRight(config));

    return row;
}

// Добавление кнопки прокрутки вниз
function setButtonBottom(config) {
    let row = document.createElement('tr');
    row.id = 'tableRow_last';

    let cell = document.createElement('td');
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.colSpan = config.width + 3;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_button');

    let cellButton  = document.createElement('button');
    cellButton.classList.add('table-main-content__button');
    cellButton.classList.add('table-main-content__button_bottom');

    cellButton.addEventListener('click', function () {
        if ( config.shiftY !== Math.min(config.shiftY + 1, config.array.countStr - config.height)) {
            config = scrollTableDown(config);
        }
    });
    cell.appendChild(cellButton);
    row.appendChild(cell);

    cell = document.createElement('td');
    row.append(cell);

    return row;
}

// Отрисовка контента таблицы
function constructTableBody(config) {
    let body = [];

    for (let i = config.strStart; i < config.strEnd; i++) {
        let row = document.createElement('tr');
        row.classList.add('table-main-content__row');
        row.id = 'tableRow_' + String(i);

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

function createRow(config, num) {
    let row = document.createElement('tr');
    row.classList.add('table-main-content__row');
    row.id = 'tableRow_' + String(num);

    let cell = document.createElement('td');
    cell.innerText = config.array.data[num].name;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_name');

    row.appendChild(cell);

    for (let j = config.colStart; j <= config.colEnd; j++) {
        cell = document.createElement('td');
        cell.innerText = config.array.data[num].facts['Fact_' + j];
        cell.classList.add('table-main-content__cell');

        row.append(cell);
    }

    return row;
}

function scrollTableDown(config) {
    document.getElementById('tableRow_' + String(config.shiftY)).remove();

    config.shiftY++;
    let row = createRow(config, config.strEnd + config.shiftY - 1);
    document.getElementById('tableRow_last').before(row);

    return config;
}

function scrollTableUp(config) {
    document.getElementById('tableRow_' + String(config.strEnd + config.shiftY - 1)).remove();

    config.shiftY--;
    let row = createRow(config, config.shiftY);
    document.getElementById('tableRow_first').after(row);

    return config;
}