const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 60),
  hobbies: z.string().min(3),
  about: z.string().optional(),
  address: z.string().min(3),
  preferredCommunication: z.array(z.string()).min(1),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

module.exports = registerSchema;
