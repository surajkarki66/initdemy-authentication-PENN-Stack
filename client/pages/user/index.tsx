import type { NextPage } from "next";

import UserRoute from "../../components/routes/UserRoute";

const UserIndex: NextPage = () => {
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
