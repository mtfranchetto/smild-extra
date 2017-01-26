import * as fs from "fs";
import * as path from "path";
import RequireViews from "./RequireViews";

const defaultOptions = {views: "views"};

export default (options: {views: string} = defaultOptions) => {
    let views = RequireViews({
        dirname: path.join(process.cwd(), options.views),
        filter: /(.+)\.tsx$/,
        map: function (name) {
            return name[0].toUpperCase() + name.slice(1);
        }
    });
    const exportFolder = path.join(process.cwd(), options.views, "export.js");
    process.env.EXPORT_VIEWS_PATH = exportFolder;
    fs.writeFileSync(exportFolder, 'module.exports = ' + JSON.stringify(views).replace(/"/gmi, ''));
    return Promise.resolve();
}