const nextConfig = {
    webpack: function (config) {
        config.module.rules.push({
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
            limit: 100000,
            name: '[name].[ext]',
            },
        },
        })
        return config
    },
    env: {
        APP_ENV: String(process.env.APP_ENV),
    },
}
module.exports = nextConfig