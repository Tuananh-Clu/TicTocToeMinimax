import { useEffect, useState } from "react";
import { Board } from "./Board";

export const Game = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  let counter = 0;
  const [XIsNext, setXIsNext] = useState(true);
  const handleClick = (index: number) => {
    if (board[index]) return;
    const newBoard = board?.slice();
    newBoard[index] = XIsNext ? "X" : "O";
    setBoard(newBoard);
    setXIsNext(XIsNext);
    setCurrentPlayer(XIsNext ? "O" : "X");
  };
  const checkWinner = (board: (string | null)[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };
  const isBoardFull = (board: (string | null)[]) => {
    return board.every((cell) => cell !== null);
  };
  const minimax = (board: (string | null)[], isMaximizing: boolean,depth:number): number => {
    let score = 0;
    counter++;
    const winner = checkWinner(board);
    if (winner === "O") {
      return 10-depth;
    } else if (winner === "X") {
      return -10+depth;
    }
    if (isBoardFull(board)) {
      return 0;
    }
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";
          score = minimax(board, false,depth+1);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";
          score = minimax(board, true,depth+1);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const findBestMove = (board: (string | null)[]) => {
    let bestScore = -Infinity;
    let move = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";
        let score = minimax(board, false,0);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };
  useEffect(() => {
    const bestMove = findBestMove(board);
    const winner = checkWinner(board);
    if (winner) return;
    if (board[bestMove] !== null) return;
    if (checkWinner(board) || isBoardFull(board)) return;
    if( currentPlayer === "X") return;
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      if (newBoard[bestMove] === null) {
        newBoard[bestMove] = "O";
      }
      setCurrentPlayer("X");
      return newBoard;
    });
    console.log("Best Move: ", bestMove);
    console.log(counter);
  }, [board]);
  useEffect(() => {
    if (checkWinner(board) || isBoardFull(board)) {
        setTimeout(() => {
            setBoard(Array(9).fill(null));
            setCurrentPlayer("X");
            setXIsNext(true);
        }, 2000);
    }
  });
  return (
    <div className="w-full justify-center items-center flex flex-col gap-4  h-screen bg-gradient-to-r from-[#0f172a]  to-[#334155]">
      <h1 className="text-4xl font-bold text-white">Tic Tac Toe</h1>
      <p className="text-lg text-white">Current Player: {currentPlayer==="X"?"Người Chơi":"AI"}</p>
      <Board board={board} handleClick={handleClick} />
      <h1 className="text-2xl font-bold text-white">
        Result:{" "}
        {(
          checkWinner(board)
            ? `${checkWinner(board) === "X" ? "Người Chơi" : "AI"} thắng!`
            : isBoardFull(board)
            ? "Hòa cả hai!"
            : "Chưa có người thắng."
        )}
      </h1>
    </div>
  );
};
