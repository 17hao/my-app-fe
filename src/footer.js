var style = {
    backgroundColor: "#F8F8F8",
    // borderTop: "1px solid #E7E7E7",
    textAlign: "center",
    padding: "10px 0",
    // position: "absolute",
    // position: "fixed",
    // left: "0",
    bottom: "0",
    height: "20px",
    width: "100%",
}

export default function Footer() {
    return (
        <div>
            <div style={style}>
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">浙ICP备18016225号-2</a>
            </div>
        </div>
    )
}
