import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Category from '@/app/lib/models/Category';
import Product from '@/app/lib/models/Product'; // Assuming you have a Product model

// Get all categories
// export async function GET(request) {
//     try {
//         const { searchParams } = new URL(request.url);
//         const parentId = searchParams.get('parentId');
//         const notNull = searchParams.get('notNull');
//         const fields = searchParams.get('fields');
//         const withProducts = searchParams.get('withProducts') === 'true';
//         const nested = searchParams.get('nested') === 'true';

//         // If nested structure is requested, handle it differently
//         if (nested) {
//             await connectToDatabase();

//             // First, get all parent categories (where parentId is null)
//             const parentCategories = await Category.find({ parentId: null })
//                 .sort({ order: 1, name: 1 });

//             // For each parent category, get its subcategories
//             const result = await Promise.all(parentCategories.map(async (parentCategory) => {
//                 const subcategories = await Category.find({ parentId: parentCategory._id })
//                     .sort({ order: 1, name: 1 });

//                 // If withProducts is true, get products for each subcategory
//                 if (withProducts) {
//                     const subcategoriesWithProducts = await Promise.all(subcategories.map(async (subCategory) => {
//                         const products = await Product.find({ category: subCategory._id })
//                             .select('_id name slug imageCover price') // Select only needed fields
//                             .sort({ createdAt: -1 });

//                         return {
//                             id: subCategory._id,
//                             name: subCategory.name,
//                             slug: subCategory.slug,
//                             image: subCategory.image,
//                             items: products.map(product => ({
//                                 id: product._id,
//                                 name: product.name,
//                                 slug: product.slug,
//                                 imageCover: product.imageCover,
//                                 price: product.price
//                             }))
//                         };
//                     }));

//                     return {
//                         id: parentCategory._id,
//                         name: parentCategory.name,
//                         slug: parentCategory.slug,
//                         imageCover: parentCategory.imageCover,
//                         items: subcategoriesWithProducts
//                     };
//                 } else {
//                     // Return just the subcategories without products
//                     return {
//                         id: parentCategory._id,
//                         name: parentCategory.name,
//                         slug: parentCategory.slug,
//                         image: parentCategory.image,
//                         items: subcategories.map(subCategory => ({
//                             id: subCategory._id,
//                             name: subCategory.name,
//                             slug: subCategory.slug,
//                             image: subCategory.image
//                         }))
//                     };
//                 }
//             }));

//             return NextResponse.json(result);
//         }

//         // Handle regular category queries (existing functionality)
//         const query = {};
//         if (parentId === 'null') {
//             query.parentId = null;
//         } else if (parentId) {
//             query.parentId = parentId;
//         }

//         // Add condition for notNull parameter
//         if (notNull === 'true') {
//             query.parentId = { $ne: null };
//         }

//         await connectToDatabase();

//         let projection = {};
//         // If fields parameter is provided, only return those fields
//         if (fields) {
//             const fieldList = fields.split(',');
//             fieldList.forEach(field => {
//                 projection[field] = 1;
//             });
//         }

//         const categories = await Category.find(query, projection)
//             .sort({ order: 1, name: 1 })
//             .populate('subcategories');

//         return NextResponse.json(categories);
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//         return NextResponse.json(
//             { error: 'Failed to fetch categories' },
//             { status: 500 }
//         );
//     }
// }
export async function GET( request ) {
    try {
        const { searchParams } = new URL( request.url );
        const parentId = searchParams.get( 'parentId' );
        const notNull = searchParams.get( 'notNull' ) === 'true';
        const fields = searchParams.get( 'fields' );
        const slug = searchParams.get( 'slug' );
        const withProducts = searchParams.get( 'withProducts' ) === 'true';
        const withProductCount = searchParams.get( 'withProductCount' ) === 'true';
        const nested = searchParams.get( 'nested' ) === 'true';

        await connectToDatabase();

        // NESTED STRUCTURE
        if ( nested ) {
            // Step 1: Fetch all categories in one go
            const allCategories = await Category.find().sort( { order: 1, name: 1 } ).lean();

            // Step 2: Group categories by parentId
            const categoryMap = new Map();
            allCategories.forEach( cat => {
                const key = cat.parentId?.toString() || 'root';
                if ( !categoryMap.has( key ) ) categoryMap.set( key, [] );
                categoryMap.get( key ).push( cat );
            } );

            const rootCategories = categoryMap.get( 'root' ) || [];

            // Step 3: Build nested structure
            const result = await Promise.all(
                rootCategories.map( async parent => {
                    const subcategories = categoryMap.get( parent._id.toString() ) || [];

                    let items;
                    if ( withProducts ) {
                        // Fetch all products in one query
                        const subCategoryIds = subcategories.map( sub => sub._id );
                        const products = await Product.find( { category: { $in: subCategoryIds } } )
                            .select( '_id name slug imageCover price category' )
                            .sort( { createdAt: -1 } )
                            .lean();
                        // console.log('fffff',products);

                        // Group products by category
                        const productMap = new Map();
                        products.forEach( prod => {
                            const key = prod.category.toString();
                            if ( !productMap.has( key ) ) productMap.set( key, [] );
                            productMap.get( key ).push( prod );
                        } );

                        items = subcategories.map( sub => ( {
                            id: sub._id,
                            name: sub.name,
                            slug: sub.slug,
                            image: sub.image,
                            items: ( productMap.get( sub._id.toString() ) || [] ).map( prod => ( {
                                id: prod._id,
                                name: prod.name,
                                slug: prod.slug,
                                imageCover: prod.imageCover,
                                price: prod.price,
                            } ) ),
                        } ) );
                    } else if ( withProductCount ) {
                        const categoriesWithCounts = await Category.aggregate( [
                            {
                                $lookup: {
                                    from: 'products', // اسم مجموعة المنتجات في قاعدة البيانات
                                    localField: '_id',
                                    foreignField: 'category',
                                    as: 'products',
                                },
                            },
                            {
                                $addFields: {
                                    productCount: { $size: '$products' },
                                },
                            },
                            {
                                $project: {
                                    products: 0, // نحذف قائمة المنتجات إذا ما بدنا نعرضها
                                },
                            },
                            {
                                $sort: {
                                    createdAt: -1,
                                },
                            },
                        ] );
                        items = subcategories.map( sub => ( {
                            id: sub._id,
                            name: sub.name,
                            slug: sub.slug,
                            image: sub.image,
                            productCount: categoriesWithCounts.find( c => c._id.toString() === sub._id.toString() )
                                ?.productCount || 0,
                        } ) );
                    } else {
                        items = subcategories.map( sub => ( {
                            id: sub._id,
                            name: sub.name,
                            slug: sub.slug,
                            image: sub.image,
                        } ) );
                    }

                    return {
                        id: parent._id,
                        name: parent.name,
                        slug: parent.slug,
                        image: parent.image,
                        items,
                    };
                } )
            );

            return NextResponse.json( result );
        }

        if ( slug ) {
            const category = await Category.findOne( { slug:slug.toString().trim() } );
            return NextResponse.json( category );
        }
        // FLAT CATEGORY STRUCTURE
        const query = {};
        if ( parentId === 'null' ) query.parentId = null;
        else if ( parentId ) query.parentId = parentId;
        if ( notNull ) query.parentId = { $ne: null };

        const projection = fields
            ? fields.split( ',' ).reduce( ( acc, f ) => ( { ...acc, [ f ]: 1 } ), {} )
            : {};

        const categories = await Category.find( query, projection )
            .sort( { order: 1, name: 1 } )
            .lean();

        return NextResponse.json( categories );
    } catch ( error ) {
        console.error( 'Error fetching categories:', error );
        return NextResponse.json( { error: 'Failed to fetch categories' }, { status: 500 } );
    }
}

// Create a new category
export async function POST( request ) {
    try {
        const categoryData = await request.json();

        // Validate required fields
        if ( !categoryData.name || !categoryData.nameAr ) {
            return NextResponse.json(
                { error: 'Name and Arabic name are required' },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        if ( !categoryData.slug ) {
            categoryData.slug = categoryData.name
                .toLowerCase()
                .replace( /[^a-z0-9]+/g, '-' )
                .replace( /(^-|-$)/g, '' );
        }

        // Convert empty parentId to null
        if ( categoryData.parentId === "" ) {
            categoryData.parentId = null;
        }

        await connectToDatabase();

        // Check if slug already exists
        const existingCategory = await Category.findOne( { slug: categoryData.slug } );
        if ( existingCategory ) {
            return NextResponse.json(
                { error: 'A category with this slug already exists' },
                { status: 409 }
            );
        }

        const category = await Category.create( categoryData );

        return NextResponse.json( {
            message: 'Category created successfully',
            category
        }, { status: 201 } );
    } catch ( error ) {
        console.error( 'Error creating category:', error );
        return NextResponse.json(
            { error: 'Failed to create category', details: error.message },
            { status: 500 }
        );
    }
}
