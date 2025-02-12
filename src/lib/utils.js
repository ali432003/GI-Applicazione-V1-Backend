import "dotenv/config";
import jwt from "jsonwebtoken";
const { sign } = jwt;

export const generateAndSaveToken = (user, res) => {
  const token = sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie(`token`, `Bearer ${token}`, { httpOnly: true });
  //   return token
};
