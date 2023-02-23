/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Algorithm.scss";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { AlgorithmList } from "../../components/algorithmList";
import { getAveilableAlgorithms, getProcess } from "../../api/requests";

export const Algorithm = () => {
  const [cookies, setCookie] = useCookies(["token"]);

  const [algorithmList, setAlgorithmList] = useState({});

  useEffect(() => {
    getAveilableAlgorithms(window.location.hostname, cookies.token).then(
      (res) => {
        setAlgorithmList(res.data);
        console.log(res.data);
      }
    );

   getProcess(window.location.hostname, cookies.token)
      .then((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="algorithm">
      <h1 className="algorithm__title">Algorithms</h1>
        <AlgorithmList
          algorithmList={algorithmList}
          algorithmPage={"algorithm"}
          algorithmCount={3}
        />
    </div>
  );
};
