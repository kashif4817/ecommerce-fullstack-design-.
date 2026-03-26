const BrandLogo = ({ size = 'md' }) => {
  const iconSizes = {
    sm: { wrapper: 'p-1.5 rounded-md', svg: 'w-4 h-4', text: 'text-lg' },
    md: { wrapper: 'p-2 rounded-lg', svg: 'w-6 h-6', text: 'text-2xl' },
    lg: { wrapper: 'p-2.5 rounded-xl', svg: 'w-8 h-8', text: 'text-3xl' },
  };

  const s = iconSizes[size] || iconSizes.md;

  return (
    <div className="flex items-center gap-2">
      <div className={`bg-blue-500 ${s.wrapper}`}>
        <svg
          className={s.svg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <span className={`${s.text} font-bold text-blue-400`}>Brand</span>
    </div>
  );
};

export default BrandLogo;