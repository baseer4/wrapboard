import type { NextConfig } from "next";
import { config } from "process";

const nextConfig: NextConfig = {
   // webpack:(config) =>{
   // config.external.push({"utf-8-validate": "commonjs utf-8-validate",
   // "bufferutil": "commonjs bufferutil",
   // canvas:"commonjs canvas"
   //    })
   // return config;
   // },
  images:{
    remotePatterns:
    [
       {
      protocol: 'https',
      hostname:'liveblocks.io',
      port:''
       }
   ]
  },
   typescript :{
      ignoreBuildErrors:true
   }
   };

export default nextConfig;
