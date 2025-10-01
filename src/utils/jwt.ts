import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateAccessToken = (uid: number, role: string): string => {
  return jwt.sign({ id: uid, role }, process.env.JWT_ACCESS_KEY ?? '', {
    expiresIn: '7d',
  });
};
export const generateRefreshToken = (uid: number): string => {
  return jwt.sign({ id: uid }, process.env.JWT_REFRESH_KEY as string, {
    expiresIn: '30d',
  });
};
