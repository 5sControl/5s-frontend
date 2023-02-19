/* eslint-disable no-unused-vars */
import { useCookies } from "react-cookie"
import { Authorization } from "../../components/authorization/Authorization";
import { CompanyComponent } from "./Company/Company";

export const CompanyHub = () => {
    const [cookies, setCookie] = useCookies(['token']);
    return (
        <>
            {cookies.token ?
                <CompanyComponent/>
            :
                <Authorization/>}
        </>
    )
}