import { Provider } from '@nestjs/common';
import { OpenAI } from 'openai';

export const OpenAIProvider: Provider = {
  provide: 'OPENAI',
  useFactory: () => {
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  },
};
