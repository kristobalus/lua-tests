import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    leaderboard_friends(
        lbKey: string,
        usersIds?: string[],
    ): Promise<[[string, number, string[]][], number]>
}

interface User {
    username: string
    jwt: string
    signedAt: string
    Id: string
}

const redis = new Redis({ keyPrefix: `{polls}` }) as CustomLua
redis.defineCommand("leaderboard_friends", {
    numberOfKeys: 1,
    lua: fs.readFileSync(`${__dirname}/lua/leaderboard_friends.lua`).toString("utf-8"),
});

async function main() {
    const eventId = "644"
    const organizationId = "6911691355886452736"
    const lbKey = `lb:${organizationId}:${eventId}`
    const users = JSON.parse(fs.readFileSync("test-users.json").toString("utf-8")) as User[]
    const userIds = users.slice(0, 100).map(user => user.Id)
    console.log(userIds.length)
    const result = await redis.leaderboard_friends(lbKey, userIds)
    console.log(`result`, result)
    process.exit()
}

main().catch(err => console.log(err))
