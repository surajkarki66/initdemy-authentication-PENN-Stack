import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useState,
} from "react";
import { Avatar, Button, Input, Modal } from "antd";

import Axios from "../axios-url";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export type PropsType = {
  setAvatar: Dispatch<SetStateAction<string>>;
};
const ProfilePicChanger: React.FC<PropsType> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [avatar, setAvatar] = useState<File>();
  const [loading, setLoading] = useState(false);

  const { state, csrfToken, accessToken, dispatch } = useContext(AuthContext);
  const { user } = state;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      if (avatar) formData.append("avatar", avatar, avatar?.name);
      Axios.defaults.headers.patch["X-CSRF-Token"] = csrfToken;
      const { data } = await Axios.patch(
        `/user/uploadAvatar/${user.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast(data.data.message);
      dispatch({ type: "LOGIN", payload: data.data.user });
      localStorage.setItem("user", JSON.stringify(data.data.user));
      props.setAvatar(data.data.user.avatar);
      setLoading(false);
      setIsModalVisible(false);
    } catch (error: any) {
      toast(error.response.data.data.error);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setAvatar(fileList[0]);
  };

  return (
    <div style={{ marginLeft: "20%" }}>
      <Button type="primary" onClick={showModal}>
        Upload
      </Button>
      <Modal
        title="Change your avatar"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <div style={{ textAlign: "center", marginBottom: "10%" }}>
          {avatar && (
            <Avatar
              shape="square"
              size={210}
              src={URL.createObjectURL(avatar)}
            />
          )}
        </div>
        <Input
          type="file"
          accept="image/*"
          name="image-upload"
          id="input"
          onChange={(e) => handleFileChange(e)}
          required
        />
      </Modal>
    </div>
  );
};

export default ProfilePicChanger;
