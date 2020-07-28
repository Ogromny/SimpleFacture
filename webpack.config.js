const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const VuetifyLoaderPlugin = require("vuetify-loader/lib/plugin");

const mode = "production";

module.exports = {
    entry: "./app.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    resolve: {
        alias: {
            vue: "vue/dist/vue.esm.js",
        },
    },
    module: {
        rules: [
            { test: /\.s[ac]ss$/, use: ["css-loader", "sass-loader"] },
            { test: /\.css$/, use: ["vue-style-loader", "css-loader"] },
            { test: /\.vue$/, use: "vue-loader" },
            { test: /\.pug$/, use: "pug-plain-loader" },
            { test: /\.js$/, use: "babel-loader", exclude: /node_modules/ },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
        ],
    },
    plugins: [new VueLoaderPlugin(), new VuetifyLoaderPlugin()],
    mode,
    devtool: mode == "development" ? "eval-source-map" : "",
};
