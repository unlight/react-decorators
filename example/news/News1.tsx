import * as React from 'react';
import { NewsA } from './NewsA';

export class News1 extends React.Component<any, any> {

    render() {
        return <div>
            this is News1
            <NewsA name="newsA" />
        </div>;
    }
}
