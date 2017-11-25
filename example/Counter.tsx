import * as React from 'react';
import { State } from './State';

type CounterProps = {
    value: number;
}

type CounterState = {
    value: number;
}

export class Counter extends React.Component<CounterProps, CounterState> {

    @State() value: number = 0;

    constructor(props: CounterProps, context) {
        super(props, context);
        // this.state = { value: props.value || 0 };
    }

    clickHandler() {
        // this.setState({ value: this.state.value + 1 });
    }

    render() {
        return <span onClick={(e) => this.clickHandler()}>
            [{this.state.value}]
        </span>;
    }
}
