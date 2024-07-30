import { fetch } from "@inrupt/solid-client-authn-browser";
import { FunctionComponent, useState } from "react";

export const Fetch: FunctionComponent = () => {

  const [fetchStatus, setFetchStatus] = useState<number>()
  const [fetchBody, setFetchBody] = useState<string>();

  return (
    <div>
      <button onClick={async () => {
        const response = await fetch("http://localhost:3000/README");
        setFetchStatus(response.status);
        setFetchBody(await response.text());
      }}>
        Fetch
      </button>
      {fetchStatus && <p>Status: {fetchStatus}</p>}
      {fetchBody && <pre>{fetchBody}</pre>}
    </div>
  )
}