import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface IProduct extends Document {
    name: string;
    nameAr: string;
    slug: string;
    price: number;
    imageCover: string;
    images: string[];
    category: mongoose.Schema.Types.ObjectId;
    brand: mongoose.Schema.Types.ObjectId;
    // subcategory: string;
    desc: string;
    descAr: string;
    features: string[];
    featuresAr: string[];
    table: {
        headers: string[];
        rows: {
            parameter: string;
            values: string[];
            isSectionHeader?: boolean;
        }[];
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        nameAr: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        price: { type: Number, required: true },
        imageCover: { type: String, required: true },
        images: [{ type: String }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        },
        desc: { type: String, required: true },
        descAr: { type: String, required: true },
        features: [{ type: String }],
        featuresAr: [{ type: String }],
        table: {
            headers: [{ type: String }],
            rows: [{
                parameter: { type: String, required: true },
                values: [{ type: String }],
                isSectionHeader: { type: Boolean, default: false }
            }]
        }
    },
    syriaTimezoneSchemaOptions
);

// Add pre-save hook to generate slug from name if not provided
// Create indexes for better performance
// ProductSchema.index({ slug: 1 });
ProductSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    }
    next();
});

// Check if the model already exists to prevent recompilation errors
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;