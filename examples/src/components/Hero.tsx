import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";
import avatarImage from "@/assets/avatar.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-60" />
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wide uppercase text-sm">
                UI/UX 设计师
              </p>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-foreground leading-tight">
                创造美好的
                <span className="bg-gradient-primary bg-clip-text text-transparent block">
                  数字体验
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">专注用户界面设计和用户体验优化。通过创新的设计理念， 为数字产品注入生命力。</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => scrollToSection("portfolio")}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-glow"
              >
                查看作品集
              </Button>

            </div>
            
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">项目完成</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">3年</div>
                <div className="text-sm text-muted-foreground">设计经验</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground">客户满意</div>
              </div>
            </div>
          </div>
          
          <div className="relative lg:flex justify-center hidden animate-scale-in bg-[transparent] bg-none">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-elegant animate-float bg-inherit bg-cover bg-center bg-no-repeat bg-[url(https://sandbox-miaoda-edit-image.cdn.bcebos.com/5sodwwan9hj5/IMG-5sp4ya7jnz0g.png)]">

              </div>

            </div>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;