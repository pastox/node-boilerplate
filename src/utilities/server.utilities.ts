/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import logger from './logger.utilities';

/* -------------------------------------------------------------------------- */
/*                                   Functions                                */
/* -------------------------------------------------------------------------- */

/**
 * Converts the string environment variable to a port number. Returns 0 if failure
 */
const normalizePort = (val: string): number => {
	try {
		const port: number = parseInt(val, 10);
		if (port && port > 0) {
			return port;
		}
		return 0;
	} catch (err) {
		return 0;
	}
};

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: { syscall: string; code: string; port: number }): void => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(__filename, `Port ${error.port} requires elevated privileges`, 3);
			process.exit(1);
			break;
		case 'EADDRINUSE':
			logger.error(__filename, `Port ${error.port} is already in use`, 3);
			process.exit(1);
			break;
		default:
			logger.error(__filename, error.code, 3);
			break;
	}
};

export { normalizePort, onError };
