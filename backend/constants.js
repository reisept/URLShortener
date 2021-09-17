exports.root_url_port = 9999;
exports.root_url = "http://riscovirtual.com:" + this.root_url_port + "/";
exports.min_vanity_length = 4;
exports.num_of_urls_per_hour = 50;

exports.get_query = "SELECT * FROM short_urls WHERE short_url = {SHORT_URL}";
exports.add_query =
    "INSERT INTO short_urls SET short_url = {SHORT_URL}, full_url = {URL}, ip = {IP}, create_ts = now()";
exports.check_url_query = "SELECT * FROM short_urls WHERE url = {URL}";

exports.update_stats_query =
    "INSERT INTO short_urls_stats (short_url, create_ts, last_access_ts, access_count) " +
    "VALUES ({SHORT_URL}, now(), now(), 1) " +
    "ON DUPLICATE KEY UPDATE " +
    "last_access_ts = now(), access_count = access_count + 1";

exports.get_top100_query =
    "SELECT s.access_count, s.short_url, u.full_url, s.last_access_ts " +
    "FROM short_urls_stats s " +
    "JOIN short_urls u on u.short_url = s.short_url " +
    "ORDER BY access_count DESC LIMIT 100";

exports.host = "localhost";
exports.user = "url_shortener";
exports.password = "url_shortener";
exports.database = "url_shortener";
