import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 64, color: "#7EE1BD" }} spin />;

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="loader-wrapper">
        <Spin indicator={antIcon} />
        <p className="loader-text">Chargement en cours...</p>
      </div>
    </div>
  );
};

export default Loader;
