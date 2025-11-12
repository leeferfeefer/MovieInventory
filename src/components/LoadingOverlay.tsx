import React from "react";
import MeCrazy from "../assets/me-crazy-small.jpg";
import "./LoadingOverlay.css";

type LoadingOverlayProps = {
  isLoading: boolean;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <img
        src={MeCrazy}
        alt="Loading..."
        className="rotating"
      />
    </div>
  );
};

export default LoadingOverlay;