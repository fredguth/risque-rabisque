'use strict';

const GlimmerApp = require('@glimmer/application-pipeline').GlimmerApp;
const merge = require('broccoli-merge-trees');
const funnel = require('broccoli-funnel');
const path = require ('path');

module.exports = function(defaults) {
  let tachyonsPath = path.dirname(require.resolve('tachyons'));
  let tachyons = funnel(tachyonsPath, {files:['tachyons.css']})
  let styles = merge ([tachyons, 'src/ui/styles']);
  let app = new GlimmerApp(defaults, {
    trees: { styles }
  });

   return app.toTree();
};
