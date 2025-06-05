import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password?: string;
    phone?: string;
    address?: string;
    image?: string;
    role: string;
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
        role: { type: String, default: 'user' },
    },
        syriaTimezoneSchemaOptions

);

// Create indexes for better performance
UserSchema.index({ name: 1 });
UserSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;