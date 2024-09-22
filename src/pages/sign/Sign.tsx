import { MouseEvent, useEffect, useState } from "react";
import { FORM_TYPES, FORM_VALUES } from "./Sign.types";
import Auth from "../../components/auth/Auth";
import { httpService } from "../../utils/services";
import { LOGIN_URL, REGISTER_URL } from "../../utils/endpoints";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../utils/slices/userSlice";
import { fetchAllUsers } from "../../utils/slices/allUsersSlice";

const Sign = () => {
  const [formType, setFormType] = useState<FORM_TYPES>("signin");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  const handleOnSubmit = async (data: FORM_VALUES) => {
    try {
      let response;
      if (formType === "signin") {
        response = await httpService<{
          token: string;
          error?: string;
        }>(LOGIN_URL, "POST", data);
        if (response.error) return alert("User is not authorized");

        dispatch(login({ token: response.token, userData: data }));
        navigate("/dashboard");
      }
      if (formType === "signup") {
        response = await httpService<{
          token: string;
          id: string;
          error?: string;
        }>(REGISTER_URL, "POST", data);
        if (response.error) return alert("User is not authorized");
        dispatch(
          login({
            token: response.token,
            userData: { ...data, id: response.id },
          })
        );
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      return alert("There is some error, please try again later!");
    }
  };

  const handleClickHere = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    return formType === "signin"
      ? setFormType("signup")
      : setFormType("signin");
  };

  return (
    <div className="sign-container flex flex-col items-center justify-center min-h-screen">
      <Auth
        formType={formType}
        handleOnSubmit={handleOnSubmit}
        handleClickHere={handleClickHere}
      />
    </div>
  );
};

export default Sign;
