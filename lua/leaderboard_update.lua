
local streak_type = redis.call("hget", "user", "streak_type")
local streak = redis.call("hget", "user1", "streak")
if not streak then streak = 0 end
if tonumber(streak) > 0 then
    return "win"
end

return "loss"
