-- combination of {prefix}lb:{organizationId}, passed as key from js code
local prefix = KEYS[1];
local leaderboardId = ARGV[1];
-- leaderboard namespaces definitions. begin ---
local function lb_namespace(leaderboardId)
    local ns = {}
    function ns:key()
        return prefix .. ":" .. leaderboardId
    end
    -- where hash table kept with leaderboard attributes
    function ns:data()
        return prefix .. ":" .. leaderboardId .. ":item"
    end
    function ns:events()
        return prefix .. ":" .. leaderboardId .. ":item" .. ":events"
    end
    function ns:children()
        return prefix .. ":" .. leaderboardId .. ":item" .. ":children"
    end
    function ns:parents()
        return prefix .. ":" .. leaderboardId .. ":item" .. ":parents"
    end
    function ns:user_stats(userId)
        return prefix .. ":" .. leaderboardId .. ":" .. userId
    end
    function ns:users_rank()
        return prefix .. ":" .. leaderboardId
    end
    function ns:statistics()
        return prefix .. ":" .. leaderboardId .. ":statistics"
    end
    return ns
end
-- organization namespace to keep leaderboard indices
local function org_namespace()
    local ns = {}
    function ns:leaderboards()
        return prefix .. ":list"
    end
    function ns:leaderboards_by_event(eventId)
        return prefix .. ":" .. eventId .. ":list"
    end
    return ns
end
-- user leaderboard with user vote stats
local function user_namespace(eventId)
    local ns = {}
    function ns:key()
        return prefix .. ":" .. eventId
    end
    return ns
end
-- leaderboard namespaces definitions. end ---
local lb = lb_namespace(leaderboardId)
local org = org_namespace()
local type = redis.call("hget", lb:data(), "type")
if tostring(type) == "1" then
    -- logic for deletion of tournament leaderboard
    local user_rank = redis.call("zrange", lb:users_rank(), 0, -1)
    for points, userId in ipairs(user_rank) do
        redis.call("del", lb:user_stats(userId))
    end
    local eventIds = redis.call("smembers", lb:events())
    local childIds = redis.call("smembers", lb:children())
    local parentIds = redis.call("smembers", lb:parents())
    -- remove leaderboard.key from org's event leaderboards
    for i, eventId in ipairs(eventIds) do
      redis.call("srem", org:leaderboards_by_event(eventId), lb:key())
    end
    -- unlink with children
    for i, childId in ipairs(childIds) do
      local child = lb_namespace(childId)
      redis.call("srem", child:parents(), leaderboardId)
    end
    -- remove personal keyspace
    redis.call("del", lb:parents())
    redis.call("del", lb:children())
    redis.call("del", lb:data())
    redis.call("del", lb:events())
    redis.call("del", lb:statistics())
    redis.call("del", lb:users_rank())
    -- remove id registration from org's leaderboards
    redis.call("srem", org:leaderboards(), leaderboardId)
    -- report successful deletion
    return 1
else
    -- so far event leaderboard are not deletable
    return 0
end
