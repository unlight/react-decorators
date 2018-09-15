import * as React from 'react';
import { RootAction, RootState } from '../../src/app-state-decorators';

@RootState()
export class NewsA extends React.Component<any, any> {

    render() {
        return <div>
            I am NewsA!
            <p><button onClick={() => this.props.appState({})}>appState empty</button></p>
            <p><button onClick={() => this.greetingsHello()}>greetings hello</button></p>
        </div>;
    }

    greetingsHello() {
        this.appState({greetings: 'hello'});
    }
}
