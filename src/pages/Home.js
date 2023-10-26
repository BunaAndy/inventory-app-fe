import './Home.css';
import React from "react"
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className='homePageWrapper'>
            <div className="welcomeText">
                <div>Welcome!</div>
            </div>
            <div className="sectionText">
                <div>View Projects and Items</div>
            </div>
            <div className='navWrapper'>
                <Link to='/projects'>
                    <div className='navButtonWrapper'>
                        All Projects
                    </div>
                </Link>
                <Link to='/'>
                    <div className='navButtonWrapper'>
                        All Items
                    </div>
                </Link>
            </div>
            <div style={{'height': '70px', 'width': '100%'}}></div>
        </div>
    )
}

export default Home