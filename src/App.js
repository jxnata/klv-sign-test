import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Account, core } from "@klever/sdk";
import React, { useCallback, useEffect, useState } from "react";

const App = () => {
  const toast = useToast();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");

  const init = useCallback(async () => {
    if (!core.isKleverWebActive()) {
      await core.initialize();
    }
    const address = await window.kleverWeb.getWalletAddress();
    setAddress(address);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const signMessage = useCallback(async () => {
    const account = new Account();

    const signed = await account.signMessage(message);
    setSignedMessage(signed);
  }, [message]);

  const checkSignature = useCallback(async () => {
    const account = new Account();

    const signed = await account.validateSignature(
      message,
      signedMessage,
      address
    );

    toast({
      title: signed ? "Valid signature" : "Invalid signature",
      description: `The message ${
        signed ? "was" : "was not"
      } signed by address`,
      status: signed ? "success" : "error",
      duration: 9000,
      isClosable: true,
    });
  }, [address, message, signedMessage, toast]);

  return (
    <ChakraProvider>
      <Box margin="auto" px={3} py={10} maxWidth="600px" maxHeight="600px">
        <Tabs>
          <TabList>
            <Tab>Sign Message</Tab>
            <Tab>Verify Signature</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Input
                placeholder="Your address"
                mb={5}
                value={address}
                readOnly
              />
              <Textarea
                placeholder="Your message"
                mb={5}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <Textarea
                placeholder="Signed message"
                mb={5}
                value={signedMessage}
                readOnly
              />
              <Center mb={5}>
                <Button
                  onClick={signMessage}
                  disabled={!address}
                  colorScheme="blue"
                >
                  Sign Message
                </Button>
              </Center>
            </TabPanel>
            <TabPanel>
              <Input
                placeholder="Your address"
                mb={5}
                value={address}
                readOnly
              />
              <Textarea
                placeholder="Your message"
                mb={5}
                onChange={(e) => setMessage(e.target.value)}
                value={message}
              />
              <Textarea
                placeholder="Signed message"
                mb={5}
                value={signedMessage}
                onChange={(e) => setSignedMessage(e.target.value)}
              />
              <Center mb={5}>
                <Button
                  onClick={checkSignature}
                  disabled={!address}
                  colorScheme="blue"
                >
                  Check Signature
                </Button>
              </Center>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
};

export default App;
