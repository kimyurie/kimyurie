import { writeFileSync, readFileSync } from 'node:fs';
import Parser from 'rss-parser';

const parser = new Parser({
    headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml; q=0.1',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    }
});

const RSS_URL = 'https://hsyr1791.tistory.com/rss'; // 본인 블로그 RSS 주소 입력

(async () => {
    console.log("🚀 RSS 피드에서 데이터를 가져오는 중...");
    const feed = await parser.parseURL(RSS_URL);
    console.log("📌 가져온 RSS 데이터:", feed.items.map(item => item.title));

    let latestPosts = `<h3 align="center">📢 Latest Blog Posts</h3>\n<ul>\n`;
    for (let i = 0; i < Math.min(5, feed.items.length); i++) {
        const { title, link } = feed.items[i];
        latestPosts += `<li><a href="${link}" target="_blank">${title}</a></li>\n`;
    }
    latestPosts += `</ul>\n`;

    console.log("✅ 최신 블로그 글 리스트 생성 완료");

    // 기존 README 불러오기
    let readmeContent = readFileSync('README.md', 'utf8');
    console.log("📝 기존 README 불러오기 완료");

    // 📌 "📢 Latest Blog Posts" 섹션을 찾아서 업데이트
    const blogSectionRegex = /<h3 align="center">📢 Latest Blog Posts<\/h3>[\s\S]*?<\/ul>/;

    if (blogSectionRegex.test(readmeContent)) {
        console.log("🔄 기존 블로그 섹션 업데이트 중...");
        readmeContent = readmeContent.replace(blogSectionRegex, latestPosts);
    } else {
        console.log("➕ 블로그 섹션이 없어서 새로 추가");
        readmeContent += `\n${latestPosts}`;
    }

    // 📌 변경된 내용 확인 (디버깅용)
    console.log("🧐 업데이트 후 README.md 내용 미리보기:");
    console.log(readmeContent.slice(-500)); // 마지막 500글자 출력해서 확인

    // 업데이트된 README 저장
    writeFileSync('README.md', readmeContent, 'utf8');
    console.log("✅ README.md 업데이트 완료!");
})();
