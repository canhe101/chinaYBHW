import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const skills = [
    { name: "UI 设计", level: 95, color: "from-purple-500 to-blue-500" },
    { name: "UX 研究", level: 90, color: "from-blue-500 to-cyan-500" },
    { name: "原型设计", level: 88, color: "from-cyan-500 to-green-500" },
    { name: "交互设计", level: 92, color: "from-green-500 to-yellow-500" },
    { name: "视觉设计", level: 94, color: "from-yellow-500 to-red-500" },
    { name: "品牌设计", level: 85, color: "from-red-500 to-pink-500" }
  ];

  const tools = [
    "Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", 
    "Principle", "InVision", "Framer", "Zeplin", "Abstract"
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              关于我
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              作为一名充满激情的UI/UX设计师，我致力于创造既美观又实用的数字体验。
              我相信好的设计不仅要看起来美观，更要解决真正的用户问题。
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Story */}
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  我的设计理念
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    我认为优秀的设计应该是invisible的 - 当用户使用产品时，
                    他们不应该被界面所困扰，而是能够直观地完成他们的目标。
                  </p>
                  <p>
                    我的设计过程始终以用户为中心，通过深入的用户研究和数据分析，
                    确保每一个设计决策都有据可依。同时，我也注重视觉美学，
                    相信美观的界面能够提升用户的情感体验。
                  </p>
                  <p>
                    在这个快速变化的数字时代，我持续学习新的设计趋势和技术，
                    确保我的设计既符合当前标准，又能引领未来潮流。
                  </p>
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                  设计工具
                </h3>
                <div className="flex flex-wrap gap-3">
                  {tools.map((tool, index) => (
                    <span
                      key={tool}
                      className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground border border-border hover:border-primary transition-colors duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                专业技能
              </h3>
              <div className="space-y-6">
                {skills.map((skill, index) => (
                  <div key={skill.name} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-foreground font-medium">{skill.name}</span>
                      <span className="text-muted-foreground text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`}
                        style={{
                          width: `${skill.level}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Cards */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:border-primary transition-colors duration-300 shadow-card hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary-foreground">3+</span>
                </div>
                <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                  工作经验
                </h4>
                <p className="text-muted-foreground">
                  专注于数字产品设计，积累了丰富的项目经验
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors duration-300 shadow-card hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary-foreground">50+</span>
                </div>
                <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                  完成项目
                </h4>
                <p className="text-muted-foreground">
                  涵盖移动应用、网站设计、品牌视觉等多个领域
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:border-primary transition-colors duration-300 shadow-card hover:shadow-elegant group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-primary-foreground">98%</span>
                </div>
                <h4 className="text-xl font-heading font-semibold text-foreground mb-2">
                  客户满意度
                </h4>
                <p className="text-muted-foreground">
                  始终以客户需求为导向，提供优质的设计服务
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;