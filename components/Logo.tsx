"use client";

import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className = "", showText = true }: LogoProps) => {
  // Use the static SVG file we created
  return (
    <div className={`d-flex align-items-center gap-1 ${className}`} style={{ fontFamily: "monospace", position: "relative", zIndex: 1 }}>
      <object
        data="/images/logo.svg"
        type="image/svg+xml"
        style={{ 
          flexShrink: 0, 
          width: "auto",
          height: "auto",
          maxHeight: "80px",
          maxWidth: "500px",
          display: "inline-block",
          color: "inherit",
          verticalAlign: "middle",
          pointerEvents: "none",
          margin: 0,
          padding: 0
        }}
        aria-label="logo"
      />
      {showText && (
        <span style={{ fontSize: "20px", fontWeight: 600, color: "inherit", whiteSpace: "nowrap", lineHeight: 1, marginLeft: "-20px" }}>
          cristiansrc
        </span>
      )}
    </div>
  );
};

export default Logo;
