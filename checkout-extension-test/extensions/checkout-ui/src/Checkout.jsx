import { useEffect, useState } from 'react';
import {
  useApi,
  reactExtension,
  useCartLines,
  useApplyCartLinesChange
} from '@shopify/ui-extensions-react/checkout';

import { HeadingArea } from './Heading.jsx';
import { ClickableArea } from './ClickableArea.jsx';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

const variantId = "gid://shopify/ProductVariant/44857470222642";

function Extension() {
  const { query } = useApi();

  const [variantData, setVariant] = useState(null);
  const [isSelected, setSelected] = useState(false);
  const [accessoryAdded, setAccessoryAdded] = useState(false);

  useEffect(() => {
    async function getVariantData() {
      const queryResult = await query(`{
        node(id: "${variantId}"){
          ... on ProductVariant {
            title
            price {
              amount
              currencyCode
            }
            image {
              url
              altText
            }
            product {
              title
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }`);

      if(queryResult.data) {
        setVariant(queryResult.data.node);
      }
    }

    getVariantData();
  }, []);

  // return (
  //   <Banner title="ATTENTION" status="critical">
  //     SHAWN COMPARE AT PRICE RIGHT NOW!
  //   </Banner>
  // );

  const cartLines = useCartLines();
  const applyCartLineChange = useApplyCartLinesChange();

  useEffect(() => {
    if(isSelected) {
      applyCartLineChange({
        type: "addCartLine",
        quantity: 1,
        merchandiseId: variantId
      });
      setAccessoryAdded(true);
    }
    else {
      const cartLineId = cartLines.find(
        (cartLine) => cartLine.merchandise.id === variantId
      )?.id;

      if(cartLineId) {
        applyCartLineChange({
          type: "removeCartLine",
          quantity: 1,
          id: cartLineId
        });
      }

      setAccessoryAdded(false);
    }
  }, [isSelected]);

  if(!variantData) return null;

  return (
    <>
      <HeadingArea added={accessoryAdded} />
      <ClickableArea isSelected={isSelected} setSelected={setSelected} data={variantData} added={accessoryAdded} />
    </>
  )
}