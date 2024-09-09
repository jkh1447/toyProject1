const {User} = require('../models/User');

let auth = (req, res, next) => {
    let token = req.cookies.x_auth;
    console.log("auth activate");
    if(!token) {
        return res.status(401).json({isAuth : false, error : 'No token'});
    }

    User.findByToken(token, (err, user) => {
        console.log(`user : ${user}`);
        console.log(`err : ${err}`);
        if (err) { console.log("err"); throw err;}
        if (!user) {
            console.log("user is null");
            return res.status(401).json({ isAuth: false, error: 'User not found' });
        }

        console.log("auth");
        req.token = token;
        req.user = user;
        
        next();
    });
};

module.exports = {auth};