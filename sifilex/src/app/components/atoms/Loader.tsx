import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "#1890ff" }} spin />;

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Spin indicator={antIcon} />
        <p className="text-lg text-gray-700 animate-pulse">Chargement en cours...</p>
      </div>
    </div>
  );
};

export default Loader;
