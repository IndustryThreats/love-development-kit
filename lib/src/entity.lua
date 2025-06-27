local entity = {}
local o_entity = {}

local function entity_new(name, ...)
	return setmetatable({}, o_entity)
end
