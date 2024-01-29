import { useEffect, useState } from 'react';
import {
  useApi,
  reactExtension,
  useCartLines,
  useApplyCartLinesChange,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';

import { HeadingArea } from './Heading.jsx';
import { ClickableArea } from './ClickableArea.jsx';

export default reactExtension(
  'purchase.checkout.cart-line-list.render-after',
  () => <Extension />,
);

function Extension() {
  const { query } = useApi();

  const settings = useSettings();
  const variantId = settings.selected_variant;

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

  if(!variantId || !variantData) return null;

  return (
    <>
      <HeadingArea added={accessoryAdded} />
      <ClickableArea isSelected={isSelected} setSelected={setSelected} data={variantData} added={accessoryAdded} />
    </>
  )
}