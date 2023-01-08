
import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    leaderboard_delete(organizationId: string, leaderboardId: string): Promise<any>
}

const redis = new Redis({ keyPrefix: "{polls}" }) as CustomLua
redis.defineCommand("leaderboard_delete", {
    numberOfKeys: 1,
    lua: fs.readFileSync(`${__dirname}/lua/leaderboard_delete.lua`).toString("utf-8"),
});

async function main() {
    // console.log(`before delete`)
    const leaderboardId = "tl6i8n"
    const organizationId = "3"
    // const keys = await redis.keys(`*${leaderboardId}*`)
    // console.log(keys)
    const result = await redis.leaderboard_delete(`lb:${organizationId}`, leaderboardId)
    console.log(`after delete`, result)
    process.exit()
}

main().catch(err => console.log(err))
