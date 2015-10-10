# mongoDB-acl-nodejs
A very simple Acl module for NodeJS using in app memory and MongoDB

I create this module cause I was needing a very simple Acl module using MongoDB


# Function explanations

*Acl.init(options, callback)*

*options* : **Object** use to connect to your mongo database
	* dbAddress : **String**, Database address
	* port : **Int/String**, port used by database
	* dbName : **String**, Database name
*callback* : **(optional)** function called when you are connected to the database


*Acl.addRole(roleName, callback)*

*roleName* : **String**, name of the new role
*callback* : *callback* : **(optional)** function called when new role is added


*Acl.addRessource(ressourceName, callback)*

*ressourceName* : **String**, name of the new ressource
*callback* : *callback* : **(optional)** function called when new ressource is added


*Acl.addPermission(ressource, permissionName, state, callback)*

*ressource* : **String**, name of the ressource where is added new permission
*permissionName* : **String**, name of the new permission
*state* : **String**, default state of the permission
*callback* :*callback* : **(optional)** function called when new permission is added

*Acl.inherit(heir, parent, callback)*

*heir* : **String** inheriting role
*parent* : **String** role inherited from
*callback* : **(optional)** function called when role has been inherited


*Acl.getRole(roleName, callback)*

*roleName* : **String**, role wanted
*callback* : **(optional)** function called before role is returned

return role corresponding to the *roleName*


*Acl.getRessource(roleName, ressourceName, callback)*

*roleName* : **String**, role where is the wanted ressource
*ressourceName* : **String**, wanted ressource
*callback* : **(optional)** function called before role is returned

return ressource corresponding to the *ressourceName* in the *roleName*


*Acl.can(roleName, ressourceName, permissionName, callback)*

*roleName* : **String**, role where is the wanted permission
*ressourceName* : **String**, ressource where is the wanted permission
*permissionName* : **String**, wanted permission
*callback* : **(optional)** function before returning permission state or when there is an error

return state of the permission


*Acl.save(roleName, callback)*

*roleName* : **String**, name of the role you want to save. If equals to "", it saves all roles
*callback* : **(optional)** function called when role(s) is/are saved

*Acl.load(callback)*

*callback* : **(optional)** function called when all roles are retrieved from database