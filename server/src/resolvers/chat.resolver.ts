import {
  Arg,
  Ctx,
  Mutation,
  PubSub,
  PubSubEngine,
  Query,
  Resolver,
  Subscription,
  UseMiddleware,
} from "type-graphql";
import { MessageManager } from "../lib/datasource";
import type { MyContext } from "../lib/types";
import { Message, PaginatedMessages } from "../lib/typegraphql";
import type { User } from "../entities/user.entities";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class ChatResolver {
  @UseMiddleware(isAuth)
  @Query(() => PaginatedMessages)
  async fetchMessages(
    @Arg("cursor", { nullable: true }) cursor: number
  ): Promise<PaginatedMessages> {
    const messageId = cursor;

    type MessageData = Message & { user: User };

    const data: MessageData[] = await MessageManager.query(
      `
      select m.*, json_build_object(
        'id', u.id,
        'name', u.name,
        'email', u.email,
        'createdAt', u."createdAt"
      ) as user
      from messages m
      inner join users u on u.id = m."userId"
      ${messageId ? `where m.id < ${messageId}` : ""}
      order by m."createdAt" DESC
      limit 20
      `
    );

    return {
      messages: data.reverse().map((msg) => ({
        id: msg.id,
        text: msg.text,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        username: msg.user.name,
        avatar: `https://avatars.dicebear.com/api/identicon/${msg.user.name}.svg`,
      })),
      hasMore: !!data.length,
    };
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async sendMessage(
    @Arg("message") message: string,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { messageManager, req }: MyContext
  ) {
    const data = messageManager.create({
      text: message,
      userId: req.session.userId,
    });
    await messageManager.save(data);

    await pubSub.publish("NEW_MESSAGE", data);

    return true;
  }

  @UseMiddleware(isAuth)
  @Subscription(() => Message, {
    topics: "NEW_MESSAGE",
    name: "message",
  })
  async newMessage(): Promise<Message> {
    const msgs = await MessageManager.find({
      order: {
        createdAt: "DESC",
      },
      take: 1,
      relations: ["user"],
    });

    const msg = msgs[0];

    return {
      id: msg.id,
      text: msg.text,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
      username: msg.user.name,
      avatar: `https://avatars.dicebear.com/api/identicon/${msg.user.name}.svg`,
    };
  }
}
