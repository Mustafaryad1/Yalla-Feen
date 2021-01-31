// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("user")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("agancy")
 .extend("user")
 .readAny("profile")

ac.grant("admin")
 .extend("user")
 .extend("agancy")
 .updateAny("profile")
 .deleteAny("profile")
 .readAny("users")
 .readAny('comments')

return ac;
})();