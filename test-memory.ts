
import IORedis from "ioredis"

const redis = new IORedis({ keyPrefix: "{polls}" })

async function main() {

    // await redis.del("lb")
    // for(let i = 0; i < 500_000; i++) {
    //
    //     // const time = Date.now()
    //     const memberId = 1_0000_000 + i
    //     const points = Math.ceil(Math.random() * 100)
    //     await redis.zadd("lb", points, memberId)
    //     // const isCorrect = Math.random() > 0.7
    //     // if ( isCorrect ) {
    //     //     await redis.hset("user:correct", questionId, points)
    //     //     await redis.zadd("user:correct:sorted", points, questionId)
    //     // }
    //     // await redis.hset("user:voted:no-now", questionId, 1)
    //     // await redis.sadd("user:voted:set", questionId)
    //     // await redis.zadd("user:voted:sorted", time, questionId)
    //     // await redis.zadd("user:answers", time, questionId)
    //     // const card = await redis.zcard("user:answers")
    //     // const delta = card - 10
    //     // if ( delta > 0 ) {
    //     //    await redis.zpopmin("user:answers", delta)
    //     // }
    // }

    await redis.del("user:voted:hash")
    await redis.del("user:voted:set")
    await redis.del("user:voted:zset")

    for(let i = 0; i < 513; i++) {

        const time = Date.now()
        const questionId = 10000 + i
        await redis.hset("user:voted", questionId, time)
        await redis.sadd("user:voted:set", questionId)
        await redis.zadd("user:voted:zset", time, questionId)
    }

    process.exit()
}

main().catch(err => console.log(err))
