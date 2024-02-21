import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
  Heading,
  Box,
  Image,
  InlineStack,
} from '@shopify/ui-extensions-react/admin';

import { useEffect, useState } from 'react'

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.customer-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const { data, query } = useApi(TARGET);
  //console.log("data ", {data});

  const currentCustomerId = data.selected[0].id;
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData () {
      const result = await query(`query {
        customer(id: "${ currentCustomerId }") {
          id
          createdAt
          updatedAt
          note
          verifiedEmail
          validEmailAddress
          tags
          lifetimeDuration
          image {
            src
          }
        }
      }`);

      if(!result.errors && result.data) {
        setCustomer(result.data.customer);
        setError(false);
      }
      else {
        if(result.errors[0]) {
          setCustomer(result.errors[0]);
        }
        else {
          setCustomer(result.errors);
        }
        
        setError(true);
      }
    }

    fetchData();
  }, []);

  if(customer) {
    console.log("customer data", customer);
  }

  const imageSize = 32;

  if(error == true) {
    return (
      // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
      <AdminBlock title="Admin Test 2">
        <BlockStack>
          {error == true &&
            <>
              <Text appearance="critical">An error has occured:</Text>
              <Text appearance="critical">{customer.message}</Text>
            </>
          }
        </BlockStack>
      </AdminBlock>
    )
  }

  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Additional Customer Info">
      <BlockStack>
        {error == false && customer &&
          <InlineStack inlineAlignment="base">
            <Box inlineSize={imageSize} blockSize={imageSize}>
              <Image source={customer.image.src} />
            </Box>

            <InlineStack inlineAlignment="base">
              <InlineStack inlineAlignment="base">
                <Text emphasis>Valid Email:</Text> <Text>{customer.validEmailAddress == true && "True"}{customer.validEmailAddress == false && "False"}</Text>
              </InlineStack>
              <InlineStack inlineAlignment="base">
                <Text emphasis>Verified Email:</Text> <Text>{customer.verifiedEmail == true && "True"}{customer.verifiedEmail == false && "False"}</Text>
              </InlineStack>
            </InlineStack>
          </InlineStack>
        }
      </BlockStack>
    </AdminBlock>
  );
}