/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./Algorithm.scss";
import { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { AlgorithmList } from "../../components/algorithmList";
import { getAveilableAlgorithms } from "../../api/requests";
import axios from "axios";

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

    axios.get("http://192.168.1.101/api/algorithms/get-process/", {
      headers: {
        Authorization: cookies.token,
      },
    }).then((e) => {
      console.log(e)
    })
    
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
