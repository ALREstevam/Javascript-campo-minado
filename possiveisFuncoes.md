# POSSÍVEIS VARIÁVEIS

`xmax` tamanho máximo do tabuleiro em x
`ymax` tamanho máximo do tabuleiro em y

    gameCell{
    	valor = {-1, 0, 1, 2, 3, 4, 5, 6, 7, 8} -> -1: bomba, 0: 0->8: quantidade de bombas na redondeza
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
* [K]`gerarPosAleatoriaX()`**[FÁCIL]** // gerar um número aleatório entre 0 e xmax-1
* [K]`gerarPosAleatoriaY()`**[FÁCIL]**// gerar um número aleatório entre 0 e ymax-1
* [K]`consultarCelula()` **[FÁCIL]**
* [H] `pararRelogio()` **[FÁCIL]**
* [H] `resetarRelogio()` **[FÁCIL]**
* [A] `adicionarAoHistorico()` **[FÁCIL]**
* [P]`abrirUmaCelula()`**[FÁCIL]**
* [A]`apagarHistorico()`**[FÁCIL]**
* [P]`abrirUmaCelulaCheat()`**[FÁCIL]**
* [P]`fecharUmaCelulaCheat()`**[FÁCIL]**
* `consultarPosicao()` **[FÁCIL]** //consultar o valor em um determinado x,y do tabueiro
* `posicaoValida()` **[FÁCIL]** // testar se um determinado par x,y está dentro do tabuleiro


## Médio
* [K]`colocarBombaPosAleatoria(tabuleiro)`**[MÉDIO]**//Deve verificar se a posição gerada não é repetida
* [K]`dispararRelogio()` **[MÉDIO]**
* [A]`mostrarVisualizacaoHistorico()` **[MÉDIO]**
* [H] `mostarMsgVenceu()` **[MÉDIO]**
* [H]`reiniciarJogo()` **[MÉDIO]**
* [P]`perderJogo()` **[MÉDIO]**
* `mostarMsgPerdeu()` **[MÉDIO]**
* [A]`contaMinasAoRedor() **[MÉDIO]**`


## Difícil
* [H]`preencherMatriz()`**[DIFÍCL]**// Preenche a matriz com os números de -1 até 8 dependendo das bombas na redondeza
* [K]`geraVisualizaçãoTabuleiro()`**[DIFÍCIL]**//Visualização inicial do tabuleiro
* [H]`atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**
* [A]`abrirRecursivo()` **[DIFÍCIL]**
* `cheatMostarTodos()` **[DIFÍCIL]**
* [P]`cheatVoltarAoOriginal()` **[DIFÍCIL]**
* `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**


----

Pessoas: 5

Fáceis: 12
FáceisPorPessoa: 2,4

Médias: 8
MédiasPorPessoa: 1,6

Difíceis: 8
DifíceisPorPessoa: 1,6

