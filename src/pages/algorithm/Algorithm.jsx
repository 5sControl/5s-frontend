/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Algorithm.scss";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { AlgorithmList } from "../../components/algorithmList";
import { getProcess } from "../../api/requests";

export const Algorithm = () => {
  const [cookies, setCookie] = useCookies(["token"]);

  const [algorithmList, setAlgorithmList] = useState({});

  useEffect(() => {
    getProcess(window.location.hostname, cookies.token).then((res) => {
      const bufferObject = {
      }
      const arrayObject = 
        [...new Set(res.data.map((el) => el.algorithm.name))].map((el) => {
          return {
            [el]: true,
          };
        }
      );
        Object.assign(bufferObject, ...arrayObject);
        setAlgorithmList(bufferObject);
    });
  }, []);

  return (
    <div className="algorithm">
      <h1 className="algorithm__title">Algorithms</h1>
      <AlgorithmList
        algorithmList={algorithmList}
        algorithmPage={"algorithm"}
        algorithmCount={Object.keys(algorithmList).length}
      />
    </div>
  );
};
