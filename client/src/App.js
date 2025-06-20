import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const App = () => {
  const generatePDF = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/api/pdfdata/latest`);
    const data = await response.json();

    const docDefinition = {
      pageMargins: [80, 120, 80, 100],
      header: {
        image: 'https://eurekasolutions.in/dynamicpdf/images/EC_Header.jpg',
        width: 500,
        alignment: 'center',
        margin: [0, 20, 0, 20]
      },
      footer: function (currentPage, pageCount) {
        return {
          image: 'https://eurekasolutions.in/dynamicpdf/images/EC_Footer.jpg',
          width: 500,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        };
      },
      content: [
        {
          text: [
            { text: `CFAAM Ref : ${data.CfaamRef}\n`, bold: true },
            { text: `Previous CFAAM Ref : ${data.PreviousCfaamRef}\n\n`, bold: true }
          ]
        },
        {
          text: "09 June 2025\n\nThe Manager\nTest Bank 123\n153 Josiah Chinamano Ave,\nEast,\n",
        },
        {
          text: "HARARE\n\n",
          bold: true,
          decoration: "underline"
        },
        {
          text: "RE: BANK ACCOUNTS / CORPORATE NON-RESIDENT ACCOUNT\n",
          bold: true,
          margin: [0, 10, 0, 4]
        },
        {
          canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
          margin: [0, 0, 0, 10]
        },
        {
          text: [
            { text: `Foreign Investor : `, bold: true },
            { text: `${data.ForeignInvestor}\n` },

            { text: `Date Submitted : `, bold: true },
            { text: `${data.DateSubmitted}\n` },

            { text: `Beneficiary and Country : `, bold: true },
            { text: `${data.BeneficiaryCountry}\n` },

            { text: `Currency and Amount : `, bold: true },
            { text: `${data.CurrencyAmount}\n` },

            { text: `USD Equivalent : `, bold: true },
            { text: `${data.UsdEquivalent}\n` },

            { text: `Status/Decision : `, bold: true },
            { text: `${data.StatusDecision}\n\n` }
          ]
        },
        {
          text: "Response / Conditions",
          bold: true,
          margin: [0, 10, 0, 4]
        },
        {
          text: data.ResponseConditions + "\n\n"
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  stack: [
                    { text: "Yours Faithfully,\n", margin: [0, 0, 0, 10] },
                    {
                      image: 'https://eurekasolutions.in/dynamicpdf/images/signature.png',
                      width: 100,
                      alignment: 'left',
                      margin: [0, 0, 0, 10]
                    },
                    { text: "PDFCode Tester", fontSize: 10 },
                    { text: "Principal Analyst", fontSize: 10 },
                    {
                      text: "CAPITAL FLOWS ADMINISTRATION, AND MANAGEMENT DIVISION",
                      bold: true,
                      fontSize: 11
                    },
                    {
                      text: "(Foreign Trade and Investment Facilitation)",
                      bold: true,
                      fontSize: 11
                    }
                  ]
                }
              ]
            ]
          },
          layout: "noBorders"
        }
      ]
    };

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div style={{ padding: 40 }}>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default App;
