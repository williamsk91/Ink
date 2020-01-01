const typeOrmDir = process.env.NODE_ENV === "production" ? "dist" : "src";

const baseConfig = {
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: [`${typeOrmDir}/entity/**/*`],
  migrations: [`${typeOrmDir}/migration/**/*`],
  subscribers: [`${typeOrmDir}/subscriber/**/*`],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber"
  }
};

const localConfig = {
  ...baseConfig,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "ink-db"
};

const prodConfig = process.env.DATABASE_URL && {
  ...baseConfig,
  url: process.env.DATABASE_URL,
  extra: {
    ssl: true
  }
};

module.exports = process.env.DATABASE_URL ? prodConfig : localConfig;
