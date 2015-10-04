var Acl = require("../lib/acl");
var assert = require("assert");

describe("Initialize connection to the database", function () {

	it("should connect to database", function (done) {
		Acl.init({ dbAddress: "localhost", dbName: "test", port: "27017" }, function () {
			done();
		});
	});
});

describe("First thing to do", function() {
	
	it("should load infos", function (done) {
		Acl.roles = {};
		Acl.load(function () {
			done();
		});
	});
});

describe("Test function of Acl", function () {
	it("should add a new Role", function (done) {
		Acl.addRole("master", function (err) {
			if (err) {
				console.log(err);
				done();
			} else {
				done();
			}
		});
	});
	it("should add a new Ressource", function (done) {
		Acl.addRessource("master", "mmeedia", function(err) {
			if(err)
				console.log(err);
			done();
		});
	});
	it.skip("should add a new Permission", function () {
		Acl.addPermission("master", "media", "addMovie", true);
	});
	it.skip("should check if user has permission to do something", function () {
		assert.equal(Acl.can("master", "media", "addMovie"), true);
	});
	it.skip("should check if user has an inexisting permission", function () {
		assert.equal(Acl.can("master", "media", "onoinoihu"), false);
		console.log(Acl.roles);
	});
	it.skip("should inherit work", function () {
		Acl.addRole("admin");
		Acl.inherit("admin", "master");
		assert.equal(Acl.can("admin", "media", "addMovie"), true);
	});
	it.skip("sould return master role", function () {
		Acl.getRole("master");
	});
	it.skip("should return media ressource of master", function () {
		Acl.getRessource("master", "media");
	});
	it.skip("should save infos", function (done) {
		Acl.save("", function () {
			done();
		});
	});
});