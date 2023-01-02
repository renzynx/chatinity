import { join } from "path";
import { DataSource } from "typeorm";
import { Message } from "../entities/message.entities";
import { User } from "../entities/user.entities";
import { rootDir } from "./constant";

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [User, Message],
  migrations: [`${join(rootDir, "migrations")}/*.ts`],
  subscribers: [],
});

export default AppDataSource;

export const UserManager = AppDataSource.manager.getRepository(User);
export const MessageManager = AppDataSource.manager.getRepository(Message);
