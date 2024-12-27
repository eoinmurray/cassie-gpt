import PostalMime from "postal-mime";
import { IncomingCloudflareEmail } from "@/types/incoming-cloudflare-email";
import getFixture from "@/tests/utils/get-fixture";
import { logging } from "@/utils/logging";
import { simpleParser } from "mailparser";

const fixture = (await getFixture({ fixtureName: "1" })).toString()
const postalMimeEmail = await PostalMime.parse(fixture) as IncomingCloudflareEmail;
const mailparserEmail = await simpleParser(fixture);

// logging.log(fixture)

logging.log(mailparserEmail)
logging.log(postalMimeEmail)