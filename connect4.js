/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let gameOver = false;
const playerSelect = document.querySelector('.playerSelector');
const winner = document.querySelector('.winner');
let currPlayer = 1; // active player: 1 or 2
//const board = []; // array of rows, each row is array of cells  (board[y][x])
const reset = document.querySelector('.reset');
reset.addEventListener('click', () => {
	window.location.reload();
});
/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeXArr(num) {
	const newArray2 = [];
	for (let j = 0; j < num; j++) {
		newArray2.push(null);
	}
	return newArray2;
}

function makeBoard(width, height) {
	let newBoard = [];
	for (let i = 0; i < height; i++) {
		let newArr = makeXArr(width);
		newBoard.push(newArr);
	}
	return newBoard;
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const htmlBoard = document.querySelector('#board');
	// create the column top row that will be clicked to drop a piece onto the board
	const top = document.createElement('tr');
	top.setAttribute('id', 'column-top');
	top.addEventListener('click', handleClick);

	for (let x = 0; x < WIDTH; x++) {
		const headCell = document.createElement('td');
		headCell.setAttribute('id', x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	//create each table row and data cells in each row
	for (let y = 0; y < HEIGHT; y++) {
		const row = document.createElement('tr');
		for (let x = 0; x < WIDTH; x++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', `${y}-${x}`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0

	for (let i = board.length - 1; i >= 0; i--) {
		if (!board[i][x]) return i;
	}
	return null;
}
/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell

	const cell = document.getElementById(`${y}-${x}`);

	cell.innerHTML = `<div class= "piece p${currPlayer}"></div>`;
	if (y === 4) cell.firstChild.style.top = '-280px';
	if (y === 3) {
		cell.firstChild.style.top = '-220px';
		cell.firstChild.style.transition = 'all .3s cubic-bezier(.81, .17, .78, 1.15)';
	}
	if (y === 2) {
		cell.firstChild.style.top = '-165px';
		cell.firstChild.style.transition = 'all .25s cubic-bezier(.81, .17, .78, 1.15)';
	}
	if (y === 1) {
		cell.firstChild.style.top = '-110px';
		cell.firstChild.style.transition = 'all .2s cubic-bezier(.81, .17, .78, 1.15)';
	}
	if (y === 0) {
		cell.firstChild.style.top = '-55px';
		cell.firstChild.style.transition = 'all .1s cubic-bezier(.81, .17, .78, 1.15)';
	}

	setTimeout(() => (cell.firstChild.style.top = '0'), 50);
}

/** endGame: announce game end */

function endGame(msg) {
	gameOver = true;
	winner.textContent = `${msg}`;
	currPlayer === 1 ? (winner.style.color = 'white') : (winner.style.color = 'black');
}
/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	if (gameOver) return;
	var x = +evt.target.id;
	// get next spot in column (if none, ignore click)
	var y = findSpotForCol(x);
	if (y === null) return;

	placeInTable(y, x);
	board[y][x] = currPlayer;

	// check for win

	if (checkForWin()) {
		return endGame(`PLAYER ${currPlayer} YOU WIN!!!`);
	}

	//check for tie
	if (checkforTie(board)) {
		return endGame('Tie');
	}

	// switch players

	currPlayer === 1 ? currPlayer++ : currPlayer--;
	winner.textContent = `GO PLAYER ${currPlayer}!`;
	currPlayer === 1 ? (winner.style.color = 'white') : (winner.style.color = 'black');
}

function checkforTie(array) {
	const checkAll = [];
	for (let i = 0; i < array.length; i++) {
		checkAll.push(array[i].every((val) => val));
	}

	return checkAll.every((val) => val);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	//loop over groups of 4 places at a time in the 4 possible winning configurations, then move over by one on the x axis, then check by moving one up the y axis
	for (let y = 0; y < HEIGHT; y++) {
		for (let x = 0; x < WIDTH; x++) {
			let horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			let vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			let diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			let diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
			//if any of the winning combinations is true return true
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

const board = makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
winner.textContent = 'GO PLAYER 1!';
