import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import Card, { CardHeader } from "../components/common/Card";
import PracticeCard from "../components/regenerative/PracticeCard";
import SustainabilityBar from "../components/regenerative/SustainabilityBar";
import { mockRegenerativePractices, mockSustainabilityMetrics } from "../data/mockData";
import { useTranslation } from "../i18n/useTranslation";

export default function Regenerative() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <Header
        title="Regenerative agriculture"
        subtitle="Long-term practices that build healthier soil and reduce input costs"
      />

      <div className="space-y-8">
        <Card>
          <CardHeader title="Your sustainability snapshot" subtitle="Estimated from recent farm data" />
          <div className="space-y-4">
            {mockSustainabilityMetrics.map((m) => (
              <SustainabilityBar key={m.label} metric={m} />
            ))}
          </div>
        </Card>

        <section>
          <h2 className="text-lg font-semibold text-ink mb-4">{t("Recommended practices")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRegenerativePractices.map((p) => (
              <PracticeCard key={p.id} practice={p} />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
