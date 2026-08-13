/* =========================================================
   RV Schools Chatbot — app.js
   Decision-tree chatbot with verified school data
   ========================================================= */

// ──────────────────────────────────────────────
//  SCHOOL DATA  (all verified from websites)
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
    grades: 'High School (Girls Only)',
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
    midDayMealDetails: 'ISKCON Akshaya Patra Foundation provides nutritious meals (incl. milk/ragi malt). Daily Supplementary Nutritious Food (eggs, chikki, or bananas) provided by Azim Premji Foundation & Department of Education.',
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
    competitiveExams: 'NMMS, CHARD GK, Hindi/Sanskrit exams, Ramayana & Mahabharata exams — up to ₹12,000 financial aid',
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
      'If the student is transferring from Central to State syllabus, a Permission Order from the DDPI Office, Bengaluru South, is required.',
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
  /* Shared nodes */
  const mainMenuOptions = (schoolId) => {
    const base = [
      { label: '📚 Admissions', node: 'admissions' },
      { label: '🏫 About the School', node: 'about' },
      { label: '📖 Academics', node: 'academics' },
      { label: '🏗️ Facilities', node: 'facilities' },
      { label: '📞 Contact Us', node: 'contact' },
    ];
    if (schoolId === 'rvps') {
      base.push({ label: '🚌 Transport / Bus', node: 'transport' });
      base.push({ label: '🏆 Toppers', node: 'toppers' });
      base.push({ label: '❓ FAQs', node: 'faq' });
    }
    if (schoolId === 'rvghs') {
      base.splice(4, 0, { label: '💰 Fee Structure', node: 'fees' });
      base.push({ label: '🍱 Mid-day Meals', node: 'midday' });
      base.push({ label: '🎯 Clubs & Beyond Academics', node: 'clubs' });
      base.push({ label: '📊 Results', node: 'results' });
      base.push({ label: '📅 Academic Calendar', node: 'calendar' });
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
        message: `📚 Admissions\n\nWe offer Primary & Secondary School admissions.\n\n🔗 [Apply Online](${s.admissionLink})`,
        options: [
          { label: '🔗 Apply Now', node: 'adm_apply' },
          { label: '📞 Contact Us', node: 'adm_call' },
          backOption,
        ],
      },
      adm_apply: {
        message: `🔗 Apply Online via the RVEI SAP Portal:\n👉 ${s.admissionLink}`,
        options: [backOption],
      },
      adm_call: {
        message: `📞 Admissions Contact\n\n📞 ${s.phone}\n📧 ${s.email}`,
        options: [backOption],
      },
      about: {
        message: `🏫 About RV School\n\nEstablished in 2018, RV School is a State Board institution focused on holistic development.`,
        options: [
          { label: '👥 Management', node: 'management' },
          { label: '♿ Inclusive Education', node: 'inclusive' },
          backOption,
        ],
      },
      management: {
        message: `👥 Management\n\nPresident: ${s.management.president}\nSecretary: ${s.management.secretary}`,
        options: [backOption],
      },
      inclusive: {
        message: `♿ Inclusive Education\n\nWe provide inclusive education, specially supporting children with hearing impairment.`,
        options: [backOption],
      },
      academics: {
        message: `📖 Academics\n\nWe follow the Karnataka State Board syllabus in English medium.`,
        options: [backOption],
      },
      facilities: {
        message: `🏗️ Facilities\n\nWe provide smart classrooms, labs, a food court, and an amphitheater.`,
        options: [backOption],
      },
      fees: {
        message: `💰 Fee Structure\n\nPlease contact our office for current fee details:\n📞 ${s.phone}`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RV School\n\n📍 ${s.address}\n📞 ${s.phone}\n📧 ${s.email}\n🌐 [Visit Website](${s.website})`,
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
        message: `What else would you like to know about RVPS?`,
        options: mainMenuOptions('rvps'),
      },
      admissions: {
        message: `📚 Admissions\n\nWe offer Pre-Primary (Nursery–UKG) to Secondary (Std 8–10) education. Admissions for AY 2026-27 are open!\n\n🔗 [Apply Online](${s.admissionLink})`,
        options: [
          { label: '🔗 Apply Now', node: 'adm_apply' },
          { label: '📞 Contact Us', node: 'adm_call' },
          backOption,
        ],
      },
      adm_apply: {
        message: `🔗 Apply Online via the RVEI SAP Portal:\n👉 ${s.admissionLink}`,
        options: [backOption],
      },
      adm_call: {
        message: `📞 Admissions Contact\n\n📞 ${s.phone}\n📧 ${s.email}\n\n🔗 [Contact Page](${s.website}/contact-us/)`,
        options: [backOption],
      },
      about: {
        message: `🏫 About RVPS\n\nEstablished in 2003, RVPS is an ICSE school under the RSST Trust, focused on holistic child development.\n\n🔗 [Read More](${s.website}/aboutus/)`,
        options: [
          { label: '🏗️ Facilities', node: 'facilities' },
          { label: '🏆 Toppers', node: 'toppers' },
          backOption,
        ],
      },
      academics: {
        message: `📖 Academics\n\nWe follow the ICSE (CISCE) curriculum from Nursery to Std 10, blending core subjects with sports and arts.\n\n🔗 [Academics Info](${s.website}/academics/)`,
        options: [
          { label: '🏆 ICSE Toppers', node: 'toppers' },
          { label: '🏠 Houses', node: 'houses' },
          backOption,
        ],
      },
      toppers: {
        message: `🏆 Our Top Achievers\n\nOur students consistently excel in ICSE board exams.\n\n🔗 [Academics Info](${s.website}/academics/)`,
        options: [backOption],
      },
      houses: {
        message: `🏠 Houses\n\nStudents participate in inter-house competitions (Charaka, Aryabhatta, Bhaskara, Sushrutha) to build teamwork.\n\n🔗 [Campus Life](${s.website}/campus-life/)`,
        options: [backOption],
      },
      facilities: {
        message: `🏗️ Facilities\n\nWe provide modern labs, a digitized library, a vast playground, and an auditorium.\n\n🔗 [Campus Life](${s.website}/campus-life/)`,
        options: [backOption],
      },
      transport: {
        message: `🚌 Transport\n\nWe offer safe bus services covering a 5 km radius around the school.\n\n🔗 [Campus Life](${s.website}/campus-life/)`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RVPS\n\n📍 ${s.address}\n📞 ${s.phone}\n📧 ${s.email}\n\n🔗 [Contact Page](${s.website}/contact-us/)`,
        options: [backOption],
      },
      faq: {
        message: `❓ Frequently Asked Questions\n\nSelect a topic below:`,
        options: [
          { label: '📘 What is ICSE?', node: 'faq_icse' },
          { label: '✅ Benefits of ICSE', node: 'faq_benefits' },
          { label: '🕐 School Timings', node: 'faq_timings' },
          { label: '🚌 Transport Info', node: 'faq_transport' },
          { label: '🥗 Food Policy', node: 'faq_food' },
          backOption,
        ],
      },
      faq_icse: {
        message: `📘 What is ICSE?\n\nICSE (Indian Certificate of Secondary Education) is a nationally recognized board conducted by CISCE. It offers a balanced curriculum with equal emphasis on languages, sciences, mathematics, and arts.\n\nRVPS follows the ICSE syllabus from Nursery to Std 10.`,
        options: [
          { label: '✅ Benefits of ICSE', node: 'faq_benefits' },
          { label: '← Back to FAQs', node: 'faq' },
          backOption,
        ],
      },
      faq_benefits: {
        message: `✅ Benefits of ICSE\n\n• Comprehensive and well-rounded curriculum\n• Strong focus on English and communication skills\n• Internal assessments and project-based learning\n• Widely accepted by universities in India and abroad\n• Develops analytical thinking and problem-solving`,
        options: [
          { label: '📘 What is ICSE?', node: 'faq_icse' },
          { label: '← Back to FAQs', node: 'faq' },
          backOption,
        ],
      },
      faq_timings: {
        message: `🕐 School Timings\n\n🔔 Morning Assembly: 8:00 AM\n📚 Classes: 8:15 AM – 3:15 PM\n\nTimings may vary for pre-primary sections. Please contact the school office for exact details.`,
        options: [
          { label: '← Back to FAQs', node: 'faq' },
          backOption,
        ],
      },
      faq_transport: {
        message: `🚌 Transport Facilities\n\nRVPS provides safe and reliable bus services covering a 5 km radius around the school. GPS-enabled buses with trained staff ensure student safety.\n\nFor route availability and fees, please contact the school office.\n📞 ${s.phone}`,
        options: [
          { label: '← Back to FAQs', node: 'faq' },
          backOption,
        ],
      },
      faq_food: {
        message: `🥗 Food Policy\n\n⚠️ Only vegetarian food is allowed on the school campus.\n\nStudents are encouraged to bring home-cooked vegetarian meals. Non-vegetarian food items are strictly not permitted inside the school premises.`,
        options: [
          { label: '← Back to FAQs', node: 'faq' },
          backOption,
        ],
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
        message: `What else would you like to know about RVGHS?`,
        options: mainMenuOptions('rvghs'),
      },
      admissions: {
        message: `📚 Admissions\n\nRVGHS welcomes girls to be part of a nurturing academic environment.`,
        options: [
          { label: '📋 Required Documents', node: 'adm_docs' },
          { label: '📞 Contact Admissions', node: 'adm_call' },
          backOption,
        ],
      },
      adm_docs: {
        message: `📋 Required Documents:\n\n${s.admissionDocs.map((d, i) => `${i+1}. ${d}`).join('\n')}`,
        options: [backOption],
      },
      adm_call: {
        message: `📞 Admissions Contact\n\n📞 ${s.phone}\n📧 ${s.email}`,
        options: [backOption],
      },
      about: {
        message: `🏫 About RVGHS\n\nFounded in 1962, RVGHS is a State Board school dedicated to educating and empowering women.`,
        options: [
          { label: '🎓 Alumni Network', node: 'alumni' },
          { label: '❤️ Donate', node: 'donate' },
          backOption,
        ],
      },
      alumni: {
        message: `🎓 Alumni Network\n\nConnect on AlmaConnect: ${s.alumniPortal}`,
        options: [backOption],
      },
      donate: {
        message: `❤️ Donate\n\nSupport girls' education: ${s.donateLink}`,
        options: [backOption],
      },
      academics: {
        message: `📖 Academics\n\nWe offer Karnataka State Board syllabus with multiple language sections.`,
        options: [backOption],
      },
      midday: {
        message: `🍱 Mid-day Meal\n\nWe provide nutritious Government mid-day meals via ISKCON Akshaya Patra Foundation.`,
        options: [backOption],
      },
      clubs: {
        message: `🎯 Clubs\n\nWe have 12 active clubs including Science, Eco, and Literary clubs.`,
        options: [backOption],
      },
      facilities: {
        message: `🏗️ Facilities\n\nOur campus includes an auditorium, computer lab, and library.`,
        options: [backOption],
      },
      results: {
        message: `📊 Results\n\nView results at our school office.`,
        options: [backOption],
      },
      calendar: {
        message: `📅 Calendar\n\nPlease check our website or contact the office for the calendar.`,
        options: [backOption],
      },
      fees: {
        message: `💰 Fees\n\nFor fee details, contact:\n📞 ${s.phone}`,
        options: [backOption],
      },
      contact: {
        message: `📞 Contact RVGHS\n\n📍 ${s.address}\n📞 ${s.phone}\n📧 ${s.email}\n🌐 [Visit Website](${s.website})`,
        options: [backOption],
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
        private: "⚠️ I cannot share personal or confidential information about students, faculty, or staff. This includes contact details, marks, or personal data."
    };
    return responses[type];
}

function logInteraction(type, content) {
    if (!currentSchool) return;
    const logs = JSON.parse(localStorage.getItem('rvce_standalone_logs') || '[]');
    
    let sid = sessionStorage.getItem('chat_session_id');
    if (!sid) {
        sid = 'sid_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('chat_session_id', sid);
    }

    let t = 'message';
    let i = 'unmatched';
    let q = content;

    if (type === 'user_message') {
        t = 'message';
        i = 'user_input';
    } else if (type === 'bot_message') {
        t = 'interaction';
        i = 'bot_reply';
        q = '[Bot Reply] ' + (content.length > 40 ? content.substring(0, 40) + '...' : content);
    } else if (type === 'feedback') {
        t = 'interaction';
        i = 'feedback_' + content;
        q = '[Feedback] ' + content;
    }

    const logData = { 
        s: sid, 
        q: q, 
        i: i, 
        d: new Date().toISOString(), 
        t: t 
    };
    logs.push(logData);

    if(logs.length > 1000) logs.shift();
    localStorage.setItem('rvce_standalone_logs', JSON.stringify(logs));

    // Dual-write Telemetry
    const wpRestUrl = window.rvghs_wp_url || 'http://localhost/wp-json/rvghs-chatbot/v1/log';
    const vercelUrl = window.rvghs_vercel_url || 'http://localhost:5000/api/logs';

    // 1. Write to WordPress
    fetch(wpRestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logData)
    }).catch(err => console.error('WP Telemetry Error:', err));

    // 2. Write to Vercel/MongoDB (Multi-Tenant Format)
    const multiTenantPayload = {
        institute_id: 'rvghs',
        api_key: 'rvghs_key_12345',
        sessionId: sid,
        events: [{
            eventType: t,
            data: { intent: i, query: q }
        }]
    };
    fetch(vercelUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(multiTenantPayload)
    }).catch(err => console.error('Vercel Telemetry Error:', err));
}

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

// ──────────────────────────────────────────────
//  KEYWORD MATCHING (free-text input)
// ──────────────────────────────────────────────

const KEYWORD_MAP = [
  { keywords: ['admission', 'apply', 'enroll', 'registration', 'join', 'seat'], node: 'admissions' },
  { keywords: ['about', 'history', 'founded', 'mission', 'vision', 'who'], node: 'about' },
  { keywords: ['fee', 'fees', 'cost', 'price', 'payment', 'amount'], node: 'fees' },
  { keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'where', 'map', 'direction'], node: 'contact' },
  { keywords: ['academic', 'subject', 'syllabus', 'curriculum', 'board', 'study'], node: 'academics' },
  { keywords: ['facility', 'facilities', 'infrastructure', 'lab', 'library', 'auditorium', 'playground', 'campus'], node: 'facilities' },
  { keywords: ['bus', 'transport', 'route', 'pick', 'drop'], node: 'transport' },
  { keywords: ['meal', 'lunch', 'food', 'mid-day', 'midday', 'canteen', 'tiffin', 'akshaya', 'iscon', 'iskcon'], node: 'midday' },
  { keywords: ['club', 'ncc', 'guide', 'bugle', 'extracurricular', 'extra', 'activity', 'beyond'], node: 'clubs' },
  { keywords: ['result', 'topper', 'marks', 'pass', 'percentage', 'score'], node: 'toppers' },
  { keywords: ['uniform', 'dress', 'timing', 'time', 'schedule', 'hour', 'when'], node: 'faq_timings' },
  { keywords: ['faq', 'question', 'frequently'], node: 'faq' },
  { keywords: ['icse', 'board', 'cisce'], node: 'faq_icse' },
  { keywords: ['benefit', 'advantage', 'why icse'], node: 'faq_benefits' },
  { keywords: ['food', 'veg', 'vegetarian', 'non-veg', 'meal', 'lunch'], node: 'faq_food' },
  { keywords: ['calendar', 'holiday', 'exam', 'assessment', 'fa', 'sa'], node: 'calendar' },
  { keywords: ['inclusive', 'hearing', 'impair', 'disability', 'special'], node: 'inclusive' },
  { keywords: ['donate', 'donation', 'support', 'contribute'], node: 'donate' },
  { keywords: ['alumni', 'ex-student', 'old student'], node: 'alumni' },
  { keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'], node: 'menu' },
  { keywords: ['menu', 'help', 'start', 'option', 'home', 'back', 'main'], node: 'menu' },
  { keywords: ['thanks', 'thank', 'bye', 'ok', 'great', 'nice', 'cool'], node: '_thanks' },
  { keywords: ['human', 'person', 'talk', 'agent', 'call', 'speak'], node: 'contact' },
];

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
//  UI ENGINE
// ──────────────────────────────────────────────

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let currentSchool = null;
let currentTree = null;


/* =============== SAFE STORAGE & SESSION =============== */
let SESSION = { navStack: [], pendingOverflows: [] };
let chatOpen = false;

const SafeStorage = {
    mem: {},
    setItem: function(k, v) { try { localStorage.setItem(k, v); } catch(e) { this.mem[k] = v; } },
    getItem: function(k) { try { return localStorage.getItem(k) || this.mem[k]; } catch(e) { return this.mem[k]; } },
    removeItem: function(k) { try { localStorage.removeItem(k); } catch(e) { delete this.mem[k]; } }
};

function saveState() {
    if (!currentSchool) return;
    SafeStorage.setItem(currentSchool.id + '_chat_html', chatContainer.innerHTML);
    SafeStorage.setItem(currentSchool.id + '_chat_time', Date.now().toString());
    SafeStorage.setItem(currentSchool.id + '_navStack', JSON.stringify(SESSION.navStack));
}

const msgObserver = new MutationObserver(() => saveState());



const chatWidget = $('#chatWidget');
const chatLauncher = $('#chatLauncher');
const closeChatBtn = $('#closeChatBtn');
const chatContainer = $('#chatContainer');
const chatBody = $('#chatBody');
const chatInput = $('#chatInput');
const sendBtn = $('#sendBtn');
const clearChatBtn = $('#clearChatBtn');
const chatSchoolName = $('#chatSchoolName');
const bgGradient = $('#bgGradient');

// ── Set accent colors ──
function setAccent(school) {
  const root = document.documentElement;
  root.style.setProperty('--accent', school.accent);
  root.style.setProperty('--accent-glow', school.accentGlow);
  root.style.setProperty('--accent-gradient', school.gradient);
}

// ── Open chat ──
function openChat(schoolId) {
  currentSchool = SCHOOLS[schoolId];
  currentTree = buildTree(currentSchool);
  setAccent(currentSchool);
  chatSchoolName.textContent = currentSchool.name;
  chatContainer.innerHTML = '';

  // Restore State
  const time = SafeStorage.getItem(schoolId + '_chat_time');
  let savedHtml = null;
  // 2 hours expiry
  if (time && (Date.now() - parseInt(time) > 7200000)) {
      SafeStorage.removeItem(schoolId + '_chat_html');
      SafeStorage.removeItem(schoolId + '_chat_time');
      SafeStorage.removeItem(schoolId + '_navStack');
  } else {
      savedHtml = SafeStorage.getItem(schoolId + '_chat_html');
      try {
          const savedNav = SafeStorage.getItem(schoolId + '_navStack');
          if (savedNav) SESSION.navStack = JSON.parse(savedNav);
      } catch(e){}
  }

  msgObserver.observe(chatContainer, { childList: true, subtree: true });

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
      return;
  }

  chatWidget.classList.add('active');

  // Send welcome after brief delay
  setTimeout(() => {
    const hs = document.getElementById('rvghs-hero-screen');
    if (hs) hs.classList.add('fade-out');
    sendBotMessage('welcome');
  }, 3000);
}

// ── Close chat ──
function closeChat() {
  chatWidget.classList.remove('active');
}

// ── Format message text ──
function formatText(text) {
  // Bold: *text*
  let formatted = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  
  // Markdown links: [Text](URL)
  formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #007bff; text-decoration: none; font-weight: 500;">$1</a>');

  // Bare links (fallback for any remaining physical links not inside markdown or href)
  formatted = formatted.replace(/(^|[^"'])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener" style="color: #007bff; text-decoration: none; font-weight: 500;">$2</a>');

  // Newlines
  formatted = formatted.replace(/\n/g, '<br>');
  return formatted;
}

// ── Create message element ──
function createMessage(text, type, isSuccess = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;

  if (type === 'bot') {
    const avatar = document.createElement('div');
    const img = document.createElement('img');
    img.alt = 'Bot';
    
    if (isSuccess) {
      avatar.className = 'avatar';
      img.src = 'mascot_success_v2.png';
      img.className = 'full-body-avatar';
      // Revert back to normal avatar after a few seconds
      setTimeout(() => {
        img.src = 'mascot_v2.png';
        img.className = 'full-body-avatar';
      }, 2500);
    } else {
      avatar.className = 'avatar';
      img.src = 'mascot_v2.png';
      img.className = 'full-body-avatar';
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
  avatar.innerHTML = `<img src="mascot_thinking_v2.png" alt="Thinking" class="full-body-thinking">`;

  const dots = document.createElement('div');
  dots.className = 'dots';
  dots.innerHTML = '<span></span><span></span><span></span>';

  div.appendChild(avatar);
  div.appendChild(dots);
  return div;
}

// ── Add user message ──
function addUserMessage(text) {
  const msg = createMessage(text, 'user');
  chatContainer.appendChild(msg);
  scrollToBottom();
}

// ── Send bot message by node ──

function sendBotMessage(nodeId, isBack = false) {
  const node = currentTree[nodeId];
  if (!node) return;

  // Handle pending Overflows
  if (SESSION.pendingOverflows && SESSION.pendingOverflows.length > 0) {
      const idx = SESSION.pendingOverflows.indexOf(nodeId);
      if (idx !== -1) SESSION.pendingOverflows.splice(idx, 1);
  }

  // Update NavStack
  if (!isBack && nodeId !== 'menu') {
      if (SESSION.navStack.length === 0 || SESSION.navStack[SESSION.navStack.length - 1] !== nodeId) {
          SESSION.navStack.push(nodeId);
          if (SESSION.navStack.length > 10) SESSION.navStack.shift();
      }
  }

  const typing = createTypingIndicator();
  chatContainer.appendChild(typing);
  scrollToBottom();

  const delay = Math.min(400 + node.message.length * 2, 1200);
  setTimeout(() => {
    typing.remove();

    const msg = createMessage(node.message, 'bot', true);
    chatContainer.appendChild(msg);
    logInteraction('bot_message', node.message);

    let options = node.options ? [...node.options] : [];

    // Inject Pending Overflows
    if (SESSION.pendingOverflows && SESSION.pendingOverflows.length > 0) {
        SESSION.pendingOverflows.slice(0, 3).forEach(overflowId => {
            let label = overflowId.charAt(0).toUpperCase() + overflowId.slice(1);
            options.push({ label: '👉 Also answer: ' + label, node: overflowId });
        });
    }

    // Inject Back Button if navigating deep
    if (!isBack && SESSION.navStack.length > 1 && nodeId !== 'menu') {
        options.push({ label: '⬅️ Back', node: '_back' });
    }

    if (options.length > 0) {
      const qr = createQuickReplies(options);
      chatContainer.appendChild(qr);
    } else {
      // If it's a terminal node (no options), add Feedback buttons
      const fb = document.createElement('div');
      fb.className = 'feedback-btns';
      fb.style.cssText = 'display:flex; gap:10px; padding: 10px 16px; margin-top: -10px; margin-bottom: 15px;';
      fb.innerHTML = `
          <span style="font-size:12px; color:var(--text-light); margin-right:5px; align-self:center;">Helpful?</span>
          <button style="background:transparent; border:1px solid var(--border-color); border-radius:15px; padding:4px 10px; cursor:pointer;" onclick="logInteraction('feedback', 'positive'); this.parentElement.innerHTML='<span style=\'font-size:12px; color:var(--text-light);\'>Thanks for the feedback! ✅</span>'">👍</button>
          <button style="background:transparent; border:1px solid var(--border-color); border-radius:15px; padding:4px 10px; cursor:pointer;" onclick="logInteraction('feedback', 'negative'); this.parentElement.innerHTML='<span style=\'font-size:12px; color:var(--text-light);\'>Thanks for the feedback! ❌</span>'">👎</button>
      `;
      chatContainer.appendChild(fb);
    }

    scrollToBottom();
  }, delay);
}


// ── Scroll to bottom ──
function scrollToBottom() {
  requestAnimationFrame(() => {
    chatBody.scrollTo({
      top: chatBody.scrollHeight,
      behavior: 'smooth',
    });
  });
}

// ── Handle free-text input ──

function handleInput(forcedText) {
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
      }, 600);
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
        const msg = createMessage(`You're welcome! 😊 Feel free to ask anything else about *${currentSchool.name}*.`, 'bot');
        chatContainer.appendChild(msg);
        const qr = createQuickReplies([{ label: '← Back to Menu', node: 'menu' }]);
        chatContainer.appendChild(qr);
        scrollToBottom();
      }, 600);
    } else if (matchedNode) {
      sendBotMessage(matchedNode);
    } else {
      const typing = createTypingIndicator();
      chatContainer.appendChild(typing);
      scrollToBottom();
      setTimeout(() => {
        typing.remove();
        const fallbackMsg = createMessage(
          `❓ I didn't quite understand that. Here are some things I can help with:`,
          'bot'
        );
        chatContainer.appendChild(fallbackMsg);
        const fallbackOptions = [
          { label: '📚 Admissions', node: 'admissions' },
          { label: '💰 Fees', node: 'fees' },
          { label: '📞 Contact', node: 'contact' },
          { label: '🏫 About', node: 'about' },
          { label: '🏗️ Facilities', node: 'facilities' },
        ];
        if (currentSchool.id === 'rvps') fallbackOptions.push({ label: '🚌 Transport', node: 'transport' });
        if (currentSchool.id === 'rvghs') fallbackOptions.push({ label: '🍱 Meals', node: 'midday' });
        const qr = createQuickReplies(fallbackOptions);
        chatContainer.appendChild(qr);
        scrollToBottom();
      }, 600);
    }
  }, 300);
}



// ──────────────────────────────────────────────
//  EVENT LISTENERS
// ──────────────────────────────────────────────

// School card clicks
$$('.school-card').forEach(card => {
  card.addEventListener('click', () => {
    const schoolId = card.dataset.school;
    openChat(schoolId);
  });
});


// Chat launcher clicks
if (chatLauncher) {
  chatLauncher.addEventListener('click', () => {
    const mascotImg = document.getElementById('launcherMascotImg');
    if (chatWidget.classList.contains('active')) {
      // If it's already open, close it
      chatWidget.classList.remove('active');
    } else if (mascotImg) {
      // If closed, show thinking animation then open
      mascotImg.src = 'mascot_thinking_v2.png';
      mascotImg.classList.add('thinking-zoom');
      setTimeout(() => {
        mascotImg.src = 'mascot_v2.png';
        mascotImg.classList.remove('thinking-zoom');
        if (!currentSchool) openChat('rvghs');
        else chatWidget.classList.add('active');
      }, 500);
    } else {
      // Fallback if no mascot image found
      if (!currentSchool) openChat('rvghs');
      else chatWidget.classList.add('active');
    }
  });
}

// Close chat button clicks
if (closeChatBtn) {
  closeChatBtn.addEventListener('click', () => {
    chatWidget.classList.remove('active');
  });
}


// Clear chat
clearChatBtn.addEventListener('click', () => {
  if (currentTree) {
    chatContainer.innerHTML = '';
    const hs = document.getElementById('rvghs-hero-screen');
    if (hs) hs.classList.remove('fade-out');
    SESSION.navStack = [];
    SESSION.pendingOverflows = [];
    SafeStorage.removeItem(currentSchool.id + '_chat_html');
    setTimeout(() => {
      if (hs) hs.classList.add('fade-out');
      sendBotMessage('welcome');
    }, 3000);
  }
});

// Send button
sendBtn.addEventListener('click', handleInput);

// Enter key
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleInput();
  }
});

// Keyboard shortcut: Escape to go back
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && chatWidget.classList.contains('active')) {
    closeChat();
  }
});


// TYPEAHEAD SUGGESTIONS
const typeahead = document.getElementById('typeahead');
const POPULAR_QUERIES = [
    "Tell me about the admissions",
    "Who is the principal?",
    "Do you have school buses?",
    "Is there a mid-day meal?",
    "What is the address?"
];

if (chatInput) {
    chatInput.addEventListener('input', (e) => {
        if (!typeahead) return;
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
}
document.addEventListener('click', (e) => {
    if (typeahead && !typeahead.contains(e.target) && e.target !== chatInput) typeahead.classList.add('hidden');
});

// VOICE RECOGNITION
const micBtn = document.getElementById('micBtn');
let recognition;
if (('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && micBtn) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onstart = () => {
        micBtn.classList.add('recording');
        chatInput.placeholder = "Listening... 🎤";
    };
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        setTimeout(() => handleInput(transcript), 500);
    };
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        micBtn.classList.remove('recording');
        chatInput.placeholder = "Type a message…";
    };
    recognition.onend = () => {
        micBtn.classList.remove('recording');
        chatInput.placeholder = "Type a message…";
    };
    micBtn.addEventListener('click', () => {
        if (micBtn.classList.contains('recording')) recognition.stop();
        else {
            try { recognition.start(); } catch(e){}
        }
    });
} else if (micBtn) {
    micBtn.style.display = 'none'; // Not supported
}

// QUICK SUGGESTIONS
document.querySelectorAll('.suggestion-chip').forEach(c => c.addEventListener('click', () => {
    handleInput(c.dataset.query);
}));


// ── Initialize Chatbot ──
document.addEventListener('DOMContentLoaded', () => {
    openChat('rvghs');
});

