
import IORedis from "ioredis"
import fs = require("fs")

interface CustomLua extends IORedis.Redis {
    leaderboard_update(...args: any): Promise<any>
}

const redis = new IORedis({ keyPrefix: "{polls}" }) as CustomLua
// @ts-ignore
redis.defineCommand("hash", {
    numberOfKeys: 0,
    lua: fs.readFileSync(`${__dirname}/lua/hash.lua`).toString("utf-8"),
});

async function main() {
    const size = await redis.hash()
    console.log(size)
    process.exit()
}

main().catch(err => console.log(err))


async function update() {

    const leaderboards = [
        "event1:main:leaderboard",
        "event1:main:leaderboard",
        "event1:main:leaderboard",
        "event1:main:leaderboard",
    ]

    const lbs = [
        "user:hash:voted",
        "event1:main:leaderboard",
        "event2:main:leaderboard:stats",
        "event3:main:leaderboard:user",
        ...leaderboards
    ]


        await this.redis.leaderboard_update(
            lbs.length, // number of keys
            // KEYS
            lbs,
            // ARGS
            organizationId,
            questionId,
            eventId,
            userId,
            points,
            correct ? '1' : '0',
            Date.now()
        )

}