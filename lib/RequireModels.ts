import * as fs from "fs";

var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;

export default function requireModels(options: any) {
    var dirname = typeof options === 'string' ? options : options.dirname;
    var excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
    var filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
    var modules = {};
    var recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
    var resolve = options.resolve || identity;
    var map = options.map || identity;

    function excludeDirectory(dirname) {
        return !recursive ||
            (excludeDirs && dirname.match(excludeDirs));
    }

    var files = fs.readdirSync(dirname);

    files.forEach(function (file) {
        var filepath = dirname + '/' + file;
        if (fs.statSync(filepath).isDirectory()) {

            if (excludeDirectory(file)) return;

            modules[map(file, filepath)] = requireModels({
                dirname: filepath,
                filter: filter,
                excludeDirs: excludeDirs,
                map: map,
                resolve: resolve
            });

        } else {
            var match = file.match(filter);
            if (!match) return;
            let [viewmodelId, key] = match[1].split(".")
            modules[map(viewmodelId, filepath)] = modules[map(viewmodelId, filepath)] || {};
            modules[map(viewmodelId, filepath)][key || "default"] = "require('" + filepath + "')";
        }
    });

    return modules;
};

function identity(val) {
    return val;
}