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
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { User } from "@/app/resources/types/Firestore";
import { doc, getFirestore } from "firebase/firestore/lite";
import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getClientConverter } from "@/app/resources/types/ClientFirestore";

interface AuthContextType {
  authUser?: AuthUser;
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
        ).then((_doc) => {
          // if (_doc.exists()) {
          //   const data = _doc.data() as User;
          // } else {
          //   setDoc(doc(firestore, "users", user.uid), {
          //     createdAt: serverTimestamp(),
          //     updatedAt: serverTimestamp(),
          //   });
          // }
        });
      } else {
      }
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async () => {
    if (auth.currentUser) {
      setAuthUser(auth.currentUser);
      return;
    }
    signInWithPopup(auth, new GoogleAuthProvider());
  }, [auth]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
