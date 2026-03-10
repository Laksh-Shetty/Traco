"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-14 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-12">
          <div className="max-w-xs">
            <span className="font-black text-2xl bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              TRACO
            </span>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Track every rupee. Understand your habits. Build real financial freedom.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-slate-200 font-semibold tracking-wide uppercase text-xs">Product</span>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/transaction/create" className="hover:text-white transition-colors">Add Transaction</Link>
              <Link href="#" className="hover:text-white transition-colors">Analytics</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-slate-200 font-semibold tracking-wide uppercase text-xs">Company</span>
              <Link href="#" className="hover:text-white transition-colors">About</Link>
              <Link href="#" className="hover:text-white transition-colors">Blog</Link>
              <Link href="#" className="hover:text-white transition-colors">Careers</Link>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-slate-200 font-semibold tracking-wide uppercase text-xs">Legal</span>
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Security</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} Traco. All rights reserved.</span>
          <span>Made with ❤️ for smarter finances</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;