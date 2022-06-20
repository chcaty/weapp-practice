const fs = require("fs");

module.exports = (app) => {
  let files = fs.readdirSync(__dirname + "/");
  let jsFiles = files.filter((f) => {
    return f.endsWith("-router.js");
  }, files);

  for (let f of jsFiles) {
    console.log(`import file ${f}...`);
    // let name = f.substring(0, f.length - 10)
    let router = require(__dirname + "/" + f);
    app.use(router.routes());
    app.use(router.allowedMethods());
  }
};
