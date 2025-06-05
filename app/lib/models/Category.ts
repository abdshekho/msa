import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface ICategory extends Document {
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
    parentId?: mongoose.Types.ObjectId | null;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

// const CategorySchema: Schema = new Schema(
//     {
//         name: { type: String, required: true, trim: true },
//         nameAr: { type: String, required: true, trim: true },
//         slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
//         image: { type: String },
//         description: { type: String },
//         descriptionAr: { type: String },
//         parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
//         isActive: { type: Boolean, default: true },
//         order: { type: Number, default: 0 }
//     },
//     { timestamps: true }
// );
const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        nameAr: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        image: { type: String },
        description: { type: String },
        descriptionAr: { type: String },
        parentId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
            default: null,
            set: (v: string) => v === "" ? null : v,        },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
    },
        syriaTimezoneSchemaOptions
);

// Create indexes for better performance
CategorySchema.index({ name: 1 });
// CategorySchema.index({ slug: 1 }); in sechema unique : true,creates an index so not need it 
CategorySchema.index({ parentId: 1 });

// Virtual for getting subcategories
CategorySchema.virtual('subcategories', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parentId'
});

// Method to generate slug from name
CategorySchema.pre('validate', function (this: ICategory, next) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});
const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
