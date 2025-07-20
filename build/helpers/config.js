/**
 * @file Provides simple user configuration options.
 */

import loconfig from '../../config.json' with { type: 'json' };
import { merge } from '../utils/index.js';

let usrconfig;

try {
  usrconfig = await import('../../config.local.json', {
    with: { type: 'json' }
  });
  usrconfig = usrconfig.default;

  merge(loconfig, usrconfig);
} catch (err) {
  // do nothing
}

export default loconfig;

export { loconfig };
