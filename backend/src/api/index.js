import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import bpTicker from '../lib/bpTicker';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	// perhaps expose some API metadata at the root
	api.get('/bps', (req, res) => {
		res.json({ bps: bpTicker.getBps() });
	});

	return api;
}
