import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-accent/20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0 text-center md:text-left">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              Goodwill<span className="text-foreground">.</span>
            </Link>
            <p className="mt-4 text-secondary text-sm max-w-xs">
              Building the future of digital impact with modern engineering and
              design.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-secondary">
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-accent/10 flex flex-col md:flex-row justify-between items-center text-xs text-secondary italic">
          <p>© {new Date().getFullYear()} Goodwill Inc. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span>Designed for Excellence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
