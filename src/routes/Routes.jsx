import { LeftMenu } from "../components/leftMenu"
import { Outlet} from 'react-router-dom';

export const RoutesOutlet = () => {
    return (
        <div className="window">        
            <LeftMenu/>
            <section className='outlet'>
                <Outlet />
            </section>
        </div>
      );
}