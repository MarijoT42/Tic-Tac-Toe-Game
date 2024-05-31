$(document).ready(function() {
    let currentPlayer = 'X';
    let cells = $('.cells');
    let gameOver = false; // Variable para rastrear si el juego ha terminado

    cells.on('click', userMove);
    updateTurn();

    function userMove(e) {
        // Verificar si el juego ha terminado antes de permitir un movimiento
        if (!gameOver) {
            let cellValue = $(e.target).text();
            if (!cellValue.length) {
                $(e.target).text(currentPlayer);
                $(e.target).addClass(currentPlayer === 'X' ? 'x-selected' : 'o-selected');
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

                checkLine(0, 1, 2);
                checkLine(3, 4, 5);
                checkLine(6, 7, 8);
                checkLine(0, 3, 6);
                checkLine(1, 4, 7);
                checkLine(2, 5, 8);
                checkLine(0, 4, 8);
                checkLine(2, 4, 6);

                updateTurn();
                checkDraw();
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
        $('#ganador').text(player + " gana!").css('display', 'block').animate({
            left: '50%',
        }, 1000, function() {
            $(this).css('left', '50%');
        });
        gameOver = true; // Establecer el juego como terminado
    }

    function showDraw() {
        $('#ganador').text("¡Empate!").css('display', 'block').animate({
            left: '50%',
        }, 1000, function() {
            $(this).css('left', '50%');
        });
        gameOver = true; // Establecer el juego como terminado
    }

    $('#resetButton').on('click', resetGame);

    // Restablecer el juego
    function resetGame() {
        cells.text(''); // Limpiar el contenido de las celdas
        cells.removeClass('x-selected o-selected'); // Eliminar clases de color
        $('#ganador').css('display', 'none').css('left', '100%'); // Ocultar el mensaje de ganador
        currentPlayer = 'X'; // Restablecer el jugador actual a 'X'
        gameOver = false; // Restablecer el juego como no terminado
        updateTurn(); // Actualizar el turno del jugador
    }
});

