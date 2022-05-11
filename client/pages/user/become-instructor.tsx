import { NextPage } from "next";
import Axios from "../../axios-url";

const BecomeInstructor: NextPage = () => {
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Become Instructor</h1>
        <p className="lead">Become a great teacher!</p>
      </div>
    </>
  );
};

export default BecomeInstructor;
