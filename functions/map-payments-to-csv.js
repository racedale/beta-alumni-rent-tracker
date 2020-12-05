require("dotenv").config();
const axios = require("axios");
const { hander: fetchPaymentData } = require("./fetch-payment-data");

const mapForCSV = (input) => {
  // return Object.values(input).flatMap((transactions) => {
  //   return transactions.map((transaction) => [
  //     transaction.firstName,
  //     transaction.lastName,
  //     transaction.date,
  //     transaction.amount,
  //     transaction.response_text,
  //   ]);
  // });
  return Object.values(input).flat();
};

const handler = async () => {
  const response = await axios.get(
    "https://beta-alumni-rent-tracker.netlify.app/.netlify/functions/fetch-payment-data"
  );
  const rentPayments = response.data;
  const csvData = mapForCSV(rentPayments);

  if (process.env.ENV === "local") {
    const { stringify } = require("csv");
    stringify(
      mapForCSV(rentPayments),
      {
        columns: [
          "transaction_id",
          "firstName",
          "lastName",
          "email",
          "phone",
          "date",
          "amount",
          "response_text",
        ],
        header: true,
      },
      (err, output) => {
        require("fs").writeFileSync("rent-payments.csv", output);
      }
    );
  }
  return {
    statusCode: 200,
    body: JSON.stringify(csvData),
  };
};
if (process.env.ENV === "local") {
  handler();
}

module.exports = {
  handler,
};
