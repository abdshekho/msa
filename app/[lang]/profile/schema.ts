import { z } from "zod";

// Types for the form data
export type ProfileFormData = {
  name: string;
  phone?: string;
  address?: string;
  image?: string;
};

export type PasswordFormData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Create schemas with translated validation messages
export const createProfileSchema = (dictionary: any) => {
  const errorMessages = dictionary.error.profile;
  
  return z.object({
    name: z.string().min(2, errorMessages['name-min']),
    phone: z.string().min(10, errorMessages['phone-min']).optional().or(z.literal("")),
    address: z.string().min(5, errorMessages['address-min']).optional().or(z.literal("")),
    image: z.string().optional().or(z.literal(""))
  });
};

export const createPasswordSchema = (dictionary: any) => {
  const errorMessages = dictionary.error.profile;
  
  return z.object({
    currentPassword: z.string().min(6, errorMessages['current-password-min']),
    newPassword: z.string().min(6, errorMessages['new-password-min']),
    confirmPassword: z.string().min(6, errorMessages['confirm-password-min'])
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: errorMessages['passwords-match'],
    path: ["confirmPassword"]
  });
};