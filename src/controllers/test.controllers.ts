/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import { ControllerResponse } from '../utilities/interfaces.utilities';

/* -------------------------------------------------------------------------- */
/*                                 Controllers                                */
/* -------------------------------------------------------------------------- */

const getTestById = (req: express.Request): ControllerResponse => {
	return {
		success: true,
		status: 200,
		errors: null,
		data: {
			id: req.params.id,
			name: `Test of id ${req.params.id}`
		}
	};
};

const postTest = (req: express.Request): ControllerResponse => {
	return {
		success: true,
		status: 201,
		errors: null,
		data: {
			id: 'er5ergre6',
			email: req.body.email
		}
	};
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { getTestById, postTest };
