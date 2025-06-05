/**
 * Utility functions for handling timezone conversions for MongoDB
 * Syria timezone is UTC+2 (UTC+3 during daylight saving time)
 */

/**
 * Get the current date in Syria timezone
 * @returns Date object in Syria timezone
 */
export function getSyriaDate(): Date {
  // Create a date object with the current UTC time
  const now = new Date();
  
  // Get the Syria timezone offset (UTC+2 or UTC+3 during DST)
  // We need to determine if DST is in effect
  const isDST = isSyriaDST(now);
  const syriaOffsetHours = isDST ? 3 : 2; // UTC+3 during DST, UTC+2 otherwise
  
  // Convert to Syria time by adding the offset
  const utcHours = now.getUTCHours();
  const syriaHours = (utcHours + syriaOffsetHours) % 24;
  
  // Create a new date with Syria time
  const syriaDate = new Date(now);
  syriaDate.setUTCHours(syriaHours);
  
  return syriaDate;
}

/**
 * Check if Daylight Saving Time is currently in effect in Syria
 * Syria typically observes DST from late March to late October
 * @param date The date to check
 * @returns boolean indicating if DST is in effect
 */
function isSyriaDST(date: Date): boolean {
  // Get the year
  const year = date.getUTCFullYear();
  
  // DST in Syria typically starts on the last Friday of March at midnight
  // and ends on the last Friday of October at midnight
  // This is a simplified implementation - check for exact rules if needed
  
  // Create dates for the start and end of DST (approximate)
  const marchDate = new Date(Date.UTC(year, 2, 31)); // March 31
  const octoberDate = new Date(Date.UTC(year, 9, 31)); // October 31
  
  // Adjust to last Friday of March
  marchDate.setUTCDate(marchDate.getUTCDate() - (marchDate.getUTCDay() + 2) % 7);
  
  // Adjust to last Friday of October
  octoberDate.setUTCDate(octoberDate.getUTCDate() - (octoberDate.getUTCDay() + 2) % 7);
  
  // Check if current date is between DST start and end dates
  return date >= marchDate && date < octoberDate;
}

/**
 * Create a pre-save middleware for Mongoose schemas to set timestamps in Syria timezone
 * @returns Mongoose middleware function
 */
export function syriaTimezoneSaveMiddleware() {
  return function(next: Function) {
    const currentDate = getSyriaDate();
    
    if (this.isNew) {
      this.createdAt = currentDate;
    }
    this.updatedAt = currentDate;
    
    next();
  };
}