import { useEffect, useState } from 'react';
import {
  DatePicker,
  Checkbox,
  useApplyMetafieldsChange,
  useMetafield,
  Text,
  useCartLines,
  useAppMetafields,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.shipping-option-list.render-after',
  () => <Extension />,
);

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1 ).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getNextAvailableDate(disabledDateRanges) {
  const lastDisabledDate = disabledDateRanges.reduce((maxDate, range) => {
    const endDate = new Date(range.end);
    return endDate > maxDate ? endDate : maxDate;
  }, new Date(disabledDateRanges[0].end)
  );

  const nextAvailableDate = new Date(lastDisabledDate);
  nextAvailableDate.setDate(nextAvailableDate.getDate() + 2);

  return formatDate(nextAvailableDate);
}

//Render
function Extension() {
  const metafield_namespace = "shipping";
  const metafield_key = "requested_shipping_date";

  const currentDate = new Date();
  const twoDaysFromNow = new Date(currentDate);
  twoDaysFromNow.setDate(currentDate.getDate() + 2);

  const disabledDateRanges = [
    {
      start: "0001-01-01",
      end: formatDate(twoDaysFromNow)
    }
  ];

  //Set States
  const initialSelectedDate = getNextAvailableDate(disabledDateRanges);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hasShowDatePickerMetafield, setHasShowDatePickerMetafield] = useState("false");

  const cartLines = useCartLines();
  const appMetafields = useAppMetafields();
  const updateMetafield = useApplyMetafieldsChange();

  const requestedShippingDateMetafield = useMetafield({
    namespace: metafield_namespace,
    key: metafield_key,
  });

  const handleCheckboxChange = (isChecked) => {
    setShowDatePicker(isChecked);
  }

  const handleDateChange = (newSelectedDate) => {
    setSelectedDate(newSelectedDate);
    updateMetafield({
      type: "updateMetafield",
      namespace: metafield_namespace,
      key: metafield_key,
      valueType: "string",
      value: newSelectedDate,
    });
  }

  useEffect(() => {
    for(const cartLine of cartLines) {
      const product = cartLine.merchandise.product;
      product.id = String(product.id.match(/(\d+)$/)[0]);

      for(const metafieldEntry of appMetafields) {
        if(
          metafieldEntry.target.type == "product" &&
          metafieldEntry.target.id == product.id &&
          metafieldEntry.metafield.namespace == "checkout" &&
          metafieldEntry.metafield.key == "show_shipping_date_picker" &&
          metafieldEntry.metafield.value == "true"
          ) {
            setHasShowDatePickerMetafield("true");
            break
        }
      }

      if(hasShowDatePickerMetafield == "true") {
        break;
      }
      else {
        console.log("no");
      }
    }
  });

  return (
    <>
      {hasShowDatePickerMetafield == "true" &&
        <>
          <Text size="medium" emphasis="bold">
            Want your order delivered on a certain date?
          </Text>
          <Checkbox
            id="showDatePicker"
            name="showDatePicker"
            onChange={handleCheckboxChange}
          >
            Select a target delivery date
          </Checkbox>
        </>
      }
      
      {hasShowDatePickerMetafield == "true" && showDatePicker &&
        <DatePicker
          selected={selectedDate}
          disabled={disabledDateRanges}
          onChange={handleDateChange}
        />
      }
    </>
  );
}