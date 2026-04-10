const STATIC_USER = {
  id: 1,
  email: "admin@example.com",
  password: "password123",
  firstName: "Admin",
  lastName: "User",
};

// mock jwt style token for demonstration purposes
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-123";

export const login = (req, res) => {
  const { email, password } = req.body;

  if (email !== STATIC_USER.email || password !== STATIC_USER.password) {
    return res.status(401).json({ message: "Invalid credentials" });
  } else {
    // In a real application, you would generate a JWT token here
    // For this mock implementation, we return a static mock token
    // in real application, we will declare two tokens
    // one for access and one for refresh token
    // and we will set the expiration time for both tokens
    //access token will expire in 15 minutes and will be stored in local storage
    //refresh token will expire in 7 days and will be stored in http only cookie

    const expiredAtMs = Date.now() + 60 * 60 * 1000; // Token expires in 1 hour
    const expiresAt = new Date(expiredAtMs).toISOString();
    const { password, ...safeUser } = STATIC_USER;
    return res.status(200).json({
      accessToken: TOKEN,
      expiresAt: expiresAt,
      expiredAtMs: expiredAtMs,
      user: safeUser,
    });
  }
};
