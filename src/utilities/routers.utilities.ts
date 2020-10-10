/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';
import http from 'http';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import constants from '../constants/constants';
import { ErrorResponse, DetailedError, Response, ResponseBody } from './interfaces.utilities';

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 *
 * @param {express.Request} req The request
 * @param {number} status The response status to send
 * @param {DetailedError[]} errors The errors to send
 */
const createErrorResponse = (req: express.Request, status: number, errors: DetailedError[]): Response => {
	const title = http.STATUS_CODES[status.toString()];
	const errorResponse: ErrorResponse = {
		title: title ? title : constants.ERROR,
		errors,
		debug: {
			request_url: req.originalUrl,
			request_id: req.id ? req.id : ''
		}
	};
	const responseBody: ResponseBody = {
		success: false,
		result: errorResponse
	};
	const response: Response = {
		status,
		body: responseBody
	};
	return response;
};

/**
 *
 * @param {Response} response the response to send
 * @param {express.Response} res the express respond
 * @description Util function that takes a Response object and sends the http response
 */
const sendResponse = (response: Response, res: express.Response): void => {
	res.status(response.status).json(response.body);
};

export { createErrorResponse, sendResponse };
