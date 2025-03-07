import { StyleSheet } from "@react-pdf/renderer"

export const styles = StyleSheet.create({
  page: {
    color: "#262626",
    backgroundColor: "#fff",
    fontFamily: "Helvetica",
    fontSize: 8,
    padding: "30px 50px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
  },

  title2: {
    fontSize: 18,
  },

  textBold: {
    fontFamily: "Helvetica-Bold",
  },

  companyAddress: {
    fontSize: 7,
  },

  companyName: {
    color: "#14aff1",
  },

  clientSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    width: "20%",
    fontFamily: "Helvetica-Bold",
  },

  value: {
    width: "60%",
    wordWrap: "break-word",
    whiteSpace: "normal",
  },

  // Table Styles
  table: {
    width: "100%",
    borderWidth: 1,
    flex: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderStyle: "solid",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: "#14aff1",
    fontFamily: "Helvetica-Bold",
  },
  textCenter: {
    textAlign: "center",
  },

  totalSection: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  numberToWords: {
    width: "60%",
    fontSize: 8,
    fontFamily: "Helvetica-BoldOblique",
    textTransform: "uppercase",
    color: "#696969",
  },

  sectionValue: {
    width: "30%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 24,
  },

  amount: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  amountLabel: {
    width: "40%",
    textAlign: "left",
    fontFamily: "Helvetica-Bold",
    marginRight: 10,
  },

  colon: {
    fontSize: 8,
    width: "10%",
    textAlign: "center",
  },

  amountValue: {
    width: "50%",
    textAlign: "right",
    fontFamily: "Helvetica",
  },

  totalAmountValue: {
    fontFamily: "Helvetica-Bold",
  },

  remarks: {
    fontFamily: "Helvetica-Bold",
    marginTop: 28,
    marginBottom: 8,
  },

  remarksSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },

  remarkItem: {
    flex: 1,
    marginRight: 50,
  },

  remarkItemLast: {
    marginRight: 0,
  },

  remarkLabel: {
    fontFamily: "Helvetica-Bold",
  },

  remarkInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginTop: 30,
  },
})
