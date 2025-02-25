import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js-selfbot-v13";

export const prisma = new PrismaClient();
export const client = new Client();

export const PREFIX = "?>";
