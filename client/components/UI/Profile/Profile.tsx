import React from "react";
import Image from "next/image";
import { Row, Col, Button } from "antd";
import moment from "moment";

import { ProfileProps } from "../../../types/types";
import { SyncOutlined } from "@ant-design/icons";

const Profile: React.FC<ProfileProps> = ({
  user,
  loading,
  disableBtn,
  profileActivateHandler,
}) => {
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
            src={user.avatar}
            alt={user.firstName + " " + user.lastName}
          />
        </Col>

        <Col md={6} style={{ marginLeft: "5%" }}>
          <h6>
            First Name: <b>{user.firstName}</b>{" "}
          </h6>
          <h6>
            Last Name: <b>{user.lastName}</b>{" "}
          </h6>
          <h6>
            Email: <b>{user.email}</b>{" "}
          </h6>
          <h6>
            User Type:<b>{user.isActive ? "Active" : "Not Active"}</b>{" "}
          </h6>
          <h6>
            Role:<b>{user.role}</b>{" "}
          </h6>
          <h6>
            Joined:
            <b>
              {moment(user.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
            </b>{" "}
          </h6>

          {!user.isActive && (
            <div style={{ fontStyle: "italic", marginTop: "30px" }}>
              <h6>Account is not activated yet</h6>
              <Button
                type="primary"
                onClick={(e) => profileActivateHandler(e)}
                disabled={disableBtn}
              >
                {loading ? <SyncOutlined spin /> : "Activate"}
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
