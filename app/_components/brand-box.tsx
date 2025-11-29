import LoginForm from "./login-form";

export default function FormBox() {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600 mt-2">
          Step into our shopping metaverse for an unforgettable experience
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
