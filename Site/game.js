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

    //console.log("Element clicked at position:");
    var elemPos = recoveryPostion(id);//Recuperando as coordenadas do elemento clicado
    //console.log(elemPos);

    if(isFirst){
        clockStart = getActualTime();
        isFirst = false;
        //console.log('Starting timer');
    }

    if(isBomb(elemPos.x, elemPos.y)) {
        openAllCells();
        looseMsg();
        clickAble = false;
        clockEnd = getActualTime();
    }
    else{
        recursivelyExplore(elemPos.x, elemPos.y);
        if(matrix.openedCellCount - ((matrix.maxx * matrix.maxy) - matrix.bombNum) == 0){
            openAllCells();
            winMsg();
            clickAble = false;
            clockEnd = getActualTime();
        }
    }
    renderBoard(matrix);
}

/*FUNÇÃO A SER ACIONADA QUANDO O JOGADOR CLICAR EM INICIAR O JOGO*/
function setup() {
    if(!playing){
        playername = document.forms["setupForm"]["name"].value;
        var mxMaxX = document.forms["setupForm"]["tblx"].value;
        var mxMaxY = document.forms["setupForm"]["tbly"].value;
        var mxBombs = document.forms["setupForm"]["bombAmount"].value;

        updateBigNameTitle(playername);

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
	closepicture('vitoria');
	closepicture('derrota');
    renderHistoric("hist");
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
    openCell(cellx, celly);
    //console.error('ABERTAS: '+ matrix.openedCellCount +' DE ' + ((matrix.maxx * matrix.maxy) - matrix.bombNum))
    matrix.openedCellCount++;
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
function winMsg(){
	document.getElementById(htmlIdList.vitoria).style.visibility= "visible";
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
    cheating = !cheating;
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

