const gameCells = document.querySelectorAll(".gamecell");
const resetButton = document.querySelector("main button");

const namesDialog = document.querySelector(".names-dialog");
const namesDialogButton = namesDialog.querySelector("button");

const r1c1I = document.querySelector('.gamecell[data-position="0"]');
const r1c2I = document.querySelector('.gamecell[data-position="1"]');
const r1c3I = document.querySelector('.gamecell[data-position="2"]');

const r2c1I = document.querySelector('.gamecell[data-position="3"]');
const r2c2I = document.querySelector('.gamecell[data-position="4"]');
const r2c3I = document.querySelector('.gamecell[data-position="5"]');

const r3c1I = document.querySelector('.gamecell[data-position="6"]');
const r3c2I = document.querySelector('.gamecell[data-position="7"]');
const r3c3I = document.querySelector('.gamecell[data-position="8"]');

let isGameInitialized = false;
let gameEnded = false;
let currentPlayer = null;

const Player = (name, symbol) => {
  const getSymbol = () => symbol;
  const getName = () => name;
  return { getSymbol, getName };
};

//Inicialization of Players
namesDialog.showModal();
namesDialogButton.addEventListener("click", (event) => {
  const form = namesDialog.querySelector("form");
  const player1Name = form.querySelector("#name1");
  const player2Name = form.querySelector("#name2");
  if (form.checkValidity()) {
    event.preventDefault(); // Don't want to submit this form
    const player1 = Player(player1Name.value, "X");
    const player2 = Player(player2Name.value, "O");
    namesDialog.close();
    gameInitialization(player1, player2);
  }
});

//Game Initialization after player names being chosen
function gameInitialization(player1, player2) {
  const gameBoard = (() => {
    let gameBoardArray = [null, null, null, null, null, null, null, null, null];

    const addToArray = (symbol, position) => {
      gameBoardArray[position] = symbol;
    };

    const clearArray = () => {
      gameBoardArray = [null, null, null, null, null, null, null, null, null];
    };

    const getGameBoardRows = () => {
      const copyGameArray = [...gameBoardArray];
      const res = [];
      for (let i = 0; i < gameBoardArray.length / 3; i++) {
        res.push(copyGameArray.splice(0, 3));
      }
      return res;
    };

    const getGameBoardColumns = () => {
      const copyGameArray = [...gameBoardArray];
      const res = [[], [], []];
      for (let i = 0; i < gameBoardArray.length; i++) {
        if (i % 3 === 0) {
          res[0].push(copyGameArray[i]);
        } else if (i % 3 === 1) {
          res[1].push(copyGameArray[i]);
        } else {
          res[2].push(copyGameArray[i]);
        }
      }
      return res;
    };

    const getGameBoardDiagonals = () => {
      const copyGameArray = [...gameBoardArray];
      const diagonal1 = [copyGameArray[0], copyGameArray[4], copyGameArray[8]];
      const diagonal2 = [copyGameArray[2], copyGameArray[4], copyGameArray[6]];
      return [diagonal1, diagonal2];
    };

    const areItemsOfArrayEqual = (arr) => {
      const res = {
        areItemsEqual: null,
        winnerSymbol: "",
      };
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] !== arr[i + 1] || arr[i] === null) {
          res.areItemsEqual = false;
          return res;
        }
      }
      res.areItemsEqual = true;
      res.winnerSymbol = arr[0];
      return res;
    };

    const checkWinner = () => {
      const gameRows = getGameBoardRows();
      const gameColumns = getGameBoardColumns();
      const gameDiagonals = getGameBoardDiagonals();
      const gameCombinations = [...gameRows, ...gameColumns, ...gameDiagonals];

      const result = {
        hasSomeoneWon: false,
        tie: false,
        winnerSymbol: "",
      };

      //Checks if there is a winner
      for (let i = 0; i < gameCombinations.length; i++) {
        const localRes = areItemsOfArrayEqual(gameCombinations[i]);
        if (localRes.areItemsEqual) {
          result.hasSomeoneWon = true;
          result.winnerSymbol = localRes.winnerSymbol;
          return result;
        }
      }

      //Checks tie
      if (!gameBoardArray.includes(null)) {
        result.tie = true;
        return result;
      }

      return result;
    };

    return { addToArray, clearArray, checkWinner };
  })();

  const displayController = (() => {
    const playerTurnTitle = document.querySelector("main p");
    const winnerDialog = document.querySelector(".result-dialog");
    const winnerDialogMessage = winnerDialog.querySelector("h1");

    // Close dialog when click outside form
    winnerDialog.addEventListener("click", (event) => {
      if (event.target === winnerDialog) {
        winnerDialog.close();
      }
    });

    const addPlayerSymbol = (target, symbol) => {
      target.textContent = symbol;
    };

    const changePlayerTurnTitle = (message) => {
      playerTurnTitle.textContent = message;
    };

    const showResultDialog = (message) => {
      winnerDialogMessage.textContent = message;
      winnerDialog.showModal();
    };

    const cleanGameboard = () => {
      gameCells.forEach((cell) => {
        cell.textContent = "";
      });
    };

    return {
      addPlayerSymbol,
      changePlayerTurnTitle,
      showResultDialog,
      cleanGameboard,
    };
  })();

  const game = ((firstPlayer, secondPlayer) => {
    currentPlayer = firstPlayer;
    gameEnded = false;

    //Initialization of PlayerTurnTitle
    displayController.changePlayerTurnTitle(
      `${currentPlayer.getName()}'s Turn`
    );

    const makePlayerMove = (cell, player) => {
      if (cell.textContent !== "") return true;

      displayController.addPlayerSymbol(cell, player.getSymbol());
      gameBoard.addToArray(player.getSymbol(), cell.dataset.position);
      return false;
    };

    const parseSymbolToPlayer = (symbol, player1, player2) => {
      switch (symbol) {
        case player1.getSymbol():
          return player1;

        case player2.getSymbol():
          return player2;

        default:
          throw new Error("Invalid symbol provided");
      }
    };

    const processGameResult = (player1, player2) => {
      const res = { gameEnded: false };

      const winnerObj = gameBoard.checkWinner();
      if (winnerObj.hasSomeoneWon) {
        const winnerPlayer = parseSymbolToPlayer(
          winnerObj.winnerSymbol,
          player1,
          player2
        );
        const message = `${winnerPlayer.getName()} Wins!`;
        displayController.showResultDialog(message);
        res.gameEnded = true;
      } else if (winnerObj.tie) {
        const message = `It's a Tie`;
        displayController.showResultDialog(message);
        res.gameEnded = true;
      }

      return res;
    };

    const changePlayerTurn = () => {
      currentPlayer =
        currentPlayer === firstPlayer ? secondPlayer : firstPlayer;
      const message = gameEnded
        ? "Game End"
        : `${currentPlayer.getName()}'s Turn`;
      displayController.changePlayerTurnTitle(message);
    };

    const doPlayerTurn = function (e) {
      if (gameEnded) return;

      const isCellTaken = makePlayerMove(e.target, currentPlayer);
      if (isCellTaken) return;

      const result = processGameResult(firstPlayer, secondPlayer);
      gameEnded = result.gameEnded;
      changePlayerTurn();
    };

    const cleanGame = function () {
      displayController.cleanGameboard();
      gameBoard.clearArray();
      displayController.changePlayerTurnTitle(
        `${currentPlayer.getName()}'s Turn`
      );
      gameEnded = false;
    };

    return {
      doPlayerTurn,
      cleanGame,
    };
  })(player1, player2);

  resetButton.addEventListener("click", game.cleanGame);

  gameCells.forEach((cell) => {
    cell.addEventListener("click", game.doPlayerTurn);
  });
  isGameInitialized = true;
}

let boardView = "";

const getBoardView = () => {
  const r1c1 = document.querySelector(
    '.gamecell[data-position="0"]'
  ).textContent;
  const r1c2 = document.querySelector(
    '.gamecell[data-position="1"]'
  ).textContent;
  const r1c3 = document.querySelector(
    '.gamecell[data-position="2"]'
  ).textContent;

  const r2c1 = document.querySelector(
    '.gamecell[data-position="3"]'
  ).textContent;
  const r2c2 = document.querySelector(
    '.gamecell[data-position="4"]'
  ).textContent;
  const r2c3 = document.querySelector(
    '.gamecell[data-position="5"]'
  ).textContent;

  const r3c1 = document.querySelector(
    '.gamecell[data-position="6"]'
  ).textContent;
  const r3c2 = document.querySelector(
    '.gamecell[data-position="7"]'
  ).textContent;
  const r3c3 = document.querySelector(
    '.gamecell[data-position="8"]'
  ).textContent;

  boardView = `
        -------------------------------
        | ${r1c1} | ${r1c2} | ${r1c3} |
        -------------------------------
        | ${r2c1} | ${r2c2} | ${r2c3} |
        -------------------------------
        | ${r3c1} | ${r3c2} | ${r3c3} |
        -------------------------------
    `;
};

async function simulateMove() {
  if (isGameInitialized && !gameEnded) {
    // Pick a random cell index between 0–8
    // const randomNumber = Math.floor(Math.random() * 9);

    getBoardView();

    const randomNumber = await groqAI(
      boardView,
      currentPlayer.getSymbol(),
      currentPlayer.getName()
    );
    console.log(randomNumber, " - > ", typeof randomNumber);

    switch (randomNumber) {
      case 0:
        r1c1I.style.backgroundColor = "grey";
        setTimeout(() => {
          r1c1I.click();
          r1c1I.style.backgroundColor = "black";
        }, 500);
        break;
      case 1:
        r1c2I.style.backgroundColor = "grey";
        setTimeout(() => {
          r1c2I.click();
          r1c2I.style.backgroundColor = "black";
        }, 500);
        break;
      case 2:
        r1c3I.style.backgroundColor = "grey";
        setTimeout(() => {
          r1c3I.click();
          r1c3I.style.backgroundColor = "black";
        }, 500);
        break;
      case 3:
        r2c1I.style.backgroundColor = "grey";
        setTimeout(() => {
          r2c1I.click();
          r2c1I.style.backgroundColor = "black";
        }, 500);
        break;
      case 4:
        r2c2I.style.backgroundColor = "grey";
        setTimeout(() => {
          r2c2I.click();
          r2c2I.style.backgroundColor = "black";
        }, 500);
        break;
      case 5:
        r2c3I.style.backgroundColor = "grey";
        setTimeout(() => {
          r2c3I.click();
          r2c3I.style.backgroundColor = "black";
        }, 500);
        break;
      case 6:
        r3c1I.style.backgroundColor = "grey";
        setTimeout(() => {
          r3c1I.click();
          r3c1I.style.backgroundColor = "black";
        }, 500);
        break;
      case 7:
        r3c2I.style.backgroundColor = "grey";
        setTimeout(() => {
          r3c2I.click();
          r3c2I.style.backgroundColor = "black";
        }, 500);
        break;
      case 8:
        r3c3I.style.backgroundColor = "grey";
        setTimeout(() => {
          r3c3I.click();
          r3c3I.style.backgroundColor = "black";
        }, 500);
        break;
      default:
        break;
    }

    console.log(`Simulated move on cell ${randomNumber}`);

    // Continue simulating moves until game ends
    setTimeout(simulateMove, 1000); // delay 0.8 s between moves
  } else {
    console.log("Game not ready yet, waiting...");
    setTimeout(simulateMove, 500); // retry after 500ms
  }
}

simulateMove();

// Integrating ai models
async function groqAI(boardView, currentPlayer, name) {
  console.log("Player name -> ", name);
  try {
    const response = await fetch(
      // "https://us-central1-adverse-436618.cloudfunctions.net/aiplaystictactoe/makeMove",
      "http://localhost:3000/api/makeMove",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardView, currentPlayer, name }),
      }
    );

    const data = await response.json();
    return data.move;
  } catch (err) {
    console.error("Error calling backend:", err);
  }
}
