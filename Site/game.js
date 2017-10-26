/**
 * Created by andre on 13/10/2017.
 */
"use strict";

/*
* TODO: a variávels 'playing' precisa ser definida como false no fim de uma partida
* OBS: como um adicional, o histórico ficará armazenaodo mesmo que o usuário deixe a página.
*
*
* */


var matrix;
var playername = "*";
var playing = false;




/*FUNÇÃO PRINCIPAL DO PROGRAMA: ATIVADA QUANDO UM ELEMENTO É CLICADO*/
function elementClicked(id) {

    console.log("Element clicked at position:");
    var elemPos = recoveryPostion(id);//Recuperando as coordenadas do elemento clicado
    console.log(elemPos);
}

/*FUNÇÃO A SER ACIONADA QUANDO O JOGADOR CLICAR EM INICIAR O JOGO*/
function setup() {
    if(!playing){
        playername = document.forms["setupForm"]["name"].value;
        var mxMaxX = document.forms["setupForm"]["tblx"].value;
        var mxMaxY = document.forms["setupForm"]["tbly"].value;
        var mxBombs = document.forms["setupForm"]["bombAmount"].value;

        updateBigNameTitle(playername);

        matrix = generateLogicalMatrix(mxMaxX, mxMaxY, mxBombs);
        console.log(matrix);
        document.getElementById('game').innerHTML = gameBoardHtml(matrix);

        playing = true;//Impedir que o jogo reinicie se clicar em iniciar jogo no meio de uma partida
        //configHeight();
    }
    return false;
}

/*Função chamada assim que a página é carregada*/
function pageLoad() {
    appendToHistoric("Teste", 1, 2, 3, 4, "Perdeu");//Apenas para testar o histórico
    renderHistoric("hist");
    //configHeight();
}

function configHeight() {
    /*var newHeight = (document.getElementById("configs").clientHeight - 20)+ "px";
    document.getElementById("gameArea").style.setProperty("height", newHeight);*/

    /*var confHeight = (document.getElementById("configs").clientHeight);
    var gameHeight = (document.getElementById("gameArea").clientHeight);

    if(confHeight > gameHeight){
        document.getElementById("gameArea").style.setProperty("height", (confHeight - 20)+"px", "important");
    }else{
        document.getElementById("configs").style.setProperty("height", gameHeight+"px", "important");
    }
    */
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
function countMinesAroundCross(boardMatrix, cellx, celly) {
    var arroundPos = getNeighborsPositionCross(cellx, celly);
    var bombCount = 0;

    for(var i = 0; i < arroundPos.length; i++){
        var pos = arroundPos[i];
        if(positionIsValid(pos.x, pos.y) && boardMatrix[pos.x][pos.y].value == -1){
            bombCount++;
        }
    }
    return bombCount;
}

/*Contar minas ao redor de uma posição como círculo
* */
function countMinesAroudCircle(boardMatrix, cellx, celly) {
    var arroundPos = getNeighborsPositionCircle(cellx, celly);
    var bombCount = 0;

    for(var i = 0; i < arroundPos.length; i++){
        var pos = arroundPos[i];
        if(positionIsValid(pos.x, pos.y) && boardMatrix[pos.x][pos.y].value == -1){
            bombCount++;
        }
    }
    return bombCount;
}

/*
* Função que faz a exploração de forma recursiva
* */
function recursivelyExplore(cellx, celly, mx) {
    mx[cellx][celly].isExplored = true;
    if(countMinesAroundCross(mx, cellx, cellx) == 0){
        var nPos = getNeighborsPositionCross(mx, cellx, celly);
        for(var i = 0; i < nPos.length; i++){
            var pos = nPos[i];
            if(!mx[pos.x][pos.y].isExplored){
                recursivelyExplore(pos.x, pos.y);
            }
        }
    }
}

/*CONTINUAR ESSE EXEMPLO*/
function gameBoardHtml(matrix) {
    var rsp = "";
    rsp += "<table class='game'>\n";
        for(var row = 0; row < matrix.maxy; row++){
            rsp+="\t<tr>\n";
            for(var column = 0; column < matrix.maxx; column++){
                var pos = {
                    x: row,
                    y: column
                };

                
                
                
                /*TODO Adicionar a verificação se a célula está aberta, se estiver mostrar o ícone dentro dela,
                para facilitar podemos representar as bombas usando o caractere: &#128163;

                De acordo com o valor da célula atribuir um dos seguintes conjuntos de classes ao button

                 "openedCell bomb",
                 "openedCell one",
                 "openedCell two",
                 "openedCell three",
                 "openedCell four",
                 "openedCell five",
                 "openedCell six",
                 "openedCell seven",
                 "openedCell eight",
                 "openedCell none",
                 "closedCell"
                */

                // v Gera um exemplo de visualização - RETIRAR ISSO QUANDO O CÓDIGO ESTIVER FEITO
                var arr =  ["closedCell", "closedCell", "closedCell", "closedCell", "openedCell none", "openedCell none", "openedCell none", "openedCell one", "openedCell two", "openedCell three", "closedCell bomb"];
                var value = arr[Math.floor(Math.random() * arr.length)];
                console.log(value);
                // ^ Gera um exemplo de visualização - RETIRAR ISSO QUANDO O CÓDIGO ESTIVER FEITO

                rsp+="\t\t<td>\n\t\t\t" +
                    "<button value='"+ JSON.stringify(pos) +"' id='"+
                    (row.toString() + "," + column.toString()) +"'" +
                    " onclick='elementClicked(this.id)' class='"+ value +"'>" +
                    "</button>\n\t\t</td>\n";
            }
            rsp+="\t</tr>\n";
        }
    rsp += "</table>\n";
    console.log('Matrix view updated.');
    return rsp;
}

/*Recupera uma posição com base em um ID*/
function recoveryPostion(id) {
    return JSON.parse(document.getElementById(id).getAttribute("value"));
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
        oppenedCellCount: 0,
        maxx: maxX,
        maxy: maxY,
        mx: mx
    };

    console.log("Logical matrix generated.");
    console.log(aMatrix);
    return aMatrix;
}


function updateBigNameTitle(playename) {
    document.getElementById('gameBigTitle').innerHTML = "Campo Minado | Partida de: " + playename;
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

/*
* PARA QUEM FOR DESENVOLVER A VERIFICAÇÃO DE POSIÇÃO VÁLIDA: substituir esse código*/
function positionIsValid(posx, posy) {
    return false;
}

//KAREN POR FAZER
function generateGameBoardHTML(x, y){
	// Itera na matriz da memória e dependendo dos valores guardados gera um HTML correspondente
}

//coloca aleatoriamente as bombas no tabuleiro
function putBombsInMatrix(xmax, ymax ,qntBombas){
	var a, b, c, d;
	for (a=0;a<qntBombas;a++) {
		b = Math.floor(Math.random() * xmax + 1);
		c = Math.floor(Math.random() * ymax + 1);
		for (d=0; d<xmax*ymax ;d++) {
			if (isBomb(b, c) != true) {
				setAsBomb(b, c);
			}
			b = Math.floor(Math.random() * xmax + 1);
			c = Math.floor(Math.random() * ymax + 1);
		}
	}
	//Para cada boma gera um valor de x e y aleatório e válido
	//Procura para a posição x e y gerada verifica se já existe bomba nessa posição
	//Se não houver coloca
	//Se houver repete o processo até encontrar uma célula vazia
}

//gera um arranjo de coordenadas x,y aleatórias
function getRandomXYtuple(maxX, maxY){
	var a, b, rsp[2];
	a = Math.floor(Math.random() * xmax + 1);
	b = Math.floor(Math.random() * ymax + 1);
	rsp["x"] = a;
	rsp["y"] = b;;
	return rsp;
	//Retorna uma lista no formato {x: 7, y:2} com x e y sendo randômicos
}

//KAREN POR FAZER
function getActualTime(){
	//Retorna a data atual do sistema para comparar quanto tempo passou entre quando o relógio iniciou e parou
}

//Gera um número aleatório entre min e max
function generateRandomBetween(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}