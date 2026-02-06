interface StatusBannerProps {
  type: 'match' | 'mismatch' | 'warning' | 'early-vote';
  message: string;
  subtitle?: string;
}

export function StatusBanner({ type, message, subtitle }: StatusBannerProps) {
  const styles = {
    match: 'bg-green-900/30 border-green-800 text-green-400',
    mismatch: 'bg-red-600 border-red-700 text-white',
    warning: 'bg-yellow-900/30 border-yellow-800 text-yellow-400',
    'early-vote': 'bg-orange-900/30 border-orange-800 text-orange-400',
  };

  return (
    <div className={`text-center py-3 px-4 rounded-lg mb-6 border ${styles[type]}`}>
      <p className="font-medium">{message}</p>
      {subtitle && <p className="text-sm mt-1 opacity-90">{subtitle}</p>}
    </div>
  );
}
