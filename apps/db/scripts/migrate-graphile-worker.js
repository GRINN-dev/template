const { makeWorkerUtils } = require("graphile-worker");
async function main() {
  console.log("Starting migration...", process.env.GM_DBURL);
  const workerUtils = await makeWorkerUtils({
    connectionString: process.env.GM_DBURL,
  });
  await workerUtils
    .migrate()
    .catch((error) => console.log(error))
    .finally(async () => await workerUtils.release());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
