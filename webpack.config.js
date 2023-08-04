const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
  target: "node",
  //   mode: "production",
  mode: "none",

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
