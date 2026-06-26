/**
 * Copyright (c) 2015-2023 Institut National de l'Audiovisuel, INA
 *
 * This file is part of amalia.js
 *
 * Amalia.js is free software: you can redistribute it and/or modify it under
 * the terms of the MIT License
 *
 * Redistributions of source code, javascript and css minified versions must
 * retain the above copyright notice, this list of conditions and the following
 * disclaimer
 *
 * Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission
 *
 * You should have received a copy of the MIT License along with
 * amalia.js. If not, see <https://opensource.org/license/mit/>
 *
 * Amalia.js is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE.
 */
/**
 * Captions (subtitles) toggle button for the control bar. Shows / hides the
 * captions plugin overlay without unloading it.
 * @class CaptionsButton
 * @namespace fr.ina.amalia.player.plugins.controlBar.widgets
 * @module player
 * @submodule player-controlbar
 * @extends fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase
 */
fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase.extend("fr.ina.amalia.player.plugins.controlBar.widgets.CaptionsButton", {
        classCss: "player-captions-button",
        classCssIcon: "ajs-cc-label"
    },
    {
        /**
         * Current visibility state of the captions overlay.
         * @property captionsVisible
         * @default true
         */
        captionsVisible: true,
        /**
         * Initialize the component
         * @method initialize
         */
        initialize: function () {
            // `defaultState: false` starts with captions hidden.
            this.captionsVisible = !(this.parameter && this.parameter.defaultState === false);

            this.component = $('<div>', {
                class: this.Class.classCss
            });
            var icon = $('<span>', {
                class: this.Class.classCssIcon,
                title: (this.parameter && this.parameter.title) ? this.parameter.title : 'Subtitles',
                text: 'CC'
            });
            this.component.append(icon);

            this.component.on('click', {
                self: this
            }, this.onClick);
            this.container.append(this.component);

            this.applyState();
            if (this.logger !== null) {
                this.logger.trace(this.Class.fullName, "initialize");
            }
        },
        /**
         * Apply the current state via CSS classes (styled in the project
         * stylesheet). Toggling a class on the player container hides the
         * captions overlay with `visibility`, which the captions plugin — that
         * keeps switching `display` on every time change — never overrides.
         * @method applyState
         */
        applyState: function () {
            var hidden = !this.captionsVisible;
            this.mediaPlayer.getContainer().toggleClass('ajs-captions-off', hidden);
            this.component.toggleClass('off', hidden);
        },
        /**
         * On click, toggle the captions overlay.
         * @method onClick
         * @param {Object} event
         */
        onClick: function (event) {
            var self = event.data.self;
            self.captionsVisible = !self.captionsVisible;
            self.applyState();
        }
    });
