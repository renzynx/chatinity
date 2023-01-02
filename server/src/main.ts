import "./lib/setup";
import { blueBright } from "colorette";
import { Logger } from "./lib/logger";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildTypeDefsAndResolvers } from "type-graphql";
import { UserResolver } from "./resolvers/user.resolver";
import express from "express";
import cors from "cors";
import bp from "body-parser";
import { AppDataSource, MessageManager, UserManager } from "./lib/datasource";
import session from "express-session";
import redis from "./lib/redis";
import connectRedis from "connect-redis";
import { COOKIE_NAME } from "./lib/constant";
import type { MyContext } from "./lib/types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ChatResolver } from "./resolvers/chat.resolver";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { serialize } from "./lib/utils";

const bootstrap = async () => {
  const logger = new Logger("Bootstrap");
  const startTime = Date.now();
  const app = express();
  const RedisStore = connectRedis(session);
  const httpServer = createServer(app);
  const { resolvers, typeDefs } = await buildTypeDefsAndResolvers({
    resolvers: [UserResolver, ChatResolver],
    validate: false,
  });
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  await AppDataSource.initialize()
    .then(() => {
      logger.info(
        `🗄️  Database connected ${blueBright(`(${Date.now() - startTime}ms)`)}`
      );
    })
    .catch((error) => {
      logger.error(`🗄️  Database connection failed, ${error.message}`);
    });

  if (process.env.NODE_ENV === "production") {
    await AppDataSource.synchronize(false);
  }

  process.env.USE_PROXY === "true" && app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        // for 2 different domains e.g frontend.vercel.com and backend.railway.app
        sameSite: process.env.CSRF === "false" ? "none" : "lax",
        secure:
          process.env.NODE_ENV === "production" &&
          process.env.USE_HTTPS === "true",
        domain:
          process.env.NODE_ENV === "production"
            ? serialize(process.env.CORS_ORIGIN)
            : undefined,
      },
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
    })
  );

  const wss = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wss);

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          "request.credentials": "include",
        },
      }),
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start().then(() => {
    logger.info(
      `🚀 Apollo Server started ${blueBright(`(${Date.now() - startTime}ms)`)}`
    );
  });

  app.get("/", (_, res) => {
    res.send("Hello World!");
  });

  app.get("/favicon.ico", (_, res) => res.status(204).end());

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      credentials: true,
      origin: process.env.CORS_ORIGIN,
    }),
    bp.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        redis,
        userManager: UserManager,
        messageManager: MessageManager,
      }),
    })
  );

  const port = process.env.PORT ?? 3000;

  httpServer.listen(port, () => {
    logger.info(
      `🚀 Server started on port ${process.env.PORT ?? 3000} ${blueBright(
        `(${Date.now() - startTime}ms)`
      )}`
    );
  });
};

bootstrap();
