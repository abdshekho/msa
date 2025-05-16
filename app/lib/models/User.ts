import mongoose, { Schema, Document } from 'mongoose';

export interface Iuser extends Document {
    name: string;
    email: string;
    username: string;
    password?: string;
    phone?: string;
    address?: string;
    image: Date;
    role: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        username: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String },
        phone: { type: String },
        address: { type: String },
        image: { type: String },
        role: { type: String },
    },
    { timestamps: true }
);

// Create indexes for better performance
UserSchema.index({ name: 1 });
// UserSchema.index({ slug: 1 }); in sechema unique : true,creates an index so not need it 
UserSchema.index({ parentId: 1 });

// Virtual for getting subcategories


// Method to generate slug from name
// UserSchema.pre('validate', function (this: IBrand, next) {
//     if (this.name && !this.slug) {
//         this.slug = this.name
//             .toLowerCase()
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/(^-|-$)/g, '');
//     }
//     next();
// });
const User = mongoose.models.User || mongoose.model<IBrand>('User', UserSchema);

export default User;
