/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import http from 'http';
// import https from 'https';
import express from 'express';
import dotenv from 'dotenv';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import constants from './constants/constants';
import { normalizePort, onError } from './utilities/server.utilities';
import logger from './utilities/logger.utilities';
import { Response, DetailedError } from './utilities/interfaces.utilities';
import { initResources } from './resources/index.resources';
import { createErrorResponse, sendResponse } from './utilities/routers.utilities';
import { createDetailedError } from './utilities/errors.utilities';

/* -------------------------------------------------------------------------- */
/*                           Server and Middlewares                           */
/* -------------------------------------------------------------------------- */

dotenv.config();

const app: express.Application = express();
const port: number = normalizePort(process.env.PORT || '6710');
app.set('port', port);
let server: http.Server;
switch (process.env.MODE) {
	case constants.HTTP:
		server = http.createServer(app).listen(port, '0.0.0.0');
		break;
	// case constants.HTTPS:
	// 	// TODO
	// 	break;
	default:
		logger.error(__filename, 'Please provide a correct MODE environment variable', 3);
		process.exit(1);
}
server.on('error', onError);
server.on('listening', () => {
	logger.log(__filename, `Listening on port ${port.toString()}`, 6);
});

app.use(express.json());

// Use request logger middleware
logger.initHttpLogger(app);

// ping route to check if the server is alive
app.get('/ping', (req: express.Request, res: express.Response) => {
	const response: Response = {
		status: 200,
		body: {
			success: true,
			result: 'ok'
		}
	};
	sendResponse(response, res);
});

// Load all the resources
initResources(app);

// catch 404 and forward to error handler
app.use('/*', (req: express.Request, res: express.Response) => {
	const error: DetailedError = createDetailedError(404001, `Route ${req.originalUrl} doesn't exist`);
	const response: Response = createErrorResponse(req, 404, [error]);
	sendResponse(response, res);
});
