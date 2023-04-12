// PLAYER FACTORY
const Player = (symbol) => {
	this.symbol = symbol;

	const getSymbol = () => {
		return symbol;
	};

	return { getSymbol };
};

// GAMEBOARD MODULE
const gameBoard = (() => {
	const board = ["", "", "", "", "", "", "", "", ""];

	const setBlock = (index, symbol) => {
		if (index > board.length) return;

		board[index] = symbol;
	};

	const getBlock = (index) => {
		if (index > board.length) return;

		return board[index];
	};

	const restart = () => {
		for (let i = 0; i < board.length; i++) {
			board[i] = "";
		}
	};

	return { setBlock, getBlock, restart };
})();

// DISPLAY CONTROLLER MODULE
const displayController = (() => {
	const blocks = document.querySelectorAll(".block");
	const messageDisplay = document.querySelector("#message-display");
	const restartBtn = document.querySelector("#restart");

	blocks.forEach((block) => {
		block.addEventListener("click", (e) => {
			if (gameController.isGameOver() || e.target.textContent !== "") return;

			gameController.playTurn(parseInt(e.target.dataset.index));

			updateBoard();
		});
	});

	restartBtn.addEventListener("click", (e) => {
		gameBoard.restart();
		gameController.restart();
		updateBoard();
		setMessage("Player 1's Turn { X }");
	});

	const updateBoard = () => {
		for (let i = 0; i < blocks.length; i++) {
			blocks[i].textContent = gameBoard.getBlock(i);
		}
	};

	const showResult = (winner) => {
		if (winner === "Tie") {
			setMessage(`It's a Tie!`);
		} else {
			setMessage(`${winner} Wins!`);
		}
	};

	const setMessage = (message) => {
		messageDisplay.textContent = message;
	};

	return { showResult, setMessage };
})();

// GAME CONTROLLER MODULE
const gameController = (() => {
	const player1 = Player("X");
	const player2 = Player("O");
	let gameOver = false;
	let turn = 1;

	const playTurn = (blockIndex) => {
		gameBoard.setBlock(blockIndex, getCurrentPlayer());

		if (checkWin(blockIndex)) {
			displayController.showResult(getCurrentPlayer());
			gameOver = true;
			return;
		}

		if (turn === 9) {
			displayController.showResult("Tie");
			gameOver = true;
			return;
		}

		turn++;

		displayController.setMessage(`Player ${getCurrentPlayer()}'s Turn`);
	};

	const getCurrentPlayer = () => {
		return turn % 2 === 1 ? player1.getSymbol() : player2.getSymbol();
	};

	const checkWin = (blockIndex) => {
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];

		return winConditions
			.filter((combo) => combo.includes(blockIndex))
			.some((possibleCombo) =>
				possibleCombo.every(
					(index) => gameBoard.getBlock(index) === getCurrentPlayer()
				)
			);
	};

	const isGameOver = () => {
		return gameOver;
	};

	const restart = () => {
		turn = 1;
		gameOver = false;
	};

	return { playTurn, isGameOver, restart };
})();
