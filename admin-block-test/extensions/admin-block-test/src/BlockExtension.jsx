import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
} from '@shopify/ui-extensions-react/admin';

import { useState, useEffect } from 'react';

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const { data, query } = useApi(TARGET);

  const productId = data.selected[0].id;

  const [collections, setCollections] = useState(null);

  useEffect(() => {
    async function fetchCollections () {
      const result = await query(`query {
        collections(first: 250) {
          edges {
            node {
              id
              hasProduct(id: "${ productId }")
              title
              image {
                url
              }
            }
          }
        }
      }`);

      if(!result.errors && result.data) {
        const collectionsIncludingProduct = result.data.collections.edges.filter((edge) => edge.node.hasProduct)
        .map((edge => edge.node));

        setCollections(collectionsIncludingProduct);
      }
      else {
        console.log("error", result);
      }
    }

    fetchCollections();
  }, []);

  console.log(collections);

  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Collections Listener">
      <BlockStack>
        <Text fontWeight="bold">Hello world</Text>
      </BlockStack>
    </AdminBlock>
  );
}