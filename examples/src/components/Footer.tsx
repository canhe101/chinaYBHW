const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-xl text-foreground">设计师</h3>
              <p className="text-muted-foreground leading-relaxed">
                专注于创造美好的数字体验，让设计成为连接用户与产品的桥梁。
              </p>
              <div className="flex space-x-4">
                {["💬", "📱", "🔗", "🏀", "🎨"].map((icon, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-110"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-foreground">
                快速链接
              </h4>
              <div className="space-y-2">
                {[
                  { name: "关于我", id: "about" },
                  { name: "作品集", id: "portfolio" },
                  { name: "服务", id: "services" },
                  { name: "联系", id: "contact" }
                ].map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      const element = document.getElementById(link.id);
                      element?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-heading font-semibold text-foreground">
                联系信息
              </h4>
              <div className="space-y-2 text-muted-foreground">
                <p>📧xxxxx@163.com</p>
                <p>💬 Miaoda</p>
                <p>📍 中国·北京</p>
                <p>⏰ 周一至周五 9:00-18:00</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-muted-foreground text-sm">© 2025 MIAODA</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
                隐私政策
              </button>
              <button className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
                服务条款
              </button>
              <button className="text-muted-foreground hover:text-primary text-sm transition-colors duration-300">
                网站地图
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;