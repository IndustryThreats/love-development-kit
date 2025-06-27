--[[
--
--	Simple Vector class.
--	Part of the love-development-kit.
]]
--

---@class Vector
---@field x number
---@field y number
---@field dx number
---@field dy number

---Simple Vector class.
---From love-development-kit.
local vector = {}

local function vector_new(x, y, dx, dy)
	-- the direction of a vector's components shall never be nil
	if not dx or not dy then
		dx = x
		dy = y
	end

	local self = setmetatable({
		x = x,
		y = y,
		dx = dx,
		dy = dy,
	}, vector)
	return self
end

---Creates a new vector
---@param x number
---@param y number
---@param dx number | nil
---@param dy number | nil
---@return Vector
function vector.__call(x, y, dx, dy)
	return vector_new(x, y, dx, dy)
end

-- metamethod wall

function vector.__add(a, b)
	return vector_new(a.x + b.x, a.y + b.y)
end
function vector.__sub(a, b)
	return vector_new(a.x - b.x, a.y - b.y)
end
function vector.__mul(a, b)
	return vector_new(a.x * b.x, a.y * b.y)
end
function vector.__div(a, b)
	return vector_new(a.x / b.x, a.y / b.y)
end
function vector.__mod(a, b)
	return vector_new(a.x % b.x, a.y % b.y)
end
function vector.__pow(a, b)
	return vector_new(a.x ^ b.x, a.y ^ b.y)
end

return vector
