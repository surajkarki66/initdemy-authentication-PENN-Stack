import React from "react";
import Image from "next/image";
import { Row, Col } from "antd";
import moment from "moment";

import { UserProps } from "../../../types/types";

const Profile: React.FC<UserProps> = (props) => {
  return (
    <div>
      <Row className="profileContainer">
        <Col
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            width={100}
            height={100}
            src={props.avatar}
            alt={props.firstName + " " + props.lastName}
          />
        </Col>

        <Col md={6} style={{ marginLeft: "5%" }}>
          <h6>
            First Name: <b>{props.firstName}</b>{" "}
          </h6>
          <h6>
            Last Name: <b>{props.lastName}</b>{" "}
          </h6>
          <h6>
            Email: <b>{props.email}</b>{" "}
          </h6>
          <h6>
            User Type:<b>{props.isActive ? "Active" : "Not Active"}</b>{" "}
          </h6>
          <h6>
            Role:<b>{props.role}</b>{" "}
          </h6>
          <h6>
            Joined:
            <b>
              {moment(props.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </b>{" "}
          </h6>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
