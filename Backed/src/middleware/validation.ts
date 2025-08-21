import { Request, Response, NextFunction } from 'express';
import { object, string, number } from 'yup';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: err.errors
      });
    }
  };
};

export const registerSchema = object({
  username: string().required('Username is required').min(3).max(30),
  email: string().required('Email is required').email('Invalid email'),
  password: string().required('Password is required').min(6)
});

export const loginSchema = object({
  email: string().required('Email is required').email('Invalid email'),
  password: string().required('Password is required')
});

export const linkSchema = object({
  title: string().required('Title is required').max(50),
  url: string().required('URL is required').url('Invalid URL'),
  icon: string().url('Invalid icon URL'),
  isActive: boolean().default(true),
  order: number().default(0)
});

export const productSchema = object({
  name: string().required('Name is required').max(100),
  description: string().required('Description is required').max(1000),
  price: number().required('Price is required').min(0),
  currency: string().default('USD').oneOf(['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']),
  imageUrl: string().url('Invalid image URL'),
  isActive: boolean().default(true)
});
