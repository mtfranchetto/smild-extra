import * as _ from "lodash";
import ViewsImport from "./ViewsImport";
const fs = require('fs');
const path = require('path');

const defaultOptions = {views: "views", modules: []};

export default (options: { views: string, modules: string[] } = defaultOptions) => {
    let viewDirectory = path.join(process.cwd(), options.views);

    _.chain(options.modules).flatMap(function (externalViewDirectory: string) {
        return areasDirectoriesInside(path.join(process.cwd(), externalViewDirectory));
    }).forEach(function (area) {
        let areaDirectory: string = path.join(viewDirectory, area.name);

        if (!fs.existsSync(areaDirectory))
            fs.symlinkSync(area.path, areaDirectory);
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