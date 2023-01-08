import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    leaderboard_list(
        lbKey: string,
        page: number,
        pageSize: number,
    ): Promise<[[string, number, string[]][], number]>
}

const redis = new Redis({ keyPrefix: `{polls}` }) as CustomLua
redis.defineCommand("leaderboard_list", {
    numberOfKeys: 1,
    lua: fs.readFileSync(`${__dirname}/lua/leaderboard_list.lua`).toString("utf-8"),
});

async function main() {
    const eventId = "644"
    const organizationId = "6911691355886452736"
    const lbKey = `lb:${organizationId}:${eventId}`
    const page = 0
    const pageSize = 20
    console.log(lbKey, page, pageSize)
    const result = await redis.leaderboard_list( lbKey, page, pageSize)
    console.log(`result`, result)
    process.exit()
}

main().catch(err => console.log(err))
