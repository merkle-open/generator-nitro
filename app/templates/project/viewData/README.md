## Dynamic view data

If you want to use dynamic view data (i.e. from a database), you can define those routes in here. Like the "routes" folder, any file will be used, as long as it is a javascript file. You can add data to the "res.local" property which will be synchronized later with the *.json data files from the _data folders. The data you entered here priorizes the json files. 

The following code is an example of such a view data route:
```javascript
function getUser(req, res, next){
    database.getUser()
        .then(function(user){
            res.locals = {
                user: user
            };
            next();
        });
}

exports = module.exports = function(app){
    app.route('/')
        .get(getUser);
};
```

Now the called index.html view can use the userprofile for rendering userspecific content.
