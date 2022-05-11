import React, { useState } from 'react';
import { TextInput, Select, SelectItem, Toggle } from 'carbon-components-react';
import RequestAPI from './RequestAPI';
import Information from './Information';
import './Consents.scss';

const Consents = ({ accessToken, tenantUri }) => {
  const [purposeId, setPurposeId] = useState("6bb5406f-61b1-4d63-9aa0-f312157150aa");
  const [subjectId, setSubjectId] = useState("641001QAGN");
  const [purposeState, setPurposeState] = useState(1);
  const [responses, setResponses] = useState({});
  const setRequestAPIResponse = (key, value) => {
    setResponses({ ...responses, [key]: value });
  }
  return (
    <div>
      <div>
        <Information step={5} title="Consentimientos de usuario" />
      </div>
      <div className="bx--row">
        <div className="bx--col-lg-4 consents-form">
          <TextInput 
            id="subjectId" 
            labelText="Subject ID" 
            value={subjectId} 
            onChange={(e) => setSubjectId(e.currentTarget.value)} 
          />
          <TextInput 
            id="purposeId" 
            labelText="Purpose ID" 
            value={purposeId} 
            onChange={(e) => setPurposeId(e.currentTarget.value)} 
          />
          <Toggle
            aria-label="toggle button"
            defaultToggled
            id="toggle-1"
            labelText="State"
            labelA="False"
            labelB="True"
            onToggle={(checked) => setPurposeState(checked ? 1 : 2)}
          />
          <RequestAPI
            apiKey="consents"
            previewUrl={`${tenantUri}/v1.0/privacy/consents`}
            url={"https://apigw.bcppoc.ibmdemos.net/demoorg/sandbox/consents"}
            method="POST"
            headers={{
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }}
            body={{
              "purposeId": purposeId,
              "state": purposeState,
              "subjectId": subjectId,
              "attributeId": "email",
              "accessTypeId": "bed01306-315d-4c89-85a1-170d51474fc6"
            }}
            simple={true}
            disabled={!accessToken}
            setRequestAPIResponse={setRequestAPIResponse}
            title={"Actualizar"}
          />
        </div>
        <div className="bx--col-lg-8">
          <RequestAPI
            apiKey="privacyConsents"
            previewUrl={`${tenantUri}/config/v1.0/privacy/consents`}
            url={"https://apigw.bcppoc.ibmdemos.net/demoorg/sandbox/consents"}
            method="GET"
            headers={{
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json"
            }}
            disabled={!accessToken}
          />
        </div>
      </div>
    </div>
  )
}

export default Consents;
