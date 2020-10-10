/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { DetailedError } from './interfaces.utilities';

/* -------------------------------------------------------------------------- */
/*                                  Errors Utils                              */
/* -------------------------------------------------------------------------- */

const errorCodes: Map<number, string> = new Map([
	// Bad Request
	[400001, 'Unknown validation error'],
	[400002, 'Missing field in body'],
	[400003, 'Invalid field in body'],
	// Forbidden
	[403001, 'Access Forbidden'],
	// Not Found
	[404001, 'Route not found'],
	// Server Error
	[500001, 'Unknown Server Error'],
	[500001, 'The server response is not consistent']
]);

const createDetailedError = (code: number, description: string): DetailedError => {
	return {
		code,
		message: errorCodes.get(code) ?? '',
		description
	};
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { createDetailedError };
