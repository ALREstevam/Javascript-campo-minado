/**
 * Created by andre on 13/10/2017.
 */
"use strict";

/*=================================================== GLONBAL VARIABLES AND CONSTANTS ================================================================*/

var matrix;
var playername = "*";
var playing = false;
var isFirst = true;
var clickAble = true;
var clockStart;
var clockEnd;
var cheating = false;
var status = 0;
var time = 0;
var timerValue = "00:00:00";
var matchResult = false;


var htmlIdList = {
    vitoria: 'vitoria',
    derrota: 'derrota',
    historico: 'hist',
    game: 'game',
    title: 'gameBigTitle',
    time: 'time'
};



/*=================================================== MAIN FUNCTIONS ================================================================*/

/*FUNÇÃO PRINCIPAL DO PROGRAMA: ATIVADA QUANDO UM ELEMENTO É CLICADO*/
function elementClicked(id) {
    if (!clickAble) {
        return;
    }

    playSound(files.click);

    //console.log("Element clicked at position:");
    var elemPos = recoveryPostion(id); //Recuperando as coordenadas do elemento clicado
    //console.log(elemPos);

    if (isFirst) {
        isFirst = false;
        startTimer();
        //console.log('Starting timer');
    }

    if (isBomb(elemPos.x, elemPos.y)) {
        looseGame();
        clickAble = false;
        return;
    } else {
        recursivelyExplore(elemPos.x, elemPos.y);
        updateBigNameTitle(playername, matrix.openedCellCount, (matrix.maxx * matrix.maxy) - matrix.bombNum);

        if (matrix.openedCellCount - ((matrix.maxx * matrix.maxy) - matrix.bombNum) == 0) {
            winGame();
            clickAble = false;
            return;
        }
    }
    renderBoard(matrix);
}

/*FUNÇÃO A SER ACIONADA QUANDO O JOGADOR CLICAR EM INICIAR O JOGO*/
function setup() {
    if (!playing) {
        playSound(files.start);
        playername = document.forms["setupForm"]["name"].value;
        var mxMaxX = document.forms["setupForm"]["tblx"].value;
        var mxMaxY = document.forms["setupForm"]["tbly"].value;
        var mxBombs = document.forms["setupForm"]["bombAmount"].value;

        /*if(mxMaxX > 65 || mxMaxY > 65){
         if(!confirm("Você escolheu uma quantidade muito grande de células, isso pode causar lentidão e desconfiguração da interface.\nDeseja continuar?")){
         return;
         }
         }*/



        updateBigNameTitle(playername, 0, (mxMaxX * mxMaxY) - mxBombs);
        try {
            console.log('=== Generating logical matrix');
            matrix = generateLogicalMatrix(mxMaxX, mxMaxY, mxBombs);

            console.log(matrix);
            console.log('=== Putting bombs in matrix');
            putBombsInMatrix(mxMaxX, mxMaxY, mxBombs);

            console.log('=== Filling matrix with values');
            fillMatrixWithValues();

            console.log('=== Rendering matrix to the screen');
            renderBoard(matrix);
        } catch (err) {
            console.log(err);
            return false;
        }

        playing = true; //Impedir que o jogo reinicie se clicar em iniciar jogo no meio de uma partida
    }
    return false;
}

/*Função chamada assim que a página é carregada*/
function pageLoad() {
    document.getElementById('cheatOption').style.backgroundColor = '#cb4b37';
    closepicture('vitoria');
    closepicture('derrota');
    renderHistoric("hist");
}

/*=================================================== FUNCTIONS RELATED TO THE NEIGHBORS ================================================================*/

/*Gerar a posição dos vizinhos em cruz*/
function getNeighborsPositionCross(cellx, celly) {
    return [{
        x: cellx + 1,
        y: celly
    }, {
        x: cellx - 1,
        y: celly
    }, {
        x: cellx,
        y: celly + 1
    }, {
        x: cellx,
        y: celly - 1
    }];
}

/*Gerar a posição dos vizinhos em círculo
 * */
function getNeighborsPositionCircle(cellx, celly) {
    return [{
        x: cellx + 1,
        y: celly
    },
        {
            x: cellx - 1,
            y: celly
        },
        {
            x: cellx,
            y: celly + 1
        },
        {
            x: cellx,
            y: celly - 1
        },
        {
            x: cellx + 1,
            y: celly + 1
        },
        {
            x: cellx - 1,
            y: celly - 1
        },
        {
            x: cellx + 1,
            y: celly - 1
        },
        {
            x: cellx - 1,
            y: celly + 1
        }
    ];
}

/*Contar minas ao redor de uma posição como cruz
 * */
function countMinesAroundCross(cellx, celly) {
    var arroundPos = getNeighborsPositionCross(cellx, celly);
    var bombCount = 0;

    for (var i = 0; i < arroundPos.length; i++) {
        var pos = arroundPos[i];
        if (positionIsValid(pos.x, pos.y) && isBomb(pos.x, pos.y)) {
            bombCount++;
        }
    }
    return bombCount;
}

/*Contar minas ao redor de uma posição como círculo
 * */
function countMinesAroudCircle(cellx, celly) {
    var arroundPos = getNeighborsPositionCircle(cellx, celly);
    var bombCount = 0;

    for (var i = 0; i < arroundPos.length; i++) {
        var pos = arroundPos[i];
        if (positionIsValid(pos.x, pos.y) && getValueAt(pos.x, pos.y) == -1) {
            bombCount++;
        }
    }
    return bombCount;
}

/*=================================================== OPEN CELLS RECURSIVELY ================================================================*/

/*
 * Função que faz a exploração de forma recursiva
 * */
function recursivelyExplore(cellx, celly) {

    //console.error('ABERTAS: '+ matrix.openedCellCount +' DE ' + ((matrix.maxx * matrix.maxy) - matrix.bombNum))

    if (!isOpened(cellx, celly)) {
        matrix.openedCellCount++;
    }

    openCell(cellx, celly);

    if (countMinesAroudCircle(cellx, celly) == 0) { //Se nenhum dos vizinhos for bomba
        var neilst = getNeighborsPositionCross(cellx, celly); //pegar a posiçãp dos vizinhos
        for (var i = 0; i < neilst.length; i++) {
            var nei = neilst[i];
            if (positionIsValid(nei.x, nei.y) && !isOpened(nei.x, nei.y)) {
                recursivelyExplore(nei.x, nei.y);
            }
        }
    }
}

/*=================================================== GENERATE THE HTML OF THE MATRIX ================================================================*/

function gameBoardHtml(matrix) {
    var rsp = "";
    rsp += "<table class='game'>\n";
    for (var row = 0; row < matrix.maxx; row++) {
        rsp += "\t<tr>\n";
        for (var column = 0; column < matrix.maxy; column++) {
            var pos = {
                x: row,
                y: column
            };

            var classname = '';
            var names = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
            var closOpen = {
                closed: 'closedCell',
                open: 'openedCell'
            };
            var bombHere = 'bomb';

            if (isOpened(pos.x, pos.y)) { //Está aberta
                classname = classNameFormat(classname, closOpen.open);
                if (isBomb(pos.x, pos.y)) { //É uma bomba
                    classname = classNameFormat(classname, bombHere);
                } else { //Não é uma bomba, é um valor
                    classname = classNameFormat(classname, names[getValueAt(pos.x, pos.y)]);
                }
            } else { //Está fechada
                classname = classNameFormat(classname, closOpen.closed);
                if (isOpenedByCheat(pos.x, pos.y)) { //Está aberta por cheat
                    if (isBomb(pos.x, pos.y)) { //É uma bomba
                        classname = classNameFormat(classname, bombHere);
                    } else { //Não é uma bomba, é um valor
                        classname = classNameFormat(classname, names[getValueAt(pos.x, pos.y)]);
                    }
                }
            }
            rsp += "\t\t<td>\n\t\t\t" +
                "<button value='" + JSON.stringify(pos) + "' id='" +
                (row.toString() + "," + column.toString()) + "'" +
                " onclick='elementClicked(this.id)' class='" + classname + "'>" +
                "</button>\n\t\t</td>\n";
        }
        rsp += "\t</tr>\n";
    }
    rsp += "</table>\n";

    //console.log('Matrix view updated.');
    return rsp;
}


/*=================================================== GENERATE THE LOGICAL MATRIX WITH DEFAULT VALUES ================================================================*/

/*Gera a representação do jogo na memória*/
function generateLogicalMatrix(maxX, maxY, bombs) {

    var mx = new Array();
    for (var x = 0; x < maxX; x++) {
        var my = new Array();
        for (var y = 0; y < maxY; y++) {
            my.push({
                posx: x,
                posy: y,
                isExplored: false,
                isOpenByCheat: false,
                value: 0
            });
        }
        mx.push(my);
    }
    var aMatrix = {
        bombNum: bombs,
        openedCellCount: 0,
        maxx: maxX,
        maxy: maxY,
        mx: mx
    };

    //console.log("Logical matrix generated.");
    //console.log(aMatrix);
    return aMatrix;
}

/*=================================================== MATRIX FILLING AND ITERATION ================================================================*/


//coloca aleatoriamente as bombas no tabuleiro
function putBombsInMatrix(xmax, ymax, qntBombas) {
    //console.log('Putting ' + qntBombas + ' bombs');
    for (var i = 0; i < qntBombas; i++) {
        var touple;
        do {
            touple = getRandomXYtuple(xmax - 1, ymax - 1);
            //console.log('bombat: ' + touple.x + ' ' + touple.y);
        } while (isBomb(touple.x, touple.y) || !positionIsValid(touple.x, touple.y));
        setAsBomb(touple.x, touple.y);
    }
    //Para cada boma gera um valor de x e y aleatório e válido
    //Procura para a posição x e y gerada verifica se já existe bomba nessa posição
    //Se não houver coloca
    //Se houver repete o processo até encontrar uma célula vazia
}

//gera um arranjo de coordenadas x,y aleatórias
function getRandomXYtuple(maxX, maxY) {
    var a, b;
    a = generateRandomBetween(0, maxX);
    b = generateRandomBetween(0, maxY);
    return {
        x: a,
        y: b
    };
    //Retorna uma lista no formato {x: 7, y:2} com x e y sendo randômicos
}

/*=================================================== MESSAGES ================================================================*/
//Emite menssagem informando que o jogador perdeu
function looseMsg() {
    document.getElementById(htmlIdList.derrota).style.visibility = "visible";
}

//Emite menssagem informando que o jogador ganhou
function winMsg() {
    document.getElementById(htmlIdList.vitoria).style.visibility = "visible";
}

//fecha menssagens de aviso
function closepicture(id) {
    document.getElementById(id).style.visibility = "hidden";
}

function fillMatrixWithValues() {
    for (var row = 0; row < matrix.maxx; row++) {
        for (var column = 0; column < matrix.maxx; column++) {
            if (positionIsValid(row, column) && !isBomb(row, column)) {
                setValueAt(row, column, countMinesAroudCircle(row, column));
            }
        }
    }
}
/*=================================================== TIME RELATED FUNCTIONS ================================================================*/
//Converte uma quantidade de tempo em milisegundos para minutos e segundos
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//Acessa o tempo do sistema como uma timestamp
function getActualTimeStamp() {
    return new Date().valueOf();
}

//retorna a data atual para computar o tempo gasto na partida
function getActualDateStr() {
    var dateString = "";
    var newDate = new Date();
    dateString += newDate.getDate() + "/";
    dateString += (newDate.getMonth() + 1) + "/";
    dateString += newDate.getFullYear();
    return dateString;
    //Retorna a data atual do sistema para comparar quanto tempo passou entre quando o relógio iniciou e parou
}

//Inicia o timer
function startTimer() {
    status = 1;
    timer();
}

//Para o timer
function stopTimer() {
    status = 0;
}


function timer() {
    if (status == 1) {
        setTimeout(
            function() {
                time++;
                var min = Math.floor(time / 100 / 60);
                var sec = Math.floor(time / 100);
                var mSec = time % 100;
                if (min < 10) {
                    min = "0" + min;
                }
                if (sec >= 60) {
                    sec = sec % 60;
                }
                if (sec < 10) {
                    sec = "0" + sec;
                }
                document.getElementById('time').innerHTML = min + ":" + sec + ":" + mSec;
                timerValue = min + ":" + sec + ":" + mSec;
                timer();
            }, 10);
    }
}

function relogio() {
    var data = new Date();
    var horas = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds();

    if (horas < 10) {
        horas = "0" + horas;
    }
    if (minutos < 10) {
        minutos = "0" + minutos;
    }
    if (segundos < 10) {
        segundos = "0" + segundos;
    }
    document.getElementById("relogio").innerHTML = horas + ":" + minutos + ":" + segundos;

}

function initrelogio() {
    setInterval(relogio, 1000);
}

/*=================================================== RESTART GAME AND CLEAN VARIABLES ================================================================*/

function restartGame() {
    playSound(files.click2);
    console.log('RESTARTING GAME');
    resetGameVariables();
    renderHistoric("hist");
    playing = false;
}

function resetGameVariables() {
    console.log('RESTARTING VARIABLES');
    //Verificar se existem variáveis a serem resetadas ou visualizações a serem atualizadas antes da nova partida
    matrix = null;
    playername = "*";
    isFirst = true;
    clickAble = true;
    clockStart = null;
    clockEnd = null;
    cheating = false;
    setCheatButtonStyle(false);
    time = 0;
    status = 0;
}

function resetStyle() {
    document.getElementById(htmlIdList.game).innerHTML = '<span class="gameName">&#128163; Campo minado &#128163;</span>';
    document.getElementById(htmlIdList.time).innerHTML = '00:00:00';
    document.getElementById(htmlIdList.title).innerHTML = 'Campo Minado';
}

function cleanTexts() {
    document.getElementById("name").value = "";
    document.getElementById("tblx").value = "";
    document.getElementById("tbly").value = "";
    document.getElementById("bombAmount").value = "";
    document.getElementById("gameBigTitle").innerHTML = "Campo Minado";
}

/*=================================================== CHEATING ================================================================*/

function cheat() {
    if (!playing) {
        return;
    }

    playSound(files.click2);
    cheating = !cheating;
    setCheatButtonStyle(cheating);
    var row, column;

    if (playing) {
        if (cheating) {
            for (row = 0; row < matrix.maxx; row++) {
                for (column = 0; column < matrix.maxy; column++) {
                    openCellByCheat(row, column);
                }
            }
        } else {
            for (row = 0; row < matrix.maxx; row++) {
                for (column = 0; column < matrix.maxy; column++) {
                    closeCellCheat(row, column);
                }
            }
        }
        renderBoard(matrix);
    }
}

/*=================================================== GAME ENDED ================================================================*/
function looseGame() {
    endGame(false);
}

function winGame() {
    endGame(true);
}

function endGame(winOrLoose) {
    var sound = (winOrLoose) ? files.win : files.loose2;

    playSound(sound); //Tocando som
    matchResult = winOrLoose; //Definindo o resultado do jogo (true = ganhou, false = perdeu)
    stopTimer();
    openAllCells();
    renderBoard(matrix);

    if (winOrLoose) {
        winMsg()
    } else {
        looseMsg();
    }

    var data = getData();
    appendToHistoric(data.playername, data.xmax, data.ymax, data.timeTaken, data.opened, data.gameResult, data.currentDateStr);
    renderHistoric(htmlIdList.historico);
    resetGameVariables();
}



/*=================================================== HISTORIC ================================================================*/
/**
 * Created by andre on 30/10/2017.
 */


/*Adicionar um elemento*/
function appendToHistoric(player, fieldx, fieldy, timeTaken, openedCells, matchResult, date) {
    var histElem = {
        date: date,
        player: player,
        fieldDimensions: fieldx * fieldy,
        fieldx: fieldx,
        fieldy: fieldy,
        timeTaken: timeTaken,
        openedCells: openedCells,
        matchResult: matchResult
    };
    var histsArray = new Array();
    if (!localStorage.getItem('hist')) {
        localStorage.setItem('hist', JSON.stringify(histElem));
    } else {
        histsArray = JSON.parse(localStorage.getItem('hist'));
    }
    histsArray.push(histElem);
    localStorage.setItem('hist', JSON.stringify(histsArray));
}

/*Limpar o histórico
 * */
function clearHistoric(id) {
    localStorage.removeItem('hist');
    renderHistoric(id);
    //configHeight();
}

/*Ler histórico como um array de objetos
 * */
function readHistoric() {
    if (!localStorage.getItem('hist')) {
        return null;
    } else {
        return JSON.parse(localStorage.getItem('hist'));
    }
}

/*Converter histórico para HTML
 * */
function historicToHtml() {
    if (!localStorage.getItem('hist')) {
        return "<p>Histórico vazio</p>";
    } else {
        var hist = JSON.parse(localStorage.getItem('hist'));
        var rsp = "";
        for (var i = hist.length - 1; i >= 0; i--) {
            var elem = hist[i];
            var compl = (elem.matchResult) ? 'histGreen' : 'histRed';
            console.log(elem);
            rsp += "<div class='histElement " + compl + "'>\n";
            rsp += "<p>\n";
            rsp += "<strong>" + elem.date + "</strong><br>\n";
            rsp += "<strong>Jogador: </strong>" + elem.player + "<br>\n";
            rsp += "<strong>Campo: </strong>" + elem.fieldx + " x " + elem.fieldy + "<br>\n";
            rsp += "<strong>Tempo: </strong>" + elem.timeTaken + "<br>\n";
            rsp += "<strong>Células abertas: </strong>" + elem.openedCells + "<br>\n";
            rsp += "<strong>Resultado: </strong>" + matchResultStr(elem.matchResult) + "<br>\n";
            rsp += "</p>\n";
            rsp += "</div>\n";
            //rsp += "<hr>\n";
        }
        return rsp;
    }
}

/*Colocar o histórico em HTML dentro de algum elemento
 * */
function renderHistoric(id) {
    document.getElementById(id).innerHTML = historicToHtml();
}

function matchResultStr(res) {
    return (res) ? 'Venceu' : 'Perdeu';
}

/*=================================================== AUDIO ================================================================*/

/**
 * Created by andre on 30/10/2017.
 */

var files = {
    loose: 'files/bomb-contdown.mp3',
    win: 'files/win.mp3',
    start: 'files/game_start.mp3',
    click: 'files/click_0.mp3',
    click2: 'files/click_1.mp3',
    loose2: 'files/explosion_n_song.mp3'
};

function playSound(filename) {
    var audio = new Audio(filename);
    audio.play();
}

/*=================================================== UTILS ================================================================*/

/**
 * Created by andre on 30/10/2017.
 */
function renderBoard(mx) {
    document.getElementById(htmlIdList.game).innerHTML = gameBoardHtml(mx);
}

function classNameFormat(before, appendTo) {
    return before += (" " + appendTo);
}

//Recupera uma posição xy com base em um ID
function recoveryPostion(id) {
    return JSON.parse(document.getElementById(id).getAttribute("value"));
}

function updateBigNameTitle(playename, opened, from) {
    document.getElementById(htmlIdList.title).innerHTML = "Campo Minado | Partida de: " + playename + " | " + opened + '/' + from;
}

//Consulta uma posição na matriz e retorna se ela está marcada como aberta
function isOpened(x, y) {
    return matrix.mx[x][y].isExplored;
}

//Consulta uma posição na matriz e retorna se ela está marcada como aberta pelo cheat
function isOpenedByCheat(x, y) {
    return matrix.mx[x][y].isOpenByCheat;
}

//Consulta um valor numa posição da matriz (valor é o número entre -1 e 8)
function getValueAt(x, y) {
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

//Fecha uma célula se estiver aberta por cheat
function closeCellCheat(x, y) {
    matrix.mx[x][y].isOpenByCheat = false;
}

//Verifica se uma dada posição é válida
function positionIsValid(posx, posy) {
    return posx >= 0 && posy >= 0 && posx < matrix.maxx && posy < matrix.maxy;
    //console.log('pos ' + posx + ' ' + posy + ' valid :' + valid.toString());
    //return valid;
}

//Abre todas as células da matriz
function openAllCells() {
    var row, column;
    for (row = 0; row < matrix.maxx; row++) {
        for (column = 0; column < matrix.maxy; column++) {
            openCell(row, column);
        }
    }
}

//Gera um número aleatório entre min e max
function generateRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function simplePadding(num) {
    //return (num < 10 && num > 0) ? '0' + num.toString() : num.toString();
    if (num < 10 && num >= 0) {
        return '0' + num;
    } else {
        return num.toString();
    }
}

function getData() {
    return {
        playername: playername,
        xmax: matrix.maxx,
        ymax: matrix.maxy,
        xBombs: matrix.bombNum,
        timeTaken: timerValue,
        opened: matrix.openedCellCount,
        gameResult: matchResult,
        currentDateStr: getActualDateStr()
    }
}

/*=================================================== STYLE ================================================================*/

function setCheatButtonStyle(cheatValue) {
    document.getElementById('cheatOption').innerHTML = (cheatValue) ? "Sim" : "Não";
    document.getElementById('cheatOption').style.backgroundColor = (cheatValue) ? "#3ada76" : "#cb4b37";
}

/*=================================================== DEBUG ================================================================*/


/*PARA DEBUG! : gera uma visualização da matrix no console*/
function printFastVisualization() {
    var strRsp = '';
    for (var row = 0; row < matrix.maxx; row++) {
        for (var column = 0; column < matrix.maxy; column++) {
            strRsp += (simplePadding(getValueAt(row, column)) + ' ');
        }
        strRsp += '\n';
    }
    console.log(strRsp);
}