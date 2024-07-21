import RoomBuildForm from "./_components/RoomBuildForm";
import style from "./style.module.scss";

export default function Home() {
  return (
    <div className={style.homePage}>
      <div className={style.main}>
        <div className={style.main_summary}>
          <h1>Court AI</h1>
          <h2>Let&apos;s enlist an AI lawyer and start the trial.</h2>
        </div>
        <div className={style.sections}>
          <div className={style.section}>
            <h2 className={style.section_title}>What you can?</h2>
            <p className={style.section_content}>
              Let&apos;s discuss your case with an AI lawyer and organize your
              arguments.
              <br />
              The AI lawyer will communicate with the other party for you.
            </p>
          </div>
          <div className={`${style.main_steps} ${style.section}`}>
            <h2 className={style.section_title}>Steps</h2>
            <ol className={style.section_content}>
              <li>Build a Room and share it with opposite.</li>
              <li>Summarize each case and opinion with AI Lawyer.</li>
              <li>
                Each case will be discussed by an AI lawyer and an AI judge.
              </li>
              <li>
                You will hear the judgment or settlement terms and decide if you
                agree with them.
              </li>
            </ol>
          </div>
        </div>
      </div>
      <RoomBuildForm />
    </div>
  );
}
