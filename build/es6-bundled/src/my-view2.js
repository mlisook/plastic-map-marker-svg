define(["./my-app.js"],function(_myApp){"use strict";(0,_myApp.Polymer)({is:"google-maps-api",behaviors:[_myApp.IronJsonpLibraryBehavior],properties:{mapsUrl:{type:String,value:"https://maps.googleapis.com/maps/api/js?callback=%%callback%%"},apiKey:{type:String,value:""},clientId:{type:String,value:""},version:{type:String,value:"3.exp"},language:{type:String,value:""},signedIn:{type:Boolean,value:!1},notifyEvent:{type:String,value:"api-load"},libraryUrl:{type:String,computed:"_computeUrl(mapsUrl, version, apiKey, clientId, language, signedIn)"}},_computeUrl:function(mapsUrl,version,apiKey,clientId,language,signedIn){var url=mapsUrl+"&v="+version;url+="&libraries=drawing,geometry,places,visualization";if(apiKey&&!clientId){url+="&key="+apiKey}if(clientId){url+="&client="+clientId}if(!apiKey&&!clientId){console.warn("No Google Maps API Key or Client ID specified. "+"See https://developers.google.com/maps/documentation/javascript/get-api-key "+"for instructions to get started with a key or client id.")}if(language){url+="&language="+language}if(signedIn){url+="&signed_in="+signedIn}return url},get api(){return google.maps}});function setupDragHandler_(){if(this.draggable){this.dragHandler_=google.maps.event.addListener(this.marker,"dragend",onDragEnd_.bind(this))}else{google.maps.event.removeListener(this.dragHandler_);this.dragHandler_=null}}function onDragEnd_(e){this.latitude=e.latLng.lat();this.longitude=e.latLng.lng()}(0,_myApp.Polymer)({_template:_myApp.html$1`
    <style>
      :host {
        display: none;
      }
    </style>

    <slot></slot>
`,is:"google-map-marker",properties:{marker:{type:Object,notify:!0},map:{type:Object,observer:"_mapChanged"},info:{type:Object,value:null},clickEvents:{type:Boolean,value:!1,observer:"_clickEventsChanged"},dragEvents:{type:Boolean,value:!1,observer:"_dragEventsChanged"},icon:{type:Object,value:null,observer:"_iconChanged"},mouseEvents:{type:Boolean,value:!1,observer:"_mouseEventsChanged"},zIndex:{type:Number,value:0,observer:"_zIndexChanged"},longitude:{type:Number,value:null,notify:!0},latitude:{type:Number,value:null,notify:!0},label:{type:String,value:null,observer:"_labelChanged"},animation:{type:String,value:null,observer:"_animationChanged"},open:{type:Boolean,value:!1,observer:"_openChanged"}},observers:["_updatePosition(latitude, longitude)"],detached:function(){if(this.marker){google.maps.event.clearInstanceListeners(this.marker);this._listeners={};this.marker.setMap(null)}if(this._contentObserver)this._contentObserver.disconnect()},attached:function(){if(this.marker){this.marker.setMap(this.map)}},_updatePosition:function(){if(this.marker&&null!=this.latitude&&null!=this.longitude){this.marker.setPosition(new google.maps.LatLng(parseFloat(this.latitude),parseFloat(this.longitude)))}},_clickEventsChanged:function(){if(this.map){if(this.clickEvents){this._forwardEvent("click");this._forwardEvent("dblclick");this._forwardEvent("rightclick")}else{this._clearListener("click");this._clearListener("dblclick");this._clearListener("rightclick")}}},_dragEventsChanged:function(){if(this.map){if(this.dragEvents){this._forwardEvent("drag");this._forwardEvent("dragend");this._forwardEvent("dragstart")}else{this._clearListener("drag");this._clearListener("dragend");this._clearListener("dragstart")}}},_mouseEventsChanged:function(){if(this.map){if(this.mouseEvents){this._forwardEvent("mousedown");this._forwardEvent("mousemove");this._forwardEvent("mouseout");this._forwardEvent("mouseover");this._forwardEvent("mouseup")}else{this._clearListener("mousedown");this._clearListener("mousemove");this._clearListener("mouseout");this._clearListener("mouseover");this._clearListener("mouseup")}}},_animationChanged:function(){if(this.marker){this.marker.setAnimation(google.maps.Animation[this.animation])}},_labelChanged:function(){if(this.marker){this.marker.setLabel(this.label)}},_iconChanged:function(){if(this.marker){this.marker.setIcon(this.icon)}},_zIndexChanged:function(){if(this.marker){this.marker.setZIndex(this.zIndex)}},_mapChanged:function(){if(this.marker){this.marker.setMap(null);google.maps.event.clearInstanceListeners(this.marker)}if(this.map&&this.map instanceof google.maps.Map){this._mapReady()}},_contentChanged:function(){if(this._contentObserver)this._contentObserver.disconnect();this._contentObserver=new MutationObserver(this._contentChanged.bind(this));this._contentObserver.observe(this,{childList:!0,subtree:!0});var content=this.innerHTML.trim();if(content){if(!this.info){this.info=new google.maps.InfoWindow;this.openInfoHandler_=google.maps.event.addListener(this.marker,"click",function(){this.open=!0}.bind(this));this.closeInfoHandler_=google.maps.event.addListener(this.info,"closeclick",function(){this.open=!1}.bind(this))}this.info.setContent(content)}else{if(this.info){google.maps.event.removeListener(this.openInfoHandler_);google.maps.event.removeListener(this.closeInfoHandler_);this.info=null}}},_openChanged:function(){if(this.info){if(this.open){this.info.open(this.map,this.marker);this.fire("google-map-marker-open")}else{this.info.close();this.fire("google-map-marker-close")}}},_mapReady:function(){this._listeners={};this.marker=new google.maps.Marker({map:this.map,position:{lat:parseFloat(this.latitude),lng:parseFloat(this.longitude)},title:this.title,animation:google.maps.Animation[this.animation],draggable:this.draggable,visible:!this.hidden,icon:this.icon,label:this.label,zIndex:this.zIndex});this._contentChanged();this._clickEventsChanged();this._dragEventsChanged();this._mouseEventsChanged();this._openChanged();setupDragHandler_.bind(this)()},_clearListener:function(name){if(this._listeners[name]){google.maps.event.removeListener(this._listeners[name]);this._listeners[name]=null}},_forwardEvent:function(name){this._listeners[name]=google.maps.event.addListener(this.marker,name,function(event){this.fire("google-map-marker-"+name,event)}.bind(this))},attributeChanged:function(attrName){if(!this.marker){return}switch(attrName){case"hidden":this.marker.setVisible(!this.hidden);break;case"draggable":this.marker.setDraggable(this.draggable);setupDragHandler_.bind(this)();break;case"title":this.marker.setTitle(this.title);break;}}});(0,_myApp.Polymer)({_template:_myApp.html$1`
    <style>
      :host {
        position: relative;
        display: block;
        height: 100%;
      }

      #map {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    </style>

    <google-maps-api id="api" api-key="[[apiKey]]" client-id="[[clientId]]" version="[[version]]" signed-in="[[signedIn]]" language="[[language]]" on-api-load="_mapApiLoaded" maps-url="[[mapsUrl]]">
    </google-maps-api>

    <div id="map"></div>

    <iron-selector id="selector" multi="[[!singleInfoWindow]]" selected-attribute="open" activate-event="google-map-marker-open" on-google-map-marker-close="_deselectMarker">
      <slot id="markers" name="markers"></slot>
    </iron-selector>

    <slot id="objects"></slot>
`,is:"google-map",properties:{apiKey:String,mapsUrl:{type:String},clientId:String,latitude:{type:Number,value:37.77493,notify:!0,reflectToAttribute:!0},map:{type:Object,notify:!0,value:null},longitude:{type:Number,value:-122.41942,notify:!0,reflectToAttribute:!0},kml:{type:String,value:null,observer:"_loadKml"},zoom:{type:Number,value:10,observer:"_zoomChanged",notify:!0},noAutoTilt:{type:Boolean,value:!1},mapType:{type:String,value:"roadmap",observer:"_mapTypeChanged",notify:!0},version:{type:String,value:"3.exp"},disableDefaultUi:{type:Boolean,value:!1,observer:"_disableDefaultUiChanged"},disableMapTypeControl:{type:Boolean,value:!1,observer:"_disableMapTypeControlChanged"},disableStreetViewControl:{type:Boolean,value:!1,observer:"_disableStreetViewControlChanged"},fitToMarkers:{type:Boolean,value:!1,observer:"_fitToMarkersChanged"},disableZoom:{type:Boolean,value:!1,observer:"_disableZoomChanged"},styles:{type:Object,value:function(){return{}}},maxZoom:{type:Number,observer:"_maxZoomChanged"},minZoom:{type:Number,observer:"_minZoomChanged"},signedIn:{type:Boolean,value:!1},language:{type:String},clickEvents:{type:Boolean,value:!1,observer:"_clickEventsChanged"},dragEvents:{type:Boolean,value:!1,observer:"_dragEventsChanged"},mouseEvents:{type:Boolean,value:!1,observer:"_mouseEventsChanged"},additionalMapOptions:{type:Object,value:function(){return{}}},markers:{type:Array,value:function(){return[]},readOnly:!0},objects:{type:Array,value:function(){return[]},readOnly:!0},singleInfoWindow:{type:Boolean,value:!1}},behaviors:[_myApp.IronResizableBehavior],listeners:{"iron-resize":"resize"},observers:["_debounceUpdateCenter(latitude, longitude)"],attached:function(){this._initGMap()},detached:function(){if(this._markersChildrenListener){this.unlisten(this.$.selector,"items-changed","_updateMarkers");this._markersChildrenListener=null}if(this._objectsMutationObserver){this._objectsMutationObserver.disconnect();this._objectsMutationObserver=null}},_initGMap:function(){if(this.map){return}if(!0!==this.$.api.libraryLoaded){return}if(!this.isAttached){return}this.map=new google.maps.Map(this.$.map,this._getMapOptions());this._listeners={};this._updateCenter();this._loadKml();this._updateMarkers();this._updateObjects();this._addMapListeners();this.fire("google-map-ready")},_mapApiLoaded:function(){this._initGMap()},_getMapOptions:function(){var mapOptions={zoom:this.zoom,tilt:this.noAutoTilt?0:45,mapTypeId:this.mapType,disableDefaultUI:this.disableDefaultUi,mapTypeControl:!this.disableDefaultUi&&!this.disableMapTypeControl,streetViewControl:!this.disableDefaultUi&&!this.disableStreetViewControl,disableDoubleClickZoom:this.disableZoom,scrollwheel:!this.disableZoom,styles:this.styles,maxZoom:+this.maxZoom,minZoom:+this.minZoom};if(null!=this.getAttribute("draggable")){mapOptions.draggable=this.draggable}for(var p in this.additionalMapOptions)mapOptions[p]=this.additionalMapOptions[p];return mapOptions},_attachChildrenToMap:function(children){if(this.map){for(var i=0,child;child=children[i];++i){child.map=this.map}}},_observeMarkers:function(){if(this._markersChildrenListener){return}this._markersChildrenListener=this.listen(this.$.selector,"items-changed","_updateMarkers")},_updateMarkers:function(){var newMarkers=Array.prototype.slice.call((0,_myApp.dom)(this.$.markers).getDistributedNodes());if(newMarkers.length===this.markers.length){var added=newMarkers.filter(function(m){return this.markers&&-1===this.markers.indexOf(m)}.bind(this));if(0===added.length){if(!this._markersChildrenListener){this._observeMarkers()}return}}this._observeMarkers();this.markers=this._setMarkers(newMarkers);this._attachChildrenToMap(this.markers);if(this.fitToMarkers){this._fitToMarkersChanged()}},_observeObjects:function(){if(this._objectsMutationObserver){return}this._objectsMutationObserver=new MutationObserver(this._updateObjects.bind(this));this._objectsMutationObserver.observe(this,{childList:!0})},_updateObjects:function(){var newObjects=Array.prototype.slice.call((0,_myApp.dom)(this.$.objects).getDistributedNodes());if(newObjects.length===this.objects.length){var added=newObjects.filter(function(o){return-1===this.objects.indexOf(o)}.bind(this));if(0===added.length){this._observeObjects();return}}this._observeObjects();this._setObjects(newObjects);this._attachChildrenToMap(this.objects)},clear:function(){for(var i=0,m;m=this.markers[i];++i){m.marker.setMap(null)}},resize:function(){if(this.map){var oldLatitude=this.latitude,oldLongitude=this.longitude;google.maps.event.trigger(this.map,"resize");this.latitude=oldLatitude;this.longitude=oldLongitude;if(this.fitToMarkers){this._fitToMarkersChanged()}}},_loadKml:function(){if(this.map&&this.kml){new google.maps.KmlLayer({url:this.kml,map:this.map})}},_debounceUpdateCenter:function(){this.debounce("updateCenter",this._updateCenter)},_updateCenter:function(){this.cancelDebouncer("updateCenter");if(this.map&&this.latitude!==void 0&&this.longitude!==void 0){var lati=+this.latitude;if(isNaN(lati)){throw new TypeError("latitude must be a number")}var longi=+this.longitude;if(isNaN(longi)){throw new TypeError("longitude must be a number")}var newCenter=new google.maps.LatLng(lati,longi),oldCenter=this.map.getCenter();if(!oldCenter){this.map.setCenter(newCenter)}else{oldCenter=new google.maps.LatLng(oldCenter.lat(),oldCenter.lng());if(!oldCenter.equals(newCenter)){this.map.panTo(newCenter)}}}},_zoomChanged:function(){if(this.map){this.map.setZoom(+this.zoom)}},_idleEvent:function(){if(this.map){this._forwardEvent("idle")}else{this._clearListener("idle")}},_clickEventsChanged:function(){if(this.map){if(this.clickEvents){this._forwardEvent("click");this._forwardEvent("dblclick");this._forwardEvent("rightclick")}else{this._clearListener("click");this._clearListener("dblclick");this._clearListener("rightclick")}}},_dragEventsChanged:function(){if(this.map){if(this.dragEvents){this._forwardEvent("drag");this._forwardEvent("dragend");this._forwardEvent("dragstart")}else{this._clearListener("drag");this._clearListener("dragend");this._clearListener("dragstart")}}},_mouseEventsChanged:function(){if(this.map){if(this.mouseEvents){this._forwardEvent("mousemove");this._forwardEvent("mouseout");this._forwardEvent("mouseover")}else{this._clearListener("mousemove");this._clearListener("mouseout");this._clearListener("mouseover")}}},_maxZoomChanged:function(){if(this.map){this.map.setOptions({maxZoom:+this.maxZoom})}},_minZoomChanged:function(){if(this.map){this.map.setOptions({minZoom:+this.minZoom})}},_mapTypeChanged:function(){if(this.map){this.map.setMapTypeId(this.mapType)}},_disableDefaultUiChanged:function(){if(!this.map){return}this.map.setOptions({disableDefaultUI:this.disableDefaultUi})},_disableMapTypeControlChanged:function(){if(!this.map){return}this.map.setOptions({mapTypeControl:!this.disableMapTypeControl})},_disableStreetViewControlChanged:function(){if(!this.map){return}this.map.setOptions({streetViewControl:!this.disableStreetViewControl})},_disableZoomChanged:function(){if(!this.map){return}this.map.setOptions({disableDoubleClickZoom:this.disableZoom,scrollwheel:!this.disableZoom})},attributeChanged:function(attrName){if(!this.map){return}switch(attrName){case"draggable":this.map.setOptions({draggable:this.draggable});break;}},_fitToMarkersChanged:function(){if(this.map&&this.fitToMarkers&&0<this.markers.length){for(var latLngBounds=new google.maps.LatLngBounds,i=0,m;m=this.markers[i];++i){latLngBounds.extend(new google.maps.LatLng(m.latitude,m.longitude))}if(1<this.markers.length){this.map.fitBounds(latLngBounds)}this.map.setCenter(latLngBounds.getCenter())}},_addMapListeners:function(){google.maps.event.addListener(this.map,"center_changed",function(){var center=this.map.getCenter();this.latitude=center.lat();this.longitude=center.lng()}.bind(this));google.maps.event.addListener(this.map,"zoom_changed",function(){this.zoom=this.map.getZoom()}.bind(this));google.maps.event.addListener(this.map,"maptypeid_changed",function(){this.mapType=this.map.getMapTypeId()}.bind(this));this._clickEventsChanged();this._dragEventsChanged();this._mouseEventsChanged();this._idleEvent()},_clearListener:function(name){if(this._listeners[name]){google.maps.event.removeListener(this._listeners[name]);this._listeners[name]=null}},_forwardEvent:function(name){this._listeners[name]=google.maps.event.addListener(this.map,name,function(event){this.fire("google-map-"+name,event)}.bind(this))},_deselectMarker:function(e){var markerIndex=this.$.selector.indexOf(e.target);if(this.singleInfoWindow){this.$.selector.selected=null}else if(this.$.selector.selectedValues){this.$.selector.selectedValues=this.$.selector.selectedValues.filter(function(i){return i!==markerIndex})}}});class PlasticMapMarkerSvg extends customElements.get("google-map-marker"){static get is(){return"plastic-map-marker-svg"}static get template(){if(!window.PlasticMapMarkerSvgTemplate){window.PlasticMapMarkerSvgTemplate=customElements.get("google-map-marker").template.cloneNode(!0)}return window.PlasticMapMarkerSvgTemplate}static get properties(){return{iconName:{type:String},iconHeight:{type:Number,value:0},iconWidth:{type:Number,value:0},iconData:{type:Object,value:()=>{return{}}},_plasticIcon:{type:Object}}}static get observers(){return["_iconAssignkmentTime(map, iconName, iconWidth, iconHeight, iconData)","_updatePosition(latitude, longitude)"]}_getPlasticMarkerIcon(iconName,iconWidth,iconHeight,iconData){return new Promise(resolve=>{let result;if(iconName){let iconNameParts=iconName.split(":");if(2==iconNameParts.length&&iconNameParts[0]&&iconNameParts[1]){this._getMarkerSet(iconNameParts[0]).then(mis=>{let markerIconSet=mis;if(markerIconSet){result=markerIconSet.getMarkerIcon(iconNameParts[1],iconWidth,iconHeight,iconData);if(!result){console.warn("icon definition not found: "+iconNameParts[1])}}else{console.warn("map marker icon set is not registered: "+iconNameParts[0])}resolve(result)})}else{console.warn("map marker icon names must be in form set:name");resolve(result)}}else{resolve(result)}})}_iconAssignkmentTime(map,iconName,iconWidth,iconHeight,iconData){if(map){if(iconName){this._getPlasticMarkerIcon(iconName,iconWidth,iconHeight,iconData).then(i=>{this.icon=i})}else{this.icon=null}}}_getMarkerSet(setName){return new Promise(resolve=>{let meta=_myApp.Base.create("iron-meta",{type:"plasticMapMarkerSet"});if(meta&&"function"===typeof meta.byKey&&meta.byKey(setName)){resolve(meta.byKey(setName))}else{document.addEventListener("plastic-map-marker-set-added",e=>{if(e.detail.set==setName){meta=_myApp.Base.create("iron-meta",{type:"plasticMapMarkerSet"});let markerIconSet=meta.byKey(setName);if(markerIconSet){resolve(markerIconSet)}else{resolve(null)}}})}})}}window.customElements.define(PlasticMapMarkerSvg.is,PlasticMapMarkerSvg);class MyView2 extends _myApp.PolymerElement{static get template(){return _myApp.html`
      <style include="shared-styles iron-flex iron-flex-alignment">
        :host {
          display: block;

          padding: 10px;
        }
        google-map {
        width: 500px;
        height: 400px;
      }
      </style>
     
      <google-map latitude="40.7555" longitude="-73.985" on-google-map-ready="_mapReady" fit-to-markers api-key="[[apiKey]]">
      <template is="dom-repeat" items="[[meetings]]" as="m">
        <plastic-map-marker-svg slot="markers" click-events 
        latitude="[[m.latLng.lat]]" longitude="[[m.latLng.lng]]" 
        icon-name="my-markers:tdpin" icon-height="60" icon-width="60" 
        icon-data="[[m.markerStyle]]"
        on-google-map-marker-click="_markerClick">
        </plastic-map-marker-svg>
      </template>
      <plastic-map-info id="myinfocard" fade-in>
        <div class="layout vertical">
          <div style="width:100%; background-color: [[meeting.markerStyle.pinColor]]; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[meeting.place]]</div>
          <div class="layout vertical" style="border: 2px solid [[meeting.markerStyle.pinColor]]; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[meeting.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </google-map>
    <template is="dom-repeat" items="[[attending]]" as="a">
      <div>You are confirmed for a meeting at [[a.place]], [[a.meetingTime]]</div>
    </template>
    <div id="sources"></div>
    `}static get properties(){return{apiKey:{type:String,value:"AIzaSyBmsetVvB1KlWoSbEXYQg1leRZO1PVPm_Q",notify:!0},apiLoaded:{type:Boolean,value:!1,notify:!0},_theMap:{type:Object,value:null,notify:!0},meeting:{type:Object,notify:!0},meetings:{type:Array,value:function(){return[]}},attending:{type:Array,notify:!0,value:function(){return[]}}}}connectedCallback(){super.connectedCallback();this.meetings=[{locationId:"a20",markerStyle:{pinColor:"#e6b8f2",markerNum:20},latLng:{lat:40.750454,lng:-73.993519},place:"Pen Station / Madison Square Garden",schedule:[{meetingId:"m120",meetingTime:"07/01/2017 10:00am"},{meetingId:"m125",meetingTime:"07/05/2017 2:00pm"},{meetingId:"m130",meetingTime:"07/31/2017 11:00am"}]},{locationId:"a22",markerStyle:{pinColor:"#dd79f7",markerNum:22},latLng:{lat:40.761449,lng:-73.977622},place:"MoMA",schedule:[{meetingId:"m121",meetingTime:"07/02/2017 10:30am"},{meetingId:"m126",meetingTime:"07/06/2017 3:00pm"}]},{locationId:"a24",markerStyle:{pinColor:"#c609f7",markerNum:24},latLng:{lat:40.74829,lng:-73.985599},place:"Empire State Building",schedule:[{meetingId:"m131",meetingTime:"07/29/2017 9:30am"},{meetingId:"m122",meetingTime:"08/02/2017 10:30am"},{meetingId:"m127",meetingTime:"08/06/2017 1:00am"},{meetingId:"m133",meetingTime:"08/29/2017 9:45am"}]}];setTimeout(()=>{this._showSource()},1e3)}_mapReady(){}_markerClick(e){this.meeting=e.model.get("m");this.$.myinfocard.showInfoWindow(e.target.marker)}_attending(e){var s=e.model.get("sch");this.push("attending",{place:this.meeting.place,meetingTime:s.meetingTime})}_showSource(){const mapMarkup=hljs.highlight("xml",`
    <google-map latitude="40.7555" longitude="-73.985" on-google-map-ready="_mapReady" fit-to-markers api-key="[[apiKey]]">
      <template is="dom-repeat" items="[[meetings]]" as="m">
        <plastic-map-marker-svg slot="markers" click-events 
          latitude="[[m.latLng.lat]]" longitude="[[m.latLng.lng]]" 
          icon-name="my-markers:tdpin" icon-height="60" icon-width="60" 
          icon-data="[[m.markerStyle]]"
          on-google-map-marker-click="_markerClick">
        </plastic-map-marker-svg>
      </template>
      <plastic-map-info id="myinfocard" fade-in>
        <div class="layout vertical">
          <div style="width:100%; background-color: [[meeting.markerStyle.pinColor]]; font-weight: bold; color: white; padding: 5px 5px 5px 9px;">[[meeting.place]]</div>
          <div class="layout vertical" style="border: 2px solid [[meeting.markerStyle.pinColor]]; padding: 5px 5px 5px 9px;">
            <template is="dom-repeat" items="[[meeting.schedule]]" as="sch">
              <div class="layout horizontal">
                <paper-icon-button id="[[sch.meetingId]]" icon="social:person-add" on-tap="_attending"></paper-icon-button>
                <span>[[sch.meetingTime]]</span>
              </div>
            </template>
          </div>
        </div>
      </plastic-map-info>
    </google-map>
    <template is="dom-repeat" items="[[attending]]" as="a">
      <div>You are confirmed for a meeting at [[a.place]], [[a.meetingTime]]</div>
    </template>
    `);this.$.sources.innerHTML=`
    <h2>Basic Example with &lt;google-map&gt; Element</h2>
    <p>In this example the <b>google-map</b> and <b>plastic-map-marker-svg</b> elements are used to create the map.
    Custom markers are used from a <b>plastic-map-marker-set</b>.</p>
    <h3>Markup</h3>
    <pre><code class="html">${mapMarkup.value}</code></pre>`;const jsCode=hljs.highlight("javascript",`
    connectedCallback() {
      super.connectedCallback();
      // do more stuff
      this.meetings = [{
        locationId: "a20",
        markerStyle: {
          pinColor: "#e6b8f2",
          markerNum: 20
        },
        latLng: {
          lat: 40.750454,
          lng: -73.993519
        },
        place: "Pen Station / Madison Square Garden",
        schedule: [{
          meetingId: "m120",
          meetingTime: "07/01/2017 10:00am"
        }, {
          meetingId: "m125",
          meetingTime: "07/05/2017 2:00pm"
        }, {
          meetingId: "m130",
          meetingTime: "07/31/2017 11:00am"
        }]
      }, 
      // etc. 
    ];
  }

  _markerClick(e) {
      this.meeting = e.model.get('m');
      this.$.myinfocard.showInfoWindow(e.target.marker);
    }
  _attending(e) {
    var s = e.model.get('sch');
    this.push('attending', {
      place: this.meeting.place,
      meetingTime: s.meetingTime
    });
  }
    `);this.$.sources.innerHTML+=`<h3>Javascript</h3>
    <p>This illustrates handling the marker click event to show the infowindow and the handler on the paper-icon-button in the infowindow.</p>
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
    <p>This creates a set of SVG map markers (Polymer 3 syntax).  In the example, 'tdpin' is used (first one). 
    That marker has substitution values <b>pinColor</b> and <b>markerNum</b>.</p>
    <pre><code class="javascript">${markerCode.value}</code></pre>`}}window.customElements.define("my-view2",MyView2)});