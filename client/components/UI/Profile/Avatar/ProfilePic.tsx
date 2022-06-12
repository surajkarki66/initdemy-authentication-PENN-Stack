import { Avatar } from "antd";
import React from "react";

import { ProfilePicProps } from "../../../../types/types";

const ProfilePic: React.FC<ProfilePicProps> = ({ user, avatar }) => {
  return (
    <>
      <Avatar
        shape="square"
        size={160}
        src={avatar}
        alt={user.firstName + " " + user.lastName}
      />
    </>
  );
};

export default ProfilePic;
