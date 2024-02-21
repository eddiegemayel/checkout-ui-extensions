import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
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
        //const customerInfo = result.data.customers.edges.filter((edge) => edge.node.id == currentCustomerId).map((edge => edge.node));

        //result.data.customers.edges.map((edge) => {console.log(edge.node.id, currentCustomerId);});

        setCustomer(result);
      }
      else {
        setCustomer(result.errors);
        setError(true);
      }
    }

    fetchData();
  }, []);

  console.log("customer data", customer);

  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Admin Test 2">
      <BlockStack>
       Test
      </BlockStack>
    </AdminBlock>
  );
}