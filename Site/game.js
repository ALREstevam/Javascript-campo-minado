/**
 * Created by andre on 13/10/2017.
 */
"use strict";

var boadRows = 0;
var boardColumns = 0;



var cellElementExample = {
    posx: 1, //não é fundamental se estiver em uma matriz
    posy: 2, //não é fundamental se estiver em uma matriz

    isExplored: false,
    isOpenByCheat: false,

    value: 3
};


//Funções - André
    //Funções do histórico

/*
OBS: como um adicional, o histórico ficará armazenado mesmo que o usuário deixe a página.
*/

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

/*Limpar o histórico*/
function clearHistoric(){
    localStorage.removeItem('hist');
}

/*Ler histórico como um array de objetos*/
function readHistoric(){
    if(!localStorage.getItem('hist')){
        return null;
    }else{
        return JSON.parse(localStorage.getItem('hist'));
    }
}

/*Converter histórico para HTML*/
function historicToHtml(){
    if(!localStorage.getItem('hist')){
        return "<p>Histórico vazio</p>";
    }else{
        var hist = JSON.parse(localStorage.getItem('hist'));

        var rsp = "";
        for(var elem in hist){
            rsp += "<div class='histElement'>\n";
            rsp += "<p><strong>Jogador: </strong>"+ elem.player +"</p>\n";
            rsp += "<p><strong>Campo: </strong>"+ elem.fieldx +" x "+ elem.fieldy +"</p>\n";
            rsp += "<p><strong>Tempo: </strong>"+ elem.timeTaken +"</p>\n";
            rsp += "<p><strong>Células abertas: </strong>"+ elem.oppenedCells +"</p>\n";
            rsp += "</div>\n";
        }
        return rsp;
    }
}

/*Colocar o histórico em HTML dentro de algum elemento*/
function renderHistoric(id){
    document.getElementById(id).innerHTML = historicToHtml();
}

function getNeighborsPositionCross(cellx, celly) {
    return[{x: cellx+1,y:celly},{x:cellx-1 ,y:celly},{x:cellx ,y:celly+1}, {x:cellx ,y:celly-1}];
}

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

function countMinesAroundCross(boardMatrix, cellx, celly) {
    var arroundPos = getNeighborsPositionCross(cellx, celly);
    var bombCount = 0;

    for(var pos in arroundPos){
        if(/*positionIsValid(pos.x, pos.y) && boardMatrix[pos.x][pos.y].value == -1*/false){
            bombCount++;
        }
    }
    return bombCount;
}

function countMinesAroudCircle(boardMatrix, cellx, celly) {
    var arroundPos = getNeighborsPositionCircle(cellx, celly);
    var bombCount = 0;

    for(var pos in arroundPos){
        if(/*positionIsValid(pos.x, pos.y) && boardMatrix[pos.x][pos.y].value == -1*/false){
            bombCount++;
        }
    }
    return bombCount;
}


function recursivelyExplore(cellx, celly) {
    var aroundPos = getNeighborsPositionCross(cellx, celly);
    var aroundBombs = countMinesAroundCross(cellx, cellx);

    boardMatrix[cellx][celly].isExplored = true;
    //renderOpen(cellx, celly);

    if(aroundBombs == 0){
        for(var pos in aroundPos){
            if(!boardMatrix[pos.x][pos.y].isExplored){
                recursivelyExplore(pos.x, pos.y);
            }
        }
    }
}

function gameBoardHtml(maxX, maxY) {
    var rsp = "";
    rsp += "<table class='game'>\n";
        for(var row = 0; row < maxX; row++){
            rsp+="\t<tr>\n";
            for(var column = 0; column < maxY; column++){
                var pos = {
                    x: row,
                    y: column
                };
                rsp+="\t\t<td>\n\t\t\t<button value='"+ JSON.stringify(pos) +"' id='"+
                    (row.toString() + "," + column.toString()) +"'" +
                    " onclick='elementClicked(this.id)'></button>\n\t\t</td>\n";
            }
            rsp+="\t</tr>\n";
        }
    rsp += "</table>\n";
    return rsp;
}

function elementClicked(id) {
    console.log("EVENT: Element clicked in position:");
    console.log(recoveryPostion(id));
}

function recoveryPostion(id) {
    return JSON.parse(document.getElementById(id).getAttribute("value"));
}


function test() {
    document.getElementById('game').innerHTML = gameBoardHtml(50, 50);
}


//Funções - Pedro


function mudarNome()
{

 if(document.getElementById("cheatOption").value == "Não")
 {
  document.getElementById("cheatOption").value = "Sim";
 } 
 else
 
  document.getElementById("cheatOption").value = "Não";
 
}

abrirUmaCelulaCheat(maxX,maxY){
	for(i=0;i<maxX;i++){
		for(j=0;j<maxY;y++){
			isOpenByCheat:true;
		}
	}
	atualizarVizualizacaoTabuleiro();
}

fecharUmaCelulaCheat(maxX,maxY){
	for(i=0;i<maxX;i++){
		for(j=0;j<maxY;y++){
			isOpenByCheat:false;
		}
	}
	atualizarVizualizacaoTabuleiro();
}

abrirUmaCelula(){
		isExplored: true;
		
}








