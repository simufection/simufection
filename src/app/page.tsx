"use client";

import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  router.push("/title");
};

export default Home;
