## Dynamic view data

If you want to use dynamic view data (i.e. using data from a database or data which is available in different views), 
you can define those routes in here. 
Like the `project/routes` directory, any file will be used, as long as it is a javascript file. 
You can add data to the `res.locals` property which will be merged later with the pattern and request data. 

The following code is an example of such a view data route:

    function getUser(req, res, next) {
       res.locals.user = {name: "my name", email: "me@test.com"};
       next();
    }
    
    module.exports = (app) => {
        app.route('/')
            .get(getUser);
    };

Now the called root view (or any pattern used within) can use the user properties for rendering userspecific content.
