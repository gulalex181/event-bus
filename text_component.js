;(function () {
    'use strict';

    class TextComponent {
        constructor(options) {
            this._elem = null;
            this._header = options.header;
            this._html = options.html;
        }

        _render(header, html) {
            this._elem = document.createElement('div');
            this._elem.className = 'text-comp';
            this._elem.hidden = true;

            let h2 = document.createElement('h2');
            h2.textContent = header;

            let p = document.createElement('p');
            p.innerHTML = html;

            this._elem.append(h2);
            this._elem.append(p);
        }

        getElem() {
            if (!this._elem) this._render(this._header, this._html);
            return this._elem;
        }

        toggle() {
            this._elem.hidden = !this._elem.hidden;
        }
    }

    // export
    window.TextComponent = TextComponent;

})();
