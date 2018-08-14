import * as React from 'react';
import { stateClass, stateProperty, stateShared } from '../src/state-decorator';
import { UserInfo } from './UserInfo';
import { eventManager } from 'react-eventmanager';

// @stateShared('userInfo', () => UserInfo, s => s.name)
@eventManager.subscription({
    userChanged: 'onUserChanged'
})
export class WidgetA extends React.Component<any, any> {

    state = {
        name: 'WidgetA',
        userInfo: null
    }

    onUserChanged(userName) {
        this.setState({
            userInfo: userName
        });
    }

    render() {
        return <div>
            <span>{this.state.name}</span>
            <strong>{this.state.userInfo}</strong>
        </div>;
    }
}
