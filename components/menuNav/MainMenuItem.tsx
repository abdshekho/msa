"use client";
import React, { useRef, useState } from 'react'
import styles from './NavMenu.module.css';
import MenuItem from './MenuItem';



export default function MainMenuItem({ item }: any) {

    const [openSub, setOpenSub] = useState(false);
    // console.log('in Child', item);
    // console.log('name in Child', item.items);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current); // يلغي الإخفاء إذا رجعت المؤشر بسرعة
        }
        setOpenSub(true)
    };
    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenSub(false);
        }, 500); // تأخير الإخفاء نصف ثانية
    };
    return (

        <div
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave }
            className={ styles.dropdownItem }>
            <span>{ item.name } ▸</span>
            { openSub && (
                <div className={ styles.subDropdown }>
                    { item.items.map((subItem: any) => {
                        return <MenuItem title={ subItem.name } items={ subItem.items } key={ subItem._id } />
                    }) }
                </div>
            )
            }
        </div>

    )
}
