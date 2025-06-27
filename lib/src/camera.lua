--[[
--Camera must be data-driven, but also plug and play for scenarios that don't need too much work.
--
--Lets only focus on a few camera modes for now and add support for more later.
--We should have at least a top-down camera.
]]
--
local vector = require("vector")

---@class Camera
---@field active boolean
---@field position Vector
---@field switch function

---@class CameraConfig
---@field initial_position Vector

---A simple, data-driven camera.
---From love-development-kit.
local camera = {
	_current_camera = nil,
	_default_config = {
		initial_position = vector(0, 0, 0, 0),
	},
}

local o_camera = {
	position = vector(0, 0, 0, 0),
}

function o_camera:switch()
	camera._current_camera.active = false
	self.active = true
	camera._current_camera = self
end

---@param config CameraConfig
local function camera_new(config)
	local self = setmetatable({
		config = config,
	}, o_camera)
	return self
end

---@return CameraConfig
local function camera_default_config()
	return camera._default_config
end

---Switch the default camera config.
---Only affects new cameras, proceding this function call.
---@param config CameraConfig
function camera.set_default_config(config)
	camera._default_config = config
end

---Sets up a new camera
---@param config CameraConfig | nil
function camera.__call(config)
	config = config or camera_default_config()
	return camera_new(config)
end

return camera
