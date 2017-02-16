;(function () {
    'use strict';

    /* Класс нестандартных событий */
    class SpecialEvent {
        /**
         * Создает нестандартные события
         * @param {String} channel - канал события
         */
        constructor(channel) {
            this._channel = channel;
            this._propagationState = 1;
        }


        /**
         * Возвращает название канала события
         * @returns {String}
         */
        get channel() {
            return this._channel;
        }

        /**
         * Возвращает состояние распространения
         * (могут ли дальше выполнятся обработчики)
         * @returns {Number}
         */
        get propagationState() {
            return this._propagationState;
        }

        /**
         * Останавливает дальнейшее выполнение обработчиков
         */
        stopImmediatePropagation() {
            this._propagationState = 0;
        }
    }

    /* Шина событий */
    const EVENT_BUS = {
        /**
         * Выполняет канал событий
         * @param {String} channel - канал события
         */
        trigger(channel) {
            if (!EVENT_BUS.__eventList[channel]) {
                return;
            }

            let currentEvent = new SpecialEvent(channel);

            for (let i = 0; i < EVENT_BUS.__eventList[channel].length; i += 1) {
                if (currentEvent.propagationState) {
                    EVENT_BUS.__eventList[channel][i].call(this, currentEvent);
                }
            }
        },

        /**
         * Добавляет обработчик в канал событий
         * @param {String} channel - канал события
         * @param {Function} callback - обработчик
         */
        on(channel, callback) {
            if (!EVENT_BUS.__eventList[channel]) {
                EVENT_BUS.__eventList[channel] = [];
            }
            EVENT_BUS.__eventList[channel].push(callback);
        },

        /**
         * Удаляет обработчик из канала событий (или весь канал сразу)
         * @param {String} channel - канал события
         * @param {Function} callback - обработчик
         */
        off(channel, callback) {
            if (!EVENT_BUS.__eventList[channel]) {
                return;
            }
            if (callback === undefined) {
                delete EVENT_BUS.__eventList[channel];
                return;
            }

            let fnList = EVENT_BUS.__eventList[channel];

            for (let i = 0; i < fnList.length; i++) {
                if (fnList[i] === callback) {
                    fnList.splice(i--, 1);
                }
            }
        }
    };

    /* Добавляем в шину событий неперечислимый объект событий */
    Object.defineProperty(EVENT_BUS, '__eventList', {
        value: {},
        enumerable: false,
        writable: true
    })

    /**
     * Дополняет прототип свойствами другого объекта
     * @param {Object} where - в чей прототип добавляет
     * @param {Object} what - свойства какого объекта добавляет
     */
    function mixin(where, what) {
        for (let key in what) {
            if (what.hasOwnProperty(key)) {
                where.prototype[key] = what[key];
            }
        }
    }

    /* Импорт */
    let TextComponent = window.TextComponent;
    let Button = window.Button;

    /* Добавим в прототип Button методы шины событий */
    mixin(Button, EVENT_BUS);

    /* Добавим в прототип TextComponent методы шины событий */
    mixin(TextComponent, EVENT_BUS);


    let button = new Button({
        text: "click here"
    });
    document.body.append(button.getElem());

    let text = new TextComponent({
        header: "This is a text component",
        html: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur, quidem."
    });
    document.body.append(text.getElem());

    /* Обработчик для text */
    function textOnClick() {
        text.toggle();
    }

    text.on('test', textOnClick);
})();
