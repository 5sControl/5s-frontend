declare module "*.scss";
declare module "*.jpg" {
  const path: string;
  export default path;
}
declare module "*.png" {
  const path: string;
  export default path;
}

declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_ENV?: "proxy" | "wify";
    REACT_APP_NGROK: string;
    REACT_APP_PROXY: string;
    REACT_APP_IP_SERVER: string;
  }
}
