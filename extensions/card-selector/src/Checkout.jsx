import {
  Banner,
  useAttributes,
  useApplyAttributeChange,
//  useMetafield,
//  useApplyMetafieldsChange,
	useSelectedPaymentOptions,
  useSubtotalAmount,  
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.payment-method-list.render-before',
  () => <Extension />,
);

function Extension() {

  /*
  const payment_method = useMetafield({
    namespace: 'custom',
    key: 'payment_method',
  });
  console.log('payment_method', payment_method);

  const applyMetafieldChange = useApplyMetafieldsChange();
*/
  const options = useSelectedPaymentOptions();
  var payment_type = 'other';
  if (
    options.some(
      (option) => option.type === 'creditCard',
    )
  ) {
    payment_type = 'creditCard';
  }
  console.log('payment_type', payment_type);
/*
  async function updatePayment() {
    const value = payment_type;
    const result = await applyMetafieldChange({
      type: "updateMetafield",
      namespace: "custom",
      key: "payment_method",
      valueType: "string",
      value,
    });
    console.log('applyMetafieldChange: ', result);
  }
*/
  const attributes = useAttributes();
  console.log('attributes', attributes);
  
  const applyAttributeChange = useApplyAttributeChange();

  async function updatePaymentInAttribute() {
    // Payment type
    const value = payment_type;

    const result = await applyAttributeChange({
      type: "updateAttribute",
      key: "payment_method",
      value,
    });
//    console.log('applyAttributeChange: ', result);
  }

  const subtotal = useSubtotalAmount();
  console.log('subtotal', subtotal);

  async function updateCurrencyCode() {
    // Subtotal currency code
    const value = subtotal.currencyCode;

    const result = await applyAttributeChange({
      type: "updateAttribute",
      key: "subtotal_currency_code",
      value,
    });
//    console.log('updateCurrencyCode: ', result);
  }

  async function updateAmount() {
    // Subtotal amount
    const value = subtotal.amount.toString();

    const result = await applyAttributeChange({
      type: "updateAttribute",
      key: "subtotal_amount",
      value,
    });
//    console.log('updateAmount: ', result);
  }

  if (attributes.length < 1) {
    updatePaymentInAttribute();
    updateCurrencyCode();
    updateAmount();
    console.log('attributes.length < 1');
  }    

  for (var i in attributes) {
    const attribute = attributes[i];
    console.log('attribute', attribute);
    if (attribute.key === 'payment_method' && attribute.value != payment_type) {
      updatePaymentInAttribute();
      updateCurrencyCode();
      updateAmount();
      }
  }

//  updatePaymentInAttribute();
//  if(payment_method?.value != payment_type) {
//    updatePayment();
//  }

  if (payment_type == 'creditCard') {
    return(
      <Banner
        status="critical"
        title="5% SERVICE FEE WILL BE ADDED TO CREDIT CARD PAYMENTS"
      />
    );
  }

  return null;
}

