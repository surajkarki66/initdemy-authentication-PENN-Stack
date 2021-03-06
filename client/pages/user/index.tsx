import type { NextPage, GetServerSideProps } from "next";
import { SyntheticEvent, useContext, useState } from "react";

import Axios from "../../axios-url";
import Profile from "../../components/UI/Profile/Profile";
import UserRoute from "../../components/routes/UserRoute";
import { User } from "../../types/types";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.accessToken;
  const { data } = await Axios.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    props: data.data,
  };
};
const UserIndex: NextPage<User> = (props) => {
  const [loading, setLoading] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [avatar, setAvatar] = useState(props.avatar);

  const { state, csrfToken, accessToken } = useContext(AuthContext);
  const { user } = state;

  const activate = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      Axios.defaults.headers.post["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.post(
        "/user/verifyEmail",
        {
          userId: user.id,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setLoading(false);
      toast(data.data.message);
      setDisableBtn(true);
    } catch (error: any) {
      setLoading(false);
      toast(error.response.data.data.error);
      setDisableBtn(false);
    }
  };
  return (
    <>
      <UserRoute>
        <div className="jumbotron text-center bg-primary square">
          <h1 style={{ color: "white" }}>User dashboard</h1>
          <p className="lead">This is your workspace</p>
        </div>
        <div>
          <Profile
            user={props}
            avatar={avatar}
            setAvatar={setAvatar}
            loading={loading}
            disableBtn={disableBtn}
            profileActivateHandler={activate}
          />
        </div>
      </UserRoute>
    </>
  );
};

export default UserIndex;
