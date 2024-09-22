import { useForm } from "react-hook-form";
import { FORM_TYPES, FORM_VALUES } from "../../pages/sign/Sign.types";
import { MouseEvent } from "react";

export type AUTH_PROP_TYPES = {
  formType: FORM_TYPES;
  handleOnSubmit: (data: FORM_VALUES) => Promise<void>;
  handleClickHere: (e: MouseEvent<HTMLButtonElement>) => void;
};

const Auth = ({
  formType,
  handleOnSubmit,
  handleClickHere,
}: AUTH_PROP_TYPES) => {
  const { register, handleSubmit, formState } = useForm<FORM_VALUES>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  return (
    <div
      className="main-sign-in-container flex flex-col items-center"
      data-testid="auth-container"
    >
      <h1 className="my-[1rem] font-bold text-[xx-large] text-[color:var(--red)]">
        {formType === "signin" ? "SIGN IN" : "SIGN UP"}
      </h1>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="login-form flex flex-col items-center bg-[color:var(--light-blue)] shadow-[0_6px_16px_rgb(52_105_203_/_16%)] max-w-[18rem] w-full p-[15px] rounded-lg mx-[auto]"
        noValidate
        data-testid="auth-form"
      >
        <div className="form-group w-full mb-[15px]">
          <div className="label-input">
            <label
              htmlFor="email"
              className="block font-bold text-[color:var(--red)] mb-[5px]"
            >
              Email
            </label>
            <input
              className="w-full box-border rounded border border-[color:var(--blue)] text-[13px] bg-[white] text-[black] px-1 py-1.5 border-solid"
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          <p className="error text-[color:var(--red)] text-[0.8rem] mt-[5px]">
            {errors.email?.message}
          </p>
        </div>
        <div className="form-group w-full mb-[15px]">
          <div className="label-input">
            <label
              htmlFor="password"
              className="block font-bold text-[color:var(--red)] mb-[5px]"
            >
              Password
            </label>
            <input
              className="w-full box-border rounded border border-[color:var(--blue)] text-[13px] bg-[white] text-[black] px-1 py-1.5 border-solid"
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                maxLength: {
                  value: 15,
                  message: "Password cannot exceed 15 characters",
                },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
          </div>
          <p className="error text-[color:var(--red)] text-[0.8rem] mt-[5px]">
            {errors.password?.message}
          </p>
        </div>
        {formType === "signin" ? (
          <p className="below-msg text-[black]">
            New here?{" "}
            <span
              className="click-span text-[color:var(--red)] cursor-pointer"
              onClick={handleClickHere}
            >
              Click here
            </span>{" "}
            to register
          </p>
        ) : (
          <p className="below-msg text-[black]">
            Already a user?{" "}
            <span
              className="click-span text-[color:var(--red)] cursor-pointer"
              onClick={handleClickHere}
            >
              Click here
            </span>{" "}
            to login
          </p>
        )}

        <button
          className="submit-btn bg-[color:var(--red)] text-[white] rounded font-semibold cursor-pointer px-5 py-2.5 border-[none] mt-4"
          type="submit"
        >
          {formType === "signin" ? "Login" : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
