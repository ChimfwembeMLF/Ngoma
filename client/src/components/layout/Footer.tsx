import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-xl font-bold tracking-tight text-foreground">Ngoma</span>
            <p className="text-sm text-muted-foreground">
              Empowering artists across Africa.
            </p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground md:justify-end">
            <Link to="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/refund" className="hover:text-foreground transition-colors">
              Refund Policy
            </Link>
          </nav>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          &copy; {currentYear} Ngoma. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
