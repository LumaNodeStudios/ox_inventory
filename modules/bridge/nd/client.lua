if not lib.checkDependency('ND_Core', '2.0.0', true) then return end

NDCore = {}

lib.load('@ND_Core.init')

RegisterNetEvent("ND:characterUnloaded", client.onLogout)

local function reorderGroups(groups)
    groups = groups or {}
    for group, info in pairs(groups) do
        groups[group] = info.rank
    end
    return groups
end

SetTimeout(500, function()
	local player = NDCore.getPlayer()
    if not player then return end
    client.setPlayerData("groups", reorderGroups(player.groups))
end)

RegisterNetEvent("ND:characterLoaded", function(character)
    client.setPlayerData("groups", reorderGroups(character.groups))
end)

RegisterNetEvent("ND:updateCharacter", function(character, updatedData)
    local validUpdateData = { ["job"] = true, ["groups"] = true, ["jobInfo"] = true }
    if not validUpdateData[updatedData] then return end
    client.setPlayerData("groups", reorderGroups(character.groups))
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
    if GetResourceState("ND_Status") ~= "started" then return end

    local status = exports["ND_Status"]

    for name, value in pairs(values) do

        if value > 100 or value < -100 then
            value = value * 0.0001
        end

        status:changeStatus(name, value)
    end
end

function client.getHeaderData()
    local player = NDCore.getPlayer()
    if not player then return end

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
        name = player.fullname or GetPlayerName(PlayerId()),
        bank = ("$%s"):format(lib.math.groupdigits(player.bank or 0)),
        day = realTime.day,
        month = realTime.month,
        time = realTime.time,
        job = player.job or "Unemployed",
        jobName = player.job and player.job:lower() or "unemployed",
        gang = "None",
        gangName = "none"
    }
end
