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
  const [errorInfo, setErrorInfo] = useState(null);
  const [error, setError] = useState(false);
  const [lineItem, setLineItem] = useState([]);

  //On first load useEffect
  useEffect(() => {
    //Fetch data on this order
    //Looking for product id's present in this order
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
        //Loop through products in thisorder
        result.data.order.lineItems.edges.map((lineItem) => {
          //Grab their ids
          let productId = lineItem.node.product.id;

          //Once we have those - fetch data per product
          //Grab each products title and tags
          async function fetchProdData() {
            const productResult = await query(`query {
              product(id: "${ productId }") {
                title
                tags
                metafields(first: 10) {
                  edges {
                    node {
                      namespace
                      key
                      value
                      definition {
                        id
                      }
                    }
                  }
                }
              }
            }`);

            if(!productResult.errors && productResult.data) {
              //Set lineItem state array
              setLineItem(lineItem => [...lineItem, productResult.data.product]);
            }
            else {
              //Set error state(s) if they exist
              if(productResult.errors[0]) {
                setErrorInfo(productResult.errors[0]);
              }
              else {
                setErrorInfo(productResult.errors);
              }
              setError(true);
            }
          }

          fetchProdData();
        });

        setErrorInfo(result.data.order);
        setError(false);
      }
      else {
        //Set error state(s) if they exist
        if(result.errors[0]) {
          setErrorInfo(result.errors[0]);
        }
        else {
          setErrorInfo(result.errors);
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
            <Text appearance="warning">"{error == true && errorInfo.message}"</Text>
          </>
        }
        
        {error == false &&
          <>
            <Heading size={3}>Product Metafields in this Order:</Heading>
            {lineItem.map((product) => {
              // const tagPresent = product.tags.filter((tag) => tag == "Winter");

              if(product.metafields.edges.length > 0) {
                product.metafields.edges.map((metafield) => {
                  console.log("testtt", metafield.node);
                });
              }

              return (
                <BlockStack gap="small base" padding="base base large">
                  <Heading size={4}>{product.title}</Heading>
                  <Divider/>
                    {product.metafields.edges.length > 0 &&
                      <>
                        {product.metafields.edges.map((metafield) => {
                          return (
                            <Text>metafields.{metafield.node.namespace}.{metafield.node.key} = {metafield.node.value}</Text>
                          )
                        })}
                      </>
                    }
                    
                    {product.metafields.edges.length == 0 &&
                      <Text>No metafields present.</Text>
                    }
                </BlockStack>
              )
            })}
          </>
        }
      </BlockStack>
    </AdminBlock>
  );
}