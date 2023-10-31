import './NavBar.css';
import logo from '../resources/aztec-logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className='navbarWrapper'>
            <div className="navbar">
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
            </div>
        </div>
    )
}

export default Navbar