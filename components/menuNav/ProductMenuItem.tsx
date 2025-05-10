import React from 'react'
import styles from './NavMenu.module.css';
export default function ProductMenuItem({ item, onSelect }: any) {
    return (
        <div className={ styles.dropdownItemProduct } onMouseEnter={() => onSelect(item)}>
            { item.name }
        </div>
    )
}
