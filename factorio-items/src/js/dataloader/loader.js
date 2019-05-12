const Lua = require('lua.vm.js').L;
const path = require('path');
const fs = require('fs');


const luaInitPath = path.resolve(path.join('src', 'lua', 'init.lua'));
const luaInitializationCode = fs.readFileSync(luaInitPath, { encoding: 'utf-8' });

function convertPathToForwardSlashes(path) {
    return path.replace(/\\/g, '/');
}


function readFileSync (file) {
    if (!fs.existsSync(file)) {
        return;
    }
    return fs.readFileSync(file, { encoding: 'utf-8' });

}


class Loader {
    constructor (factorioPath) {
        this.factorioPath = path.resolve(factorioPath);
        this.dataPath = path.join(factorioPath, 'data');
        this.base_loaders = [ 'core/lualib' ];
        this.lua = Lua;
        this.initializeLua();
    }

    initializeLua() {
        this.lua.execute(luaInitializationCode, readFileSync);
        this.updatePackageResolvingPaths(this.base_loaders);
        this.lua.execute('require("dataloader")');
    }

    loadMod (mod) {
        this.clearLoadedPackages();
        this.updatePackageResolvingPaths([ ...this.base_loaders, mod ]);
        ['data', 'data-updates', 'data-final-fixes'].forEach((start) => {
            try {
                this.lua.execute(`require("${start}")`);
            } catch (err) {
                // ignore
            }
        });
    }


    updatePackageResolvingPaths(paths) {
        const pathsString =
        paths
        .map((p) => path.join(this.dataPath, p))
        .map((p) => convertPathToForwardSlashes(p) + '/')
        .join(';') + ';';
        this.lua.execute(`loader.path = "${pathsString}"`);
    }

    getData () {
        return this.lua.execute('return to_object(data)')[0];
    }

    clearLoadedPackages() {
        this.lua.execute('for k, v in pairs(package.loaded) do ' +
                         'package.loaded[k] = false ' +
                         'end');
    }
}
module.exports = Loader;
