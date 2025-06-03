import { log } from 'console';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if ( !MONGODB_URI ) {
    throw new Error( 'MONGODB_URI must be defined' );
}

/**
 * متغير عام لحالة الاتصال
 */
declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

// في بيئة التطوير، نحتفظ بالاتصال عبر التحميلات الساخنة
let cached = global.mongoose;

if ( !cached ) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if ( cached.conn ) {
        return cached.conn;
    }

    if ( !cached.promise ) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect( MONGODB_URI, opts ).then( ( mongoose ) => {
            console.log( '✅MongoDB is connecting ....✅' );
            return mongoose;
        } ) as any;
    }

    try {
        cached.conn = await cached.promise;
        log( '✅ MongoDB connected ✅' );
    } catch ( e ) {
        cached.promise = null;
        log( '❌ Connect Error in MongoDB ❌' ); 
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
