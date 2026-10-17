interface Props {
  userName: string;
  onNavigate: (page: string) => void;
}

interface QuickCardProps {
  icon: string;
  title: string;
  description: string;
  page: string;
  onNavigate: (page: string) => void;
}

function QuickCard({
  icon,
  title,
  description,
  page,
  onNavigate,
}: QuickCardProps) {
  return (
    <button
      className="home-quick-card"
      type="button"
      onClick={() => onNavigate(page)}
    >
      <span className="home-quick-icon">{icon}</span>
      <span>
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
      <span className="home-arrow">→</span>
    </button>
  );
}

export default function Home({ userName, onNavigate }: Props) {
  return (
    <section className="home-page">
      <div className="home-welcome">
        <div>
          <span className="eyebrow">AGROSENSE</span>
          <h1>Welcome back, {userName}! 🌱</h1>
          <p>
            Monitor your smart greenhouse, review sensor data, and keep track
            of important alerts from one place.
          </p>
        </div>

        <button
          className="primary-btn home-dashboard-btn"
          type="button"
          onClick={() => onNavigate("dashboard")}
        >
          Open Dashboard →
        </button>
      </div>

      <div className="home-feature-grid">
        <div className="home-feature-card">
          <span className="home-feature-icon">📊</span>
          <div>
            <strong>Live Monitoring</strong>
            <p>View your greenhouse telemetry and current sensor readings.</p>
          </div>
        </div>

        <div className="home-feature-card">
          <span className="home-feature-icon">🔔</span>
          <div>
            <strong>Stay Alert</strong>
            <p>Check warnings and important events before they become issues.</p>
          </div>
        </div>

        <div className="home-feature-card">
          <span className="home-feature-icon">🌿</span>
          <div>
            <strong>Smart Greenhouse</strong>
            <p>Manage your connected sensors and keep your greenhouse healthy.</p>
          </div>
        </div>
      </div>

      <div className="home-section-heading">
        <div>
          <span className="eyebrow">QUICK ACCESS</span>
          <h2>What would you like to check?</h2>
        </div>
      </div>

      <div className="home-quick-grid">
        <QuickCard
          icon="📈"
          title="Dashboard"
          description="See live greenhouse telemetry"
          page="dashboard"
          onNavigate={onNavigate}
        />
        <QuickCard
          icon="🕒"
          title="History"
          description="Review previous sensor readings"
          page="history"
          onNavigate={onNavigate}
        />
        <QuickCard
          icon="🚨"
          title="Alerts"
          description="Check warnings and notifications"
          page="alerts"
          onNavigate={onNavigate}
        />
        <QuickCard
          icon="📡"
          title="Sensors"
          description="Manage your greenhouse sensors"
          page="sensors"
          onNavigate={onNavigate}
        />
      </div>

      <div className="home-info-panel">
        <div className="home-info-icon">💡</div>
        <div>
          <strong>AgroSense at a glance</strong>
          <p>
            Your central starting point for smart greenhouse monitoring.
            Use the navigation above or the quick-access cards to move between
            the existing sections of your application.
          </p>
        </div>
      </div>
    </section>
  );
}
