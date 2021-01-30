// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("agancy")
 .extend("basic")
 .readAny("profile")

ac.grant("admin")
 .extend("basic")
 .extend("agancy")
 .updateAny("profile")
 .deleteAny("profile")
 .readAny("users")

return ac;
})();