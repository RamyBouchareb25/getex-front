"use client";

import { clientAxios } from "@/lib/axios-interceptor";

const Test = () => {
  clientAxios
    .get(`/auth/self`)
    .then((response) => {
      console.log("User data (client side):", response.data);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  return <div></div>;
};

export default Test;
