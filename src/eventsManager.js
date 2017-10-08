import { minify } from './utils/utils.js';

class Event {
    
    constructor ({ type, ublId = 'document', target, targetHTML,
                 timeStamp, additionalData }) {
        this._type = type;
        this._ublId = ublId;
        this._target = target;
        this._targetHTML = targetHTML;
        this._timeStamp = timeStamp.toFixed(4);
        this._data = additionalData;

        this._id = `${this._ublId}-${this._timeStamp}`
    }

    toSend (customPrefix = 'ubl') {
        const toSend = {
            path: document.location.pathname,
            type: this._type,
            target: this._target,
            targetHTML: this._targetHTML,
            timeStamp: this._timeStamp,
            data: this._data
        }
        toSend[`${customPrefix}Id`] = this._ublId;

        return toSend;
    }

    get id () { return this._id; }
    get ublId () { return this._ublId; }

    //get type () { return this._type; }

    //get target () { return this._target; }

    //get targetHTML () { return this._targetHTML; }

    //get timeStamp () { return this._timeStamp; }

    //get data () { return this._data; }
}

export default class EventsManager {

    constructor (customPrefix) {
        this._customPrefix = customPrefix;
        this._initTime = Date.now();
        this._events = [];
        this._processedEvents = [];
    }

    eventsToSend () {
        // Clear the array
        this._processedEvents.length = 0;

        if (this._events.length) {
            // Reduce group events by ublId
            const eventsToSend = this._events.reduce((result, item) => {
                const itemToSend = item.toSend(this._customPrefix);

                result[item.ublId] ? result[item.ublId].push(itemToSend)
                                   : result[item.ublId] = [itemToSend]

                return result;
            }, {});

            // Mark current events as processed
            this._processedEvents = [...this._events];

            return eventsToSend;
        }
    }

    storeEvent (ublId, event, additionalData) {
        if (!event.isTrusted) {
            return;
        }

        const target = event.target;
        let targetStr = '';
        let targetHTML = '';

        if (target === document) {
            targetStr = '#document';
            targetHTML = document.documentElement.outerHTML;
        } else if (target === window) {
            targetStr = 'Window';
            targetHTML = null;
        } else {
            targetStr += target.localName;
            targetStr += target.id ? `#${target.id}` : '';
            if (target.classList && target.classList.toString()) {
                targetStr += `.${target.classList.toString().replace(' ', '.')}`
            }

            targetHTML = target.outerHTML;
        }

        const eventInfo = new Event({
            type: event.type,
            ublId,
            target: targetStr,
            targetHTML: minify(targetHTML),
            timeStamp: event.timeStamp || (Date.now() - this._initTime),
            additionalData
        });
        this._events.push(eventInfo)

        console.log('Fired event: ', eventInfo);
    }

    clearProcessed () {
        this._events = this._events.filter( (event) => {
            const found = this._processedEvents.find((item) => {
                return item.id === event.id;
            });

            return ( found === void 0); // Compare against undefined
        });
    }
}
