import RoomBuildForm from "./_components/RoomBuildForm";
import style from "./style.module.scss";

export default function Home() {
  return (
    <div className={style.homePage}>
      <div className={style.main}>
        <h1>Court AI</h1>
        <h2>{"Let's enlist an AI lawyer and start the trial."}</h2>
      </div>
      <RoomBuildForm />
    </div>
  );
}
