require('dotenv').config();

const fs = require('fs');
const db = require('./database/connection');

const runSchemaFiles = async () => {
  console.log('Starting to build tables...');
  const schemaFiles = fs.readdirSync('./database/schema');
  for (const fn of schemaFiles) {
    const sql = fs.readFileSync(`./database/schema/${fn}`, "utf8");
    console.log(`\t-> Running ${fn}`);
    await db.query(sql);
  }
}

const runSeedFiles = async () => {
  console.log(`-> Loading Seeds ...`);
  const schemaFilenames = fs.readdirSync("./database/seeds");

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./database/seeds/${fn}`, "utf8");
    console.log(`\t-> Running ${fn}`);
    await db.query(sql);
  }
};

const runResetDb = async () => {
  try {

    await runSchemaFiles();
    await runSeedFiles();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    db.end();
  }
}

runResetDb();