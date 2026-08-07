/**
 * Seed script to populate blog posts with sample data.
 *
 * Usage:
 *   npx tsx scripts/seed-blog.ts
 *
 * Requires a super admin account to exist (run seed-admin.ts first).
 * Creates sample blog posts in EN/FR/AR if they don't already exist.
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const AUTHOR_EMAIL = "iyad@nopeca.com";

const BLOG_POSTS = [
  {
    slug: "how-to-apply-uk-university-from-algeria",
    published: true,
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=630&fit=crop",

    titleEn: "How to Apply to a UK University from Algeria: A Complete Guide",
    excerptEn:
      "Everything you need to know about applying to top UK universities as an Algerian student — from choosing the right program to submitting your UCAS application.",
    contentEn: `Studying in the United Kingdom is a dream for many Algerian students, and with the right preparation, it's absolutely achievable. This guide walks you through every step of the application process.

Choosing the Right University and Program

Start by researching universities that offer programs aligned with your career goals. The UK has over 160 universities, each with unique strengths. Consider factors like ranking, location, campus life, and tuition fees. Popular choices among Algerian students include Oxford Brookes, Royal Holloway, and the University of Surrey.

Understanding UCAS

UCAS (Universities and Colleges Admissions Service) is the centralized application system for UK universities. You can apply to up to five courses through a single UCAS application. Key deadlines are typically in January for most courses, with October deadlines for Oxford and Cambridge.

Required Documents

You'll need your baccalaureate transcripts (translated and certified), a personal statement, a reference letter from a teacher, proof of English proficiency (IELTS or equivalent), and your passport. Make sure all documents are prepared well in advance.

English Language Requirements

Most UK universities require an IELTS score between 6.0 and 7.0. Start preparing early — consider taking preparation courses and practice tests. Some universities also accept TOEFL or Cambridge English qualifications.

Financial Planning

Tuition fees for international students range from £10,000 to £38,000 per year depending on the course and university. Factor in living costs of approximately £9,000 to £12,000 per year. Look into scholarships specifically available to Algerian and North African students.

How Nopeca Can Help

At Nopeca, we guide Algerian students through every step — from university selection to arrival support. Our team has been through the process ourselves and knows exactly what it takes to succeed.`,
    metaTitleEn: "How to Apply to UK Universities from Algeria | Complete Guide 2025",
    metaDescEn:
      "Step-by-step guide for Algerian students applying to UK universities. Learn about UCAS, documents, IELTS, fees, and how Nopeca can help you every step of the way.",
    keywordsEn:
      "apply UK university Algeria, UCAS application Algeria, study in UK from Algeria, UK university guide Algerian students, Nopeca study abroad",

    titleFr: "Comment postuler dans une université britannique depuis l'Algérie : Guide complet",
    excerptFr:
      "Tout ce que vous devez savoir pour postuler dans les meilleures universités britanniques en tant qu'étudiant algérien — du choix du programme à la soumission de votre candidature UCAS.",
    contentFr: `Étudier au Royaume-Uni est un rêve pour de nombreux étudiants algériens, et avec la bonne préparation, c'est tout à fait réalisable. Ce guide vous accompagne à chaque étape du processus de candidature.

Choisir la bonne université et le bon programme

Commencez par rechercher les universités qui proposent des programmes en adéquation avec vos objectifs de carrière. Le Royaume-Uni compte plus de 160 universités, chacune avec des points forts uniques. Tenez compte du classement, de l'emplacement, de la vie sur le campus et des frais de scolarité. Les choix populaires parmi les étudiants algériens incluent Oxford Brookes, Royal Holloway et l'Université de Surrey.

Comprendre UCAS

UCAS (Universities and Colleges Admissions Service) est le système centralisé de candidature pour les universités britanniques. Vous pouvez postuler à cinq formations maximum via une seule candidature UCAS. Les dates limites clés sont généralement en janvier pour la plupart des formations, avec des dates limites en octobre pour Oxford et Cambridge.

Documents requis

Vous aurez besoin de vos relevés de notes du baccalauréat (traduits et certifiés), d'une lettre de motivation, d'une lettre de recommandation d'un enseignant, d'une preuve de maîtrise de l'anglais (IELTS ou équivalent) et de votre passeport. Assurez-vous que tous les documents sont préparés bien à l'avance.

Exigences linguistiques

La plupart des universités britanniques exigent un score IELTS entre 6.0 et 7.0. Commencez à vous préparer tôt — envisagez des cours de préparation et des tests pratiques.

Planification financière

Les frais de scolarité pour les étudiants internationaux varient de 10 000 £ à 38 000 £ par an selon la formation et l'université. Prévoyez des frais de subsistance d'environ 9 000 £ à 12 000 £ par an. Renseignez-vous sur les bourses disponibles pour les étudiants algériens et nord-africains.

Comment Nopeca peut vous aider

Chez Nopeca, nous guidons les étudiants algériens à chaque étape — de la sélection de l'université à l'accompagnement à l'arrivée. Notre équipe est passée par le même processus et sait exactement ce qu'il faut pour réussir.`,
    metaTitleFr: "Comment postuler dans une université UK depuis l'Algérie | Guide complet",
    metaDescFr:
      "Guide étape par étape pour les étudiants algériens postulant dans les universités britanniques. UCAS, documents, IELTS, frais et accompagnement Nopeca.",
    keywordsFr:
      "postuler université UK Algérie, candidature UCAS Algérie, étudier au Royaume-Uni depuis Algérie, guide université UK étudiants algériens, Nopeca études à l'étranger",

    titleAr: "كيف تتقدم لجامعة بريطانية من الجزائر: دليل شامل",
    excerptAr:
      "كل ما تحتاج معرفته حول التقدم لأفضل الجامعات البريطانية كطالب جزائري — من اختيار البرنامج المناسب إلى تقديم طلب UCAS الخاص بك.",
    contentAr: `الدراسة في المملكة المتحدة حلم للعديد من الطلاب الجزائريين، ومع التحضير الصحيح، يمكن تحقيقه بالتأكيد. يرشدك هذا الدليل خلال كل خطوة من عملية التقديم.

اختيار الجامعة والبرنامج المناسب

ابدأ بالبحث عن الجامعات التي تقدم برامج تتوافق مع أهدافك المهنية. يضم المملكة المتحدة أكثر من 160 جامعة، لكل منها نقاط قوة فريدة. ضع في الاعتبار التصنيف والموقع والحياة الجامعية والرسوم الدراسية.

فهم نظام UCAS

UCAS هو نظام التقديم المركزي للجامعات البريطانية. يمكنك التقدم لما يصل إلى خمسة برامج من خلال طلب UCAS واحد. المواعيد النهائية الرئيسية عادة في يناير لمعظم البرامج.

المستندات المطلوبة

ستحتاج إلى كشوف درجات البكالوريا (مترجمة ومصدقة)، وخطاب شخصي، وخطاب توصية من معلم، وإثبات إتقان اللغة الإنجليزية (IELTS أو ما يعادله)، وجواز سفرك.

التخطيط المالي

تتراوح الرسوم الدراسية للطلاب الدوليين من 10,000 جنيه إسترليني إلى 38,000 جنيه إسترليني سنوياً حسب البرنامج والجامعة. خطط لتكاليف المعيشة التي تبلغ حوالي 9,000 إلى 12,000 جنيه إسترليني سنوياً.

كيف يمكن لـ Nopeca مساعدتك

في Nopeca، نرشد الطلاب الجزائريين في كل خطوة — من اختيار الجامعة إلى الدعم عند الوصول. فريقنا مر بنفس التجربة ويعرف بالضبط ما يتطلبه النجاح.`,
    metaTitleAr: "كيف تتقدم لجامعات بريطانيا من الجزائر | دليل شامل",
    metaDescAr:
      "دليل خطوة بخطوة للطلاب الجزائريين للتقدم للجامعات البريطانية. تعرف على UCAS والمستندات وIELTS والرسوم وكيف يمكن لـ Nopeca مساعدتك.",
    keywordsAr:
      "التقدم لجامعة بريطانية من الجزائر، طلب UCAS الجزائر، الدراسة في بريطانيا من الجزائر، دليل الجامعات البريطانية للطلاب الجزائريين",
  },
  {
    slug: "uk-student-visa-guide-algerian-students",
    published: true,
    coverImage: "https://images.unsplash.com/photo-1544411047-c491e34a24e0?w=1200&h=630&fit=crop",

    titleEn: "UK Student Visa Guide for Algerian Students",
    excerptEn:
      "A comprehensive guide to obtaining your UK Student Visa (Tier 4) as an Algerian student — documents, costs, timelines, and common mistakes to avoid.",
    contentEn: `Getting your UK Student Visa is one of the most important steps in your study abroad journey. Here's everything Algerian students need to know about the visa process.

Student Visa (formerly Tier 4)

The UK Student Visa allows you to study at an approved institution for courses lasting longer than six months. You'll need a Confirmation of Acceptance for Studies (CAS) from your university before applying.

Key Requirements

You need a valid CAS number from your university, proof of financial support (you must show you can cover tuition fees plus living costs for at least 9 months), a valid passport, tuberculosis test results (required for Algerian applicants), and IELTS/English proficiency scores.

Financial Requirements

You'll need to demonstrate you have enough funds to cover your first year of tuition plus £1,334 per month for living costs (up to 9 months). This means having the funds in your bank account for at least 28 consecutive days before applying.

Application Timeline

Apply no earlier than 6 months before your course starts. You should receive a decision within 3 weeks, but we recommend applying at least 2 months in advance to account for any delays.

Common Mistakes to Avoid

Don't submit incomplete financial documents. Make sure bank statements cover the full 28-day period. Ensure all translations are certified. Don't wait until the last minute — visa processing times can vary.

Interview Preparation

You may be called for a credibility interview. Be prepared to discuss why you chose your specific course and university, your future career plans, and how your studies relate to your goals.

After Your Visa is Approved

Once approved, you'll receive a vignette (sticker) in your passport valid for 90 days. Within 10 days of arriving in the UK, you'll need to collect your Biometric Residence Permit (BRP) from a designated post office.

Nopeca's Visa Support

We handle the entire visa process for our students — from document preparation to interview coaching. Our success rate speaks for itself.`,
    metaTitleEn: "UK Student Visa for Algerians | Complete Visa Guide 2025",
    metaDescEn:
      "Complete guide to UK Student Visa for Algerian students. Documents, financial requirements, timelines, interview tips, and expert support from Nopeca.",
    keywordsEn:
      "UK student visa Algeria, Tier 4 visa Algeria, UK visa Algerian students, student visa requirements Algeria, Nopeca visa support",

    titleFr: "Guide du visa étudiant UK pour les étudiants algériens",
    excerptFr:
      "Un guide complet pour obtenir votre visa étudiant britannique en tant qu'étudiant algérien — documents, coûts, délais et erreurs courantes à éviter.",
    contentFr: `L'obtention de votre visa étudiant britannique est l'une des étapes les plus importantes de votre parcours d'études à l'étranger. Voici tout ce que les étudiants algériens doivent savoir.

Visa étudiant (anciennement Tier 4)

Le visa étudiant UK vous permet d'étudier dans un établissement agréé pour des formations de plus de six mois. Vous aurez besoin d'une Confirmation d'Acceptation d'Études (CAS) de votre université avant de postuler.

Exigences clés

Vous avez besoin d'un numéro CAS valide, d'une preuve de soutien financier, d'un passeport valide, des résultats du test de tuberculose (obligatoire pour les candidats algériens) et des scores IELTS.

Exigences financières

Vous devez démontrer que vous disposez de fonds suffisants pour couvrir votre première année de frais de scolarité plus 1 334 £ par mois pour les frais de subsistance (jusqu'à 9 mois). Les fonds doivent être sur votre compte bancaire pendant au moins 28 jours consécutifs.

Calendrier de candidature

Postulez au plus tôt 6 mois avant le début de votre formation. La décision est généralement rendue sous 3 semaines, mais nous recommandons de postuler au moins 2 mois à l'avance.

Erreurs courantes à éviter

Ne soumettez pas de documents financiers incomplets. Assurez-vous que les relevés bancaires couvrent la période complète de 28 jours. Vérifiez que toutes les traductions sont certifiées.

L'accompagnement visa de Nopeca

Nous gérons l'intégralité du processus de visa pour nos étudiants — de la préparation des documents au coaching d'entretien.`,
    metaTitleFr: "Visa étudiant UK pour les Algériens | Guide visa complet",
    metaDescFr:
      "Guide complet du visa étudiant UK pour les étudiants algériens. Documents, exigences financières, délais, conseils d'entretien et accompagnement Nopeca.",
    keywordsFr:
      "visa étudiant UK Algérie, visa Tier 4 Algérie, visa UK étudiants algériens, exigences visa étudiant Algérie, Nopeca accompagnement visa",

    titleAr: "دليل تأشيرة الطالب البريطانية للطلاب الجزائريين",
    excerptAr:
      "دليل شامل للحصول على تأشيرة الطالب البريطانية كطالب جزائري — المستندات والتكاليف والجداول الزمنية والأخطاء الشائعة التي يجب تجنبها.",
    contentAr: `الحصول على تأشيرة الطالب البريطانية هو أحد أهم الخطوات في رحلة الدراسة في الخارج. إليك كل ما يحتاج الطلاب الجزائريون معرفته.

تأشيرة الطالب

تتيح لك تأشيرة الطالب البريطانية الدراسة في مؤسسة معتمدة لدورات تزيد مدتها عن ستة أشهر. ستحتاج إلى تأكيد القبول للدراسة (CAS) من جامعتك قبل التقديم.

المتطلبات الأساسية

تحتاج إلى رقم CAS صالح، وإثبات الدعم المالي، وجواز سفر صالح، ونتائج اختبار السل (مطلوب للمتقدمين الجزائريين)، ودرجات IELTS.

المتطلبات المالية

يجب أن تثبت أن لديك أموالاً كافية لتغطية رسوم السنة الأولى بالإضافة إلى 1,334 جنيه إسترليني شهرياً لتكاليف المعيشة. يجب أن تكون الأموال في حسابك المصرفي لمدة 28 يوماً متتالياً على الأقل.

الجدول الزمني

قدم طلبك قبل 6 أشهر على الأبكر من بدء دورتك. عادة ما تصدر القرارات خلال 3 أسابيع، لكننا ننصح بالتقديم قبل شهرين على الأقل.

دعم Nopeca للتأشيرة

نتولى عملية التأشيرة بالكامل لطلابنا — من إعداد المستندات إلى التدريب على المقابلة.`,
    metaTitleAr: "تأشيرة الطالب البريطانية للجزائريين | دليل شامل",
    metaDescAr:
      "دليل شامل لتأشيرة الطالب البريطانية للطلاب الجزائريين. المستندات والمتطلبات المالية والجداول الزمنية ودعم Nopeca.",
    keywordsAr:
      "تأشيرة طالب بريطانيا الجزائر، فيزا الدراسة بريطانيا، تأشيرة UK للطلاب الجزائريين، متطلبات فيزا الطالب الجزائر",
  },
  {
    slug: "top-5-uk-universities-algerian-students",
    published: true,
    coverImage: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1200&h=630&fit=crop",

    titleEn: "Top 5 UK Universities for Algerian Students in 2025",
    excerptEn:
      "Discover the best UK universities for Algerian students — ranked by acceptance rates, international support, scholarships, and overall student experience.",
    contentEn: `Choosing the right university is crucial to your study abroad success. Here are our top 5 picks for Algerian students heading to the UK in 2025.

1. Oxford Brookes University

Oxford Brookes consistently ranks among the best modern universities in the UK. Located in the historic city of Oxford, it offers world-class facilities and a diverse international community. Their business, architecture, and hospitality programs are particularly strong. International tuition starts from £15,500 per year.

2. Royal Holloway, University of London

Part of the University of London, Royal Holloway is set in a stunning 135-acre campus in Surrey. Known for its strong arts, humanities, and science programs. The university has dedicated international student support and a vibrant community of students from over 140 countries.

3. University of Surrey

Located in Guildford, just 30 minutes from London, the University of Surrey is renowned for its employability rates and industry connections. Their engineering, business, and health sciences programs are highly ranked. They offer generous scholarships for international students.

4. University of Cambridge

For high-achieving students, Cambridge remains one of the world's most prestigious universities. While highly competitive, Algerian students with exceptional grades and strong applications have successfully gained admission. Nopeca has experience guiding students through the Cambridge application process.

5. University College London (UCL)

UCL is one of the top 10 universities globally, located in the heart of London. With over 100 departments and a truly international student body, UCL offers unparalleled academic opportunities. Their engineering, architecture, and social sciences programs are world-leading.

What to Consider When Choosing

Beyond rankings, consider the city and cost of living, available scholarships for Algerian students, support services for international students, alumni networks in Algeria, and course content alignment with your career goals.

Need Help Deciding?

Nopeca's team can help you find the perfect university match based on your academic profile, career goals, and budget. Contact us for a free consultation.`,
    metaTitleEn: "Top 5 UK Universities for Algerian Students 2025 | Nopeca Guide",
    metaDescEn:
      "Best UK universities for Algerian students in 2025. Oxford Brookes, Royal Holloway, Surrey, Cambridge, and UCL — rankings, fees, scholarships, and support.",
    keywordsEn:
      "best UK universities Algerian students, top universities UK Algeria, Oxford Brookes Algeria, Royal Holloway Algeria, study UK 2025",

    titleFr: "Top 5 des universités britanniques pour les étudiants algériens en 2025",
    excerptFr:
      "Découvrez les meilleures universités britanniques pour les étudiants algériens — classées par taux d'acceptation, soutien international, bourses et expérience étudiante.",
    contentFr: `Choisir la bonne université est crucial pour réussir vos études à l'étranger. Voici notre top 5 pour les étudiants algériens se rendant au Royaume-Uni en 2025.

1. Oxford Brookes University

Oxford Brookes se classe régulièrement parmi les meilleures universités modernes du Royaume-Uni. Située dans la ville historique d'Oxford, elle offre des installations de classe mondiale et une communauté internationale diversifiée. Les frais de scolarité internationaux commencent à 15 500 £ par an.

2. Royal Holloway, University of London

Faisant partie de l'Université de Londres, Royal Holloway est située sur un magnifique campus de 55 hectares dans le Surrey. Connue pour ses programmes solides en arts, sciences humaines et sciences.

3. University of Surrey

Située à Guildford, à seulement 30 minutes de Londres, l'Université de Surrey est réputée pour ses taux d'employabilité et ses connexions industrielles. Elle offre des bourses généreuses aux étudiants internationaux.

4. University of Cambridge

Pour les étudiants les plus performants, Cambridge reste l'une des universités les plus prestigieuses au monde. Bien que très compétitive, des étudiants algériens avec d'excellents résultats ont réussi à y être admis.

5. University College London (UCL)

UCL est l'une des 10 meilleures universités au monde, située au cœur de Londres. Avec plus de 100 départements, UCL offre des opportunités académiques sans pareilles.

Besoin d'aide pour choisir ?

L'équipe Nopeca peut vous aider à trouver l'université parfaite selon votre profil académique, vos objectifs de carrière et votre budget.`,
    metaTitleFr: "Top 5 universités UK pour étudiants algériens 2025 | Guide Nopeca",
    metaDescFr:
      "Meilleures universités britanniques pour les étudiants algériens en 2025. Oxford Brookes, Royal Holloway, Surrey, Cambridge et UCL — classements, frais et bourses.",
    keywordsFr:
      "meilleures universités UK étudiants algériens, top universités Royaume-Uni Algérie, Oxford Brookes Algérie, étudier UK 2025",

    titleAr: "أفضل 5 جامعات بريطانية للطلاب الجزائريين في 2025",
    excerptAr:
      "اكتشف أفضل الجامعات البريطانية للطلاب الجزائريين — مرتبة حسب معدلات القبول والدعم الدولي والمنح الدراسية وتجربة الطالب.",
    contentAr: `اختيار الجامعة المناسبة أمر حاسم لنجاح دراستك في الخارج. إليك أفضل 5 خيارات للطلاب الجزائريين المتوجهين إلى المملكة المتحدة في 2025.

1. جامعة أكسفورد بروكس

تصنف أكسفورد بروكس باستمرار بين أفضل الجامعات الحديثة في المملكة المتحدة. تقع في مدينة أكسفورد التاريخية وتوفر مرافق عالمية المستوى ومجتمعاً دولياً متنوعاً. تبدأ الرسوم الدراسية الدولية من 15,500 جنيه إسترليني سنوياً.

2. رويال هولواي، جامعة لندن

جزء من جامعة لندن، تقع رويال هولواي في حرم جامعي مذهل في ساري. معروفة ببرامجها القوية في الفنون والعلوم الإنسانية والعلوم.

3. جامعة ساري

تقع في غيلدفورد، على بعد 30 دقيقة فقط من لندن. تشتهر بمعدلات التوظيف وعلاقاتها الصناعية. تقدم منحاً دراسية سخية للطلاب الدوليين.

4. جامعة كامبريدج

للطلاب المتفوقين، تظل كامبريدج من أعرق الجامعات في العالم. رغم المنافسة الشديدة، نجح طلاب جزائريون بدرجات استثنائية في الحصول على القبول.

5. كلية لندن الجامعية (UCL)

UCL هي واحدة من أفضل 10 جامعات عالمياً، تقع في قلب لندن. مع أكثر من 100 قسم، تقدم UCL فرصاً أكاديمية لا مثيل لها.

تحتاج مساعدة في الاختيار؟

يمكن لفريق Nopeca مساعدتك في العثور على الجامعة المثالية بناءً على ملفك الأكاديمي وأهدافك المهنية وميزانيتك.`,
    metaTitleAr: "أفضل 5 جامعات بريطانية للطلاب الجزائريين 2025 | دليل Nopeca",
    metaDescAr:
      "أفضل الجامعات البريطانية للطلاب الجزائريين في 2025. أكسفورد بروكس، رويال هولواي، ساري، كامبريدج وUCL — التصنيفات والرسوم والمنح.",
    keywordsAr:
      "أفضل جامعات بريطانيا للطلاب الجزائريين، أفضل الجامعات البريطانية الجزائر، الدراسة في بريطانيا 2025",
  },
  {
    slug: "ielts-preparation-tips-algerian-students",
    published: true,
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",

    titleEn: "IELTS Preparation Tips for Algerian Students",
    excerptEn:
      "Practical strategies and tips to help Algerian students achieve their target IELTS score for UK university admission.",
    contentEn: `The IELTS exam is a key requirement for UK university admission. With focused preparation and the right strategies, Algerian students can achieve their target scores. Here are our proven tips.

Understanding the IELTS Format

IELTS consists of four sections: Listening (30 minutes), Reading (60 minutes), Writing (60 minutes), and Speaking (11-14 minutes). The Academic version is required for university admission. Each section is scored from 0-9, and most UK universities require an overall score of 6.0-7.0.

Listening Section Tips

Practice listening to different English accents — British, Australian, American. Use BBC podcasts and TED Talks for daily practice. Focus on predicting answers before you hear them. Take notes while listening and pay attention to signal words like "however," "on the other hand," and "in contrast."

Reading Section Tips

Practice reading academic texts from journals, newspapers, and textbooks. Skim the passage first for the main idea, then scan for specific details. Don't spend too much time on one question — mark it and move on. Time management is crucial in this section.

Writing Section Tips

For Task 1, practice describing graphs, charts, and diagrams. For Task 2, develop a clear argument structure: introduction, body paragraphs with examples, and conclusion. Use linking words and varied vocabulary. Aim for at least 250 words for Task 2 and 150 words for Task 1.

Speaking Section Tips

Practice speaking English daily — even talking to yourself helps. Record yourself and listen back. Expand your answers beyond simple yes/no. Use real examples from your life. Don't memorize scripts — examiners can tell.

Study Schedule

We recommend 2-3 months of dedicated preparation. Study at least 2 hours daily. Take a full practice test every week to track progress. Focus on your weakest sections but don't neglect the others.

Resources for Algerian Students

Cambridge IELTS practice books (available online), British Council free IELTS preparation courses, IELTS Liz and IELTS Simon websites for free tips, and local IELTS preparation centers in Algiers, Oran, and Constantine.

Nopeca IELTS Support

We provide IELTS guidance as part of our comprehensive study abroad package. Our team can recommend preparation resources and help you plan your study schedule.`,
    metaTitleEn: "IELTS Preparation Tips for Algerian Students | Score Higher",
    metaDescEn:
      "Expert IELTS preparation tips for Algerian students. Strategies for listening, reading, writing, and speaking sections. Achieve your target score for UK universities.",
    keywordsEn:
      "IELTS preparation Algeria, IELTS tips Algerian students, IELTS score UK university, IELTS study guide Algeria, how to pass IELTS Algeria",

    titleFr: "Conseils de préparation IELTS pour les étudiants algériens",
    excerptFr:
      "Stratégies pratiques et conseils pour aider les étudiants algériens à atteindre leur score IELTS cible pour l'admission dans les universités britanniques.",
    contentFr: `L'examen IELTS est une exigence clé pour l'admission dans les universités britanniques. Avec une préparation ciblée et les bonnes stratégies, les étudiants algériens peuvent atteindre leurs scores cibles.

Comprendre le format IELTS

L'IELTS comprend quatre sections : Compréhension orale (30 minutes), Compréhension écrite (60 minutes), Expression écrite (60 minutes) et Expression orale (11-14 minutes). La version Academic est requise pour l'admission universitaire. Chaque section est notée de 0 à 9, et la plupart des universités britanniques exigent un score global de 6.0-7.0.

Conseils pour la compréhension orale

Pratiquez l'écoute de différents accents anglais. Utilisez les podcasts BBC et les TED Talks pour la pratique quotidienne. Concentrez-vous sur la prédiction des réponses avant de les entendre.

Conseils pour la compréhension écrite

Pratiquez la lecture de textes académiques. Parcourez d'abord le passage pour l'idée principale, puis cherchez des détails spécifiques. La gestion du temps est cruciale dans cette section.

Conseils pour l'expression écrite

Pour la Tâche 1, pratiquez la description de graphiques et diagrammes. Pour la Tâche 2, développez une structure d'argumentation claire. Utilisez des mots de liaison et un vocabulaire varié.

Conseils pour l'expression orale

Pratiquez l'anglais quotidiennement. Enregistrez-vous et écoutez. Développez vos réponses au-delà du simple oui/non. Ne mémorisez pas de scripts.

Programme d'études

Nous recommandons 2-3 mois de préparation dédiée. Étudiez au moins 2 heures par jour. Passez un test complet chaque semaine.`,
    metaTitleFr: "Conseils préparation IELTS pour étudiants algériens | Obtenir un meilleur score",
    metaDescFr:
      "Conseils experts de préparation IELTS pour les étudiants algériens. Stratégies pour chaque section. Atteignez votre score cible pour les universités britanniques.",
    keywordsFr:
      "préparation IELTS Algérie, conseils IELTS étudiants algériens, score IELTS université UK, guide étude IELTS Algérie",

    titleAr: "نصائح التحضير لاختبار IELTS للطلاب الجزائريين",
    excerptAr:
      "استراتيجيات ونصائح عملية لمساعدة الطلاب الجزائريين على تحقيق درجة IELTS المستهدفة للقبول في الجامعات البريطانية.",
    contentAr: `اختبار IELTS هو متطلب أساسي للقبول في الجامعات البريطانية. مع التحضير المركز والاستراتيجيات الصحيحة، يمكن للطلاب الجزائريين تحقيق درجاتهم المستهدفة.

فهم شكل اختبار IELTS

يتكون IELTS من أربعة أقسام: الاستماع (30 دقيقة)، القراءة (60 دقيقة)، الكتابة (60 دقيقة)، والتحدث (11-14 دقيقة). النسخة الأكاديمية مطلوبة للقبول الجامعي. كل قسم يُقيّم من 0 إلى 9.

نصائح لقسم الاستماع

تدرب على الاستماع لمختلف اللهجات الإنجليزية. استخدم بودكاست BBC ومحادثات TED للممارسة اليومية. ركز على توقع الإجابات قبل سماعها.

نصائح لقسم القراءة

تدرب على قراءة النصوص الأكاديمية. اقرأ النص بسرعة أولاً للفكرة الرئيسية، ثم ابحث عن تفاصيل محددة. إدارة الوقت أمر حاسم.

نصائح لقسم الكتابة

للمهمة الأولى، تدرب على وصف الرسوم البيانية. للمهمة الثانية، طور هيكل حجة واضح. استخدم كلمات الربط ومفردات متنوعة.

نصائح لقسم التحدث

مارس التحدث بالإنجليزية يومياً. سجل نفسك واستمع. وسع إجاباتك بما يتجاوز نعم/لا البسيطة. لا تحفظ نصوصاً جاهزة.

جدول الدراسة

نوصي بـ 2-3 أشهر من التحضير المكثف. ادرس ساعتين على الأقل يومياً. قم بإجراء اختبار تدريبي كامل كل أسبوع.`,
    metaTitleAr: "نصائح التحضير لـ IELTS للطلاب الجزائريين | احصل على درجة أعلى",
    metaDescAr:
      "نصائح خبراء لتحضير IELTS للطلاب الجزائريين. استراتيجيات لكل قسم. حقق درجتك المستهدفة للجامعات البريطانية.",
    keywordsAr:
      "تحضير IELTS الجزائر، نصائح IELTS للطلاب الجزائريين، درجة IELTS جامعة بريطانيا، دليل دراسة IELTS الجزائر",
  },
  {
    slug: "cost-of-living-uk-algerian-students",
    published: true,
    coverImage: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1200&h=630&fit=crop",

    titleEn: "Cost of Living in the UK: What Algerian Students Should Expect",
    excerptEn:
      "A realistic breakdown of living costs in the UK for Algerian students — accommodation, food, transport, and budgeting tips to make your money go further.",
    contentEn: `Understanding the cost of living in the UK is essential for financial planning. Here's a realistic breakdown of what Algerian students should expect and how to budget wisely.

Accommodation

University halls of residence cost £4,000-£8,000 per year. Private rentals range from £400-£800 per month outside London, and £600-£1,500 in London. Sharing a house with other students is the most popular and affordable option.

Food and Groceries

Budget approximately £150-£250 per month for groceries. Cooking at home saves significantly compared to eating out. Supermarkets like Aldi, Lidl, and Tesco offer great value. Halal food is widely available in most UK cities.

Transport

Student travel cards offer significant discounts. A monthly bus pass costs £40-£70 in most cities. If you're in London, a Student Oyster card saves you 30% on travel. Many university towns are walkable or bike-friendly.

Mobile Phone and Internet

SIM-only plans start from £5-£15 per month. University campuses have free WiFi. Home internet costs £20-£35 per month (usually included in student accommodation).

Social Life and Entertainment

Budget £50-£100 per month for socializing. Student discounts are available almost everywhere — get an NUS/TOTUM card. Free museums, parks, and university events help keep costs down.

Monthly Budget Summary

A typical monthly budget outside London: Accommodation £400-£600, Food £150-£250, Transport £40-£70, Phone £10-£15, Social £50-£100, Miscellaneous £50-£100. Total: approximately £700-£1,135 per month.

In London, add roughly 30-50% more for accommodation and transport.

Money-Saving Tips

Open a UK student bank account for zero-fee banking. Shop at discount supermarkets. Use student discount apps like UNiDAYS and Student Beans. Buy second-hand textbooks. Cook meals in bulk for the week.

Currency and Transfers

Research the best ways to transfer money from Algeria. Consider services like Wise (TransferWise) for better exchange rates compared to traditional banks. Keep an eye on the DZD-GBP exchange rate.

Working While Studying

Student visa holders can work up to 20 hours per week during term time and full-time during holidays. This can significantly help cover living costs. Common student jobs include retail, hospitality, and campus roles.`,
    metaTitleEn: "Cost of Living in UK for Algerian Students | Budget Guide 2025",
    metaDescEn:
      "Complete cost of living guide for Algerian students in the UK. Accommodation, food, transport, and budgeting tips. Plan your finances with Nopeca.",
    keywordsEn:
      "cost of living UK Algerian students, UK student budget Algeria, accommodation costs UK, living expenses UK international students",

    titleFr: "Coût de la vie au Royaume-Uni : Ce que les étudiants algériens doivent savoir",
    excerptFr:
      "Un aperçu réaliste des coûts de la vie au Royaume-Uni pour les étudiants algériens — logement, nourriture, transport et conseils budgétaires.",
    contentFr: `Comprendre le coût de la vie au Royaume-Uni est essentiel pour la planification financière. Voici un aperçu réaliste de ce que les étudiants algériens doivent attendre.

Logement

Les résidences universitaires coûtent 4 000 £ à 8 000 £ par an. Les locations privées vont de 400 £ à 800 £ par mois en dehors de Londres. Partager une maison avec d'autres étudiants est l'option la plus populaire et abordable.

Alimentation

Prévoyez environ 150 £ à 250 £ par mois pour les courses. Cuisiner à la maison permet d'économiser considérablement. Les supermarchés comme Aldi, Lidl et Tesco offrent un excellent rapport qualité-prix. La nourriture halal est largement disponible.

Transport

Les cartes de transport étudiant offrent des réductions significatives. Un abonnement mensuel de bus coûte 40 £ à 70 £ dans la plupart des villes.

Résumé du budget mensuel

Un budget mensuel typique en dehors de Londres : Logement 400-600 £, Alimentation 150-250 £, Transport 40-70 £, Téléphone 10-15 £, Social 50-100 £. Total : environ 700-1 135 £ par mois.

Conseils pour économiser

Ouvrez un compte bancaire étudiant britannique. Faites vos courses dans les supermarchés discount. Utilisez les applications de réduction étudiante. Achetez des manuels d'occasion. Cuisinez en lots pour la semaine.

Travailler pendant les études

Les titulaires de visa étudiant peuvent travailler jusqu'à 20 heures par semaine pendant les cours et à temps plein pendant les vacances.`,
    metaTitleFr: "Coût de la vie au UK pour étudiants algériens | Guide budget 2025",
    metaDescFr:
      "Guide complet du coût de la vie pour les étudiants algériens au Royaume-Uni. Logement, alimentation, transport et conseils budgétaires.",
    keywordsFr:
      "coût de la vie UK étudiants algériens, budget étudiant UK Algérie, frais de logement UK, dépenses de vie UK étudiants internationaux",

    titleAr: "تكاليف المعيشة في بريطانيا: ما يجب أن يتوقعه الطلاب الجزائريون",
    excerptAr:
      "تفصيل واقعي لتكاليف المعيشة في بريطانيا للطلاب الجزائريين — السكن والطعام والمواصلات ونصائح الميزانية.",
    contentAr: `فهم تكاليف المعيشة في بريطانيا أمر ضروري للتخطيط المالي. إليك تفصيل واقعي لما يجب أن يتوقعه الطلاب الجزائريون.

السكن

تكلف السكنات الجامعية 4,000 إلى 8,000 جنيه إسترليني سنوياً. الإيجار الخاص يتراوح من 400 إلى 800 جنيه شهرياً خارج لندن. مشاركة المنزل مع طلاب آخرين هو الخيار الأكثر شعبية وبأسعار معقولة.

الطعام

خصص حوالي 150 إلى 250 جنيهاً شهرياً للبقالة. الطبخ في المنزل يوفر بشكل كبير. سلاسل مثل Aldi وLidl وTesco تقدم قيمة ممتازة. الطعام الحلال متوفر على نطاق واسع.

المواصلات

بطاقات السفر الطلابية تقدم خصومات كبيرة. اشتراك الباص الشهري يكلف 40 إلى 70 جنيهاً في معظم المدن.

ملخص الميزانية الشهرية

ميزانية شهرية نموذجية خارج لندن: سكن 400-600 جنيه، طعام 150-250 جنيه، مواصلات 40-70 جنيه، هاتف 10-15 جنيه، ترفيه 50-100 جنيه. المجموع: حوالي 700-1,135 جنيه شهرياً.

نصائح للتوفير

افتح حساباً مصرفياً طلابياً بريطانياً. تسوق من السوبرماركت المخفض. استخدم تطبيقات الخصم الطلابي. اشترِ الكتب المستعملة. اطبخ وجبات بكميات كبيرة للأسبوع.

العمل أثناء الدراسة

يمكن لحاملي تأشيرة الطالب العمل حتى 20 ساعة أسبوعياً خلال الفصل الدراسي وبدوام كامل خلال العطل.`,
    metaTitleAr: "تكاليف المعيشة في بريطانيا للطلاب الجزائريين | دليل الميزانية 2025",
    metaDescAr:
      "دليل شامل لتكاليف المعيشة للطلاب الجزائريين في بريطانيا. السكن والطعام والمواصلات ونصائح الميزانية.",
    keywordsAr:
      "تكاليف المعيشة بريطانيا طلاب جزائريين، ميزانية الطالب بريطانيا الجزائر، تكاليف السكن بريطانيا، مصاريف المعيشة بريطانيا",
  },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  // Find the author (super admin)
  const author = await prisma.admin.findUnique({
    where: { email: AUTHOR_EMAIL },
  });

  if (!author) {
    console.error(
      `Author not found: ${AUTHOR_EMAIL}. Run seed-admin.ts first.`
    );
    process.exit(1);
  }

  console.log(`Using author: ${author.name} (${author.email})\n`);

  for (const post of BLOG_POSTS) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });

    if (existing) {
      console.log(`  Skipped (exists): ${post.slug}`);
      continue;
    }

    await prisma.blogPost.create({
      data: {
        ...post,
        authorId: author.id,
      },
    });

    console.log(`  Created: ${post.slug}`);
  }

  console.log(`\nBlog seed complete. ${BLOG_POSTS.length} posts processed.`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
