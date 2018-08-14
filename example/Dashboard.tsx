import * as React from 'react';
import { WidgetA } from './WidgetA';
import { UserInfo } from './UserInfo';

type DashboardProps = {
}

type DashboardState = {
}

export class Dashboard extends React.Component<DashboardProps, DashboardState> {

    render() {
        return <div>
            {'UserInfo outer:'} <UserInfo />
            {'WidgetA outer:'} <WidgetA />
        </div>;
    }
}
