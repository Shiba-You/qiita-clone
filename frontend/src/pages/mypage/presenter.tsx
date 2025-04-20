import React from "react";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../routes/AuthProvider";
const MypagePresenter = () => {
  const myinfo = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/", {
        method: "GET",
      });
      console.log(response);
      // if (response.ok) {
      //   const data = await response.json();
      //   window.location.href = data.authUrl;
      // } else {
      //   console.error("Mypage req failed: ", response.status);
      // }
    } catch (e) {
      console.error(e);
    }
  };
  const checkJWT = async () => {
    const response = await fetch("http://localhost:3000/api/auth/check-auth", {
      method: "GET",
      credentials: "include", // ← これがないとクッキーが共有されない！
    });
    console.log(response);
  };
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Button onClick={() => myinfo()}>Mypage</Button>
      <Button onClick={() => checkJWT()}>chekJWT</Button>
      <Button onClick={() => console.log(isAuthenticated)}>auth</Button>
      <div>MypagePresenter</div>
    </>
  );
};

export default MypagePresenter;
