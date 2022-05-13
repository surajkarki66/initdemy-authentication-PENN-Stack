import queryString from "query-string";
import { PrismaClient } from "@prisma/client";
import { IUser } from "../interfaces/user";

import config from "../configs/config";

const stripe = require("stripe")(config.stripeKey);
const prisma = new PrismaClient();

export const createInstructor = async (userId: string) => {
  try {
    const user = (await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })) as IUser;

    if (!user.stripeAccountId) {
      const account = await stripe.accounts.create({ type: "express" });
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeAccountId: account.id,
        },
      });
    }
    let accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: config.stripeRedirectUrl,
      return_url: config.stripeRedirectUrl,
      type: "account_onboarding",
    });

    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    return `${accountLink.url}?${queryString.stringify(accountLink)}`;
  } catch (error) {
    throw error;
  }
};
