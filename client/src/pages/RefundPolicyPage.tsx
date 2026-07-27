export function RefundPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">Refund Policy</h1>
      <div className="prose prose-sm dark:prose-invert sm:prose-base max-w-none text-muted-foreground">
        <p>Last updated: [Date]</p>
        <h2>1. Refunds for Digital Purchases</h2>
        <p>
          Due to the nature of digital goods (music downloads, tips, etc.), all sales on Ngoma are
          generally considered final and non-refundable. Once a track has been downloaded or
          streamed, we cannot issue a refund.
        </p>
        <h2>2. Exceptional Circumstances</h2>
        <p>
          We may grant refunds in exceptional circumstances, such as:
        </p>
        <ul>
          <li>The digital file is corrupted or unplayable, and we are unable to provide a working replacement.</li>
          <li>A fraudulent transaction occurred using your payment method.</li>
        </ul>
        <h2>3. Requesting a Refund</h2>
        <p>
          If you believe you qualify for a refund, please contact us at support@ngoma.app within
          7 days of the transaction. We will review your request and respond promptly.
        </p>
      </div>
    </div>
  );
}
