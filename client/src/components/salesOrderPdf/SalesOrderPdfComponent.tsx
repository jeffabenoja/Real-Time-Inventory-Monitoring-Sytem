import { styles } from "./style"
import {
  Page,
  Text,
  View,
  Document,
  PDFViewer,
  PDFDownloadLink,
} from "@react-pdf/renderer"
import { SalesOrderType } from "../../type/salesType"
import { toWords } from "number-to-words"
import Spinner from "../common/utils/Spinner"
import { useState, useEffect } from "react"

const formatCurrency = (value: number) => {
  return value.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

interface SalesOrderPdfProps {
  row?: SalesOrderType
}

const SalesOrderPdfComponent: React.FC<SalesOrderPdfProps> = ({ row }) => {
  if (!row)
    return (
      <div className='w-full h-full flex items-center justify-center text-2xl text-red-900'>
        No Sales Order data available.
      </div>
    )

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const orderDate = new Date(row.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const totalAmount = row.details.reduce((acc: number, curr: any) => {
    const amount = curr.amount && !isNaN(curr.amount) ? curr.amount : 0
    return acc + amount
  }, 0)

  const vatPercentage = 12
  const vatAmount = totalAmount * (vatPercentage / 100)

  const netAmount = totalAmount + vatAmount

  const formattedTotalAmount = formatCurrency(totalAmount)
  const formattedVatAmount = formatCurrency(vatAmount)
  const formattedNetAmount = formatCurrency(netAmount)

  const convertNetAmountToWords = (netAmount: number) => {
    const numericAmount = parseFloat(netAmount.toString())

    if (isNaN(numericAmount)) {
      return "Invalid amount"
    }

    const [wholePart, decimalPart] = numericAmount.toFixed(2).split(".")

    const wholePartInWords = toWords(wholePart)
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, " ")

    const decimalPartInWords = toWords(decimalPart)
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, " ")

    return `${wholePartInWords} and ${decimalPartInWords} cents`
  }

  const netAmountInWords = convertNetAmountToWords(netAmount)

  const SalesOrderPdfDocument = () => (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, styles.textBold, styles.companyName]}>
              E&L Delicatessen
            </Text>
            <Text style={styles.companyAddress}>
              16 C. Lawis Ext, Padilla, Antipolo, 1870 Rizal
            </Text>
          </View>
          <View>
            <Text style={[styles.title2, styles.textBold]}>
              Delivery Receipt
            </Text>
          </View>
        </View>

        <View style={styles.clientSection}>
          <View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{row.customer.name}</Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{row.customer.address}</Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Contact Person</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{row.customer.contactPerson}</Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Telephone</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{row.customer.contactNumber}</Text>
            </View>
          </View>

          <View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Delivery Date</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{todayDate}</Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>Order Date</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{orderDate}</Text>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.label}>SO Number</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.value}>{row.salesorderNo}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>ITEM CODE</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>DESCRIPTION</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>QTY</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>UNIT</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>PRICE</Text>
            </View>
            <View style={styles.tableCell}>
              <Text style={styles.textCenter}>AMOUNT</Text>
            </View>
          </View>

          {row.details.map((detail) => (
            <View style={styles.tableRow} key={detail.item.code}>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>{detail.item.code}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>{detail.item.description}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>{detail.orderQuantity}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>{detail.item.unit}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>
                  {formatCurrency(detail.itemPrice)}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textCenter}>
                  {formatCurrency(detail.amount)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.numberToWords}>
            <Text>{netAmountInWords}</Text>
          </View>

          <View style={styles.sectionValue}>
            <View style={styles.amount}>
              <Text style={styles.amountLabel}>SubTotal</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.amountValue}>{formattedTotalAmount}</Text>
            </View>
            <View style={styles.amount}>
              <Text style={styles.amountLabel}>VAT Amount</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={styles.amountValue}>{formattedVatAmount}</Text>
            </View>
            <View style={styles.amount}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.colon}>:</Text>
              <Text style={[styles.amountValue, styles.totalAmountValue]}>
                {formattedNetAmount}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.remarks}>
          <Text>Remarks:</Text>
        </View>

        <View style={styles.remarksSection}>
          <View style={styles.remarkItem}>
            <Text style={styles.remarkLabel}>Prepared By:</Text>
            <View style={styles.remarkInput} />
          </View>

          <View style={styles.remarkItem}>
            <Text style={styles.remarkLabel}>Checked By:</Text>
            <View style={styles.remarkInput} />
          </View>

          <View style={[styles.remarkItem, styles.remarkItemLast]}>
            <Text style={styles.remarkLabel}>Received By:</Text>
            <View style={styles.remarkInput} />
          </View>
        </View>
      </Page>
    </Document>
  )

  // Media query hook to detect if on mobile
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024)
    }

    window.addEventListener("resize", handleResize)
    handleResize() // Initial check

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className='w-full h-full'>
      {isMobile ? (
        // Show download link on mobile
        <div className='w-full h-full justify-center items-center flex'>
          <PDFDownloadLink
            document={<SalesOrderPdfDocument />}
            fileName={`Salesorder-${row.salesorderNo}.pdf`}
          >
            {({ loading, error }) => {
              if (loading) {
                return <Spinner />
              }

              if (error) {
                return (
                  <div className='bg-red-900 text-white p-3 rounded'>
                    <strong>Error generating the document!</strong>
                  </div>
                )
              }

              return (
                <button className='bg-blue-500 text-white p-3 rounded'>
                  Download Sales Order - {row.salesorderNo}
                </button>
              )
            }}
          </PDFDownloadLink>
        </div>
      ) : (
        <PDFViewer height='100%' width='100%'>
          <SalesOrderPdfDocument />
        </PDFViewer>
      )}
    </div>
  )
}

export default SalesOrderPdfComponent
