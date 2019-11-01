(function jsonGenerator () {
    let str = 100;
    let col = 10;

    let table = {
        count: str,
        data: []
    };

    for (let i = 0; i < str; i++) {
        table.data[i] = {
            id: i,
            name: 'ФИО',
            facts: {}
        };
        for (let j = 1; j <= col; j++) {
            let fieldName = 'Field_' + j;
            let fieldContent = 'Значение ' + i + '.' + j;

            Object.defineProperty(table.data[i].facts, fieldName, {
                value: fieldContent
            });
        }
    }

    localStorage.setItem('data', JSON.stringify(table));
})();