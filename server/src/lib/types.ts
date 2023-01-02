import type { Request, Response } from "express";
import type { Session, SessionData } from "express-session";
import type { Redis } from "ioredis";
import type { Repository } from "typeorm";
import type { Message } from "../entities/message.entities";
import type { User } from "../entities/user.entities";

export interface MyContext {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
  userManager: Repository<User>;
  messageManager: Repository<Message>;
}
