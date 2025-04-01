import React from "react";

interface GameBoardProps {
  board: (string | null)[][];
  onMove: (row: number, col: number) => void;
  isGameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, onMove, isGameOver }) => {
  return (
    <div className="flex justify-center">
      <div className="inline-grid relative bg-white border border-gray-300">
        {/* Vẽ lưới dọc */}
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`vertical-${i}`}
            className="absolute bg-gray-300"
            style={{
              left: `${(i * 100) / 15}%`,
              top: 0,
              bottom: 0,
              width: "1px",
            }}
          />
        ))}

        {/* Vẽ lưới ngang */}
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={`horizontal-${i}`}
            className="absolute bg-gray-300"
            style={{
              top: `${(i * 100) / 15}%`,
              left: 0,
              right: 0,
              height: "1px",
            }}
          />
        ))}

        {/* Các ô cờ */}
        <div className="grid grid-cols-15 relative">
          {board.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => onMove(rowIndex, colIndex)}
                  disabled={isGameOver || cell !== null}
                  className={`
                    w-8 h-8 flex items-center justify-center
                    transition-all duration-200
                    ${
                      !cell && !isGameOver
                        ? "hover:bg-blue-100 hover:shadow-inner hover:scale-105 hover:z-10 cursor-pointer"
                        : "cursor-default"
                    }
                    relative
                  `}
                >
                  {cell && (
                    <span
                      className={`
                      text-2xl font-bold
                      ${cell === "X" ? "text-red-500" : "text-black"}
                    `}
                    >
                      {cell === "X" ? "X" : "O"}
                    </span>
                  )}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
