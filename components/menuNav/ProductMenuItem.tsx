import React from 'react'
import { useRouter } from 'next/navigation';
import { useIsMobile } from '../useIsmobile';
export default function ProductMenuItem({ item, onSelect, lang }: any) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const handleClick = () => {
        console.log(isMobile);
        if(isMobile)    return;
        router.push(`/${lang}/products/${item._id}`);
    };
    return (
        <span className="p-2.5 cursor-pointer whitespace-nowrap relative text-gray-800 dark:text-white 
        hover:text-primary dark:hover:text-primary-10 border-b-[1px]  border-secondary dark:border-secondary-10" 
        onMouseEnter={ () => onSelect(item) } onClick={ handleClick }>
            { item.name }
        </span>
    )
}