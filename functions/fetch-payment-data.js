require("dotenv").config();
const axios = require("axios");
const xml2js = require("xml2js");
const parser = xml2js.Parser();
const { parse, format } = require("date-fns");

const parseDate = (input) => {
  const parsed = format(
    parse(input, "yyyyMMddHHmmss", new Date()),
    "yyyy/MM/dd"
  );
  return parsed !== "Invalid Date" ? parsed : input;
  // return input
};

const parsePerson = (info) => {
  return {
    transaction_id: info.transaction_id[0],
    order_id: info.order_id[0],
    firstName: info.first_name[0],
    lastName: info.last_name[0],
    email: info.email[0],
    phone: info.phone[0],
    response_text: info.action[0].response_text[0].trim(),
    amount: info.action[0].amount[0],
    date: parseDate(info.action[0].date[0]),
    actions: info.action.map((action) => ({
      amount: action.amount[0],
      date: action.date[0],
      success: action.success[0],
      response_text: action.response_text[0].trim(),
    })),
  };
};

const addExtraFields = (rentPayments) => {
  Object.keys(rentPayments).forEach((person) => {
    rentPayments[person]
      .filter((transaction) => !transaction.amount)
      .forEach((transaction, index) => {
        axios
          .post(`${baseurl}&transaction_id=${transaction.transaction_id}`)
          .then(async (response) => {
            const json = await parser.parseStringPromise(response.data);
            const actions = json.nm_response.transaction[0].action;

            (rentPayments[person][index].amount = actions[0].amount[0]),
              (rentPayments[person][index].date = parseDate(
                actions[0].date[0]
              ));
          });
      });
  });
};

const baseurl = `https://secure.epaydatagateway.com/api/query.php?security_key=${process.env.SECURITY_KEY}`;

const handler = async (event) => {
  if (
    event.headers["x-api-key"] &&
    event.headers["x-api-key"] === process.env.API_KEY
  ) {
    const rentPayments = await axios
      .post(
        `${baseurl}&date_search=created,updated&start_date=20200801000000&end_date=20201231232359`
      )
      .then(async (response) => {
        const json = await parser.parseStringPromise(response.data);
        const transactions = json.nm_response.transaction;
        return transactions.reduce((acc, next) => {
          const person = `${next.first_name
            .toString()
            .toLowerCase()}_${next.last_name.toString().toLowerCase()}`;
          if (acc[person]) {
            acc[person] = [...acc[person], parsePerson(next)];
          } else {
            acc[person] = [parsePerson(next)];
          }
          return acc;
        }, {});
      })
      .catch((error) => console.error(error.message));

    addExtraFields(rentPayments);
    if (process.env.ENV === "local") {
      // TODO: write to file
      require("fs").writeFileSync(
        "rent-payments.json",
        JSON.stringify(rentPayments, null, 2)
      );
    }
    return {
      statusCode: 200,
      body: JSON.stringify(rentPayments),
    };
  } else {
    return {
      statusCode: 401,
      body: "Unauthenticated",
    };
  }
};

if (process.env.ENV === "local") {
  handler();
}

module.exports = {
  handler,
};
