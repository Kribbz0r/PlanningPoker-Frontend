import { FormEvent, useState }from 'react';
import "./loginPage.css"


interface LoginPageProps {
    onLogin: (token: string) => void;
}


function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const frontPageImg = "https://cdn.pixabay.com/photo/2022/10/31/13/50/aces-7559882_960_720.png";
    const [error, setError] = useState<string>("");
  
    function handleSubmit(e: FormEvent<HTMLFormElement>, email: string, password: string): void {
    e.preventDefault();
  
        fetch("https://goldfish-app-jlmay.ondigitalocean.app/security/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Origin": "*"
            },
            body: JSON.stringify({ 
                "email": email, 
                "password": password })
        })
        .then(res => {
            if (!res.ok) {
                new Error("Incorrect email or password");
            }
            return res.text()
        }).then(data => {
            if (data.includes("Error")) {
                setError("Incorrect email or password");
            } else if (data.includes("permission") || data.includes("Incorrect")) {
                setError(data); 
            } else {
                const token = data
                localStorage.setItem('jsonwebtoken', token)
                onLogin(token);
                setEmail("")
                setPassword("")
            }
        }).catch((error) => {
            setError(error)
        });
    }

    return (
    <>
        <img src={frontPageImg} className="frontPageImg"/>
        <form className="loginForm" onSubmit={(e) => handleSubmit(e, email, password)}>
            <h2>Log In</h2>
          <input className="loginInputs" placeholder='@email' type="text" value={email} onChange={((e) => setEmail(e.target.value))}></input>
          <input className="loginInputs" placeholder="password" type="password" value={password} onChange={((e) => setPassword(e.target.value))}></input>
          <button type="submit">Log in</button>
          <p>{error}</p>
        </form>
        <img src={frontPageImg} className="frontPageImg" />
    </>
    );
}

export default LoginPage;