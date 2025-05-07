
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Teacher",
    email: "teacher@example.com",
    role: "teacher" as UserRole,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  },
  {
    id: "2",
    name: "Jane Student",
    email: "student@example.com",
    role: "student" as UserRole,
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane"
  }
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem("eduUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock authentication - find user by email
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        localStorage.setItem("eduUser", JSON.stringify(foundUser));
        setUser(foundUser);
        return true;
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("eduUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
