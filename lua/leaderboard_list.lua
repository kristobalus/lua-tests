local start_time = redis.call('time')

local rcall = redis.call
local lbKey = KEYS[1];
local page = ARGV[1];
local pageSize = ARGV[2];

local lbs = {};
local from = page * pageSize;
local to = page * pageSize + pageSize - 1;

local usersRanks = rcall('zrevrange', lbKey, from, to);

for userRank, userId in ipairs(usersRanks) do
    local userKey = lbKey .. ':' .. userId;
    table.insert(lbs, {
        userId,
        userRank + from,
        rcall('hmget', userKey, 'incorrect', 'correct', 'points', 'streak', 'streakLoss')
    })
end;

local end_time = redis.call('time')
local elapsed_time = (end_time[1] - start_time[1]) * 1000000  + end_time[2] - start_time[2]

return { lbs, rcall('zcard', lbKey), elapsed_time };
