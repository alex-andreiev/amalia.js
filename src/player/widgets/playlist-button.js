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
 * Playlist previous / next button for the control bar. Direction is set via the
 * `direction` parameter ('prev' or 'next'). On click it triggers an
 * `ajs:playlist:prev` / `ajs:playlist:next` event on the player container, which
 * the host page handles to switch the source.
 * @class PlaylistButton
 * @namespace fr.ina.amalia.player.plugins.controlBar.widgets
 * @module player
 * @submodule player-controlbar
 * @extends fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase
 */
fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase.extend("fr.ina.amalia.player.plugins.controlBar.widgets.PlaylistButton", {
        classCss: "player-playlist-button",
        // Stroke-based outline icons so they match the other (outline) buttons.
        svgPrev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="6" y1="5" x2="6" y2="19"></line></svg>',
        svgNext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="18" y1="5" x2="18" y2="19"></line></svg>'
    },
    {
        /**
         * Direction of this button: 'prev' or 'next'.
         * @property direction
         * @default 'next'
         */
        direction: 'next',
        /**
         * Initialize the component
         * @method initialize
         */
        initialize: function () {
            this.direction = (this.parameter && this.parameter.direction === 'prev') ? 'prev' : 'next';

            this.component = $('<div>', {
                class: this.Class.classCss + ' ' + this.direction
            });
            var icon = $('<span>', {
                class: 'player-playlist-icon',
                title: (this.direction === 'prev') ? 'Previous' : 'Next'
            });
            // Native innerHTML so the SVG namespace is parsed correctly.
            icon.get(0).innerHTML = (this.direction === 'prev') ? this.Class.svgPrev : this.Class.svgNext;
            this.component.append(icon);

            this.component.on('click', {
                self: this
            }, this.onClick);
            this.container.append(this.component);

            if (this.logger !== null) {
                this.logger.trace(this.Class.fullName, "initialize");
            }
        },
        /**
         * On click, ask the host to move within the playlist.
         * @method onClick
         * @param {Object} event
         */
        onClick: function (event) {
            var self = event.data.self;
            self.mediaPlayer.getContainer().trigger('ajs:playlist:' + self.direction);
        }
    });
