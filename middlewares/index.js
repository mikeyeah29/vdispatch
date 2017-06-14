
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
		return res.redirect('/');
	}

}

// function requiresPermission(req, res, next){

// 	console.log('perm ', permission);
// 	return next();

// }

module.exports.loggedIn = loggedIn;
module.exports.requiresLogin = requiresLogin;
// module.exports.requiresPermission = requiresPermission;