loader = {}
data = {}
loader.path = "C:/Users/Toxoed/Desktop/projects/factorio-items/src/lua/;"
local fn = ...

local function load_lua_with_provided_function(path, readpath)
    local content = readpath(nil, path), path
    if not content then
        return nil, "not found"
    end
    return load(content, path)
end



function fs_loader(mod_name)
	local err, err2, err3;
	for path in string.gmatch(loader.path, "([^;]+);") do
		local func
        local module_path = path .. mod_name
        func, err2 = load_lua_with_provided_function(module_path, fn)
        if func ~= nil then return func end
		local module_path = path .. mod_name:gsub("%.", "/") .. ".lua"
		func, err = load_lua_with_provided_function(module_path, fn)
		if func ~= nil then return func end
		local module_path = path .. mod_name:gsub("%.", "/") .. "/init.lua"
		func, err2 = load_lua_with_provided_function(module_path, fn)

	end
	return "\\n    " .. err .. "\\n    " .. err2
end



table.insert(package.searchers, 1, fs_loader)

function print_table(table)
	for i,v in pairs(table) do
		print(i,v)
	end
end

function isArray(t)
    if type(t)~="table" then return nil,"Argument is not a table! It is: "..type(t) end
    --check if all the table keys are numerical and count their number
    local count=0
    for k,v in pairs(t) do
        if type(k)~="number" then return false else count=count+1 end
    end
    --all keys are numerical. now let's see if they are sequential and start with 1
    for i=1,count do
        --Hint: the VALUE might be "nil", in that case "not t[i]" isn't enough, that's why we check the type
        if not t[i] and type(t[i])~="nil" then return false end
    end
    return true
end


function to_object(_ob)
	local ob = _ob;
	if type(ob) == "string" then
		return ob
	end

	if type(ob) == "nil" then
		return ob
	end

	if type(ob) == "boolean" then
		return ob
	end

	if type(ob) == "number" then
		return ob
	end

	if type(ob) == "table" then
		if (isArray(ob)) then
			local o = js.new(window.Array);
			for i,v in ipairs(ob) do
				local val = to_object(v)
				if val ~= nil then
					o[i-1] = val
				end
			end
			return o
		else
			local o = js.new(window.Object);
			for i,v in pairs(ob) do
				local val = to_object(v)
				if val ~= nil then
					o[i] = val
				end
			end
			return o
		end
	end

	return nil
end
