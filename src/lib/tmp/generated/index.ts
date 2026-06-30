/* eslint-disable @typescript-eslint/no-require-imports */
const root = require("./tendon") as { tendon: TendonRoot };

type TendonRoot = typeof import("./tendon").tendon;

export const tendon: TendonRoot = root.tendon;
