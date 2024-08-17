import { BrowserRouter } from "react-router-dom";
import MainRouter from "modules/common/components/MainRouter";
import NaiveNavbar from "modules/common/components/naive-navbar";
import Footer from "modules/common/components/footer";
import "App.css";

export default function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <NaiveNavbar />
                <MainRouter />
            </div>
            <Footer />
        </BrowserRouter>
    );
}
