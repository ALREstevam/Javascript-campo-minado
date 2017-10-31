/**
 * Created by andre on 13/10/2017.
 */
"use strict";

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
var timerValue = "";
var matchResult = "desconhecido";


var htmlIdList = {
    vitoria: 'vitoria',
    derrota: 'derrota',
    historico: 'hist',
    game: 'game',
    title: 'gameBigTitle'
};


/*FUNÇÃO PRINCIPAL DO PROGRAMA: ATIVADA QUANDO UM ELEMENTO É CLICADO*/
function elementClicked(id) {
    if(!clickAble){
        return;
    }

    playSound(files.click);

    //console.log("Element clicked at position:");
    var elemPos = recoveryPostion(id);//Recuperando as coordenadas do elemento clicado
    //console.log(elemPos);

    if(isFirst){
        isFirst = false;
        startTimer();
        //console.log('Starting timer');
    }

    if(isBomb(elemPos.x, elemPos.y)) {
        looseGame();
        clickAble = false;
    }
    else{
        recursivelyExplore(elemPos.x, elemPos.y);
        updateBigNameTitle(playername, matrix.openedCellCount, (matrix.maxx * matrix.maxy) - matrix.bombNum);

        if(matrix.openedCellCount - ((matrix.maxx * matrix.maxy) - matrix.bombNum) == 0){
            winGame();
            clickAble = false;
        }
    }
    renderBoard(matrix);
}

/*FUNÇÃO A SER ACIONADA QUANDO O JOGADOR CLICAR EM INICIAR O JOGO*/
function setup() {
    if(!playing){
        playSound(files.start);
        playername = document.forms["setupForm"]["name"].value;
        var mxMaxX = document.forms["setupForm"]["tblx"].value;
        var mxMaxY = document.forms["setupForm"]["tbly"].value;
        var mxBombs = document.forms["setupForm"]["bombAmount"].value;

        updateBigNameTitle(playername, 0, (mxMaxX * mxMaxY) - mxBombs);


        try{


            console.log('=== Generating logical matrix');
            matrix = generateLogicalMatrix(mxMaxX, mxMaxY, mxBombs);

            console.log(matrix);
            console.log('=== Putting bombs in matrix');
            putBombsInMatrix(mxMaxX, mxMaxY, mxBombs);

            console.log('=== Filling matrix with values');
            fillMatrixWithValues();

            console.log('=== Rendering matrix to the screen');
            renderBoard(matrix);
        }
        catch(err){
            console.log(err);
            return false;
        }

        playing = true;//Impedir que o jogo reinicie se clicar em iniciar jogo no meio de uma partida
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


/*Adicionar um elemento*/
function  appendToHistoric(player, fieldx, fieldy, timeTaken, openedCells, matchResult) {

    var histElem = {
        player: player,
        fieldDimensions: fieldx * fieldy,
        fieldx: fieldx,
        fieldy: fieldy,
        timeTaken: timeTaken,
        openedCells: openedCells,
        matchResult: matchResult
    };
    var histsArray = new Array();

    if(!localStorage.getItem('hist')){
        localStorage.setItem('hist', JSON.stringify(histElem));
    }
    else{
        histsArray = JSON.parse(localStorage.getItem('hist'));
    }
    histsArray.push(histElem);
    localStorage.setItem('hist', JSON.stringify(histsArray));
}

/*Limpar o histórico
 * */
function clearHistoric(id){
    playSound(files.click2);
    localStorage.removeItem('hist');
    renderHistoric(id);
    //configHeight();
}

/*Ler histórico como um array de objetos
 * */
function readHistoric(){
    if(!localStorage.getItem('hist')){
        return null;
    }else{
        return JSON.parse(localStorage.getItem('hist'));
    }
}

/*Converter histórico para HTML
 * */
function historicToHtml(){
    if(!localStorage.getItem('hist')){
        return "<p>Histórico vazio</p>";
    }else{
        var hist = JSON.parse(localStorage.getItem('hist'));

        var rsp = "";
        for(var i = 0; i < hist.length; i++){
            var elem = hist[i];
            console.log(elem);
            rsp += "<div class='histElement'>\n";
            rsp += "<p><strong>Jogador: </strong>"+ elem.player +"</p>\n";
            rsp += "<p><strong>Campo: </strong>"+ elem.fieldx +" x "+ elem.fieldy +"</p>\n";
            rsp += "<p><strong>Tempo: </strong>"+ elem.timeTaken +"</p>\n";
            rsp += "<p><strong>Células abertas: </strong>"+ elem.openedCells +"</p>\n";
            rsp += "<p><strong>Resultado: </strong>"+ elem.matchResult +"</p>\n";
            rsp += "</div>\n";
            rsp += "<hr>\n";
        }
        return rsp;
    }
}

/*Colocar o histórico em HTML dentro de algum elemento
 * */
function renderHistoric(id){
    document.getElementById(id).innerHTML = historicToHtml();
}

/*Gerar a posição dos vizinhos em cruz*/
function getNeighborsPositionCross(cellx, celly) {
    return[{x: cellx+1,y:celly},{x:cellx-1 ,y:celly},{x:cellx ,y:celly+1}, {x:cellx ,y:celly-1}];
}

/*Gerar a posição dos vizinhos em círculo
 * */
function getNeighborsPositionCircle(cellx, celly) {
    return[
        {x:cellx+1  ,y:celly},
        {x:cellx-1  ,y:celly},
        {x:cellx    ,y:celly+1},
        {x:cellx    ,y:celly-1},
        {x:cellx+1  ,y:celly+1},
        {x:cellx-1  ,y:celly-1},
        {x:cellx+1  ,y:celly-1},
        {x:cellx-1  ,y:celly+1}
    ];
}

/*Contar minas ao redor de uma posição como cruz
 * */
function countMinesAroundCross(cellx, celly) {
    var arroundPos = getNeighborsPositionCross(cellx, celly);
    var bombCount = 0;

    for(var i = 0; i < arroundPos.length; i++){
        var pos = arroundPos[i];
        if(positionIsValid(pos.x, pos.y) && isBomb(pos.x, pos.y)){
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

    for(var i = 0; i < arroundPos.length; i++){
        var pos = arroundPos[i];
        if(positionIsValid(pos.x, pos.y) && getValueAt(pos.x, pos.y) == -1){
            bombCount++;
        }
    }
    return bombCount;
}


/*
 * Função que faz a exploração de forma recursiva
 * */
function recursivelyExplore(cellx, celly) {

    //console.error('ABERTAS: '+ matrix.openedCellCount +' DE ' + ((matrix.maxx * matrix.maxy) - matrix.bombNum))

    if(!isOpened(cellx, celly)){
        matrix.openedCellCount++;
    }

    openCell(cellx, celly);

    if(countMinesAroudCircle(cellx, celly) == 0){//Se nenhum dos vizinhos for bomba
        var neilst = getNeighborsPositionCross(cellx, celly);//pegar a posiçãp dos vizinhos
        for(var i = 0; i < neilst.length; i++){
            var nei = neilst[i];
            if(positionIsValid(nei.x, nei.y) && !isOpened(nei.x, nei.y)){
                recursivelyExplore(nei.x, nei.y);
            }
        }
    }
}

function gameBoardHtml(matrix) {
    var rsp = "";
    rsp += "<table class='game'>\n";
    for(var row = 0; row < matrix.maxx; row++){
        rsp+="\t<tr>\n";
        for(var column = 0; column < matrix.maxy; column++){
            var pos = {
                x: row,
                y: column
            };

            var classname = '';
            var names = ['none', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'];
            var closOpen = {closed: 'closedCell', open: 'openedCell'};
            var bombHere = 'bomb';

            if(isOpened(pos.x, pos.y)){//Está aberta
                classname = classNameFormat(classname, closOpen.open);
                if(isBomb(pos.x, pos.y)){//É uma bomba
                    classname = classNameFormat(classname, bombHere);
                }else{//Não é uma bomba, é um valor
                    classname = classNameFormat(classname, names[getValueAt(pos.x, pos.y)]);
                }
            }else{//Está fechada
                classname = classNameFormat(classname, closOpen.closed);
                if(isOpenedByCheat(pos.x, pos.y)){//Está aberta por cheat
                    if(isBomb(pos.x, pos.y)){//É uma bomba
                        classname = classNameFormat(classname, bombHere);
                    }else{//Não é uma bomba, é um valor
                        classname = classNameFormat(classname, names[getValueAt(pos.x, pos.y)]);
                    }
                }
            }
            rsp+="\t\t<td>\n\t\t\t" +
                "<button value='"+ JSON.stringify(pos) +"' id='"+
                (row.toString() + "," + column.toString()) +"'" +
                " onclick='elementClicked(this.id)' class='"+ classname +"'>" +
                "</button>\n\t\t</td>\n";
        }
        rsp+="\t</tr>\n";
    }
    rsp += "</table>\n";

    //console.log('Matrix view updated.');
    return rsp;
}

/*Gera a representação do jogo na memória*/
function generateLogicalMatrix(maxX, maxY, bombs) {

    var mx = new Array();
    for(var x = 0; x < maxX; x++){
        var my = new Array();
        for(var y = 0; y < maxY; y++){
            my.push(
                {
                    posx: x,
                    posy: y,
                    isExplored: false,
                    isOpenByCheat: false,
                    value: 0
                }
            );
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

//coloca aleatoriamente as bombas no tabuleiro
function putBombsInMatrix(xmax, ymax ,qntBombas){
    //console.log('Putting ' + qntBombas + ' bombs');
    for(var i = 0; i < qntBombas; i++){
        var touple;
        do{
            touple = getRandomXYtuple(xmax-1, ymax-1);
            //console.log('bombat: ' + touple.x + ' ' + touple.y);
        }while(isBomb(touple.x, touple.y) || !positionIsValid(touple.x, touple.y));
        setAsBomb(touple.x, touple.y);
    }

    //Para cada boma gera um valor de x e y aleatório e válido
    //Procura para a posição x e y gerada verifica se já existe bomba nessa posição
    //Se não houver coloca
    //Se houver repete o processo até encontrar uma célula vazia
}

//gera um arranjo de coordenadas x,y aleatórias
function getRandomXYtuple(maxX, maxY){
    var a, b;
    a = generateRandomBetween(0, maxX);
    b = generateRandomBetween(0, maxY);
    return {
        x: a,
        y: b
    };
    //Retorna uma lista no formato {x: 7, y:2} com x e y sendo randômicos
}

//Emite menssagem informando que o jogador perdeu
function looseMsg(){
    document.getElementById(htmlIdList.derrota).style.visibility= "visible";
}

//Emite menssagem informando que o jogador ganhou
function winMsg() {
    document.getElementById(htmlIdList.vitoria).style.visibility = "visible";
}

//retorna a data atual para computar o tempo gasto na partida
function getActualTime(){
    var dateString = "";
    var newDate = new Date();
    dateString += (newDate.getMonth() + 1) + "/";
    dateString += newDate.getDate() + "/";
    dateString += newDate.getFullYear();

    return dateString;
    //Retorna a data atual do sistema para comparar quanto tempo passou entre quando o relógio iniciou e parou
}

//Gera um número aleatório entre min e max
function generateRandomBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function restartGame(){
    playSound(files.click2);
    console.log('RESTARTING GAME');
    //OBS. DESISTÊNCIA Obter dados da partida e gravar no histórico (CONSIDERAR FAZER)

    //Zerar variáveis utilizadas que possam interferir na próxima partida
    resetGameVariables();

    var dataGame = getData();
    appendToHistoric(dataGame.player, dataGame.xmax, dataGame.ymax, dataGame.timeTaken, dataGame.opened, dataGame.gameResult);
    //Atualizar a visualização do histórico em html
    renderHistoric("hist");

    //Criar um novo jogo

    return false;
}

function resetGameVariables(){
    console.log('RESTARTING VARIABLES');
    //Verificar se existem variáveis a serem resetadas ou visualizações a serem atualizadas antes da nova partida
    matrix = null;
    playername = "*";
    playing = false;
    isFirst = true;
    clickAble = true;
    clockStart = null;
    clockEnd = null;
    cheating = false;
    time = 0;
    status = 0;
    //Ex: jogador ativou o cheat, desativar para a próxima partida?
    //resetar variavel
    //chama a função ..cheat
    //Se for complexo um refresh na página já faz esse trabalho
    //document.forms["setupForm"]["tblx"].setAttribute("value", "");
    document.getElementById('game').innerHTML = '<span class="gameName">&#128163; Campo minado &#128163;</span>';
    document.getElementById('chrono').innerHTML = '<div id=\'time\' class=\'timeColors\'>Cronometro</br>00:00:00</div>'
}

function cleanTexts() {
    document.getElementById("name").value="";
    document.getElementById("tblx").value="";
    document.getElementById("tbly").value="";
    document.getElementById("bombAmount").value="";
    document.getElementById("gameBigTitle").innerHTML="Campo Minado";
}


//fecha menssagens de aviso
function closepicture(id){
    document.getElementById(id).style.visibility="hidden";
}

function fillMatrixWithValues() {
    for(var row = 0; row < matrix.maxx; row++) {
        for(var column = 0; column < matrix.maxx; column++) {
            if (positionIsValid(row, column) && !isBomb(row, column)) {
                setValueAt(row, column, countMinesAroudCircle(row, column));
            }
        }
    }
}
function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function printFastVisualization() {
    var strRsp = '';
    for(var row = 0; row < matrix.maxx; row++){
        for(var column = 0; column < matrix.maxy; column++){
            strRsp += (simplePadding( getValueAt(row, column) ) + ' ');
        }
        strRsp += '\n';
    }
    console.log(strRsp);
}

function cheat(){
    if(!playing){
        return;
    }

    playSound(files.click2);
    cheating = !cheating;
    setCheatButtonStyle(cheating);
    var row, column;

    if(playing){
        if(cheating){
            for(row = 0; row < matrix.maxx; row++){
                for(column = 0; column < matrix.maxy; column++){
                    openCellByCheat(row, column);
                }
            }
        }else{
            for(row = 0; row < matrix.maxx; row++){
                for(column = 0; column < matrix.maxy; column++){
                    closeCellCheat(row, column);
                }
            }
        }
        renderBoard(matrix);
    }
}
	


function startTimer (){
   status = 1;
   //document.getElementById("btnStart").disabled = true;
   timer();
}

function stopTimer(){
   status = 0;
   //document.getElementById("btnStart").disabled = false;
}


function timer(){
   if(status == 1){
      setTimeout(
              function(){
               time++;
               var min = Math.floor(time/100/60);
               var sec = Math.floor(time/100);
               var mSec = time % 100;
               if(min < 10){
                   min = "0" + min;
               }
               if(sec >= 60){
                   sec = sec % 60;
               }
               if(sec < 10){
                   sec = "0" + sec;
               }
               document.getElementById('time').innerHTML = "Cronômetro<br>"+min + ":" + sec + ":" + mSec;
               timerValue = min + ":" + sec + ":" + mSec;
               timer();
           }
       , 10);
   }
}

function relogio(){
	var data = new Date();
	var horas = data.getHours();
	var minutos = data.getMinutes();
	var segundos = data.getSeconds();
	
	if(horas <10){
		horas = "0" + horas;
	}
	if(minutos <10){
		minutos = "0" + minutos;
	}
	if(segundos <10){
		segundos = "0" + segundos;
	}
	document.getElementById("relogio").innerHTML=horas+":"+minutos+":"+segundos;

}
function initrelogio(){
	setInterval(relogio, 1000);
}


function getData() { 
    return {
    	playername: document.forms["setupForm"]["name"].value,
    	xmax: document.forms["setupForm"]["tblx"].value,
		ymax: document.forms["setupForm"]["tbly"].value,
		xBombs: document.forms["setupForm"]["bombAmount"].value,
		timeTaken: timerValue,
		opened: matrix.openedCellCount,
		gameResult: matchResult
    }
}
 
function looseGame() {
    matchResult = "perdeu";
    playSound(files.loose);
    stopTimer();
    openAllCells();
    looseMsg();
    var data = getData();
    appendToHistoric(data.playername, data.xmax, data.ymax, data.timeTaken, data.opened, data.gameResult);
    renderHistoric(htmlIdList.historico);
    looseMsg();
    resetGameVariables();
}

function winGame()
{
    matchResult = "venceu";
    playSound(files.win);
    stopTimer();
    openAllCells();
    looseMsg();
    var data = getData();
    appendToHistoric(data.playername, data.xmax, data.ymax, data.timeTaken, data.opened, data.gameResult);
    renderHistoric(htmlIdList.historico);
    looseMsg();
    resetGameVariables();
}


	
function setCheatButtonStyle(cheatValue){
	document.getElementById('cheatOption').innerHTML=(cheatValue) ? "Sim" : "Não";
    document.getElementById('cheatOption').style.backgroundColor = (cheatValue) ? "#3ada76" : "#cb4b37";

}


