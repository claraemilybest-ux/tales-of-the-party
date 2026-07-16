import { CronJob } from "cron";
import http from "node:http";
import https from "node:https";

// every 14 minutes send a Get request to the health endpoint
export const job = new CronJob("*/14 * * * *", function () {
    const base = process.env.FRONTEND_URL;
    if (!base) return;
    const url = new URL("/health", base).href;
    const client = url.startsWith("https:") ? https : http;

    client.get(url, (res) => {
        if (res.statusCode === 200) console.log("Health check passed");
        else console.log("Health check failed", res.statusCode);
    }).on("error", (err) => {
        console.error("Health check error", err);
    });
});
