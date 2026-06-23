const ftp = require("basic-ftp");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync("deploy.json", "utf8"));

async function uploadDir(client, localDir, remoteDir) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;
    if (entry.isDirectory()) {
      try { await client.ensureDir(remotePath); } catch (_) {}
      await uploadDir(client, localPath, remotePath);
      await client.cd(remoteDir);
    } else {
      await client.uploadFrom(localPath, remotePath);
    }
  }
}

(async () => {
  const client = new ftp.Client();
  client.ftp.verbose = false;
  try {
    await client.access({
      host: config.host,
      port: config.port,
      user: config.username,
      password: config.password,
      secure: false,
    });
    console.log("Connected. Uploading to", config.remotePath, "...");
    await client.ensureDir(config.remotePath);
    await uploadDir(client, config.localPath, config.remotePath);
    console.log("Deploy complete.");
  } catch (err) {
    console.error("Deploy failed:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
})();
