import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
  process.exit(1); // Exit the application immediately
}

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    const app = await createApp();

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
