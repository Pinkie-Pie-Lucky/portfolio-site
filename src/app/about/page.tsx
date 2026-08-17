import Link from "next/link";

const skills = [
  { name: "快速原型", val: 95 },
  { name: "AI 提示工程", val: 88 },
  { name: "产品设计 / UX", val: 82 },
  { name: "前端实现", val: 78 },
  { name: "审美取舍", val: 70 },
];

export const metadata = {
  title: "关于",
};

export default function AboutPage() {
  return (
    <main>
      <section
        className="section"
        style={{ paddingTop: "calc(var(--nav-h) + var(--sp-10))" }}
      >
        <div className="container">
          <div className="about-grid">
            <div className="reveal">
              <p className="eyebrow">关于我</p>
              <h1 className="section-title">靠好奇心驱动的人</h1>
              <p className="lead muted">
                我相信好产品来自频繁的小实验，而不是憋大招。业余时间写工具、做玩具、折腾
                AI，把过程都摊开给你看。
              </p>
              <p className="muted" style={{ marginTop: "var(--sp-4)" }}>
                不追求一次做对，追求快速试错、快速改进。vibe
                coding 对我而言不是偷懒，而是把「想」和「做」之间的延迟压到最低。
              </p>
            </div>
            <div className="about-portrait reveal" aria-hidden="true">
              🧑‍💻
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">能力面板</p>
            <h2 className="section-title">我的技能条</h2>
          </div>
          <div className="skill-grid">
            {skills.map((s) => (
              <div className="skill reveal" style={{ "--w": `${s.val}%` } as React.CSSProperties} key={s.name}>
                <div className="skill__top">
                  <span className="skill__name">{s.name}</span>
                  <span className="skill__val">{s.val}</span>
                </div>
                <div className="skill__bar">
                  <div className="skill__fill"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ textAlign: "center" }}>
          <div className="reveal">
            <h2 className="section-title">想一起 vibe 点什么？</h2>
            <div className="hero__cta" style={{ justifyContent: "center" }}>
              <Link className="btn btn--primary btn--lg" href="/contact">
                联系我 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
