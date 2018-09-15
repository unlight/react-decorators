import * as React from 'react';
import { News1 } from './News1';

export class News extends React.Component<any, any> {

    render() {
        return <div>
            {this.props.greetings}, news for {this.props.user}:
            <News1 name="news1" />
        </div>;
    }
}
