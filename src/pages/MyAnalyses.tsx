import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronRight, Trash2, FileText, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  listAnalyses,
  deleteAnalysis,
  methodLabel,
  methodologyLabel,
  tierLabel,
  type SavedAnalysis,
} from "@/lib/analysisStorage";

export default function MyAnalyses() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(null);

    const result = await listAnalyses(user.id);

    if (result.error) {
      console.error("[MyAnalyses] listAnalyses error:", result.error);
      setLoadError(result.error);
    } else {
      setAnalyses(result.data);
      setFromCache(!!result.fromCache);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    const { error } = await deleteAnalysis(id);
    if (error) {
      toast.error("Не удалось удалить: " + error);
      return;
    }
    setAnalyses((arr) => arr.filter((a) => a.id !== id));
    toast.success("Разбор удалён");
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 md:mb-8 gap-3">
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-primary mb-1">
                Мои разборы
              </h1>
              <p className="text-sm text-muted-foreground">
                История всех сделанных вами разборов
              </p>
            </div>
            <Link to="/">
              <Button className="rounded-full whitespace-nowrap">
                <Plus className="w-4 h-4 mr-1.5" />
                Новый разбор
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
          ) : loadError ? (
            <div className="gradient-card rounded-2xl p-6 md:p-8 border border-destructive/40 text-center">
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <h3 className="font-display text-lg text-foreground mb-2">Не удалось загрузить разборы</h3>
              <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
              <Button onClick={load} className="rounded-full">Попробовать снова</Button>
            </div>
          ) : analyses.length === 0 ? (
            <div className="gradient-card rounded-2xl p-8 md:p-12 border border-border text-center">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="font-display text-xl text-foreground mb-2">
                Пока нет ни одного разбора
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Сделайте первый разбор — он сохранится здесь
              </p>
              <Link to="/">
                <Button className="rounded-full">
                  Сделать разбор
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {fromCache && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Не удалось обновить список с сервера — показана локальная копия. Проверьте подключение к интернету.</span>
                </div>
              )}
              <div className="space-y-3">
              {analyses.map((a) => (
                <div
                  key={a.id}
                  className="gradient-card rounded-xl border border-border hover:border-primary/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 p-4">
                    <Link
                      to={`/my-analyses/${a.id}`}
                      className="flex-1 flex items-center gap-3 min-w-0"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-foreground truncate">
                          {a.title || methodLabel(a.method_id)}
                        </h3>
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                          <span>{methodologyLabel(a.methodology)}</span>
                          <span>•</span>
                          <span>{tierLabel(a.tier)}</span>
                          <span>•</span>
                          <span>{formatDate(a.created_at)}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Удалить этот разбор?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Действие нельзя отменить. Разбор будет удалён навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(a.id)}>
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
