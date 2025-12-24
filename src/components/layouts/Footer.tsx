export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold mb-4">关于我们</h3>
            <p className="text-sm text-muted-foreground">
              ChinaResearchHub 致力于为全球用户提供最新、最全面的中国研究报告和市场分析资料。
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  首页
                </a>
              </li>
              <li>
                <a href="/reports" className="text-muted-foreground hover:text-primary transition-colors">
                  研报列表
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <p className="text-sm text-muted-foreground">
              如有任何问题或建议，欢迎联系我们。
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ChinaResearchHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
