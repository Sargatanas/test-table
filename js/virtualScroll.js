(function loadTable() {
    // Начальные данные
    let config = {
        array: JSON.parse(localStorage.getItem('data')),
    };

    config = getSizes(config);
    config = showTable(config);

    window.addEventListener('resize', function () {
        config = getSizes(config);
        config = showTable(config);
    });

    document.onscroll = function () {
        changeTable(config);
    };
})();

function getSizes(config) {
    constructTable(config);

    let table = document.getElementById('table');

    config['totalSize'] = table.offsetHeight;
    config['elementSizes'] = [];
    for (let i = 0; i < table.childElementCount; i++) {
        config.elementSizes[i] = {};
        config.elementSizes[i]['size'] = table.childNodes[i].offsetHeight;
        config.elementSizes[i]['shiftY'] = 0;
        for (let j = 0; j < i; j++) {
            config.elementSizes[i].shiftY += config.elementSizes[j].size;
        }
    }

    config['totalShift'] = 0;
    config['screen'] = {};
    config.screen['height'] = document.documentElement.clientHeight;

    table.innerHTML = '';

    return config;
}

function constructTable(config) {
    let table = document.getElementById('table');
    table.innerHTML = '';

    // Вывод таблицы и подсчет параметров её элементов
    let rows = constructTableBody(config);
    for (let i = 0; i < rows.length; i++) {
        table.append(rows[i]);
    }
}

function constructTableBody(config) {
    let tableRows = [];

    for (let i = 0; i < config.array.countStr; i++) {
        let row = constructRow(config, i);
        tableRows.push(row);
    }

    return tableRows;
}

function constructRow(config, str) {
    let row = document.createElement('tr');
    row.id = 'row_' + str;
    row.dataset.id = str;

    let cell = document.createElement('td');
    cell.innerText = config.array.data[str].name;
    row.append(cell);

    for (let i = 1; i <= config.array.countCol; i++) {
        cell = constructCell(config, str, i);
        row.append(cell);
    }
    return row;
}

function constructCell(config, str, col) {
    let cell = document.createElement('td');
    cell.id = 'cell_' + str + '_' + col;
    cell.innerText = config.array.data[str].facts['Fact_' + col];
    return cell;
}

function showTable(config) {
    let container = document.getElementById('table-container');
    container.style.height = config.totalSize + 10 + 'px';

    let table = document.getElementById('table');

    let screenTop = -document.documentElement.getBoundingClientRect().top;
    let screenBottom = -document.documentElement.getBoundingClientRect().top + config.screen.height;

    let visibleRows = [];
    for (let i = 0; i < config.array.countStr; i++) {
        let elementTop = config.elementSizes[i].shiftY;
        let elementBottom = config.elementSizes[i].shiftY + config.elementSizes[i].size;

        if (elementTop <= screenBottom - 10) {
            if (elementBottom >= screenTop) {
                let row = constructRow(config, i);
                row.dataset.height = config.elementSizes[i].size;
                row.dataset.shift = config.elementSizes[i].shiftY;
                visibleRows.push(row);
            }
        } else
            break;
    }

    table.style.transform = 'translateY(' + visibleRows[0].dataset.shift + 'px)';
    for (let i = 0; i < visibleRows.length; i++) {
        table.append(visibleRows[i]);
    }

    return config;
}

function changeTable(config) {
    addTopRow(config);
    addBottomRow(config);
    // removeTopRow();
}

function removeTopRow() {
    let table = document.getElementById('table');

    let firstRow = table.firstChild;
    let firstRowBottom = Number(firstRow.dataset.shift) + Number(firstRow.dataset.height);

    let screenTop = - document.documentElement.getBoundingClientRect().top;

    console.log(firstRowBottom, screenTop);

    if ((firstRowBottom < screenTop) && (firstRow.dataset.id >= 0)) {
        firstRow.remove();
    }
}

function addTopRow(config) {
    let table = document.getElementById('table');

    let firstRow = table.firstChild;
    let rowMiddle = Number(firstRow.dataset.shift) + Number(firstRow.dataset.height) / 2;

    let screenTop = -document.documentElement.getBoundingClientRect().top;

    if ((rowMiddle > screenTop) && (firstRow.dataset.id > 0)) {
        let nextRowNum = Number(firstRow.dataset.id) - 1;
        let newRow = constructRow(config, nextRowNum);
        newRow.dataset.height = config.elementSizes[nextRowNum].size;
        newRow.dataset.shift = config.elementSizes[nextRowNum].shiftY;
        firstRow.before(newRow);

        table.style.transform = 'translateY(' + newRow.dataset.shift + 'px)';
    }
}

function addBottomRow(config) {
    let table = document.getElementById('table');

    let lastRow = table.lastChild;
    let rowMiddle = Number(lastRow.dataset.shift) + Number(lastRow.dataset.height) / 2;

    let screenBottom = -document.documentElement.getBoundingClientRect().top + config.screen.height;

    if ((rowMiddle < screenBottom) && (lastRow.dataset.id < config.array.countStr - 1)) {
        let nextRowNum = Number(lastRow.dataset.id) + 1;
        let newRow = constructRow(config, nextRowNum);
        newRow.dataset.height = config.elementSizes[nextRowNum].size;
        newRow.dataset.shift = config.elementSizes[nextRowNum].shiftY;
        lastRow.after(newRow);
    }
}

