//

import dotenv from "dotenv";
import {execFileSync} from "node:child_process";
import {readFileSync} from "node:fs";


const VAULT_GROUP = "ZpdicOnlineNova";

export function loadVault(): boolean {
  dotenv.config({path: "./variable.env"});
  const [databasePath, secretPath] = getVaultPaths();
  if (databasePath && secretPath) {
    const password = readFileSync(secretPath, "utf8");
    const names = runVault(["ls", "-q", databasePath, VAULT_GROUP], password).split("\n").map((name) => name.trim()).filter((name) => !!name);
    for (const name of names) {
      if (!name.endsWith("/")) {
        process.env[name] = runVault(["show", "-a", "Password", "-q", databasePath, `${VAULT_GROUP}/${name}`], password);
      }
    }
    console.log(`${names.length} secrets injected: ${names.join(", ")}`);
    return true;
  } else {
    console.warn("Failed to open the database. Skipping secret injection.");
    return false;
  }
}

function getVaultPaths(): [string | null, string | null] {
  const databasePath = process.env["VAULT_DATABASE_PATH"] || null;
  const secretPath = process.env["VAULT_SECRET_PATH"] || null;
  return [databasePath, secretPath];
}

function runVault(args: Array<string>, password: string): string {
  return execFileSync("keepassxc-cli", args, {input: password + "\n", encoding: "utf8"}).trim();
}
