/**
 * Tarjeta de métrica reutilizable en todos los dashboards.
 */
export default function StatCard({ label, value, sub, dotColor }) {
  return (
    <div
      className="bg-white rounded-xl p-4"
      style={{ border: '0.5px solid #e2e8f0' }}
    >
      <p className="text-[10px] uppercase tracking-wide mb-1.5"
        style={{ color: '#8a9bb0' }}>
        {label}
      </p>
      <p className="text-[26px] font-bold leading-none mb-1"
        style={{ color: '#023859' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] flex items-center gap-1" style={{ color: '#8a9bb0' }}>
          {dotColor && (
            <span className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: dotColor }} />
          )}
          {sub}
        </p>
      )}
    </div>
  )
}