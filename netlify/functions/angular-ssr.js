import { server as app } from '../../dist/iris-front/server/server.mjs';
import serverless from 'serverless-http';

export const handler = serverless(app);
