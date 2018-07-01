import{PolymerElement,html,PlasticMapMarkerSet}from"./my-app.js";class MyView1 extends PolymerElement{static get template(){return html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
        #mapcontainerdiv {
          width: 100%;
          height: 100%;    
          position: relative;
          padding: 0;
          margin: 0;    
        }
        #maparea {
          width: 400px;
          height: 300px;
          position: relative;
          padding: 0;
          margin: 0;
        }
      </style>
      
      <template is="dom-if" if="[[apiKey]]" restamp="true">
        <iron-jsonp-library library-url="[[_gmapApiUrl]]" notify-event="map-api-load" library-loaded="{{_ijplLoaded}}" on-map-api-load="_mapsApiLoaded"></iron-jsonp-library>
      </template>
          <div id="maparea">
            <div id="mapcontainerdiv">
            </div>
            <plastic-map-info id="infowin" fade-in map="[[_theMap]]" elevation="4">
              <div class="layout vertical">
                <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[_selectedLocation.place]]</div>
                <div class="layout vertical" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
                  <template is="dom-repeat" items="[[_selectedLocation.schedule]]" as="sch">
                    <div class="layout horizontal">
                      <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                      <span>[[sch.meetingTime]]</span>
                    </div>
                  </template>
                </div>
              </div>
            </plastic-map-info>
          </div>
          <div id="sources"></div>
    `}static get properties(){return{apiKey:{type:String,value:"AIzaSyBmsetVvB1KlWoSbEXYQg1leRZO1PVPm_Q",notify:!0},apiLoaded:{type:Boolean,value:!1,notify:!0},_gmapApiUrl:{type:String,notify:!0,computed:"_computeUrl(apiKey)"},_theMap:{type:Object,value:null,notify:!0},_selectedLocation:{type:Object,notify:!0},_locationMarkers:{type:Array,value:function(){return[]}},_markerSet:{type:Object}}}static get observers(){return["_doMarkers(_theMap, _locationMarkers, _markerSet)"]}connectedCallback(){super.connectedCallback();PlasticMapMarkerSet.getMarkerSet("my-markers").then(mset=>{this._markerSet=mset});this._locationMarkers=[{locationId:"20",latLng:{lat:40.750454,lng:-73.993519},place:"Pen Station / Madison Square Garden",schedule:[{meetingId:"m120",meetingTime:"07/01/2017 10:00am"},{meetingId:"m125",meetingTime:"07/05/2017 2:00pm"},{meetingId:"m130",meetingTime:"07/31/2017 11:00am"}]},{locationId:"22",latLng:{lat:40.761449,lng:-73.977622},place:"MoMA",schedule:[{meetingId:"m121",meetingTime:"07/02/2017 10:30am"},{meetingId:"m126",meetingTime:"07/06/2017 3:00pm"}]},{locationId:"24",latLng:{lat:40.74829,lng:-73.985599},place:"Empire State Building",schedule:[{meetingId:"m131",meetingTime:"07/29/2017 9:30am"},{meetingId:"m122",meetingTime:"08/02/2017 10:30am"},{meetingId:"m127",meetingTime:"08/06/2017 1:00am"},{meetingId:"m133",meetingTime:"08/29/2017 9:45am"}]}];setTimeout(()=>{this._showSource()},1e3)}_addMarkerListener(marker,location){google.maps.event.addListener(marker,"click",e=>{this._markerClick(marker,location,e)})}_markerClick(marker,location){this._selectedLocation=location;this.$.infowin.showInfoWindow(marker)}_doMarkers(map,cl,markerSet){if(map&&cl&&markerSet&&0<cl.length){let bounds=new google.maps.LatLngBounds;cl.forEach(loc=>{if(loc.latLng){let m=new google.maps.Marker({position:loc.latLng,title:loc.place,map:this._theMap,icon:markerSet.getMarkerIcon("tdpin",48,48,{pinColor:"blue",markerNum:loc.locationId}),optimized:!1});loc.marker=m;bounds.extend(loc.latLng);this._addMarkerListener(m,loc)}});this._theMap.fitBounds(bounds)}}_computeUrl(akey){return"https://maps.googleapis.com/maps/api/js?callback=%%callback%%&v=3.exp&libraries=drawing,geometry,places,visualization&key="+akey}_mapsApiLoaded(){this._theMap=new google.maps.Map(this.$.mapcontainerdiv,{zoom:4,center:{lat:43.923,lng:-121.3465}})}_showSource(){const mapMarkup=hljs.highlight("xml",`
    <div id="maparea">
      <div id="mapcontainerdiv">
      </div>
      <plastic-map-info id="infowin" fade-in map="[[_theMap]]" elevation="4">
        <div class="layout vertical">
          <div style="width:100%; background-color: blue; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">
            [[_selectedLocation.place]]
          </div>
          <div class="layout vertical" style="border: 2px solid blue; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[_selectedLocation.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </div>
    `);this.$.sources.innerHTML=`
    <p>In this example the Google Maps Javascript API is used in code to create the map and markers. A custom marker
    is retrieved from a plastic-map-marker-set in code.</p>
    <h3>Markup</h3>
    <pre><code class="html">${mapMarkup.value}</code></pre>`;const jsCode=hljs.highlight("javascript",`
  static get observers() {
    return [
      "_doMarkers(_theMap, _locationMarkers, _markerSet)"
    ];
  }

  connectedCallback() {
    super.connectedCallback();  
    // get a reference to the marker set we are using
    // This returns a promise, because the marker set may
    // not have been loaded yet. 
    PlasticMapMarkerSet.getMarkerSet('my-markers')
      .then((mset) => {
        this._markerSet = mset;
      });
  }

  /**
   * Compute the URL for loading maps api
   * @param {String} akey - Google Maps API Key
   */
  _computeUrl(akey) {
    return "https://maps.googleapis.com/maps/api/js?callback=%%callback%%&v=3.exp&libraries=drawing,geometry,places,visualization&key=" +
      akey;
  }
  /**
   * Handle map api loaded event
   * Initialize the map
   * @param {Event} e 
   */
  _mapsApiLoaded(e) {
    this._theMap = new google.maps.Map(this.$.mapcontainerdiv, {
      zoom: 4,
      center: {
        lat: 43.923,
        lng: -121.3465
      }
    });
  }
  /**
   * Adds a list of markers to the map
   * @param {Object} map - Reference to the google map object
   * @param {Array<Object>} cl - Array of locations to map 
   * @param {Object<PlasticMapMarkerSet>} markerSet - a reference to the plastic-map-marker-set
   */
  _doMarkers(map, cl, markerSet) {
    if (map && cl && markerSet && cl.length > 0) {
      let bounds = new google.maps.LatLngBounds();
      cl.forEach((loc) => {
        if (loc.latLng) {
          let m = new google.maps.Marker({
            position: loc.latLng,
            title: loc.place,
            map: this._theMap,
            icon: markerSet.getMarkerIcon('tdpin', 48, 48, {
              pinColor: "blue",
              markerNum: loc.locationId
            }),
            optimized: false
          });
          bounds.extend(loc.latLng);
          this._addMarkerListener(m, loc);
        }
      });
      this._theMap.fitBounds(bounds);
    }
  }
  /**
   * add a click event listener, capturing the marker and location
   */
  _addMarkerListener(marker, location) {
    google.maps.event.addListener(marker, 'click', (e) => {
      this._markerClick(marker, location, e);
    });
  }
  /**
   * Handle marker click
   * @param {marker} marker - google maps marker
   * @param {object} location - mltm location object
   * @param {object} e - event data
   */
  _markerClick(marker, location, e) {
    this._selectedLocation = location;
    this.$.infowin.showInfoWindow(marker);
  }
    `);this.$.sources.innerHTML+=`<h3>Javascript</h3>
    <p>This illustrates initializing the map, adding markers with custom SVG icons and showing the infowindow</p>
    <pre><code class="javascript">${jsCode.value}</code></pre>`;const markerCode=hljs.highlight("javascript",`import 'plastic-map-marker-svg/plastic-map-marker-set.js';
    const $_documentContainer = document.createElement('template');
    $_documentContainer.setAttribute('style', 'display: none;');
    
    $_documentContainer.innerHTML = \`<plastic-map-marker-set name="my-markers">
        <svg>
            <defs>
                <g id="tdpin" viewBox="0 0 500 500">
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
                <g id="bus" viewBox="0 0 49 49">
                    <g>
                        <path style="fill: [[color]];" 
                            d="M47.503,12.835h-1.994c-0.834,0-1.508,0.675-1.508,1.508v0.377h-1.185L40.354,3.08c-0.147-0.697-0.762-1.196-1.476-1.196&#10;&#9;&#9;H10.133c-0.713,0-1.327,0.499-1.476,1.196L6.194,14.722H5.01v-0.377c0-0.833-0.676-1.508-1.509-1.508H1.507&#10;&#9;&#9;C0.674,12.836,0,13.512,0,14.344v4.777c0,0.833,0.673,1.508,1.507,1.508h1.994c0.833,0,1.509-0.675,1.509-1.508v-2.389h0.864v8.674&#10;&#9;&#9;v15.979c0,0.833,0.674,1.51,1.508,1.51h0.652v1.807c0,1.333,1.081,2.414,2.413,2.414h2.209c1.335,0,2.414-1.081,2.414-2.414v-1.807&#10;&#9;&#9;h18.854v1.807c0,1.333,1.082,2.414,2.414,2.414h2.212c1.333,0,2.415-1.081,2.415-2.414v-1.807h0.651&#10;&#9;&#9;c0.832,0,1.508-0.677,1.508-1.51V25.407v-8.674h0.862v2.389c0,0.833,0.677,1.508,1.511,1.508h1.991&#10;&#9;&#9;c0.835,0,1.511-0.675,1.511-1.508v-4.777C49.01,13.51,48.334,12.835,47.503,12.835z M11.465,37.475&#10;&#9;&#9;c-1.526,0-2.766-1.238-2.766-2.767s1.239-2.769,2.766-2.769c1.53,0,2.768,1.24,2.768,2.769S12.996,37.475,11.465,37.475z&#10;&#9;&#9; M31.796,39.735H17.215v-1.258h14.581V39.735z M31.796,37.225H17.215v-1.26h14.581V37.225z M31.796,34.708H17.215V33.45h14.581&#10;&#9;&#9;V34.708z M31.796,32.194H17.215v-1.258h14.581V32.194z M24.505,26.356c-5.572,0-10.937-0.724-15.613-2.08v-7.729l2.463-11.647&#10;&#9;&#9;h26.299l2.464,11.646v7.729C35.441,25.633,30.076,26.356,24.505,26.356z M37.545,37.475c-1.525,0-2.768-1.238-2.768-2.767&#10;&#9;&#9;s1.24-2.769,2.768-2.769c1.529,0,2.768,1.24,2.768,2.769C40.311,36.237,39.073,37.475,37.545,37.475z"/>
                    </g>                
                    <rect x="11.572" y="5.784" width="25.621" height="19.294" style="fill: rgb(255, 255, 255);"/>     
                    <text x="23.75" y="20" text-anchor="middle" style="font-size: 16px; font-family: Roboto; fill: [[tcolor]];">[[mtext]]</text>
                </g>
                <g id="user" viewBox="0 0 32 32">
                    <path stroke="[[color]]" d="M16,22c4.963,0,9-4.936,9-11c0-6.064-4.038-11-9-11c-2.447,0-4.734,1.174-6.438,3.305C7.909,5.37,7,8.104,7,11.001 C7,17.064,11.037,22,16,22z M16,2.001c3.859,0,7,4.037,7,9c0,4.962-3.141,9-7,9c-3.859,0-7-4.038-7.001-9 C8.999,6.038,12.14,2.001,16,2.001z M23,20c-0.553,0-1,0.447-1,1s0.447,1,1,1c3.859,0,7,3.141,7,7c0,0.551-0.449,1-1,1H3 c-0.551,0-1-0.449-1-1c0-3.859,3.141-7,7-7c0.553,0,1-0.447,1-1s-0.447-1-1-1c-4.963,0-9,4.037-9,9c0,1.654,1.346,3,3,3h26 c1.654,0,3-1.346,3-3C32,24.038,27.963,20,23,20z"/>
                </g>
            </defs>
        </svg>
    </plastic-map-marker-set>\`;
    
    document.head.appendChild($_documentContainer.content);
    `);this.$.sources.innerHTML+=`<h3>Marker Set</h3>
    <p>This creates a set of SVG map markers (Polymer 3 syntax).</p>
    <pre><code class="javascript">${markerCode.value}</code></pre>`}}window.customElements.define("my-view1",MyView1);