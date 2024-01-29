import { useEffect, useState } from 'react';

import {
  BlockLayout,
  BlockStack,
  Checkbox,
  InlineLayout,
  Image,
  Text,
  TextBlock,
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
            Contact SHAWN if you need something!!
          </Tooltip>
        }
      >
        {added == false && 
          <InlineLayout
            blockAlignment="center"
            spacing={["base", "base"]}
            columns={["auto", 80, "fill"]}
            padding="base"
          >
            <Checkbox 
              checked={isSelected}
            />
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
          </InlineLayout>
        }

          {added == true && 
            <InlineLayout
              blockAlignment="center"
              spacing={["base", "base"]}
              columns={["auto", "fill"]}
              padding="base"
            >
              <Checkbox 
                checked={isSelected}
              />
              <BlockLayout>
                <TextBlock appearance="success" inlineAlignment="start">
                  Click to Remove from cart
                </TextBlock>
              </BlockLayout>
            </InlineLayout>
          }
      </Pressable>
   </>
  )
}