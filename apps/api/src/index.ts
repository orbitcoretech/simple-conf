import { buildApp } from './app.js';

async function start(): Promise<void> {
  const app = await buildApp();

  try {
    const port = app.config.PORT;
    await app.listen({ port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
