const path = require('path')
const withFlowbiteReact = require('flowbite-react/plugin/nextjs')

module.exports = withFlowbiteReact({
    webpack: (config: any) => {
        config.resolve.alias['@lib'] = path.join(__dirname, 'lib')
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'flowbite',
                port: '*',
                pathname: '/account123/**',
                search: '',
            },
        ],
    },
})
    // "next": "15.3.1",
