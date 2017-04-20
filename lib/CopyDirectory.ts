const copy = require("copy");

export default (source, dest) => new Promise((resolve, reject) => {
    copy(source, dest, error => error ? reject(error) : resolve());
});