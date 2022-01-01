const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Añadir el plugin al documento
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


module.exports = {
    // Entry: nos permite decir el punto de entrada de nuestra aplicación
    entry: "./src/index.js",

    // Output: nos permite decir hacia dónde va enviar lo que va a preparar webpacks
    output: {
        // path es donde estará la carpeta donde se guardará los archivos
        // Con path.resolve podemos decir dónde va estar la carpeta y la ubicación del mismo
        path: path.resolve(__dirname, "dist"),

        // filename le pone el nombre al archivo final
        filename: "[name].[contenthash].js",

        assetModuleFilename: "assets/images/[hash][ext][query]"
        
    },
    resolve: {
        // Aqui ponemos las extensiones que tendremos en nuestro proyecto para webpack los lea
        extensions: [".js"],
        
        alias: {
            "@utils": path.resolve(__dirname, "src/utils/"),
            "@templates": path.resolve(__dirname, "src/templates/"),
            "@styles": path.resolve(__dirname, "src/styles/"),
            "@images": path.resolve(__dirname, "src/assets/images/")        
        }
    },
    module: {
        rules: [
            {
                // Test declara que extensión de archivos aplicara el loader. Usamos expresiones regulares
                // Dice: Utiliza cual extencion .mjs (moduls js) o .js
                test: /\.m?js$/,

                // Use es un arreglo u objeto donde dices que loader aplicaras
                use: {
                    loader: "babel-loader"
                },

                // Exclude permite omitir archivos o carpetas especificas
                exclude: /node_modules/
            },
            {
                test: /\.css|.styl$/i, // Reconece los archivos css
                use: [
                    MiniCssExtractPlugin.loader, 
                    "css-loader",
                    "stylus-loader"
                ],
            },
            {
                test: /\.png/,
                type: "asset/resource"
            },
            {
               test: /\.(woff|woff2)$/,
               use: {
                   loader: "url-loader",
                   options: {
                       limit: 10000,
                       mimetype: "application/font-woff", // Caracteristicas de mi recurso
                       name: "[name].[contenthash].[ext]", // Que respete el nombre y la extension
                       outputPath: "./assets/fonts/",
                       publicPath: "../assets/fonts/",
                       esModule: false
                   }
               }
            }
        ]
    },
    // SECCION DE PLUGINS
    plugins: [
        new HtmlWebpackPlugin({
            // Configuaracino de plugin
            inject: true, // Inyecta el bundle al template HTML
            template: "./public/index.html", // la ruta al template
            filename: './index.html' // nombre final del archivo
        }),
        new MiniCssExtractPlugin({
            filename: "assets/[name].[contenthash].css"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),
        new CleanWebpackPlugin()
    ],
    // Agregamos la regla fuera de plugins
    optimization: { // agregamos soporte de optimizacion
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(), // Optimizacion para css
            new TerserPlugin() // Optimizacion para js
        ]
    }
}