import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface IService extends Document {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    slug: string;
    image?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        titleAr: { type: String, required: true },
        description: { type: String, required: true },
        descriptionAr: { type: String, required: true },
        slug: { type: String, required: true },
        image: { type: String },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 }
    },
    syriaTimezoneSchemaOptions
);

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);