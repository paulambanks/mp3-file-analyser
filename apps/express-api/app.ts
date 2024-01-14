import express, { Request, NextFunction, Response } from 'express';
import routes from './routes/index.routes.js';

const server = express();
server.use(routes);

server.use((
  error: Error | null,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (error == null) {
    return next();
  }

  response.status(400).send({
    name: error.name,
    message: error.message,
  });
});

export default server;
