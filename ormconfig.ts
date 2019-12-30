const baseConfig = {
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: ["src/entity/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
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
