export const metadata = {
  title: "联系",
};

export default function ContactPage() {
  return (
    <main>
      <section
        className="section"
        style={{ paddingTop: "calc(var(--nav-h) + var(--sp-10))" }}
      >
        <div className="container">
          <div className="section-head reveal" style={{ textAlign: "center" }}>
            <p className="eyebrow">联系</p>
            <h1 className="section-title">说个想法，我们 vibe 一下</h1>
            <p className="lead muted" style={{ marginInline: "auto" }}>
              填下面的表，或者直接找我。通常 24 小时内回。
            </p>
          </div>

          <div className="contact-grid reveal">
            <form className="contact-form" action="mailto:hi@yourname.dev">
              <div className="field">
                <label htmlFor="name">你的名字</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="怎么称呼你"
                  autoComplete="name"
                />
              </div>
              <div className="field">
                <label htmlFor="email">邮箱</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@xx.com"
                  autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="msg">想 vibe 什么</label>
                <textarea
                  id="msg"
                  name="msg"
                  placeholder="一句话讲讲你的点子 / 需求"
                ></textarea>
              </div>
              <button className="btn btn--primary btn--lg" type="submit">
                发送 →
              </button>
            </form>

            <div className="contact-list">
              <div className="contact-item">
                <span className="ic">✉️</span>
                <div>
                  <div className="k">Email</div>
                  <div className="v">hi@yourname.dev</div>
                </div>
              </div>
              <div className="contact-item">
                <span className="ic">𝕏</span>
                <div>
                  <div className="k">X / Twitter</div>
                  <div className="v">@yourhandle</div>
                </div>
              </div>
              <div className="contact-item">
                <span className="ic">💻</span>
                <div>
                  <div className="k">GitHub</div>
                  <div className="v">github.com/yourname</div>
                </div>
              </div>
              <div className="contact-item">
                <span className="ic">💬</span>
                <div>
                  <div className="k">微信 / 私信</div>
                  <div className="v">备注「vibe」即可</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
