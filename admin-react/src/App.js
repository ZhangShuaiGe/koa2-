import React, {Component} from 'react';
import './App.css';
import Router from "./router/index";
import {BrowserRouter} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Router />
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
