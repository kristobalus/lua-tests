import Redis from "ioredis"
import fs = require("fs")
const Table = require('cli-table3');

interface CustomLua extends Redis {
    my_echo(
        key1: string,
        key2: string,
        arg1: string,
        arg2: string
    ): Promise<[[string, number, string[]][], number, number]>
}

const redis = new Redis({ keyPrefix: `{polls}` }) as CustomLua
redis.defineCommand("my_echo", {
    numberOfKeys: 2,
    lua: "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}"
});

async function main() {
    console.time("test")
    for (let i = 1; i < 10_000; i++) {
        const result = await redis.my_echo("11", "11", "21", "22")
    }
    console.timeEnd("test")
}

main().catch(err => console.log(err))
