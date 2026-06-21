export const getJwtSecret = () => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production.');
  }

  console.warn('⚠️ JWT_SECRET is not set. Falling back to a local development secret.');
  return 'farm-mate-dev-jwt-secret';
};
