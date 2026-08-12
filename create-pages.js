const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'sale', title: 'Sale & Offers' },
  { path: 'search', title: 'Search Results' },
  { path: 'account', title: 'My Account' },
  { path: 'cart', title: 'Shopping Cart', link: '/checkout', linkText: 'Proceed to Checkout' },
  { path: 'checkout', title: 'Checkout' },
  { path: 'shipping', title: 'Shipping Policy' },
  { path: 'warranty', title: 'Warranty Information' },
  { path: 'returns', title: 'Returns & Exchanges' },
  { path: 'care', title: 'Care Instructions' },
  { path: 'insurance', title: 'Wingman Insurance' },
  { path: 'terms', title: 'Terms of Service' },
  { path: 'privacy', title: 'Privacy Policy' },
  { path: 'support', title: 'Customer Support' },
  { path: 'careers', title: 'Careers at Store4Riders' },
];

const basePath = path.join(__dirname, 'frontend', 'app');

pages.forEach(page => {
  const dirPath = path.join(basePath, page.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `
export default function ${page.path.charAt(0).toUpperCase() + page.path.slice(1)}Page() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 text-slate-900 pt-32 pb-16 px-6">
      <div className="max-w-3xl w-full bg-white rounded-3xl p-12 shadow-sm border border-slate-200/80 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-6">
          <span className="font-black text-2xl">${page.title.charAt(0)}</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">${page.title}</h1>
        <p className="text-slate-500 font-medium mb-8 text-lg">
          This is a simulated placeholder page for the portfolio presentation. 
          In a production environment, this would contain the fully functional ${page.title} flow.
        </p>
        ${page.link ? `<a href="${page.link}" className="inline-block bg-brand text-white font-bold px-8 py-4 rounded-full hover:bg-brand-dark hover:scale-105 transition-all shadow-lg hover:shadow-brand/25">${page.linkText}</a>` : `<a href="/" className="inline-block bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-slate-800 hover:scale-105 transition-all">Return Home</a>`}
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content.trim());
});

console.log('Successfully generated dummy pages.');
