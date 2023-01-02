import { join } from "path";
import { DataSource } from "typeorm";
import { Message } from "../entities/message.entities";
import { User } from "../entities/user.entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Message],
  migrations: [join(__dirname, "../migrations/*")],
  migrationsRun: true,
  schema: "public",
});

export const MessageManager = AppDataSource.manager.getRepository(Message);
export const UserManager = AppDataSource.manager.getRepository(User);
