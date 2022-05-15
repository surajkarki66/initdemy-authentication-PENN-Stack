import mailgun from "mailgun-js";

import config from "./config";

const mailGun = mailgun({
  apiKey: String(config.mailgunPrivateAPIKey),
  domain: String(config.mailgunDomain),
});

export default mailGun;
