var mongoose = require('mongoose');
var RoleModel = require('./role');

function Acl() {
	this.roles = {};
}

/*function Role(name) {
	var temp = new RoleModel();
	temp.name = name || "NoName";
}*/

function Ressource(name) {
	this.name = name || "NoName";
	this.permissions = [];
}

function Permission(name, can) {
	this.name = name || "NoName";
	this.state = can || false;
}

Acl.prototype.init = function (options, callback) {
	mongoose.connect("mongodb://" + options.dbAddress + ":" + options.port + "/" + options.dbName, function () {
		callback();
	});
};

Acl.prototype.addRole = function (roleName, callback) {
	var _this = this;
	RoleModel.count({ name: roleName }, function (err, count) {
		if (count == 0) {
			_this.roles[roleName] = new RoleModel({
				name: roleName,
				ressources: []
			});

			_this.save(roleName, function () {
				callback();
			});
		} else {
			callback("name already used");
		}
	});
};

Acl.prototype.removeRole = function (roleName) {
	this.roles[roleName] = null;
};

Acl.prototype.addRessource = function (role, ressourceName, callback) {
	var _this = this;
	RoleModel.count({ "ressources.name": ressourceName }, function (err, count) {
		if (count == 0) {

			_this.roles[role].ressources.push({ name: ressourceName, permissions: [] });

			_this.save(role, function () {
				callback();
			});
		} else {
			callback("name already used");
		}
	});
};

Acl.prototype.removeRessource = function (role, ressourceName) {
	this.roles.role.ressources[ressourceName] = null;
};

Acl.prototype.addPermission = function (role, ressource, permissionName, state) {
	this.roles[role].ressources[ressource].permissions.push({ name: permissionName, allowed: state });
	for (var i = 0; i < this.roles.length; i++) {
		this.roles[i].ressources[ressource].permissions[permissionName] = { name: permissionName, allowed: state };
	}
};

Acl.prototype.removePermission = function (role, ressource, permissionName, state) {
	this.roles[role].ressources[ressource].permissions[permissionName] = null;
	for (var i = 0; i < this.roles.length; i++) {
		this.roles[i].ressources[ressource].permissions[permissionName] = null;
	}
};

Acl.prototype.inherit = function (heir, parent) {
	console.log(this.roles[heir].ressources);
	console.log(this.roles[parent].ressources);
	this.roles[heir].ressources = this.roles[parent].ressources;
};

Acl.prototype.getRole = function (roleName) {
	return this.roles[roleName];
};

Acl.prototype.getRessource = function (roleName, ressourceName) {
	return this.roles[roleName].ressources[ressourceName];
};

Acl.prototype.can = function (roleName, ressourceName, permissionName) {
	if (this.roles[roleName].ressources[ressourceName].permissions[permissionName] != undefined) {
		return this.roles[roleName].ressources[ressourceName].permissions[permissionName].allowed;
	} else {
		return false;
	}
};

Acl.prototype.save = function (roleName, callback) {
	if (roleName != "") {
		this.roles[roleName].save(function () {
			callback();
		});
	} else {
		console.log("flop");
		this.roles.forEach(function (element, index, array) {
			console.log(element);
			console.log(index);
			console.log(array);
		})
		/*for (var i = 0; i < this.roles.length; i++) {
			console.log(this.roles[i]);
			this.roles[i].save(function() {
				callback();
			});
		}*/
	}
};

Acl.prototype.load = function (callback) {
	var _this = this;
	RoleModel.find({}, function (err, elements) {
		for (var s in elements) {
			_this.roles[elements[s].name] = elements[s];
		}
		callback();
	});
};

module.exports = new Acl;