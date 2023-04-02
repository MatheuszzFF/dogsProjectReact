import React from 'react'
import { TOKEN_POST, TOKEN_VALIDATE_POST, USER_GET } from './api';
import {useNavigate} from 'react-router-dom';

export const UserContext = React.createContext();

export const UserStorage = ({children}) => {
    const [data, setData] = React.useState(null);
    const [login, setLogin] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const navigate = useNavigate()

    const userLogout= React.useCallback(async function() {
      setData(null);
      setError(null);
      setLoading(false);
      setLogin(false);
      window.localStorage.removeItem('token');
      navigate('/login');
    },[navigate])


    React.useEffect(()=> {
      async function autoLogin() {
        const token = window.localStorage.getItem('token');
        if(token) {
          try {
            setError(null);
            setLoading(true);
            const {url, options} = TOKEN_VALIDATE_POST(token);
            const response = await fetch(url, options);
            if(!response.ok) throw new Error('Token inválido');
            const json = await response.json();
            await getUser(token);
          } catch(e) {
            userLogout();
          } finally {
            setLoading(false);
          }
          
        }
      }
      autoLogin();
    },[userLogout])
    async function getUser(token) {
      console.log(token);
        const {url, options} = USER_GET(token);
        const response = await fetch(url, options);
        const json = await response.json();
        console.log(json);
        setData(json);
        setLogin(true);
    }
    async function userLogin(username, password) {
      try {
        setError(null);
        setLoading(true);
        const {url, options} = TOKEN_POST({username, password});
        const tokeRes = await fetch(url,options);
        if(!tokeRes.ok) throw new Error(`Error: ${tokeRes.message}`) 
        const {token} = await tokeRes.json();
        window.localStorage.setItem('token', token);
        await getUser(token);
        navigate('/conta');
      } catch(err) {
        setError(err.message);
        console.log(err)
        setLogin(false);
      } finally {
        setLoading(false);
      }
        
    }

    
  return (
    <UserContext.Provider value={{userLogin, data, userLogout, error, loading, login}}>
        {children}
    </UserContext.Provider>
  )
}
