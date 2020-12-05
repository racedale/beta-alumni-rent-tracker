import Head from "next/head";
import Header from "@components/Header";
import axios from "axios";

export default function Home(props) {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Beta Alumni Rent Payment Tracker" />

        <table>
          <tbody>
            <tr>
              <th>transaction_id</th>
              <th>firstName</th>
              <th>lastName</th>
              <th>email</th>
              <th>date</th>
              <th>amount</th>
              <th>response_text</th>
            </tr>
            {props.paymentData.map((row) => {
              return (
                <tr
                  key={row.transaction_id}
                  // style={{
                  //   backgroundColor:
                  //     row.response_text.toLowerCase() !== "approved"
                  //       ? "#ff6961"
                  //       : "initial",
                  // }}
                >
                  <td>{row.transaction_id}</td>
                  <td>{row.firstName}</td>
                  <td>{row.lastName}</td>
                  <td>{row.email}</td>
                  <td>{row.date}</td>
                  <td>{row.amount}</td>
                  <td>{row.response_text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}

import mockData from "./mock-data";

export async function getServerSideProps(context) {
  const response = await axios.get(
    `https://beta-alumni-rent-tracker.netlify.app/.netlify/functions/map-payments-to-csv`
  );
  const data = response.data;
  // const data = mockData;

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      paymentData: data,
    }, // will be passed to the page component as props
  };
}
