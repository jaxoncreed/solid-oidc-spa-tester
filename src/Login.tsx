import {
  getDefaultSession,
  handleIncomingRedirect,
  login,
  logout,
  Session
} from "@inrupt/solid-client-authn-browser";
import { FunctionComponent, useEffect, useState } from "react";

export const Login: FunctionComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true,
    }).then(() => {
      const session = getDefaultSession();
      setSession(session);
      setIsLoggedIn(session.info.isLoggedIn);
    });
  }, []);

  // Expiration
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [timeToExpiration, setTimeToExpiration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!session?.info.expirationDate) {
        setExpirationDate(undefined);
        setTimeToExpiration(0);
        return;
      }
      const expDate = new Date(session.info.expirationDate);
      setExpirationDate(expDate);
      setTimeToExpiration((expDate.valueOf() - new Date().valueOf()) / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!isLoggedIn || !session) {
    return <button onClick={() => login({
      oidcIssuer: "http://localhost:3000",
      redirectUrl: window.location.href,
      clientName: "Test Application"
    })}>
      Log In
    </button>
  }

  return (
    <div>
      <p>Logged in as {session.info.webId} 
        <button onClick={async () => {
          await logout();
          const session = getDefaultSession();
          setSession(session);
          setIsLoggedIn(session.info.isLoggedIn);
        }}>
          Log Out
        </button>
      </p>
      {expirationDate && 
        <p>Expiration Date: {expirationDate.toLocaleString()} | Time to Expiration: {timeToExpiration} seconds</p>
      }
    </div>
  )
}
