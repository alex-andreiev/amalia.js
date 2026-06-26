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
 * Playlist menu button for the control bar. Opens a popup list of the playlist
 * entries (passed via the `items` parameter) so the user can jump to any video.
 * Selecting an entry triggers `ajs:playlist:select` (with its index) on the
 * player container. Listens for `ajs:playlist:changed` to highlight the current
 * entry.
 * @class PlaylistMenuButton
 * @namespace fr.ina.amalia.player.plugins.controlBar.widgets
 * @module player
 * @submodule player-controlbar
 * @extends fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase
 */
fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase.extend("fr.ina.amalia.player.plugins.controlBar.widgets.PlaylistMenuButton", {
        classCss: "player-playlist-menu-button",
        svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>'
    },
    {
        /**
         * Initialize the component
         * @method initialize
         */
        initialize: function () {
            var items = (this.parameter && $.isArray(this.parameter.items)) ? this.parameter.items : [];

            this.component = $('<div>', {
                class: this.Class.classCss
            });
            var icon = $('<span>', {
                class: 'player-playlist-menu-icon',
                title: (this.parameter && this.parameter.title) ? this.parameter.title : 'Playlist'
            });
            icon.get(0).innerHTML = this.Class.svgIcon;
            this.component.append(icon);

            // Popup list of entries.
            this.menu = $('<ul>', {
                class: 'player-playlist-menu'
            });
            for (var i = 0; i < items.length; i++) {
                var li = $('<li>', {
                    'data-index': i,
                    text: items[i]
                });
                if (i === 0) {
                    li.addClass('active');
                }
                this.menu.append(li);
            }
            this.component.append(this.menu);
            this.container.append(this.component);

            this.defineEvents(icon);
        },
        /**
         * Bind open/close, selection and current-item highlight events.
         * @method defineEvents
         * @param {Object} icon jQuery icon element
         */
        defineEvents: function (icon) {
            var self = this;

            icon.on('click', function (event) {
                event.stopPropagation();
                self.component.toggleClass('open');
            });

            this.menu.on('click', 'li', function (event) {
                event.stopPropagation();
                var index = parseInt($(this).attr('data-index'), 10);
                self.component.removeClass('open');
                self.mediaPlayer.getContainer().trigger('ajs:playlist:select', [index]);
            });

            // Close when clicking elsewhere.
            $(document).on('click.ajsPlaylistMenu', function () {
                self.component.removeClass('open');
            });

            // Highlight the current entry when the playlist position changes.
            this.mediaPlayer.getContainer().on('ajs:playlist:changed', function (event, index) {
                self.menu.find('li').removeClass('active');
                self.menu.find('li[data-index="' + index + '"]').addClass('active');
            });
        }
    });
