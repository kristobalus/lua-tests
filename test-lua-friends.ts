import Redis from "ioredis"
import fs = require("fs")
const Table = require('cli-table3');

interface CustomLua extends Redis {
    leaderboard_friends(
        lbKey: string,
        usersIds?: string[],
    ): Promise<[[string, number, string[]][], number, number]>
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

    const table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
            , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
            , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
            , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 0 },
        head: ['page size', 'lock microsecs', 'max rps']
    });
    for (let total = 1; total <= 200; total = total + 20) {
        const userIds = users.slice(0, total).map(user => user.Id)
        const [, , elapsedTime] = await redis.leaderboard_friends(lbKey, userIds)
        table.push([total, elapsedTime, Math.floor(1_000_000 / elapsedTime)])
    }
    console.log("leaderboard.list as friend list lock time testing")
    console.log(table.toString());
    process.exit()
}

main().catch(err => console.log(err))
