export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = Record<string, string>;

export const dictionaries: Record<Locale, Dictionary> = {
  "zh-CN": {
    "meta.title": "Eat Health | 饮食与症状记录",
    "meta.description": "移动优先的个人饮食与症状记录工具。",
    "app.subtitle": "饮食记录", "app.profile": "我的",
    "nav.logs": "记录", "nav.foods": "食物", "nav.profile": "我的", "language.label": "语言", "language.zh": "中文", "language.en": "English",
    "common.save": "保存", "common.saving": "保存中...", "common.back": "返回", "common.edit": "编辑", "common.notFilled": "未填写",
    "log.saved": "记录已保存", "log.saveInvalid": "保存失败，请确认至少填写一餐", "common.networkError": "请求失败，请检查网络后重试",
    "log.editTitle": "修改记录", "log.createTitle": "登记", "log.cancelEdit": "取消编辑", "log.date": "日期",
    "meal.breakfast": "早餐", "meal.lunch": "午餐", "meal.dinner": "晚餐", "meal.placeholder": "用逗号分隔食物",
    "symptoms.today": "当天症状", "symptoms.clear": "清空", "symptoms.notSelected": "未选择",
    "symptoms.setupHint": "先在“我的”页面设置最多 3 个常用症状。", "log.notesPlaceholder": "备注，可不填", "log.loginToCreate": "登录后登记",
    "logs.days": "记录天数", "logs.symptomEntries": "症状条目", "logs.history": "历史记录", "logs.viewAll": "查看全部",
    "logs.recentOnly": "当前页只显示最近 {count} 天，更多记录进入完整历史页查看。",
    "logs.empty": "暂无历史记录。保存后会按日期显示在这里。", "logs.loginHint": "登录后可以查看过去多天的个人饮食和症状记录。",
    "stats.title": "症状统计", "stats.summary": "{count} 次 / 最高 {max}", "stats.empty": "暂无症状统计。",
    "trend.title": "按日趋势", "trend.subtitle": "展示你在“我的”中设置的症状指标，最多显示最近 7 天",
    "trend.empty": "记录所选症状后会显示趋势。", "trend.aria": "{types}按日严重度趋势，范围 0 到 5", "trend.note": "纵轴为严重程度 0–5；未记录的日期不连线。",
    "analysis.title": "更多分析", "analysis.body": "后续可以在这里加入按食物和连续天数的筛选。当前先保证多天记录可浏览、可编辑。",
    "history.all": "全部历史记录", "history.description": "按日期倒序查看过往饮食和症状记录。编辑会回到登记页修改当天记录。",
    "history.summary": "共 {count} 天记录 · 第 {page} / {pages} 页 · 每页最多 {size} 条", "history.empty": "暂无历史记录。",
    "history.loginHint": "登录后可以查看完整历史记录。", "history.previous": "上一页", "history.next": "下一页",
    "account.current": "当前账号", "account.logout": "退出登录", "account.loggingOut": "退出中...", "account.logoutFailed": "退出失败，请重试",
    "account.logoutNetworkError": "退出失败，请检查网络后重试", "account.title": "登录后记录个人数据",
    "account.description": "使用邮箱和密码注册账号，保护个人记录。", "account.email": "邮箱", "account.password": "密码",
    "account.name": "昵称（注册时填写）", "account.login": "登录", "account.register": "注册", "account.loggingIn": "登录中...", "account.registering": "注册中...",
    "account.loggedIn": "已登录", "account.registered": "已注册并登录", "account.loginFailed": "登录失败，请检查邮箱和密码",
    "account.registerFailed": "注册失败：邮箱可能已注册，或密码不足 8 位",
    "preferences.title": "常用症状", "preferences.description": "最多设置 3 个，登记时用 0-5 滑块记录，步进 0.5。",
    "preferences.example1": "例如：腹泻", "preferences.example2": "例如：腹痛", "preferences.example3": "例如：胀气",
    "preferences.saved": "症状设置已保存", "preferences.failed": "保存失败", "preferences.login": "登录后设置", "preferences.save": "保存症状",
    "privacy.title": "隐私提示", "privacy.body": "MVP 不采集身份证、病历或诊断结论。请避免在备注中填写敏感医疗信息；如需导出或删除数据，可在后续版本加入账号数据管理。",
    "foods.title": "食物指标查询", "foods.description": "按 SIGHI 食物清单查看兼容性分值、组胺/生物胺/释放剂/DAO 抑制相关标记，并按分类浏览。",
    "foods.boundaryTitle": "健康边界", "foods.boundaryBody": "这里是自我记录和信息聚合工具，不提供诊断或治疗建议；具体饮食调整请结合个人反应和专业意见。",
    "foods.indicatorEyebrow": "指标说明", "foods.indicatorTitle": "如何理解分值和字母", "foods.indicatorBody": "根据 PDF 前言，“Histamine”列不是单纯表示食物组胺含量，而是组胺敏感人群的感知兼容性；结果还可能受新鲜度、其他生物胺、释放剂、DAO 抑制剂等影响。",
    "foods.scoreGuideTitle": "兼容性分值", "foods.score0": "通常耐受；按常规摄入量预计不会出现症状。", "foods.score1": "中等兼容；可能有轻微症状；少量、偶尔食用通常可耐受。", "foods.score2": "不兼容；按常规摄入量可能出现明显症状。", "foods.score3": "耐受性很差；可能出现严重症状。", "foods.scoreUnknown": "信息不足或相互矛盾；原文也使用 “-” 表示无法作出一般性判断。",
    "foods.mechanismGuideTitle": "机制字母", "foods.indicatorHStrong": "高度易腐败；组胺会快速形成。", "foods.indicatorH": "组胺含量高。", "foods.indicatorA": "其他生物胺。", "foods.indicatorL": "肥大细胞介质释放剂，也称组胺释放剂。", "foods.indicatorB": "二胺氧化酶（DAO）或其他组胺降解酶的阻断剂/抑制剂。",
    "foods.searchLabel": "查询食物", "foods.searchPlaceholder": "输入中文或英文食物名，例如 鸡蛋 / egg / tomato", "foods.searchButton": "查询",
    "foods.categoryLabel": "分类", "foods.allCategories": "全部分类", "foods.scoreLabel": "兼容性分值", "foods.allScores": "全",
    "foods.categoryOverviewHint": "默认从全部食物中查询；分类概况在二级页查看。", "foods.categoryOverviewLink": "分类概况",
    "foods.categoriesTitle": "按分类查看", "foods.categoryCount": "{count} 个分类", "foods.resultsEyebrow": "查询结果",
    "foods.categoriesDescription": "查看每个分类中的食物数量和分值分布，点开分类后回到查询页筛选该分类。", "foods.categoryOverviewTitle": "分类概况",
    "foods.resultsTitle": "食物指标", "foods.resultCount": "{count} 条", "foods.resultLimit": "当前仅显示前 {count} 条，请继续输入关键词缩小范围。",
    "foods.noResults": "没有匹配的食物。可以尝试英文名、中文名或换一个分类。", "foods.scoreShort": "{score}: {count}",
    "foods.validationTitle": "数据校验摘要", "foods.validationBody": "原始表格 {raw} 行，保留 {usable} 条可查询食物，跳过 {skipped} 条抽取残留或无效行，复核分类 {categories} 个。源 PDF 页脚更新时间为 {sourceUpdated}。"
  },
  en: {
    "meta.title": "Eat Health | Food & Symptom Log", "meta.description": "A mobile-first personal food and symptom tracking tool.",
    "app.subtitle": "Food Log", "app.profile": "Profile", "nav.logs": "Log", "nav.foods": "Foods", "nav.profile": "Profile", "language.label": "Language", "language.zh": "中文", "language.en": "English",
    "common.save": "Save", "common.saving": "Saving...", "common.back": "Back", "common.edit": "Edit", "common.notFilled": "Not entered",
    "log.saved": "Log saved", "log.saveInvalid": "Could not save. Please enter at least one meal.", "common.networkError": "Request failed. Check your connection and try again.",
    "log.editTitle": "Edit log", "log.createTitle": "New log", "log.cancelEdit": "Cancel", "log.date": "Date",
    "meal.breakfast": "Breakfast", "meal.lunch": "Lunch", "meal.dinner": "Dinner", "meal.placeholder": "Separate foods with commas",
    "symptoms.today": "Today's symptoms", "symptoms.clear": "Clear", "symptoms.notSelected": "Not selected",
    "symptoms.setupHint": "Set up to 3 common symptoms on the Profile page first.", "log.notesPlaceholder": "Notes (optional)", "log.loginToCreate": "Log in to add",
    "logs.days": "Days logged", "logs.symptomEntries": "Symptom entries", "logs.history": "History", "logs.viewAll": "View all",
    "logs.recentOnly": "Only the latest {count} days appear here. Open the full history to see more.",
    "logs.empty": "No history yet. Saved logs will appear here by date.", "logs.loginHint": "Log in to view your food and symptom history.",
    "stats.title": "Symptom summary", "stats.summary": "{count} entries / max {max}", "stats.empty": "No symptom data yet.",
    "trend.title": "Daily trends", "trend.subtitle": "Shows the symptoms selected in Profile for up to the last 7 days",
    "trend.empty": "Trends will appear after you record selected symptoms.", "trend.aria": "Daily severity trend for {types}, from 0 to 5", "trend.note": "The vertical axis is severity from 0–5; missing days are not connected.",
    "analysis.title": "More insights", "analysis.body": "Food and consecutive-day filters can be added here later. For now, the focus is browsing and editing daily logs.",
    "history.all": "All history", "history.description": "Review food and symptom logs in reverse chronological order. Editing returns you to the log page.",
    "history.summary": "{count} days · Page {page} of {pages} · Up to {size} per page", "history.empty": "No history yet.",
    "history.loginHint": "Log in to view your full history.", "history.previous": "Previous", "history.next": "Next",
    "account.current": "Current account", "account.logout": "Log out", "account.loggingOut": "Logging out...", "account.logoutFailed": "Could not log out. Try again.",
    "account.logoutNetworkError": "Could not log out. Check your connection and try again.", "account.title": "Log in to keep personal records",
    "account.description": "Register with email and password to protect your personal logs.", "account.email": "Email", "account.password": "Password",
    "account.name": "Display name (for registration)", "account.login": "Log in", "account.register": "Register", "account.loggingIn": "Logging in...", "account.registering": "Registering...",
    "account.loggedIn": "Logged in", "account.registered": "Registered and logged in", "account.loginFailed": "Login failed. Check your email and password.",
    "account.registerFailed": "Registration failed. The email may be registered or the password is under 8 characters.",
    "preferences.title": "Common symptoms", "preferences.description": "Set up to 3. Record each from 0–5 in steps of 0.5.",
    "preferences.example1": "e.g. Diarrhea", "preferences.example2": "e.g. Abdominal pain", "preferences.example3": "e.g. Bloating",
    "preferences.saved": "Symptom settings saved", "preferences.failed": "Could not save", "preferences.login": "Log in to set", "preferences.save": "Save symptoms",
    "privacy.title": "Privacy note", "privacy.body": "This MVP does not collect government IDs, medical records, or diagnoses. Avoid adding sensitive medical information to notes. Account data export and deletion can be added in a future version.",
    "foods.title": "Food indicator lookup", "foods.description": "Browse the SIGHI food list by compatibility score and histamine, biogenic amine, liberator, and DAO blocker indicators.",
    "foods.boundaryTitle": "Health boundary", "foods.boundaryBody": "This is a self-recording and information aggregation tool, not diagnosis or treatment advice. Use personal reactions and professional guidance for diet decisions.",
    "foods.indicatorEyebrow": "Indicator guide", "foods.indicatorTitle": "How to read scores and letters", "foods.indicatorBody": "According to the PDF front matter, the Histamine column is not simply a food's histamine content. It reflects perceived compatibility for histamine-sensitive people and may depend on freshness, other biogenic amines, liberators, DAO inhibitors, and related factors.",
    "foods.scoreGuideTitle": "Compatibility score", "foods.score0": "Well tolerated; no symptoms expected at usual intake.", "foods.score1": "Moderately compatible; minor symptoms possible; occasional small quantities are often tolerated.", "foods.score2": "Incompatible; significant symptoms may occur at usual intake.", "foods.score3": "Very poorly tolerated; severe symptoms may occur.", "foods.scoreUnknown": "Insufficient or contradictory information. The source also uses '-' when no general statement is possible.",
    "foods.mechanismGuideTitle": "Mechanism letters", "foods.indicatorHStrong": "Highly perishable; histamine forms rapidly.", "foods.indicatorH": "High histamine content.", "foods.indicatorA": "Other biogenic amines.", "foods.indicatorL": "Liberators of mast cell mediators, also called histamine liberators.", "foods.indicatorB": "Blockers or inhibitors of diamine oxidase (DAO) or other histamine-degrading enzymes.",
    "foods.searchLabel": "Search food", "foods.searchPlaceholder": "Search Chinese or English, e.g. egg, tomato, 鸡蛋", "foods.searchButton": "Search",
    "foods.categoryLabel": "Category", "foods.allCategories": "All categories", "foods.scoreLabel": "Compatibility score", "foods.allScores": "All",
    "foods.categoryOverviewHint": "Search defaults to all foods. Category summaries live on the secondary page.", "foods.categoryOverviewLink": "Categories",
    "foods.categoriesTitle": "Browse by category", "foods.categoryCount": "{count} categories", "foods.resultsEyebrow": "Results",
    "foods.categoriesDescription": "Review item counts and score distribution for each category. Open a category to filter the lookup page.", "foods.categoryOverviewTitle": "Category overview",
    "foods.resultsTitle": "Food indicators", "foods.resultCount": "{count} items", "foods.resultLimit": "Showing the first {count} items. Refine the search to narrow the list.",
    "foods.noResults": "No matching foods. Try an English name, Chinese name, or another category.", "foods.scoreShort": "{score}: {count}",
    "foods.validationTitle": "Data validation summary", "foods.validationBody": "{raw} raw table rows, {usable} usable food items, {skipped} extraction residue or invalid rows skipped, {categories} categories reviewed. The source PDF footer update date is {sourceUpdated}."
  }
};

export function normalizeLocale(value?: string | null): Locale { return value === "en" ? "en" : "zh-CN"; }
export function localeFromAcceptLanguage(value?: string | null): Locale {
  if (!value) return "zh-CN";

  const preferredLanguages = value
    .split(",")
    .map((item) => {
      const [language, ...parameters] = item.trim().split(";");
      const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return { language: language.toLowerCase(), quality: quality ? Number(quality.trim().slice(2)) : 1 };
    })
    .filter((item) => Number.isFinite(item.quality) && item.quality > 0)
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of preferredLanguages) {
    if (language === "zh" || language.startsWith("zh-")) return "zh-CN";
    if (language === "en" || language.startsWith("en-")) return "en";
  }

  return "zh-CN";
}
export function translate(dictionary: Dictionary, key: string, values: Record<string, string | number> = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), dictionary[key] ?? key);
}
