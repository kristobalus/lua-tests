
import Redis from "ioredis"
import fs = require("fs")

interface CustomLua extends Redis {
    test(): Promise<any>
}

const redis = new Redis() as CustomLua
redis.defineCommand("test", {
    numberOfKeys: 0,
    lua: fs.readFileSync(`${__dirname}/lua/test.lua`).toString("utf-8"),
});

async function main() {
    const result = await redis.test()
    console.log(result)
    process.exit()
}

main().catch(err => console.log(err))
