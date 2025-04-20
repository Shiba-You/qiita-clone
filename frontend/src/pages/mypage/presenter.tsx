import { Button } from "../../components/ui/button";
const MypagePresenter = () => {
  const myinfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/auth/`,
        {
          method: "GET",
        }
      );
      console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <Button onClick={() => myinfo()}>Mypage</Button>
      <div>MypagePresenter</div>
    </>
  );
};

export default MypagePresenter;
