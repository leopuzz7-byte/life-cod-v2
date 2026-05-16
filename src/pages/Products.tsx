import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Brain, Sparkles, Heart } from "lucide-react";

const ProductsPage = () => {
  const { t } = useTranslation();

  const products = [
    {
      id: "psychology",
      title: t("products.psychology"),
      description: t("products.psychologyDesc"),
      icon: Brain,
      link: "https://serdcepiligrima.com/psychology",
    },
    {
      id: "cyberpsychology",
      title: t("products.digitalPsychology"),
      description: t("products.digitalPsychologyDesc"),
      icon: Calculator,
      link: "https://serdcepiligrima.com/cyberpsychology",
    },
    {
      id: "esotericism",
      title: t("products.esoterics"),
      description: t("products.esotericsDesc"),
      icon: Sparkles,
      link: "https://serdcepiligrima.com/esotericism",
    },
    {
      id: "practices",
      title: t("products.practices"),
      description: t("products.practicesDesc"),
      icon: Heart,
      link: "https://serdcepiligrima.com/practices",
    },
  ];

  const handleClick = (link: string) => {
    if (link.startsWith("http")) {
      window.open(link, "_blank");
    } else {
      window.location.href = link;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display text-primary text-center mb-10">
            {t("products.title")}
          </h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group gradient-card rounded-2xl p-6 border border-border transition-all duration-300 cursor-pointer hover:border-primary/30"
                onClick={() => handleClick(product.link)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <product.icon className="w-6 h-6 text-primary" />
                </div>
                
                <h3 className="text-xl font-display text-foreground mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 min-h-[48px]">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Button className="btn-fill animate-gentle-shake bg-primary text-primary-foreground border-2 border-primary">
                    {t("products.learnMore")}
                  </Button>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;