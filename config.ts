export const corsConfig = {
  development: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
  production: {
    origin: ['http://localhost:3000', 'https://recoco-fce.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
};
