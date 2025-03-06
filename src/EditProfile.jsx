import { useContext } from "react"
import { AuthContext } from "./Context";
import { Form, Link } from "react-router";

export default function Profile() {

    const auth = useContext(AuthContext);

    if (auth) {
        return (
            <div className="profile">
                <div>
                    <h4>Edit Profile</h4>
                    <Form method="post">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" required />
                        <input type="text" name="photoURL" id="photoURL" />
                        <input type="file" name="image" id="image" />
                        <button type="submit" className="btnSmall">Submit</button>
                        <Link to="/profile"><button type="button" className="btnSmall">Cancel</button></Link>                        
                    </Form>
                </div>
                <div className="profile-pic">
                    
                </div>
            </div>
        )
    } else {
        return <p>...</p>
    }
}