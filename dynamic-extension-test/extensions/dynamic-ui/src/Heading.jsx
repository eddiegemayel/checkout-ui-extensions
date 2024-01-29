import {
  Icon,
  Heading,
  BlockLayout,
  BlockSpacer,
  Divider,
} from '@shopify/ui-extensions-react/checkout';

export const HeadingArea = ({added}) => {

  return (
   <>
     <Divider />
      <BlockSpacer />
        <BlockLayout rows={"fill"}>
          {added == false && 
            <Heading level={2}>
              You NEED this amazing product!! <BlockSpacer />
            </Heading>
          }

          {added == true && 
            <Heading level={2}>
              Added! Wow, thanks nice customer <BlockSpacer /> <Icon source="success" />
            </Heading>
          }
        </BlockLayout>
      <BlockSpacer />
   </>
  )
}