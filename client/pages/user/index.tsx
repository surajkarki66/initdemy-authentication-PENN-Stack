import type { NextPage } from "next";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import UserRoute from "../../components/routes/UserRoute";

const UserIndex: NextPage = () => {
  const { state } = useContext(AuthContext);

  return (
    <>
      <UserRoute>
        <div className="jumbotron text-center bg-primary square">
          <h1 style={{ color: "white" }}>User dashboard</h1>
          <p className="lead">This is your workspace</p>
        </div>
      </UserRoute>
    </>
  );
};

export default UserIndex;
