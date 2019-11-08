(async function () {
    let table = document.getElementById('table');
    table.innerHTML = '';
    table.append(setPreloader());

    let data = await loadJson();
    data = JSON.parse(data);

    console.log('Data completed');

    loadTable(data);
})();

async function loadJson() {
    let promise = new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://api.teletypeapp.com/data.json');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.withCredentials = true;
        request.send();

        request.onreadystatechange = function() {
            if (request.readyState !== 4) return;

            if (request.status === 200) {
                resolve(request.response);
            } else {
                reject('error');
            }
        };

    });

    return await promise;
}

function loadTable(json) {

    // Начальные данные
    let config = {
        array: json,
        width: 5,
        height: 10,
        shiftX: 0,
        shiftY: 0
    };
    config['selectedRows'] = new Set();

    // Первичный вывод таблицы
    config = getSizes(config);
    constructTable(config);

    window.onresize = function() {
        config = getSizes(config);
        constructTable(config);
    };
}

// Габариты таблицы
function getSizes(config) {
    config = getWidth(config);
    config = getHeight(config);

    let table = document.getElementById('table');
    table.innerHTML = '';

    return config;
}

// Расчет высоты таблицы
function getHeight(config) {
    let table = document.getElementById('table');
    table.innerHTML = '';

    let screenSize = window.innerHeight - 80;

    config.height = 0;

    let previousElementShift = 0;
    let currentElementShift;
    let copyConfig = Object.create(config);
    copyConfig.width = config.array.countCol;

    if (previousElementShift < screenSize) {
        for (let i = config.shiftY; i < config.array.countStr + config.shiftY; i++) {
            let row = createRow(copyConfig, i);
            table.append(row);

            currentElementShift = previousElementShift + row.offsetHeight;

            if (currentElementShift < screenSize) {
                config.height++;
            } else
                break;

            row.remove();
            previousElementShift = currentElementShift;
        }
    }
    config.height--;

    return config;
}

// Расчет ширины таблицы
function getWidth(config) {
    let screenSize = window.innerWidth - 50;

    let maxWidth = screenSize > 1024 ? 100 : 80;
    screenSize -= 300;

    config.width = Math.max(Math.floor(screenSize / maxWidth), 2);

    return config;
}

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

    row.appendChild(document.createElement('td'));
    row.appendChild(document.createElement('td'));

    let cell = document.createElement('td');
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
        row.dataset.id = i;

        let cell = document.createElement('td');
        cell.innerText = config.array.data[i].name;
        cell.classList.add('table-main-content__cell');
        cell.classList.add('table-main-content__cell_name');
        cell.dataset.width = '100';

        row.appendChild(cell);

        for (let j = config.colStart; j <= config.colEnd; j++) {
            row.append(createCell(config, i, j));
        }

        row = activateRow(config, row);

        body.push(row);
    }

    return body;
}

function createRow(config, num) {
    let row = document.createElement('tr');
    row.classList.add('table-main-content__row');
    row.id = 'tableRow_' + String(num);
    row.dataset.id = num;

    let cell = document.createElement('td');
    cell.innerText = config.array.data[num].name;
    cell.classList.add('table-main-content__cell');
    cell.classList.add('table-main-content__cell_name');

    row.appendChild(cell);

    for (let j = config.shiftX + 1; j < config.width + config.shiftX + 1; j++) {
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
    cell.dataset.id = numCol;

    return cell;
}

function scrollTableDown(config) {
    let table = document.getElementById('table');
    let firstRow = table.childNodes[2];
    let lastRow = table.lastChild;

    let row = createRow(config, config.height + config.shiftY);
    row = activateRow(config, row);
    lastRow.before(row);
    firstRow.remove();

    config.shiftY++;

    return config;
}

function scrollTableUp(config) {
    let table = document.getElementById('table');
    let firstRow = table.childNodes[2];
    let lastRow = table.childNodes[table.childElementCount - 2];

    let row = createRow(config, firstRow.dataset.id - 1);
    row = activateRow(config, row);
    firstRow.before(row);
    lastRow.remove();

    config.shiftY--;

    return config;
}

function scrollTableRight(config) {
    let colEnd = config.width + config.shiftX;

    let table = document.getElementById('table');
    let firstRow = table.firstChild;
    firstRow.lastChild.before(createHeaderCell(config, colEnd + 1));
    firstRow.childNodes[2].remove();

    for (let i = 0; i < config.height; i++) {
        let row = table.childNodes[i + 2];
        let firstCell = row.childNodes[1];
        let lastCell = row.lastChild;

        lastCell.after(createCell(config, Number(row.dataset.id), colEnd + 1));
        firstCell.remove();
    }

    config.shiftX++;

    return config;
}

function scrollTableLeft(config) {
    let colStart = config.shiftX;

    let table = document.getElementById('table');
    let firstRow = table.firstChild;
    firstRow.childNodes[2].before(createHeaderCell(config, colStart));
    firstRow.childNodes[firstRow.childElementCount - 2].remove();

    for (let i = 0; i < config.height; i++) {
        let row = table.childNodes[i + 2];
        let firstCell = row.childNodes[1];
        let lastCell = row.lastChild;

        firstCell.before(createCell(config, Number(row.dataset.id), colStart));
        lastCell.remove();
    }

    config.shiftX--;

    return config;
}

function activateRow(config, row) {
    let rowId = row.dataset.id;

    if (config.selectedRows.has(rowId)) {
        row.classList.add('table-main-content__row_selected');
    }

    row.addEventListener('click', function () {
        if (config.selectedRows.has(rowId)) {
            config.selectedRows.delete(rowId);
            row.classList.remove('table-main-content__row_selected');
        } else {
            config.selectedRows.add(rowId);
            row.classList.add('table-main-content__row_selected');
        }

        // Вывод в консоль выдранных строк
        let comment = 'Выбранные строки: ';
        let array = [];
        config.selectedRows.forEach(function (element) {
            array.push(Number(element));
        });

        if (array.length > 0) {
            array.sort(function (a, b) {
                return a - b;
            });
            for(let i = 0; i < array.length - 1; i++) {
                comment += String(array[i] + 1) + ', ';
            }
            comment += String(array[array.length - 1] + 1);
        } else {
            comment += 'не выбрано';
        }

        console.log(comment);
    });

    return row;
}

function setPreloader() {
    let preloader = document.createElement('div');
    preloader.classList.add('preloader');
    return preloader;
}