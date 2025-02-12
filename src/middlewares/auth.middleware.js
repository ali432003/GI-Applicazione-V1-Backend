import jwt from "jsonwebtoken";

export const Auth = async (req, res, next) => {
  try {
    const token = req.cookies.token?.split(" ");
    if (!token || token[0] !== `Bearer`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};
