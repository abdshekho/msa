import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    nameAr: string;
    slug: string;
    image?: string;
    description?: string;
    descriptionAr?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        nameAr: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        image: { type: String },
        description: { type: String },
        descriptionAr: { type: String },
    },
    { timestamps: true }
);

// Create indexes for better performance
BrandSchema.index({ name: 1 });
// BrandSchema.index({ slug: 1 }); in sechema unique : true,creates an index so not need it 
BrandSchema.index({ parentId: 1 });

// Virtual for getting subcategories


// Method to generate slug from name
BrandSchema.pre('validate', function (this: IBrand, next) {
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});
const Brand = mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
