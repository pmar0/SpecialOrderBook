import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = (props) => {
    const redirect = useNavigate();
//will be using useLocation here soon and check current pathname..if current pathname is not "/", then it'll check for user auth and force them back to login if theyre not auth..will also store prev location in order to send them right back there when they log in.
    useEffect(() =>{
        redirect('/login')
    },[redirect])

    return (
        <>
            <p>You never should've come here...*skyrim music intensifies*</p>
        </>
    );
}

export default Redirect;