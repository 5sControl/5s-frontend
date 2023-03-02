import { AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const AlgorithmList = ({
  algorithmList,
  algorithmCount,
  setSelectType,
  camerasSafety_Control_Ear_protection,
  camerasMachine_Control,
  camerasIdle_Control,
  camerasStaff_control,
  algorithmPage,
  camerasSafety_Control_Reflective_jacket,
  camerasSafety_Control_Head_protection,
  camerasSafety_Control_Hand_protection
}) => {
  const navigate = useNavigate();

  const pushTheButton = (algorithm) => {
    if (algorithmPage === "main") {
      console.log(algorithm);
      if (algorithm === "Safety_control_ear_protection") {
        setSelectType({
          obj: camerasSafety_Control_Ear_protection,
          type: "Safety_Control_Ear_protection",
        });
      }
      if (algorithm === "Safety_control_reflective_jacket") {
        setSelectType({
          obj: camerasSafety_Control_Reflective_jacket,
          type: "Safety_control_reflective_jacket",
        });
      }
      if (algorithm === "Safety_control_head_protection") {
        setSelectType({
          obj: camerasSafety_Control_Head_protection,
          type: "Safety_control_head_protection",
        });
      }
      if (algorithm === "Safety_control_hand_protection") {
        setSelectType({
          obj: camerasSafety_Control_Hand_protection,
          type: "Safety_control_hand_protection",
        });
      }
      if (algorithm === "Machine_Control") {
        setSelectType({ obj: camerasMachine_Control, type: "Machine_Control" });
      }
      if (algorithm === "Idle_Control") {
        setSelectType({ obj: camerasIdle_Control, type: "Idle_Control" });
      }
      if (algorithm === "Staff_control") {
        setSelectType({ obj: camerasStaff_control, type: "Staff_Control" });
      }
      return;
    }

    if (algorithmPage === "algorithm") {
      navigate(`/${algorithm.toLowerCase()}`);
    }
  };
  return (
    <div className="selection">
      {algorithmPage === "main" && (
        <>
          <h2 className="selection__title">Initial Setup</h2>
          <h3 className="selection__subtitle">
            Select algorithms and cameras that will use them to start
            monitoring. You can always change your setup by going to the
            specific algorithms from Algorithms tab.
          </h3>
        </>
      )}

      <h2>{algorithmCount} algorithms used </h2>
      <div
        className={
          algorithmList.machine_control
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Machine_Control")}
      >
        <div>
          <h4>Machine Control</h4>
          <h5>Detects is machine.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.idle_control
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Idle_Control")}
      >
        <div>
          <h4>Idle Control</h4>
          <h5>Detects if worker is idle.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.safety_control_ear_protection
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Safety_control_ear_protection")}
      >
        <div>
          <h4>Safety Control: Ear protection</h4>
          <h5>Detects if worker is not wearing protective headphones.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.safety_control_reflective_jacket
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Safety_control_reflective_jacket")}
      >
        <div>
          <h4>Safety Control: Reflective jacket</h4>
          <h5>Detects if worker is not wearing reflective jacket.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.staff_control
            ? "selection__container "
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Staff_control")}
      >
        <div>
          <h4>Staff Control</h4>
          <h5>Detects if worker is staff.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.safety_control_head_protection
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Safety_control_head_protection")}
      >
        <div>
          <h4>Safety Control: Head protection</h4>
          <h5>Detects if worker is not wearing protective helmet.</h5>
        </div>
        <AiOutlineRight />
      </div>
      <div
        className={
          algorithmList.safety_control_hand_protection
            ? "selection__container"
            : "selection__container noAccess"
        }
        onClick={() => pushTheButton("Safety_Control_hand_protection")}
      >
        <div>
          <h4>Safety Control: Hand protection</h4>
          <h5>Detects if worker is not wearing protective gloves.</h5>
        </div>
        <AiOutlineRight />
      </div>
    </div>
  );
};
