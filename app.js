/* =========================================================
   RV Schools Chatbot — app.js
   Decision-tree & Natural Language Chatbot with verified school data
   Dual-Write Telemetry & Full Asset Resolution
   ========================================================= */

// ──────────────────────────────────────────────
//  ASSET HELPER FOR WORDPRESS / STANDALONE
// ──────────────────────────────────────────────
function getAssetUrl(name) {
  const settings = window.rvghsChatbotSettings;
  if (settings) {
    if (name === 'mascot_v2.png' && settings.mascotUrl) return settings.mascotUrl;
    if (name === 'mascot_thinking_v2.png' && settings.mascotThinking) return settings.mascotThinking;
    if (name === 'mascot_success_v2.png' && settings.mascotSuccess) return settings.mascotSuccess;
    if (name === 'Logo.png' && settings.logoUrl) return settings.logoUrl;
    if (settings.assetsUrl) return settings.assetsUrl + name;
  }
  return name;
}

// ──────────────────────────────────────────────
//  SCHOOL DATA (all verified from websites)
// ──────────────────────────────────────────────

const SCHOOLS = {
  rvs: {
    id: 'rvs',
    name: 'RV School',
    shortName: 'RVS',
    icon: '🏫',
    accentVar: '--rvs-accent',
    accent: '#2E86AB',
    accentGlow: 'rgba(46, 134, 171, 0.3)',
    gradient: 'linear-gradient(135deg, #2E86AB, #1a6d91)',
    board: 'Karnataka State Board',
    established: '2018',
    campus: '2 acres, Tata Silk Farm, Bengaluru',
    grades: 'Primary & Secondary (English Medium)',
    principal: 'Shakila R. (M.A., B.Ed.)',
    phone: '080-26768583',
    mobile: '+91-9036876175',
    email: 'principal.rvs@rvei.edu.in',
    address: '#16/17, 3rd Cross, Tata Silk Farm, Bengaluru - 560028',
    website: 'https://www.rvschool.edu.in',
    facebook: 'https://www.facebook.com/RVSchoolEdu/',
    instagram: 'https://www.instagram.com/rvschool_edu/',
    admissionLink: 'https://wds-prd.rvei.edu.in:4430/sap/bc/ui5_ui5/sap/zrvischoolform/index.html',
    transport: false,
    midDayMeal: false,
    facilities: ['Amphitheater', 'Elevators', 'Food Court', 'Splash Pool', 'Sandpit', 'Enormous Playground'],
    usps: ['Inclusive education for hearing-impaired children', 'Splash Pool', 'Part of RVEI (80+ year legacy)'],
    programs: ['Art', 'Craft', 'Music', 'Dance', 'Physical Education'],
    management: {
      president: 'Dr. M.P. Shyam',
      secretary: 'Dr.(h.c). A.V.S. Murthy',
    },
  },

  rvps: {
    id: 'rvps',
    name: 'RV Public School',
    shortName: 'RVPS',
    icon: '📚',
    accentVar: '--rvps-accent',
    accent: '#A23B72',
    accentGlow: 'rgba(162, 59, 114, 0.3)',
    gradient: 'linear-gradient(135deg, #A23B72, #8a2d5e)',
    board: 'ICSE (CISCE)',
    established: '2003',
    campus: '2 acres, Opposite Lalbagh West Gate, V V Puram',
    grades: 'Nursery to Standard 10',
    phone: '+91-080-69757300',
    altPhone: '+91-80-2656-9588',
    email: 'rvps@rvei.edu.in',
    address: 'RV Public School, Opposite Lalbagh West Gate, V V Puram, Bangalore - 560004',
    website: 'https://www.rvps.edu.in',
    facebook: 'https://facebook.com/rvps.co.in',
    instagram: 'https://instagram.com/rvps_official',
    admissionLink: 'https://wds-prd.rvei.edu.in:4430/sap/bc/ui5_ui5/sap/zrvischoolform/index.html#/scode/RVPS',
    transport: true,
    transportDetails: 'Safe bus services along select routes of South Bangalore',
    midDayMeal: false,
    stats: { students: '1000+', teachers: '60', alumni: '250+' },
    facilities: ['Physics/Chemistry/Biology Labs', 'Computer Lab (CS from Class 1)', 'Digitised Library', 'Vast Playground (Cricket, Basketball, Volleyball)', 'State-of-art Auditorium', 'Edu-Smart Classrooms'],
    sportsPartner: 'Leapstart',
    accreditation: 'British Council ISA (International School Award)',
    houses: ['Charaka', 'Aryabhatta', 'Bhaskara', 'Sushrutha'],
    ncc: true,
    virtualTour: 'https://goo.gl/gQqbhq',
    timings: {
      prePrimary: '8:20 AM – 12:15 PM (Mon–Fri)',
      primary: '8:20 AM – 3:15 PM (Mon–Fri)',
      feeOffice: '10:00 AM – 1:00 PM (Weekdays), 10:30 AM – 12:30 PM (Sat)',
      ptm: '3:20 PM – 3:45 PM daily',
      office: '8:45 AM – 4:30 PM (Mon–Fri), 10:30 AM – 1:00 PM (Sat)',
    },
    uniform: {
      regular: 'Dark Blue Pinafore/Shorts + Check Shirt + Black Ribbons (Girls)',
      wednesday: 'House-coloured T-shirt + Track Pants',
      shoes: 'Black shoes, Dark Blue socks (red border), Belt (Class 1–10)',
    },
    admissionCriteria: [
      { level: 'Nursery', age: '3 years by June 1' },
      { level: 'Std 1', age: '6 years by academic year start (completed pre-primary)' },
      { level: 'Std 2–7', age: 'Admission test required' },
      { level: 'Std 8', age: '13 years (completed Std 7, seat availability)' },
      { level: 'Std 9', age: 'Requires Council approval' },
    ],
    toppers: [
      { name: 'Anirudh S', pct: '97.2%' },
      { name: 'Pravardhinii S', pct: '96.4%' },
      { name: 'Bhargav A', pct: '95.7%' },
      { name: 'Shreevardhan B M', pct: '94.5%' },
      { name: 'Apraameya Narayanan', pct: '94.4%' },
    ],
    extracurricular: ['Music', 'Yoga', 'Dance', 'Cubs & Bulbuls', 'NCC', 'Karate', 'Taekwondo', 'Science Olympiad'],
    management: {
      president: 'Dr. M.P. Shyam',
      chairman: 'Naveen Pasuparthy',
    },
  },

  rvghs: {
    id: 'rvghs',
    name: 'RV Girls High School',
    shortName: 'RVGHS',
    icon: '👩‍🎓',
    accentVar: '--rvghs-accent',
    accent: '#6F62F0',
    accentGlow: 'rgba(111, 98, 240, 0.3)',
    gradient: 'linear-gradient(135deg, #6F62F0, #5a4ed4)',
    board: 'Karnataka State Board',
    established: '1962',
    campus: 'Jayanagar, Bengaluru',
    grades: 'High School (Girls Only, Class 8–10)',
    headmaster: 'Mr. Devaru Bhat',
    students: '~400',
    phone: '9036876165',
    mobile: '+91-9036876165',
    email: 'rvghs@rvei.edu.in',
    address: 'RV Teachers College Building, 15, Ashoka Pillar Road, 2nd Block, Jayanagar, Bengaluru - 560011',
    website: 'https://rvghs.edu.in',
    admissionLink: 'https://rvghs.edu.in/admissions/',
    brochure: 'http://rvghs.edu.in/wp-content/uploads/2025/04/Brochure.pdf',
    alumniPortal: 'https://rvghs.almaconnect.com/',
    donateLink: 'https://www.rvinstitutions.com/donate/',
    transport: false,
    midDayMeal: true,
    midDayMealDetails: 'Nutritious meals provided daily by ISKCON Akshaya Patra Foundation (including milk/ragi malt). Daily Supplementary Nutritious Food (eggs, chikki, or bananas) provided by Azim Premji Foundation & Department of Education.',
    ncc: true,
    officeHours: 'Mon–Fri: 9:00 AM – 4:30 PM | Sat: 9:00 AM – 1:00 PM',
    facilities: ['Science Laboratory', 'Computer Lab (networked campus)', 'Library (with LCD projector)', 'Audio-Visual Room', 'Sports Room + Playground', 'AC Auditorium (500+ seats)', 'Canteen'],
    languageSections: {
      A: { first: 'Sanskrit', second: 'Kannada', third: 'English' },
      B: { first: 'English', second: 'Kannada', third: 'Sanskrit' },
      C: { first: 'Kannada', second: 'English', third: 'Hindi' },
    },
    coreSubjects: ['Mathematics', 'General Science', 'Social Science'],
    coCurricular: ['Physical Education', 'Craft & SUPW', 'Computer Education'],
    clubs: ['Student Union Club', 'Humanities Club', 'Electoral Literacy Club', 'Science Club', 'Sanskrit Club', 'Kannada Sangha', 'Health Club', 'Eco Club', 'NCC', 'Sports Club', 'Bugle Band Set', 'Girl Guide'],
    competitiveExams: 'NMMS, CHARD GK, Hindi/Sanskrit exams, Ramayana & Mahabharata student assessments and merit awards.',
    admissionDocs: [
      'Original SATS Transfer Certificate (with PEN number and AAPAR Id)',
      'One passport-size photograph of the student',
      'Photocopy of the student\'s Birth Certificate',
      'Photocopy of the previous class Marks Card',
      'Photocopy of the student\'s Bhagyalakshmi Bond',
      'DISE number from the previous school',
      'Photocopy of the student\'s Caste Certificate',
      'Photocopy of the parent\'s Income Certificate',
      'Photocopy of the student\'s and parents\' Aadhar Cards',
      'Photocopy of the student\'s Bank Passbook (front page)',
      'If transferring from Central to State syllabus: Permission Order from DDPI Office, Bengaluru South',
      'Photocopy of the BPL (Below Poverty Line) Card, if applicable',
    ],
    academicCalendar: [
      { event: 'FA 1', month: 'July 2025' },
      { event: 'FA 2', month: 'August 2025' },
      { event: 'SA 1', month: 'September 2025' },
      { event: 'Mid-term Holidays', month: 'Sep 20 – Oct 7, 2025' },
      { event: 'FA 3', month: 'November 2025' },
      { event: 'Class 10 Preparatory', month: 'Dec 2025 & Jan 2026' },
      { event: 'FA 4', month: 'January 2026' },
      { event: 'SA 2 (Class 8 & 9)', month: 'March 2026' },
      { event: 'Summer Holidays', month: 'Apr 11 – May 28, 2026' },
    ],
    results: [
      { year: '2024-25', url: 'http://rvghs.edu.in/wp-content/uploads/2025/06/RVGHS-Banner-2024-2025.pdf' },
      { year: '2023-24', url: 'http://rvghs.edu.in/wp-content/uploads/2025/04/RVGHS-Banner-2023-2024.pdf' },
      { year: '2022-23', url: 'http://rvghs.edu.in/wp-content/uploads/2025/04/RVGHS-BANNER-2022-2023.pdf' },
    ],
    events: ['Annual Day', 'Sports Meet', 'Independence Day', 'Republic Day', 'Children\'s Day', 'Teachers\' Day', 'Kannada Rajyotsava', 'Ganesha Festival (eco-friendly)', 'Gandhi Jayanthi', 'Ambedkar Jayanthi'],
  },
};


// ──────────────────────────────────────────────
//  CONVERSATION TREES
// ──────────────────────────────────────────────

function buildTree(s) {
  const mainMenuOptions = (schoolId) => {
    const base = [
      { label: '📚 Admissions', node: 'admissions' },
      { label: '🏫 About School', node: 'about' },
      { label: '📖 Academics', node: 'academics' },
      { label: '🏗️ Facilities', node: 'facilities' },
      { label: '📞 Contact Us', node: 'contact' },
    ];
    if (schoolId === 'rvps') {
      base.push({ label: '🚌 Transport', node: 'transport' });
      base.push({ label: '🏆 Toppers', node: 'toppers' });
      base.push({ label: '❓ FAQs', node: 'faq' });
    }
    if (schoolId === 'rvghs') {
      base.push({ label: '🍱 Mid-day Meals', node: 'midday' });
      base.push({ label: '🎯 Clubs & NCC', node: 'clubs' });
      base.push({ label: '❤️ Support & Donate', node: 'donate' });
    }
    if (schoolId === 'rvs') {
      base.splice(4, 0, { label: '💰 Fee Structure', node: 'fees' });
      base.push({ label: '♿ Inclusive Education', node: 'inclusive' });
    }
    return base;
  };

  const backOption = { label: '← Back to Menu', node: 'menu' };

  // ── RV School Tree ──
  if (s.id === 'rvs') {
    return {
      welcome: {
        message: `👋 Welcome to RV School!\n\nHow can I help you today?`,
        options: mainMenuOptions('rvs'),
      },
      menu: {
        message: `What else would you like to know about RV School?`,
        options: mainMenuOptions('rvs'),
      },
      admissions: {
        message: `📚 Admissions at RV School\n\nWe offer Primary & Secondary School admissions under Karnataka State Board.\n\n🔗 [Apply Online via Portal](${s.admissionLink})`,
        options: [
          { label: '🔗 Apply Now', node: 'adm_apply' },
          { label: '📞 Contact Office', node: 'adm_call' },
          backOption,
        ],
      },
      adm_apply: {
        message: `🔗 Apply Online via the RVEI SAP Portal:\n👉 [Open Admission Portal](${s.admissionLink})`,
        options: [backOption],
      },
      adm_call: {
        message: `📞 Admissions Contact\n\n• Phone: ${s.phone}\n• Mobile: ${s.mobile}\n• Email: ${s.email}`,
        options: [backOption],
      },
      about: {
        message: `🏫 About RV School\n\nEstablished in 2018, RV School is a premier State Board institution on a 2-acre campus at Tata Silk Farm, Bengaluru, continuing RVEI's 80+ year legacy.`,
        options: [
          { label: '👥 Management', node: 'management' },
          { label: '♿ Inclusive Education', node: 'inclusive' },
          backOption,
        ],
      },
      management: {
        message: `👥 Management\n\n• President: ${s.management.president}\n• Secretary: ${s.management.secretary}\n• Principal: ${s.principal}`,
        options: [backOption],
      },
      inclusive: {
        message: `♿ Inclusive Education\n\nRV School is proud to offer dedicated inclusive education programs for hearing-impaired children alongside holistic development.`,
        options: [backOption],
      },
      academics: {
        message: `📖 Academics at RV School\n\n• Board: ${s.board}\n• Grades: ${s.grades}\n• Co-curricular: ${s.programs.join(', ')}`,
        options: [backOption],
      },
      facilities: {
        message: `🏗️ Facilities at RV School\n\n• ${s.facilities.join('\n• ')}`,
        options: [backOption],
      },
      fees: {
        message: `💰 Fee Structure\n\nFor updated fee details and installment options:\n📞 Phone: ${s.phone}\n📧 Email: ${s.email}`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RV School\n\n📍 ${s.address}\n📞 Phone: ${s.phone}\n📱 Mobile: ${s.mobile}\n📧 Email: ${s.email}\n🌐 [Website](${s.website})`,
        options: [backOption],
      },
    };
  }

  // ── RV Public School Tree ──
  if (s.id === 'rvps') {
    return {
      welcome: {
        message: `👋 Welcome to RV Public School (ICSE)!\n\nHow can I help you today?`,
        options: mainMenuOptions('rvps'),
      },
      menu: {
        message: `What would you like to explore about RV Public School?`,
        options: mainMenuOptions('rvps'),
      },
      admissions: {
        message: `📚 Admissions at RV Public School\n\nAdmissions open from Nursery to Std 10 under the ICSE Board.\n\n🔗 [Apply Online](${s.admissionLink})`,
        options: [
          { label: '📋 Age & Criteria', node: 'adm_criteria' },
          { label: '🔗 Apply Online', node: 'adm_apply' },
          { label: '📞 Contact Admissions', node: 'adm_call' },
          backOption,
        ],
      },
      adm_criteria: {
        message: `📋 Admission Criteria (ICSE):\n\n${s.admissionCriteria.map(c => `• *${c.level}*: ${c.age}`).join('\n')}`,
        options: [{ label: '🔗 Apply Now', node: 'adm_apply' }, backOption],
      },
      adm_apply: {
        message: `🔗 Apply online via RVEI Portal:\n👉 [Open RVPS Admission Portal](${s.admissionLink})`,
        options: [backOption],
      },
      adm_call: {
        message: `📞 RVPS Admission Helpdesk\n\n• Phone: ${s.phone}\n• Alt: ${s.altPhone}\n• Email: ${s.email}`,
        options: [backOption],
      },
      about: {
        message: `🏫 About RV Public School\n\nEstablished in 2003, RVPS is an ICSE-affiliated, British Council ISA accredited school situated opposite Lalbagh West Gate, V V Puram, Bengaluru.`,
        options: [
          { label: '🏆 Toppers', node: 'toppers' },
          { label: '🚌 Transport', node: 'transport' },
          backOption,
        ],
      },
      academics: {
        message: `📖 Academics (ICSE Board)\n\n• Curriculum: CISCE (New Delhi)\n• Grades: Nursery to Class 10\n• Computer Science taught from Class 1\n• British Council International School Awardee`,
        options: [
          { label: '📘 What is ICSE?', node: 'faq_icse' },
          backOption,
        ],
      },
      facilities: {
        message: `🏗️ Facilities at RVPS\n\n• ${s.facilities.join('\n• ')}\n• Sports Partner: ${s.sportsPartner}`,
        options: [backOption],
      },
      transport: {
        message: `🚌 School Bus Transport\n\n${s.transportDetails}.\nGPS-enabled buses cover major routes across South Bengaluru. Contact the school office for route maps and fees.`,
        options: [backOption],
      },
      toppers: {
        message: `🏆 ICSE Board Exam Toppers:\n\n${s.toppers.map(t => `⭐ ${t.name}: *${t.pct}*`).join('\n')}`,
        options: [backOption],
      },
      faq: {
        message: `❓ Frequently Asked Questions:`,
        options: [
          { label: '📘 What is ICSE?', node: 'faq_icse' },
          { label: '✅ Benefits of ICSE', node: 'faq_benefits' },
          { label: '🕐 School Timings', node: 'faq_timings' },
          { label: '🥗 Food Policy', node: 'faq_food' },
          backOption,
        ],
      },
      faq_icse: {
        message: `📘 What is ICSE?\n\nICSE is a comprehensive national curriculum conducted by CISCE. It emphasizes strong English, analytical sciences, mathematics, and application-based assessments.`,
        options: [{ label: '✅ Benefits of ICSE', node: 'faq_benefits' }, backOption],
      },
      faq_benefits: {
        message: `✅ Benefits of ICSE:\n\n• Globally recognized curriculum\n• Strong command of English language\n• Project-based learning and lab assessments\n• Excellent foundation for competitive exams`,
        options: [backOption],
      },
      faq_timings: {
        message: `🕐 School Timings:\n\n• Pre-Primary: ${s.timings.prePrimary}\n• Primary & High School: ${s.timings.primary}\n• Office: ${s.timings.office}`,
        options: [backOption],
      },
      faq_food: {
        message: `🥗 Food Policy:\n\n⚠️ Only vegetarian food is permitted on campus. Non-vegetarian food is strictly prohibited.`,
        options: [backOption],
      },
      fees: {
        message: `💰 Fee Structure\n\nFor detailed class-wise fee schedules, visit the Fee Counter during office hours (${s.timings.feeOffice}) or call 📞 ${s.phone}.`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RVPS\n\n📍 ${s.address}\n📞 ${s.phone}\n📧 ${s.email}\n🌐 [Website](${s.website})`,
        options: [backOption],
      },
    };
  }

  // ── RV Girls High School Tree ──
  if (s.id === 'rvghs') {
    return {
      welcome: {
        message: `👋 Welcome to RV Girls High School!\n\nHow can I help you today?`,
        options: mainMenuOptions('rvghs'),
      },
      menu: {
        message: `What would you like to know about RV Girls High School?`,
        options: mainMenuOptions('rvghs'),
      },
      admissions: {
        message: `📚 Admissions at RVGHS (Class 8, 9 & 10)\n\nRVGHS provides quality, value-based high school education exclusively for girls under the Karnataka State Board.\n\n🔗 [Admissions Page](${s.admissionLink})`,
        options: [
          { label: '📋 Required Documents', node: 'adm_docs' },
          { label: '📞 Contact Admissions', node: 'adm_call' },
          { label: '🏆 Scholarships & Awards', node: 'scholarships' },
          backOption,
        ],
      },
      adm_docs: {
        message: `📋 Required Documents for Admission:\n\n${s.admissionDocs.map((d, i) => `${i + 1}. ${d}`).join('\n')}`,
        options: [
          { label: '📞 Call School Office', node: 'adm_call' },
          backOption,
        ],
      },
      adm_call: {
        message: `📞 RVGHS Admissions Helpdesk\n\n• Phone / Mobile: ${s.phone}\n• Email: ${s.email}\n• Office Hours: ${s.officeHours}\n• Address: ${s.address}`,
        options: [backOption],
      },
      headmaster: {
        message: `👤 Headmaster & Leadership\n\n• Headmaster: *Mr. Devaru Bhat*\n• Institution: RV Girls High School (Estd. 1962)\n• Management: Rashtreeya Sikshana Samithi Trust (RSST / RVEI)\n• Phone: ${s.phone}`,
        options: [
          { label: '📞 Contact Office', node: 'contact' },
          backOption,
        ],
      },
      about: {
        message: `🏫 About RV Girls High School\n\nFounded in 1962, RVGHS has a proud 60+ year history of empowering young women through affordable, holistic Karnataka State Board education. Located at Jayanagar 2nd Block, Bengaluru.`,
        options: [
          { label: '🎓 Alumni Network', node: 'alumni' },
          { label: '❤️ Support & Donate', node: 'donate' },
          { label: '👤 Headmaster', node: 'headmaster' },
          backOption,
        ],
      },
      alumni: {
        message: `🎓 Alumni Network\n\nConnect with our thriving alumni community on AlmaConnect:\n👉 [RVGHS AlmaConnect Portal](${s.alumniPortal})`,
        options: [backOption],
      },
      donate: {
        message: `❤️ Support & Donate to RV Girls High School\n\nYour generous contributions empower girls' education, provide scholarships, and enhance campus learning facilities.\n\n🔗 [Support & Donate Online](https://www.rvinstitutions.com/donate/)`,
        options: [
          { label: '📞 Contact School Office', node: 'contact' },
          backOption,
        ],
      },
      academics: {
        message: `📖 Academics & Syllabus\n\n• Board: ${s.board}\n• Grades: High School (Class 8 to 10 - Girls Only)\n• Core Subjects: Mathematics, General Science, Social Science\n• Co-curricular: Physical Education, Craft & SUPW, Computer Education`,
        options: [
          { label: '🗣️ Language Sections', node: 'languages' },
          { label: '🏆 Scholarships & Exams', node: 'scholarships' },
          backOption,
        ],
      },
      languages: {
        message: `🗣️ Language Combinations at RVGHS:\n\n• *Section A*: Sanskrit (1st), Kannada (2nd), English (3rd)\n• *Section B*: English (1st), Kannada (2nd), Sanskrit (3rd)\n• *Section C*: Kannada (1st), English (2nd), Hindi (3rd)`,
        options: [backOption],
      },
      midday: {
        message: `🍱 Mid-day Meals & Daily Nutrition\n\n${s.midDayMealDetails}`,
        options: [backOption],
      },
      clubs: {
        message: `🎯 Clubs & Extracurricular Activities:\n\n• ${s.clubs.join('\n• ')}`,
        options: [backOption],
      },
      facilities: {
        message: `🏗️ Campus Facilities:\n\n• ${s.facilities.join('\n• ')}`,
        options: [backOption],
      },
      results: {
        message: `📊 Board Exam Results & Banners:\n\n• [2024-25 Results Banner](${s.results[0].url})\n• [2023-24 Results Banner](${s.results[1].url})\n• [2022-23 Results Banner](${s.results[2].url})`,
        options: [backOption],
      },
      calendar: {
        message: `📅 Academic Calendar Highlights:\n\n${s.academicCalendar.map(c => `• *${c.event}*: ${c.month}`).join('\n')}`,
        options: [backOption],
      },
      scholarships: {
        message: `🏆 Competitive Exams & Student Awards:\n\n${s.competitiveExams}`,
        options: [
          { label: '📞 Contact School Office', node: 'contact' },
          backOption,
        ],
      },
      timings: {
        message: `🕐 School & Office Timings:\n\n• Office Hours: ${s.officeHours}\n• Monday – Friday: 9:00 AM – 4:30 PM\n• Saturday: 9:00 AM – 1:00 PM\n• Sunday: Closed`,
        options: [backOption],
      },
      uniform: {
        message: `👗 Uniform & Dress Code\n\nOfficial RVGHS uniforms are mandatory for all students. Detailed uniform specifications, badges, and house ribbons are provided upon admission confirmation at the school office.`,
        options: [backOption],
      },
      transport: {
        message: `🚌 Transport & Commute\n\nRVGHS does not operate dedicated buses. However, our central campus at Ashoka Pillar, Jayanagar 2nd Block has premier connectivity with BMTC bus routes and the South End Circle Metro station.`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RV Girls High School\n\n📍 *Address*: ${s.address}\n📞 *Phone*: ${s.phone}\n📧 *Email*: ${s.email}\n🌐 *Website*: [rvghs.edu.in](${s.website})\n🕐 *Hours*: ${s.officeHours}`,
        options: [
          { label: '❤️ Support & Donate', node: 'donate' },
          backOption,
        ],
      },
    };
  }
}


/* =============== CONTENT MODERATION =============== */
const BLOCKED = {
    abusive: ['fuck','shit','ass','bitch','bastard','damn','dick','pussy','slut','whore','stupid','idiot','dumb','moron','retard','crap','screw you','shut up','suck','hate you','loser','trash','worthless','ugly','go to hell','kill','murder','rape','abuse','harass','molest','stalk','threat','bomb','attack','terror','drug','weed','cocaine','heroin','alcohol','drunk','smoke','gambling','porn','sex','nude','naked','obscene','vulgar','profanity','racist','sexist','bigot','wtf','stfu','lmao','lmfao','bloody'],
    conspiracy: ['illuminati','flat earth','reptilian','chemtrail','5g cause','qanon','deep state','new world order','fake moon','area 51','aliens control','government mind control','covid fake','vaccine microchip','bill gates chip','controlled demolition','pizza gate','fake news media','rigged election','brainwash','propaganda','freemason','secret society','population control','depopulation','mk ultra'],
    private: ['student phone number','personal number','private email','home address','student address','teacher address','salary of','faculty salary','personal data','student marks','result of','cgpa of','gpa of','marks of','percentage of','private detail','confidential','password','bank detail','account number','aadhaar','pan card','dob of','date of birth of','caste of','religion of','family of','father of','mother of','girlfriend','boyfriend','relationship','married','wife of','husband of','someone\'s phone','whatsapp number','instagram id','social media of','facebook of']
};

function checkModeration(input) {
    const lower = input.toLowerCase();
    const isBlocked = (list) => {
        for (const word of list) {
            const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('(?:^|\\s)' + escaped + '(?=\\s|$|[?!.])', 'i');
            if (regex.test(lower)) return true;
        }
        return false;
    };
    if (isBlocked(BLOCKED.abusive)) return { blocked: true, type: 'abusive' };
    if (isBlocked(BLOCKED.conspiracy)) return { blocked: true, type: 'conspiracy' };
    if (isBlocked(BLOCKED.private)) return { blocked: true, type: 'private' };
    return { blocked: false };
}

function getModerationResponse(type) {
    const responses = {
        abusive: "⚠️ I'm unable to respond to inappropriate or offensive language. Please keep our conversation respectful. I'm here to help you with genuine school queries.",
        conspiracy: "⚠️ I'm designed to provide factual information about the school only. I cannot engage with conspiracy theories or unverified claims.",
        private: "⚠️ I cannot share personal or confidential information about students, faculty, or staff. This includes personal contact details, marks, or financial records."
    };
    return responses[type] || "⚠️ I cannot process this request.";
}

// ──────────────────────────────────────────────
//  TELEMETRY & INTERACTION LOGGING
// ──────────────────────────────────────────────

function logInteraction(type, content) {
    if (!currentSchool) return;

    let eventType = 'message';
    let intent = 'user_input';
    let query = typeof content === 'string' ? content : JSON.stringify(content);

    if (type === 'user_message') {
        eventType = 'message';
        intent = 'user_input';
    } else if (type === 'bot_message') {
        eventType = 'message';
        intent = 'bot_reply';
    } else if (type === 'feedback') {
        eventType = 'interaction';
        intent = 'feedback_' + content;
    } else {
        eventType = 'interaction';
        intent = type;
    }

    if (window.rvghsTrackEvent) {
        window.rvghsTrackEvent(eventType, {
            query: query,
            intent: intent,
            schoolId: currentSchool.id
        });
    }
}

// ──────────────────────────────────────────────
//  KEYWORD MATCHING & TEXT SEARCH ENGINE
// ──────────────────────────────────────────────

const KEYWORD_MAP = [
  { keywords: ['admission', 'admissions', 'apply', 'enroll', 'enrol', 'enrollment', 'registration', 'register', 'join', 'seat', 'seats', 'entry', 'how to apply', 'how to join', 'eligibility', 'standard 8', '8th std', '9th std', '10th std', 'class 8', 'class 9', 'class 10'], node: 'admissions' },
  { keywords: ['document', 'documents', 'doc', 'docs', 'certificate', 'certificates', 'tc', 'transfer certificate', 'birth cert', 'birth certificate', 'aadhar', 'caste', 'income', 'passbook', 'pen', 'aapar', 'dise', 'marks card', 'bpl card', 'bhagyalakshmi', 'ddpi'], node: 'adm_docs' },
  { keywords: ['headmaster', 'principal', 'head master', 'head teacher', 'headmistress', 'incharge', 'devaru', 'bhat', 'devarubhat', 'leader', 'who is the headmaster', 'who is the principal', 'head of school', 'leadership', 'director'], node: 'headmaster' },
  { keywords: ['about', 'history', 'founded', 'established', '1962', 'mission', 'vision', 'who', 'legacy', 'rvei', 'management', 'rsst', 'trust', 'girls school', 'girls high school'], node: 'about' },
  { keywords: ['scholarship', 'scholarships', 'competitive exam', 'financial aid', 'concession', 'award', 'awards', 'nmms', 'chard'], node: 'scholarships' },
  { keywords: ['fee', 'fees', 'cost', 'price', 'payment', 'pay', 'amount', 'charge', 'charges', 'fee structure'], node: 'adm_call' },
  { keywords: ['contact', 'phone', 'mobile', 'call', 'telephone', 'email', 'mail', 'address', 'location', 'reach', 'where', 'map', 'direction', 'directions', 'route', 'pin', 'pincode', 'jayanagar', 'tata silk farm', 'ashoka pillar'], node: 'contact' },
  { keywords: ['timing', 'timings', 'time', 'times', 'hour', 'hours', 'office hour', 'office hours', 'when open', 'bell', 'schedule', 'working hours', 'closing time', 'saturday', 'sunday', 'school hours'], node: 'timings' },
  { keywords: ['academic', 'academics', 'subject', 'subjects', 'syllabus', 'curriculum', 'board', 'study', 'class', 'classes', 'grade', 'karnataka', 'state board', 'high school', 'standards', 'kseeb', 'sslckseeb'], node: 'academics' },
  { keywords: ['language', 'languages', 'sanskrit', 'kannada', 'english', 'hindi', 'medium', 'section', 'sections', 'first language', 'second language', 'third language', '1st language', '2nd language', '3rd language', 'mother tongue', 'section a', 'section b', 'section c'], node: 'languages' },
  { keywords: ['facility', 'facilities', 'infrastructure', 'lab', 'labs', 'laboratory', 'computer', 'computer lab', 'science lab', 'library', 'auditorium', 'playground', 'sports room', 'campus', 'building', 'canteen'], node: 'facilities' },
  { keywords: ['bus', 'transport', 'route', 'van', 'pick', 'drop', 'commute', 'bmtc', 'metro', 'vehicle', 'travel', 'connectivity'], node: 'transport' },
  { keywords: ['meal', 'meals', 'lunch', 'food', 'mid-day', 'midday', 'mid-day meal', 'midday meal', 'canteen', 'tiffin', 'akshaya', 'patra', 'iskcon', 'milk', 'ragi', 'ragi malt', 'egg', 'eggs', 'chikki', 'banana', 'nutrition', 'eat', 'free meal'], node: 'midday' },
  { keywords: ['club', 'clubs', 'ncc', 'ncc wing', 'guide', 'guides', 'girl guide', 'bugle', 'band', 'bugle band', 'extracurricular', 'extra', 'activity', 'activities', 'beyond', 'science club', 'eco club', 'sangha', 'kannada sangha', 'sports'], node: 'clubs' },
  { keywords: ['uniform', 'dress', 'clothes', 'wear', 'shoes', 'ribbon', 'dress code', 'badge', 'house color'], node: 'uniform' },
  { keywords: ['exam', 'exams', 'competitive', 'nmms', 'chard', 'gk', 'ramayana', 'mahabharata', 'scholarship exam', 'aid', 'assessment', 'fa1', 'fa2', 'sa1', 'sa2', 'preparatory', 'preparatory exam'], node: 'scholarships' },
  { keywords: ['result', 'results', 'topper', 'toppers', 'marks', 'pass', 'percentage', 'score', 'sslc', '10th', 'board exam', '10th result', 'banner', 'pdf'], node: 'results' },
  { keywords: ['calendar', 'calender', 'holiday', 'holidays', 'vacation', 'summer', 'mid-term', 'summer holidays', 'annual day', 'events', 'academic calendar', 'date sheet', 'schedule'], node: 'calendar' },
  { keywords: ['donate', 'donation', 'donations', 'support', 'support us', 'contribute', 'contribution', 'fund', 'fundraiser', 'help girls', 'charity', 'give', 'giving', 'sponsor', 'sponsorship', 'support and donate'], node: 'donate' },
  { keywords: ['alumni', 'ex-student', 'old student', 'almaconnect', 'graduates', 'passout', 'alumnae'], node: 'alumni' },
  { keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'vanakkam', 'greeting'], node: 'menu' },
  { keywords: ['menu', 'help', 'start', 'option', 'options', 'home', 'back', 'main', 'restart'], node: 'menu' },
  { keywords: ['thanks', 'thank', 'thank you', 'bye', 'goodbye', 'ok', 'great', 'nice', 'cool', 'awesome', 'helpful'], node: '_thanks' },
  { keywords: ['human', 'person', 'talk', 'agent', 'operator', 'call person', 'speak with someone', 'staff'], node: 'contact' },
];

function matchKeywordsMultiple(text, tree) {
  const lower = text.toLowerCase().trim();
  let matches = [];
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      if (tree[entry.node] && !matches.includes(entry.node)) matches.push(entry.node);
    }
  }
  return matches;
}

function matchKeyword(text, tree) {
  const lower = text.toLowerCase().trim();
  for (const entry of KEYWORD_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      if (tree[entry.node]) return entry.node;
    }
  }
  return null;
}


// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
//  UI ENGINE & STATE MACHINE
// ──────────────────────────────────────────────

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentSchool = null;
let currentTree = null;

let SESSION = { navStack: [], pendingOverflows: [] };
let chatOpen = false;

const SafeStorage = {
    mem: {},
    setItem: function(k, v) { try { localStorage.setItem(k, v); } catch(e) { this.mem[k] = v; } },
    getItem: function(k) { try { return localStorage.getItem(k) || this.mem[k]; } catch(e) { return this.mem[k]; } },
    removeItem: function(k) { try { localStorage.removeItem(k); } catch(e) { delete this.mem[k]; } }
};

function saveState() {
    const chatContainer = document.getElementById('chatContainer');
    if (!currentSchool || !chatContainer) return;
    SafeStorage.setItem(currentSchool.id + '_chat_html', chatContainer.innerHTML);
    SafeStorage.setItem(currentSchool.id + '_chat_time', Date.now().toString());
    SafeStorage.setItem(currentSchool.id + '_navStack', JSON.stringify(SESSION.navStack));
}

let msgObserver = null;

// ── Set accent colors ──
function setAccent(school) {
  const root = document.documentElement;
  root.style.setProperty('--accent', school.accent);
  root.style.setProperty('--accent-glow', school.accentGlow);
  root.style.setProperty('--accent-gradient', school.gradient);
}

// ── Open chat ──
function openChat(schoolId) {
  const sid = schoolId || (window.rvghsChatbotSettings ? 'rvghs' : 'rvghs');
  currentSchool = SCHOOLS[sid] || SCHOOLS.rvghs;
  currentTree = buildTree(currentSchool);
  setAccent(currentSchool);

  const chatSchoolName = document.getElementById('chatSchoolName');
  const chatContainer = document.getElementById('chatContainer');
  const chatWidget = document.getElementById('chatWidget');

  if (chatSchoolName) {
    const settings = window.rvghsChatbotSettings;
    chatSchoolName.textContent = settings && settings.title ? settings.title : currentSchool.name;
  }
  if (!chatContainer) return;

  // Restore State
  const time = SafeStorage.getItem(currentSchool.id + '_chat_time');
  let savedHtml = null;
  // 2 hours expiry
  if (time && (Date.now() - parseInt(time) > 7200000)) {
      SafeStorage.removeItem(currentSchool.id + '_chat_html');
      SafeStorage.removeItem(currentSchool.id + '_chat_time');
      SafeStorage.removeItem(currentSchool.id + '_navStack');
  } else {
      savedHtml = SafeStorage.getItem(currentSchool.id + '_chat_html');
      try {
          const savedNav = SafeStorage.getItem(currentSchool.id + '_navStack');
          if (savedNav) SESSION.navStack = JSON.parse(savedNav);
      } catch(e){}
  }

  if (!msgObserver) {
    msgObserver = new MutationObserver(() => saveState());
    msgObserver.observe(chatContainer, { childList: true, subtree: true });
  }

  if (savedHtml && savedHtml.trim().length > 0) {
      chatContainer.innerHTML = savedHtml;
      // Rebind buttons
      chatContainer.querySelectorAll('.quick-reply-btn').forEach(btn => {
          btn.addEventListener('click', () => {
              const action = btn.dataset.node;
              if (action) {
                  addUserMessage(btn.textContent.replace('⬅️ ', '').replace('👉 Also answer: ', ''));
                  if (action === '_back') {
                      SESSION.navStack.pop();
                      const prevId = SESSION.navStack[SESSION.navStack.length - 1] || 'menu';
                      sendBotMessage(prevId, true);
                  } else {
                      sendBotMessage(action);
                  }
              }
          });
      });
      scrollToBottom();
  } else {
      chatContainer.innerHTML = '';
      // Display welcome hero screen for exactly 3 seconds (3000ms)
      setTimeout(() => {
        const hs = document.getElementById('rvghs-hero-screen');
        if (hs) hs.classList.add('fade-out');
        sendBotMessage('welcome');
      }, 3000);
  }

  if (chatWidget) chatWidget.classList.add('active');
  const wp = document.getElementById('rvghsWelcomePrompt');
  if (wp) wp.style.display = 'none';
}

// ── Close chat ──
function closeChat() {
  const chatWidget = document.getElementById('chatWidget');
  if (chatWidget) chatWidget.classList.remove('active');
}

// ── Format message text ──
function formatText(text) {
  if (!text) return '';
  let formatted = text;

  // 1. Protect Markdown links: [Text](URL)
  const linkStore = [];
  formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\)\s]+)\)/g, (match, label, url) => {
    const placeholder = `___LINK_TOKEN_${linkStore.length}___`;
    linkStore.push(`<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #800080; text-decoration: underline; font-weight: 700;">${label}</a>`);
    return placeholder;
  });

  // 2. Bold: *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

  // 3. Newlines
  formatted = formatted.replace(/\n/g, '<br>');

  // 4. Restore protected links
  linkStore.forEach((html, i) => {
    formatted = formatted.replace(`___LINK_TOKEN_${i}___`, html);
  });

  return formatted;
}

// ── Create message element ──
function createMessage(text, type, isSuccess = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;

  if (type === 'bot') {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    const img = document.createElement('img');
    img.alt = 'Bot';

    if (isSuccess) {
      img.src = getAssetUrl('garuda_head_shades.png');
      setTimeout(() => {
        img.src = getAssetUrl('garuda_head.png');
      }, 2500);
    } else {
      img.src = getAssetUrl('garuda_head.png');
    }

    avatar.appendChild(img);
    msgDiv.appendChild(avatar);
  } else {
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<span style="font-size: 16px;">👤</span>`;
    msgDiv.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = formatText(text);

  msgDiv.appendChild(bubble);
  return msgDiv;
}

// ── Create quick replies ──
function createQuickReplies(options) {
  const container = document.createElement('div');
  container.className = 'quick-replies';

  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quick-reply-btn';
    btn.innerHTML = opt.label;
    btn.dataset.node = opt.node;
    btn.addEventListener('click', () => {
      const action = btn.dataset.node;
      if (action) {
        addUserMessage(btn.textContent.replace('⬅️ ', '').replace('👉 Also answer: ', ''));
        if (action === '_back') {
            SESSION.navStack.pop();
            const prevId = SESSION.navStack[SESSION.navStack.length - 1] || 'menu';
            sendBotMessage(prevId, true);
        } else {
            sendBotMessage(action);
        }
      }
    });
    container.appendChild(btn);
  });

  return container;
}

// ── Create typing indicator ──
function createTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.id = 'typingIndicator';

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  const img = document.createElement('img');
  img.src = getAssetUrl('garuda_head_thinking.png');
  img.alt = 'Thinking';
  avatar.appendChild(img);

  const dots = document.createElement('div');
  dots.className = 'dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  div.appendChild(avatar);
  div.appendChild(dots);
  return div;
}

// ── Add user message ──
function addUserMessage(text) {
  if (!chatContainer) return;
  const msg = createMessage(text, 'user');
  chatContainer.appendChild(msg);
  scrollToBottom();
}

// ── Send bot message ──
function sendBotMessage(nodeId, isBack = false, delay = 450) {
  if (!currentTree || !chatContainer) return;
  const node = currentTree[nodeId];
  if (!node) return;

  if (!isBack && nodeId !== 'welcome' && nodeId !== '_thanks') {
    SESSION.navStack.push(nodeId);
  }

  const typing = createTypingIndicator();
  chatContainer.appendChild(typing);
  scrollToBottom();

  setTimeout(() => {
    typing.remove();

    const msg = createMessage(node.message, 'bot', true);
    chatContainer.appendChild(msg);
    logInteraction('bot_message', node.message);

    let options = node.options || [];

    // Handle queued multi-question answers
    if (SESSION.pendingOverflows && SESSION.pendingOverflows.length > 0) {
        const nextNodeId = SESSION.pendingOverflows.shift();
        const nextNode = currentTree[nextNodeId];
        if (nextNode) {
            options = [{ label: '👉 Also answer: ' + nextNodeId.toUpperCase(), node: nextNodeId }, ...options];
        }
    }

    if (options.length > 0) {
      const qr = createQuickReplies(options);
      chatContainer.appendChild(qr);
    } else {
      // Terminal node feedback
      const fb = document.createElement('div');
      fb.className = 'feedback-btns';
      fb.style.cssText = 'display:flex; gap:10px; padding: 10px 16px; margin-top: -10px; margin-bottom: 15px;';
      fb.innerHTML = `
          <span style="font-size:12px; color:var(--text-light); margin-right:5px; align-self:center;">Helpful?</span>
          <button type="button" style="background:transparent; border:1px solid var(--border-color); border-radius:15px; padding:4px 10px; cursor:pointer;" onclick="logInteraction('feedback', 'positive'); this.parentElement.innerHTML='<span style=\\'font-size:12px; color:var(--text-light);\\'>Thanks for the feedback! ✅</span>'">👍</button>
          <button type="button" style="background:transparent; border:1px solid var(--border-color); border-radius:15px; padding:4px 10px; cursor:pointer;" onclick="logInteraction('feedback', 'negative'); this.parentElement.innerHTML='<span style=\\'font-size:12px; color:var(--text-light);\\'>Thanks for the feedback! ❌</span>'">👎</button>
      `;
      chatContainer.appendChild(fb);
    }

    scrollToBottom();
  }, delay);
}

// ── Scroll to bottom ──
function scrollToBottom() {
  if (!chatBody) return;
  requestAnimationFrame(() => {
    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: 'smooth',
    });
  });
}

// ── Handle free-text and voice search input ──
function handleInput(forcedText) {
  if (!chatInput) return;
  const text = forcedText || chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  addUserMessage(text);
  logInteraction('user_message', text);

  setTimeout(() => {
    const mod = checkModeration(text);
    if (mod.blocked) {
      const typing = createTypingIndicator();
      chatContainer.appendChild(typing);
      scrollToBottom();
      setTimeout(() => {
        typing.remove();
        const msg = createMessage(getModerationResponse(mod.type), 'bot');
        chatContainer.appendChild(msg);
        logInteraction('bot_message', 'MODERATION_BLOCKED');
        scrollToBottom();
      }, 500);
      return;
    }

    const matches = matchKeywordsMultiple(text, currentTree);
    let matchedNode = matches.length > 0 ? matches[0] : null;

    if (matches.length > 1) {
        SESSION.pendingOverflows = matches.slice(1);
    } else {
        SESSION.pendingOverflows = [];
    }

    if (matchedNode === '_thanks') {
      const typing = createTypingIndicator();
      chatContainer.appendChild(typing);
      scrollToBottom();
      setTimeout(() => {
        typing.remove();
        const msg = createMessage(`You're very welcome! 😊 Feel free to ask anything else about *${currentSchool.name}*.`, 'bot');
        chatContainer.appendChild(msg);
        const qr = createQuickReplies([{ label: '← Back to Menu', node: 'menu' }]);
        chatContainer.appendChild(qr);
        scrollToBottom();
      }, 500);
    } else if (matchedNode) {
      sendBotMessage(matchedNode);
    } else {
      // Fallback response with popular choices
      const typing = createTypingIndicator();
      chatContainer.appendChild(typing);
      scrollToBottom();
      setTimeout(() => {
        typing.remove();
        const fallbackMsg = createMessage(
          `❓ I didn't quite catch that. Here are some of the most popular topics I can help you with:`,
          'bot'
        );
        chatContainer.appendChild(fallbackMsg);
        const fallbackOptions = [
          { label: '📚 Admissions', node: 'admissions' },
          { label: '🏫 About School', node: 'about' },
          { label: '📖 Academics', node: 'academics' },
          { label: '🍱 Mid-day Meals', node: 'midday' },
          { label: '🏗️ Facilities', node: 'facilities' },
          { label: '📞 Contact Us', node: 'contact' },
        ];
        const qr = createQuickReplies(fallbackOptions);
        chatContainer.appendChild(qr);
        scrollToBottom();
      }, 500);
    }
  }, 250);
}


// ──────────────────────────────────────────────
//  EVENT LISTENERS & INITIALIZATION
// ──────────────────────────────────────────────

function initChatbot() {
  const chatWidget = document.getElementById('chatWidget');
  const chatLauncher = document.getElementById('chatLauncher');
  const closeChatBtn = document.getElementById('closeChatBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const welcomePrompt = document.getElementById('rvghsWelcomePrompt');
  const welcomePromptClose = document.getElementById('rvghsWelcomePromptClose');
  const typeahead = document.getElementById('typeahead');
  const micBtn = document.getElementById('micBtn');

  // Immediately ensure launcher mascot displays garuda_head.png
  const mascotImg = document.getElementById('launcherMascotImg');
  if (mascotImg) {
    mascotImg.src = getAssetUrl('garuda_head.png');
  }

  // Multi-school card clicks (if demo page)
  $$('.school-card').forEach(card => {
    card.addEventListener('click', () => {
      const schoolId = card.dataset.school;
      openChat(schoolId);
    });
  });

  // Welcome prompt tooltip click
  if (welcomePrompt) {
    welcomePrompt.addEventListener('click', (e) => {
      if (e.target !== welcomePromptClose && !welcomePromptClose.contains(e.target)) {
        welcomePrompt.style.display = 'none';
        openChat('rvghs');
      }
    });
  }

  // Welcome prompt close button
  if (welcomePromptClose) {
    welcomePromptClose.addEventListener('click', (e) => {
      e.stopPropagation();
      if (welcomePrompt) welcomePrompt.style.display = 'none';
    });
  }

  // Waving / resting trigger when chat is closed
  function triggerWavingOnClose() {
    const mascotImg = document.getElementById('launcherMascotImg');
    if (mascotImg) {
      mascotImg.src = getAssetUrl('garuda_head.png');
      mascotImg.classList.remove('thinking-zoom');
    }
  }

  // Chat launcher click
  if (chatLauncher) {
    chatLauncher.addEventListener('click', () => {
      if (welcomePrompt) welcomePrompt.style.display = 'none';
      const mascotImg = document.getElementById('launcherMascotImg');
      if (chatWidget && chatWidget.classList.contains('active')) {
        chatWidget.classList.remove('active');
        triggerWavingOnClose();
      } else if (mascotImg) {
        mascotImg.src = getAssetUrl('garuda_head_thinking.png');
        mascotImg.classList.add('thinking-zoom');
        setTimeout(() => {
          mascotImg.src = getAssetUrl('garuda_head.png');
          mascotImg.classList.remove('thinking-zoom');
          openChat('rvghs');
        }, 300);
      } else {
        openChat('rvghs');
      }
    });
  }

  // Close chat button
  if (closeChatBtn) {
    closeChatBtn.addEventListener('click', () => {
      if (chatWidget) chatWidget.classList.remove('active');
      triggerWavingOnClose();
    });
  }

  // Clear chat button
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', () => {
      const chatContainer = document.getElementById('chatContainer');
      if (currentTree && chatContainer) {
        chatContainer.innerHTML = '';
        const hs = document.getElementById('rvghs-hero-screen');
        if (hs) hs.classList.remove('fade-out');
        SESSION.navStack = [];
        SESSION.pendingOverflows = [];
        SafeStorage.removeItem((currentSchool ? currentSchool.id : 'rvghs') + '_chat_html');
        setTimeout(() => {
          if (hs) hs.classList.add('fade-out');
          sendBotMessage('welcome');
        }, 3000);
      }
    });
  }

  // Send button
  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleInput());
  }

  // Enter key
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleInput();
      }
    });
  }

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget && chatWidget.classList.contains('active')) {
      closeChat();
    }
  });

  // Suggestion chips
  document.querySelectorAll('.suggestion-chip').forEach(c => {
    c.addEventListener('click', () => {
      handleInput(c.dataset.query);
    });
  });

  // Typeahead autocomplete
  const POPULAR_QUERIES = [
      "Tell me about admissions",
      "Who is the headmaster?",
      "What are the required documents?",
      "Tell me about scholarships & awards",
      "What are the school timings?",
      "Is mid-day meal provided?",
      "What languages are taught?",
      "Where is the school located?",
      "What facilities are available?"
  ];

  if (chatInput && typeahead) {
    chatInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      if (val.length < 2) {
        typeahead.classList.add('hidden');
        return;
      }
      const matches = POPULAR_QUERIES.filter(q => q.toLowerCase().includes(val)).slice(0, 4);
      if (matches.length === 0) {
        typeahead.classList.add('hidden');
        return;
      }
      typeahead.innerHTML = matches.map(m => `<div class="typeahead-item">${m}</div>`).join('');
      typeahead.classList.remove('hidden');
      typeahead.querySelectorAll('.typeahead-item').forEach(item => {
        item.addEventListener('click', () => {
          chatInput.value = item.innerText;
          typeahead.classList.add('hidden');
          handleInput(item.innerText);
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!typeahead.contains(e.target) && e.target !== chatInput) {
        typeahead.classList.add('hidden');
      }
    });
  }

  // Voice Search (Speech Recognition)
  if (('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && micBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
      micBtn.classList.add('recording');
      if (chatInput) chatInput.placeholder = "Listening... 🎤";
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (chatInput) chatInput.value = transcript;
      setTimeout(() => handleInput(transcript), 400);
    };
    recognition.onerror = () => {
      micBtn.classList.remove('recording');
      if (chatInput) chatInput.placeholder = "Type a message…";
    };
    recognition.onend = () => {
      micBtn.classList.remove('recording');
      if (chatInput) chatInput.placeholder = "Type a message…";
    };
    micBtn.addEventListener('click', () => {
      if (micBtn.classList.contains('recording')) {
        recognition.stop();
      } else {
        try { recognition.start(); } catch(e){}
      }
    });
  } else if (micBtn) {
    micBtn.style.display = 'none';
  }
}

// ── Safe DOM Initialization ──
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}

