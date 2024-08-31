import "modules/home/home.css";
import { useEffect } from "react";

export default function Home() {
    useEffect(() =>{
        document.title = "信息记录";
    }, []);

    return (
        <div className='home'>
            <div className='content'>
                <div>Welcome!</div>
            </div>
            <div>This is the home page.</div>
        </div>
    )
}
