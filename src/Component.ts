export function Component() {

    return function ComponentDecorator(prototype: any, name: string | symbol, descriptor?: PropertyDescriptor) {
        const ctor = prototype.constructor;
        prototype.constructor = function() {
            debugger;
            return ctor.apply(this, arguments);
        }
    }
}
