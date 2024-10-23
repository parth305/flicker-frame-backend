import { Logger } from '@nestjs/common';

import { AppDataSource } from '@/src/config';
import { userSeeder } from '@/src/seeders/user.seed';

async function runSeeder() {
  try {
    const dataSource = await AppDataSource.initialize();
    await userSeeder(dataSource);
    await dataSource.destroy();
  } catch (err) {
    Logger.error(`Something went wrong while seeding data ${err.message}`);
    process.exit(1);
  }
}

runSeeder();
