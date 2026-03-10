// pages/MainPage.jsx
import About from "../components/positionsMain/About";
import HomePage from "../components/positionsMain/Home";
import '../styles/MainPage.css'; // We'll add the 100vh styles here

function MainPage() {
    return (
        <div className="main-container">
            {/* Section 1: Home */}
            <section className="main-wrapper" id="home">
                <HomePage />
            </section>

            {/* Section 2: About */}
            <section className="main-wrapper about-section" id="about">
                <About />
            </section>
        </div>
    );
}

export default MainPage;