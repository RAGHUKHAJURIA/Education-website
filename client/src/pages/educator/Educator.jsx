import React from "react";
import { Outlet } from "react-router-dom";

const Educator = () => {
  return (
    <>
      <div>Educator page</div>
      <div>{<Outlet />}</div>
    </>
  );
};

export default Educator;
