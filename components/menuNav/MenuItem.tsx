'use client';
import React, { useState } from 'react'
import styles from './NavMenu.module.css';
import ProductMenuItem from './ProductMenuItem';

export default function MenuItem({ title, items }: any) {

    // console.log('🚀 ~ MenuItem.tsx ~ MenuItem ~ items:', items);




    const [openSub2, setOpenSub2] = useState(false);
    // const [selectedImage, setSelectedImage] = useState('https://images.unsplash.com/photo-1505740420928-5e560c06d30e');
    const [selectedImage, setSelectedImage] = useState(items[0]?.imageCover || '');
    const handleItemSelect = (item: any) => {
        setSelectedImage(item.imageCover);
    }


    return (
        <div className={ styles.dropdownItem }
            onMouseEnter={ () => setOpenSub2(true) }
            onMouseLeave={ () => setOpenSub2(false) }
        >{ title } ▸
            { (openSub2 && items && items.length ) && (

                <div className={ styles.subDropdownProudct }>
                    { items.map((item: any) => {
                        return <ProductMenuItem key={ item.id } item={ item } onSelect={ handleItemSelect } />
                    }) }
                    <div className={ styles.productDetails }>
                        <img src={ selectedImage } width={ 300 } height={ 300 } className='overflow-hidden' />
                        <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis consectetur </div>
                    </div>
                </div>
            ) }

        </div>

    )
}
