import { BotanicalDivider } from '@/components/BotanicalDecor';

type FAQItem = { question: string; answer: string };

type Props = {
  preTitle: string;
  title: string;
  items: FAQItem[];
};

export default function FAQSection({ preTitle, title, items }: Props) {
  return (
    <section className="bg-off-white py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-sage font-medium tracking-[0.25em] uppercase text-xs mb-3">
            {preTitle}
          </p>
          <h2 className="font-heading text-3xl lg:text-4xl text-forest font-semibold mb-4">
            {title}
          </h2>
          <BotanicalDivider className="w-48 lg:w-64 mx-auto text-sage/40" />
        </div>

        <dl className="divide-y divide-sage/20">
          {items.map((item) => (
            <details key={item.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-forest font-medium leading-snug [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 shrink-0 text-sage transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <dd className="pb-4 pt-1 text-forest/65 text-sm leading-relaxed">
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
