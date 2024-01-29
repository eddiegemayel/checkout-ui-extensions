import { useEffect, useState } from 'react';

import {
  BlockStack,
  Checkbox,
  InlineLayout,
  Image,
  Text,
  Tooltip,
  Pressable,
} from '@shopify/ui-extensions-react/checkout';

export const ClickableArea = ({isSelected, setSelected, data, added}) => {

  return (
   <>
     <Pressable
        onPress={() => setSelected(!isSelected)}
        overlay={
          <Tooltip>
            Contact Shawn if you need something!!
          </Tooltip>
        }
      >
        <InlineLayout
          blockAlignment="center"
          spacing={["base", "base"]}
          columns={["auto", 80, "fill"]}
          padding="base"
        >
          <Checkbox 
            checked={isSelected}
          />
          {added == false && 
            <>
              <Image 
                source={data.image.url || data.product.featuredImage.url}
                accessibilityDescription={data.image.altText}
              />
              <BlockStack>
                <Text>
                  {data.product.title} {data.title}
                </Text>
                <Text>
                  {data.price.amount} {data.price.currencyCode}
                </Text>
              </BlockStack>
            </>
          }

          {added == true && 
            <>
              <BlockStack>
                <Text appearance="success" size="medium" padding="base">
                  Click to Remove from cart
                </Text>
              </BlockStack>
            </>
          }
        </InlineLayout>
      </Pressable>
   </>
  )
}