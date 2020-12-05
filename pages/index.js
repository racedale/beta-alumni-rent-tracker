import Head from "next/head";
import Header from "@components/Header";
import mockData from "./mock-data";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Beta Alumni Rent Payment Tracker" />

        {/* {console.log(mockData)} */}

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
            {mockData.map((row) => {
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
