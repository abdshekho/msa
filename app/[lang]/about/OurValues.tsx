//@ts-nocheck
import React from 'react'
import { FaMedal, FaRecycle, FaRocket } from 'react-icons/fa'

function OurValues({ dict }) {
    const valuesData = [
        {
            id: 'innovation',
            icon: FaRocket,
            iconColor: 'text-[#e91e63]',
            title: dict.innovation.title,
            description: dict.innovation.description
        },
        {
            id: 'sustainability',
            icon: FaRecycle,
            iconColor: 'text-blue-500',
            title: dict.sustainability.title,
            description: dict.sustainability.description
        },
        {
            id: 'excellence',
            icon: FaMedal,
            iconColor: 'text-green-800',
            title: dict.excellence.title,
            description: dict.excellence.description
        }
    ]

    return (
        <div className="my-30 text-center">
            <h2 className="head-1 my-10 text-center">
                { dict.title }
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                { valuesData.map((value) => {
                    const IconComponent = value.icon
                    return (
                        <div
                            key={ value.id }
                            className="relative bg-gray-50 dark:bg-gray-800 p-6  rounded-lg shadow-md flex flex-col justify-between items-center text-center border-b-3 border-primary"
                        >
                            <IconComponent className={ `w-10 h-10 ${value.iconColor} my-4` } />
                            <h3 className="head-22 mb-3">
                                { value.title }
                            </h3>
                            <p className="desc">
                                { value.description }
                            </p>
                        </div>
                    )
                }) }
            </div>
        </div>
    )
}

export default OurValues