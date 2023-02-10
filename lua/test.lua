

local voteExist = redis.call('hget', "test", "question-1");
redis.log(redis.LOG_WARNING, type(voteExist))

if ( voteExist == nil ) then
    redis.log(redis.LOG_WARNING, "nil")
end

if ( voteExist == "" ) then
    redis.log(redis.LOG_WARNING, "empty")
end

if ( voteExist == " " ) then
    redis.log(redis.LOG_WARNING, "space")
end

if (voteExist ~= false) then
    return voteExist;
else
    redis.call('hset', "test", "question-1", "1675665960");
    return voteExist == nil;
end
