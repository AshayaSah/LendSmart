import React, { useState } from "react";
import axios from "axios";
import xml2js from "xml2js";

const FetchXMLDetails = () => {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    setError(null);

    const xmlPayload = `
    <?xml version="1.0" encoding="UTF-8"?>
    <FIXML xmlns="http://www.finacle.com/fixml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.finacle.com/fixml RetCustInq.xsd">
      <Header>
        <RequestHeader>
          <MessageKey>
            <RequestUUID>c5760892-be28-8c60-0fc6-bae48e85522</RequestUUID>
            <ServiceRequestId>RetCustInq</ServiceRequestId>
            <ServiceRequestVersion>10.2</ServiceRequestVersion>
            <ChannelId>CRM</ChannelId>
            <LanguageId></LanguageId>
          </MessageKey>
          <RequestMessageInfo>
            <BankId>019</BankId>
            <TimeZone></TimeZone>
            <EntityId></EntityId>
            <EntityType></EntityType>
            <ArmCorrelationId></ArmCorrelationId>
            <MessageDateTime>2024-10-26T15:10:18.147</MessageDateTime>
          </RequestMessageInfo>
          <Security>
            <Token>
              <PasswordToken>
                <UserId></UserId>
                <Password></Password>
              </PasswordToken>
            </Token>
            <FICertToken></FICertToken>
            <RealUserLoginSessionId></RealUserLoginSessionId>
            <RealUser></RealUser>
            <RealUserPwd></RealUserPwd>
            <SSOTransferToken></SSOTransferToken>
          </Security>
        </RequestHeader>
      </Header>
      <Body>
        <RetCustInqRequest>
          <RetCustInqRq>
            <CustId>R000000094</CustId>
          </RetCustInqRq>
        </RetCustInqRequest>
      </Body>
    </FIXML>`;

    try {
      const response = await axios.post(
        "https://192.168.92.61:55555/FISERVLET/fihttp",
        xmlPayload,
        {
          headers: {
            "Content-Type": "application/xml",
            Accept: "application/xml",
          },
        }
      );

      // Parse the XML response
      const parser = new xml2js.Parser();
      parser.parseString(response.data, (err, result) => {
        if (err) {
          setError("Error parsing XML");
          setLoading(false);
        } else {
          setResponseData(result); // Save parsed XML data
          setLoading(false);
        }
      });
    } catch (err) {
      setError("Error with the request");
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>XML Request in React</h1>
      <button onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Make Request"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {responseData && (
        <div>
          <h2>Response Data</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FetchXMLDetails;
