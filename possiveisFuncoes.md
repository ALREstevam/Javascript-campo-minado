# POSSÍVEIS VARIÁVEIS

`xmax` tamanho máximo do tabuleiro em x
`ymax` tamanho máximo do tabuleiro em y

    gameCell{
    	valor = {-1, 0, 1, 2, 3} -> -1 = bomba
    	explorado = {true, false} 	//se já foi explorado (se está aberto ou fechado)
    	abertoCheat = {true, false}		// se está aberto ou fechado da perspectiva da opção de cheat
    }


Como a célula pode ser aberta com o botão de cheat e quando clicada:
`(CÉLULA DEVE SER MOSTRADA?) = explorado == true || abertoCheat == true`

    tabuleiro = gameCell[xmax][ymax]
    
    totalElems = xmax*ymax 					// total de elementos
    qntBombas 								// quantidade de bombas no jogo
    qntAbertos 								// quantidade de células abertas
    qntFechadas = totalElems - qntAbertos 	// quantidade de células fechadas
    qntSeguras = totalElms - qntBombas 		// quantidade de células seguras


# POSSÍVEIS FUNÇÕES
## Fácil
* `gerarPosAleatoriaX()`**[FÁCIL]** // gerar um número aleatório entre 0 e xmax-1
* `gerarPosAleatoriaY()`**[FÁCIL]**// gerar um número aleatório entre 0 e ymax-1
* `consultarCelula()` **[FÁCIL]**
* `pararRelogio()` **[FÁCIL]**
* `resetarRelogio()` **[FÁCIL]**
* [A] `adicionarAoHistorico()` **[FÁCIL]**
* `abrirUmaCelula()`**[FÁCIL]**
* [A]`apagarHistorico()`**[FÁCIL]**
* `abrirUmaCelulaCheat()`**[FÁCIL]**
* `fecharUmaCelulaCheat()`**[FÁCIL]**
* `consultarPosicao()` **[FÁCIL]** //consultar o valor em um determinado x,y do tabueiro
* `posicaoValida()` **[FÁCIL]** // testar se um determinado par x,y está dentro do tabuleiro


## Médio
* `colocarBombaPosAleatoria(tabuleiro)`**[MÉDIO]**//Deve verificar se a posição gerada não é repetida
* `dispararRelogio()` **[MÉDIO]**
* [A]`mostrarVisualizacaoHistorico()` **[MÉDIO]**
* `mostarMsgVenceu()` **[MÉDIO]**
* `reiniciarJogo()` **[MÉDIO]**
* `perderJogo()` **[MÉDIO]**
* `mostarMsgPerdeu()` **[MÉDIO]**
* [A]`contaMinasAoRedor()**[MÉDIO]**`


## Difícil
* [A]`tabuleiro <- gerarMatrizTabuleiro()` **[DIFÍCIL]**
* `preencherMatriz()`**[DIFÍCL]**// Preenche a matriz com os números 0, 1, 2, 3 dependendo da distância das bombas
* `geraVisualizaçãoTabuleiro()`**[DIFÍCIL]**//Visualização inicial do tabuleiro
* `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**
* [A]`abrirRecursivo()` **[DIFÍCIL]**
* `cheatMostarTodos()` **[DIFÍCIL]**
* `cheatVoltarAoOriginal()` **[DIFÍCIL]**
* `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**


----

Pessoas: 5

Fáceis: 12
FáceisPorPessoa: 2,4

Médias: 8
MédiasPorPessoa: 1,6

Difíceis: 8
DifíceisPorPessoa: 1,6

