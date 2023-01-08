local start_time = redis.call('time')
local rcall = redis.call

local lbKey = KEYS[1];

local lbs = {};
for i, userId in ipairs(ARGV) do
    local userKey = lbKey .. ':' .. userId;
    local userRank = tonumber(rcall('zrevrank', lbKey, userId));

    if (userRank ~= nil) then
        table.insert(lbs, {
            userId,
            userRank + 1,
            rcall('hmget', userKey, 'incorrect', 'correct', 'points', 'streak', 'streakLoss')
        })
    end;
end;

local end_time = redis.call('time')
local elapsed_time = (end_time[1] - start_time[1]) * 1000000 + end_time[2] - start_time[2]

return {lbs, #lbs, elapsed_time}
