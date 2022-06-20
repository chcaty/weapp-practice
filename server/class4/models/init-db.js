const db = require("./mysql-db");
const fs = require("fs");

module.exports = () => {
  let files = fs.readdirSync(__dirname + "/");
  let jsFiles = files.filter((f) => {
    return f.endsWith("-model.js");
  }, files);

  for (let f of jsFiles) {
    console.log(`import file ${f}...`);
    let name = f.substring(0, f.length - 9);
    require(__dirname + "/" + f);
  }
  db.sync({ alter: true });
};
