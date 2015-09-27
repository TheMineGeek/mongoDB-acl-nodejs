var Acl = require("../lib/acl");
var assert = require("assert");

describe("Initialize connection to the database", function() {
	
	it("should connect to database", function() {
		Acl.init("localhost", "test", "27017");
	});
});

describe("Test function of Acl", function() {
	it("should add a new Role", function() {
		Acl.addRole("master");
	});
	it("should add a new Ressource", function() {
		Acl.addRessource("master", "media");
	});
	it("should add a new Permission", function() {
		Acl.addPermission("master", "media", "addMovie", true);
	});
	it("should check if user has permission to do something", function() {
		assert.equal(Acl.can("master", "media", "addMovie"), true);
	});
	it("should check if user has an inexisting permission", function() {
		assert.equal(Acl.can("master", "media", "onoinoihu"), false);
	});
});