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
			callback("Role name already used");
		}
	});
};

Acl.prototype.removeRole = function (roleName) {
	this.roles[roleName] = null;
};

Acl.prototype.addRessource = function (ressourceName, callback) {
	var _this = this;
	RoleModel.count({ "ressources.name": ressourceName }, function (err, count) {
		if (count == 0) {
			for (var r in _this.roles) {
				_this.roles[r].ressources.push({ name: ressourceName, permissions: [] });
			}
			_this.save("", function () {
				callback();
			});
		} else {
			callback("Ressource name already used");
		}
	});
};

Acl.prototype.removeRessource = function (role, ressourceName) {
	this.roles.role.ressources[ressourceName] = null;
};

Acl.prototype.addPermission = function (ressource, permissionName, state, callback) {
	var _this = this;
	var ressourceID = findRessourceId(ressource, this);
	if (ressourceID == undefined) {
		callback("No ressource found for this name");
	} else {
		RoleModel.count({ "ressources.permissions.name": permissionName }, function (err, count) {
			if (count == 0) {
				for (var i in _this.roles) {
					_this.roles[i].ressources[ressourceID].permissions.push({ name: permissionName, allowed: state });
				}
				_this.save("", function () {
					if (callback)
						callback();
				});
			} else {
				if (callback)
					callback("Permission name already used");
			}
		});
	}
};

Acl.prototype.removePermission = function (role, ressource, permissionName, state) {
	this.roles[role].ressources[ressource].permissions[permissionName] = null;
	for (var i = 0; i < this.roles.length; i++) {
		this.roles[i].ressources[ressource].permissions[permissionName] = null;
	}
};

Acl.prototype.inherit = function (heir, parent, callback) {
	if (this.roles[heir].ressources != undefined && this.roles[parent].ressources != undefined) {
		this.roles[heir].ressources = this.roles[parent].ressources;
		this.save("", function () {
			if (callback)
				callback();
		});
	} else {
		if (this.roles[heir].ressources == undefined && this.roles[parent].ressources == undefined) {
			if (callback)
				callback("Parent and heir ressources are undefined");
		} else if (this.roles[heir].ressources == undefined) {
			if (callback)
				callback("Heir ressources are undefined");
		} else if (this.roles[parent].ressources == undefined) {
			if (callback)
				callback("Parent ressources are undefined");
		} else {
			if (callback)
				callback("Unknown error");
		}
	}
};

Acl.prototype.getRole = function (roleName, callback) {
	if (callback)
		callback();
	return this.roles[roleName];
};

Acl.prototype.getRessource = function (roleName, ressourceName, callback) {
	var ressourceID = findRessourceId(ressourceName, this);
	if (ressourceID != undefined) {
		if (callback)
			callback();
		return this.roles[roleName].ressources[ressourceID];
	} else {
		callback("No ressource found for this name")
	}
};

Acl.prototype.can = function (roleName, ressourceName, permissionName, callback) {
	var ressourceID = findRessourceId(ressourceName, this);
	var permissionsID = findPermissionId(ressourceName, permissionName, this);

	if (ressourceID == undefined && permissionsID == undefined) {
		if (callback)
			callback("No ressource and no permission found for these names");
	} else if (permissionsID == undefined) {
		if (callback)
			callback("No permission found for this name");
	} else {
		if (this.roles[roleName].ressources[ressourceID].permissions[permissionsID] != undefined) {
			if (callback)
				callback();
			return this.roles[roleName].ressources[ressourceID].permissions[permissionsID].allowed;
		} else {
			if (callback)
				callback("Undefined permission");
		}
	}
};

Acl.prototype.save = function (roleName, callback) {
	if (roleName != "") {
		this.roles[roleName].save(function () {
			if (callback)
				callback();
		});
	} else {
		var length = 0;
		for (var y in this.roles) {
			length++;
		}
		for (var i in this.roles) {
			this.roles[i].save();
			length--;
			if (length == 0) {
				if (callback)
					callback();
			}
		}
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

function findRessourceId(ressourceName, obj) {
	for (var i in obj.roles) {
		for (var j = 0; obj.roles[i].ressources.length > j; j++) {
			if (obj.roles[i].ressources[j].name == ressourceName) {
				return j;
			}
		}
	}
}

function findPermissionId(ressourceName, permissionName, obj) {
	for (var i in obj.roles) {
		for (var j = 0; obj.roles[i].ressources.length > j; j++) {
			if (obj.roles[i].ressources[j].name == ressourceName) {
				for (var h = 0; h < obj.roles[i].ressources[j].permissions.length; h++) {
					if (obj.roles[i].ressources[j].permissions[h].name == permissionName) {
						return h;
					}
				}
			}
		}
	}
}