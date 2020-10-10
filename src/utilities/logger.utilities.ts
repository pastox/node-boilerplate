/* eslint-disable no-console */

/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

import express from 'express';
import morgan from 'morgan';
import addRequestId from 'express-request-id';

/* -------------------------------------------------------------------------- */
/*                                  Imports                                   */
/* -------------------------------------------------------------------------- */

import constants from '../constants/constants';

/* -------------------------------------------------------------------------- */
/*                                 Constants                                  */
/* -------------------------------------------------------------------------- */

const defaultLogLevel = process.env.NODE_ENV == constants.PRODUCTION ? 6 : 7;
const defaultWarnLevel = 4;
const defaultErrorLevel = 3;

const lookupLevel = ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG'];

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface LogEntry {
	time: string;
	level: string;
	source: string;
	message: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Functions                                  */
/* -------------------------------------------------------------------------- */

/**
 *
 * @param src string - The source file
 * @param msg string - The message to log
 * @param level number - The level of urgency, from 0 to 7: ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG']
 * @description Returns the object to log
 */
const common = (src: string, msg: string, level: number): LogEntry => {
	if (!msg) throw 'Missing message';
	const entry = {
		time: new Date().toISOString(),
		level: lookupLevel[level],
		source: src,
		message: msg
	};
	return entry;
};

/**
 *
 * @param src string - The source file
 * @param msg string - The message to log
 * @param level number (optional) - The level of urgency, from 0 to 7: ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG']
 * @description Performs a log or redirects to warn or error if the level is not in the log range (5 - 7)
 */
const log = (src: string, msg: string, level?: number): void => {
	if (!level) level = defaultLogLevel;
	if (level == 4) {
		warn(src, msg, level);
		return;
	}
	if (level < 4) {
		error(src, msg, level);
		return;
	}
	console.log(JSON.stringify(common(src, msg, level)));
};

/**
 *
 * @param src string - The source file
 * @param msg string - The message to log
 * @param level number (optional) - The level of urgency, from 0 to 7: ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG']
 * @description Performs a warn log or redirects to log or error if the level is not in the warn range (4 - 4)
 */
const warn = (src: string, msg: string, level?: number): void => {
	if (!level) level = defaultWarnLevel;
	if (level > 4) {
		log(src, msg, level);
		return;
	}
	console.warn(JSON.stringify(common(src, msg, level)));
};

/**
 *
 * @param src string - The source file
 * @param msg string - The message to log
 * @param level number (optional) - The level of urgency, from 0 to 7: ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING', 'NOTICE', 'INFO', 'DEBUG']
 * @description Performs an error log or redirects to log or warn if the level is not in the warn range (0 - 3)
 */
const error = (src: string, msg: string, level?: number): void => {
	if (!level) level = defaultErrorLevel;
	if (level == 4) {
		warn(src, msg, level);
		return;
	}
	if (level > 4) {
		log(src, msg, level);
		return;
	}
	console.error(JSON.stringify(common(src, msg, level)));
};

const initHttpLogger = (app: express.Application): void => {
	app.use(addRequestId());
	morgan.token('id', (req: express.Request) => {
		return req.id ? req.id : '';
	});
	const loggerFormat = '[:method] :id :date :url :status :res[content-length] - :response-time ms';
	app.use(
		morgan(loggerFormat, {
			skip: (req: express.Request, res: express.Response) => {
				return res.statusCode < 400;
			},
			stream: process.stderr
		})
	);
	app.use(
		morgan(loggerFormat, {
			skip: (req: express.Request, res: express.Response) => {
				return res.statusCode >= 400;
			},
			stream: process.stdout
		})
	);
};

export default { log, warn, error, initHttpLogger };
