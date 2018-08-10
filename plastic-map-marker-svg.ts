/**
    @license MIT
*/
/**
plastic-map-marker-svg

A superclass of `google-map-marker` with additional attributes to make
using SVG marker icons easier.

@element plastic-map-marker-svg
@demo demo/index.html
*/
import '@atomiko/google-map-holdout/google-map-marker';
import { PlasticMapMarkerSet, IgmapIcon } from './plastic-map-marker-set';

class PlasticMapMarkerSvg extends customElements.get('google-map-marker') {
    static get is() {
        return 'plastic-map-marker-svg';
    }
    // clone the google-map-marker template
    static get template() {
        if (!(<any>window).PlasticMapMarkerSvgTemplate) {
            (<any>window).PlasticMapMarkerSvgTemplate = customElements.get('google-map-marker').template.cloneNode(
                true);
        }
        return (<any>window).PlasticMapMarkerSvgTemplate;
    }
    /**
     * the resolved google.maps.Icon
     * @polyProp
     */
    _plasticIcon!: any;
    /**
     * an object who's data will be
     * substituted into the icon.
     * Default is no data.
     * @polyProp { value: () => { return {}; } }
     */
    iconData!: any;
    /**
     * icon height in px
     * if not given, or 0, the viewbox of
     * the icon definition is used
     * @polyProp { value: 0 }
     */
    iconHeight!: number;
    /**
     * the name of the icon in the form
     * markerIconSet:markerIconName for
     * example "my-map-icons:hospital"
     * @polyProp
     */
    iconName!: string;
    /**
     * icon width in px
     * if not given, or 0, the viewbox of
     * the icon definition is used
     * @polyProp { value: 0 }
     */
    iconWidth!: number;

    static get properties() {
        return {
            /**
             * the name of the icon in the form
             * markerIconSet:markerIconName for 
             * example "my-map-icons:hospital"
             */
            iconName: {
                type: String
            },
            /**
             * icon height in px
             * if not given, or 0, the viewbox of
             * the icon definition is used
             */
            iconHeight: {
                type: Number,
                value: 0
            },
            /**
             * icon width in px
             * if not given, or 0, the viewbox of
             * the icon definition is used
             */
            iconWidth: {
                type: Number,
                value: 0
            },
            /**
             * an object who's data will be 
             * substituted into the icon.
             * Default is no data.
             */
            iconData: {
                type: Object,
                value: () => {
                    return {};
                }
            },
            /**
             * the resolved google.maps.Icon 
             */
            _plasticIcon: {
                type: Object
            }
        }
    }

    static get observers() {
        return [
            '_iconAssignkmentTime(map, iconName, iconWidth, iconHeight, iconData)',
            // observers from google-map-marker 
            '_updatePosition(latitude, longitude)'
        ]
    }

    /**
     * Returns the resolved icon
     * @param {String} iconName - in the form set:name eg "my-markers:bakery"
     * @param {Number} iconWidth
     * @param {Number} iconHeight
     * @param {Object} iconData
     * @return {Object} google.maps.Icon  
     */
    _getPlasticMarkerIcon(iconName: string, iconWidth: number, iconHeight: number, iconData: any): Promise<IgmapIcon | undefined> {
        return new Promise((resolve, reject) => {
            let result; // undefined
            if (iconName) {
                let iconNameParts = iconName.split(":");
                if (iconNameParts.length == 2 && iconNameParts[0] && iconNameParts[1]) {
                    resolve(PlasticMapMarkerSet.getMarkerSetIcon(iconNameParts[0], iconNameParts[1], iconWidth, iconHeight, iconData));
                } else {
                    console.warn("map marker icon names must be in form set:name");
                    resolve(result);
                }
            } else {
                resolve(result);
            }
        });
    }

    /**
     * observer for properties used to set the marker icon
     * 
     * Sets the icon (in the base class - google-map-marker)
     * @param {Object} map - google.maps.map from the base class
     * @param {String} iconName
     * @param {Number} iconWidth
     * @param {Number} iconHeight
     * @param {Object} iconData
     */
    _iconAssignkmentTime(map: any, iconName: string, iconWidth: number, iconHeight: number, iconData: any) {
        // can only assign if the map has loaded
        if (map) {
            if (iconName) {
                this._getPlasticMarkerIcon(iconName, iconWidth, iconHeight, iconData)
                    .then((i) => {
                        this.icon = i;
                    });
            } else {
                this.icon = null;
            }
        }
    }
}
window.customElements.define(PlasticMapMarkerSvg.is, PlasticMapMarkerSvg);
