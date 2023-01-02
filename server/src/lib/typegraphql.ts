import { Field, InputType, Int, ObjectType } from "type-graphql";
import { User } from "../entities/user.entities";

@ObjectType()
export class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User | null;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@InputType()
export class UserInput {
  @Field()
  name!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class UserLoginInput {
  @Field()
  username_email!: string;

  @Field()
  password!: string;
}

@ObjectType()
export class Message {
  @Field(() => Int)
  id!: number;

  @Field()
  text!: string;

  @Field(() => String)
  createdAt!: Date;

  @Field(() => String)
  updatedAt!: Date;

  @Field()
  username!: string;

  @Field()
  avatar!: string;
}

@ObjectType()
export class PaginatedMessages {
  @Field(() => [Message])
  messages!: Message[];

  @Field()
  hasMore!: boolean;
}
