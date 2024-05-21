import { useState }from 'react';



interface LoginPageProps {
    onLogin: (token: string) => void;
}



function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const frontPageImg = "https://cdn.pixabay.com/photo/2022/10/31/13/50/aces-7559882_960_720.png";
  
    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>, email: string, password: string): void {
    e.preventDefault();
  
        fetch("https://goldfish-app-jlmay.ondigitalocean.app/security/login", {
            method: "POST",
            headers: {
            "content-type": "application/json",
            "Origin": "*"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => {
            if (res.ok) {
                res.text()
                .then(data => {
                    console.log(data)
                    const token = data
                    localStorage.setItem('jsonwebtoken', token)
                    onLogin(token);
                    setEmail("")
                    setPassword("")
                })
            } else {
                console.log("The server could not return a string for you");
            }
        })
    }





    return (
    <>

        <img src={frontPageImg} className="frontPageImg" />

        <div className="loginForm">
          <input type="text" value={email} onChange={((e) => setEmail(e.target.value))}></input>
          <input type="text" value={password} onChange={((e) => setPassword(e.target.value))}></input>
          <button type="submit" onClick={(e) => handleSubmit(e, email, password)}>Logga in</button>
        </div>
        <img src={frontPageImg} className="frontPageImg" />

    </>
    );
}

export default LoginPage;