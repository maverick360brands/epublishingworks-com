import * as migration_20261124_094753_initial from './20261124_094753_initial';
import * as migration_20261124_100000_import_content from './20261124_100000_import_content';

export const migrations = [
  {
    up: migration_20261124_094753_initial.up,
    down: migration_20261124_094753_initial.down,
    name: '20261124_094753_initial',
  },
  {
    up: migration_20261124_100000_import_content.up,
    down: migration_20261124_100000_import_content.down,
    name: '20261124_100000_import_content',
  },
];
