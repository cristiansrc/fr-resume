"use client";
import React, { useEffect } from "react";

const Bootstrap = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    import("bootstrap");
  }, []);
  return <>{children}</>;
};

export default Bootstrap;
