import * as React from 'react';
import { State } from '../src/State';
import { Component } from '../src/Component';

type CounterProps = {
    value?: number;
}

type CounterState = {
    value: number;
}

@Component()
export class Counter extends React.Component<CounterProps, CounterState> {

    @State() value: number = 0;

    constructor(props: CounterProps, context) {
        super(props, context);
    }

    clickHandler() {
        this.value = this.value + 1;
        // this.setState({ value: this.state.value + 1 });
    }

    render() {
        return <span onClick={(e) => this.clickHandler()}>
            [{this.value}]
            [{this.state && this.state.value}]
        </span>;
    }
}
