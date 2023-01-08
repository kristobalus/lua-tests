import Redis from "ioredis"
import fs = require("fs")
const Table = require('cli-table3');

interface CustomLua extends Redis {
    leaderboard_list(
        lbKey: string,
        page: number,
        pageSize: number,
    ): Promise<[[string, number, string[]][], number, number]>
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
    const table = new Table({
        chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
            , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
            , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
            , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        style: { 'padding-left': 0, 'padding-right': 0 },
        head: ['page size', 'lock microsecs', 'max rps']
    });
    for (let pageSize = 20; pageSize <= 100; pageSize = pageSize + 20) {
        const [, , elapsedTime] = await redis.leaderboard_list(lbKey, page, pageSize)
        table.push([pageSize, elapsedTime, Math.floor(1_000_000 / elapsedTime)])
    }
    console.log("leaderboard.list lock time testing")
    console.log(table.toString());
    process.exit()
}

main().catch(err => console.log(err))
