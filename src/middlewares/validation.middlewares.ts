/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { DetailedError, Response } from '../utilities/interfaces.utilities';
import { createErrorResponse, sendResponse } from '../utilities/routers.utilities';

/* -------------------------------------------------------------------------- */
/*                                Middlewares                                 */
/* -------------------------------------------------------------------------- */

const validationMiddleware = (
	validation: ((req: express.Request) => DetailedError[]) | undefined
): ((req: express.Request, res: express.Response, next: express.NextFunction) => void) => {
	const middlewareFunction = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		const errors: DetailedError[] = validation ? validation(req) : [];
		if (errors.length > 0) {
			// Make sure the error codes start with 400
			errors.forEach((err: DetailedError) => {
				if (err.code.toString().slice(0, 3) !== '400') {
					err.code = 400001;
				}
			});
			const response: Response = createErrorResponse(req, 400, errors);
			sendResponse(response, res);
		} else {
			next();
		}
	};
	return middlewareFunction;
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { validationMiddleware };
