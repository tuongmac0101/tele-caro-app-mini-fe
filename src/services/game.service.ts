import { Injectable } from '@nestjs/common';

interface GameState {
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
  isGameOver: boolean;
}

@Injectable()
export class GameService {
  private gameState: GameState;

  constructor() {
    this.gameState = this.createNewGame();
  }

  createNewGame(): GameState {
    this.gameState = {
      board: Array(15).fill(null).map(() => Array(15).fill(null)),
      currentPlayer: 'X',
      winner: null,
      isGameOver: false,
    };
    return this.gameState;
  }

  makeMove(row: number, col: number): GameState {
    if (this.gameState.isGameOver || this.gameState.board[row][col] !== null) {
      return this.gameState;
    }

    this.gameState.board[row][col] = this.gameState.currentPlayer;

    if (this.checkWinner(row, col)) {
      this.gameState.winner = this.gameState.currentPlayer;
      this.gameState.isGameOver = true;
      return this.gameState;
    }

    if (this.checkDraw()) {
      this.gameState.isGameOver = true;
      return this.gameState;
    }

    this.gameState.currentPlayer = this.gameState.currentPlayer === 'X' ? 'O' : 'X';
    return this.gameState;
  }

  private checkWinner(row: number, col: number): boolean {
    const directions = [
      [[0, 1], [0, -1]], // horizontal
      [[1, 0], [-1, 0]], // vertical
      [[1, 1], [-1, -1]], // diagonal
      [[1, -1], [-1, 1]], // anti-diagonal
    ];

    const player = this.gameState.board[row][col];

    return directions.some(direction => {
      const count = 1 + // current position
        this.countInDirection(row, col, direction[0][0], direction[0][1], player) +
        this.countInDirection(row, col, direction[1][0], direction[1][1], player);
      return count >= 5;
    });
  }

  private countInDirection(
    row: number,
    col: number,
    deltaRow: number,
    deltaCol: number,
    player: string,
  ): number {
    let count = 0;
    let currentRow = row + deltaRow;
    let currentCol = col + deltaCol;

    while (
      currentRow >= 0 &&
      currentRow < 15 &&
      currentCol >= 0 &&
      currentCol < 15 &&
      this.gameState.board[currentRow][currentCol] === player
    ) {
      count++;
      currentRow += deltaRow;
      currentCol += deltaCol;
    }

    return count;
  }

  private checkDraw(): boolean {
    return this.gameState.board.every(row => row.every(cell => cell !== null));
  }
} 