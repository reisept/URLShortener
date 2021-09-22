import React from "react";
import "./App.css";
import Axios from "axios";
import { JsonToTable } from "react-json-to-table";

function App() {
    const [url, setUrl] = React.useState("");
    const [showTop100, setshowTop100] = React.useState(false);
    const [top100List, setTop100List] = React.useState([]);
    const [showShortURL, setshowShortURL] = React.useState(false);
    const [shortURLLink, setshortURLLink] = React.useState("");

    const addUrl = () => {
        if (url === "") {
            alert("URL can't be empty.");
            return;
        }

        Axios.post("https://reisept-url-shortener.herokuapp.com/addUrl", { url: url, vanity: "" })
            .then((response) => {
                //console.log("post status code:", response.status);
                //console.log("server status code:", response.data.statusCode);
                //console.log("server short url", response.data.url);
                setshortURLLink(response.data.url);
                setshowShortURL(true);
                setshowTop100(false);
            })
            .catch((error) => {
                console.error({ error });
            });
    };

    const getTop100 = () => {
        Axios.get("https://reisept-url-shortener.herokuapp.com/getTop100")
            .then((response) => {
                //console.log("get status code:", response.status);
                //console.log("server data:", response.data);

                setshowShortURL(false);
                setTop100List(response.data);
                setshowTop100(true);
            })
            .catch((error) => {
                console.error({ error });
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>URL Shortener</h1>

                <div className="form">
                    <label>URL to shorten: </label>
                    <input
                        type="text"
                        name="full_url"
                        onChange={(e) => {
                            setUrl(e.target.value);
                        }}
                    />

                    <div className="buttons">
                        <button onClick={addUrl}>Shorten</button>&nbsp;
                        <button onClick={getTop100}>Top100</button>
                    </div>

                    <div id="shorturl" className="search-results">
                        <a href={showShortURL ? shortURLLink : null} rel="noreferrer" target="_blank">
                            {showShortURL ? shortURLLink : null}
                        </a>
                    </div>

                    <div id="shorturl" className="search-results">
                        {showTop100 ? <JsonToTable json={top100List} /> : null}
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
