// src/redis/redis.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    });

    this.client.on('error', (err) => console.error('Redis error', err));

    await this.client.connect();
    console.log('Redis connected');
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // Métodos públicos para usar desde otros servicios
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { EX: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  async getChatBotHistory(key: string): Promise<ChatCompletionMessageParam[]> {
    const resp = await this.client.lRange(`chat:${key}`, -6, -1);
    return resp.map((item) => JSON.parse(item));
  }

  // chat.service.ts
  async addMessageToChatbotHistory(
    userId: string,
    role: 'user' | 'assistant',
    content: string,
  ) {
    const key = `chat:${userId}`;

    await this.client.rPush(key, JSON.stringify({ role, content }));

    // TTL solo si es nuevo
    const ttl = await this.client.ttl(key);
    if (ttl === -1) {
      await this.client.expire(key, 60 * 15);
    }
  }

  async get(key: string): Promise<any> {
    const resp = await this.client.get(key);
    return resp;
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
