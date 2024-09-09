import {Link} from 'react-router-dom';
import { useState, useEffect } from "react";
import '../css/Navbar.css';
import SignUpModal from '../modals/SignUpModal';
import SignInModal from '../modals/SignInModal';
import { useNavigate } from 'react-router-dom';

export default function Navbar(){
    const [signUpModalOn, setSignUpModal] = useState(false);
    const [signInModalOn, setSignInModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkAuth, setCheckAuth] = useState(false);
    const navigate = useNavigate();


    const LogOutB = async (e) => {
        try {
            const response = await fetch('/logout', {
                method : 'GET'
            });
    
            if(response.ok) {
                navigate('/');
                setCheckAuth(!checkAuth);
            }
        }
        catch (error) {
            console.error('Error : ', error);
            }
    }

    useEffect(() => {
        console.log("useEffect activated");
        const checkAuth = async () => {

            
    
            try{
                
                const response = await fetch('/users/auth', {
                    method : 'GET'
                });
        
                if(response.ok) {
                    console.log('setIsLoggedIn activated');
                    setIsLoggedIn(true);
                }
                else{
                    setIsLoggedIn(false);
                }
            }
            catch (error){
                console.log(error);
            }
        }
        
        checkAuth();
    }, [checkAuth]);

    return (
        <>
        <SignUpModal show={signUpModalOn} onHide={() => {setSignUpModal(false)}}/>
        <SignInModal checkAuth={checkAuth} setCheckAuth={setCheckAuth} show={signInModalOn} onHide={() => {setSignInModal(false)}}/>
        <div>
            <div className='navbar'>
                <Link className='navbarMenu' to={'/'}>Home</Link>
                <Link className='navbarMenu' to={'/rank'}>Rank</Link>
                <div className='navbarSpacer'/>
                {isLoggedIn ? 
                (
                <>
                <Link className='navbarLogin' to={'/post'}>Post</Link>
                <a href='#' onClick={LogOutB} className='navbarLogin'>Logout</a>
                </>
                ) :
                <>
                <Link onClick={() => { setSignUpModal(true)}} className='navbarLogin' to={'/signUp'}>SignUp</Link>
                <Link onClick={() => { setSignInModal(true)}} className='navbarLogin' to={'/login'}>Login</Link>
                </>}

            </div>
        </div>
        </>
    );
}