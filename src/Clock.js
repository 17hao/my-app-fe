function getDatetime() {
    let datetime = new Date().toLocaleString();
    return {__html: datetime};
}

function Clock() {
    return <div dangerouslySetInnerHTML={getDatetime()} />
}

export default Clock;