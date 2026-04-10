// const TOKEN = process.env.TOKEN; // PROFESSIONAL REAL WAY
// const TOKEN = "mock-token-123"; ANOTHER WAY ..

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-123";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.split(" ")[1];

  if (token !== TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
};
