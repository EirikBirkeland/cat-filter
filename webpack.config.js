module.exports = {
// Replace entry file as needed
   entry: './mymithril.js',
   output: {
      path: __dirname,
      filename: "bundle.js"
   },
   module: {
      loaders: [
         { test: /\.css$/, loader: "style!css" }
      ]
   }
}
