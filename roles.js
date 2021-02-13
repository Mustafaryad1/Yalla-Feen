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
 .deleteAny("category")
 .createAny('category')
 .deleteAny("tag")
 .readAny("users")
 .readAny('comments')
 .readAny('messages')
 .readAny('advertise')
 .deleteAny('message')
 .deleteAny('advertise')
 .readAny('rating')
 .updateAny("admin")
 .updateAny("advertise")
 

return ac;
})();