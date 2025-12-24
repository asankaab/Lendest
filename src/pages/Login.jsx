import { useAuth0 } from "@auth0/auth0-react";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { loginWithRedirect, loginWithPopup, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    if (isAuthenticated) navigate('/')

    return (
        <div style={{
            width: '100%',
            height: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <button className="flex items-center gap-2"
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--accent-primary)',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
            onClick={() => loginWithRedirect()}
            >Log In <LogIn size={20}/></button>
        </div>
    );;
}