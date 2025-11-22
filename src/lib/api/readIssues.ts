// 读取 GitHub Issues 并解析为论坛帖子
interface Thread {
  id: string;
  title: string;
  body: string;
  nickname: string;
  category: string;
  createdAt: string;
}

// 演示数据（当未设置 GITHUB_REPO 时使用）
const DEMO_THREADS: Thread[] = [
  {
    id: '1',
    title: '昨晚祷告会蒙主垂听',
    body: '为孩子升学的事连续一周禁食祷告，今天收到录取通知！感谢主！',
    nickname: '王姐妹',
    category: '祷告事项',
    createdAt: '2025-11-20T10:00:00Z'
  },
  {
    id: '2',
    title: '罗马书第8章查经心得',
    body: '“谁能使我们与基督的爱隔绝呢？”这节经文深深安慰了我，让我在试炼中仍有平安……',
    nickname: '张弟兄',
    category: '查经讨论',
    createdAt: '2025-11-21T14:30:00Z'
  },
  {
    id: '3',
    title: '下周六有福音茶会',
    body: '时间：周六下午3点；地点：教会二楼；欢迎带慕道友参加！',
    nickname: '李牧师',
    category: '活动通知',
    createdAt: '2025-11-22T09:15:00Z'
  }
];

// 从 body 中提取 nickname 和 category
function parseBody(body: string): { nickname: string; category: string; cleanBody: string } {
  const nicknameMatch = body.match(/<!--\s*nickname:\s*([^>]+)\s*-->/i);
  const categoryMatch = body.match(/<!--\s*category:\s*([^>]+)\s*-->/i);

  const nickname = nicknameMatch ? nicknameMatch[1].trim() : '匿名';
  const category = categoryMatch ? categoryMatch[1].trim() : '其他';

  // 移除注释行，保留纯净正文
  const cleanBody = body
    .replace(/<!--\s*nickname:[^>]+-->\s*/gi, '')
    .replace(/<!--\s*category:[^>]+-->\s*/gi, '')
    .trim();

  return { nickname, category, cleanBody };
}

// 主函数：获取帖子列表
export async function getThreads(): Promise<Thread[]> {
  const repo = import.meta.env.VITE_GITHUB_REPO; // e.g., "yourname/your-repo"

  if (!repo) {
    console.warn('VITE_GITHUB_REPO not set, using demo data');
    return DEMO_THREADS;
  }

  try {
    // 使用 GitHub REST API（简单可靠，无需 GraphQL 复杂查询）
    const res = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&labels=&per_page=30`);
    const issues = await res.json();

    if (!Array.isArray(issues)) throw new Error('Invalid response');

    return issues.map((issue: any) => {
      const { nickname, category, cleanBody } = parseBody(issue.body || '');
      return {
        id: issue.id.toString(),
        title: issue.title || '无标题',
        body: cleanBody,
        nickname,
        category,
        createdAt: issue.created_at
      };
    });
  } catch (err) {
    console.error('Failed to fetch issues, falling back to demo', err);
    return DEMO_THREADS;
  }
}
