import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance with JSDOM
const window = new JSDOM('').window;
const dompurify = DOMPurify(window);

export const sanitizeInput = (input: string): string => {
  return dompurify.sanitize(input);
};

export const sanitizeObject = (obj: any): any => {
  const sanitized: any = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = sanitizeInput(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = obj[key];
    }
  }
  
  return sanitized;
};
