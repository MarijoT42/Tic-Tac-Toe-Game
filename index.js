$(document).ready(function() {
    let currentPlayer = 'X';
    let playerToken = 'X';
    let computerToken = 'O';
    let cells = $('.cells');
    let gameOver = false;
    let singleplayer = false;
    let winAudio = new Audio('./sounds/win.wav');
    let goAudio = new Audio('./sounds/go.wav');
    let drawAudio = new Audio('./s+ounds/draw.wav');

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
                checkLines();

                if (!gameOver) {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                    updateTurn();
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
        if (!gameOver) {
            // Bloquear al jugador
            let moveMade = tryToBlockOrWin(playerToken);

            // Intentar ganar si no se bloqueó
            if (!moveMade) {
                moveMade = tryToBlockOrWin(computerToken);
            }

            // Si no se pudo bloquear ni ganar, hacer una jugada estratégica
            if (!moveMade) {
                moveMade = tryStrategicMove();
            }

            // Si no se hizo ninguna jugada estratégica, hacer una jugada aleatoria
            if (!moveMade) {
                let emptyCells = cells.filter(function() {
                    return $(this).text() === '';
                });
                if (emptyCells.length > 0 && !gameOver) {
                    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    $(randomCell).text(computerToken);
                    $(randomCell).addClass('o-selected');
                }
            }

            checkLines();

            if (!gameOver) {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                updateTurn();
                checkDraw();
            }
        }
    }

    function tryToBlockOrWin(token) {
        let moveMade = false;
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let line of lines) {
            const [c1, c2, c3] = line;
            if ($(cells[c1]).text() === token && $(cells[c2]).text() === token && $(cells[c3]).text() === '') {
                $(cells[c3]).text(computerToken);
                $(cells[c3]).addClass('o-selected');
                moveMade = true;
                break;
            } else if ($(cells[c1]).text() === token && $(cells[c3]).text() === token && $(cells[c2]).text() === '') {
                $(cells[c2]).text(computerToken);
                $(cells[c2]).addClass('o-selected');
                moveMade = true;
                break;
            } else if ($(cells[c2]).text() === token && $(cells[c3]).text() === token && $(cells[c1]).text() === '') {
                $(cells[c1]).text(computerToken);
                $(cells[c1]).addClass('o-selected');
                moveMade = true;
                break;
            }
        }
        return moveMade;
    }

    function tryStrategicMove() {
        const strategicMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // Center, corners, then sides
        let moveMade = false;
        for (let index of strategicMoves) {
            if ($(cells[index]).text() === '') {
                $(cells[index]).text(computerToken);
                $(cells[index]).addClass('o-selected');
                moveMade = true;
                break;
            }
        }
        return moveMade;
    }

    function updateTurn() {
        $('#turno').text("Player " + currentPlayer + "'s turn");
    }

    function checkLines() {
        checkLine(0, 1, 2);
        checkLine(3, 4, 5);
        checkLine(6, 7, 8);
        checkLine(0, 3, 6);
        checkLine(1, 4, 7);
        checkLine(2, 5, 8);
        checkLine(0, 4, 8);
        checkLine(2, 4, 6);
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
            goAudio.play();
        } else {
            $('#ganador').text(player + " gana!").css('display', 'block').animate({
                left: '50%',
            }, 1000, function() {
                $(this).css('left', '50%');
            });
            winAudio.play();
        }
        gameOver = true;
    }

    function showDraw() {
        $('#ganador').text("¡Empate!").css('display', 'block').animate({
            left: '50%',
        }, 1000, function() {
            $(this).css('left', '50%');
        });
        drawAudio.play();
        gameOver = true;
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
