AddStateBagChangeHandler('isLoggedIn', ('player:%s'):format(cache.serverId), function(_, _, value)
    if not value then client.onLogout() end
end)

RegisterNetEvent('qbx_core:client:onGroupUpdate', function(groupName, groupGrade)
    local groups = PlayerData.groups
    if not groupGrade then
        groups[groupName] = nil
    else
        groups[groupName] = groupGrade
    end
    client.setPlayerData('groups', groups)
end)

RegisterNetEvent('qbx_core:client:setGroups', function(groups)
    client.setPlayerData('groups', groups)
end)

---@diagnostic disable-next-line: duplicate-set-field
function client.setPlayerStatus(values)
    for name, value in pairs(values) do
        -- compatibility for ESX style values
        if value > 100 or value < -100 then
            value = value * 0.0001
        end

        local currentValue = client.player:get(name) or 0
        client.player:setr(name, lib.math.clamp(currentValue + value, 0, 100))
    end
end

function client.getHeaderData()
    local pData = exports.qbx_core:GetPlayerData()
    if not pData then return end

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
        name = pData.charinfo.firstname .. " " .. pData.charinfo.lastname,
        bank = ("$%s"):format(lib.math.groupdigits(pData.money.bank)),
        day = realTime.day,
        month = realTime.month,
        time = realTime.time,
        job = pData.job.label,
        jobName = pData.job.name,
        gang = pData.gang.label,
        gangName = pData.gang.name
    }
end
