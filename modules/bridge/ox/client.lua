if not lib.checkDependency('ox_core', '0.21.3', true) then return end

local Ox = require '@ox_core.lib.init' --[[@as OxClient]]
local player = Ox.GetPlayer()

RegisterNetEvent('ox:playerLogout', client.onLogout)

RegisterNetEvent('ox:setGroup', function(name, grade)
    PlayerData.groups[name] = grade
    OnPlayerData('groups')
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
    for name, value in pairs(values) do
        -- Thanks to having status values setup out of 1000000 (matching esx_status's standard)
        -- we need to awkwardly change the value
        if value > 100 or value < -100 then
            -- Hunger and thirst start at 0 and go up to 100 as you get hungry/thirsty (inverse of ESX)
            if (name == 'hunger' or name == 'thirst') then
                value = -value
            end

            value = value * 0.0001
        end

        ---@diagnostic disable-next-line: undefined-global
        player.addStatus(name, value)
    end
end

function client.getHeaderData()
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
        name = ("%s %s"):format(player.get('firstName') or "", player.get('lastName') or ""),
        bank = ("$%s"):format(lib.math.groupdigits(player.getAccount('bank') or 0)),
        day = realTime.day,
        month = realTime.month,
        time = realTime.time,
        job = player.getGroup('job') or "Unemployed",
        jobName = player.getGroup('job') or "unemployed",
        gang = player.getGroup('gang') or "None",
        gangName = player.getGroup('gang') or "none"
    }
end
