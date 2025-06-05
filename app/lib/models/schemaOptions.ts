import { SchemaOptions } from 'mongoose';
import { getSyriaDate } from '../utils/timeZoneUtils';

/**
 * Custom schema options for MongoDB schemas with Syria timezone
 * This will ensure all timestamps are saved in Syria time
 */
export const syriaTimezoneSchemaOptions: SchemaOptions = {
  timestamps: {
    currentTime: getSyriaDate
  }
};