export function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
      <div className="prose prose-sm dark:prose-invert sm:prose-base max-w-none text-muted-foreground">
        <p>Last updated: [Date]</p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Ngoma, you agree to be bound by these Terms of Service and all
          applicable laws and regulations.
        </p>
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials on Ngoma's
          website for personal, non-commercial transitory viewing only.
        </p>
        <h2>3. Disclaimer</h2>
        <p>
          The materials on Ngoma's website are provided on an 'as is' basis. Ngoma makes no
          warranties, expressed or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property.
        </p>
      </div>
    </div>
  );
}
