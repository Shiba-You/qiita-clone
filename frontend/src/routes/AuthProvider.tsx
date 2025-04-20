import React, { useEffect, useState, createContext, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
// 認証コンテキストの作成
interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  // 必要に応じてユーザー情報などを追加
}
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
});

// 認証プロバイダー
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // コンポーネントのマウント時に JWT の存在を確認 (Cookie から)
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/check-auth",
          {
            method: "GET",
            credentials: "include", // ← これがないとクッキーが共有されない！
          }
        ); // バックエンドに認証チェックAPIを作成
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// カスタムフック
export const useAuth = () => useContext(AuthContext);

// 認証が必要なルートを保護するコンポーネント
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>ちょっと待ってね</div>;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
