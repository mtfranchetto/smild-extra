import * as _ from "lodash";
import ViewsImport from "./ViewsImport";
const fs = require('fs');
const path = require('path');
const remove = require('remove');

const defaultOptions = {views: "views", modules: []};
const EXT_DIR_NAME = "_external";

export default (options: { views: string, modules: string[] } = defaultOptions) => {
    let viewDirectory = path.join(process.cwd(), options.views);
    clean(viewDirectory);

    _.chain(options.modules).flatMap(function (externalViewDirectory: string) {
        return areasDirectoriesInside(path.join(process.cwd(), externalViewDirectory));
    }).forEach(function (area) {
        fs.symlinkSync(area.path, path.join(viewDirectory, EXT_DIR_NAME, area.name));
    }).value();

    return ViewsImport({views: options.views});
}

function areasDirectoriesInside(srcpath) {
    if (!fs.existsSync(srcpath))
        return [];

    return fs.readdirSync(srcpath)
        .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory())
        .map(area => {
            return {path: path.join(srcpath, area), name: area}
        });
}

function clean(viewDirectory: string) {
    let externalViewDirectory: string = path.join(viewDirectory, EXT_DIR_NAME);

    if (fs.existsSync(externalViewDirectory))
        remove.removeSync(externalViewDirectory);

    fs.mkdirSync(externalViewDirectory);
}