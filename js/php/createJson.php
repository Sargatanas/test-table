<?php
set_time_limit(0);

$url = $_SERVER['DOCUMENT_ROOT'] . '/resources/json/data.json';
$file = fopen($url, 'a');

$str = 1000;
$col = 1000;

$names = ['Иван', 'Федор', 'Михаил', 'Алексей', 'Дмитрий', 'Пётр', 'Александр'];
$surnames = ['Бабочкин', 'Синичкин', 'Кесьянов', 'Иванов', 'Васиьев', 'Теркин', 'Работяга'];
$patronymics = ['Иванович', 'Федорович', 'Алексеевич', 'Иванович', 'Васиьевич', 'Петрович', 'Александрович'];

$string = '{' .
    '"countStr": ' . $str . ',' .
    '"countCol": '. $col . ',' .
    '"data": [';
fwrite($file, $string);

$temp_str = -1;
$temp_col = -1;

for ($i = 0; $i < $str - 1; $i++) {
    $temp_col = -1;
    $name = $surnames[rand(0, count($surnames) - 1)];
    $name .= ' ' . $names[rand(0, count($names) - 1)];
    $name .= ' ' . $patronymics[rand(0, count($patronymics) - 1)];

    $string = '{' .
        '"id": ' . $i . ',' .
        '"name": "'. $name . '",' .
        '"facts": {';
    fwrite($file, $string);

    for ($j = 1; $j <= $col - 1; $j++) {
        $key = 'Fact_' . $j;
        $string = '"' . $key . '": "Значение ' . ($i + 1) . '.' . $j . '",';
        fwrite($file, $string);
        $temp_col++;
    }
    $key = 'Fact_' . $j;
    $string = '"' . $key . '": "Значение ' . ($i + 1) . '.' . $j . '"';
    fwrite($file, $string);
    $temp_col++;

    $string = '}},';
    fwrite($file, $string);

    $temp_str++;
}


$temp_col = -1;
$name = $surnames[rand(0, count($surnames))];
$name .= ' ' . $names[rand(0, count($names))];
$name .= ' ' . $patronymics[rand(0, count($patronymics))];

$string = '{' .
    '"id": ' . $i . ',' .
    '"name": "'. $name . '",' .
    '"facts": {';
fwrite($file, $string);

for ($j = 1; $j <= $col - 1; $j++) {
    $key = 'Fact_' . $j;
    $string = '"' . $key . '": "Значение ' . ($i + 1) . '.' . $j . '",';
    fwrite($file, $string);
    $temp_col++;
}
$key = 'Fact_' . $j;
$string = '"' . $key . '": "Значение ' . ($i + 1) . '.' . $j . '"';
fwrite($file, $string);
$temp_col++;

$string = '}}';
fwrite($file, $string);

$temp_str++;



$string = ']}';
fwrite($file, $string);

fclose($file);

echo $temp_str;
echo $temp_col;
