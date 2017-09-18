
// checks if user is logged in then sends them to dashboard

function loggedIn(req, res, next){
	
	if(req.session && req.session.userId){
		return res.redirect('/dashboard');
	}

	next();

}

function requiresLogin(req, res, next){

	if(req.session && req.session.userId){
		return next();
	}else{
		res.status(401);
		return res.redirect('/');
	}

}

function requiresLoginJSON(req, res, next){

	if(req.session && req.session.userId){
		return next();
	}else{
		res.status(401);
		return res.send({error: 'Not logged In'});
	}

}

// function requiresPermission(req, res, next){

// 	console.log('perm ', permission);
// 	return next();

// }

module.exports.loggedIn = loggedIn;
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLoginJSON = requiresLoginJSON;
// module.exports.requiresPermission = requiresPermission;