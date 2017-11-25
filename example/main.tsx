import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);

// Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./app/App', () => {
        const { App } = require('./app/App');
        ReactDOM.render(<App />, document.getElementById('app'));
    });
}
