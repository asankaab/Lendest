import { useRouteError } from "react-router-dom";

export default function ErrorElement() {
    const error = useRouteError();
    console.error(error);

    const styles = {textAlign: "left"}
    
    return (
        <div style={styles}>
            <h4>Error!</h4>
            <h3>An error occured!</h3>
            <i style={{color: "grey"}}>{error.statusText || error.message}</i>
        </div>
    )
}