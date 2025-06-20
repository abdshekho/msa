'use client';

import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useSession } from 'next-auth/react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface ContactFormProps {
  dict: any;
  sessionEmail?: string;
}

// Create a type for the form data
type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm({ dict }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { data: session, status } = useSession();
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Create Zod schema with bilingual validation messages
  const createContactSchema = (dict: any) => {
    return z.object({
      name: z.string()
        .min(2, dict.validation?.nameMin || 'Name must be at least 2 characters')
        .max(50, dict.validation?.nameMax || 'Name cannot exceed 50 characters'),
      email: z.string()
        .email(dict.validation?.emailInvalid || 'Please enter a valid email address'),
      subject: z.string()
        .min(3, dict.validation?.subjectMin || 'Subject must be at least 3 characters')
        .max(100, dict.validation?.subjectMax || 'Subject cannot exceed 100 characters'),
      message: z.string()
        .min(10, dict.validation?.messageMin || 'Message must be at least 10 characters')
        .max(1000, dict.validation?.messageMax || 'Message cannot exceed 1000 characters'),
    });
  };

  const contactSchema = createContactSchema(dict);

  // Set up form with react-hook-form and zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      subject: '',
      message: ''
    }
  });

  // Set user data from session when available
  useEffect(() => {
    if (session?.user?.name) {
      setValue('name', session.user.name);
    }
    if (session?.user?.email) {
      setValue('email', session.user.email);
    }
  }, [session, setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setSubmitStatus(null);
    
    try {
      // Send email using EmailJS
      if (formRef.current) {
        await emailjs.sendForm(
          'service_3jh66n8', // Replace with your EmailJS service ID
          'template_21bddur', // Replace with your EmailJS template ID
          formRef.current,
          'RejFNzBQnNwATgRrs' // Replace with your EmailJS public key
        );
      }
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="border-b-4 border-teal-700 bg-gradient-to-br from-white to-gray-100 dark:from-gray-700 dark:to-gray-800  rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-10 text-gray-800 dark:text-white text-center">
        {dict.info.sendMessage}
      </h2>

      {submitStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {dict.form.success}
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {dict.form.error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 ">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {dict.form.name}
            </label>
            <input
              id="name"
              {...register('name')}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {dict.form.email}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              disabled={!!session?.user?.email}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.form.subject}
          </label>
          <input
            id="subject"
            {...register('subject')}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {errors.subject && (
            <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.form.message}
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={5}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-teal-700 text-white rounded-md w-full p-2.5 hover:opacity-70"
        >
          {isSubmitting ? dict.form.sending : dict.form.submit}
        </button>
      </form>
    </div>
  );
}