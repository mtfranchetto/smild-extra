import * as fs from "fs";
import * as path from "path";
import RequireModels from "./RequireModels";

export default () => {
    var backend = RequireModels({
        dirname: path.join(process.cwd(), "backend-mock-data"),
        filter: /(.+)\.json$/,
        map: function (name) {
            return name[0].toUpperCase() + name.slice(1);
        }
    });
    const exportFolder = path.join(process.cwd(), "backend-mock-data", 'export.js');
    fs.writeFileSync(exportFolder, 'module.exports = ' + JSON.stringify(backend).replace(/"/gmi, ''));
    return Promise.resolve();
}