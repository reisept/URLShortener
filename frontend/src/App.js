import "./App.css";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>URL Shortener</h1>

                <div className="form">
                    <label>URL to shorten: </label>
                    <input type="text" name="full_url" />

                    <div className="buttons">
                        <button>Shorten</button>
                        <button>Top100</button>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
