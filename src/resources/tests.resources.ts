/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import constants from '../constants/constants';
import { getTestById, postTest } from '../controllers/test.controllers';
import { createDetailedError } from '../utilities/errors.utilities';
import { DetailedError, Resource } from '../utilities/interfaces.utilities';

/* -------------------------------------------------------------------------- */
/*                              Validation Functions                          */
/* -------------------------------------------------------------------------- */

const postTestValidation = (req: express.Request): DetailedError[] => {
	const errors: DetailedError[] = [];
	if (!req.body.email) {
		errors.push(createDetailedError(400002, 'Missing email field'));
	}
	if (req.body.email && !req.body.email.includes('@')) {
		errors.push(createDetailedError(400003, 'Invalid email field'));
	}
	return errors;
};

/* -------------------------------------------------------------------------- */
/*                                   Ressources                               */
/* -------------------------------------------------------------------------- */

const testResource: Resource = {
	name: 'tests',
	basePath: '/api/v1/tests',
	routes: [
		{
			name: 'getTestById',
			method: constants.GET,
			path: '/:id',
			scopes: [],
			controller: getTestById
		},
		{
			name: 'postTest',
			method: constants.POST,
			path: '',
			scopes: [],
			controller: postTest,
			validation: postTestValidation
		}
	]
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { testResource };
