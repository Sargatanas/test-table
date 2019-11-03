(function jsonGenerator () {
    let str = 100;
    let col = 20;

    let table = {
        countStr: str,
        countCol: col,
        data: []
    };

    for (let i = 0; i < str; i++) {
        table.data[i] = {
            id: i,
            name: 'Иванов Иван Иванович',
            facts: {}
        };
        for (let j = 1; j <= col; j++) {
            table.data[i].facts['Fact_' + j] = 'Значение ' + (i + 1) + '.' + j;
        }
    }

    localStorage.setItem('data', JSON.stringify(table));
})();