/**
 * Created by andre on 30/10/2017.
 */
function renderBoard(mx) {
    document.getElementById(htmlIdList.game).innerHTML = gameBoardHtml(mx);
}

function classNameFormat(before, appendTo) {
    return before += (" " + appendTo);
}

/*Recupera uma posição com base em um ID*/
function recoveryPostion(id) {
    return JSON.parse(document.getElementById(id).getAttribute("value"));
}

function updateBigNameTitle(playename, opened, from) {
    document.getElementById(htmlIdList.title).innerHTML = "Campo Minado | Partida de: " + playename + " | " + opened + '/' + from;
}

//Consulta uma posição na matriz e retorna se ela está marcada como aberta
function isOpened(x, y){//[][]
    return matrix.mx[x][y].isExplored;
}

//Consulta uma posição na matriz e retorna se ela está marcada como aberta pelo cheat
function isOpenedByCheat(x, y){//[][]
    return matrix.mx[x][y].isOpenByCheat;
}

//Consulta um valor numa posição da matriz (valor é o número entre -1 e 8)
function getValueAt(x, y){//[][]
    return matrix.mx[x][y].value;
}

//Seta um valor numa posição
function setValueAt(x, y, val) {
    matrix.mx[x][y].value = val;
}

//Seta uma célula como aberta
function openCell(x, y) {
    matrix.mx[x][y].isExplored = true;
}

//Seta uma célula como aberta por cheat
function openCellByCheat(x, y) {
    matrix.mx[x][y].isOpenByCheat = true;
}

//Retorna true se existir uma boma na posição
function isBomb(x, y) {
    return matrix.mx[x][y].value == -1;
}

//Seta uma posição como sendo bomba
function setAsBomb(x, y) {
    matrix.mx[x][y].value = -1
}

function closeCellCheat(x, y) {
    matrix.mx[x][y].isOpenByCheat = false;
}

function positionIsValid(posx, posy) {
    var valid = posx >= 0 && posy >= 0 && posx < matrix.maxx && posy < matrix.maxy;
    //console.log('pos ' + posx + ' ' + posy + ' valid :' + valid.toString());
    return valid;
}

function openAllCells() {
    var row, column;
    for(row = 0; row < matrix.maxx; row++){
        for(column = 0; column < matrix.maxy; column++){
            openCell(row, column);
        }
    }
}

//Gera um número aleatório entre min e max
function generateRandomBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getActualTime() {
    return new Date().valueOf();
}

function simplePadding(num) {
    //return (num < 10 && num > 0) ? '0' + num.toString() : num.toString();
    if(num < 10 && num >= 0){
        return '0' + num;
    }
    else{
        return num.toString();
    }
}

