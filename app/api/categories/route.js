import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/DB/mongoDB';
import Category from '@/app/lib/models/Category';
import Product from '@/app/lib/models/Product'; // Assuming you have a Product model

export async function GET( request ) {
    try {
        const { searchParams } = new URL( request.url );
        const parentId = searchParams.get( 'parentId' );
        const notNull = searchParams.get( 'notNull' ) === 'true';
        const slug = searchParams.get( 'slug' );
        const limit = searchParams.get( 'limit' );
        const withProducts = searchParams.get( 'withProducts' ) === 'true';
        const withProductCount = searchParams.get( 'withProductCount' ) === 'true';
        const nested = searchParams.get( 'nested' ) === 'true';
        const fields = searchParams.get( 'fields' );
        const projection = fields
            ? fields.split( ',' ).reduce( ( acc, f ) => ( { ...acc, [ f ]: 1 } ), {} )
            : {};


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
                            _id: sub._id,
                            name: sub.name,
                            nameAr: sub.nameAr,
                            slug: sub.slug,
                            image: sub.image,
                            items: ( productMap.get( sub._id.toString() ) || [] ).map( prod => ( {
                                _id: prod._id,
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
                            _id: sub._id,
                            name: sub.name,
                            nameAr: sub.nameAr,
                            slug: sub.slug,
                            image: sub.image,
                            productCount: categoriesWithCounts.find( c => c._id.toString() === sub._id.toString() )
                                ?.productCount || 0,
                        } ) );

                    }
                    // without products or products counts
                    else {
                        items = subcategories.map( sub => ( {
                            _id: sub._id,
                            name: sub.name,
                            nameAr: sub.nameAr,
                            slug: sub.slug,
                            image: sub.image,
                        } ) );
                    }

                    return {
                        _id: parent._id,
                        name: parent.name,
                        nameAr: parent.nameAr,
                        slug: parent.slug,
                        image: parent.image,
                        items,
                    };
                } )
            );

            return NextResponse.json( result );
        }
        // get Category by slug
        else if ( slug && !notNull ) {
            const categoryBySlug = await Category.findOne( { slug: slug.toString().trim() } );
            return NextResponse.json( categoryBySlug );
        }
        //get Child by slug of parent
        else if ( slug && notNull ) {
            const categoryWithSubs = await Category.aggregate( [
                {
                    $match: { slug: slug.trim() } // جلب الكاتيجوري الأب
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: 'parentId',
                        as: 'subcategories'
                    }
                },
                {
                    $unwind: {
                        path: "$subcategories",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "subcategories._id",
                        foreignField: "category",
                        as: "subcategories.products"
                    }
                },
                {
                    $addFields: {
                        "subcategories.productCount": { $size: "$subcategories.products" }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        nameAr: { $first: "$nameAr" },
                        slug: { $first: "$slug" },
                        image: { $first: "$image" },
                        description: { $first: "$description" },
                        descriptionAr: { $first: "$descriptionAr" },
                        // أي حقول تانية بدك ترجعها من الأب
                        subcategories: {
                            $push: {
                                _id: "$subcategories._id",
                                name: "$subcategories.name",
                                nameAr: "$subcategories.nameAr",
                                slug: "$subcategories.slug",
                                image: "$subcategories.image",
                                productCount: "$subcategories.productCount"
                            }
                        }
                    }
                }
            ] );

            // console.log( categoryWithSubs );
            return NextResponse.json( categoryWithSubs );
        }


        // FLAT CATEGORY STRUCTURE
        const query = {};
        if ( parentId === 'null' ) query.parentId = null;
        else if ( parentId ) query.parentId = parentId;
        if ( notNull ) query.parentId = { $ne: null };

        // limit categories
        if ( limit ) {
            const categories = await Category.find(query, projection).limit( parseInt( limit ) ).lean();
            return NextResponse.json( categories );
        }

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
