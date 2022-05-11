import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, TextInput } from 'carbon-components-react';
import Timer from '../components/Timer';
import RequestAPI from '../components/RequestAPI';
import Information from '../components/Information';
import Consents from '../components/Consents';

const APIPage = () => {
  const [clientId, setClientId] = useState("a139c9d7-65e8-41bf-85b7-41af96d195e1");
  const [tenantUri, setTenantUri] = useState("https://fxn.verify.ibm.com");
  const [redirectUri, setRedirectUri] = useState(window.location.protocol + '//' + window.location.host);
  
  const [code, setCode] = useState(null);
  const [grantId, setGrantId] = useState(null);
  
  const [responses, setResponses] = useState({});

  const [refreshTokenVisible, setRefreshTokenVisible] = useState(false);
  const [refreshTimer, setRefreshTimer] = useState(0);

  useLayoutEffect(() => {
    let searchParams = new URLSearchParams(window.location.search);
    setCode(searchParams.get('code'));
    setGrantId(searchParams.get('grant_id'));
  }, []);

  useEffect(() => {
    var code_challenge = localStorage.getItem('code_challenge');
    if(!code_challenge) {
      code_challenge = generateRandomString(100);
      localStorage.setItem('code_challenge', code_challenge);
    }

  }, []);

  useEffect(() => {
    if( responses && responses.get_token && responses.get_token.expires_in ) {
      setRefreshTimer(0);
    }
  }, [responses]);

  useEffect(() => {
    if( refreshTimer === 0 ) {
      setRefreshTimer(1);
    }
  }, [refreshTimer]);

  const setRequestAPIResponse = (key, value) => {
    setResponses({ ...responses, [key]: value });
  }

  const generateRandomString = function (length, randomString="") {
    randomString += Math.random().toString(20).substr(2, length);
    if (randomString.length > length) return randomString.slice(0, length);
    return generateRandomString(length, randomString);
  };

  return (
    <div className="bx--grid">
      <div className="bx--row">
        <div className="bx--col-lg-3 site-information">
          <Information step={1} title="Informacion" />
          <TextInput 
            id="tenantUri" 
            labelText="Tenant URI" 
            value={tenantUri} 
            onChange={(e) => setTenantUri(e.currentTarget.value)} 
            disabled={true} 
          />
          <TextInput 
            id="clientId" 
            labelText="Client ID" 
            value={clientId}
            onChange={(e) => setClientId(e.currentTarget.value)} 
            disabled={true} 
          />
          <TextInput 
            id="redirectUri" 
            labelText="Redirect URI" 
            value={redirectUri} 
            onChange={(e) => setRedirectUri(e.currentTarget.value)} 
            disabled={true} 
          />
          <Button 
            kind="tertiary" 
            href={`${tenantUri}/v1.0/endpoint/default/authorize?client_id=${clientId}&response_type=code&scope=apic&redirect_uri=${redirectUri}`}>
            <span>Obtener codigo</span>
          </Button>
          <TextInput 
            id="code" 
            labelText="Code" 
            value={code || ""} 
            disabled={true} 
          />
          <TextInput 
            id="grantId" 
            labelText="Grant ID" 
            value={grantId || ""} 
            disabled={true} 
          />
        </div>
        <div className="bx--col-lg-9">
          <RequestAPI
            step={2}
            title="Generar Access Token"
            apiKey="get_token"
            url={`${tenantUri}/v1.0/endpoint/default/token`}
            method="POST"
            headers={{
              "Content-Type": "application/x-www-form-urlencoded"
            }}
            body={{
              "code": code,
              "client_id": clientId,
              "grant_type": "authorization_code",
              "scope": "apic",
              "redirect_uri": redirectUri     
            }}
            messageResponses={{
              400: "El Code ingresado ya ha sido utilizado"
            }}
            disabled={!code}
            setRequestAPIResponse={setRequestAPIResponse}
          />
          { refreshTimer ? <Timer 
            time={responses?.get_token?.expires_in} 
            onClickRefresh={() => setRefreshTokenVisible(!refreshTokenVisible)} 
            disabled={!responses?.get_token?.access_token}
          /> : null }
          { refreshTokenVisible && <RequestAPI
            title="Refresh Access Token"
            apiKey="get_token"
            url={`${tenantUri}/v1.0/endpoint/default/token`}
            method="POST"
            headers={{
              "Content-Type": "application/x-www-form-urlencoded"
            }}
            body={{
              "client_id": clientId,
              "grant_type": "refresh_token",
              "scope": "apic",
              "redirect_uri": redirectUri,
              "refresh_token": responses?.get_token?.refresh_token
            }}
            disabled={!code}
            setRequestAPIResponse={setRequestAPIResponse}
          /> }
          <div style={{ padding: '1rem' }}></div>
          <RequestAPI
            step={3}
            title="API Call"
            apiKey="api_call"
            url="https://apic-gw-gateway-apic.mycluster-dal13-c3-264860-b7e1409c8262987de026fb014d8b2db1-0000.us-south.containers.appdomain.cloud/production/tuya/openbankdemo/v1/consulta?cedula=1"
            method="GET"
            headers={{
              "Authorization": "Bearer " + responses?.get_token?.access_token,
              "api-key": "0b17aa7007e0ec5f41f04cb65cd80f84"
            }}
            disabled={!responses?.get_token?.access_token}
            setRequestAPIResponse={setRequestAPIResponse}
          />


        </div>
      </div>
    </div>
  )
}

export default APIPage;