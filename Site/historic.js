/**
 * Created by andre on 30/10/2017.
 */


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
            //console.log(elem);
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

