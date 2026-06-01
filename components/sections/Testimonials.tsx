'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import ScrollReveal from '@/components/animations/ScrollReveal';
import type { Testimonial } from '@/types';

const testimonials: Testimonial[] = [
  { id: '1', quote: "Silas did an OUTSTANDING job with the character modeling — his professionalism and attention to detail truly stood out. Working with him was a breeze thanks to his deep understanding, proactive communication, and seamless cooperation. Highly recommend!", name: 'rawnugget', company: 'Character Modeling · Switzerland', platform: 'Fiverr', rating: 5 },
  { id: '2', quote: "Silas met and exceeded all expectations. His communication and patience was well and he actively followed up to clarify and make changes. It was a complex project that he handled with great diligence. I would highly recommend Silas as he delivers great value at a very reasonable price point.", name: 'aameko', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '3', quote: "Silas is a very patient person — he did an amazing job, well beyond what I expected. He changed the design twice and even made a video to describe how to work with the file and measurements. If you have an idea and need to see it work, this is the guy, no doubts!", name: 'omriliberman', company: '3D Product Animation · Israel', platform: 'Fiverr', rating: 5 },
  { id: '4', quote: "Silas was genuinely great to work with. My project required significant back and forth to achieve the correct design. Silas was very responsive and was able to complete the task in the time allocated.", name: 'brian_corry', company: '3D Product Animation · United Kingdom', platform: 'Fiverr', rating: 5 },
  { id: '5', quote: "Great work from Silas, I was very happy with his quality of work and will be definitely using his services again for our next project.", name: 'alex_baxterr', company: '3D Product Animation · United Kingdom', platform: 'Fiverr', rating: 5 },
  { id: '6', quote: "I had an exceptional experience working with Silas! He delivered a highly detailed and professional model that exceeded my expectations. Communication was smooth, and he was very responsive to my feedback, making revisions promptly and ensuring I was 100% satisfied.", name: 'shimmagsix', company: '3D Product Animation · Nigeria', platform: 'Fiverr', rating: 5 },
  { id: '7', quote: "Silas was amazing to work with. He was attentive to my needs for the project and I was very pleased with how I was able to convey my ideas without any uncertainties. I look forward to working with Silas on future products!", name: 'briannaewright', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 4.7 },
  { id: '8', quote: "Silas delivered this project in less than one day. I am a social media content creator and needed a unique analysis done quickly, and he delivered. He responded quickly and I am so grateful I was able to complete my project in time because of him.", name: 'cartergottlieb', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5 },
  { id: '9', quote: "Exceptional! Great working on modelling project with Silas. He is very understanding, hard working and skilled! I will continue working with Silas.", name: 'sweisssss', company: 'Character Modeling · Canada', platform: 'Fiverr', rating: 5 },
  { id: '10', quote: "Silas was exceptionally great with his communication and dedication to accuracy. He was very considerate of my unique request and made quick work of completing it.", name: 'rufdog2', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5 },
  { id: '11', quote: "Exceptional work, work ethic and communication skills. I recommend him highly.", name: 'mikeabb23', company: '3D Product Animation · Canada', platform: 'Fiverr', rating: 5 },
  { id: '12', quote: "so kind and talented. he is a very understanding and nice person. i am lucky to work with him.", name: 'bysnowly', company: 'Character Modeling · Turkey', platform: 'Fiverr', rating: 5 },
  { id: '13', quote: "we look forward to working with Silas again.", name: 'team4000', company: 'Character Modeling · Germany', platform: 'Fiverr', rating: 5 },
  { id: '14', quote: "Very professional. Will work with again.", name: 'sha721', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 4 },
  { id: '15', quote: "it was excellent experience to work with Silas. great job brother.", name: 'overhaul96', company: '3D Product Animation · Saudi Arabia', platform: 'Fiverr', rating: 5 },
  { id: '16', quote: "excellent work", name: 'mediaonline2', company: '3D Product Animation · Oman', platform: 'Fiverr', rating: 5 },
  { id: '17', quote: "He brought my thoughts into reality", name: 'alnorligons85', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '18', quote: "Very good work", name: 'ino_usa', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '19', quote: "Super fast and efficient. Definitely will keep working with him.", name: 'coaching4u', company: 'Packaging Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '20', quote: "Great communication and went above and beyond", name: 'automaticj5', company: 'Website Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '21', quote: "Silas is an excellent communicator! He gets straight to the business of getting the work done with accuracy and speed. I already have my next project lined up for him. Thanks again Silas!!", name: 'n1sweetg', company: 'Website Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '22', quote: "Very detailed and patient with changes.", name: 'carpe01', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5 },
  { id: '23', quote: "will use again", name: 'gregkaz139', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5 },
  { id: '24', quote: "Great work! A work well done. Seller is patient and communicates well. Also gives 100% quality. I will definitely give seller more jobs.", name: 'senaahlee', company: '3D Product Animation · Nigeria', platform: 'Fiverr', rating: 5 },
  { id: '25', quote: "Great work as usual — seller is patient and communicates well.", name: 'ggoddess', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '26', quote: "Silasshaibu is very professional and responsive. His work is mastered and very satisfying. I will call on him for another project.", name: 'labber', company: 'Packaging Design · Morocco', platform: 'Fiverr', rating: 5 },
  { id: '27', quote: "he always do perfect job", name: 'deep4800', company: 'Website Design · India', platform: 'Fiverr', rating: 5 },
  { id: '28', quote: "Very talented artist!", name: 'iketh_kd', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '29', quote: "Worked fast and did exactly what I needed", name: 'itsmsytic', company: '3D Product Animation · United States', platform: 'Fiverr', rating: 5 },
  { id: '30', quote: "It did take some time but no complaints — at the end it was all good. Thank you Silas.", name: 'uparhi', company: 'Website Design · Australia', platform: 'Fiverr', rating: 5 },
  { id: '31', quote: "Very clear and well produced. Very happy and will continue to use.", name: 'chrispalmer715', company: 'Website Design · United Kingdom', platform: 'Fiverr', rating: 5 },
  { id: '32', quote: "I am not a technical person. Silas is so patient and helpful. He really does amazing work and makes the whole process so easy! I highly recommend him to anyone who wants top quality work with fast delivery.", name: 'bruceterrill', company: 'Website Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '33', quote: "Silas did a superb job! Fast, efficient, very responsive, skilled, and a great communicator. I am very pleased with his work and I intend to use him on my next project! I highly recommend Silas!", name: 'johnnypdx2020', company: 'Website Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '34', quote: "creative and very hard working.", name: 'yashjhaveri270', company: 'Packaging Design · India', platform: 'Fiverr', rating: 5 },
  { id: '35', quote: "Surprised to find someone with his level of skill on Fiverr. Lovely experience!", name: 'mranthonyhahn', company: 'Packaging Design · United States', platform: 'Fiverr', rating: 5 },
  { id: '36', quote: "Amazing artwork! He really made my vision come alive. Thank you so much! Would definitely use again.", name: 'fairladyz08', company: 'Character Modeling · United States', platform: 'Fiverr', rating: 5 },
  { id: '37', quote: "très bon taff ! merci", name: 'paulgardette201', company: 'Character Modeling · France', platform: 'Fiverr', rating: 5 },
];

const PER_PAGE = 3;

const platformColors: Record<string, string> = {
  Fiverr: 'bg-[rgba(29,191,115,0.1)] text-[#1dbf73]',
  LinkedIn: 'bg-[rgba(10,102,194,0.1)] text-[#0a66c2]',
  Direct: 'bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)]',
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.round(rating) ? 'fill-[var(--accent-primary)] text-[var(--accent-primary)]' : 'text-[var(--text-muted)]'}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const [list, setList] = useState<Testimonial[]>(testimonials);

  useEffect(() => {
    fetch('/api/admin/testimonials')
      .then(r => r.ok ? r.json() : null)
      .then((rows: Array<{ id: number; quote: string; name: string; company: string; platform: string; rating: number }> | null) => {
        if (rows && rows.length > 0) {
          setList(rows.map(r => ({
            id: String(r.id),
            quote: r.quote,
            name: r.name,
            company: r.company,
            platform: r.platform as Testimonial['platform'],
            rating: r.rating,
          })));
        }
      })
      .catch(() => { /* keep hardcoded fallback */ });
  }, []);

  const totalPages = Math.ceil(list.length / PER_PAGE);
  const visible = list.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="section-padding bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6">
        <ScrollReveal className="text-center mb-14">
          <SectionLabel text="Social Proof" />
          <h2 className="font-grotesk font-bold text-[clamp(1.8rem,4vw,3rem)] text-[var(--text-primary)]">
            Trusted by Clients Globally
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-2">{list.length} verified Fiverr reviews</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visible.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <div className="glass-card rounded-xl p-6 h-full flex flex-col">
                <StarRating rating={t.rating} />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{t.company}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-mono ${platformColors[t.platform]}`}>
                    {t.platform}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-full glass-card disabled:opacity-30 hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPage(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === page ? 'bg-[var(--accent-primary)] w-4' : 'bg-[var(--text-muted)]'}`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-2 rounded-full glass-card disabled:opacity-30 hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
              {['50+ Projects', '5-Star Reviews', 'Fiverr Level Seller', 'Featured on Client YouTube Channels'].map(
                (metric) => (
                  <span key={metric} className="text-sm font-mono text-[var(--accent-primary)]">
                    · {metric}
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Selected works featured on client YouTube channels and internal marketing materials.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
