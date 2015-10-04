var mongoose = require('mongoose');

var RoleSchema = new mongoose.Schema({
	name: String,
	ressources: [{
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
// http://stackoverflow.com/questions/20227186/how-to-insert-into-nested-associative-arrays-in-mongodb
var Role = mongoose.model('Role', RoleSchema);
module.exports = Role;