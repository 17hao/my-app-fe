import React from "react";
import styles from "./about-page.module.css";

export default function About(): React.ReactElement {
    document.title = "About";

    interface Experience {
        date: string,
        company: string,
        role: string
    }

    const experienceList: Experience[] = [
        {
            "date": "2024-07 - Present",
            "company": "Alibaba Group",
            "role": "Software Engineer",
        },
        {
            "date": "2022-02 - 2024-04",
            "company": "ByteDance",
            "role": "Software Engineer",
        },
        {
            "date": "2019-07 - 2021-12",
            "company": "GrowingIO",
            "role": "Software Engineer",
        }
    ]

    const experienceListDiv = experienceList.map(e => (
        <div className={styles.timelineItem}>
            <div className={styles.timelineMarker}></div>
            <div className={styles.timelineContent}>
                <div className={styles.timelineDate}>{e.date}</div>
                <div className={styles.timelineCompany}>{e.company}</div>
                <div className={styles.timelineRole}>{e.role}</div>
            </div>
        </div>
    ))

    return (
        <div className={styles.aboutContainer}>
            <div className={styles.aboutSection}>
                <h2 className={styles.aboutSectionTitle}>Experience</h2>
                <div className={styles.timeline}>
                    {experienceListDiv}
                </div>
            </div>

            <div className={styles.aboutSection}>
                <h2 className={styles.aboutSectionTitle}>Contact Info</h2>
                <div className={styles.contactInfo}>
                    <div className={styles.contactItem}>
                        <div className={styles.contactIcon}>
                            <div className={styles.label}>Email</div>
                        </div>
                        <div className={styles.contactLink}>
                            sqh1107@gmail.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
