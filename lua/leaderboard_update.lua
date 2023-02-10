local rcall = redis.call

-- VOTE PARAMS
local organization_id = ARGV[1];
local question_id = ARGV[2];
local event_id = ARGV[3];
local user_id = ARGV[4];
local points = ARGV[5] or 0;
local correct = ARGV[6] or '0';
local now = ARGV[7];

local lbVotedKey = KEYS[1];
local lbMainKey = KEYS[2];
table.remove(KEYS, 1); -- skip voted key

local voteExist = rcall('hget', lbVotedKey, question_id);
if (voteExist ~= false) then
    return nil;
else
    rcall('hset', lbVotedKey, question_id, now);
end

local function updateLeaderboardStatistics(leaderboardKey, leaderboardStatisticsKey)
    rcall('hincrby', leaderboardStatisticsKey, 'total', 1);

    if (correct == '1') then
        rcall('zincrby', leaderboardKey, points, user_id);
        rcall('hincrby', leaderboardStatisticsKey, 'correct', 1);
    else
        rcall('hincrby', leaderboardStatisticsKey, 'incorrect', 1);
    end;

    local lb_statistics = rcall('hmget', leaderboardStatisticsKey, unpack({'total','correct'}));
    local lb_total = lb_statistics[1];
    local lb_correct = lb_statistics[2] or 0;
    local percentage = lb_correct / lb_total * 100;
    rcall('hset', leaderboardStatisticsKey, 'percentage', math.floor(percentage+.5));
end

local function updateUserStatistics(lbUserKey)
    -- update user lb data
    rcall( 'hmset', lbUserKey,
        'organization_id', organization_id,
        'event_id', event_id,
        'user_id', user_id
    );
    -- increment user lb stats
    if (correct == '1') then
        rcall('hincrby', lbUserKey, 'correct', 1);
        rcall('hincrby', lbUserKey, 'points', points);
        rcall('hincrby', lbUserKey, 'streak', 1);
        rcall('hset', lbUserKey, 'streakLoss', 0);
    else
        rcall('hincrby', lbUserKey, 'incorrect', 1);
        rcall('hincrby', lbUserKey, 'streakLoss', 1);
        rcall('hset', lbUserKey, 'streak', 0);
    end;

    rcall('hset', lbUserKey, 'last_voted', now);
end

-- update leaderboards
for i, lb_user_key in ipairs(KEYS) do
    if i % 3 == 0 then
        updateUserStatistics(lb_user_key)
        updateLeaderboardStatistics(KEYS[i - 2], KEYS[i - 1])
    end
end

return nil;
