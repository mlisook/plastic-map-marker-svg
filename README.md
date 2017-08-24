# \<plastic-map-marker-svg\>

Custom SVG map marker icons for google-map

## What is it?
The elements in this package allow you to create a collection of SVG icons that can be used with `google-map-marker`, in the same way you would use `iron-iconset-svg` to create a collection of icons for `iron-icon`.

The marker icon sets you create can be used in two ways, depending on your need:
* Retrieve the icon in code and asssign it to properties as needed.
* Use `plastic-map-marker-svg` instead of `google-map-marker` 

## Creating a Marker Icon Set
To create a marker icon set you create a custom element with `plastic-map-marker-set` and include your SVG icon designs in that element (just like `iron-iconset-svg`):

```HTML
<!-- 
  file name: sample-markers.html
-->
<link rel="import" href="../plastic-map-marker-set.html">
<plastic-map-marker-set name="sample-markers">
    <svg>
        <defs>
            <g id="boxedcircle" viewBox="0 0 24 24">
                <rect style="fill:aqua; stroke:black;" x="0" y="0" width="24" height="24" />
                <circle style="fill:red; stroke: darkblue;" cx="12" cy="12" r="6" />
            </g>
            <g id="flag" viewBox="0 0 32 48">
                <path d="M 1.087 15.462 L 12.419 53.343 L 15.605 51.521 L 4.273 13.638 L 1.087 15.462 Z 
                 M 25.973 12.717 C 25.973 12.717 21.447 21.281 14.752 12.024 L 14.752 12.04 
                 C 9.979 5.267 5.83 12.973 5.83 12.973 L 12.55 35.288 C 12.55 35.288 15.341 24.327 23.771 35.981 
                 L 23.771 35.964 C 28.546 42.739 32.692 35.032 32.692 35.032 L 25.973 12.717 Z" style="fill: [[color]];"
                />
                <text x="12" y="27" fill="[[tcolor]]" style="font-family: Verdana; font-size: 9px; font-weight: bold;">[[mtext]]</text>
    </svg>
    </g>
    </defs>
    </svg>
</plastic-map-marker-set>
```
It is important that each definition have:
* an `id` which is unique, and that no other `g` elements have an `id`
* a `viewBox` attribute - it defines the basis of the points in the SVG markup and allows the browser to scale the image as requested.

### Not Really Data Binding, but ...
While it's not actual data binding, marker definitions can have substitution points (see "flag" marker above), marked with [[some.data.path]] that will be substituted in when you request the marker.

## Using Your Icons
### In Code
You can get a `google.map.icon` object for your marker icon by calling the static method `getMarkerSetIcon' of the `PlasticMapMarkerSet` which returns a `Promise` for a `google.map.icon` object:
```HTML
<google-map id="gm" style="width:100%;height:100%;" latitude="37.779" longitude="-122.3892" min-zoom="9" max-zoom="11" language="en" api-key="[[apiKey]]" on-google-map-ready="mapReady">
    <template is="dom-repeat" items="[[points]]">
        <google-map-marker slot="markers" latitude="[[item.lat]]" longitude="[[item.lng]]" icon="[[icon]]">
            <p>Yo</p>
        </google-map-marker>
    </template>
</google-map>
```
```JS
PlasticMapMarkerSet.getMarkerSetIcon('sample-markers', 'flag', 64, 96, myDataObject)
    .then((icon) => {
        this.icon = icon;
        this.points = [{
            lat: 37.779,
            lng: -122.3892
        }];
    });
```
### With plastic-map-marker-svg
`plastic-map-marker-svg` extends `google-map-marker` (i.e. `class PlasticMapMarkerSvg extends customElements.get('google-map-marker')`) adding just the icon functions.  

This is particularly useful if you are assigning different icons to different markers.

You use it in place of `google-map-marker`:
```HTML
<plastic-aspect-ratio style="width:100%;" aspect-width="4" aspect-height="3">
    <google-map id="gm" style="width:100%;height:100%;" latitude="37.779" longitude="-122.3892" min-zoom="9" max-zoom="11" language="en" api-key="[[apiKey]]">
        <template is="dom-repeat" items="[[points]]">
            <plastic-map-marker-svg slot="markers" latitude="[[item.lat]]" longitude="[[item.lng]]" icon-name="[[item.markerStyle.iconName]]"
            icon-height="[[item.markerStyle.height]]" icon-width="[[item.markerStyle.width]]" icon-data="[[item.markerStyle.iconData]]">
            <p>Yo! Some infowindow stuff!</p>
            </plastic-map-marker-svg>
        </template>
    </google-map>
</plastic-aspect-ratio>
```
Note that the `icon-name' property is in the form set:icon e.g. "sample-set:flag".

## License
MIT
## Issues
Please submit issues or questions through the github repository.
## Contributions
Contributions via pull request are certainly welcome and appreciated.