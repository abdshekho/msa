const path = require('path')
const withFlowbiteReact = require('flowbite-react/plugin/nextjs')

module.exports = withFlowbiteReact({
    webpack: (config: any) => {
        config.resolve.alias['@lib'] = path.join(__dirname, 'lib'),
        config.module.rules.push({
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            });
        return config
    },
    // images: {
    //     remotePatterns: [
    //         {
    //             protocol: 'https',
    //             hostname: 'flowbite',
    //             port: '*',
    //             pathname: '/account123/**',
    //             search: '',
    //         },
    //     ],
    // },
    images: {
        remotePatterns: [new URL('https://lh3.googleusercontent.com/**/**')],
    },
})
// "next": "15.3.1",
