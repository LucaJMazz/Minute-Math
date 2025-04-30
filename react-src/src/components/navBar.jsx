import { useState } from "react"

function NavBar() {

    return (
        <nav className="navbar">
        <div className="nav-left">
            <div className="menuIcon" id="menu-button">
                &#9776;
            </div>
            <img src="/Icon.png" alt="Minute Math Logo" className="icon"></img>
            <h3 className="title">Minute Math</h3>
        </div>

        <div className="nav-right">
            <a href="https://instagram.com/minutemath" target="_blank"><i className="fab fa-instagram"></i></a>
            <a href="https://youtube.com/minutemath/" target="_blank"><i className="fab fa-youtube"></i></a>
            <a href="https://tiktok.com/@minutemath" target="_blank"><i className="fab fa-tiktok"></i></a>
        </div>
    </nav>
    )
}

export default NavBar;