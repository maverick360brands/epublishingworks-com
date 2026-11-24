import * as migration_20261124_101501_initial from './20261124_101501_initial';
import * as migration_20261124_110000_import_content from './20261124_110000_import_content';

export const migrations = [
  {
    up: migration_20261124_101501_initial.up,
    down: migration_20261124_101501_initial.down,
    name: '20261124_101501_initial',
  },
  {
    up: migration_20261124_110000_import_content.up,
    down: migration_20261124_110000_import_content.down,
    name: '20261124_110000_import_content',
  },
];
