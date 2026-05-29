local ESX = setmetatable({}, {
	__index = function(self, index)
		local obj = exports.es_extended:getSharedObject()
		self.SetPlayerData = obj.SetPlayerData
		self.PlayerLoaded = obj.PlayerLoaded
		return self[index]
	end
})

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerData(key, value)
	PlayerData[key] = value
	ESX.SetPlayerData(key, value)
end

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
	for name, value in pairs(values) do
		if value > 0 then TriggerEvent('esx_status:add', name, value) else TriggerEvent('esx_status:remove', name, -value) end
	end
end

RegisterNetEvent('esx:onPlayerLogout', client.onLogout)

AddEventHandler('esx:setPlayerData', function(key, value)
	if not PlayerData.loaded or GetInvokingResource() ~= 'es_extended' then return end

	if key == 'job' then
		key = 'groups'
		value = { [value.name] = value.grade }
	end

	PlayerData[key] = value
	OnPlayerData(key, value)
end)

local Weapon = require 'modules.weapon.client'

RegisterNetEvent('esx_policejob:handcuff', function()
	PlayerData.cuffed = not PlayerData.cuffed
	client.player:setr('invBusy', PlayerData.cuffed)

	if not PlayerData.cuffed then return end

	Weapon.Disarm()
end)

RegisterNetEvent('esx_policejob:unrestrain', function()
	PlayerData.cuffed = false
	client.player:setr('invBusy', false)
end)

function client.getHeaderData()
    local ESX = exports.es_extended:getSharedObject()
    local pData = ESX.GetPlayerData()
    if not pData then return end

    local name = GetPlayerName(PlayerId())
    if pData.firstName then
        name = pData.firstName .. " " .. pData.lastName
    end

    local bank = 0
    if pData.accounts then
        for _, account in pairs(pData.accounts) do
            if account.name == 'bank' then
                bank = account.money
                break
            end
        end
    end

    local realTime = lib.callback.await('ox_inventory:getRealTime', 500)

    if not realTime then
        local days = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
        local months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"}
        realTime = {
            day = days[GetClockDayOfWeek() + 1] or "Monday",
            month = months[GetClockMonth() + 1] or "January",
            time = ("%02d:%02d"):format(GetClockHours(), GetClockMinutes())
        }
    end

    return {
        name = name,
        bank = ("$%s"):format(lib.math.groupdigits(bank)),
        day = realTime.day,
        month = realTime.month,
        time = realTime.time,
        job = pData.job and pData.job.label or "Unemployed",
        jobName = pData.job and pData.job.name or "unemployed",
        gang = "None",
        gangName = "none"
    }
end
