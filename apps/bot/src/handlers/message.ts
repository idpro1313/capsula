import { PrismaClient } from '@prisma/client';
import type { Message } from 'grammy';

export async function handleMessage(ctx: Message, prisma: PrismaClient) {
  // Placeholder for any text message handling
  // Could be used for inline name editing, custom commands, etc.
  
  if (ctx.text?.startsWith('/')) {
    return; // Commands are handled separately
  }

  // For now, ignore regular messages
  // Could add pet naming: "назови моего питомца [name]"
}