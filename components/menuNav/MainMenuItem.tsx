"use client";
import React, { useRef, useState } from 'react'
import MenuItem from './MenuItem';

export default function MainMenuItem({ item,lang }: any) {
    const [openSub, setOpenSub] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setOpenSub(true)
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenSub(false);
        }, 500);
    };

    return (
        <div
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
            className="md:flex justify-start md:justify-between p-2.5 cursor-pointer whitespace-nowrap relative bg-white dark:bg-gray-700 dark:text-white
                hover:bg-gray-100 hover:text-primary dark:hover:text-primary-10 dark:hover:bg-gray-600">
            <span>{ item.name } </span>
            {item.items?.length > 0 ? '▸':''} 
            { openSub && (
                <div className="relative md:absolute top-0  left-0 md:top-0  md:left-full  md:min-w-[200px] 
                shadow-none md:shadow-md origin-left animate-[rightToleft_0.3s_alternate]
                bg-white dark:bg-gray-700 dark:text-white 
                hover:bg-gray-100 dark:hover:bg-gray-600">
                    { item.items.map((subItem: any) => {
                        return <MenuItem title={ subItem.name } items={ subItem.items } key={ subItem._id } lang={lang} />
                    }) }
                </div>
            ) }
        </div>
    )
}