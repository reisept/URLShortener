exports.root_url_port = 3500;
exports.root_url = "http://localhost:" + root_url_port + "/";
exports.min_vanity_length = 4;
exports.num_of_urls_per_hour = 50;

exports.get_query = "SELECT * FROM short_urls WHERE short_url = {SEGMENT}";
exports.add_query =
  "INSERT INTO short_urls SET short_url = {SEGMENT}, full_url = {URL}, ip = {IP}, create_ts = now()";
exports.check_url_query = "SELECT * FROM short_urls WHERE url = {URL}";

exports.update_views_query =
  "UPDATE urls SET num_of_clicks = {VIEWS} WHERE id = {ID}";
exports.insert_view =
  "INSERT INTO stats SET ip = {IP}, url_id = {URL_ID}, referer = {REFERER}";
exports.check_ip_query =
  "SELECT COUNT(id) as counted FROM urls WHERE datetime_added >= now() - INTERVAL 1 HOUR AND ip = {IP}";

exports.host = "localhost";
exports.user = "url_shortener";
exports.password = "url_shortener";
exports.database = "url_shortener";
