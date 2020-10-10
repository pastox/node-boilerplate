/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface ControllerResponse {
	success: boolean;
	status: number;
	errors: DetailedError[] | null;
	data: SuccessResponse | null;
}

interface DetailedError {
	code: number;
	message: string;
	description: string;
}

interface Debug {
	request_url: string; // Relative API url
	request_id: string; // Request Id used in logging
}

interface ErrorResponse {
	title: string;
	error_image?: string; // Url for error image
	errors: DetailedError[];
	debug: Debug;
}

type SuccessResponse = unknown;

interface ResponseBody {
	success: boolean;
	result: ErrorResponse | SuccessResponse;
}

interface Response {
	status: number;
	body: ResponseBody;
}

interface Route {
	name: string;
	method: string;
	path: string;
	scopes: string[];
	controller: (req: express.Request) => ControllerResponse;
	validation?: (req: express.Request) => DetailedError[];
}

interface Resource {
	name: string;
	basePath: string;
	routes: Route[];
}

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { Response, ControllerResponse, DetailedError, Debug, ErrorResponse, SuccessResponse, ResponseBody, Route, Resource };
