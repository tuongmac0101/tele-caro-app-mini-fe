import React from "react";

interface GameStatusProps {
  currentPlayer: string;
  winner: string | null;
  isGameOver: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({
  currentPlayer,
  winner,
  isGameOver,
}) => {
  let status = "";

  if (winner) {
    status = `Người chơi ${winner} thắng!`;
  } else if (isGameOver) {
    status = "Hòa!";
  } else {
    status = `Lượt của người chơi ${currentPlayer}`;
  }

  return (
    <div className="text-center mb-4">
      <div className="text-xl font-semibold">{status}</div>
    </div>
  );
};

export default GameStatus;
