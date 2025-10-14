"use client";

import Image from "next/image";
import ActiveUsers from "./users/ActiveUsers";

const Navbar = () => {
  return (
    <nav className="flex select-none items-center justify-between gap-4 bg-primary-black px-5 text-white">
      <div className="flex items-center">
        <Image src="/assets/logo.png" alt="Logo" width={64} height={80} />
        <h1 className="-ml-2.5 text-xl font-semibold leading-tight">Wrapboard</h1>
      </div>
      <ActiveUsers />
    </nav>
  );
};

export default Navbar;
