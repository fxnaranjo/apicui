import React, { useState, useEffect } from 'react';
import { TextInput, Button, CodeSnippet, Select, SelectItem, InlineLoading } from 'carbon-components-react';
import { warmGray, red, green } from '@carbon/colors';
import { Information16 } from '@carbon/icons-react';
import './RequestAPI.scss';
import Information from './Information';

const RequestAPI = ({ apiKey, title, description, url, previewUrl, headers = {}, body, method, disabled, setRequestAPIResponse, step, messageResponses, simple = false }) => {
  const [statusCode, setStatusCode] = useState(null);
  const [response, setResponse] = useState(null);
  const [messageResponse, setMessageResponse] = useState(null);
  const [payloadVisible, setPayloadVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if( apiKey && response && messageResponses ) {
      setMessageResponse(messageResponses[statusCode] ? messageResponses[statusCode] : null);
    }
    if( apiKey && response && setRequestAPIResponse && statusCode === 200 ) {
      setRequestAPIResponse(apiKey, response);
    }
  }, [response]);

  const fetchAPI = () => {
    setResponse(null);
    setStatusCode(null);
    setIsFetching(true);
    if( headers["Content-Type"] === "application/x-www-form-urlencoded" ) {    
      var urlencoded = new URLSearchParams();
      if( body ) {
        for (const [key, value] of Object.entries(body))
          urlencoded.append(key, value);
      }
      fetch(url, { method, headers, body: urlencoded })
      .then(response => {
        setStatusCode(response.status);
        return response.json();
      })
      .then(result => setResponse(result))
      .catch(error => setResponse(error));
    } else {
      fetch(url, { method, headers, body: body ? JSON.stringify(body) : null })
      .then(response => {
        setStatusCode(response.status);
        return response.json();
      })
      .then(result => {
        setResponse(result);
        setIsFetching(false);
      })
      .catch(error => {
        setResponse(error);
        setIsFetching(false);
      });
    }
  };

  const getStatusCodeColor = (statusCode) => {
    switch (statusCode) {
      case 400:
        return red[40];
      case 403:
        return red[40];
      case 200:
        return green[40];
        case 207:
          return green[40];
      default:
        return warmGray[40];
    }
  }

  if( simple ) {
    return (
      <>
      <Button onClick={fetchAPI} disabled={disabled}>{title}</Button>
      { isFetching && <InlineLoading description="Loading..." />}
      <div style={{ marginTop: "1rem" }}>{ statusCode || "Status code" }</div>
      </>
    );
  }

  return (
    <div className="request-api">
      <Information title={title} description={description} step={step} />
      <div className="form">
        <Select className="method" defaultValue={method} id="method" labelText="" disabled={true} inline>
          <SelectItem text="GET" value="GET" />
          <SelectItem text="POST" value="POST" />
        </Select>
        <TextInput id="url" labelText="" defaultValue={previewUrl || url} disabled={true} />
        <Button renderIcon={Information16} iconDescription="Payload" kind="secondary" 
          hasIconOnly disabled={disabled} onClick={() => setPayloadVisible(!payloadVisible)} />
        <Button onClick={fetchAPI} disabled={disabled}>Solicitud</Button>
      </div>
      { payloadVisible && <div className="payload">
        <p>Headers</p>
        <CodeSnippet>{ JSON.stringify(headers || {}) }</CodeSnippet>
        <p>Body</p>
        <CodeSnippet>{ JSON.stringify(body || {}) }</CodeSnippet>
      </div> }
      <div className="request-info">
        <div className="status-code">
          <div className="icon" style={{ backgroundColor: getStatusCodeColor(statusCode) }}></div>
          <div>{ statusCode || "Status code" }</div>
        </div>
        <div className="message">{ messageResponse }</div>
      </div>
      <CodeSnippet type="multi">
        { response && JSON.stringify(response, null, "\t") }
      </CodeSnippet>
    </div>
  )
}

export default RequestAPI;