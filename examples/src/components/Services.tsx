import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: "🎨",
      title: "UI 界面设计",
      description: "创造美观、直观的用户界面，确保每个像素都有其存在的意义",
      features: ["视觉设计", "图标设计", "组件库", "设计规范"],
      price: "¥5,000起"
    },
    {
      icon: "🔍",
      title: "UX 用户体验",
      description: "深入研究用户行为，设计符合用户心理模型的产品体验",
      features: ["用户研究", "信息架构", "用户旅程", "可用性测试"],
      price: "¥8,000起"
    },
    {
      icon: "📱",
      title: "移动应用设计",
      description: "专注于移动端的交互体验，适配不同设备和操作习惯",
      features: ["iOS设计", "Android设计", "响应式设计", "交互原型"],
      price: "¥12,000起"
    },
    {
      icon: "🌐",
      title: "网站设计",
      description: "现代化的网站设计，平衡美观性和功能性的完美结合",
      features: ["网页设计", "着陆页", "电商设计", "后台系统"],
      price: "¥10,000起"
    },
    {
      icon: "🏢",
      title: "品牌视觉设计",
      description: "打造独特的品牌视觉识别，让您的品牌在市场中脱颖而出",
      features: ["Logo设计", "品牌指南", "视觉识别", "品牌应用"],
      price: "¥15,000起"
    },
    {
      icon: "⚡",
      title: "设计咨询",
      description: "为您的产品提供专业的设计建议和优化方案",
      features: ["设计评估", "用户研究", "竞品分析", "优化建议"],
      price: "¥2,000/小时"
    }
  ];

  const process = [
    {
      step: "01",
      title: "需求分析",
      description: "深入了解项目背景、目标用户和业务需求",
      duration: "1-2天"
    },
    {
      step: "02",
      title: "用户研究",
      description: "进行用户访谈、竞品分析和市场调研",
      duration: "3-5天"
    },
    {
      step: "03",
      title: "概念设计",
      description: "制定设计策略，创建初步的设计概念",
      duration: "2-3天"
    },
    {
      step: "04",
      title: "视觉设计",
      description: "完善界面设计，制作高保真原型",
      duration: "5-10天"
    },
    {
      step: "05",
      title: "测试优化",
      description: "用户测试反馈，持续优化设计方案",
      duration: "2-3天"
    },
    {
      step: "06",
      title: "交付支持",
      description: "设计交付，提供开发支持和规范文档",
      duration: "1-2天"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              专业服务
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              提供全方位的设计服务，从用户研究到视觉实现，
              帮助您的产品在竞争中脱颖而出。
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <Card
                key={service.title}
                className="group bg-card border-border hover:border-primary transition-all duration-500 shadow-card hover:shadow-elegant animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {service.price}
                    </span>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Process Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
                设计流程
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                我遵循系统化的设计流程，确保每个项目都能达到最佳效果
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {process.map((item, index) => (
                <div
                  key={item.step}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <span className="text-xs text-primary font-medium">
                        预计时间: {item.duration}
                      </span>
                    </div>
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-8 h-px bg-border transform translate-x-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-secondary p-12 rounded-3xl border border-border">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              准备开始您的项目吗？
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              让我们一起创造令人印象深刻的数字体验。联系我讨论您的项目需求，
              获取专业的设计建议和报价。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                查看作品集
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;