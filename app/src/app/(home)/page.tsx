import AuthForm from "./_components/AuthForm";
import style from "./style.module.scss";

export default function Home() {
  return (
    <div className={style.homePage}>
      <AuthForm />
    </div>
  );
}
