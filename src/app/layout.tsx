import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import NavAuth from "@/components/NavAuth";
import "../../assets/css/tokens.css";
import "../../assets/css/base.css";
import "../../assets/css/components.css";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Pinkie · vibecoder 作品集",
    template: "%s · Pinkie",
  },
  description:
    "Pinkie — 通过 vibecoding 将产品构想转化为可运行的代码，用 AI 拓展创造力的边界。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <canvas id="ambient-canvas" aria-hidden="true"></canvas>
        <div className="aurora-bg" aria-hidden="true">
          <span className="blob b1"></span>
          <span className="blob b2"></span>
          <span className="blob b3"></span>
          <span className="blob b4"></span>
        </div>
        <div className="scroll-progress" id="scrollProgress"></div>

        <header className="nav" id="nav">
          <div className="nav__inner">
            <a className="brand" href="/">
              <span className="brand__dot"></span>Pinkie
            </a>
            <nav className="nav__links" aria-label="主导航">
              <a href="/">首页</a>
              <Suspense fallback={null}>
                <NavAuth />
              </Suspense>
            </nav>
            <button
              className="nav__toggle"
              aria-label="菜单"
              aria-expanded="false"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        {children}

        <footer className="footer">
          <div className="container footer__inner">
            <a className="brand" href="/">
              <span className="brand__dot"></span>Pinkie
            </a>
            <nav className="footer__links" aria-label="页脚导航">
              <a href="/works">作品</a>
              <a href="/creates">创作</a>
              <a href="/about">关于</a>
              <a href="/contact">联系</a>
              <a href="#" rel="noopener">
                X / Twitter
              </a>
              <a href="#" rel="noopener">
                GitHub
              </a>
            </nav>
            <p className="footer__copy">© 2026 Pinkie · 用 vibe 打造</p>
          </div>
        </footer>

        <Script src="/assets/js/ambient.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
