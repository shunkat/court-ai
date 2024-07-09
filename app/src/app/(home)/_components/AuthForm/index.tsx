"use client";
import Image from "next/image";
import style from "./style.module.scss";
import { useAuth } from "@/app/_components/firebase/AuthProvider";
import GoogleLoginButton from "../GoogleLoginButton";
import RoomBuildForm from "../RoomBuildForm";

export default function AuthForm() {
  const { authUser } = useAuth();

  return (
    <div className={style.homePage}>
      <div className={style.loginButton}>
        <GoogleLoginButton />
      </div>

      <div className={`${style.form} ${authUser ? style.active : ""}`}>
        <RoomBuildForm />
      </div>
    </div>
  );
}
