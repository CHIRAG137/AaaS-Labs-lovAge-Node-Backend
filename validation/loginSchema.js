const zod = require('zod');

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

module.exports = loginSchema;
