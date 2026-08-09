// Edit this file to update Projects, Publications, Awards, and Domestic Conferences.
const projects = [
  // {
  //   title: "ALTER",
  //   shortTitle: "ALTER",
  //   thumbnail: "images/projects/ALTER_repimage.png",
  //   description: "Arm–Leg Transformation through Embodied Reconfiguration for Versatile Loco-Manipulation",
  //   links: {
  //     paper: "/ALTER/",
  //     website: "/ALTER/"
  //   }
  // },
  {
    title: "Body Sublimation",
    shortTitle: "BS",
    thumbnail: "images/projects/BS_repimage.png",
    description: "Designing State-Changing Extended Hand for Embodied Out-of-Reach Interaction",
    links: {
      // paper: "https://dl.acm.org/doi/10.1145/3830398.3830583"
      // website: "/body-sublimation/"
    }
  },
  {
    title: "ROomBOT",
    shortTitle: "RB",
    thumbnail: "images/projects/RB_repimage.png",
    description: "A room as an assistive robotic interface based on cable-driven parallel robotics.",
    links: {
      paper: "https://dl.acm.org/doi/10.1145/3731459.3773329",
      website: "https://www.embodiedmedia.org/projects/roombot"
    }
  }
];

const publications = [
  {
    title: "Stretched Reality: Immersive Deformable Environments through Attention-Aware Hand Redirection",
    authors: "Yuya Kato*, Masahiro Ohta*, Zhihong Ding*",
    booktitle: "ACM SIGGRAPH Asia 2026 Emerging Technologies",
    publisher: "ACM",
    year: 2026
    // doi: "XXXX"
  },
  // {
  //   title: "ALTER: Arm–Leg Transformation through Embodied Reconfiguration for Adaptive Loco-Manipulation",
  //   authors: "Masahiro Ohta, Keita Yoneda, Kento Kawaharazuka",
  //   booktitle: "IEEE-RAS 25th International Conference on Humanoid Robots (Humanoids 2026)",
  //   publisher: "IEEE",
  //   year: 2026,
  //   doi: "XXXX"
  // },
  {
    title: "Body Sublimation: Designing State-Changing Extended Hand for Embodied Out-of-Reach Interaction",
    authors: "Masahiro Ohta*, Reigo Ban*, Hideaki Nii, Guillaume Gourmelen, Takuji Narumi, Mauricio Sousa, Takatoshi Yoshida, Kouta Minamizawa",
    booktitle: "Proceedings of the 39th Annual ACM Symposium on User Interface Software and Technology (UIST'26)",
    publisher: "ACM",
    year: 2026
    // doi: "https://dl.acm.org/doi/10.1145/3830398.3830583"
  },
  {
    title: "ROomBOT: A Room as an Assistive Robotic Interface based on Cable-Driven Parallel Robotics",
    authors: "Masahiro Ohta, Takatoshi Yoshida, Tomoya Sasaki, Jinsuke Morita, Hideaki Nii, Kouta Minamizawa",
    booktitle: "Proceedings of the 20th International Conference on Tangible, Embedded, and Embodied Interaction (TEI'26)",
    publisher: "ACM",
    year: 2026,
    doi: "https://dl.acm.org/doi/10.1145/3731459.3773329"
  },
  {
    title: "Public Hand: Proximity-Aware Manipulation of Robotic Hand Shared with Multi-User in Robotic Room",
    authors: "Masahiro Ohta, Takatoshi Yoshida, Tomoya Sasaki, Kouta Minamizawa",
    booktitle: "ACM SIGGRAPH 2025 Emerging Technologies",
    publisher: "ACM",
    year: 2025,
    doi: "https://dl.acm.org/doi/10.1145/3721257.3734020"
  },
  {
    title: "Force to Strain Transducer in Optical Fiber Attachment",
    authors: "Takatoshi Yoshida, Masahiro Ohta, Naoki Yamaguchi, Kohei Noda, Takuma Shirahata, Kouta Minamizawa, Sze Yun Set, Shinji Yamashita",
    booktitle: "CLEO 2025",
    publisher: "Optica Publishing Group",
    year: 2025,
    doi: "https://doi.org/10.1364/CLEO_AT.2025.JPS100_140"
  }
];

const awards = [
  {
    title: "Special Recognition Award (Runner-up)",
    titleUrl: "https://www.kmd.keio.ac.jp/news/whats-new/2026/04/5802/",
    venue: "Twentieth International Conference on Tangible, Embedded, and Embodied Interaction (TEI'26)",
  },
  {
    title: "DIAMOND Award",
    venue: "Student Idea Factory, Japan Association for the Advancement of Science (JAAS)"
  }
];

const domesticConferences = [
  {
    title: "Body Sublimation: XRとロボットによる身体化感覚を保った物体操作のための身体レンダリング手法",
    authors: "太田雅啓*, 伴玲吾*, 新居英明, Guillaume Gourmelen, 鳴海拓志, Mauricio Sousa, 吉田貴寿, 南澤孝太",
    venue: "日本バーチャルリアリティ学会大会（VRSJ 2026）"
  },
  {
    title: "空間知能化ロボティクスに基づく身体動作支援プラットフォームの基礎検討",
    authors: "太田 雅啓, 吉田 貴寿, 佐々木 智也, 森田 迅亮, 新居 英明, 南澤 孝太",
    venue: "日本バーチャルリアリティ学会大会（VRSJ 2025）"
  },
  {
    title: "身体動作選択的なエフェクト提示のための高速プロジェクタの投影パターンの検討",
    authors: "姜 皓翔, 太田 雅啓, 吉田 貴寿",
    venue: "インタラクティブシステムとソフトウェアに関するワークショップ（WISS 2024）, Demo"
  },
  {
    title: "地面圧力分布計測によるかかと上げ動作時の足関節の座標推定に向けた基礎検討",
    authors: "太田 雅啓, 吉田 貴寿, 宮﨑 敦子, 廣瀬 雅治, 稲見 昌彦",
    venue: "第24回計測自動制御学会システムインテグレーション部門講演会（SI 2023）"
  }
];

function highlightSelf(authors = "") {
  return authors
    .replaceAll("太田雅啓", "<strong>太田雅啓</strong>")
    .replaceAll("Masahiro Ohta", "<strong>Masahiro Ohta</strong>")
    .replaceAll("太田 雅啓", "<strong>太田 雅啓</strong>");
}

function linkMarkup(links = {}) {
  const labels = { paper: "Paper", website: "Website" };
  return Object.entries(labels).map(([key, label]) => {
    const url = links[key];
    if (!url) return `<span title="Link will be added later">${label} · Soon</span>`;
    const external = url.startsWith("http");
    return `<a href="${url}"${external ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  }).join("");
}

function renderProjects() {
  const container = document.getElementById("project-list");
  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project";
    const visual = project.thumbnail
      ? `<img src="${project.thumbnail}" alt="${project.title} thumbnail">`
      : `<span aria-hidden="true">${project.shortTitle}</span>`;
    article.innerHTML = `
      <div class="project__visual">${visual}</div>
      <div class="project__content">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="links">${linkMarkup(project.links)}</div>
      </div>`;
    container.appendChild(article);
  });
}

function renderEntries(containerId, entries) {
  const container = document.getElementById(containerId);
  if (!entries.length) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "To be updated.";
    container.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "entry";
    const title = entry.titleUrl
      ? `<a href="${entry.titleUrl}" target="_blank" rel="noopener">${entry.title}</a>`
      : entry.title;
    item.innerHTML = `
      <p class="entry__title">${title}</p>
      ${entry.authors ? `<p class="entry__authors">${highlightSelf(entry.authors)}</p>` : ""}
      ${entry.venue ? `<p class="entry__venue">${entry.venue}</p>` : ""}
      ${entry.links ? `<div class="links">${linkMarkup(entry.links)}</div>` : ""}`;
    container.appendChild(item);
  });
}

function renderPublications() {
  const container = document.getElementById("publication-list");
  publications.forEach((publication) => {
    const item = document.createElement("li");
    item.className = "entry";
    const title = publication.doi
      ? `<a href="${publication.doi}" target="_blank" rel="noopener">${publication.title}</a>`
      : publication.title;
    const locator = publication.pages
      ? `, pp. ${publication.pages}`
      : publication.paperNumber
        ? `, paper ${publication.paperNumber}`
        : "";
    const publisherAndYear = [publication.publisher, publication.year].filter(Boolean).join(", ");
    const bibliographicInfo = publication.booktitle === "Details coming soon"
      ? publication.booktitle
      : `In <em>${publication.booktitle}</em>${locator}.${publisherAndYear ? ` ${publisherAndYear}.` : ""}`;
    item.innerHTML = `
      <p class="entry__title">${title}</p>
      <p class="entry__authors">${highlightSelf(publication.authors)}</p>
      <p class="entry__venue">${bibliographicInfo}</p>`;
    container.appendChild(item);
  });
}

renderProjects();
renderPublications();
renderEntries("award-list", awards);
renderEntries("domestic-list", domesticConferences);
