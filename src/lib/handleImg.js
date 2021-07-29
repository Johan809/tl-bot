const { writeFile } = require("fs");
const { promisify } = require("util");
const parseDataUrl = require("parse-data-url");

const write = promisify(writeFile);
const handleImg = (text, wraAPI) => {
  try {
    const sucess = wraAPI
      .getSimple({
        i: text,
        timeout: 2,
      })
      .then(async (res) => {
        const parsed = parseDataUrl(res);
        imgBuffer = Buffer.from(parsed.data, "base64");
        await write(`./src/images/response.gif`, imgBuffer, "base64");
        return true;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    return sucess;
  } catch (err) {
    console.log(err);
  }
};
module.exports = handleImg;
