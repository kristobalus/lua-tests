
local function find(list, el)
    for i, v in pairs(list) do
        if v  == el then
            return true
        end
    end
    return false
end

redis.call("zadd", "user", "NX", 1, "member-1")
redis.call("zadd", "user", "NX", 2, "member-2")
redis.call("zadd", "user", "NX", 3, "member-3")
local list = redis.call("zrange", "user", 0, -1)
local size = redis.call("zcard", "user")
return find(list, "member-1")
