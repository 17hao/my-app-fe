import "modules/about/about.css"

export default function About() {
    document.title = "About";
    
    return (
        <div className="h1">
            <div className="h2">
                Experience
            </div>
            <div className="h3">
                &emsp;2019.07 - 2021.12&emsp;&emsp;GrowingIO
                <div className="h4">
                    &emsp;Software Engineer
                </div>
            </div>

            <div className="h3">
                &emsp;2022.02 - 2024.04&emsp;&emsp;ByteDance
                <div className="h4">
                    &emsp;Software Engineer
                </div>
            </div>
            <div className="h3">
                &emsp;2024.07 - Present&emsp;&emsp;Alibaba Group
                <div className="h4">
                    &emsp;Software Engineer
                </div>
            </div>
            <div className="h2">
                Contact info
            </div>
            <div className="h3">
                &emsp;sqh1107@gmail.com
            </div>
        </div>
    )
}
