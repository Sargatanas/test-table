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
        constructTable(config);
    });

    document.getElementById('h-size').addEventListener('change', function () {
        config.width = Number(document.getElementById('h-size').value);
        config.shiftX = 0;
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
        cell.id = 'header_' + i;

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
            config = scrollTableLeft(config);
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
            config = scrollTableRight(config);
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
            config = scrollTableUp(config);
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
            row.append(createCell(config, i, j));
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


    for (let j = config.colStart + config.shiftX; j <= config.colEnd + config.shiftX; j++) {
       row.append(createCell(config, num, j));
    }

    return row;
}

function createHeaderCell(config, numCol) {
    let cell = document.createElement('th');
    cell.innerText = 'Поле ' + numCol;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_header');
    cell.id = 'header_' + numCol;

    return cell;
}

function createCell(config, numStr, numCol) {
    let cell = document.createElement('td');
    cell.innerText = config.array.data[numStr].facts['Fact_' + numCol];
    cell.classList.add('table-main-content__cell');
    cell.id = 'cell_'+ numStr + '-' + numCol;

    return cell;
}

function scrollTableDown(config) {
    document.getElementById('tableRow_' + String(config.shiftY)).remove();

    document.getElementById('tableRow_last').before(createRow(config, config.strEnd + config.shiftY));
    config.shiftY++;

    return config;
}

function scrollTableUp(config) {
    document.getElementById('tableRow_' + String(config.strEnd + config.shiftY - 1)).remove();

    document.getElementById('tableRow_first').after(createRow(config, config.strStart + config.shiftY - 1));
    config.shiftY--;

    return config;
}

function scrollTableRight(config) {
    let colStart = config.colStart + config.shiftX;
    let colEnd = config.colEnd + config.shiftX;

    document.getElementById('header_' + (colStart)).remove();
    document.getElementById('header_' + (colEnd)).after(createHeaderCell(config, colEnd + 1));

    for (let i = config.strStart + config.shiftY; i < config.strEnd + config.shiftY; i++) {
        document.getElementById('cell_'+ i + '-' + colStart).remove();
        document.getElementById('cell_'+ i + '-' + colEnd).after(createCell(config, i, colEnd +  1));
    }

    config.shiftX++;

    return config;
}

function scrollTableLeft(config) {
    let colStart = config.colStart + config.shiftX;
    let colEnd = config.colEnd + config.shiftX;

    document.getElementById('header_' + (colEnd)).remove();
    document.getElementById('header_' + (colStart)).before(createHeaderCell(config, colStart - 1));

    for (let i = config.strStart + config.shiftY; i < config.strEnd + config.shiftY; i++) {
        document.getElementById('cell_'+ i + '-' + colEnd).remove();
        document.getElementById('cell_'+ i + '-' + colStart).before(createCell(config, i, colStart - 1));
    }

    config.shiftX--;

    return config;
}