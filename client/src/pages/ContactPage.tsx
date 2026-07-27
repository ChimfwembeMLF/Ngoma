export function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">Contact Us</h1>
      <div className="prose prose-sm dark:prose-invert sm:prose-base max-w-none text-muted-foreground">
        <p>
          We would love to hear from you! Whether you have a question about features, trials, pricing,
          need a demo, or anything else, our team is ready to answer all your questions.
        </p>
        <p>
          <strong>Email:</strong> support@ngoma.app<br />
          <strong>Address:</strong> 123 Music Lane, Creative City
        </p>
      </div>
    </div>
  );
}
