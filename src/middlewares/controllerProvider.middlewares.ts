/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { ControllerResponse, ResponseBody, Response, DetailedError } from '../utilities/interfaces.utilities';
import { createErrorResponse, sendResponse } from '../utilities/routers.utilities';
import { createDetailedError } from '../utilities/errors.utilities';

/* -------------------------------------------------------------------------- */
/*                                Middlewares                                 */
/* -------------------------------------------------------------------------- */

const controllerProviderMiddleware = (
	controller: (req: express.Request) => ControllerResponse
): ((req: express.Request, res: express.Response) => void) => {
	const middlewareFunction = (req: express.Request, res: express.Response): void => {
		let response: Response;
		try {
			const controllerResponse: ControllerResponse = controller(req);
			if (!controllerResponse.success && controllerResponse.errors && controllerResponse.errors[0]) {
				response = createErrorResponse(req, controllerResponse.status, controllerResponse.errors);
			} else if (controllerResponse.success && !controllerResponse.errors) {
				const responseBody: ResponseBody = {
					success: controllerResponse.success,
					result: controllerResponse.data ? controllerResponse.data : {}
				};
				response = {
					status: controllerResponse.status,
					body: responseBody
				};
			} else {
				const errors: DetailedError[] = [
					createDetailedError(500002, 'Either the response has success set to true and errors, or success set to false and no errors')
				];
				response = createErrorResponse(req, 500, errors);
			}
			sendResponse(response, res);
		} catch (err) {
			const errors: DetailedError[] = [createDetailedError(500001, `Following server error occured: ${err.message}`)];
			response = createErrorResponse(req, 500, errors);
			sendResponse(response, res);
		}
	};
	return middlewareFunction;
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { controllerProviderMiddleware };
