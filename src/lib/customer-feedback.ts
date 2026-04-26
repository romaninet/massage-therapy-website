export type CustomerFeedback = {
  id: string;
  quote: { en: string; fr: string };
  author: string;
  rating: 5;
};

export const CUSTOMER_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'review-1',
    author: 'Rom',
    rating: 5,
    quote: {
      en: "I recently consulted Olha Shelest because office work and prolonged sitting had caused me significant back pain. After just two sessions, I already felt much better, and after the fourth, the pain was completely gone. Olha is extremely skilled and truly helped me find lasting relief. Thank you so much for your outstanding work; you really saved my life! I highly recommend her services to anyone suffering from similar problems",
      fr: "J'ai récemment consulté Olha Shelest car le travail de bureau et la position assise prolongée m'avaient causé d'importantes douleurs au dos. Après seulement deux séances, je me sentais déjà beaucoup mieux, et après la quatrième, la douleur avait complètement disparu. Olha est extrêmement compétente et m'a vraiment aidé à trouver un soulagement durable. Merci infiniment pour votre travail exceptionnel ; vous m'avez vraiment sauvé la vie ! Je recommande vivement ses services à tous ceux qui souffrent de problèmes similaires.",
    },
  },
  {
    id: 'review-2',
    author: 'Yevheniia',
    rating: 5,
    quote: {
      en: "From the moment I walked in she made me feel at ease. She knew exactly where to focus and I left feeling so much better. I will definitely be back.",
      fr: "Dès mon arrivée, elle m'a mise à l'aise. Elle a su exactement où concentrer son attention et je suis repartie beaucoup mieux. Je reviendrai sans hésiter.",
    },
  },
  {
    id: 'review-3',
    author: 'Irina',
    rating: 5,
    quote: {
      en: "Used Olha's service last week. She was amazing and made me feel comfortable right away. She really knew how to target the tension and I left feeling so much better. I will definitely be going back.",
      fr: "J'ai fait appel aux services d'Olha la semaine dernière. Elle a été formidable et m'a tout de suite mise à l'aise. Elle a su cibler les tensions et je suis repartie en me sentant beaucoup mieux. J'y retournerai sans hésiter.",
    },
  },
  {
    id: 'review-4',
    author: 'Alex',
    rating: 5,
    quote: {
      en: "I had a very positive experience with Olha. She helped me a lot with my back — the pain has noticeably improved after our sessions. She is attentive, professional, and takes the time to understand what’s really going on. I felt comfortable throughout the process and would definitely recommend her.",
      fr: "Mon expérience avec Olha a été très positive. Elle m'a beaucoup aidée pour mon dos : la douleur s'est nettement atténuée après nos séances. Elle est attentive, professionnelle et prend le temps de comprendre le problème. Je me suis sentie à l'aise tout au long du processus et je la recommande sans hésiter.",
    },
  },
  {
    id: 'review-5',
    author: 'Alexey',
    rating: 5,
    quote: {
      en: "I had a back pain and a friend recommended Olha.  Good experience and most of all, my back feels much better",
      fr: "J'avais mal au dos et une amie m'a recommandé Olha. Bonne expérience et surtout, mon dos va beaucoup mieux.",
    },
  },
  {
    id: 'review-6',
    author: 'Kodi',
    rating: 5,
    quote: {
      en: "I injured my back a year ago. I tried several massage therapists, but the only one who really helped me was Olha. I'm so glad I found her.",
      fr: "Je me suis blessé au dos il y a un an. J'ai essayé plusieurs massothérapeutes, mais la seule qui m'a vraiment aidée, c'est Olha. Je suis tellement contente de l'avoir trouvée.",
    },
  },
  {
    id: 'review-7',
    author: 'Nadiia',
    rating: 5,
    quote: {
      en: "I sincerely thank Olha for her excellent work! The massage was simply perfect. Olya is very attentive; she feels every area that needs attention and works with great care. After the session, I feel incredibly light, energized, and deeply relaxed. I highly recommend her as an excellent professional and a very pleasant person. I will definitely be back!",
      fr: "Une expérience formidable! Je tiens à remercier sincèrement Olha pour son excellent travail ! Le massage était tout simplement parfait. Olya est très attentive, elle ressent chaque zone qui a besoin d'attention et travaille avec beaucoup de délicatesse. Après la séance, je ressens une grande légèreté, un regain d'énergie et une relaxation profonde. Je la recommande vivement comme une excellente professionnelle et une personne très agréable. Je reviendrai certainement !",
    },
  }
];
