import { useState } from 'react'

export const demoData = {
  id: 'db26a3a2-3a6e-45e3-9842-b5daccfe3206',
  customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
  userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
  uniqueId: 'SIN-00138',
  createdAt: '2024-07-26T11:18:38.333Z',
  updatedAt: '2024-07-26T11:18:38.333Z',
  customerPurchaseProducts: [
    {
      id: '82cbcae6-84d8-4393-8277-01399fa5a1d0',
      productName: 'Samsung S20',
      brandName: 'Samsung',
      modelName: 'Samsung S50',
      processor: 'Samsung S50P',
      unit: 'pics',
      category: 'Mobile',
      reOrderAlert: 6,
      productImage: '/uploads_/13on-7c9MKi2dWsc-unsplash.jpg',
      description: null,
      productStock: null,
      othersStock: null,
      customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
      userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
      productId: 'f6bf0ae4-1e53-4cef-8d74-2ad0f54a2cd8',
      sellGroupId: 'db26a3a2-3a6e-45e3-9842-b5daccfe3206',
      createdAt: '2024-07-06T04:44:34.734Z',
      updatedAt: '2024-07-06T04:44:34.734Z',
      variants: [
        {
          id: '7f742241-d264-4e4a-8575-341024c659e6',
          imeiNumber: '34534',
          ram: '2',
          rom: '16',
          color: 'purple',
          customerPurchaseProductId: '82cbcae6-84d8-4393-8277-01399fa5a1d0',
          createdAt: '2024-07-26T11:18:38.339Z',
          updatedAt: '2024-07-26T11:18:38.339Z',
        },
      ],
      sell: {
        id: 'e4686c22-0018-44fe-b3f1-c9d4a91a16e5',
        productName: 'Samsung S20',
        modelName: 'Samsung S50',
        vats: 5,
        discounts: 7,
        sellingPrice: 600,
        totalSellPrice: 588,
        uniqueId: 'SEL-00117',
        quantity: 1,
        purchaseRate: 525,
        variantId: '1154b6ef-2b77-4f61-94be-f359c14d743e',
        productId: 'f6bf0ae4-1e53-4cef-8d74-2ad0f54a2cd8',
        customerPurchaseProductId: '82cbcae6-84d8-4393-8277-01399fa5a1d0',
        customerPurchaseVariantId: '7f742241-d264-4e4a-8575-341024c659e6',
        userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
        customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
        createdAt: '2024-07-26T11:18:38.339Z',
        updatedAt: '2024-07-26T11:18:38.339Z',
      },
    },
    {
      id: 'ac60dfa4-cbc3-4c1f-a709-b2a69af56c1e',
      productName: 'Vivo ',
      brandName: 'Vivo',
      modelName: 'Vivo Y67',
      processor: 'Vivo Y67',
      unit: 'pics',
      category: 'Mobile',
      reOrderAlert: 3,
      productImage: '/uploads_/fabian-heimann-4R_WEmhx8og-unsplash.jpg',
      description: '<p>OK</p>',
      productStock: null,
      othersStock: null,
      customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
      userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
      productId: '7ca05092-86ac-4fe6-bb2e-c276eba9ab24',
      sellGroupId: 'db26a3a2-3a6e-45e3-9842-b5daccfe3206',
      createdAt: '2024-07-06T04:43:45.720Z',
      updatedAt: '2024-07-06T04:43:45.720Z',
      variants: [
        {
          id: '90b75f6f-ac6e-4c76-8080-c2cfb6be35b1',
          imeiNumber: '45656',
          ram: '3',
          rom: '32',
          color: 'pink',
          customerPurchaseProductId: 'ac60dfa4-cbc3-4c1f-a709-b2a69af56c1e',
          createdAt: '2024-07-26T11:18:38.339Z',
          updatedAt: '2024-07-26T11:18:38.339Z',
        },
      ],
      sell: {
        id: '510f386b-3a65-481d-b68d-e20f79ad4745',
        productName: 'Vivo ',
        modelName: 'Vivo Y67',
        vats: 5,
        discounts: 7,
        sellingPrice: 11000,
        totalSellPrice: 10780,
        uniqueId: 'SEL-00117',
        quantity: 1,
        purchaseRate: 9450,
        variantId: 'd27423aa-3cb4-4704-8308-e43654443599',
        productId: '7ca05092-86ac-4fe6-bb2e-c276eba9ab24',
        customerPurchaseProductId: 'ac60dfa4-cbc3-4c1f-a709-b2a69af56c1e',
        customerPurchaseVariantId: '90b75f6f-ac6e-4c76-8080-c2cfb6be35b1',
        userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
        customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
        createdAt: '2024-07-26T11:18:38.339Z',
        updatedAt: '2024-07-26T11:18:38.339Z',
      },
    },
  ],
  customerPurchase: {
    id: '340493ba-052d-4c26-becb-fd949d3cf62a',
    quantity: 2,
    totalPurchaseAmounts: 11368,
    totalDue: 11,
    totalPay: 11357,
    paymentType: 'handCash',
    userId: 'fae855c4-f045-4eaf-a718-4621b81115b9',
    customerId: '7f9d8b94-f792-474a-b283-b6998cb02483',
    sellGroupId: 'db26a3a2-3a6e-45e3-9842-b5daccfe3206',
    createdAt: '2024-07-26T11:18:38.339Z',
    updatedAt: '2024-07-26T11:18:38.339Z',
  },
  customerPayInUser: [],
}

import './Test.style.css'

const Test = () => {
  const [data, setData] = useState([])

  function generateSalesEmailContent(sales: any) {
    const customerPurchaseProducts = sales?.customerPurchaseProducts || []

    const invoiceDate = new Date(
      sales?.customerPurchase?.createdAt
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    })

    let productRows = ''
    let totalAmount = 0
    let totalDiscount = 0
    let totalVat = 0
    let netTotal = 0

    customerPurchaseProducts.forEach(product => {
      product.variants.forEach(variant => {
        const sell = product.sell

        const discountAmount = (sell.totalSellPrice * sell.discounts) / 100
        const vatAmount = (sell.totalSellPrice * sell.vats) / 100
        const productNetTotal = sell.totalSellPrice - discountAmount + vatAmount

        productRows += `
          <tr>
            <td>${product.productName}</td>
            <td>${variant.ram} GB / ${variant.rom} GB / ${variant.color} [${
          variant.imeiNumber
        }]</td>
            <td>${sell.quantity}</td>
            <td>${sell.sellingPrice.toFixed(2)}</td>
            <td>${sell.totalSellPrice.toFixed(2)}</td>
            <td>${sell.discounts}%</td>
            <td>${discountAmount.toFixed(2)}</td>
            <td>${sell.vats}%</td>
            <td>${vatAmount.toFixed(2)}</td>
            <td>${productNetTotal.toFixed(2)}</td>
          </tr>
        `

        totalAmount += sell.totalSellPrice
        totalDiscount += discountAmount
        totalVat += vatAmount
        netTotal += productNetTotal
      })
    })

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .invoice-container {
            width: 100%;
            max-width: 800px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 10px;
          }
          .header, .footer {
            text-align: center;
            margin-bottom: 20px;
          }
          .header h2 {
            margin: 0;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h2>Track For Creativity LLC</h2>
            <p>Email: admin@gmail.com<br>
            Phone: +9689403010<br>
            Address: Sur Souq Sultanate of Oman</p>
          </div>
          <div class="info-section" style="width:100%">
            <div style="width: 50%; max-width: 100%;">
              <p><strong>Customer Information</strong></p>
              <p>Name: ${sales?.customerPurchase?.customer?.firstName} ${
      sales?.customerPurchase?.customer?.middleName
        ? sales?.customerPurchase?.customer?.middleName
        : ''
    } ${sales?.customerPurchase?.customer?.lastName}</p>
              <p>Phone: ${sales?.customerPurchase?.customer?.phoneNo}</p>
              <p>Email: ${sales?.customerPurchase?.customer?.email}</p>
              <p>Address: ${
                sales?.customerPurchase?.customer?.presentAddress
              }</p>
            </div>
            <div style="width: 50%; max-width: 100%;">
              <p><strong>Invoice Information</strong></p>
              <p>Invoice Date: ${invoiceDate}</p>
              <p>Invoice No: ${sales?.uniqueId}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Quantity</th>
                <th>P. Price</th>
                <th>Amount</th>
                <th>Discount (%)</th>
                <th>Discount A.</th>
                <th>VAT (%)</th>
                <th>VAT A.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
              <tr>
                <td colspan="9" style="text-align:right;">Total</td>
                <td>${totalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="9" style="text-align:right;">Discount</td>
                <td>${totalDiscount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="9" style="text-align:right;">VAT Amount</td>
                <td>${totalVat.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="9" style="text-align:right;">Net Total</td>
                <td>${netTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="9" style="text-align:right;">Pay</td>
                <td>${sales?.customerPurchase?.totalPay.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="9" style="text-align:right;">Due</td>
                <td>${sales?.customerPurchase?.totalDue.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Thank you for your purchase!</p>
          </div>
        </div>
      </body>
      </html>
    `

    return emailContent
  }

  const result = generateSalesEmailContent(demoData)

  return (
    <div>
      <pre>{result}</pre>
    </div>
  )
}

export default Test
