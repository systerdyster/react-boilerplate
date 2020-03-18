import React, { Component } from 'react';

type AppState = {};

export class App extends Component <{}, AppState> {
    public render() {
        return (
            <div>
                <h1>Jello World!</h1>
            </div>
        );
    }
}