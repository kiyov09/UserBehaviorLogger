import HttpHelper from './utils/httpHelper.js';
import domHelper from './utils/domHelper.js';
import EventsManager  from './eventsManager.js';

const $ = domHelper;

// Events to use when the `prefix`-on attr is empty
const DEFAUL_EVENTS = {        
    input: 'focus blur change copy cut paste',
    textarea: 'focus blur change copy cut paste',
    select: 'focus blur change',
    a: 'click',
    button: 'click',
    form: 'submit invalid copy cut paste'
};

// Defaul options
const DEFAULT_OPTIONS = {
    // Prefix used in lib attrs
    prefix: 'ubl',

    // Interval to send events to BK
    intervalTime: 5000,

    // Endpoint to which send the events
    endpoint: 'user_behavior',

    // Log referrer page
    referrer: true,

    // Log hashchange events
    hashChange: true,

    // Log copy, cut and paste captured at document level
    copyOnDocument: true,
    cutOnDocument: true,
    pasteOnDocument: true,

    // Log document scroll
    scrollOnDocument: true,

    // Log all remaining events before user leave
    beforeUnload: true
};

class UserBehaviorLogger {

    constructor() {
        this._wasInit = false;
        this._maxScrollPercentage = 0;
        this._scrollTimer = null;
    }

    init (options) {
        if (this._wasInit) {
            throw new Error('Library can\'t be initialized twice.');
        }

        if (options && typeof options !== 'object') {
            throw new Error('Library options should be an object.');
        }

        this._setOptions(options);
        this._start();

        this._wasInit = true;
    }

    _setOptions (options) {
        const defaultOptions = Object.assign({}, DEFAULT_OPTIONS); // Clone DEFAULT_OPTIONS
        this._options = Object.assign(defaultOptions, options);

        if (!this._options.prefix) {
            this._options.prefix = DEFAULT_OPTIONS.prefix;
        }

        if (!parseInt(this._options.intervalTime)) {
            this._options.intervalTime = DEFAULT_OPTIONS.intervalTime;
        }

        if (this._http) delete this._http;
        if (this._eventsManager) delete this._eventsManager;

        this._http = new HttpHelper(this._options.endpoint);
        this._eventsManager = new EventsManager(this._options.prefix);
    }

    _start () {
        if (this._options.referrer) {
            this._eventsManager.storeEvent('document', {
                    isTrusted: true,
                    type: 'referrer',
                    target: document
                }, 
                { referrer: document.referrer }
            );
        }

        this._initializeListeners();
        this._startTimer();
    }

    _initializeListeners () {
        const { prefix } = this._options;

        const elements = $(`[${prefix}-id]`);

        elements.each((elem) => {

            const tagName = elem.tagName.toLowerCase();
            let events = $(elem).attr(`${prefix}-on`);

            if (!events) {
                events = DEFAUL_EVENTS[tagName] || null;
            }

            if (events) {
                $(elem).on(events, (event) => {
                    let data = null;

                    switch (event.type) {
                        case 'copy':
                        case 'cut':
                            event.stopPropagation();
                            data = {copiedData: document.getSelection().toString()};
                            break;
                        case 'paste':
                            event.stopPropagation();
                            data = {copiedData: (event.clipboardData || window.clipboardData).getData('Text')};
                            break;
                        case 'change':
                        case 'input':
                        case 'keyup':
                        case 'keydown':
                        case 'keypress':
                            data = {value: event.target.value};
                            break;
                        default:
                            break;
                    }

                    this._storeEventData(event, data);
                });
            }
        });

        if (this._options.scrollOnDocument) {
            $(document).scroll( (event) => {
                if (this._scrollTimer) {
                    clearTimeout(this._scrollTimer);
                    this._scrollTimer = null;
                }
                this._scrollTimer = setTimeout( () => {
                    let target = event.target;
                    if (event.target === document) {
                        target = target.documentElement;
                    }
                    const scrollPercentage = 
                        (target.scrollTop + document.body.scrollTop) / (target.scrollHeight - target.clientHeight) * 100;

                    if (scrollPercentage > this._maxScrollPercentage) {
                        this._maxScrollPercentage = Math.round(scrollPercentage * 100) / 100;
                        this._storeEventData(event, {percentage: this._maxScrollPercentage});
                    }
                }, 500);
            });
        }

        if (this._options.beforeUnload) {
            window.addEventListener('beforeunload', (event) => {
                this._storeEventData(event);
                this._sendEventsBeforeUnload();
            });
        }

        if (this._options.hashChange) {
            window.addEventListener('hashchange', (event) => {
                const data = {
                    oldURL: event.oldURL,
                    newURL: event.newURL
                }
                this._storeEventData(event, data);
            });
        }

        if (this._options.copyOnDocument) {
            document.addEventListener('copy', (event) => {
                const data = document.getSelection().toString();
                this._storeEventData(event, {copiedData: data});
            });
        }

        if (this._options.cutOnDocument) {
            document.addEventListener('cut', (event) => {
                const data = document.getSelection().toString();
                this._storeEventData(event, {cuttedData: data});
            });
        }
        
        if (this._options.pasteOnDocument) {
            document.addEventListener('paste', (event) => {
                const clipboardData = event.clipboardData || window.clipboardData;
                const data = clipboardData.getData('Text');

                this._storeEventData(event, {pastedData: data});
            });
        }
    }

    _storeEventData (event, additionalData = null) {
        const { prefix } = this._options;
        const elem = event.currentTarget || event.target;

        let ublId = (elem === document || elem === window) ? { value: elem === document ? 'document' : 'window' } 
                                                           : elem.attributes[`${prefix}-id`];

        if (ublId) {
            this._eventsManager.storeEvent(ublId.value, event, additionalData);
        }
    }

    _startTimer () {
        const { intervalTime } = this._options;

        setInterval( () => {
            this._sendEvents();
        }, intervalTime);
    }

    _sendEvents () {
        const eventsToSend = this._eventsManager.eventsToSend();

        if (eventsToSend) {
            return this._http.postData(eventsToSend)
                .then( () => { 
                    this._eventsManager.clearProcessed();
                })
                .catch( (error) => {
                    console.log(error);
                });
        }
    }

    _sendEventsBeforeUnload () {
        const eventsToSend = this._eventsManager.eventsToSend();
        if (eventsToSend) {
            this._http.postDataSync(eventsToSend);
        }
    }
}

export default UserBehaviorLogger;
