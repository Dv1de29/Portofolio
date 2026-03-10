import '../../styles/About.css';

const About = () => {
  const skills = [
    "JavaScript", "Rust", "React", "Node.js", 
    "Python", "SQL", "C++", 
    "Git", "Docker", "Linux"
  ];

  return (
    <div className="about-content">
      <h2 className="section-title">About Me</h2>
      
      <p className="about-text">
        I'm a passionate developer with a strong interest in software architecture 
        and full-stack development. I specialize in modern JavaScript frameworks, 
        responsive design, and creating seamless user experiences.
      </p>

      <div className="about-grid">
        {/* Card 1 */}
        <div className="about-card cursor-target">
          <h3 className="title-frontend">Frontend Expert</h3>
          <p className="card-skills">{skills.join(", ")}</p>
        </div>

        {/* Card 2 */}
        <div className="about-card cursor-target">
          <h3 className="title-backend">Backend Skilled</h3>
          <p className="card-skills">Node.js, Python, SQL, Rust, C++</p>
        </div>

        {/* Card 3 */}
        <div className="about-card cursor-target">
          <h3 className="title-design">Tools & Systems</h3>
          <p className="card-skills">Git, Docker, Linux, CI/CD</p>
        </div>
      </div>
    </div>
  );
};

export default About;