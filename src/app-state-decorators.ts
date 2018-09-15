export let appState;

export function RootComponent() {

    return function(ctor: any) {

        return class extends ctor {

            constructor() {
                super(...arguments);
                appState = this.setState.bind(this);
            }
        };
    };

}

export function RootAction() {

    return function(prototype: any, name: string | symbol, descriptor?: PropertyDescriptor) {
        debugger;
    }
}

export function RootState() {

    return function(ctor: any) {

        return class extends ctor {

            appState() {
                return appState(...arguments);
            }
        };
    };
}

// export function RootState() {
//     debugger;
//     return function (prototype: any, name: string | symbol, descriptor?: PropertyDescriptor) {
//         const origFn = prototype[name];
//         prototype[name] = function() {
//             debugger;
//             this.props.appState = appState;
//             origFn.apply(this, arguments);
//         };
//     }
// }
