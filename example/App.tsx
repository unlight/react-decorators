import * as React from 'react';
// import { Counter } from './Counter';
// import { Dashboard } from './Dashboard';
import { News } from './news/News';
import { RootComponent } from '../src/app-state-decorators';

@RootComponent()
export class App extends React.Component {

    state = {
        user: 'joe',
        greetings: 'welcome',
    };

    render() {
        return <div>
            <News greetings={this.state.greetings} user={this.state.user} />
        </div>;
    }
}
