import "./globals.css";

export const metadata = {
  title: "adjudicationai.co.uk — Construction Dispute Submissions Powered by AI",
  description:
    "Draft professional adjudication submissions in minutes. Notices of Adjudication, Referral Notices, Responses, Replies, Witness Statements and Draft Decisions — all based on HGCRA 1996 and established case law.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
