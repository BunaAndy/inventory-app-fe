import './NavBar.css';
import logo from '../resources/aztec-logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className='navbarWrapper'>
            <div className="navbar">
                <Link to='/'><img src={logo} className='logo'></img></Link>
                <div className='menuButton'>
                    <Link to='/'>Home</Link>
                </div>
                <div className='menuButton'>
                    <Link to="/">Items</Link>
                </div>
                <div className='menuButton'>
                    <Link to="/">Projects</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar