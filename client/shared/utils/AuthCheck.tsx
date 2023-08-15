import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import apiFetch from "../apiFetch";
const login = "/login?redirected=true"; // Define your login route address.

/**
 * Check user authentication and authorization
 * It depends on you and your auth service provider.
 * @returns {{auth: null}}
 */
const checkUserAuthentication = async () => {
  try {
    const user = await apiFetch.get("/profile");
    return { auth: true, user };
  } catch (err) {
    console.log(err);
    return { auth: false };
  }
};

interface Props {
  children: React.ReactNode;
}

function AuthCheck({ children }: Props) {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    checkUserAuthentication().then((result) => setAuth(result.auth));
  }, []);
  if (!auth) return <>Loading...</>;
  return <>{children}</>;
}

export default AuthCheck;
