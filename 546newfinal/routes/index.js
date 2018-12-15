const homeRoutes = require("./home");
const userRoutes = require('./login');
const registerRoutes = require('./register');

const constructorMethod = app => {
    app.use("/", userRoutes);
    app.use("/", registerRoutes);

    app.get('/logout', function(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
                if(err) {
                    return next(err);
                } else {
                    res.clearCookie("AuthCookie");
                    return res.redirect('/');
                }
            });
        }
    });

    app.use("/home", (req, res, next) => {
        if(!req.cookies.AuthCookie || !req.session.user){
            res.clearCookie("AuthCookie");
            res.redirect('/login');
        } else{    
            next();
        }
        return;
    });

    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });

    app.use("/", homeRoutes);
    
    app.use("*", (req, res) => {
        res.render("main/login", null);
  });
};


module.exports = constructorMethod;
