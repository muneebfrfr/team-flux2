const config = {
  mongodb: {
    url: "mongodb+srv://teamflux_user:teamflux_pass@cluster0.knonexc.mongodb.net/teamflux_db?retryWrites=true&w=majority&appName=Cluster0",
    databaseName: "teamflux_db",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: "migrations", // Directory where migrations will be stored
  changelogCollectionName: "changelog", // Collection to track migrations
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
