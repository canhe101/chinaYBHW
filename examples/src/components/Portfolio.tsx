import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "移动健康应用",
      category: "mobile",
      description: "为健康管理设计的直观移动应用界面，注重用户体验和数据可视化",
      image: project1,
      tags: ["UI设计", "移动应用", "健康科技"],
      link: "#"
    },
    {
      id: 2,
      title: "电商平台重设计",
      category: "web",
      description: "现代化的电商网站设计，提升用户购物体验和转化率",
      image: project2,
      tags: ["网页设计", "电商", "用户体验"],
      link: "#"
    },
    {
      id: 3,
      title: "品牌视觉识别系统",
      category: "branding",
      description: "完整的品牌视觉识别系统设计，包括logo、色彩和字体规范",
      image: project3,
      tags: ["品牌设计", "视觉识别", "标志设计"],
      link: "#"
    },
    {
      id: 4,
      title: "金融科技应用",
      category: "mobile",
      description: "简洁安全的金融应用界面设计，注重信任感和易用性",
      image: project1,
      tags: ["金融科技", "移动应用", "安全设计"],
      link: "#"
    },
    {
      id: 5,
      title: "教育平台界面",
      category: "web",
      description: "在线教育平台的用户界面设计，优化学习体验和互动性",
      image: project2,
      tags: ["教育科技", "网页设计", "互动设计"],
      link: "#"
    },
    {
      id: 6,
      title: "创业公司品牌",
      category: "branding",
      description: "为科技创业公司打造的现代品牌形象和视觉规范",
      image: project3,
      tags: ["创业品牌", "科技", "现代设计"],
      link: "#"
    }
  ];

  const filters = [
    { id: "all", name: "全部作品" },
    { id: "mobile", name: "移动应用" },
    { id: "web", name: "网页设计" },
    { id: "branding", name: "品牌设计" }
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-6">
              精选作品
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              这里展示了我最引以为豪的设计作品。每个项目都体现了我对用户体验、
              视觉美学和商业目标的深入理解。
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                variant={activeFilter === filter.id ? "default" : "outline"}
                className={`transition-all duration-300 ${
                  activeFilter === filter.id 
                    ? "bg-gradient-primary shadow-glow" 
                    : "hover:border-primary hover:text-primary"
                }`}
              >
                {filter.name}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                className="group bg-card border-border hover:border-primary transition-all duration-500 shadow-card hover:shadow-elegant overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">

                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">

          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;