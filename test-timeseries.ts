
import IORedis from "ioredis"
import fs = require("fs")

interface CustomLua extends IORedis.Redis {
    timeseries(): Promise<any>
}

const redis = new IORedis({ keyPrefix: "{polls}" }) as CustomLua
// @ts-ignore
redis.defineCommand("timeseries", {
    numberOfKeys: 0,
    lua: fs.readFileSync(`${__dirname}/lua/timeseries.lua`).toString("utf-8"),
});

async function main() {
    const size = await redis.timeseries()
    console.log(size)
    process.exit()
}

main().catch(err => console.log(err))
