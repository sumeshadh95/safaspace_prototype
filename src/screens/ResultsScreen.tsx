import { Check, CloudCheck, RotateCcw } from 'lucide-react';
import { CategoryCard } from '../components/CategoryCard';
import { CompactToggles } from '../components/QuickSettings';
import { StorageCard } from '../components/StorageCard';
import { CloudLink, SecondaryButton } from '../components/ui';
import { CATEGORIES } from '../data/files';
import { formatNumber, roomForPhotos } from '../lib/format';
import { usePhone } from '../lib/usePhone';

export function ResultsScreen({ onOpen, onBringBack }: { onOpen: (slug: string) => void; onBringBack: () => void }) {
  const phone = usePhone();
  const media = phone.categories.photo.saved + phone.categories.video.saved;
  const room = roomForPhotos(phone.removableMB);
  const all = media === phone.mediaInCloud;

  return (
    <div className="px-6 pt-[max(18px,env(safe-area-inset-top))] pb-10">
      <CompactToggles className="mb-4" />
      <div className="flex items-center gap-[14px]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-white shadow-[0_0_0_7px_var(--color-green-soft)]" aria-hidden>
          <Check size={28} strokeWidth={3.2} />
        </span>
        <h1 className="text-[32px] leading-tight font-bold tracking-[-0.01em]">Check complete</h1>
      </div>

      <section className="mt-7 rounded-[22px] bg-[linear-gradient(140deg,var(--color-green-soft)_0%,color-mix(in_oklab,var(--color-green-soft)_55%,var(--color-card))_100%)] px-5 py-5 ring-1 ring-green/15" aria-live="polite">
        <h2 className="flex items-start gap-2.5 text-[21px] leading-snug font-bold text-green">
          <CloudCheck size={24} strokeWidth={2.4} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            {formatNumber(phone.mediaInCloud)} {phone.mediaInCloud === 1 ? 'photo or video is' : 'photos and videos are'} safe in your cloud
          </span>
        </h2>
        <p className="mt-2 text-[19px] leading-[1.55] text-ink">
          {media === 0 ? (
            <>They are not taking up space on your phone. You can bring them back anytime.</>
          ) : (
            <>
              You can remove {all ? 'them' : `${formatNumber(media)} of them`} from your phone to make room for{' '}
              <strong className="font-bold text-green">{room >= 1 ? `about ${formatNumber(room)} new photos` : 'a few new photos'}</strong>.
            </>
          )}
        </p>
        <CloudLink className="mt-4 w-full" />
      </section>

      <p className="mt-6 text-[19px] text-ink-2">Tap a box to see your files</p>

      <div className="mt-4 flex flex-col gap-[14px]">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.type} type={c.type} title={c.title} stats={phone.categories[c.type]} onOpen={() => onOpen(c.slug)} />
        ))}
      </div>

      <SecondaryButton className="mt-6" icon={RotateCcw} onClick={onBringBack}>
        Bring back removed files
      </SecondaryButton>

      <div className="mt-6">
        <StorageCard usedMB={phone.usedMB} totalMB={phone.totalMB} />
      </div>
    </div>
  );
}
