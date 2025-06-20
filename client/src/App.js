import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const API_BASE = process.env.REACT_APP_API_BASE;

const getBase64FromURL = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function App() {
  const generatePDF = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/pdfdata/latest`.replace(/([^:]\/)\/+/g, "$1")
      );
      const data = await response.json();

      // Convert images to base64
      const headerBase64 = await getBase64FromURL(
        "https://eurekasolutions.in/dynamicpdf/images/EC_Header.jpg"
      );
      const footerBase64 = await getBase64FromURL(
        "https://eurekasolutions.in/dynamicpdf/images/EC_Footer.jpg"
      );
      const signatureBase64 = await getBase64FromURL(
        "https://eurekasolutions.in/dynamicpdf/images/signature.png"
      );

      const docDefinition = {
        pageMargins: [80, 100, 60, 100], // left, top, right, bottom
        header: {
          image: "headerImage",
          width: 500,
          margin: [0, 20, 0, 30],
        },
        footer: (currentPage, pageCount) => ({
          image: "footerImage",
          width: 500,
          margin: [0, 0, 0, 20],
          alignment: "center",
        }),
        content: [
          {
            text: [
              { text: "CFAAM Ref\t\t\t\t\t\t\t: ", bold: true },
              { text: data.CfaamRef + "\n", bold: true },
              { text: "Previous CFAAM Ref\t\t: ", bold: true },
              { text: data.PreviousCfaamRef + "\n\n", bold: true },
            ],
            margin: [0, 0, 0, 20],
          },
          {
            text: "09 June 2025",
            margin: [0, 0, 0, 10],
          },
          {
            text: [
              "The Manager\nTest Bank 123\n153 Josiah Chinamano Ave,\nEast,\n",
              { text: "HARARE\n\n", bold: true, decoration: "underline" },
            ],
          },
          {
            text: "RE: BANK ACCOUNTS / CORPORATE NON-RESIDENT ACCOUNT",
            bold: true,
            margin: [0, 10, 0, 4],
          },
          {
            canvas: [{ type: "line", x1: 0, y1: 0, x2: 500, y2: 0, lineWidth: 1 }],
            margin: [0, 2, 0, 15],
          },
          {
            text: [
              { text: "Foreign Investor\t\t\t\t\t: ", bold: true },
              { text: data.ForeignInvestor + "\n", bold: true },
              { text: "Date Submitted\t\t\t\t: ", bold: true },
              { text: data.DateSubmitted + "\n", bold: true },
              { text: "Beneficiary and Country\t: ", bold: true },
              { text: data.BeneficiaryAndCountry + "\n", bold: true },
              { text: "Currency and Amount\t\t: ", bold: true },
              { text: data.CurrencyAndAmount + "\n", bold: true },
              { text: "USD Equivalent\t\t\t\t: ", bold: true },
              { text: data.USDEquivalent + "\n", bold: true },
              { text: "Status/Decision\t\t\t\t: ", bold: true },
              { text: data.StatusOrDecision + "\n\n", bold: true },
            ],
            margin: [0, 0, 0, 20],
          },
          {
            text: "Response / Conditions",
            bold: true,
            margin: [0, 0, 0, 10],
          },
          {
            text: data.ResponseOrConditions,
            margin: [0, 0, 0, 30],
          },
          {
            table: {
              widths: ["*"],
              body: [
                [
                  {
                    stack: [
                      { text: "Yours Faithfully,\n", margin: [0, 0, 0, 10] },
                      {
                        image: "signatureImage",
                        width: 100,
                        margin: [0, 0, 0, 10],
                      },
                      {
                        text: [
                          { text: "PDFCode Tester\n", fontSize: 9 },
                          { text: "Principal Analyst\n", fontSize: 9 },
                          {
                            text:
                              "CAPITAL FLOWS ADMINISTRATION, AND MANAGEMENT DIVISION\n",
                            bold: true,
                          },
                          {
                            text: "(Foreign Trade and Investment Facilitation)",
                            bold: true,
                          },
                        ],
                      },
                    ],
                    margin: [0, 10, 0, 0],
                  },
                ],
              ],
            },
            layout: "noBorders",
            unbreakable: true,
            margin: [0, 10, 0, 0],
          },
        ],
        images: {
          headerImage: headerBase64,
          footerImage: footerBase64,
          signatureImage: signatureBase64,
        },
      };

      pdfMake.createPdf(docDefinition).open();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Something went wrong while generating the PDF.");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
}

export default App;
