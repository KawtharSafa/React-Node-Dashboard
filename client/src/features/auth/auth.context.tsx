import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthContextType = {
  token: string | null;
  isInitialized: boolean; // this to prvent loging out if refreshing page
  login: (token: string, expiredAtMs: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Define the props for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const expiredAtMs = Number(localStorage.getItem("expiredAtMs") || "0");

    if (storedToken && Date.now() < expiredAtMs) {
      setToken(storedToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("expiredAtMs");
    }

    // ready to be refreshed at any time + before expiray
    setIsInitialized(true)
  }, []);

  const login = (token: string, expiredAtMs: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("expiredAtMs", expiredAtMs.toString());
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiredAtMs");
    localStorage.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isInitialized, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthContext not found.");
  return context;
};
