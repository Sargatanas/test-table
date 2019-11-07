(function jsonGenerator () {
    let request = new XMLHttpRequest();
    request.open('POST', './js/php/createJson.php', false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();

    console.log(request.response);
})();