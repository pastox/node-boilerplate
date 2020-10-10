/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { Response, DetailedError } from '../utilities/interfaces.utilities';
import { sendResponse, createErrorResponse } from '../utilities/routers.utilities';
import { createDetailedError } from '../utilities/errors.utilities';

/* -------------------------------------------------------------------------- */
/*                                Middlewares                                 */
/* -------------------------------------------------------------------------- */

/**
 * Middleware which checks the scope of the user
 * @param {string[]} scopes the scopes of the route
 * @returns Middleware that sends forbidden error if the scope is the request's scope is not in the route's scope
 */
const scopeMiddleware = (scopes: string[]) => {
	return function (req: express.Request, res: express.Response, next: express.NextFunction): void {
		if (scopes.length === 0 || (req.scope && (scopes.includes(req.scope) || req.scope === 'super'))) {
			return next();
		}
		const errors: DetailedError[] = [
			createDetailedError(403001, req.scope ? `Scope ${req.scope} is not authorized for route ${req.url}` : 'Request not populated with scope')
		];
		const response: Response = createErrorResponse(req, 403, errors);
		sendResponse(response, res);
	};
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { scopeMiddleware };
