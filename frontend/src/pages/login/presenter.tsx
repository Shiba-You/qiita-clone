import React from "react";
import { Button } from "../../components/ui/button";

const LoginPresenter = () => {
  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "GET",
        credentials: "include", // ← これがないとクッキーが共有されない！
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        window.location.href = data.authUrl;
      } else {
        console.error("Login req failed: ", response.status);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div>LoginPresenter</div>
      <Button onClick={() => login()}>Login</Button>
    </>
  );
};

export default LoginPresenter;
