# POSSÍVEIS GRUPOS DE FUNÇÕES

## Funções de setup do tabuleiro
* `tabuleiro <- gerarMatrizTabuleiro()` **[DIFÍCIL]**
	* `colocarBombaPosAleatoria(tabuleiro)`**[MÉDIO]**//Deve verificar se a posição gerada não é repetida
	* `gerarPosAleatoriaX()`**[FÁCIL]** // gerar um número aleatório entre 0 e xmax-1
	* `gerarPosAleatoriaY()`**[FÁCIL]**// gerar um número aleatório entre 0 e ymax-1
	* `preencherMatriz()`**[DIFÍCL]**// Preenche a matriz com os números 0, 1, 2, 3 dependendo da distância das bombas

* `reiniciarJogo()` **[MÉDIO]**

## Funções de atualização visual do tabuleiro
* `geraVisualizaçãoTabuleiro()`**[DIFÍCIL]**//Visualização inicial do tabuleiro

## Funções de ação do jogador
* `celulaClicada()` **[DIFÍCIL]**
	* `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**
	* `dispararRelogio()` **[MÉDIO]**
	* `consultarCelula()` **[FÁCIL]**
	* `ganharJogo()` **[DIFÍCIL]**
		* `pararRelogio()` **[FÁCIL]**
		* `resetarRelogio()` **[FÁCIL]**
		* `adicionarAoHistorico()` **[FÁCIL]**
		* `mostrarVisualizacaoHistorico()` **[MÉDIO]**
		* `mostarMsgVenceu()` **[MÉDIO]**
    * `reiniciarJogo()` **[MÉDIO]**
	* `perderJogo()` **[MÉDIO]**
	* `pararRelogio()`  **[FÁCIL]**
	* `resetarRelogio()` **[FÁCIL]**
	* `adicionarAoHistorico()` **[FÁCIL]**
	* `mostrarVisualizacaoHistorico()` **[MÉDIO]**
	* `mostarMsgPerdeu()` **[MÉDIO]**
  * `reiniciarJogo()` **[MÉDIO]**
* `abrirRecursivo()` **[DIFÍCIL]**
	* `abrirUmaCelula()`**[FÁCIL]**
	* `contaMinasAoRedor()**[MÉDIO]**`
  * `ganharJogo()` **[DIFÍCIL]**


## Funções de gerenciamento de histórico
* `apagarHistorico()`**[FÁCIL]**
* `pararRelogio()` **[FÁCIL]**
* `resetarRelogio()` **[FÁCIL]**
* `adicionarAoHistorico()` **[FÁCIL]**
* `mostrarVisualizacaoHistorico()` **[MÉDIO]**


## Funções para opção de cheat
* `cheatMostarTodos()` **[DIFÍCIL]**
  * `abrirUmaCelulaCheat()`**[FÁCIL]**
  * `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**
* `cheatVoltarAoOriginal()` **[DIFÍCIL]**
  * `fecharUmaCelulaCheat()`**[FÁCIL]**
  * `atualizarVizualizacaoTabuleiro()` **[DIFÍCIL]**

## Funções de apoio
* `consultarPosicao()` **[FÁCIL]** //consultar o valor em um determinado x,y do tabueiro
* `posicaoValida()` **[FÁCIL]** // testar se um determinado par x,y está dentro do tabuleiro
