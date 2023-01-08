
import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    timeseries(): Promise<any>
}

const redis = new Redis({ keyPrefix: "{polls}" }) as CustomLua
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
