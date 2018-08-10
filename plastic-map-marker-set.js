/**
@license MIT

@element plastic-map-marker-set
@demo demo/index.html
*/
import { PolymerElement } from '@polymer/polymer/polymer-element';
import { IronMeta } from '@polymer/iron-meta/iron-meta';
import { Base } from '@polymer/polymer/polymer-legacy';
/**
 * `plastic-map-marker-set`
 * Custom set of SVG marker icons for google-map
 *
 */
export class PlasticMapMarkerSet extends PolymerElement {
    static get is() {
        return 'plastic-map-marker-set';
    }
    static get properties() {
        return {
            /**
             * The name of the marker icon set.
             */
            name: {
                type: String,
                observer: '_nameChanged'
            }
        };
    }
    constructor() {
        super();
    }
    // 
    // many of these methods are based on iron-iconset-svg and are marked #IIS
    // in the method description
    //
    /**
     * register the marker icon set with Polymer when created
     * #IIS
     */
    created() {
        this._meta = new IronMeta({
            type: 'plasticMapMarkerSet',
            key: null,
            value: null
        });
    }
    /**
     * This type of element should not be attached to the DOM,
     * so if it is, set it's display to none.
     * #IIS
     */
    attached() {
        this.style.display = 'none';
    }
    /**
     * When name is changed, register iconset metadata
     * #IIS
     */
    _nameChanged() {
        if (!this._meta) {
            this._meta = new IronMeta({
                type: 'plasticMapMarkerSet',
                key: null,
                value: null
            });
        }
        this._meta.value = null;
        this._meta.key = this.name;
        this._meta.value = this;
        this.dispatchEvent(new CustomEvent('plastic-map-marker-set-added', {
            detail: {
                set: this.name,
                element: this
            }
        }));
        document.dispatchEvent(new CustomEvent('plastic-map-marker-set-added', {
            detail: {
                set: this.name,
                element: this
            }
        }));
    }
    /**
     * Construct an array of all marker names in this set.
     * #IIS
     *
     * @return {!Array} Array of marker names.
     */
    getMarkerNames() {
        this._icons = this._createIconMap();
        return Object.keys(this._icons).map((n) => {
            return this.name + ':' + n;
        });
    }
    /**
     * returns a google map icon from the requested SVG
     * marker icon definition.
     * @param {String} id - marker id
     * @param {Number} width - width of the marker
     * @param {Number} height - height of the marker
     * @param {Object} substitutionData - an object to be used as a source for substitution into the marker
     * @return {google.maps.Icon}
     */
    getMarkerIcon(id, width, height, substitutiionData) {
        if (!id) {
            return undefined;
        }
        let h = height && height >= 2 ? height : 24;
        let w = width && width >= 2 ? width : h;
        let svg = this._getMarkerSvgString(id, w, h);
        if (!svg) {
            return undefined;
        }
        svg = this._substituteInSvg(svg, substitutiionData);
        // return google.maps.Icon object 
        return {
            // anchor: new google.maps.Point(Math.floor(w / 2), Math.floor(h)),
            anchor: {
                x: Math.floor(w / 2),
                y: Math.floor(h)
            },
            url: svg ? this._dataUrl(svg) : undefined,
            scaledSize: { height: h, width: w }
        };
    }
    /**
     * Encodes SVG element as a data URL
     * @param {String} svg - SVG element markup as a string
     * @return {String} - a string data url
     */
    _dataUrl(svg) {
        return 'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(svg);
    }
    /**
     * substitutes data from the dataObj into the src markup
     * @param {String} src - source svg markup
     * @param {Object} dataObj - data to be substituted in
     * @return {String} - the modified svg markup
     */
    _substituteInSvg(src, dataObj) {
        let result = src;
        if (dataObj) {
            let markRegex = /\[\[([\w\.]+)\]\]/g;
            let subList = [];
            let match = markRegex.exec(src);
            if (match) {
                // add all matches to the array
                while (match != null) {
                    subList.push({
                        matchedText: match[0],
                        path: match[1]
                    });
                    match = markRegex.exec(src);
                }
                // for each substitution, replace the marker with dataObj value
                subList.forEach((s) => {
                    result = result.replace(s.matchedText, this._getValueFromPath(dataObj, s.path));
                });
            }
        }
        return result;
    }
    /**
     * returns a string value from the dataObj by following the path
     * e.g. if path="foo.bar.bin.fiz", this will return dataObj.foo.bar.bin.fiz
     * or an empty string if one of those nodes is undefined.
     * @param {Object} dataObj
     * @param {String} path - data path
     * @return {String}
     */
    _getValueFromPath(dataObj, path) {
        let oref = dataObj;
        let pathArray = path.split('.');
        pathArray.forEach((p) => {
            if (oref != null) {
                oref = oref && oref[p] != undefined ? oref[p] : null;
            }
        });
        return oref != null ? oref.toString() : "";
    }
    /**
     * Create a map of child SVG elements by id.
     * #IIS
     *
     * @return {!Object} Map of id's to SVG elements.
     */
    _createIconMap() {
        // Objects chained to Object.prototype (`{}`) have members. Specifically,
        // on FF there is a `watch` method that confuses the icon map, so we
        // need to use a null-based object here.
        let icons = Object.create(null);
        // dom(this).querySelectorAll('[id]')
        const nodes = this.querySelectorAll('[id]');
        for (let i = 0; i < nodes.length; i++) {
            icons[nodes[i].id] = nodes[i];
        }
        return icons;
    }
    /**
     * Get a string representation of the requested SVG marker in this
     * markerset, or `undefined` if there is no matching element.
     *
     * @param {String} id - the id of the marker requested
     * @param {Number} width - the width of the marker
     * @param {Number} height - the height of the marker
     * @return {String} Returns a string SVG element
     */
    _getMarkerSvgString(id, width, height) {
        // create the marker map on-demand
        this._icons = this._icons || this._createIconMap();
        if (!this._icons || !this._icons[id]) {
            return undefined;
        }
        const clone = this._prepareSvgClone(this._icons[id], width, height);
        if (!clone) {
            return "";
        }
        // IE won't return outerHTML on an SVG element, so 
        // we wrap it in a DIV and get the innerHTML, removing the ID
        // from the marker.  Of course, we can't actually get the innerHTML
        // in IE either, so we fake that too.
        const wrapperDiv = document.createElement("div");
        wrapperDiv.appendChild(clone);
        let svgText = wrapperDiv.outerHTML.replace(`id="${id}"`, '').replace('<div>', '').replace('</div>', '');
        const m = svgText.match(/xmlns/g);
        if (m && m.length > 1) {
            // IE dups xmlns, so take the extra one out
            svgText = svgText.replace('xmlns="http://www.w3.org/2000/svg"', '');
        }
        return svgText;
    }
    /**
     * Builds an SVG element by cloning the marker
     * and applying the size
     * #IIS with changes
     * @param {Element} sourceSvg
     * @param {number} width
     * @param {Number} height
     * @return {Element}
     */
    _prepareSvgClone(sourceSvg, width, height) {
        if (sourceSvg) {
            let h = height && height >= 2 ? height : 24;
            let w = width && width >= 2 ? width : h;
            let content = sourceSvg.cloneNode(true), svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), viewBox = content.getAttribute('viewBox') || '0 0 ' + w + ' ' + h, cssText = 'pointer-events: none; display: block;';
            svg.setAttribute('viewBox', viewBox);
            //svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            svg.setAttribute("width", w.toString());
            svg.setAttribute("height", h.toString());
            svg.setAttribute("xmlns", 'http://www.w3.org/2000/svg');
            // TODO(dfreedm): `pointer-events: none` works around https://crbug.com/370136
            // TODO(sjmiles): inline style may not be ideal, but avoids requiring a shadow-root
            // svg.style.cssText = cssText;
            // svg.appendChild(content).removeAttribute('id');
            svg.appendChild(content);
            // svg.innerHTML = content.innerHTML;
            return svg;
        }
        return null;
    }
    /**
     * returns a promise for a reference to the marker set instance
     * @param {String} setName - name of the marker set
     * @return {Promise} for a marker set instance
     */
    static getMarkerSet(setName) {
        return new Promise((resolve, reject) => {
            let meta = Base.create('iron-meta', {
                type: 'plasticMapMarkerSet'
            });
            if (meta && typeof meta.byKey === "function" && meta.byKey(setName)) {
                resolve(meta.byKey(setName));
            }
            else {
                document.addEventListener("plastic-map-marker-set-added", (e) => {
                    if (e.detail.set == setName) {
                        meta = Base.create('iron-meta', {
                            type: 'plasticMapMarkerSet'
                        });
                        let markerIconSet = meta.byKey(setName);
                        if (markerIconSet) {
                            resolve(markerIconSet);
                        }
                        else {
                            resolve(null);
                        }
                    }
                });
            }
        });
    }
    /**
     * returns a promise for a google.map.icon object for the given
     * set and iconName
     * @param {String} setName - the name of the marker icon set
     * @param {String} iconName - the name of the icon
     * @param {Number} width - icon width in px
     * @param {Number} height - icon height in px
     * @param {Object} dataObj - object containing substitution values for the SVG in the icon
     * @return {Promise<google.map.icon>} a google.map.icon
     */
    static getMarkerSetIcon(setName, iconName, width, height, dataObj) {
        return PlasticMapMarkerSet.getMarkerSet(setName)
            .then((markerset) => {
            return markerset ? markerset.getMarkerIcon(iconName, width, height, dataObj) : undefined;
        });
    }
}
window.customElements.define(PlasticMapMarkerSet.is, PlasticMapMarkerSet);
