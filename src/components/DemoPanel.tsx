import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { FILES_BY_ID } from '../data/files';
import * as cloud from '../services/cloud';
import { usePhone } from '../lib/usePhone';
import { resetSettings } from '../lib/settings';
import { Sheet } from './Sheet';
import { SecondaryButton, TextButton } from './ui';

/** Presenter tools, hidden behind the small "Demo" link on Home. */
export function DemoPanel({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  usePhone(); // keep the table live
  const [showCloud, setShowCloud] = useState(false);
  const entries = cloud.getCloudContents().sort((a, b) => b.uploadedAt - a.uploadedAt);

  return (
    <Sheet labelledBy="demo-title" onClose={onClose}>
      <h2 id="demo-title" className="text-[24px] font-bold">
        Presenter tools
      </h2>
      <p className="mt-1 text-[16px] text-ink-2">Not part of Robert's app.</p>

      <div className="mt-4 flex flex-col gap-3">
        <SecondaryButton
          tone="red"
          onClick={() => {
            cloud.resetDemo();
            resetSettings(); // light theme, power saving off
            onReset();
          }}
        >
          Reset demo
        </SecondaryButton>
        <a
          href="#/cloud"
          target="_blank"
          rel="noopener"
          className="flex min-h-[60px] w-full items-center justify-center gap-3 rounded-[20px] bg-primary px-5 text-[20px] font-bold text-white hover:bg-primary-hover"
        >
          <ExternalLink size={22} strokeWidth={2.4} aria-hidden />
          Open cloud in new tab
        </a>
        <SecondaryButton tone="blue" onClick={() => setShowCloud((s) => !s)} aria-expanded={showCloud}>
          {showCloud ? 'Hide cloud contents' : 'Show cloud contents'}
        </SecondaryButton>
      </div>

      {showCloud && (
        <div className="mt-4">
          <p className="text-[15px] text-ink-2">
            <code className="font-mono">{cloud.CLOUD_KEY}</code> holds {entries.length} files (newest first)
          </p>
          <div className="mt-2 max-h-[300px] overflow-auto rounded-xl border border-line">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-card-2">
                <tr>
                  <th className="px-2 py-1.5">id</th>
                  <th className="px-2 py-1.5">File</th>
                  <th className="px-2 py-1.5">uploadedAt</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-line">
                    <td className="px-2 py-1 font-mono">{e.id}</td>
                    <td className="max-w-[150px] truncate px-2 py-1">{FILES_BY_ID.get(e.id)?.name}</td>
                    <td className="px-2 py-1 whitespace-nowrap">{new Date(e.uploadedAt).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TextButton className="mt-3" onClick={onClose}>
        Close
      </TextButton>
    </Sheet>
  );
}
