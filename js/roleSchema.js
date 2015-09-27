var mongoose = require('mongoose');

var RoleSchema = new mongoose.Schema ({
	name: String,
	resssources: [{
		name: String,
		permissions: [{
			name: String,
			allowed: {
				type: Boolean,
				default: false
			}
		}]
	}]
});

var Role = mongoose.model('Role', RoleSchema);
module.exports = Role;