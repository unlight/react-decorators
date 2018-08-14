interface Constructor {
    new(...args: any[]): any;
}

export function stateClass<T extends Constructor>(getType: () => T, getState: (state: InstanceType<T>['state']) => any = s => s) {
    return function <C extends Constructor>(target: C) {
        return class extends target {

            componentDidMount(): void {
                // for (const eventName in mapping) {
                //     self.on(eventName, this[mapping[eventName]].bind(this));
                // }

                if (super['componentDidMount'] !== undefined) {
                    super['componentDidMount'].apply(this, arguments);
                }
            }

            componentWillUnmount(): void {
                // for (const eventName in mapping) {
                //     self.off(eventName, this[mapping[eventName]].bind(this));
                // }

                if (super['componentWillUnmount'] !== undefined) {
                    super['componentWillUnmount'].apply(this, arguments);
                }
            }
        };
    };
}

const shouldShare = new WeakMap();
const instances = new WeakMap<any, any>();

export function stateShared(otherProp: string, getType: Function, getState: Function) {

    return function(target: any) {

        if (getType) {
            shouldShare.set(getType(), [otherProp, getState, target]);
        }

        const setState = target.prototype.setState;
        const componentDidMount = target.prototype.componentDidMount;

        target.prototype.componentDidMount = function() {
            if (!instances.has(this.constructor)) {
                instances.set(this.constructor, this);
            }
            if (componentDidMount) {
                componentDidMount.apply(this, arguments);
            }
        };

        target.prototype.setState = function() {
            if (setState) {
                setState.apply(this, arguments);
            }
            const otherComp = shouldShare.get(this.constructor);
            if (otherComp) {
                const [prop, gs, tg] = otherComp;
                const otherCompInstance = instances.get(tg);

                // otherCompInstance[prop]({ ...this.state });
                // otherCompInstance.setState({ [prop]: this.state });
            }

            // if (otherProp && getType) {
            //     const otherComp = instances.get(getType());
            // }
        };
    };
}

// const senders = new WeakMap();

// export function stateProperty(getType: Function, getState: Function) {
//     return function(target: any, key: string) {
//         console.log("stateProperty", target);
//         senders.set(getType().prototype, getState);
//         // property value
//         var _val;

//         // property getter
//         var getter = function() {
//             console.log(`Get: ${key} => ${_val}`);
//             return _val;
//         };

//         // property setter
//         var setter = function(newVal) {
//             console.log(`Set: ${key} => ${newVal}`);
//             _val = newVal;
//         };

//         // Create new property with getter and setter
//         Object.defineProperty(target, key, {
//             get: getter,
//             set: setter,
//             enumerable: true,
//             configurable: true
//         });
//     };
// }

