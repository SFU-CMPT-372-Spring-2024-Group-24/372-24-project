import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useUser } from "../../hooks/UserContext";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleCallbackResponse = async (response: any) => {
    try {
      console.log("Encoded HWT ID token: " + response.credential);
      const decodedToken: any = jwtDecode(response.credential);
      console.log(decodedToken);

      const { given_name, name, email, picture } = decodedToken;

      // POST request to server 
      const res = await fetch('/api/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ given_name, name, email, picture })
      });

      if (res.ok) {
        const newUser = await res.json();
        console.log('New user:', newUser);
        setUser(newUser); 
        navigate("/"); 
      } else {
        console.error('Failed to create user:', await res.text());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: "921854374603-me6ko0fch21vb5t8i0vch7gh9bkcgrcg.apps.googleusercontent.com",
        callback: handleCallbackResponse
      });

      window.google.accounts.id.renderButton(
        document.getElementById('signInDiv'),
        { theme: 'outline', size: 'large', text: 'continue_with' }
      );
    }
  }, []);

  return (
    <div id='signInDiv'></div>
  )
}

export default GoogleSignIn;
