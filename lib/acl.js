var mongoose = require('mongoose');
var RoleModel = require('./role')

function Acl() {
	this.roles = [];
}

function Role(name) {
	this.name = name || "NoName";
	this.ressources = [];
}

function Ressource(name) {
	this.name = name || "NoName";
	this.permissions = [];
}

function Permission(name, can) {
	this.name = name || "NoName";
	this.state = can || false;
}

Acl.prototype.init = function (dbAddress, dbName, port, username, passport) {
	mongoose.connect("mongodb://" + dbAddress + ":" + port + "/" + dbName);
}

Acl.prototype.addRole = function (roleName) {
	this.roles[roleName] = new Role(roleName);
}

Acl.prototype.removeRole = function (roleName) {
	this.roles[roleName] = null;
}

Acl.prototype.addRessource = function (role, ressourceName) {
	this.roles[role].ressources[ressourceName] = new Ressource(ressourceName);
}

Acl.prototype.removeRessource = function (role, ressourceName) {
	this.roles[role].ressources[ressourceName] = null;
}

Acl.prototype.addPermission = function (role, ressource, permissionName, state) {
	this.roles[role].ressources[ressource].permissions[permissionName] = new Permission(permissionName, state);
	for (var i = 0; i < this.roles.length; i++) {
		this.roles[i].ressources[ressource].permissions[permissionName] = new Permission(permissionName, state);
	}
}

Acl.prototype.removePermission = function (role, ressource, permissionName, state) {
	this.roles[role].ressources[ressource].permissions[permissionName] = null;
	for (var i = 0; i < this.roles.length; i++) {
		this.roles[i].ressources[ressource].permissions[permissionName] = null;
	}
}

Acl.prototype.inherit = function (heir, parent) {
	this.roles[heir].ressources = this.roles[parent].ressources;
}

Acl.prototype.getRole = function (roleName) {
	return this.roles[roleName];
}

Acl.prototype.getRessource = function (roleName, ressourceName) {
	return this.roles[roleName].ressources[ressourceName];
}

Acl.prototype.can = function (roleName, ressourceName, permissionName) {
	if(this.roles[roleName].ressources[ressourceName].permissions[permissionName] != undefined)
		return this.roles[roleName].ressources[ressourceName].permissions[permissionName].state;
	else
		return false;
}

Acl.prototype.save = function (roleName) {
	if(roleName) {
		this.roles[roleName].save();
	}
}

module.exports = new Acl;