import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { UserInput, UserLoginInput, UserResponse } from "../lib/typegraphql";
import type { MyContext } from "../lib/types";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../lib/validation";
import argon from "argon2";
import { User } from "../entities/user.entities";
import { COOKIE_NAME } from "../lib/constant";

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "Hello World!";
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("input", { nullable: true }) { name, email, password }: UserInput,
    @Ctx() { userManager, req }: MyContext
  ): Promise<UserResponse> {
    const usernameTest = validateUsername(name);
    const emailTest = validateEmail(email);
    const passwordTest = validatePassword(password);

    if (usernameTest) {
      return {
        errors: [
          {
            field: "name",
            message: usernameTest,
          },
        ],
      };
    } else if (emailTest) {
      return {
        errors: [
          {
            field: "email",
            message: emailTest,
          },
        ],
      };
    } else if (passwordTest) {
      return {
        errors: [
          {
            field: "password",
            message: passwordTest,
          },
        ],
      };
    }

    const hash = await argon.hash(password);

    const user = userManager.create({
      name,
      email,
      password: hash,
    });
    try {
      await userManager.save(user);
    } catch (error) {
      const err = error as any;
      if (err.code === "23505") {
        if (err.detail.includes("email")) {
          return {
            errors: [
              {
                field: "email",
                message: "Email already taken",
              },
            ],
          };
        } else if (err.detail.includes("name")) {
          return {
            errors: [
              {
                field: "name",
                message: "Username already taken",
              },
            ],
          };
        }
      }
    }
    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;

    return {
      // @ts-ignore
      user: userWithoutPassword,
    };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("input", { nullable: true })
    { username_email, password }: UserLoginInput,
    @Ctx() { userManager, req }: MyContext
  ): Promise<UserResponse> {
    if (username_email.length === 0) {
      return {
        errors: [
          {
            field: "username_email",
            message: "Username or email is required",
          },
        ],
      };
    } else if (password.length === 0) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is required",
          },
        ],
      };
    }

    const user = username_email.includes("@")
      ? await userManager.findOne({ where: { email: username_email } })
      : await userManager.findOne({ where: { name: username_email } });

    if (!user) {
      return {
        errors: [
          {
            field: "username_email",
            message: "Username or email does not exist",
          },
        ],
      };
    }

    const valid = await argon.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    const { password: _, ...userWithoutPassword } = user;

    return {
      // @ts-ignore
      user: userWithoutPassword,
    };
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, userManager }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    const user = await userManager.findOne({
      where: { id: req.session.userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
