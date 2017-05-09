import * as fs from "fs";
import * as path from "path";
import RequireModels from "./RequireModels";

export default (modelPath: string = "scripts/backend") => {
    var backend = RequireModels({
        dirname: path.join(process.cwd(), modelPath),
        filter: /(.+)\.json$/
    });
    const exportFolder = path.join(process.cwd(), modelPath, 'export.js');
    fs.writeFileSync(exportFolder, 'module.exports = ' + JSON.stringify(backend).replace(/"\+/gmi, '').replace(/\+"/gmi, ''));
    return Promise.resolve();
}