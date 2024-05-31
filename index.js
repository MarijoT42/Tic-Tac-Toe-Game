$(document).ready(function() {
    let currentPlayer = 'X';
    let playerToken = 'X';
    let computerToken = 'O';
    let cells = $('.cells');
    let gameOver = false;
    let singleplayer = false;
    //sonidos o ser feliz...
    let winAudio = new Audio('./sounds/win.wav');
    let goAudio = new Audio('./sounds/go.wav');
    let drawAudio = new Audio('./sounds/draw.wav');

    function showGame() {
        $('#container').show();
        $('#modal').hide();
    }

    function showModal() {
        $('#container').hide();
        $('#modal').show();
    }

    $('#singleplayerButton').on('click', function() {
        singleplayer = true;
        showGame();
        updateTurn();
    });

    $('#multiplayerButton').on('click', function() {
        singleplayer = false;
        showGame();
        updateTurn();
    });

    $('#exitButton').on('click', function() {
        resetGame();
        showModal();
    });

    cells.on('click', userMove);
    updateTurn();

    function userMove(e) {
        if (!gameOver) {
            let cellValue = $(e.target).text();
            if (!cellValue.length) {
                $(e.target).text(currentPlayer);
                $(e.target).addClass(currentPlayer === 'X' ? 'x-selected' : 'o-selected');
                checkLine(0, 1, 2);
                checkLine(3, 4, 5);
                checkLine(6, 7, 8);
                checkLine(0, 3, 6);
                checkLine(1, 4, 7);
                checkLine(2, 5, 8);
                checkLine(0, 4, 8);
                checkLine(2, 4, 6);

                if (!gameOver) {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateTurn();
                    checkDraw();
                    if (singleplayer && currentPlayer === computerToken) {
                        setTimeout(computerMove, 500);
                    } else {
                        checkDraw();
                    }
                }
            }
        }
    }

    function computerMove() {
        let emptyCells = cells.filter(function() {
            return $(this).text() === '';
        });
    
        if (emptyCells.length > 0 && !gameOver) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            $(randomCell).text(computerToken);
            $(randomCell).addClass('o-selected');
    
            checkLine(0, 1, 2);
            checkLine(3, 4, 5);
            checkLine(6, 7, 8);
            checkLine(0, 3, 6);
            checkLine(1, 4, 7);
            checkLine(2, 5, 8);
            checkLine(0, 4, 8);
            checkLine(2, 4, 6);
    
            if (!gameOver) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurn();
                checkDraw(); // Verificar si hay empate después del movimiento de la máquina
            }
        }
    }

    function updateTurn() {
        $('#turno').text("Player " + currentPlayer + "'s turn");
    }

    function checkLine(c1, c2, c3) {
        if (
            $(cells[c1]).text().length &&
            $(cells[c1]).text() === $(cells[c2]).text() &&
            $(cells[c2]).text() === $(cells[c3]).text()
        ) {
            showWinner($(cells[c1]).text());
        }
    }

    function checkDraw() {
        if ($('.cells:empty').length === 0 && !gameOver) {
            showDraw();
        }
    }

    function showWinner(player) {
        if (singleplayer && player === computerToken) {
            $('#ganador').text("Máquina gana!").css('display', 'block').animate({
                left: '50%',
            }, 1000, function() {
                $(this).css('left', '50%');
            });
            goAudio.play(); // Reproducir el sonido de victoria para la máquina
        } else {
            $('#ganador').text(player + " gana!").css('display', 'block').animate({
                left: '50%',
            }, 1000, function() {
                $(this).css('left', '50%');
            });
            winAudio.play(); // Reproducir el sonido de victoria para el jugador humano
        }
        gameOver = true;
    }

    function showDraw() {
        $('#ganador').text("¡Empate!").css('display', 'block').animate({
            left: '50%',
        }, 1000, function() {
            $(this).css('left', '50%');
        });
        gameOver = true;
        drawAudio.play();
    }

    $('#resetButton').on('click', resetGame);

    function resetGame() {
        cells.text('');
        cells.removeClass('x-selected o-selected');
        $('#ganador').css('display', 'none').css('left', '100%');
        currentPlayer = 'X';
        playerToken = 'X';
        computerToken = 'O';
        gameOver = false;
        updateTurn();
    }

    // Mostrar el modal al inicio
    showModal();
});
