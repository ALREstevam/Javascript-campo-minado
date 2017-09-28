# Trabalho 2 - JavaScript
## Enunciado:

Neste trabalho deverá ser desenvolvida uma versão do jogo **“Campo Minado”** usando as ferramentas vistas na disciplina até o momento (HTML, CSS e JavaScript).

O jogo Campo Minado consiste em um **grid bidimensional (de tamanho definido pelo usuário)** em que são posicionadas **bombas (cuja quantidade também é definida pelo usuário)** em posições escolhidas **aleatoriamente**. Inicialmente o grid é apresentado para o usuário com todas as células **“fechadas” **(conteúdo oculto) e o objetivo do jogo é conseguir **“abrir”**, através de cliques com o mouse, todas as células que **não contenham bombas**.

Se o usuário clicar em uma célula que **contém uma bomba, todas as bombas do grid são exibidas e o usuário perde aquele jogo**. Caso o usuário clique em uma célula que não contenha uma bomba, esta célula **se torna “aberta”** e, em seu conteúdo, é exibido o **número de bombas** que estão presentes em sua **vizinhança** (vide Figura 1).

![enter image description here](http://www.ggte.unicamp.br/eam/pluginfile.php/374251/mod_assign/intro/Fig1.png)

**Figura 1** - Exemplo de Campo Minado com 5 linhas e 6 colunas. Neste campo, a célula em azul está "aberta", indicando que existem três bombas em sua vizinhança (região formada pelas 8 células em vermelho).

Caso não haja **nenhuma bomba na vizinhança** da célula clicada pelo usuário, esta célula se torna **“aberta”** e o processo de abertura se repete **recursivamente** para todas as células na vizinhança que ainda não estão abertas. Ou seja, se uma célula vizinha for vizinha de alguma bomba, o número de bombas na vizinhança é exibido. Caso tal célula vizinha não contenha nenhuma bomba em sua vizinhança, o **processo se repete para as células vizinhas desta célula**.

Para ilustrar, considere o campo minado apresentado na Figura 2, que contém três bombas posicionadas aleatoriamente (exibidas no grid apenas para facilitar a explicação). Considere então que o usuário clique na primeira célula no canto superior esquerdo (destacada em azul na Figura 3). Como esta célula não contém bombas, o jogo continua. Além disso, como esta célula também não contém bombas em sua vizinhança, o processo de “abertura” é repetido para todas as células em sua vizinhança (destacadas em amarelo na Figura 3). Nenhuma das células em amarelo contém bombas em sua vizinhança, então o processo se repete novamente para as células vizinhas a estas, até que sejam encontradas células que contenham bombas ao redor. Neste exemplo, um único clique na célula destacada em azul na Figura 3 é responsável por revelar o conteúdo de 14 células do grid (células em azul, amarelo e branco na Figura 3). Para que o usuário vença este jogo, ele deve conseguir abrir todas as 27 células do grid que não contenham bombas.

![enter image description here](http://www.ggte.unicamp.br/eam/pluginfile.php/374251/mod_assign/intro/Fig2.png)

**Figura 2** - Exemplo de Campo Minado com 5 linhas e 6 colunas, com todas as células fechadas (em vermelho). As bombas são exibidas apenas para fins ilustrativos.


![enter image description here](http://www.ggte.unicamp.br/eam/pluginfile.php/374251/mod_assign/intro/Fig3.png)

**Figura 3** - Exemplo do Campo Minado com 5 linhas e 6 colunas da Figura 2, após ação do usuário. Aqui o usuário clicou na célula destacada em azul, tal célula foi “aberta” e o processo se estendeu recursivamente para as células vizinhas. No final, tanto a célula em azul quando as células em branco/amarelo estão “abertas” e exibindo seu conteúdo para o usuário. Os números exibidos correspondem à quantidade de bombas na vizinhança de cada célula. Células sem número não contêm bombas em sua vizinhança. Novamente as bombas são exibidas apenas para fins ilustrativos.

Nesta atividade caberá ao grupo desenvolver uma versão do jogo **“Campo Minado”** em JavaScript e criar uma página web que permita ao usuário **jogar diferentes configurações do jogo** desenvolvido quantas vezes ele quiser. Nesta página o usuário deverá poder escolher as **dimensões do grid**, o **número de bombas no campo**, e inserir o **seu nome**. Uma vez fornecidas tais informações, o **campo minado é criado** e o usuário pode iniciar o jogo.

Esta página deve exibir também um **histórico**, atualizado automaticamente sempre que um jogador **ganhar ou perder uma partida**, de todas as partidas realizadas **enquanto a página estiver aberta**. Deverá ser possível **modificar as características do campo** (dimensões e número de minas) e **o nome do jogador** antes do início de uma nova partida, **sem que isto acarrete na perda do histórico.**

Este histórico deve exibir as seguintes informações sobre cada partida jogada: 

* Nome do jogador, 
* Dimensões do campo utilizado, 
* Número de bombas no campo, 
* Tempo gasto até a vitória ou derrota (contado a partir do primeiro clique no campo), 
* Número de células abertas e resultado da partida (vitória ou derrota).

## Regras para o Trabalho:

* Este trabalho deve ser desenvolvido pelo mesmo grupo definido para o Trabalho 1.

* Este trabalho terá peso duas vezes maior que o trabalho anterior.

* Deverá ser entregue um arquivo .ZIP contendo todos os arquivos necessários para execução e exibição correta do jogo (.html, .js, .css, imagens etc.). Favor manter, no arquivo .ZIP, a estrutura de diretórios necessária para execução do jogo.

* Cópias de outros grupos ou da internet serão penalizadas como descrito no programa da disciplina.

* Não serão aceitos trabalhos entregues fora do prazo.

* Todo o código-fonte em JavaScript deve estar contido em um único arquivo .JS externo.

* Todas as definições de formatação da página deverão estar contidas em uma folha de estilo CSS externa. É obrigatório o fornecimento de uma folha de estilo para a página.

* Os documentos HTML usados deverão seguir a versão 5 (HTML5).

* Tanto os arquivos HTML quando as folhas de estilo CSS deverão ser validadas no site do W3C.

* **Funcionalidades adicionais ao que foi pedido no enunciado são bem-vindas e podem gerar um bônus de até 2,0 pontos na nota deste trabalho (conforme sua complexidade/importância para o contexto desta atividade).**

* Para facilitar a correção (e o desenvolvimento) deverão ser adicionados dois botões que, ao serem clicados, provocam as seguintes modificações na dinâmica do jogo:

	* Um deles deve **mostrar o campo inteiro aberto** (todas as bombas presentes no mapa e números de bombas na vizinhança de cada célula), **sem interferir na execução do jogo**;

	*	O outro botão deve **recuperar a exibição normal do jogo**, com células abertas e fechadas

**ATENÇÃO**: os botões mencionados no item 11 devem poder ser clicados **em qualquer instante do jogo e não devem interferir no resultado da partida.**

