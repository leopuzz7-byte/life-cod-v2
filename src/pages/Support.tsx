import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Mail, MessageCircle, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const SupportPage = () => {
  const { t } = useTranslation();

  const handleTelegramClick = () => {
    window.open("https://t.me/BisnessWomenN", "_blank");
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-display text-primary mb-8 text-center">
          {t("support.title")}
        </h1>

        <section className="max-w-3xl mx-auto mb-12">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">{t("support.contactUs")}</h2>
            </div>
            <p className="text-muted-foreground mb-6">{t("support.contactDesc")}</p>
            <Button
              onClick={handleTelegramClick}
              className="btn-fill bg-primary hover:bg-primary text-primary-foreground rounded-full border-2 border-primary"
            >
              <Mail className="w-4 h-4 mr-2" />
              {t("support.writeToTelegram")}
            </Button>
          </div>
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">{t("support.privacyPolicy")}</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <p>{t("support.privacyIntro")}</p>
              <h3 className="text-foreground font-medium">{t("support.dataCollection")}</h3>
              <p>{t("support.dataCollectionDesc")}</p>
              <h3 className="text-foreground font-medium">{t("support.dataUsage")}</h3>
              <p>{t("support.dataUsageDesc")}</p>
              <h3 className="text-foreground font-medium">{t("support.dataStorage")}</h3>
              <p>{t("support.dataStorageDesc")}</p>
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto">
          <div className="gradient-card rounded-2xl p-6 md:p-8 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-display text-foreground">{t("support.termsOfUse")}</h2>
            </div>
            <div className="text-muted-foreground space-y-4">
              <h3 className="text-foreground font-medium">{t("support.generalProvisions")}</h3>
              <p>{t("support.generalProvisionsDesc")}</p>
              <h3 className="text-foreground font-medium">{t("support.informationalNature")}</h3>
              <p>{t("support.informationalNatureDesc")}</p>
              <h3 className="text-foreground font-medium">{t("support.responsibility")}</h3>
              <p>{t("support.responsibilityDesc")}</p>
              <h3 className="text-foreground font-medium">{t("support.termsChanges")}</h3>
              <p>{t("support.termsChangesDesc")}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SupportPage;