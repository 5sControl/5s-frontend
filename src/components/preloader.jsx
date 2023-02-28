import PacmanLoader from "react-spinners/PacmanLoader";


  export const Preloader = ({loading, color}) =>
  <div className="preloader-wrapper">
        <PacmanLoader
            color="#FE6100"
            size={150}
            loading={loading}
        />
    </div>