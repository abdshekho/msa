const path = require('path')
const withFlowbiteReact = require('flowbite-react/plugin/nextjs')
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: false, // We'll register manually
    skipWaiting: true,
    sw: 'sw.js',
    publicExcludes: ['!robots.txt', '!sitemap.xml']
})

module.exports = withPWA(withFlowbiteReact({
    webpack: (config: any) => {
        config.resolve.alias['@lib'] = path.join(__dirname, 'lib'),
            config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            });
        return config
    },
    images: {
        remotePatterns: [new URL('https://lh3.googleusercontent.com/**/**')],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}))
// "next": "15.3.1",
