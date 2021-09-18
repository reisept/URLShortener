var mysql = require("mysql");
var req = require("request");
var cons = require("./constants");
var crypto = require("crypto");

var pool = mysql.createPool({
    host: cons.host,
    user: cons.user,
    password: cons.password,
    database: cons.database,
});

function generateHash(onSuccess, onError, retryCount, url, request, response, con, vanity) {
    var hash = "";

    if (vanity) {
        hash = vanity;
        var reg = /[^A-Za-z0-9-_]/;

        //If the hash contains invalid characters or is equal to other methods, an error will be thrown
        if (reg.test(hash) || hash == "add" || hash == "getTop100") {
            onError(response, request, con, 403);
            return;
        }
        if (hash.length > 15) {
            onError(response, request, con, 405);
            return;
        } else if (cons.min_vanity_length > 0 && hash.length < cons.min_vanity_length) {
            onError(response, request, con, 407);
            return;
        }
    } else {
        //This section creates a string for a short URL on basis of an SHA1 hash
        var shasum = crypto.createHash("sha1");
        shasum.update(new Date().getTime() + "");
        hash = shasum.digest("hex").substring(0, 8);
    }

    //test if the short URL already exists, it will repeat the generateHash function until a short url is generated which does not exist in the database
    con.query(cons.get_query.replace("{SHORT_URL}", con.escape(hash)), function (err, rows) {
        if (err) {
            console.log(err);
        }

        // not found so its ok to continue
        if (rows != undefined && rows.length == 0) {
            onSuccess(hash, url, request, response, con);
        } else {
            // already exists generate again
            if (retryCount > 1 && !vanity) {
                generateHash(onSuccess, onError, retryCount - 1, url, request, response, con);
            } else {
                onError(response, request, con, 400);
            }
        }
    });
}

//sends a error message back to the client
function hashError(response, request, con, code) {
    response.send(urlResult(null, false, code));
}

//Insert in the database the created short url
function handleHash(hash, url, request, response, con) {
    con.query(
        cons.add_query
            .replace("{URL}", con.escape(url))
            .replace("{SHORT_URL}", con.escape(hash))
            .replace("{IP}", con.escape(getIP(request))),
        function (err, rows) {
            if (err) {
                console.log(err);
            }
        }
    );

    response.send(urlResult(hash, true, 100));
}

//This function returns the object that will be sent to the client
function urlResult(hash, result, statusCode) {
    return {
        url: hash != null ? cons.root_url + hash : null,
        result: result,
        statusCode: statusCode,
    };
}

//This method redirects to that URL if it exists
var getUrl = function (request, response, short_url) {
    pool.getConnection(function (err, con) {
        // check for errors in getting the connection
        if (err) {
            console.log(err);
            return;
        }
        con.query(cons.get_query.replace("{SHORT_URL}", con.escape(short_url)), function (err, rows) {
            var result = rows;
            if (!err && rows.length > 0) {
                // save stats
                con.query(cons.update_stats_query.replace("{SHORT_URL}", con.escape(short_url)), function (err, rows) {
                    if (err) {
                        console.log(err);
                    }
                });
                response.redirect(result[0].full_url);
            } else {
                response.send(urlResult(null, false, 404));
            }
            if (err) {
                console.log(err);
            }
        });
        con.release();
    });
};

//This function adds attempts to add an URL to the database.
var addUrl = function (request, response, url, vanity) {
    pool.getConnection(function (err, con) {
        // check for errors in getting the connection
        if (err) {
            console.log(err);
            return;
        }

        if (url) {
            url = decodeURIComponent(url).toLowerCase();

            // check to see if there is the protocol or just the domain
            if (url.substring(0, 4) != "http") {
                url = "http://" + url;
            }

            req(url, function (err, res, body) {
                if (res != undefined && res.statusCode == 200) {
                    generateHash(handleHash, hashError, 50, url, request, response, con, vanity);
                } else {
                    response.send(urlResult(null, false, 401));
                }
            });
        } else {
            response.send(urlResult(null, false, 402));
        }
        con.release();
    });
};

//This function adds attempts to add an URL to the database.
var getTop100 = function (request, response) {
    pool.getConnection(function (err, con) {
        con.query(cons.get_top100_query, function (err, rows) {
            if (err || rows.length == 0) {
                response.send({ result: false, url: null });
            } else {
                /*
                response.send({
                    result: true,
                    short_url: rows[0].short_url,
                    full_url: full_url,
                    clicks: rows[0].access_count,
                });
                */
                response.send(rows);
            }
        });
        con.release();
    });
};

//This function returns the correct IP address. Node.js apps normally run behind a proxy, so the remoteAddress will be equal to the proxy. A proxy sends a header "X-Forwarded-For", so if this header is set, this IP address will be used.
function getIP(request) {
    return request.header("x-forwarded-for") || request.connection.remoteAddress;
}

exports.getUrl = getUrl;
exports.addUrl = addUrl;
exports.getTop100 = getTop100;
