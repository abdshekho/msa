'use client';
import React, { useState } from 'react'
import ProductMenuItem from './ProductMenuItem';
import AddToCartButton from '../products/AddToCartButton';
import Link from 'next/link';

export default function MenuItem({ title, items, lang }: any) {
    const [openSub2, setOpenSub2] = useState(false);
    const [selecetedItem, setSelecetedItem] = useState(items[0] || '')
    // const [selectedImage, setSelectedImage] = useState(items[0]?.imageCover || '');

    const handleItemSelect = (item: any) => {
        // setSelectedImage(item.imageCover);
        console.log(item);
        setSelecetedItem(item);
    }

    return (
        <div className="p-2.5 cursor-pointer whitespace-nowrap relative bg-white hover:bg-gray-100
            dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 hover:text-primary dark:hover:text-primary-10"
            onMouseEnter={ () => setOpenSub2(true) }
            onMouseLeave={ () => setOpenSub2(true) }
        >{ title } ▸
            { (openSub2 && items && items.length) && (
                <div className="absolute top-0 left-full bg-white  dark:bg-gray-700 dark:text-white min-w-[200px] shadow-md 
                w-[600px] min-h-[400px] origin-left animate-[rightToleft_0.4s_alternate]">
                    { items.map((item: any) => {
                        return <ProductMenuItem key={ item._id } item={ item } lang={ lang } onSelect={ handleItemSelect } />
                    }) }
                    <div className="absolute top-0 right-0 bg-transparent text-gray-800 h-full flex flex-col items-center justify-center p-2.5 overflow-hidden">
                        <Link href={ `/${lang}/products/${selecetedItem._id}` }>
                            <img src={ selecetedItem.imageCover || items[0]?.imageCover || '' } width={ 300 } height={ 300 } className='overflow-hidden object-contain hover:opacity-75' />
                            <div className='text-primary dark:text-primary-10 my-4'>{ selecetedItem.name }</div>
                        </Link>
                        <div className='flex w-[80%] my-4 justify-between items-center'>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">${ selecetedItem.price.toFixed(2) }</span>
                            <AddToCartButton productId={ selecetedItem._id.toString() } className='text-base flex items-center gap-2 text-white  bg-green-600 dark:bg-green-700 px-2 py-2  rounded-lg' />
                        </div>
                    </div>
                </div>
            ) }
        </div>
    )
}