;(function () {
    'use strict';

    class Button {
        constructor(options) {
            this._elem = null;
            this._text = options.text || 'button';
            this._initEvents();
        }

        _initEvents() {
            if (!this._elem) this._render(this._text);
            this._elem.addEventListener('click', this._onClick.bind(this));
            this._elem.addEventListener('mousedown', this._onMousedown.bind(this));
        }

        _onClick(event) {
            event.preventDefault();
            this.trigger('test');
        }

        _onMousedown(event) {
            event.preventDefault();
        }

        _render(text) {
            this._elem = document.createElement('div');
            this._elem.className = 'button';
            this._elem.textContent = text;
        }

        getElem() {
            return this._elem;
        }
    }

    // export
    window.Button = Button;

})();
