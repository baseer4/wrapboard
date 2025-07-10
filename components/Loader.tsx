"use client";
import Image from "next/image";

const Loader = () => (
  <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-black/5 backdrop-blur-sm">
    <Image
      src="/assets/loader.svg"
      alt="Loading spinner"
      width={80}
      height={80}
      className="object-contain animate-pulse"
      priority
    />
    <p className="text-sm font-semibold text-primary-grey-300">Loading...</p>
  </div>
);

export default Loader;
