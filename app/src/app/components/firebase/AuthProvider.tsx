"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  User as AuthUser,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { User, getClientConverter } from "@/app/resources/types/Firestore";
import { doc, getFirestore } from "firebase/firestore/lite";
import { getDoc } from "firebase/firestore";

interface AuthContextType {
  authUser?: AuthUser;
  user?: User;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface Props {
  children: ReactNode;
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User>();
  const [authUser, setAuthUser] = useState<AuthUser>();
  const auth = useMemo(() => getAuth(), []);
  const firestore = useMemo(() => getFirestore(), []);

  useEffect(() => {
    // onAuthStateChangedでログインの状態を監視する
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ユーザー情報をcurrentUserに格納する
      setAuthUser(user ?? undefined);
      if (user) {
        // ユーザー情報を取得する
        getDoc(
          doc(firestore, "users", user.uid).withConverter(
            getClientConverter<User>()
          )
        ).then((doc) => {
          if (doc.exists()) {
            const data = doc.data() as User;
            setUser(data);
          }
        });
      } else {
        setUser(undefined);
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    if (user) return;
    if (auth.currentUser) return;

    // TODO: Google認証
    signInAnonymously(auth);
  }, [user, auth]);

  useEffect(() => {
    login();
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
