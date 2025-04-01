import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { GameService } from "../services/game.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit("connection", { status: "connected", clientId: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("newGame")
  handleNewGame(client: Socket) {
    const gameState = this.gameService.createNewGame();
    this.server.emit("gameState", gameState);
  }

  @SubscribeMessage("move")
  handleMove(client: Socket, payload: { row: number; col: number }) {
    const gameState = this.gameService.makeMove(payload.row, payload.col);
    this.server.emit("gameState", gameState);
  }
}
