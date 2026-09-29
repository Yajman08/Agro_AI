import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import AppLayout from "../components/layout/AppLayout";
import Header from "../components/layout/Header";
import AdvisoryCard from "../components/advisory/AdvisoryCard";
import QuickQuestionChip from "../components/advisory/QuickQuestionChip";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import DataProvenance from "../components/common/DataProvenance";
import { getAdvisory } from "../services/api";
import { mockQuickQuestions } from "../data/mockData";
import type { AdvisoryData, RequestState } from "../types";
import { Sparkles } from "lucide-react";
import { useTranslation } from "../i18n/useTranslation";

export default function Advisory() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [data, setData] = useState<AdvisoryData | null>(null);
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    getAdvisory()
      .then((advisory) => {
        if (!cancelled) {
          setData(advisory);
          setState("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "We couldn't prepare your advisory.");
          setState("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const askAdvisor = async (nextQuestion: string) => {
    const trimmedQuestion = nextQuestion.trim();
    if (!trimmedQuestion) return;

    setQuestion(trimmedQuestion);
    setSubmittedQuestion(trimmedQuestion);
    setState("loading");
    setError(null);

    try {
      const advisory = await getAdvisory(trimmedQuestion);
      setData(advisory);
      setState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't prepare your advisory.");
      setState("error");
    }
  };

  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askAdvisor(question);
  };

  return (
    <AppLayout>
      <Header title="Your AI Farm Advisor" subtitle="Today's prioritized actions for your farm" />

      <div className="space-y-8">
        <Card>
          <div className="flex items-start gap-3 mb-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-50 text-forest-700 shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="font-medium text-ink">{t("Ask a question about your farm")}</p>
              <p className="text-sm text-ink-soft mt-0.5">
                {t("Get a short, practical answer based on your available farm data.")}
              </p>
            </div>
          </div>

          <form onSubmit={submitQuestion} className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="advisory-question" className="sr-only">
              Your farming question
            </label>
            <input
              id="advisory-question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What should I do before tomorrow's rain?"
              className="min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-forest-500 focus:ring-1 focus:ring-forest-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!question.trim() || state === "loading"}
              className="inline-flex items-center justify-center rounded-full bg-forest-700 text-white px-5 py-2.5 text-sm font-medium hover:bg-forest-900 disabled:cursor-not-allowed disabled:bg-forest-300 transition-colors"
            >
              Ask advisor
            </button>
          </form>

          <div className="mt-5">
            <p className="text-sm font-medium text-ink-soft mb-3">{t("Try one of these")}</p>
            <div className="flex flex-wrap gap-2">
              {mockQuickQuestions.map((quickQuestion) => (
                <QuickQuestionChip
                  key={quickQuestion.id}
                  question={quickQuestion.question}
                  onClick={() => void askAdvisor(quickQuestion.question)}
                />
              ))}
            </div>
          </div>
        </Card>

        {state === "loading" && <Loading message="Preparing advice for your farm..." />}
        {state === "error" && (
          <ErrorState
            message={error ?? "We couldn't prepare your advisory."}
            onRetry={() => submittedQuestion && void askAdvisor(submittedQuestion)}
          />
        )}
        {state === "idle" && (
          <Card>
            <EmptyState
              icon={<Sparkles className="h-5 w-5" />}
              title="Your advisory will appear here"
              description="Choose a question above to receive practical actions for your farm."
            />
          </Card>
        )}

        {data && state === "success" && (
        <div className="space-y-8">
          <Card className="bg-forest-700 text-white border-none">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 shrink-0">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-xs text-forest-100 mb-1">
                  AI-generated advisory{submittedQuestion ? ` for “${submittedQuestion}”` : ""}
                </p>
                <p className="font-medium">{data.summary}</p>
              </div>
            </div>
          </Card>

          <section>
            <h2 className="text-sm font-medium text-ink-soft mb-3">{t("Today")}</h2>
            <div className="space-y-4">
              {data.actions.map((action) => (
                <AdvisoryCard key={action.id} advisory={action} />
              ))}
            </div>
            <DataProvenance
              source="Mock AI advisory engine (sample data)"
              updated={data.generatedAt}
            />
          </section>
        </div>
        )}
      </div>
    </AppLayout>
  );
}
