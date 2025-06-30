const version = "0.2"
const fs = require("fs");
const path = require("path");

const COMMENT = `/**\n * Version: ${version}\n * This file is not to be edited.\n*/${"\n".repeat(5)}`;
const ZONES_JSON_PATH = path.join(__dirname, "../src/timezone.json");
const OUTPUT_DIR = path.join(__dirname, "../src/generated");
const zones = JSON.parse(fs.readFileSync(ZONES_JSON_PATH, "utf8"));

const jsEntries = zones
  .map(
    ({ zone, gmt, name }) =>
      `"${zone}": { zone: "${zone}", gmt: "${gmt}", name: "${name}" }`
  )
  .join(",\n  ");

const jsContent = `${COMMENT}export const Timezone = {
  ${jsEntries}
};
`;

const zoneKeys = zones.map(({ zone }) => `"${zone}"`).join(" | ");

const dtsEntries = zones
  .map(
    ({ zone, gmt, name }) =>
      `  "${zone}": { zone: "${zone}", gmt: "${gmt}", name: "${name}" };`
  )
  .join("\n");

const dtsContent = `${COMMENT}export const Timezone: {
${dtsEntries}
};

export type Timezone = typeof Timezone;
export type TimezoneKey = ${zoneKeys};
`;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, "zones.js"), jsContent);
fs.writeFileSync(path.join(OUTPUT_DIR, "zones.d.ts"), dtsContent);

console.log("Generated Timezone Type files..");
