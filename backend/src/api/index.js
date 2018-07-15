import { version } from '../../package.json';
import { Router } from 'express';
import bps from './bps';

export default ({ config, db }) => {
  let api = Router();

  api.use('/bps', bps({ config, db }));

  api.get('/', (req, res) => {
    res.json({ version });
  });

  return api;
}
