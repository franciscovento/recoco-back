export const corsConfig = {
  development: {
    origin: [
      'http://localhost:3000',
      'https://development--recoco.netlify.app',
      'https://recoco.netlify.app',
      'https://recoco.pro',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  production: {
    origin: [
      'https://development--recoco.netlify.app',
      'https://recoco.netlify.app',
      'https://recoco.netlify.app',
      'https://recoco.pro',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
};
