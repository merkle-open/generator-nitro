## Custom routes

If your project needs any additional or custom routes (e.g. to simulate an ajax call to an api) you can define 
them in this folder. Every file which has the .js extension will be included. 
The loader will call your file-function with the app itself as an argument. Feel free to register any routes you need. 

The following code is an example of such a data api route:
    
    function getData(req, res, next){
        return res.json({
            data: 'empty'
        });
    }

    function postData(req, res, next){
        return res.json({
            data: req.body
        });
    }

    module.exports = (app) => {
        app.route('/api/data')
            .get(getData)
            .post(postData);
    };

These routes will be loaded into Nitro automatically.
