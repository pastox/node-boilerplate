/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';

/* -------------------------------------------------------------------------- */
/*                                   Imports                                  */
/* -------------------------------------------------------------------------- */

import constants from '../constants/constants';
import logger from '../utilities/logger.utilities';
import { validationMiddleware } from '../middlewares/validation.middlewares';
import { Resource, Route } from '../utilities/interfaces.utilities';
import { controllerProviderMiddleware } from '../middlewares/controllerProvider.middlewares';
import { scopeMiddleware } from '../middlewares/scope.middlewares';
import { testResource } from './tests.resources';

/* -------------------------------------------------------------------------- */
/*                                 functions                                  */
/* -------------------------------------------------------------------------- */

const resources: Resource[] = [testResource];

/**
 *
 * @param app express.Application - The Express application
 * @description For each resource, sets up all the routes
 */
const initResources = (app: express.Application): void => {
	if (process.env.NODE_ENV === constants.DEVELOPMENT) {
		logger.log(__filename, 'Setting up resources', 6);
	}
	resources.forEach((resource: Resource) => {
		if (process.env.NODE_ENV === constants.DEVELOPMENT) {
			logger.log(__filename, `|___Setting up resource ${resource.name}`, 6);
		}
		const router: express.Router = express.Router();
		resource.routes.forEach((route: Route) => {
			if (process.env.NODE_ENV === constants.DEVELOPMENT) {
				logger.log(__filename, `|_______Setting up route ${route.name}`, 6);
			}
			try {
				switch (route.method) {
					case constants.GET:
						router.get(
							route.path,
							scopeMiddleware(route.scopes),
							validationMiddleware(route.validation),
							controllerProviderMiddleware(route.controller)
						);
						break;
					case constants.POST:
						router.post(
							route.path,
							scopeMiddleware(route.scopes),
							validationMiddleware(route.validation),
							controllerProviderMiddleware(route.controller)
						);
						break;
					case constants.PUT:
						router.put(
							route.path,
							scopeMiddleware(route.scopes),
							validationMiddleware(route.validation),
							controllerProviderMiddleware(route.controller)
						);
						break;
					case constants.DELETE:
						router.delete(
							route.path,
							scopeMiddleware(route.scopes),
							validationMiddleware(route.validation),
							controllerProviderMiddleware(route.controller)
						);
						break;
					default:
						throw new Error('Wrong HTTP method');
				}
			} catch (err) {
				if (err.message === 'Wrong HTTP method') {
					logger.error(__filename, `${route.method}: Wrong HTTP method for route ${route.name} in resource ${resource.name}`, 1);
				}
				process.exit(1);
			}
		});
		app.use(resource.basePath, router);
	});
};

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */

export { initResources };
