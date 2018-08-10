/**
@license MIT

@element plastic-map-marker-set
@demo demo/index.html
*/
import { PolymerElement } from '@polymer/polymer/polymer-element';

import { IronMeta } from '@polymer/iron-meta/iron-meta';
import { Base } from '@polymer/polymer/polymer-legacy';

/**
 * Based on iron-iconset-svg, the `plastic-map-marker-set` 
 * element allows users to define their own sets
 * custom SVG map marker icons for use with the google-map element
 * or the Google Maps Javascript APi. 
 * 
 * Define a set of SVG markers by creating your own custom
 * element, wrapping your SVG definitions in a `plastic-map-marker-set` element.
 * 
 * The svg map marker icon elements should be direct children of the
 * `plastic-map-marker-set` element. Marker icons should be given distinct id's.
 * Only top level definitions - `g` elements that are direct children
 * of the `defs` element should have an `id` attribute.
 * 
 * Each definition should have a `viewBox`. This is essential for scaling. If
 * a definition is missing a viewBox, a default of '0 0 24 24' will be used.
 *
 * Example:
 *
 *     <plastic-map-marker-set name="my-map-markers" >
 *       <svg>
 *         <defs>
 *           <g id="tdpin" viewBox="0 0 500 500">
                <path stroke="#434242" fill="[[pinColor]]" d="M250 30c77 0 140 63 140 140 0 24-6 46-16 65l-111 227c-2 5-7 8-13 8s-11-3-13-8l-111-227c-10-19-16-41-16-65 0-77 63-140 140-140z"
                />
                <circle stroke="#434242" fill="#FCFCFD" cx="250" cy="170" r="100" />
                <text text-anchor="middle" x="250" y="210" style="font-family: Verdana; font-size: 90px; font-weight: bold;color:black;stroke:black;">[[markerNum]]</text>
            </g>
            <g id="sqpin" viewBox="0 0 485.213 485.212">
                <path stroke="[[pinColor]]" fill="[[pinColor]]" d="M333.586,212.282V60.651c16.76,0,30.322-13.562,30.322-30.324C363.908,13.567,350.346,0,333.586,0H151.628
                c-16.762,0-30.324,13.567-30.324,30.327c0,16.762,13.562,30.324,30.324,30.324v151.631c-33.496,0-60.651,27.158-60.651,60.648
                h121.305v212.282l60.65-60.653V272.93h121.303C394.235,239.439,367.077,212.282,333.586,212.282z M303.255,212.282h-121.3V60.651
                h121.3V212.282z"/>
                <text text-anchor="middle" x="242" y="165" style="font-family: Verdana; font-size: 95px; font-weight: bold;color:black;stroke:black;">[[markerNum]]</text>
            </g>
 *         </defs>
 *       </svg>
 *     </plastic-map-marker-set>
 *
 * This will automatically register the map marker icon set "my-map-markers" with Polymer.
 * 
 * While it's not actual data binding, marker definitions can have substitutiion points (see example 
 * marker definitions above), marked with [[some.data.path]] that will be substituted in when you request the
 * marker.
 *
 * To get a marker you can call the static method getMarkerSetIcon which returns a Promise
 * for a google.map.icon:
 * 
 *   PlasticMapMarkerSvg.getMarkerSetIcon(setName, iconName, width, height, dataObj)
 *     .then((icon) => {
 *       // do something with the icon
 *     });
 *
 * @element plastic-map-marker-set
 * @demo demo/index.html
 */

interface ImarkerNodes {
  [index: string]: Node;
}

interface Ihw {
  height: number;
  width: number;
}

interface Ixy {
  x: number;
  y: number;
}

export interface IgmapIcon {
  anchor: Ixy;
  url: string | undefined;
  scaledSize: Ihw;
}

/**
 * `plastic-map-marker-set`
 * Custom set of SVG marker icons for google-map
 *
 */
export class PlasticMapMarkerSet extends PolymerElement {
  static get is() {
    return 'plastic-map-marker-set';
  }

  _meta: IronMeta;
  _icons!: ImarkerNodes;

  /**
   * The name of the marker icon set.
   * @polyProp { observer: '_nameChanged' }
   */
  name!: string;

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
  getMarkerNames(): string[] {
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
  getMarkerIcon(id: string, width: number, height: number, substitutiionData: any): IgmapIcon | undefined {
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
  _dataUrl(svg: string): string {
    return 'data:image/svg+xml;charset=utf-8,' +
      encodeURIComponent(svg);
  }

  /**
   * substitutes data from the dataObj into the src markup
   * @param {String} src - source svg markup
   * @param {Object} dataObj - data to be substituted in
   * @return {String} - the modified svg markup
   */
  _substituteInSvg(src: string, dataObj: any): string {
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
  _getValueFromPath(dataObj: any, path: string): string {
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
  _createIconMap(): ImarkerNodes {
    // Objects chained to Object.prototype (`{}`) have members. Specifically,
    // on FF there is a `watch` method that confuses the icon map, so we
    // need to use a null-based object here.
    let icons = Object.create(null);
    // dom(this).querySelectorAll('[id]')
    const nodes = (<HTMLElement>this).querySelectorAll('[id]');
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
  _getMarkerSvgString(id: string, width: number, height: number) {
    // create the marker map on-demand
    this._icons = this._icons || this._createIconMap();
    if (!this._icons || !this._icons[id]) {
      return undefined;
    }
    const clone = this._prepareSvgClone(<SVGGElement>this._icons[id], width, height);
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
  _prepareSvgClone(sourceSvg: SVGGElement, width: number, height: number): SVGElement | null {
    if (sourceSvg) {
      let h = height && height >= 2 ? height : 24;
      let w = width && width >= 2 ? width : h;
      let content = <SVGGElement>sourceSvg.cloneNode(true),
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        viewBox = content.getAttribute('viewBox') || '0 0 ' + w + ' ' + h,
        cssText = 'pointer-events: none; display: block;';

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
  static getMarkerSet(setName: string): Promise<PlasticMapMarkerSet | null> {
    return new Promise((resolve, reject) => {
      let meta = Base.create('iron-meta', {
        type: 'plasticMapMarkerSet'
      });
      if (meta && typeof meta.byKey === "function" && meta.byKey(setName)) {
        resolve(meta.byKey(setName));
      } else {
        document.addEventListener("plastic-map-marker-set-added", (e: any) => {
          if (e.detail.set == setName) {
            meta = Base.create('iron-meta', {
              type: 'plasticMapMarkerSet'
            });
            let markerIconSet: PlasticMapMarkerSet = <PlasticMapMarkerSet>meta.byKey(setName);
            if (markerIconSet) {
              resolve(markerIconSet);
            } else {
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
  static getMarkerSetIcon(setName: string, iconName: string, width: number, height: number, dataObj: any): Promise<IgmapIcon | undefined> {
    return PlasticMapMarkerSet.getMarkerSet(setName)
      .then((markerset) => {
        return markerset ? markerset.getMarkerIcon(iconName, width, height, dataObj) : undefined;
      })
  }

}

window.customElements.define(PlasticMapMarkerSet.is, PlasticMapMarkerSet);
