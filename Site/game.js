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
    }
    return false;
}

/*Função chamada assim que a página é carregada*/
function pageLoad() {
    appendToHistoric("Teste", 1, 2, 3, 4, "Perdeu");//Apenas para testar o histórico
    renderHistoric("hist");
}


/*Adicionar um elemento*/
function  appendToHistoric(player, fieldx, fieldy, timeTaken, oppenedCells, matchResult) {

    var histElem = {
        player: player,
        fieldDimensions: fieldx * fieldy,
        fieldx: fieldx,
        fieldy: fieldy,
        timeTaken: timeTaken,
        oppenedCells: oppenedCells,
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

        console.log(elem);

        var rsp = "";
        for(var i = 0; i < hist.length; i++){
            var elem = hist[i];
            rsp += "<div class='histElement'>\n";
            rsp += "<p><strong>Jogador: </strong>"+ elem.player +"</p>\n";
            rsp += "<p><strong>Campo: </strong>"+ elem.fieldx +" x "+ elem.fieldy +"</p>\n";
            rsp += "<p><strong>Tempo: </strong>"+ elem.timeTaken +"</p>\n";
            rsp += "<p><strong>Células abertas: </strong>"+ elem.oppenedCells +"</p>\n";
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
        for(var row = 0; row < matrix.maxx; row++){
            rsp+="\t<tr>\n";
            for(var column = 0; column < matrix.maxy; column++){
                var pos = {
                    x: row,
                    y: column
                };

                /*TODO Adicionar a verificação se a célula está aberta, se estiver mostrar o ícone dentro dela,
                para facilitar podemos representar as bombas usando o caractere: &#128163;
                */

                rsp+="\t\t<td>\n\t\t\t<button value='"+ JSON.stringify(pos) +"' id='"+
                    (row.toString() + "," + column.toString()) +"'" +
                    " onclick='elementClicked(this.id)'></button>\n\t\t</td>\n";
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



/*
* PARA QUEM FOR DESENVOLVER A VERIFICAÇÃO DE POSIÇÃO VÁLIDA: substituir esse código*/
function positionIsValid(posx, posy) {
    return false;
}