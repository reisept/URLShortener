import React from "react";
import "./App.css";
import Axios from "axios";
import { JsonToTable } from "react-json-to-table";

function App() {
    const [url, setUrl] = React.useState("");
    const [top100List, setTop100List] = React.useState([]);

    /*
    React.useEffect(() => {
        Axios.get("http://localhost:9999/getTop100")
            .then((response) => {
                console.log("get status code:", response.status);
                console.log("server data:", response.data);
            })
            .catch((error) => {
                console.error({ error });
            });
    });
*/
    const addUrl = () => {
        if (url === "") {
            alert("URL can't be empty.");
            return;
        }

        Axios.post("http://localhost:9999/addUrl", { url: url, vanity: "" })
            .then((response) => {
                console.log("post status code:", response.status);
                console.log("server status code:", response.data.statusCode);
                console.log("server short url", response.data.url);
            })
            .catch((error) => {
                console.error({ error });
            });
    };

    const getTop100 = () => {
        Axios.get("http://localhost:9999/getTop100")
            .then((response) => {
                console.log("get status code:", response.status);
                console.log("server data:", response.data);
                setTop100List(response.data);
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

                    <JsonToTable json={top100List} />
                    
                </div>
            </header>
        </div>
    );
}

export default App;
