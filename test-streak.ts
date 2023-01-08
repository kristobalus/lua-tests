
import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    leaderboard_update(): Promise<any>
}

const redis = new Redis({ keyPrefix: "{polls}" }) as CustomLua
redis.defineCommand("leaderboard_update", {
    numberOfKeys: 0,
    lua: fs.readFileSync(`${__dirname}/lua/leaderboard_update.lua`).toString("utf-8"),
});

async function main() {
    const result = await redis.leaderboard_update()
    console.log(result)
    process.exit()
}

main().catch(err => console.log(err))
