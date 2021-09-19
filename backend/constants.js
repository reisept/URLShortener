exports.root_url_port = 9999;
exports.root_url = "http://localhost:" + this.root_url_port + "/";
exports.min_vanity_length = 4;
exports.num_of_urls_per_hour = 50;

exports.exists_query = "SELECT short_url FROM short_urls WHERE full_url ={FULL_URL}";

exports.get_query = "SELECT * FROM short_urls WHERE short_url = {SHORT_URL}";

exports.add_query =
    "INSERT INTO short_urls (full_url, short_url, create_ip, create_ts, last_access_ts, access_count) " +
    "VALUES ({FULL_URL}, {SHORT_URL}, {IP}, now(), now(), 1) ";

exports.add_update_query =
    "INSERT INTO short_urls (full_url, short_url, create_ip, create_ts, last_access_ts, access_count) " +
    "VALUES ({FULL_URL}, {SHORT_URL}, {IP}, now(), now(), 1) " +
    "ON DUPLICATE KEY UPDATE " +
    "last_access_ts = now(), access_count = access_count + 1";

exports.update_query = "UPDATE short_urls SET access_count = access_count + 1 WHERE short_url = {SHORT_URL}";

exports.get_top100_query =
    "SELECT full_url 'Full URL', concat('"+this.root_url+"',short_url) 'Short URL', last_access_ts 'Last Used', access_count 'Times Used'" +
    "FROM short_urls " +
    "ORDER BY access_count DESC LIMIT 100";

exports.host = "localhost";
exports.user = "url_shortener";
exports.password = "url_shortener";
exports.database = "url_shortener";
