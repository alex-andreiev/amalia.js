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
 * Download button for the control bar. Downloads the current media source.
 * @class DownloadButton
 * @namespace fr.ina.amalia.player.plugins.controlBar.widgets
 * @module player
 * @submodule player-controlbar
 * @extends fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase
 */
fr.ina.amalia.player.plugins.controlBar.widgets.WidgetBase.extend("fr.ina.amalia.player.plugins.controlBar.widgets.DownloadButton", {
        classCss: "player-download-button",
        // Stroke-based outline icon so it matches the other (outline) buttons.
        // The amalia webfont only ships a filled download glyph.
        svgIcon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="3" x2="12" y2="15"></line><polyline points="6 11 12 17 18 11"></polyline><line x1="4" y1="21" x2="20" y2="21"></line></svg>'
    },
    {
        /**
         * Initialize the component
         * @method initialize
         */
        initialize: function () {
            this.component = $('<div>', {
                class: this.Class.classCss
            });
            var icon = $('<span>', {
                class: 'player-download-icon',
                title: (this.parameter && this.parameter.title) ? this.parameter.title : 'Download'
            });
            // Native innerHTML so the browser parses the SVG namespace correctly
            // (jQuery's .html() does not reliably build SVG elements).
            icon.get(0).innerHTML = this.Class.svgIcon;
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
         * On click, download the current media source. Fetches the file as a
         * blob so the browser saves it (works for same-origin and CORS-enabled
         * sources). If the fetch is blocked (cross-origin without CORS), falls
         * back to a direct link, which may open in a tab instead.
         * @method onClick
         * @param {Object} event
         */
        onClick: function (event) {
            var self = event.data.self;
            var url = (typeof self.mediaPlayer.getSrc === "function") ? self.mediaPlayer.getSrc() : null;
            if (!url) {
                if (self.logger !== null) {
                    self.logger.warn("Download: no media source available.");
                }
                return;
            }
            var filename = (url.split('/').pop() || 'video').split('?')[0] || 'video';

            if (typeof window.fetch === "function" && typeof URL.createObjectURL === "function") {
                window.fetch(url).then(function (response) {
                    if (!response.ok) {
                        throw new Error("HTTP " + response.status);
                    }
                    return response.blob();
                }).then(function (blob) {
                    var objectUrl = URL.createObjectURL(blob);
                    self.triggerDownload(objectUrl, filename);
                    URL.revokeObjectURL(objectUrl);
                }).catch(function (error) {
                    if (self.logger !== null) {
                        self.logger.warn("Download: blob fetch failed (" + error.message + "), falling back to direct link.");
                    }
                    self.triggerDownload(url, filename);
                });
            }
            else {
                self.triggerDownload(url, filename);
            }
        },
        /**
         * Create a temporary anchor and click it to start the download.
         * @method triggerDownload
         * @param {String} href
         * @param {String} filename
         */
        triggerDownload: function (href, filename) {
            var link = document.createElement('a');
            link.href = href;
            link.download = filename;
            link.rel = 'noopener';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });
