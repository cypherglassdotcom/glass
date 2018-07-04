import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import ticker from '../lib/ticker';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// perhaps expose some API metadata at the root
	api.get('/ticker', (req, res) => {
		res.json({ tick: ticker.getTick() });
	});

	return api;
}
