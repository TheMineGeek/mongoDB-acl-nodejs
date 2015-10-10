var Acl = require("../lib/acl");
var assert = require("assert");

describe("Initialize connection to the database", function () {

	it("should connect to database", function (done) {
		Acl.init({ dbAddress: "localhost", dbName: "test", port: "27017" }, function () {
			done();
		});
	});
});

describe("First thing to do", function () {

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
		Acl.addRessource("media", function (err) {
			if (err) {
				console.log(err);
			}
			done();
		});
	});

	it("should add a new Permission", function (done) {
		Acl.addPermission("media", "addMovies", true, function (err) {
			if (err)
				console.log(err);
			done();
		});
	});

	it("should check if user has permission to do something", function (done) {
		assert.equal(Acl.can("master", "media", "addMovie", function (err) {
			if (err)
				console.log(err);
			done();
		}), true);
	});

	it("should check if user has an inexisting permission", function (done) {
		assert.notEqual(Acl.can("master", "media", "onoinoihu", function (err) {
			if (err)
				console.log(err)
			done();
		}), false);
	});

	it("should inherit work", function (done) {
		Acl.addRole("admin");
		Acl.inherit("admin", "master", function(err) {
			if(err)
				console.log(err);
			done();
		});
		assert.equal(Acl.can("admin", "media", "addMovie"), true);
	});
	
	it("sould return master role", function () {
		Acl.getRole("master");
	});
	
	it("should return media ressource of master", function () {
		Acl.getRessource("master", "media");
	});
	
	it("should save infos", function (done) {
		Acl.save("", function () {
			done();
		});
	});
});