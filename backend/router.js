var logic = require("./logic");

var route = function (app) {
    
    //Create short url and save to DB
    app.post("/addUrl", function (request, response) {
        var url = request.param("url");
        var vanity = request.param("vanity");

        logic.addUrl(request, response, url, vanity);
    });

    // Get Top 100 shortURls used
    app.get("/getTop100", function (request, response) {
        logic.getTop100(request, response);
    });

    // redirected short url to full url
    app.get("/:short_url", function (request, response) {
        logic.getUrl(request, response, request.params.short_url);
    });
};

exports.route = route;
