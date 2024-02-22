import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
  Heading,
  Divider,
} from '@shopify/ui-extensions-react/admin';

import { useState, useEffect } from 'react';

const TARGET = 'admin.order-details.block.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  //Apis
  const { data, query } = useApi(TARGET);

  //Current data returned
  const currentOrder = data.selected[0].id;

  //States
  const [orderInfo, setOrderInfo] = useState(null);
  const [lineItem, setLineItem] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await query(`query {
        order(id: "${ currentOrder }") {
          lineItems(first: 10) {
            edges {
              node {
                product {
                  id
                }
              }
            }
          }
        }
      }`);

      if(!result.errors && result.data.order) {
        if(result.data.order) {
          result.data.order.lineItems.edges.map((lineItem) => {
            let productId = lineItem.node.product.id;

            async function fetchProdData() {
              const productResult = await query(`query {
                product(id: "${ productId }") {
                  title
                  tags
                }
              }`);

              //console.log("product query", productResult.data.product);
              setLineItem(lineItem => [...lineItem, productResult.data.product]);
            }

            fetchProdData();
          });
        }

        setOrderInfo(result.data.order);
        setError(false);
      }
      else {
        if(result.errors[0]) {
          setOrderInfo(result.errors[0]);
        }
        else {
          setOrderInfo(result.errors);
        }
        setError(true);
      }
    }

    fetchData();
  }, []);

  return (
    // The AdminBlock component provides an API for setting the title of the Block extension wrapper.
    <AdminBlock title="Additional Order Details">
      <BlockStack>
        {error == true &&
          <>
            <Text appearance="warning">Error Recieved:</Text>
            <Text appearance="warning">"{error == true && orderInfo.message}"</Text>
          </>
        }
        
        {error == false &&
          <>
            <Heading size={4}>Product Tags</Heading>
            {lineItem.map((product) => {
              // const tagPresent = product.tags.filter((tag) => tag == "Winter");

              return (
                <BlockStack gap="small base" padding="base base large">
                  <Text>{product.title}</Text>
                  <Divider/>
                    {product.tags.map((tag) => {
                      return (
                        <Text>{tag}</Text>
                      )
                    })}
                </BlockStack>
              )
            })}
          </>
        }
      </BlockStack>
    </AdminBlock>
  );
}