import "modules/about/about.css"

export default function About() {
    document.title = "About";
    
    return (
        <div className="about-container">
            <div className="about-section">
                <h2 className="about-section-title">Experience</h2>
                <div className="timeline">
                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <div className="timeline-date">2024.07 - Present</div>
                            <div className="timeline-company">Alibaba Group</div>
                            <div className="timeline-role">Software Engineer</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <div className="timeline-date">2022.02 - 2024.04</div>
                            <div className="timeline-company">ByteDance</div>
                            <div className="timeline-role">Software Engineer</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <div className="timeline-date">2019.07 - 2021.12</div>
                            <div className="timeline-company">GrowingIO</div>
                            <div className="timeline-role">Software Engineer</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="about-section">
                <h2 className="about-section-title">Contact Info</h2>
                <div className="contact-info">
                    <div className="contact-item">
                        <div className="contact-icon">
                            <div className="label">Email</div>
                        </div>
                        <div className="contact-link">
                            sqh1107@gmail.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
