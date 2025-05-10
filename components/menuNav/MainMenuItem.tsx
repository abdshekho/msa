"use client";
import React, { useState } from 'react'
import styles from './NavMenu.module.css';
import MenuItem from './MenuItem';



export default function MainMenuItem({ item }: any) {

    const [openSub, setOpenSub] = useState(false);
    console.log('in Child', item);
    console.log('name in Child', item.items);
    return (

        <div
            onMouseEnter={ () => setOpenSub(true) }
            onMouseLeave={ () => setOpenSub(false) }
            className={ styles.dropdownItem }>
            <span>{ item.name } ▸</span>
            { openSub && (
                <div className={ styles.subDropdown }>
                    { item.items.map((subItem: any) => {
                        return <MenuItem title={ subItem.name } items={ subItem.items } key={ subItem.id } />
                    }) }
                </div>
            )
            }
        </div>

    )
}
