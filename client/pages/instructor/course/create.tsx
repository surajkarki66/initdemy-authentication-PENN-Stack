import { NextPage } from "next";
import Axios from "../../../axios-url";

const CourseCreate: NextPage = () => {
  return (
    <>
      <div className="jumbotron text-center bg-primary square">
        <h1 style={{ color: "white" }}>Create Course</h1>
        <p className="lead">Create your precious course!</p>
      </div>
    </>
  );
};

export default CourseCreate;
