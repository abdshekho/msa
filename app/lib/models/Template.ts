import mongoose, { Schema, Document } from 'mongoose';
import { syriaTimezoneSchemaOptions } from './schemaOptions';

export interface ITemplate extends Document {
    name: string;
    headers: string[];
    rows: {
        parameter: string;
        values: string[];
        isSectionHeader?: boolean;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const TemplateSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        headers: [{ type: String, required: true }],
        rows: [{
            parameter: { type: String, required: true },
            values: [{ type: String }],
            isSectionHeader: { type: Boolean, default: false }
        }]
    },
        syriaTimezoneSchemaOptions

);

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);