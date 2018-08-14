import * as React from 'react';
import { stateClass, stateShared } from '../src/state-decorator';
import { eventManager } from 'react-eventmanager';

type UserInfoState = {
    name: string;
}

export class UserInfo extends React.Component<any, UserInfoState> {

    state: UserInfoState = {
        name: ''
    };

    componentDidMount() {
        this.setState({ name: 'Joe' });
        eventManager.emit('userChanged', 'Joe');
    }

    render() {
        return <div>
            <span>UserInfo</span>
            <em>{this.state.name}</em>
        </div>;
    }
}
