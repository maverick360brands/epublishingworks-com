import * as migration_20261124_101501_initial from './20261124_101501_initial';
import * as migration_20261124_110000_import_content from './20261124_110000_import_content';
import * as migration_20261124_120000_catalog_fixes from './20261124_120000_catalog_fixes';

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
  {
    up: migration_20261124_120000_catalog_fixes.up,
    down: migration_20261124_120000_catalog_fixes.down,
    name: '20261124_120000_catalog_fixes',
  },
];
