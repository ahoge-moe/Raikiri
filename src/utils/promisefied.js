/**
 * @module promisefied
 * This module simply transforms functions that return a callback
 * into functions that return a promise
 */

module.exports = promisefied = {
  jsonParse: string => {
    return new Promise((resolve, reject) => {
      try {
        return resolve(JSON.parse(string));
      }
      catch (e) {
        return reject(902);
      }
    });
  },
};
