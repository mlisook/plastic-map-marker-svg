define(["./my-app.js"],function(_myApp){"use strict";class MyViewAbout extends _myApp.PolymerElement{static get template(){return _myApp.html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <h1>About the Demo</h1>
        <p>This demo is a Polymer 3.0 app based on the 3.0 version of the starter kit.</p>
        <p>Although this uses the Polymer 3.0 version of plastic-map-marker-svg, there is a
        Polymer 2.x version of the element also.  The API and use is identical. 
        <h3>Polymer 3 Install</h3>
        <p>npm i --save plastic-map-marker-svg</p>
        <h3>Polymer 2 Install</h3>
        <p>bower install --save plastic-map-marker-svg#^0.0.3</p>
        <h2>Builds and Differential Serving</h2>
        <p>The demo has 3 builds:</p><ul><li>esm-bundled</li><li>es6-bundled</li><li>es5-bundled</li></ul>
        <p>Since we are serving on a static server using Github's project page function, <a href="https://github.com/mlisook/plastic-diff-redirect">
        plastic-diff-redirect</a> is used to redirect to the best build for your browser based on the same
        selection mechanism in prpl-server-node.</p>
        <h2>Polymer 3 and the &lt;google-map&gt; Element</h2>
        <p>At the time this demo is being published (June 2018), GoogleWebComponents had not been updated 
        to Polymer 3.  So, for this demo, in the examples using the &lt;google-map&gt; element, I'm using 
        <a href="https://www.npmjs.com/package/@atomiko/google-apis-holdout">@atomiko/google-apis-holdout</a> and 
        <a href="https://www.npmjs.com/package/@atomiko/google-map-holdout">@atomiko/google-map-holdout</a>. These
        are straight modulizer ports of the original packages.</p>
        <h2>Other Map Elements</h2>
        <p>&lt;plastic-map-marker-set&gt; should work with other elements providing a google map (e.g. good-map). However,
        &lt;plastic-map-marker-svg&gt; is specific to &lt;google-map&gt; and so will not be usable.</p>
        <h2>Support</h2>
        <p>If you have any difficulty using these elements, please file an issue in the repo and I'll assist.</p>
      </div>
    `}}window.customElements.define("my-view-about",MyViewAbout)});