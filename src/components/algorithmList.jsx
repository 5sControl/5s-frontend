import {AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
export const AlgorithmList = ({algorithmList, algorithmCount, setSelectType, camerasSafety_Control_Ear_protection, camerasStaff_control, camerasTool_control, algorithmPage}) =>{
    const navigate = useNavigate()
    const pushTheButton = (algorithm) =>{
        if (algorithmPage === 'main'){

            if (algorithm === 'Safety_control_ear_protection'){
                setSelectType({obj:camerasSafety_Control_Ear_protection, type:'camerasSafety_Control_Ear_protection'})
            }
            if (algorithm === 'Staff_control'){
                setSelectType({obj:camerasStaff_control, type:'camerasStaff_control'})
            }
            if (algorithm === 'Tool_control'){
                setSelectType({obj:camerasTool_control, type:'camerasTool_control'})
            }
            return
        }

        if (algorithmPage === 'algorithm'){
            navigate(`/${algorithm.toLowerCase()}`)
         }
}
    return (
        <div className='selection'>
            {
            algorithmPage === 'main' && 
            <>
                <h2 className='selection__title'>Initial Setup</h2>
                <h3 className='selection__subtitle'>Select algorithms and cameras that will use them to start monitoring. You can always change your setup by going to the specific algorithms from Algorithms tab.</h3>
            </>
            }
            
            <h2>{algorithmCount} / 5 algorithms used </h2>
            <div 
                className={algorithmList.Safety_Control_Ear_protection ? 'selection__container' : 'selection__container noAccess'} 
                onClick={() => pushTheButton('Safety_control_ear_protection')}
            >
                <div>
                    <h4>Safety Control: Ear protection</h4>
                    <h5>Detects if worker is not wearing protective headphones.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div 
                className={algorithmList.Machine_Control ? 'selection__container' : 'selection__container noAccess'} 
                onClick={() => pushTheButton("Machine_Control")}>
                <div>
                    <h4>Machine Control</h4>
                    <h5>Detects is machine.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div 
                className={algorithmList.Idle_Control ? 'selection__container' : 'selection__container noAccess'} 
                onClick={() => pushTheButton("Idle_Control")}>

                <div>
                    <h4>Idle Control</h4>
                    <h5>Detects if worker is idle.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div 
                className={algorithmList.Staff_Control ? 'selection__container noAccess' : 'selection__container noAccess'} 
                onClick={() => pushTheButton("Staff_control")}>
                <div>
                    <h4>Staff Control</h4>
                    <h5>Detects if worker is staff.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div className={algorithmList.Safety_Control_Head_protection ? 'selection__container' : 'selection__container noAccess'} onClick={() => setSelectType('Safety_Control_Head_protection')}>
                <div>
                    <h4>Safety Control: Head protection</h4>
                    <h5>Detects if worker is not wearing protective helmet.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div className={algorithmList.Safety_Control_Hand_protection ? 'selection__container' : 'selection__container noAccess'} onClick={() => setSelectType('Safety_Control_Hand_protection')}>
                <div>
                    <h4>Safety Control: Hand protection</h4>
                    <h5>Detects if worker is not wearing protective gloves.</h5>
                </div>
                <AiOutlineRight/>
            </div>
            <div className={algorithmList.Safety_Control_Reflective_jacket ? 'selection__container' : 'selection__container noAccess'} onClick={() => setSelectType('Safety_Control_Reflective_jacket')}>
                <div>
                    <h4>Safety Control: Reflective jacket</h4>
                    <h5>Detects if worker is not wearing reflective jacket.</h5>
                </div>
                <AiOutlineRight/>
            </div>
        </div>
    )
}