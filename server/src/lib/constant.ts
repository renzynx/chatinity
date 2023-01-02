import { join } from "path";

export const rootDir = join(__dirname, "..", "..");
export const srcDir = join(rootDir, "src");
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "auth";
