"use client";

import { useState, useEffect } from "react";
import { Command, X, Copy, Check, Info } from "lucide-react";
import clsx from "clsx";
import { HKOLang } from "@/lib/hko-api";

interface ShortcutTutorialProps {
  locale: HKOLang;
}

export default function ShortcutTutorial({ locale }: ShortcutTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    setApiUrl(`https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=${locale}`);
  }, [locale]);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEn = locale === 'en';
  const isTc = locale === 'tc';

  const t = {
    title: isEn ? "iOS Shortcut Automation" : isTc ? "iOS 捷徑自動化" : "iOS 快捷指令自动化",
    desc: isEn ? "Set up a daily morning weather briefing on your iPhone." : isTc ? "在 iPhone 上設定每天早上的天氣簡報。" : "在 iPhone 上设置每天早上的天气简报。",
    step1Title: isEn ? "1. Copy API Link" : isTc ? "1. 複製 API 連結" : "1. 复制 API 链接",
    step1Desc: isEn ? "Copy the link below, which provides weather data." : isTc ? "複製下方連結，此連結提供天氣數據。" : "复制下方链接，此链接提供天气数据。",
    step2Title: isEn ? "2. Create the Shortcut" : isTc ? "2. 建立捷徑" : "2. 创建快捷指令",
    step2Desc: isEn ? "Open the Shortcuts app on your iPhone. Create a new shortcut with these actions:" : isTc ? "打開 iPhone 上的「捷徑」App。使用以下動作建立新捷徑：" : "打开 iPhone 上的“快捷指令”App。使用以下操作创建新快捷指令：",
    action1: isEn ? '"Get Contents of URL" (paste the link)' : isTc ? "「取得 URL 的內容」（貼上連結）" : "“获取 URL 内容”（粘贴链接）",
    action2: isEn ? '"Get Dictionary Value" (Key: temperature.data.1.value)' : isTc ? "「取得字典值」（鍵值：temperature.data.1.value）" : "“获取字典值”（键：temperature.data.1.value）",
    action3: isEn ? '"Show Result" or "Speak Text"' : isTc ? "「顯示結果」或「朗讀文字」" : "“显示结果”或“朗读文本”",
    step3Title: isEn ? "3. Set up Daily Automation" : isTc ? "3. 設定每日自動化" : "3. 设置每日自动化",
    step3Desc: isEn ? "In Shortcuts, go to Automation > New Automation. Choose 'Time of Day' (e.g., 6:00 AM). Select 'Run Immediately'. Then choose the shortcut you just created. You can edit this time later in the Automation tab." : isTc ? "在捷徑中，前往「自動化」>「新增自動化」。選擇「特定時間」（例如上午 6:00）。選擇「立即執行」。然後選擇您剛剛建立的捷徑。您稍後可以在自動化標籤頁中修改時間。" : "在快捷指令中，前往“自动化”>“新建自动化”。选择“特定时间”（例如上午 6:00）。选择“立即运行”。然后选择您刚刚创建的快捷指令。您稍后可以在自动化标签页中修改时间。",
    close: isEn ? "Close" : isTc ? "關閉" : "关闭"
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full transition-colors glass flex items-center justify-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
        aria-label="Shortcut Tutorial"
      >
        <Command size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
          <div className="bg-white/90 dark:bg-black/90 p-6 rounded-3xl max-w-md w-full shadow-2xl glass-darker overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Command size={24} /> {t.title}
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm opacity-80 mb-6">{t.desc}</p>

            <div className="space-y-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">{t.step1Title}</h3>
                <p className="opacity-80 mb-2">{t.step1Desc}</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    readOnly
                    value={apiUrl}
                    className="flex-1 bg-black/5 dark:bg-white/10 p-2 rounded-lg text-xs font-mono outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{t.step2Title}</h3>
                <p className="opacity-80 mb-2">{t.step2Desc}</p>
                <ul className="list-disc pl-5 opacity-80 space-y-1">
                  <li>{t.action1}</li>
                  <li>{t.action2}</li>
                  <li>{t.action3}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                   {t.step3Title}
                </h3>
                <p className="opacity-80 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                  {t.step3Desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
