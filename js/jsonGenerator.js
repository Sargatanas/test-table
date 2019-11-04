function jsonGenerator () {
    let str = 100;
    let col = 20;

    let names = ['Иван', 'Федор', 'Михаил', 'Алексей', 'Дмитрий', 'Пётр', 'Александр'];
    let surnames = ['Бабочкин', 'Синичкин', 'Кесьянов', 'Иванов', 'Васиьев', 'Теркин', 'Работяга'];
    let patronymics = ['Иванович', 'Федорович', 'Алексеевич', 'Иванович', 'Васиьевич', 'Петрович', 'Александрович'];

    let table = {
        countStr: str,
        countCol: col,
        data: []
    };

    for (let i = 0; i < str; i++) {
        let name = surnames[randomIndex(0, surnames.length)];
        name += ' ' + names[randomIndex(0, names.length)];
        name += ' ' + patronymics[randomIndex(0, patronymics.length)];

        table.data[i] = {
            id: i,
            name: name,
            facts: {}
        };
        for (let j = 1; j <= col; j++) {
            table.data[i].facts['Fact_' + j] = 'Значение ' + (i + 1) + '.' + j;
        }
    }

    localStorage.setItem('data', JSON.stringify(table));
};

function randomIndex(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}