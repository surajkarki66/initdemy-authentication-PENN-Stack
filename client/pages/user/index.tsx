import type { NextPage, GetServerSideProps } from "next";

import Axios from "../../axios-url";
import Profile from "../../components/UI/Profile/Profile";
import UserRoute from "../../components/routes/UserRoute";
import { UserProps } from "../../types/types";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = context.req.cookies.accessToken;
  const { data } = await Axios.get("/user/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    props: data.data,
  };
};
const UserIndex: NextPage<UserProps> = (props) => {
  return (
    <>
      <UserRoute>
        <div className="jumbotron text-center bg-primary square">
          <h1 style={{ color: "white" }}>User dashboard</h1>
          <p className="lead">This is your workspace</p>
        </div>
        <div>
          <Profile {...props} />
        </div>
      </UserRoute>
    </>
  );
};

export default UserIndex;
