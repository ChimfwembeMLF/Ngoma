export function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert sm:prose-base max-w-none text-muted-foreground">
        <p>Last updated: [Date]</p>
        <h2>1. Information We Collect</h2>
        <p>
          We collect information from you when you register on our site, place an order, subscribe
          to our newsletter, respond to a survey, or fill out a form.
        </p>
        <h2>2. How We Use Your Information</h2>
        <p>
          Any of the information we collect from you may be used in one of the following ways:
          to personalize your experience, to improve our website, to improve customer service,
          to process transactions, and to send periodic emails.
        </p>
        <h2>3. Data Protection</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal
          information when you place an order or enter, submit, or access your personal information.
        </p>
      </div>
    </div>
  );
}
