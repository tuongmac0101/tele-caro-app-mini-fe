import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT", 4000);

  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  });

  // Serve static files from frontend build
  app.useStaticAssets(join(__dirname, "../../frontend/dist"), {
    index: false,
    prefix: "/",
  });

  // Serve index.html for all routes except /api and /socket.io
  app.use((req, res, next) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/socket.io")) {
      res.sendFile(join(__dirname, "../../frontend/dist/index.html"));
    } else {
      next();
    }
  });

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
