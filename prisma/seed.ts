import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const works = [
  {
    slug: "paopao",
    title: "泡泡看市",
    summary: "AI 智能投研，用大白话把当天大盘讲给你听。",
    coverImage: "/assets/img/shot-paopao-1.png",
    body: "看盘软件对普通人太不友好——满屏术语、曲线和缩写。核心能力：市场温度、强势板块、今日发生、双模式。",
    tags: ["多agent分析", "个股&板块分析", "热点事件拆解"],
    published: true,
    order: 1,
  },
  {
    slug: "pillowmist",
    title: "枕边雾",
    summary: "深夜才打开的情绪容器，用「雾」收下难安放的情绪。",
    coverImage: "/assets/img/shot-pillowmist.png",
    body: "不急着分析、解决或评判，先让难安放的情绪以「雾」的方式被收下。核心能力：夜间雾卡记录、时间雾团首页、擦雾阅读、雾的归处、雾灵陪伴。",
    tags: ["失眠疗愈"],
    published: true,
    order: 2,
  },
  {
    slug: "ideaboom",
    title: "灵感炸了",
    summary: "把想选题和跟爆款二创，变成有方法、有评分的确定性动作。",
    coverImage: "/assets/img/shot-ideaboom-1.png",
    body: "做内容的人常卡在三件事上：选题靠拍脑袋、爆款命中率低、跟爆款只会照搬。核心能力：AI 智能选题、爆款仿写二创、质量门自评与合规底线。",
    tags: ["选题神器"],
    published: true,
    order: 3,
  },
  {
    slug: "cosmicbug",
    title: "宇宙草台班子大质检",
    summary: "输入授权码解锁的 AI 质检台，专治各种草台班子。",
    coverImage: "/assets/img/shot-cosmicbug-1.jpg",
    body: "COSMIC QUALITY INSPECTION SYSTEM —— 一个要输入授权码才解锁的 AI 质检台。体验授权码：zia55。",
    tags: ["人格测试"],
    published: true,
    order: 4,
  },
];

const creates = [
  { title: "月下猫与纱", image: "/assets/img/create-mooncat.jpg", caption: "AI 生图", order: 1 },
  { title: "蝴蝶少女", image: "/assets/img/create-butterfly-girl.jpg", caption: "AI 生图", order: 2 },
  { title: "紫蓝流体", image: "/assets/img/create-fluid-butterfly.jpg", caption: "AI 生图", order: 3 },
];

async function main() {
  for (const w of works) {
    await prisma.work.upsert({
      where: { slug: w.slug },
      update: {
        title: w.title,
        summary: w.summary,
        coverImage: w.coverImage,
        body: w.body,
        tags: JSON.stringify(w.tags),
        published: w.published,
        order: w.order,
      },
      create: {
        ...w,
        tags: JSON.stringify(w.tags),
      },
    });
  }

  for (const c of creates) {
    await prisma.create.upsert({
      where: { id: c.title },
      update: {
        image: c.image,
        caption: c.caption,
        order: c.order,
      },
      create: c,
    });
  }

  console.log("种子数据已写入：", works.length, "个作品，", creates.length, "个创作");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
