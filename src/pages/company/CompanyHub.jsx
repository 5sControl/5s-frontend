import { useCookies } from "react-cookie"
import { Authorization } from "./authorization/Authorization";
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