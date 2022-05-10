import type { NextPage } from "next";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import UserRoute from "../../components/routes/UserRoute";

const UserIndex: NextPage = () => {
  const { state } = useContext(AuthContext);
  const { user } = state;

  return (
    <>
      <UserRoute>
        <h1 className="jumbotron text-center square">
          <pre>{JSON.stringify(user)}</pre>
        </h1>
      </UserRoute>
    </>
  );
};

export default UserIndex;
