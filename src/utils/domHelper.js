
const domHelper = (selector, context = document) => {
    let elements = null;

    if (selector.DOCUMENT_NODE) {
        elements = [selector];
    } else {
        elements = Array.from(context.querySelectorAll(selector));
    }

    return {
        elements,

        each (fun) {
            elements.forEach(fun);
            return this;
        },

        attr (attr, val) {
            if (!val) {
                const attrInfo = this.elements[0].attributes[attr];
                return attrInfo ? attrInfo.value : null;
            }

            this.elements.forEach( (element) => {
                element.attributes[attr].value = val;
            });

            return this;
        },

        on (events, handler) {
            this.elements.forEach( (element) => {
                events.split(' ').forEach( (event) => {
                    element.addEventListener(event, handler, true);
                });
            });
            return this;
        },

        click (handler) {
            return this.on('click', handler);
        },

        scroll (handler) {
            return this.on('scroll', handler);
        }

    }
};

export default domHelper;
