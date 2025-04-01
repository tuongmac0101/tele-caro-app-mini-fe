import { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";
import { io } from "socket.io-client";
import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import "./App.css";

const socket = io("http://localhost:4000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  autoConnect: true,
});

function App() {
  const [gameState, setGameState] = useState({
    board: Array(15).fill(Array(15).fill(null)),
    currentPlayer: "X",
    winner: null,
    isGameOver: false,
  });

  useEffect(() => {
    // Khởi tạo Telegram WebApp
    WebApp.ready();
    WebApp.expand();

    // Kết nối socket
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // Lắng nghe các sự kiện game
    socket.on("gameState", (newState) => {
      setGameState(newState);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMove = (row: number, col: number) => {
    if (gameState.isGameOver) return;
    console.log("move", row, col);
    socket.emit("move", { row, col });
  };

  const handleNewGame = () => {
    socket.emit("newGame");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Game Caro</h1>
        <GameStatus
          currentPlayer={gameState.currentPlayer}
          winner={gameState.winner}
          isGameOver={gameState.isGameOver}
        />
        <GameBoard
          board={gameState.board}
          onMove={handleMove}
          isGameOver={gameState.isGameOver}
        />
        <button
          onClick={handleNewGame}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Chơi mới
        </button>
      </div>
    </div>
  );
}

export default App;
