import { Component } from 'react';

export function State() {

    return function StateDecorator(prototype: Component<any, any>, name: string | symbol, descriptor?: PropertyDescriptor) {
        const originalConstructor = prototype.constructor;
        prototype.constructor = function() {
            debugger;
            return originalConstructor.apply(this, arguments);
        };
        const originalComponentDidMount = prototype.componentWillMount;
        let isMounted = false;
        prototype.componentWillMount = function() {
            isMounted = true;
            return originalComponentDidMount && originalComponentDidMount.apply(this, arguments);
        }

        var _value;
        Object.defineProperty(prototype, name, {
            set: function(value: any) {
                _value = value;
                if (!this.state) {
                    this.state = {};
                }
                this.state[name] = value;
                if (isMounted) {
                    this.setState({ [name]: value });
                }

            },
            get: function() {
                return _value;
            }
        })
    }
}
