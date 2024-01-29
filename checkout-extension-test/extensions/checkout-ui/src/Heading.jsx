import {
  Icon,
  Heading,
  BlockSpacer,
  Divider,
} from '@shopify/ui-extensions-react/checkout';

export const HeadingArea = ({added}) => {

  return (
   <>
     <Divider />
      <BlockSpacer />
        {added == false && 
          <Heading level={2}>
            Shawn Compare At Price? Yea!! <BlockSpacer />
          </Heading>
        }

        {added == true && 
          <Heading level={2}>
            Added! Wow, nice customer <BlockSpacer /> <Icon source="success" />
          </Heading>
        }
      <BlockSpacer />
   </>
  )
}