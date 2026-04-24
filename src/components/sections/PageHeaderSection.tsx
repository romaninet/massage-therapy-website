import { BotanicalCornerTL, BotanicalCornerBR } from '@/components/BotanicalDecor';

interface Props {
  preTitle: string;
  title: string;
  subtitle?: string;
  pb?: string;
}

export default function PageHeaderSection({ preTitle, title, subtitle, pb = 'pb-20' }: Props) {
  return (
    <section className={`bg-forest pt-36 ${pb} relative overflow-hidden`}>
      <BotanicalCornerTL className="absolute top-0 left-0 w-48 h-48 text-white/10 pointer-events-none" />
      <BotanicalCornerBR className="absolute bottom-0 right-0 w-48 h-48 text-white/10 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center relative z-10">
        <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-5">{preTitle}</p>
        <h1 className="font-heading text-5xl lg:text-6xl text-white font-semibold mb-4">{title}</h1>
        {subtitle && <p className="text-white/60 text-lg max-w-xl mx-auto">{subtitle}</p>}
      </div>
    </section>
  );
}
