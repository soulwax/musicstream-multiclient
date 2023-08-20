const { protocol } = require("electron");
const url = require("url");
const fs = require("fs");
const path = require("path");

let captchaPage = fs.readFileSync(
  path.join(__dirname, "..", "public", "html", "captcha.html"),
  "utf8"
);

module.exports = {
  callbackResponse: function (data) {
    // registerProtocol must be called before callback can set
    // so this is just a placeholder for the real callback function
    console.log(data);
  },
  registerScheme: function () {
    protocol.registerSchemesAsPrivileged([
      {
        scheme: "cap",
        privileges: { standard: true, secure: true },
      },
    ]);
  },
  registerProtocol: function () {
    protocol
      .registerFileProtocol("cap", (request) => {
        return new Promise((resolve, reject) => {
          let ReUrl = url.parse(request.url, true);
          if (ReUrl.query["g-recaptcha-response"]) {
            let response = ReUrl.query["g-recaptcha-response"];
            this.callbackResponse(response);
          }
          resolve({
            path: captchaFilePath,
          });
        });
      })
      .catch((error) => {
        console.error("Failed to register protocol:", error);
      });
  },
};
