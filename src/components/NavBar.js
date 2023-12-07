import './NavBar.css';
import logo from '../resources/aztec-logo.png';
import { Link } from 'react-router-dom';
import { Logout } from '../pages/Login';
import useToken from './useToken';

function Navbar() {
    const {token} = useToken()
    
    return (
        <div className='navbarWrapper'>
            <div className="navbar">
                <div className="menuList">
                    <Link to='/'><img src={logo} className='logo' alt=''></img></Link>
                    <div className='menuButton'>
                        <Link to='/'>Home</Link>
                    </div>
                    <div className='menuButton'>
                        <Link to="/items">Items</Link>
                    </div>
                    <div className='menuButton'>
                        <Link to="/projects">Projects</Link>
                    </div>
                    <div className='menuButton'>
                        <Link to="/archives">Archives</Link>
                    </div>
                </div>
                <div className='menuButton'>
                    {token ? 
                    <Link onClick={() => {Logout()}}>Logout</Link> :
                    <Link to="/login">Login</Link> }
                </div>
            </div>
        </div>
    )
}

export default Navbar