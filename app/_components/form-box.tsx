import Link from "next/link";
import LoginForm from "./login-form";

export default function FormBox() {
  return (
    <div className="max-lg:flex-1 md:px-[86px] flex flex-col lg:items-center justify-center z-10">
      <div className=" flex flex-col items-center justify-center gap-9">
        <div className="text-center">
          <span className="text-[35px] sm:text-[56px] capitalize">
            welcome back
          </span>
          <p className="text-lg max-w-[381px] text-[#62626B] leading-[155%] mt-2">
            Step into our shopping metaverse for an unforgettable shopping
            experience
          </p>
        </div>
        <LoginForm />
        <span className="text-sm text-[#62626B]">
          Don&apos;t have an account? <Link href={"/sign-up"}>Sign up</Link>
        </span>
      </div>
    </div>
  );
}
