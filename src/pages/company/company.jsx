import { useCookies } from "react-cookie"
import { Authorization } from "./authorization/Authorization";
import { CompanyComponent } from "./companyComponent/CompanyComponent";

export const Company = () => {
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