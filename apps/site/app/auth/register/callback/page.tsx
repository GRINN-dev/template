"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GoogleCallback = () => {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    const code = params.get("code"); // This is the Google Authorization Code

    if (code) {
      // Send the authorization code to your backend
      fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle user authentication
          data?.accessToken && router.push("/");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [params]);

  return <div>Processing Google authentication...</div>;
};

export default GoogleCallback;
