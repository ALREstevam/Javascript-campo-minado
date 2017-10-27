
// **OBS.:** os nomes das funções das variáveis e dos argumentos são só exemplos.
// **OBS.:** esse arquivo não deve ser utilizado no site, é um .js apenas para o github aplicar as cores nas funções e comentários.

function functionName(args...){//[implementado? (s: sim, n: não, p: parcialmente)][pessoa]

}

function functionName(args...){//[s][Z]

}

/*############################################################################################################################
## 1. Funções principais
############################################################################################################################*/
//**(Essas funções tem pouco processamento e só chamam as outras ou fazem testes básicos)**

"[P][And]"
function cellClicked(id){
	//Recuperar o x e y da célula com base no id
	//Se for a primeira: disparar o relógio
	//Se for uma bomba: perder o jogo
	//Se não for bomba: abrir recursivamente
	//Se todas as células não bombas foram abertas: ganhar jogo
	//Caso contrário: atualizar a visualização da matriz em HTML
}

"[P][And]"
function startGame(playername, xmax, ymax, nBombs){
	//Criar a matriz na memória
	//Colocar as bombas na matriz da memória
	//Gerar os números de bombas ao redor na matriz da memória
	//Usar a matriz da memória para gerar uma representação em HTML
}

"[P][And]"
function pageLoaded(){
	//Carregar o histórico
}


"[N][May]"
function restartGame(){
	//OBS. DESISTÊNCIA Obter dados da partida e gravar no histórico (CONSIDERAR FAZER)
	//Atualizar a visualização do histórico em html
	//Zerar variáveis utilizadas que possam interferir na próxima partida
	//Criar um novo jogo
}

"[S][And]"
function resetHistoric(){
	//Apagar o histórico
	//Atualizar o HTML do histórico
}

"[][Ped]"
function cheat(){
	//Se estiver ativado, definir como desativado
	//Se estiver desativado definir como ativado

	//Dependendo do estado
	//Iterar na matriz da memória alterando os valores para mostrar ou não todas as células
	//atualizar a visualização da matriz em HTML
}

/*############################################################################################################################
## 2. Funções chamadas pelas funções anteriores
############################################################################################################################*/

"[S][And]"
function recoveryPosition(id){
	//Retorna a posição da célula na matriz com base em seu id
}


"[][Ped]"
function looseGame(?){
	//Parar o relógio
	//Obter dados da partida e gravar no histórico
	//Atualizar a visualização do histórico em html
	//Mostrar mensagem: jogador perdeu o jogo
	//Zerar variáveis utilizadas que possam interferir na próxima partida
}


"[][Ped]"
function winGame(?){
	//Parar o relógio
	//Obter dados da partida e gravar no histórico
	//Atualizar a visualização do histórico em html
	//Mostrar mensagem: jogador ganhou o jogo
	//Zerar variáveis utilizadas que possam interferir na próxima partida
}

"[S][And]"
function recusivelyOpen(?){
	//abre as células de forma recursiva...
}

"[P][Kar]"
function generateGameBoardHTML(){
	// Itera na matriz da memória e dependendo dos valores guardados gera um HTML correspondente
}

"[S][And]"
function generateLogicalMatrix(maxX, maxY, bombs){
	//Gera e preenche com valores padrão a matriz que representará o tabuleiro
}

"[][Kar]"
function putBombsInMatrix(){
	//Para cada boma gera um valor de x e y aleatório e válido
	//Procura para a posição x e y gerada verifica se já existe bomba nessa posição
	//Se não houver coloca
	//Se houver repete o processo até encontrar uma célula vazia
}

"[][Hua]"
function fillMatrixWithValues(){
	//Itera na matriz da memória, para cada célula conta quantas bombas estão nas vizinhas e grava esse valor no campo value da célula
	//-1 para: a célula é uma bomba
	//0->8 para: existem n bombas ao redor (considerando um círculo)
}

"[S][And]"
function loadHistoric(){
	//Carrega os dados do histórico
	//Gera e mostra um HTML com esses dados
}

"[S][And]"
function clearHistoric(){
	//Limpa os dados do histórico
	//Gera e mostra um HTML com esses dados
}

"[][Ped]"
function swapCheatStatus(cheat){
	//Recebe o status atual do cheat e retorna o próximo (return !cheat)
}

/*############################################################################################################################
## 3. Funções chamadas pelas funções anteriores
############################################################################################################################*/

"[][Kar]"
function startWatch(){
	//dispara um relógio (se não for preciso mostrar a contagem na tela basta guardar a hora atual para comparar depois)
}

"[][Kar]"
function stopWatch(){
	//para um relógio (se não for preciso mostrar a contagem na tela basta guardar a hora atual para comparar depois)
}

"[][Kar]"
function calculateMatchTime(startTime, endTime){
	//Calcula o tempo entre endTime e startTime
}

"[S][And]"
function appendToHistoric(...){
	//Adiciona dados da partida ao histórico
}

"[S][And]"
function historicToHtml(){
	//Cria um código HTML que representa o histórico
}

"[S][And]"
function renderHistoric(id){
	//Coloca o código gerado pelo historicToHtml em algum elemento da página
}

"[][Hua]"
function looseMsg(){
	//Mostra uma mensagem indicando que o jogador perdeu o jogo
}

"[][Hua]"
function winMsg(){
	//Mostra uma mensagem indicando que o jogador ganhou o jogo
}

"[][May]"
function resetGameVariables(){
	//Verificar se existem variáveis a serem resetadas ou visualizações a serem atualizadas antes da nova partida
	//Ex: jogador ativou o cheat, desativar para a próxima partida?
	//Se for complexo um refresh na página já faz esse trabalho
}


"[S][And]"
function getNeighboursPositionCross(x, y){
	//Retorna uma lista com o x,y dos vizinhos olhando como uma cruz (cima, baixo, esquerda, direita)
	//Utilizado para na função de abertura recursiva
}

"[S][And]"
function countBombsAroundCross(x, y){
	//Conta bombas existem ao redor de uma posição considerando uma cruz (cima, baixo, esquerda, direita)
	//Usa o getNeighboursPositionCross
	//Utilizado para na função de abertura recursiva
}

//***Essas funções servirão apenas para facilitar o acesso a matriz e centralizar esse código***
"[S][And]"
function isOpened(x, y){
    //Consulta uma posição na matriz e retorna se ela está marcada como aberta
}

"[S][And]"
function isOpenedByCheat(x, y){
    //Consulta uma posição na matriz e retorna se ela está marcada como aberta pelo cheat

"[S][And]"
function getValueAt(x, y){
    //Consulta um valor numa posição da matriz (valor é o número entre -1 e 8)
}

"[S][And]"
function setValueAt(x, y, val) {
    //Seta um valor numa posição
}

"[S][And]"
function openCell(x, y) {
    //Seta uma célula como aberta
}

"[S][And]"
function openCellByCheat(x, y) {
    //Seta uma célula como aberta por cheat

}

"[S][And]"
function isBomb(x, y) {
    //Retorna true se existir uma boma na posição
}


"[S][And]"
function setAsBomb(x, y) {
    //Seta uma posição como sendo bomba
}
//****//

"[][Kar]"
function getRandomXYtuple(maxX, maxY){
	//Retorna uma lista no formato {x: 7, y:2} com x e y sendo randômicos
}

"[S][And]"
function getNeighboursPositionCircle(x, y){
	//Retorna uma lista com o x,y dos vizinhos olhando como um círculo (cima, baixo, esquerda, direita, diagonal cima direita, diagonal cima esquerda, diagonal baixo direita, diagonal baixo esquerda)
	//Utilizado para na função de gerar o valor de cada célula
	/**/
}

"[S][And]"
function countBombsAroundCircle(x, y){
	//Conta bombas existem ao redor de uma posição considerando uma cruz (cima, baixo, esquerda, direita, diagonal cima direita, diagonal cima esquerda, diagonal baixo direita, diagonal baixo esquerda)
	//Usa o getNeighboursPositionCircle
	//Utilizado para na função de gerar o valor de cada célula
}


/*############################################################################################################################
## 4. Funções chamadas pelas funções anteriores
############################################################################################################################*/
"[][Kar]"
function getActualTime(){
	//Retorna a data atual do sistema para comparar quanto tempo passou entre quando o relógio iniciou e parou
}

"[][Kar]"
function generateRandomBetween(min, max){
	//Gera um número aleatório entre min e max
}

/*############################################################################################################################
## Funções de apoio
############################################################################################################################*/
"[][Ped]"
function setCheatButtonStyle(cheatOpt){
	//Define o estilo do botão de cheat dependendo se está ativado ou não
}

"[S][And]"
function updateBigNameTitle(playename){
	//Atualiza o campo do nome do jogo adicionando o nome do jogador
}

"[][May]"
function positionIsValid(x, y){
	//Retorna true se x e y indicar uma posição dentro do tabuleiro
}

/*############################################################################################################################
## Funções Implementadas
############################################################################################################################*/

function elementClicked(id){}
function setup(){}
function pageLoad(){}
function appendToHistoric(player, fieldx, fieldy, timeTaken, oppenedCells, matchResult){}
function clearHistoric(id){}
function readHistoric(){}
function historicToHtml(){}
function renderHistoric(id){}
function getNeighborsPositionCross(cellx, celly){}
function getNeighborsPositionCircle(cellx, celly){}
function countMinesAroundCross(boardMatrix, cellx, celly){}
function countMinesAroudCircle(boardMatrix, cellx, celly){}
function recursivelyExplore(cellx, celly, mx){}
function gameBoardHtml(matrix){}
function recoveryPostion(id){}
function generateLogicalMatrix(maxX, maxY, bombs){}
function updateBigNameTitle(playename){}

function isOpened(x, y){}
function isOpenedByCheat(x, y){}
function getValueAt(x, y){}
function setValueAt(x, y, val){}
function openCell(x, y){}
function openCellByCheat(x, y){}
function isBomb(x, y){}
function setAsBomb(x, y){}
