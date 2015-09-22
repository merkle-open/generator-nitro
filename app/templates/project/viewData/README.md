## Dynamic view data

If you want to use dynamic view data (i.e. from a database), you can define those routes in here. Like the "routes" folder, any file will be used, as long as it is a javascript file. You can add data to the "res.locals" property which will be synchronized later with the *.json data files from the _data folders. This data supersede the data from the json files.

The following code is an example of such a view data route:
```javascript
function getUser(req, res, next){
    database.getUser()
        .then(function(user){
            res.locals.user = user;
            next();
        });
}

exports = module.exports = function(app){
    app.route('/')
        .get(getUser);
};
```

Now the index view `/` can use the user profile for rendering user specific content.
