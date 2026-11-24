/**
 * Siyanat - Operations | Miqaat Module (Modular External Script)
 * Seamlessly integrates with index.html via window.SiyanatMiqaatBridge.
 * Shares Firebase RTDB persistence (portalData/miqaat), Auth session,
 * Admin Access Control permissions, Tailwind CSS, FontAwesome, Chart.js & SheetJS.
 */
(function () {
    'use strict';

    const HIJRI_YEARS = ['1447', '1448', '1449', '1450', '1451', '1452', '1453', '1454', '1455'];
    const DEFAULT_HIJRI_YEAR = '1448';

    const CHECKLIST_STATUSES = ['Not Started', 'In Progress', 'Follow-up', 'Completed'];
    const CHECKLIST_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
    const DEFAULT_BUDGET_CATEGORIES = [
        'HR',
        'Decor & Lighting',
        'Furnishings',
        'Lifts',
        'Housekeeping & Bukhoor',
        'Staging & Outdoor setup',
        'Sadaat Kiraam Offices',
        'Laundry',
        'Transport',
        'Garbage Disposal',
        'Olda Rooms'
    ];

    // =========================================================================
    // SEED DATA (Transcribed verbatim from provided Reference Images)
    // =========================================================================

    function getSeedVenues() {
        return {
            male: [
                { id: 'vm_1', name: 'Masjid al-Zahra Ground Floor', studentCount: 0 },
                { id: 'vm_2', name: 'al-Iwan al- Taheri Ground Floor', studentCount: 0 },
                { id: 'vm_3', name: 'Mahad al-Zahra 3rd Floor - Inner Qaat', studentCount: 0 },
                { id: 'vm_4', name: 'Library 3rd Floor', studentCount: 0 }
            ],
            female: [
                { id: 'vf_1', name: 'Masjid al-Zahra First Floor', studentCount: 0 },
                { id: 'vf_2', name: 'al-Iwan al- Taheri First Floor', studentCount: 0 },
                { id: 'vf_3', name: 'Saalat al-Zahab', studentCount: 0 },
                { id: 'vf_4', name: 'Library 2nd Floor', studentCount: 0 },
                { id: 'vf_5', name: 'Mahad al-Zahra 4th Floor - Inner Qaat', studentCount: 0 }
            ]
        };
    }

    function getSeedChecklist() {
        const rows = [
            [1, 'Parda / Curtains', 'Plastic Parda additional', 'Abduttayeb Hotelwala', 'Team', '10 Nos', 'Not Started', 'Medium'],
            [2, 'Seating & Furniture', 'Procurement of Chairs without handles', 'Mustaali Lohawala', 'Huzaifa Rampurawala', '100 Nos', 'Not Started', 'High'],
            [3, 'Seating & Furniture', 'Procurement of Chairs with handles', 'Mustaali Lohawala', 'Huzaifa Rampurawala', '50 Nos', 'Not Started', 'High'],
            [4, 'Seating & Furniture', 'Conference Chairs arrangement', 'Mustaali Lohawala', 'Huzaifa Rampurawala', '30 Nos', 'Not Started', 'High'],
            [5, 'Seating & Furniture', 'SS Foldable Table repair', 'Abduttayeb Hotelwala', 'Yusuf Moiyedi', 'Foldable SS unit', 'Not Started', 'Medium'],
            [6, 'Seating & Furniture', 'Patla SS follow-up', 'Taher Nomani', 'Yusuf Bhai Savai', '1 week timeline', 'Not Started', 'High'],
            [7, 'Stage & Mandap', 'Bab Zuwaila Events: Fountain / waterfall stage, foam & cover', 'Mustaali Lohawala', 'Event Team', 'Stage, foam & cover', 'Not Started', 'High'],
            [8, 'Stage & Mandap', 'Busaheba stage, cover & new chair setup', 'Mustaali Lohawala', 'Huzaifa Rampurawala', 'Stage, cover & new chair', 'Not Started', 'High'],
            [9, 'Stage & Mandap', 'Mandap tables for Tashreef (Purchase before Imtehaan)', 'Mustaali Lohawala', 'Purchasing Team', 'Tashreef tables', 'Not Started', 'High'],
            [10, 'Stage & Mandap', 'Stage covers new', 'Taher Nomani', '', '2ft / 4ft', 'Not Started', 'Medium'],
            [11, 'Stage & Mandap', 'SS Table cover color selection & matching', 'Abduttayeb Hotelwala', 'Taher Nomani', 'Color check & fit', 'Not Started', 'Medium'],
            [12, 'Partition & VIP', 'Dignitaries / Mulaqaat partition setup', 'Abduttayeb Hotelwala', 'Murtaza Kheraluwala, Huzaifa Rampurawala', 'Partition panels', 'Not Started', 'High'],
            [13, 'Flooring & Carpets', 'Tehriri Imtehaan: Jazam layout', 'Murtaza Kheraluwala', 'Mustaali Lohawala', 'Exam hall coverage', 'Not Started', 'High'],
            [14, 'Flooring & Carpets', 'Tehriri Imtehaan: Sujni & Towels setup', 'Mustaali Lohawala', '', '', 'Not Started', 'High'],
            [15, 'Flooring & Carpets', 'Tehriri Imtehaan: Runners placement', 'Mustaali Lohawala', '', '', 'Not Started', 'High'],
            [16, 'Flooring & Carpets', 'Terrace Ziyafat Jazam setup', 'Mustaali Lohawala', 'Murtaza Kheraluwala, Huzaifa Rampurawala', 'Terrace dining area', 'Not Started', 'High'],
            [17, 'Flooring & Carpets', 'Shz Taha BS – Wajebaat Bethak Jazam setup', 'Mustaali Lohawala', 'Murtaza Kheraluwala', 'Bethak room coverage', 'Not Started', 'High'],
            [18, 'Flooring & Carpets', 'Lift galicha cleaning & readiness (verify size for Qasar)', 'Mustaali Lohawala', 'Logistics Team', 'Lift carpet (size check)', 'Not Started', 'Medium'],
            [19, 'Religious & Ritual', 'Quran Sipara cleaning (complete before Urus of Qutbuddin Shaheed Aqa)', 'Abduttayeb Hotelwala', '', 'All Siparas', 'In Progress', 'Urgent'],
            [20, 'Religious & Ritual', 'Masallah arrangement for Sadaat Kiram', 'Abduttayeb Hotelwala', 'Huzaifa Kothawala', '5 Nos', 'Not Started', 'High'],
            [21, 'Religious & Ritual', 'Red Kapda for Aqiqa', 'Abduttayeb Hotelwala', '', '2 Nos', 'Not Started', 'Medium'],
            [22, 'Fragrance & Bukhoor', 'Bukhoor: Coal procurement & follow-up', 'Abduttayeb Hotelwala', 'Murtaza Kheraluwala', 'Coal supply', 'Follow-up', 'High'],
            [23, 'Fragrance & Bukhoor', 'Bukhoor: Agarwood arrangement', 'Abduttayeb Hotelwala', 'Huzaifa Rampurawala', 'Agarwood supply', 'Not Started', 'High'],
            [24, 'Fragrance & Bukhoor', 'Bukhoor: Burner operation & execution supervision', 'Murtaza Rampurawala', 'Murtaza Kheraluwala', 'Event session coverage', 'Not Started', 'High'],
            [25, 'Fragrance & Bukhoor', 'Aroma diffuser installation (50% – purchase before Imtehaan)', 'Mustaali Lohawala', 'Procurement Team', '50% Aroma diffuser', 'Not Started', 'Medium'],
            [26, 'Audio/Visual & Clock', 'Ali Waliyullah frame in Ewaan (Badshah) – shift clock after Urus', 'Taher Nomani', 'Facility Team', '1 Frame & clock shift', 'Not Started', 'Low'],
            [27, 'Audio/Visual & Clock', 'Wall clocks over TV in Ewaan', 'Taher Nomani', 'Huzaifa Rampurawala', '2 Clocks', 'Follow-up', 'Medium'],
            [28, 'Audio/Visual & Tech', 'AC control configuration via iPad', 'Abduttayeb Hotelwala', '', 'iPad control setup', 'Not Started', 'Medium'],
            [29, 'Pentagon tasks', 'Maintenance, amenities etc.', 'Huzaifa Kothawala', 'Huzaifa Rampurawala', '', 'Follow-up', 'High']
        ];
        return rows.map((r, idx) => ({
            id: 'chk_' + (idx + 1),
            itemNo: String(r[0]),
            category: r[1],
            description: r[2],
            assigneeName: r[3],
            assigneeEmail: '',
            collaborators: r[4],
            quantitySpecs: r[5],
            status: r[6],
            priority: r[7]
        }));
    }

    function getSeedTehririEvents() {
        return [
            {
                id: 'te_1',
                srNo: '1',
                description: 'Jazam -\nIwan (both floors)\nMasjid (both floors)\nMahad Qaat (both floors - inner & outer)\nLibrary - 2nd & 3rd floor\nReception & Waqfnaama\nWalkaround 4th floor',
                hastak: 'Murtaza Kheraluwala\nMustaali Lohawala\nShabbir Ratlamwala\nArea Manager',
                requirements: '- New Jazam',
                checklist: '- Jazam placement',
                done: false,
                remarks: ''
            },
            {
                id: 'te_1b',
                srNo: '',
                description: 'Ali Waliyullah Banner\nTazyeen help',
                hastak: '',
                requirements: '',
                checklist: 'Ali Waliyullah Banner Frame & installation',
                done: false,
                remarks: ''
            },
            {
                id: 'te_2',
                srNo: '2',
                description: 'Sadar Paath / Sofa\nSadar Sujni & Maula Towel',
                hastak: 'Murtaza Kheraluwala\nShabbir Ratlamwala',
                requirements: '- Sadar paath, gaadi, sujni, Aqa Maula Towel\n- Sofa, side tables, sujni set, Qadam takya',
                checklist: '- Sujnis Wash\n- Towel given for alteration',
                done: false,
                remarks: ''
            },
            {
                id: 'te_3',
                srNo: '3',
                description: 'Patla & Standee at all venues',
                hastak: 'Murtaza Rampurawala\nArea Manager',
                requirements: '- Standee for block names\n- Patla at each venue to be coordinated by each area manager',
                checklist: '- 50 new patlas in process (Yusuf Sawai)',
                done: false,
                remarks: ''
            },
            {
                id: 'te_4',
                srNo: '4',
                description: 'Bukhoor everday on all venues',
                hastak: 'Murtaza Rampurawala\nArea Manager',
                requirements: '- Bukhoor to be done at all venues before imtehan & in Iwan during imtehan also\n- Bukhoor in Maula pathway through all venues',
                checklist: '- Agar Lakri\n- Bukhoor\n- Extra coal',
                done: false,
                remarks: ''
            },
            {
                id: 'te_5',
                srNo: '5',
                description: 'Table & Chair (for medical requirement)',
                hastak: 'Mustaali Lohawala\nArea Manager',
                requirements: '',
                checklist: '',
                done: true,
                remarks: ''
            },
            {
                id: 'te_6',
                srNo: '6',
                description: 'Mahal al-Shifa Counter (Corridor 3rd Floor, Corridor 4th Floor)',
                hastak: 'Mustaali Lohawala\nArea Manager',
                requirements: '',
                checklist: '- Mandap Tables (3 pcs)',
                done: false,
                remarks: ''
            },
            {
                id: 'te_7',
                srNo: '7',
                description: 'Q Managers for AVIT Setup',
                hastak: 'Mustaali Lohawala\nArea Manager',
                requirements: '',
                checklist: '',
                done: true,
                remarks: ''
            },
            {
                id: 'te_8',
                srNo: '8',
                description: 'Majhudaat Setup in Walkaround',
                hastak: 'Huzefa Rampurawala\nTaher Nomani\nAli Vapiwala',
                requirements: '- Mandap Tables, Softboard',
                checklist: '- Mandap Tables (8 - 10 pcs)',
                done: false,
                remarks: ''
            },
            {
                id: 'te_9',
                srNo: '9',
                description: 'Paper checking rooms Set-up on 6th Floor',
                hastak: 'Murtaza Kheraluwala\nMohd Cyclewala',
                requirements: '- Class Tables & chairs rearrange, class curtains & additional SS curtains\n- 6 Mandap tables for snacks',
                checklist: '- Mandap Tables (6 pcs)\n- Plastic curtains',
                done: false,
                remarks: ''
            },
            {
                id: 'te_10',
                srNo: '10',
                description: 'Aqa Maula TUS muaina during imtehaan',
                hastak: 'Huzefa Rampurawala\nMurtaza Kheraluwala\nArea Manager',
                requirements: '- Runners (as per pathway)\n- Softboard for backdrop in Iwan\n- Mandap Tables for tashreef in Octagon Staircase 2 - 3rd floor\n- Bukhoor\n- Lifts galicha',
                checklist: '- Mandap Tables (10 - 12 pcs)',
                done: false,
                remarks: ''
            }
        ];
    }

    function getSeedOtherEvents() {
        return [
            {
                id: 'oe_1',
                srNo: '1',
                description: 'Magrib Isha / Fajr Namaaz',
                hastak: 'Murtaza Kheraluwala\nMustaali Lohawala\nShabbir Ratlamwala',
                requirements: '- White Runners, Red runners\n- Qibla gaadi & sujni\n- Qibla parda\n- Bukhoor\n- Baricade at points of deedar\n- Salaami Towel',
                checklist: '- Sujnis & Parda wash',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_2',
                srNo: '2',
                description: 'Urus Raat & Qasida tilawat',
                hastak: 'Murtaza Kheraluwala\nMustaali Lohawala\nShabbir Ratlamwala',
                requirements: '- Saadaat Siparah (Hind version)\n- General Siparah',
                checklist: '- Siparah cover cleaning',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_3',
                srNo: '3',
                description: 'Iwan Terrace Pargola Ziyafat',
                hastak: 'Huzefa Rampurawala\nHuzefa Kothawala\nShabbir Ratlamwala',
                requirements: '- Jazam bichaat\n- Bethak, Gaadi, Sujni set, sujni runners\n- Carpet runners\n- Parda for privacy, extra lighting\n- SS Table for shifa\n- Extra jazam bichaat for deedar pass holders',
                checklist: '- Jazam bichaat\n- Parda',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_4',
                srNo: '4',
                description: 'Hostel terrace Ziyafat',
                hastak: 'Huzefa Rampurawala\nYusuf Manasawala',
                requirements: '- Jazam bichaat\n- Bethak, Gaadi, Sujni set, sujni runners\n- Carpet runners\n- Parda for privacy, extra lighting\n- SS Table for shifa\n- Extra jazam bichaat for deedar pass holders',
                checklist: '',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_5',
                srNo: '5',
                description: 'Olda Zafaf Rooms',
                hastak: 'Huzefa Rampurawala\nTaher Nomani\nSakina Unwala',
                requirements: '- Jazam bichaat\n- Bed\n- Side Table\n- Bedsheet & Quilt Set\n- Flower decor\n- Aqa Maula Sofa & Side table\n- Red Runners',
                checklist: '- All Olda rooms essentials to be checked (Taher Nomani & Sakina Unwala)',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_6',
                srNo: '6',
                description: 'Vajebaat Bethak at Bab Zuwaila',
                hastak: 'Huzefa Rampurawala\nMustafa Attarwala',
                requirements: '- Main Stage (Zohair icecreamwala)\n- Waterfall covering stage\n- Sofa & Sidetable, Sujni set\n- Red carpet from Hasanat to Bab Zuwaila steps\n- Canopy\n- Barricades * 5\n- Q Managers\n- Chair & Sujni for Sadaat\n- Shzd Taha bs setup near Octagonal staircase 1\n- Red Runners',
                checklist: '- Reception waterfall stage, foam & cover\n- Red carpet\n- Canopy (2 pcs)\n- Shzd Taha bs setup jazam',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_7',
                srNo: '7',
                description: 'Dignitaries Visit in Mawaid 1st Floor',
                hastak: 'Huzefa Rampurawala\nAli Vapiwala',
                requirements: '- Jazam Bichaat\n- Aqa Maula Sofa & side table\n- Mulaqaat sujni set\n- Audi chairs for guests\n- Golden sujni runners as needed\n- Parda\n- SS Table for hadaya\n- Bukhoor',
                checklist: '- Jazam centerpiece\n- Partition ideas & setup',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_8',
                srNo: '8',
                description: 'Aqiqa at Bab Zuwaila',
                hastak: 'Huzefa Rampurawala\nShabbir Ratlamwala',
                requirements: '- Stage with steps\n- Aqa Maula Sofa & side table\n- Sofa sujni set\n- Aqiqa requirements (takyo with red kapru, safra with plastic, 2 bowls, sukhar, hot water)',
                checklist: '- Stage cover\n- Red kapru',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_9',
                srNo: '9',
                description: 'Busaheba Pannat program',
                hastak: 'Huzefa Rampurawala\nShabbir Ratlamwala',
                requirements: '',
                checklist: '',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_10',
                srNo: '10',
                description: 'Busheba interaction with Talebaat',
                hastak: 'Huzefa Rampurawala\nMohd Cyclewala',
                requirements: '- Busaheba stage\n- Chair & side table\n- Sujni set & sujni runners (from Munira ben Saeid)',
                checklist: '- Busaheba stage, foam & cover\n- Busaheba chair',
                done: false,
                remarks: ''
            },
            {
                id: 'oe_11',
                srNo: '11',
                description: 'Quran Haflat or other program in Iwan',
                hastak: 'Huzefa Rampurawala\nShabbir Ratlamwala',
                requirements: '- Centerpiece jazam\n- Sujni runners\n- Stage',
                checklist: '- Stage covers\n- Steps\n- Jazam centerpiece',
                done: false,
                remarks: ''
            }
        ];
    }

    const LAST_YEAR_1447H_PROGRAMS = [
        {
            hijriDate: '6 Rajab',
            englishDate: '25 December',
            day: 'Thursday',
            routeProgram: '1 Aqiqa at Bab Zuwaila',
            dignitaryVisit: '',
            nightProgram: '- Urs Raat & Qasida Tilawat\n- 3 Olda Zafaf in Rabvat\n- Iwan Terrace Ziyafat + Nikah',
            marolProg: '1 Hour'
        },
        {
            hijriDate: '7 Rajab',
            englishDate: '26 December',
            day: 'Friday',
            routeProgram: '2 Aqiqa in Mawaid Ground floor',
            dignitaryVisit: '',
            nightProgram: '- Vajebaat Bethak at Bab Zuwaila\n- Talebaat Program in Iwan (Aqa Moula tus in gurfah mubarak)\n- 3 Olda Zafaf in Rabvat',
            marolProg: '45 mins'
        },
        {
            hijriDate: '8 Rajab',
            englishDate: '27 December',
            day: 'Saturday',
            routeProgram: '1 Aqiqa in Mawaid Ground floor\n\nExit towards Hasanaat',
            dignitaryVisit: 'Before Imtehaan Route in Talebaat Mawaid (Misr Embassy & Smriti Irani)',
            nightProgram: '- Busaheba Pannat in Saalat al-Zahab\n- 3 Olda Zafaf in Rabvat',
            marolProg: '1.5 hrs'
        },
        {
            hijriDate: '9 Rajab',
            englishDate: '28 December',
            day: 'Sunday',
            routeProgram: '',
            dignitaryVisit: 'Before Imtehaan Route in Talebaat Mawaid (Lawyers)',
            nightProgram: '- Busaheba interaction with Talebaat in Zawaya\n- Majma Markazi Program in Iwan (Aqa Maula in gurfa) : Dikriyo salaam in Rabvat passage; Dikrao salaam in inner qaat\n- 3 Olda Zafaf in Rabvat',
            marolProg: '1 hour'
        },
        {
            hijriDate: '10 Rajab',
            englishDate: '29 December',
            day: 'Monday',
            routeProgram: '- QA - Quran Tilawat near Gurfah entrance\n- Hasanat farzando\n- Quran tilawat in Waqfnaama\n- 1 Aqiqa at Bab Zuwaila',
            dignitaryVisit: 'Before Imtehaan Route in Talebaat Mawaid (Hiranandani)',
            nightProgram: '- Projection Mapping in Courtyard\n- 3 Olda Zafaf in Rabvat\n- Iwan Terrace Ziyafat',
            marolProg: '30 mins'
        },
        {
            hijriDate: '11 Rajab',
            englishDate: '30 December',
            day: 'Tuesday',
            routeProgram: '',
            dignitaryVisit: 'Before Imtehaan Route in Talebaat Mawaid (Oman Consuate)',
            nightProgram: '- Quran Haflat in Mahad Qaat (dikriyo) & Iwan (dikrao) (Before Magrib)\n- Hadi Ashar Ziyafat Hadaya Display in Saalat al-Zahab\n- 6 Olda Zafaf in Rabvat (5th floor & 12th floor)\n- Hostel Terrace Ziyafat + Nikah',
            marolProg: '30 mins'
        },
        {
            hijriDate: '12 Rajab',
            englishDate: '31 December',
            day: 'Wednesday',
            routeProgram: '',
            dignitaryVisit: '',
            nightProgram: '',
            marolProg: ''
        }
    ];

    function createDefaultYearBucket(year) {
        const isDefaultYear = String(year) === DEFAULT_HIJRI_YEAR;
        return {
            venues: getSeedVenues(),
            timetable: [],
            checklist: isDefaultYear ? getSeedChecklist() : [],
            eventsTehriri: isDefaultYear ? getSeedTehririEvents() : [],
            eventsOther: isDefaultYear ? getSeedOtherEvents() : [],
            budget: [],
            dailyEvents: []
        };
    }

    // =========================================================================
    // STATE & BRIDGE HELPERS
    // =========================================================================

    let selectedHijriYear = DEFAULT_HIJRI_YEAR;
    let activeSubTab = 'dashboard'; // 'dashboard' | 'checklist' | 'events-details' | 'budget' | 'daily-events'
    let checklistSearch = '';
    let checklistStatusFilter = '';
    let checklistPriorityFilter = '';
    let eventsDetailsSearch = '';
    let budgetSearch = '';
    let budgetCategoryFilter = '';
    let budgetAnalysisChartInstance = null;
    let budgetAnalysisChartType = 'bar';
    let lastYearModalMode = '1447h'; // '1447h' | 'prev-year'
    let fullBudgetDraftRows = [];
    let isUiMounted = false;

    function getBridge() {
        return window.SiyanatMiqaatBridge || null;
    }

    function isViewOnly() {
        const b = getBridge();
        return b && typeof b.isViewOnly === 'function' ? Boolean(b.isViewOnly()) : false;
    }

    function showToast(msg, isError = false) {
        const b = getBridge();
        if (b && typeof b.showToast === 'function') {
            b.showToast(msg, isError);
        } else {
            console.log(isError ? '[Miqaat Error]' : '[Miqaat]', msg);
        }
    }

    function getAllData() {
        const b = getBridge();
        let data = b && typeof b.getData === 'function' ? b.getData() : null;
        if (!data || typeof data !== 'object') data = {};
        if (!data.years || typeof data.years !== 'object') data.years = {};
        if (!data.years[selectedHijriYear]) {
            data.years[selectedHijriYear] = createDefaultYearBucket(selectedHijriYear);
        } else {
            const yr = data.years[selectedHijriYear];
            if (!yr.venues || typeof yr.venues !== 'object') yr.venues = getSeedVenues();
            if (!Array.isArray(yr.venues.male)) yr.venues.male = [];
            if (!Array.isArray(yr.venues.female)) yr.venues.female = [];
            if (!Array.isArray(yr.timetable)) yr.timetable = [];
            if (!Array.isArray(yr.checklist)) yr.checklist = [];
            if (!Array.isArray(yr.eventsTehriri)) yr.eventsTehriri = [];
            if (!Array.isArray(yr.eventsOther)) yr.eventsOther = [];
            if (!Array.isArray(yr.budget)) yr.budget = [];
            if (!Array.isArray(yr.dailyEvents)) yr.dailyEvents = [];
        }
        return data;
    }

    function getYearData(year = selectedHijriYear) {
        const data = getAllData();
        if (!data.years[year]) {
            data.years[year] = createDefaultYearBucket(year);
        }
        return data.years[year];
    }

    async function persistData(toastMsg = '') {
        if (isViewOnly()) {
            showToast('View Only mode: You do not have editing rights for Miqaat.', true);
            return false;
        }
        const b = getBridge();
        const data = getAllData();
        if (b && typeof b.saveData === 'function') {
            await b.saveData(data);
        }
        if (toastMsg) showToast(toastMsg);
        return true;
    }

    function getAuthorizedUsers() {
        const b = getBridge();
        const rawUsers = b && typeof b.getUsersList === 'function' ? (b.getUsersList() || []) : [];
        return rawUsers
            .filter(u => {
                if (!u || !u.email) return false;
                if (u.role === 'Admin') return true;
                return Array.isArray(u.allowedModules) && u.allowedModules.includes('miqaat');
            })
            .map(u => ({
                name: (u.name || '').trim() || formatNameFromEmail(u.email),
                email: String(u.email).trim().toLowerCase(),
                role: u.role || 'User'
            }));
    }

    function getCurrentUserInfo() {
        const b = getBridge();
        const cur = b && typeof b.getCurrentUser === 'function' ? b.getCurrentUser() : null;
        if (!cur || !cur.email) return { name: '', email: '' };
        const email = String(cur.email).trim().toLowerCase();
        const matched = getAuthorizedUsers().find(u => u.email === email);
        return {
            name: matched ? matched.name : ((cur.displayName || '').trim() || formatNameFromEmail(email)),
            email
        };
    }

    function formatNameFromEmail(email) {
        const local = String(email || '').split('@')[0];
        return local
            .split(/[._-]+/)
            .filter(Boolean)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    }

    function escapeHtml(val) {
        return String(val === undefined || val === null ? '' : val)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function nl2br(val) {
        return escapeHtml(val).replace(/\n/g, '<br>');
    }

    function genId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    }

    function formatINR(num) {
        const n = Number(num) || 0;
        return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    }

    function getLocalDateIso(offsetDays = 0) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + offsetDays);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function formatDisplayDate(isoStr) {
        if (!isoStr) return '—';
        const parts = String(isoStr).split('-');
        if (parts.length !== 3) return isoStr;
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (isNaN(d.getTime())) return isoStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
    }

    function getDayNameFromIso(isoStr) {
        if (!isoStr) return '';
        const parts = String(isoStr).split('-');
        if (parts.length !== 3) return '';
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        if (isNaN(d.getTime())) return '';
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
    }

    function normalizeNameKey(str) {
        return String(str || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }

    function matchTaskToUser(task, authUsers) {
        const taskEmail = String(task.assigneeEmail || '').trim().toLowerCase();
        if (taskEmail) {
            const byEmail = authUsers.find(u => u.email === taskEmail);
            if (byEmail) return byEmail.email;
        }
        const taskName = normalizeNameKey(task.assigneeName);
        if (taskName) {
            const exact = authUsers.find(u => normalizeNameKey(u.name) === taskName);
            if (exact) return exact.email;
            const partial = authUsers.find(u => {
                const uName = normalizeNameKey(u.name);
                return uName && (uName.includes(taskName) || taskName.includes(uName));
            });
            if (partial) return partial.email;
        }
        return '__unassigned__';
    }

    // =========================================================================
    // STYLES & STATIC SHELL MOUNTING
    // =========================================================================

    function injectMiqaatStyles() {
        if (document.getElementById('miqaat-module-styles')) return;
        const style = document.createElement('style');
        style.id = 'miqaat-module-styles';
        style.textContent = `
            @keyframes miqaatFlashGlow {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.55), 0 10px 25px -5px rgba(220, 38, 38, 0.25);
                    border-color: #f59e0b;
                }
                50% {
                    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.28), 0 14px 30px -5px rgba(245, 158, 11, 0.45);
                    border-color: #ef4444;
                }
            }
            .miqaat-flash-banner {
                animation: miqaatFlashGlow 1.9s ease-in-out infinite;
            }
            .miqaat-subtab-btn.active {
                background-color: #065f46;
                color: #ffffff;
                border-color: #064e3b;
                box-shadow: 0 2px 6px rgba(6, 95, 70, 0.25);
            }
            .miqaat-subtab-btn:not(.active) {
                background-color: #ffffff;
                color: #065f46;
                border-color: #d1fae5;
            }
            .miqaat-subtab-btn:not(.active):hover {
                background-color: #ecfdf5;
                border-color: #6ee7b7;
            }
            .miqaat-excel-grid input,
            .miqaat-excel-grid select {
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                padding: 5px 7px;
                font-size: 12px;
                width: 100%;
                background: #ffffff;
            }
            .miqaat-excel-grid input:focus,
            .miqaat-excel-grid select:focus {
                outline: none;
                border-color: #059669;
                box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.2);
                background: #f0fdf4;
            }
            body.view-only-mode .miqaat-edit-only {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    function ensureUiMounted() {
        const container = document.getElementById('module-miqaat');
        if (!container) return false;
        injectMiqaatStyles();

        if (!isUiMounted || !container.querySelector('#miqaatRootShell')) {
            container.innerHTML = `
                <div id="miqaatRootShell" class="space-y-5">
                    <!-- Global Module Header & Hijri Year Filter -->
                    <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-xl shadow-md p-4 sm:p-5 border border-emerald-700">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center shrink-0">
                                    <i class="fa-solid fa-mosque text-amber-300 text-xl"></i>
                                </div>
                                <div>
                                    <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                                        <span>Miqaat Operations</span>
                                        <span id="miqaatHeaderYearPill" class="text-xs font-extrabold bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full shadow-sm">1448H</span>
                                    </h2>
                                    <p class="text-xs sm:text-sm text-emerald-200">Imtehaan Venues, Timetable, Team Checklists, Miqaat Events, Budget &amp; Aqa Maula Daily Events</p>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center gap-2.5">
                                <div class="flex items-center bg-emerald-950/60 border border-emerald-600 rounded-lg px-3 py-1.5">
                                    <label for="miqaatHijriYearSelect" class="text-xs font-bold text-amber-300 uppercase tracking-wider mr-2">
                                        <i class="fa-solid fa-calendar-days mr-1"></i>Hijri Year:
                                    </label>
                                    <select id="miqaatHijriYearSelect" class="bg-emerald-900 text-white text-sm font-extrabold rounded px-2 py-1 border border-emerald-500 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
                                        ${HIJRI_YEARS.map(y => `<option value="${y}" ${y === selectedHijriYear ? 'selected' : ''}>${y}H</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- 5 Sub-Navigation Tabs -->
                        <div class="mt-4 pt-3 border-t border-emerald-700/70 flex flex-wrap gap-2" id="miqaatSubTabsBar">
                            <button type="button" data-subtab="dashboard" class="miqaat-subtab-btn active px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition flex items-center space-x-2">
                                <i class="fa-solid fa-gauge-high"></i>
                                <span>Dashboard</span>
                            </button>
                            <button type="button" data-subtab="checklist" class="miqaat-subtab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition flex items-center space-x-2">
                                <i class="fa-solid fa-list-check"></i>
                                <span>User-based Checklist</span>
                            </button>
                            <button type="button" data-subtab="events-details" class="miqaat-subtab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition flex items-center space-x-2">
                                <i class="fa-solid fa-clipboard-list"></i>
                                <span>Miqaat Events Details</span>
                            </button>
                            <button type="button" data-subtab="budget" class="miqaat-subtab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition flex items-center space-x-2">
                                <i class="fa-solid fa-indian-rupee-sign"></i>
                                <span>Imtehan Budget</span>
                            </button>
                            <button type="button" data-subtab="daily-events" class="miqaat-subtab-btn px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition flex items-center space-x-2">
                                <i class="fa-solid fa-star-and-crescent"></i>
                                <span>Aqa Maula – Daily Events</span>
                            </button>
                        </div>
                    </div>

                    <!-- Dynamic Tab Content Container -->
                    <div id="miqaatTabContent" class="space-y-6"></div>
                </div>
            `;

            // Bind Hijri Year selector
            const yearSel = container.querySelector('#miqaatHijriYearSelect');
            if (yearSel) {
                yearSel.addEventListener('change', (e) => {
                    selectedHijriYear = e.target.value || DEFAULT_HIJRI_YEAR;
                    const pill = document.getElementById('miqaatHeaderYearPill');
                    if (pill) pill.textContent = `${selectedHijriYear}H`;
                    renderActiveTab();
                });
            }

            // Bind Sub-Navigation tabs
            container.querySelectorAll('.miqaat-subtab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    activeSubTab = btn.getAttribute('data-subtab');
                    updateSubTabButtonStyles();
                    renderActiveTab();
                });
            });

            ensureModalsMounted();
            isUiMounted = true;
        }

        return true;
    }

    function updateSubTabButtonStyles() {
        const container = document.getElementById('module-miqaat');
        if (!container) return;
        container.querySelectorAll('.miqaat-subtab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-subtab') === activeSubTab);
        });
    }

    function ensureModalsMounted() {
        if (document.getElementById('miqaatModalsRoot')) return;
        const root = document.createElement('div');
        root.id = 'miqaatModalsRoot';
        root.innerHTML = `
            <!-- Generic Form Modal (Venue / Timetable / Checklist / Event Details / Budget Row / Daily Event) -->
            <div id="miqaatFormModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs hidden z-50 flex items-center justify-center p-3 sm:p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-200">
                    <div class="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between">
                        <h3 id="miqaatFormModalTitle" class="text-base sm:text-lg font-bold flex items-center gap-2"></h3>
                        <button type="button" onclick="window.MiqaatModule.closeModal('miqaatFormModal')" class="text-emerald-200 hover:text-white text-xl leading-none px-2">&times;</button>
                    </div>
                    <form id="miqaatFormModalForm" class="p-5 overflow-y-auto space-y-4">
                        <div id="miqaatFormModalBody" class="space-y-3.5"></div>
                        <div class="pt-3 border-t border-gray-200 flex justify-end gap-2">
                            <button type="button" onclick="window.MiqaatModule.closeModal('miqaatFormModal')" class="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                            <button type="submit" class="px-5 py-2 rounded-lg text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                                <i class="fa-solid fa-floppy-disk mr-1.5"></i>Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Wide Excel-Style Full Budget Editor Modal -->
            <div id="miqaatFullBudgetModal" class="fixed inset-0 bg-black/65 backdrop-blur-xs hidden z-50 flex items-center justify-center p-2 sm:p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden border-2 border-emerald-700">
                    <div class="bg-emerald-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
                                <i class="fa-solid fa-table-cells text-amber-300"></i>
                                <span>Excel-Style Full Budget Editor (<span id="miqaatFullBudgetYearLabel">1448H</span>)</span>
                            </h3>
                            <p class="text-xs text-emerald-200">Edit all cells inline across all rows simultaneously, then click Save All.</p>
                        </div>
                        <button type="button" onclick="window.MiqaatModule.closeModal('miqaatFullBudgetModal')" class="text-emerald-200 hover:text-white text-2xl leading-none px-2">&times;</button>
                    </div>
                    <div class="p-3 sm:p-4 overflow-auto flex-1">
                        <table class="w-full text-xs border-collapse miqaat-excel-grid min-w-[900px]">
                            <thead>
                                <tr class="bg-emerald-50 text-emerald-950 border-y border-emerald-200 text-left">
                                    <th class="p-2 w-14 text-center">Sr No</th>
                                    <th class="p-2 w-52">Category</th>
                                    <th class="p-2 min-w-[220px]">Item Details</th>
                                    <th class="p-2 w-36 text-right">Amount (₹)</th>
                                    <th class="p-2 min-w-[180px]">Rate Details</th>
                                    <th class="p-2 min-w-[160px]">Remarks</th>
                                    <th class="p-2 w-12 text-center">Del</th>
                                </tr>
                            </thead>
                            <tbody id="miqaatFullBudgetGridBody"></tbody>
                        </table>
                        <div class="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <button type="button" onclick="window.MiqaatModule.addFullBudgetDraftRow()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100">
                                <i class="fa-solid fa-plus mr-1"></i>Add Row
                            </button>
                            <div class="bg-amber-50 border border-amber-300 rounded-lg px-4 py-2 text-sm font-extrabold text-amber-950">
                                Live Grand Total: <span id="miqaatFullBudgetLiveTotal" class="text-emerald-900 ml-1">₹0</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
                        <button type="button" onclick="window.MiqaatModule.closeModal('miqaatFullBudgetModal')" class="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</button>
                        <button type="button" onclick="window.MiqaatModule.saveFullBudgetGrid()" class="px-5 py-2 rounded-lg text-sm font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                            <i class="fa-solid fa-check-double mr-1.5"></i>Save All
                        </button>
                    </div>
                </div>
            </div>

            <!-- Budget Analysis Chart Modal -->
            <div id="miqaatBudgetAnalysisModal" class="fixed inset-0 bg-black/65 backdrop-blur-xs hidden z-50 flex items-center justify-center p-3 sm:p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-300">
                    <div class="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between">
                        <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
                            <i class="fa-solid fa-chart-pie text-amber-300"></i>
                            <span>Imtehan Budget Analysis — Category Breakdown (<span id="miqaatAnalysisYearLabel">1448H</span>)</span>
                        </h3>
                        <button type="button" onclick="window.MiqaatModule.closeModal('miqaatBudgetAnalysisModal')" class="text-emerald-200 hover:text-white text-2xl leading-none px-2">&times;</button>
                    </div>
                    <div class="p-5 overflow-y-auto space-y-4">
                        <div class="flex flex-wrap items-center justify-between gap-2">
                            <p class="text-xs sm:text-sm text-gray-600">Expenses grouped and summed by Category.</p>
                            <div class="inline-flex rounded-lg border border-emerald-300 overflow-hidden">
                                <button type="button" id="miqaatChartBtnBar" onclick="window.MiqaatModule.setBudgetChartType('bar')" class="px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white">
                                    <i class="fa-solid fa-chart-column mr-1"></i>Bar Chart
                                </button>
                                <button type="button" id="miqaatChartBtnPie" onclick="window.MiqaatModule.setBudgetChartType('pie')" class="px-3.5 py-1.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50">
                                    <i class="fa-solid fa-chart-pie mr-1"></i>Pie Chart
                                </button>
                            </div>
                        </div>
                        <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 h-72 sm:h-80 flex items-center justify-center relative">
                            <canvas id="miqaatBudgetChartCanvas"></canvas>
                            <div id="miqaatBudgetChartEmpty" class="hidden text-center text-gray-500 text-sm">
                                <i class="fa-solid fa-chart-simple text-3xl text-gray-300 mb-2 block"></i>
                                Add budget rows to view category analytics.
                            </div>
                        </div>
                        <div id="miqaatBudgetCategorySummaryTable" class="overflow-x-auto"></div>
                        <div class="bg-emerald-900 text-white rounded-xl px-5 py-3.5 flex items-center justify-between shadow-sm">
                            <span class="text-sm sm:text-base font-bold uppercase tracking-wide">Total Budget Amount</span>
                            <span id="miqaatAnalysisGrandTotal" class="text-xl sm:text-2xl font-extrabold text-amber-300">₹0</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Last Year Events Reference Modal -->
            <div id="miqaatLastYearModal" class="fixed inset-0 bg-black/65 backdrop-blur-xs hidden z-50 flex items-center justify-center p-2 sm:p-4">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-emerald-300">
                    <div class="bg-emerald-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 class="text-base sm:text-lg font-bold flex items-center gap-2">
                                <i class="fa-solid fa-clock-rotate-left text-amber-300"></i>
                                <span>Last Year Events Reference</span>
                            </h3>
                            <p class="text-xs text-emerald-200">Quick planning reference from Imtehaan Tehriri 1447H Program List &amp; previous Hijri year logs</p>
                        </div>
                        <button type="button" onclick="window.MiqaatModule.closeModal('miqaatLastYearModal')" class="text-emerald-200 hover:text-white text-2xl leading-none px-2">&times;</button>
                    </div>
                    <div class="px-5 pt-3 border-b border-gray-200 flex gap-2 bg-gray-50" id="miqaatLastYearTabs"></div>
                    <div id="miqaatLastYearBody" class="p-4 sm:p-5 overflow-auto flex-1"></div>
                </div>
            </div>
        `;
        document.body.appendChild(root);
    }

    // =========================================================================
    // SUB-HEADER 1: DASHBOARD
    // =========================================================================

    function getMatchingDailyEventsForDates(todayIso, tomorrowIso) {
        const yr = getYearData(selectedHijriYear);
        const list = Array.isArray(yr.dailyEvents) ? yr.dailyEvents : [];
        const todayEvents = list.filter(ev => String(ev.englishDate || '').trim() === todayIso);
        const tomorrowEvents = list.filter(ev => String(ev.englishDate || '').trim() === tomorrowIso);
        return { todayEvents, tomorrowEvents };
    }

    function renderDashboardTab() {
        const yr = getYearData(selectedHijriYear);
        const todayIso = getLocalDateIso(0);
        const tomorrowIso = getLocalDateIso(1);
        const { todayEvents, tomorrowEvents } = getMatchingDailyEventsForDates(todayIso, tomorrowIso);
        const hasUpcoming = todayEvents.length > 0 || tomorrowEvents.length > 0;
        const readonly = isViewOnly();

        const maleVenues = yr.venues.male || [];
        const femaleVenues = yr.venues.female || [];
        const maleTotal = maleVenues.reduce((sum, v) => sum + (Number(v.studentCount) || 0), 0);
        const femaleTotal = femaleVenues.reduce((sum, v) => sum + (Number(v.studentCount) || 0), 0);
        const grandStudents = maleTotal + femaleTotal;

        const bannerHtml = hasUpcoming
            ? `
                <div class="miqaat-flash-banner rounded-xl border-2 border-amber-500 bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white p-4 sm:p-5 shadow-lg">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div class="flex items-center gap-2.5">
                            <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 animate-bounce">
                                <i class="fa-solid fa-bullhorn text-amber-200 text-lg"></i>
                            </span>
                            <div>
                                <div class="text-[11px] font-extrabold uppercase tracking-widest text-amber-200">LIVE ALERT — AQA MAULA TUS DAILY EVENTS</div>
                                <h3 class="text-lg sm:text-xl font-extrabold">Today &amp; Tomorrow's Schedule</h3>
                            </div>
                        </div>
                        <button type="button" onclick="window.MiqaatModule.switchSubTab('daily-events')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition">
                            Manage Daily Events <i class="fa-solid fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div class="bg-black/25 rounded-xl p-3.5 border border-amber-300/50">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-red-950 px-2.5 py-0.5 rounded-full">TODAY • ${formatDisplayDate(todayIso)}</span>
                                <span class="text-xs font-semibold text-amber-100">${todayEvents[0]?.hijriDate ? escapeHtml(todayEvents[0].hijriDate) : getDayNameFromIso(todayIso)}</span>
                            </div>
                            ${todayEvents.length > 0
                                ? todayEvents.map(ev => `
                                    <div class="text-sm font-bold text-white leading-relaxed whitespace-pre-line bg-white/10 rounded-lg p-2.5 mt-1.5 border border-white/15">
                                        ${nl2br(ev.events)}
                                    </div>
                                `).join('')
                                : `<p class="text-xs text-amber-100/90 italic">No events recorded for today.</p>`
                            }
                        </div>
                        <div class="bg-black/25 rounded-xl p-3.5 border border-amber-300/50">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-xs font-extrabold uppercase tracking-wider bg-white text-red-900 px-2.5 py-0.5 rounded-full">TOMORROW • ${formatDisplayDate(tomorrowIso)}</span>
                                <span class="text-xs font-semibold text-amber-100">${tomorrowEvents[0]?.hijriDate ? escapeHtml(tomorrowEvents[0].hijriDate) : getDayNameFromIso(tomorrowIso)}</span>
                            </div>
                            ${tomorrowEvents.length > 0
                                ? tomorrowEvents.map(ev => `
                                    <div class="text-sm font-bold text-white leading-relaxed whitespace-pre-line bg-white/10 rounded-lg p-2.5 mt-1.5 border border-white/15">
                                        ${nl2br(ev.events)}
                                    </div>
                                `).join('')
                                : `<p class="text-xs text-amber-100/90 italic">No events recorded for tomorrow.</p>`
                            }
                        </div>
                    </div>
                </div>
            `
            : `
                <div class="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
                            <i class="fa-solid fa-bell"></i>
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-extrabold text-amber-950">Aqa Maula TUS — Today (${formatDisplayDate(todayIso)}) &amp; Tomorrow (${formatDisplayDate(tomorrowIso)})</h3>
                            <p class="text-xs sm:text-sm text-amber-800">No events are currently scheduled for today or tomorrow in ${selectedHijriYear}H. Add entries in <strong>Aqa Maula – Daily Events</strong> and they will automatically highlight here.</p>
                        </div>
                    </div>
                    <button type="button" onclick="window.MiqaatModule.switchSubTab('daily-events')" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 shrink-0 shadow-sm">
                        <i class="fa-solid fa-plus mr-1"></i>Add Daily Events
                    </button>
                </div>
            `;

        const renderVenueList = (gender, items, headerColor, badgeColor) => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div class="${headerColor} px-4 py-3 flex items-center justify-between">
                    <div class="flex items-center gap-2 text-white">
                        <i class="fa-solid ${gender === 'male' ? 'fa-person' : 'fa-person-dress'} text-lg"></i>
                        <h4 class="font-extrabold text-sm sm:text-base">Venues ${gender === 'male' ? 'Male' : 'Female'}</h4>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-extrabold ${badgeColor} px-2.5 py-0.5 rounded-full">
                            ${(gender === 'male' ? maleTotal : femaleTotal).toLocaleString('en-IN')} Students
                        </span>
                        ${!readonly ? `
                            <button type="button" onclick="window.MiqaatModule.openVenueModal('${gender}')" class="miqaat-edit-only bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-lg transition">
                                <i class="fa-solid fa-plus mr-1"></i>Add
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="overflow-x-auto flex-1">
                    <table class="w-full text-sm">
                        <thead class="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                            <tr>
                                <th class="px-4 py-2.5 text-left w-10">#</th>
                                <th class="px-4 py-2.5 text-left">Venue Name</th>
                                <th class="px-4 py-2.5 text-right w-32">Student Count</th>
                                ${!readonly ? '<th class="px-3 py-2.5 text-center w-20 miqaat-edit-only">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${items.length === 0 ? `
                                <tr><td colspan="${readonly ? 3 : 4}" class="px-4 py-6 text-center text-gray-400 italic">No venues added yet.</td></tr>
                            ` : items.map((v, idx) => `
                                <tr class="hover:bg-emerald-50/40 transition">
                                    <td class="px-4 py-2.5 text-gray-500 font-semibold">${idx + 1}</td>
                                    <td class="px-4 py-2.5 font-semibold text-gray-800">${escapeHtml(v.name)}</td>
                                    <td class="px-4 py-2.5 text-right">
                                        ${!readonly ? `
                                            <input type="number" min="0" value="${Number(v.studentCount) || 0}"
                                                onchange="window.MiqaatModule.updateVenueCount('${gender}', '${v.id}', this.value)"
                                                class="w-24 text-right font-bold text-emerald-900 bg-emerald-50/70 border border-emerald-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                                        ` : `<span class="font-bold text-emerald-900">${(Number(v.studentCount) || 0).toLocaleString('en-IN')}</span>`}
                                    </td>
                                    ${!readonly ? `
                                        <td class="px-3 py-2.5 text-center miqaat-edit-only">
                                            <div class="inline-flex items-center gap-1">
                                                <button type="button" onclick="window.MiqaatModule.openVenueModal('${gender}', '${v.id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit Venue"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type="button" onclick="window.MiqaatModule.deleteVenue('${gender}', '${v.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete Venue"><i class="fa-solid fa-trash"></i></button>
                                            </div>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot class="bg-gray-50 border-t-2 border-gray-200 font-extrabold text-gray-800">
                            <tr>
                                <td colspan="2" class="px-4 py-2.5 text-right text-xs uppercase tracking-wider">Subtotal (${items.length} Venues)</td>
                                <td class="px-4 py-2.5 text-right text-emerald-900">${(gender === 'male' ? maleTotal : femaleTotal).toLocaleString('en-IN')}</td>
                                ${!readonly ? '<td class="miqaat-edit-only"></td>' : ''}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;

        const sortedTimetable = [...(yr.timetable || [])].sort((a, b) => String(a.englishDate || '').localeCompare(String(b.englishDate || '')));

        return `
            ${bannerHtml}

            <!-- Imtehaan Venues Summary -->
            <div class="space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-2">
                    <h3 class="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                        <i class="fa-solid fa-building-columns text-emerald-700"></i>
                        <span>Imtehaan Venues Summary</span>
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span class="bg-blue-50 text-blue-900 border border-blue-200 px-3 py-1 rounded-full">Male: ${maleTotal.toLocaleString('en-IN')}</span>
                        <span class="bg-pink-50 text-pink-900 border border-pink-200 px-3 py-1 rounded-full">Female: ${femaleTotal.toLocaleString('en-IN')}</span>
                        <span class="bg-emerald-900 text-amber-300 px-3.5 py-1 rounded-full shadow-sm">Total Students: ${grandStudents.toLocaleString('en-IN')}</span>
                    </div>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    ${renderVenueList('male', maleVenues, 'bg-gradient-to-r from-blue-800 to-indigo-800', 'bg-blue-100 text-blue-950')}
                    ${renderVenueList('female', femaleVenues, 'bg-gradient-to-r from-rose-700 to-pink-700', 'bg-pink-100 text-pink-950')}
                </div>
            </div>

            <!-- Examination Timetable -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-emerald-50 border-b border-emerald-200 px-4 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 class="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                            <i class="fa-solid fa-calendar-week text-emerald-700"></i>
                            <span>Examination Timetable (${selectedHijriYear}H)</span>
                        </h3>
                        <p class="text-xs text-emerald-800">Supports single-paper days and dual-paper days (Morning &amp; Evening shifts) cleanly without overlap.</p>
                    </div>
                    ${!readonly ? `
                        <button type="button" onclick="window.MiqaatModule.openTimetableModal()" class="miqaat-edit-only px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                            <i class="fa-solid fa-plus mr-1"></i>Add Exam Date
                        </button>
                    ` : ''}
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-emerald-900 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-4 py-3 text-left">English Date</th>
                                <th class="px-4 py-3 text-left">Hijri Date</th>
                                <th class="px-4 py-3 text-left">Day</th>
                                <th class="px-4 py-3 text-left">Paper 1 <span class="text-amber-300 font-normal">(Morning Shift)</span></th>
                                <th class="px-4 py-3 text-left">Paper 2 <span class="text-emerald-200 font-normal">(Evening Shift)</span></th>
                                <th class="px-4 py-3 text-left">Timings</th>
                                ${!readonly ? '<th class="px-3 py-3 text-center w-20 miqaat-edit-only">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${sortedTimetable.length === 0 ? `
                                <tr>
                                    <td colspan="${readonly ? 6 : 7}" class="px-4 py-8 text-center text-gray-500">
                                        <i class="fa-solid fa-calendar-plus text-3xl text-gray-300 mb-2 block"></i>
                                        No examination timetable dates added for ${selectedHijriYear}H yet.
                                    </td>
                                </tr>
                            ` : sortedTimetable.map(row => {
                                const hasPaper1 = Boolean((row.paper1 || '').trim());
                                const hasPaper2 = Boolean((row.paper2 || '').trim());
                                const mTime = (row.morningTiming || '').trim();
                                const eTime = (row.eveningTiming || '').trim();
                                const fallbackTime = (row.timings || '').trim();
                                return `
                                    <tr class="hover:bg-emerald-50/40 transition align-top">
                                        <td class="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">${formatDisplayDate(row.englishDate)}</td>
                                        <td class="px-4 py-3 font-semibold text-emerald-900 whitespace-nowrap">${escapeHtml(row.hijriDate || '—')}</td>
                                        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">${escapeHtml(row.day || getDayNameFromIso(row.englishDate) || '—')}</td>
                                        <td class="px-4 py-3">
                                            ${hasPaper1 ? `
                                                <div class="font-semibold text-gray-900">${nl2br(row.paper1)}</div>
                                            ` : '<span class="text-gray-400 italic">—</span>'}
                                        </td>
                                        <td class="px-4 py-3">
                                            ${hasPaper2 ? `
                                                <div class="font-semibold text-gray-900">${nl2br(row.paper2)}</div>
                                            ` : '<span class="text-gray-400 italic">—</span>'}
                                        </td>
                                        <td class="px-4 py-3">
                                            <div class="space-y-1.5">
                                                ${mTime ? `
                                                    <div class="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold px-2.5 py-1 rounded-md">
                                                        <i class="fa-solid fa-sun text-amber-500"></i>
                                                        <span>Morning: ${escapeHtml(mTime)}</span>
                                                    </div>
                                                ` : ''}
                                                ${eTime ? `
                                                    <div class="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-bold px-2.5 py-1 rounded-md">
                                                        <i class="fa-solid fa-moon text-indigo-500"></i>
                                                        <span>Evening: ${escapeHtml(eTime)}</span>
                                                    </div>
                                                ` : ''}
                                                ${(!mTime && !eTime) ? (fallbackTime ? `<span class="text-xs font-semibold text-gray-700">${escapeHtml(fallbackTime)}</span>` : '<span class="text-gray-400 italic">—</span>') : ''}
                                            </div>
                                        </td>
                                        ${!readonly ? `
                                            <td class="px-3 py-3 text-center whitespace-nowrap miqaat-edit-only">
                                                <button type="button" onclick="window.MiqaatModule.openTimetableModal('${row.id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type="button" onclick="window.MiqaatModule.deleteTimetableRow('${row.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // SUB-HEADER 2: USER-BASED CHECKLIST
    // =========================================================================

    function getStatusBadgeClasses(status) {
        if (status === 'Completed') return 'bg-emerald-100 text-emerald-900 border-emerald-300';
        if (status === 'In Progress') return 'bg-blue-100 text-blue-900 border-blue-300';
        if (status === 'Follow-up') return 'bg-amber-100 text-amber-950 border-amber-300';
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }

    function getPriorityBadgeClasses(priority) {
        if (priority === 'Urgent') return 'bg-red-100 text-red-900 border-red-300';
        if (priority === 'High') return 'bg-orange-100 text-orange-900 border-orange-300';
        if (priority === 'Medium') return 'bg-blue-50 text-blue-900 border-blue-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }

    function renderChecklistTab() {
        const yr = getYearData(selectedHijriYear);
        const allTasks = yr.checklist || [];
        const authUsers = getAuthorizedUsers();
        const curUser = getCurrentUserInfo();
        const readonly = isViewOnly();

        // KPI counts
        const total = allTasks.length;
        const inProgress = allTasks.filter(t => t.status === 'In Progress').length;
        const followUp = allTasks.filter(t => t.status === 'Follow-up').length;
        const completed = allTasks.filter(t => t.status === 'Completed').length;
        const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0';

        // Filter tasks
        const q = checklistSearch.trim().toLowerCase();
        const filteredTasks = allTasks.filter(t => {
            if (checklistStatusFilter && t.status !== checklistStatusFilter) return false;
            if (checklistPriorityFilter && t.priority !== checklistPriorityFilter) return false;
            if (q) {
                const hay = `${t.itemNo} ${t.category} ${t.description} ${t.assigneeName} ${t.collaborators} ${t.quantitySpecs}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        // Sort authorized users so currently logged-in user is ALWAYS pinned to the very top
        const sortedUsers = [...authUsers].sort((a, b) => {
            if (a.email === curUser.email) return -1;
            if (b.email === curUser.email) return 1;
            return a.name.localeCompare(b.name);
        });

        // Group tasks by authorized user email
        const tasksByUser = new Map();
        sortedUsers.forEach(u => tasksByUser.set(u.email, []));
        const unassignedByName = new Map();

        filteredTasks.forEach(task => {
            const matchedEmail = matchTaskToUser(task, authUsers);
            if (matchedEmail !== '__unassigned__' && tasksByUser.has(matchedEmail)) {
                tasksByUser.get(matchedEmail).push(task);
            } else {
                const label = (task.assigneeName || 'Unassigned').trim() || 'Unassigned';
                if (!unassignedByName.has(label)) unassignedByName.set(label, []);
                unassignedByName.get(label).push(task);
            }
        });

        const renderUserTaskTable = (sectionTitle, sectionSubtitle, tasks, isPinnedSelf, targetUserEmail, isExternalAssignee = false) => `
            <div class="bg-white rounded-xl shadow-sm border ${isPinnedSelf ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-gray-200'} overflow-hidden">
                <div class="${isPinnedSelf ? 'bg-gradient-to-r from-emerald-800 to-teal-800 text-white' : (isExternalAssignee ? 'bg-amber-50 text-amber-950 border-b border-amber-200' : 'bg-gray-100 text-gray-900 border-b border-gray-200')} px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full ${isPinnedSelf ? 'bg-amber-400 text-emerald-950' : 'bg-emerald-700 text-white'} flex items-center justify-center font-extrabold text-xs">
                            ${escapeHtml(sectionTitle.slice(0, 2).toUpperCase())}
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="font-extrabold text-sm sm:text-base">${escapeHtml(sectionTitle)}</h4>
                                ${isPinnedSelf ? '<span class="text-[10px] font-extrabold uppercase bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">Pinned • Your Checklist</span>' : ''}
                                ${isExternalAssignee ? '<span class="text-[10px] font-bold uppercase bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">Imported Assignee (Not Yet Mapped)</span>' : ''}
                            </div>
                            ${sectionSubtitle ? `<p class="text-[11px] ${isPinnedSelf ? 'text-emerald-200' : 'text-gray-500'}">${escapeHtml(sectionSubtitle)}</p>` : ''}
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold px-2.5 py-1 rounded-full ${isPinnedSelf ? 'bg-white/15 text-white' : 'bg-white text-gray-700 border border-gray-300'}">
                            ${tasks.length} Task${tasks.length === 1 ? '' : 's'}
                        </span>
                        ${(!readonly && !isExternalAssignee) ? `
                            <button type="button" onclick="window.MiqaatModule.openChecklistModal(null, '${escapeHtml(targetUserEmail)}')" class="miqaat-edit-only px-2.5 py-1 rounded-lg text-xs font-bold ${isPinnedSelf ? 'bg-amber-400 text-emerald-950 hover:bg-amber-300' : 'bg-emerald-700 text-white hover:bg-emerald-800'}">
                                <i class="fa-solid fa-plus mr-1"></i>Add Task
                            </button>
                        ` : ''}
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs sm:text-sm">
                        <thead class="bg-slate-800 text-white text-[11px] uppercase tracking-wider">
                            <tr>
                                <th class="px-3 py-2.5 text-center w-14">Item #</th>
                                <th class="px-3 py-2.5 text-left w-40">Category / Area</th>
                                <th class="px-3 py-2.5 text-left min-w-[220px]">Task Description</th>
                                <th class="px-3 py-2.5 text-left w-44">Collaborators / Coordinators</th>
                                <th class="px-3 py-2.5 text-left w-36">Quantity / Specs</th>
                                <th class="px-3 py-2.5 text-center w-32">Status</th>
                                <th class="px-3 py-2.5 text-center w-28">Priority</th>
                                ${!readonly ? '<th class="px-3 py-2.5 text-left w-52 miqaat-edit-only">Reassign / Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${tasks.length === 0 ? `
                                <tr><td colspan="${readonly ? 7 : 8}" class="px-4 py-5 text-center text-gray-400 italic">No tasks assigned under current filter.</td></tr>
                            ` : tasks.map(t => `
                                <tr class="hover:bg-emerald-50/40 transition ${t.status === 'Completed' ? 'bg-emerald-50/30' : ''}">
                                    <td class="px-3 py-2.5 text-center font-bold text-gray-600">${escapeHtml(t.itemNo || '—')}</td>
                                    <td class="px-3 py-2.5 font-semibold text-blue-950">${escapeHtml(t.category || '—')}</td>
                                    <td class="px-3 py-2.5 text-gray-900 ${t.status === 'Completed' ? 'line-through text-gray-500' : 'font-medium'}">${nl2br(t.description)}</td>
                                    <td class="px-3 py-2.5 text-gray-600">${escapeHtml(t.collaborators || '—')}</td>
                                    <td class="px-3 py-2.5 text-gray-700">${escapeHtml(t.quantitySpecs || '—')}</td>
                                    <td class="px-3 py-2.5 text-center">
                                        ${!readonly ? `
                                            <select onchange="window.MiqaatModule.updateChecklistField('${t.id}', 'status', this.value)" class="text-xs font-bold rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none ${getStatusBadgeClasses(t.status)}">
                                                ${CHECKLIST_STATUSES.map(st => `<option value="${st}" ${t.status === st ? 'selected' : ''}>${st}</option>`).join('')}
                                            </select>
                                        ` : `<span class="text-xs font-bold rounded-full px-2.5 py-1 border ${getStatusBadgeClasses(t.status)}">${escapeHtml(t.status)}</span>`}
                                    </td>
                                    <td class="px-3 py-2.5 text-center">
                                        ${!readonly ? `
                                            <select onchange="window.MiqaatModule.updateChecklistField('${t.id}', 'priority', this.value)" class="text-xs font-bold rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none ${getPriorityBadgeClasses(t.priority)}">
                                                ${CHECKLIST_PRIORITIES.map(pr => `<option value="${pr}" ${t.priority === pr ? 'selected' : ''}>${pr}</option>`).join('')}
                                            </select>
                                        ` : `<span class="text-xs font-bold rounded-full px-2.5 py-1 border ${getPriorityBadgeClasses(t.priority)}">${escapeHtml(t.priority)}</span>`}
                                    </td>
                                    ${!readonly ? `
                                        <td class="px-3 py-2.5 miqaat-edit-only">
                                            <div class="flex items-center gap-1.5">
                                                <select title="Reassign task to another authorized user"
                                                    onchange="if(this.value) window.MiqaatModule.reassignChecklistTask('${t.id}', this.value)"
                                                    class="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[140px]">
                                                    <option value="">Move to user...</option>
                                                    ${sortedUsers.map(u => `<option value="${escapeHtml(u.email)}" ${u.email === targetUserEmail ? 'disabled' : ''}>${escapeHtml(u.name)}</option>`).join('')}
                                                </select>
                                                <button type="button" onclick="window.MiqaatModule.openChecklistModal('${t.id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit Task"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type="button" onclick="window.MiqaatModule.deleteChecklistTask('${t.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete Task"><i class="fa-solid fa-trash"></i></button>
                                            </div>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return `
            <!-- KPI Summary Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div class="bg-white rounded-xl border border-gray-200 p-3.5 text-center shadow-xs">
                    <div class="text-[11px] font-bold uppercase text-gray-500">Total Tasks</div>
                    <div class="text-2xl font-extrabold text-gray-900 mt-0.5">${total}</div>
                </div>
                <div class="bg-white rounded-xl border border-blue-200 p-3.5 text-center shadow-xs">
                    <div class="text-[11px] font-bold uppercase text-blue-600">In Progress</div>
                    <div class="text-2xl font-extrabold text-blue-900 mt-0.5">${inProgress}</div>
                </div>
                <div class="bg-white rounded-xl border border-amber-200 p-3.5 text-center shadow-xs">
                    <div class="text-[11px] font-bold uppercase text-amber-600">Follow-up</div>
                    <div class="text-2xl font-extrabold text-amber-900 mt-0.5">${followUp}</div>
                </div>
                <div class="bg-white rounded-xl border border-emerald-200 p-3.5 text-center shadow-xs">
                    <div class="text-[11px] font-bold uppercase text-emerald-600">Completed</div>
                    <div class="text-2xl font-extrabold text-emerald-900 mt-0.5">${completed}</div>
                </div>
                <div class="bg-emerald-900 rounded-xl border border-emerald-700 p-3.5 text-center shadow-xs col-span-2 sm:col-span-1">
                    <div class="text-[11px] font-bold uppercase text-emerald-200">Completion Rate</div>
                    <div class="text-2xl font-extrabold text-amber-300 mt-0.5">${completionRate}%</div>
                </div>
            </div>

            <!-- Toolbar: Filters + Bulk Import + Add Task -->
            <div class="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[240px]">
                    <div class="relative flex-1 min-w-[180px] max-w-xs">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="text" value="${escapeHtml(checklistSearch)}" placeholder="Search tasks, category, assignee..."
                            oninput="window.MiqaatModule.setChecklistFilter('search', this.value)"
                            class="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <select onchange="window.MiqaatModule.setChecklistFilter('status', this.value)" class="text-xs sm:text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white">
                        <option value="">All Statuses</option>
                        ${CHECKLIST_STATUSES.map(st => `<option value="${st}" ${checklistStatusFilter === st ? 'selected' : ''}>${st}</option>`).join('')}
                    </select>
                    <select onchange="window.MiqaatModule.setChecklistFilter('priority', this.value)" class="text-xs sm:text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white">
                        <option value="">All Priorities</option>
                        ${CHECKLIST_PRIORITIES.map(pr => `<option value="${pr}" ${checklistPriorityFilter === pr ? 'selected' : ''}>${pr}</option>`).join('')}
                    </select>
                </div>
                ${!readonly ? `
                    <div class="flex flex-wrap items-center gap-2 miqaat-edit-only">
                        <input type="file" id="miqaatChecklistImportInput" accept=".xlsx,.xls,.csv" class="hidden" onchange="window.MiqaatModule.handleChecklistImport(event)">
                        <button type="button" onclick="document.getElementById('miqaatChecklistImportInput').click()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
                            <i class="fa-solid fa-file-import mr-1.5"></i>Import
                        </button>
                        <button type="button" onclick="window.MiqaatModule.downloadChecklistTemplate()" class="px-3 py-2 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300" title="Download Excel template matching the checklist structure">
                            <i class="fa-solid fa-download mr-1"></i>Template
                        </button>
                        <button type="button" onclick="window.MiqaatModule.openChecklistModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                            <i class="fa-solid fa-plus mr-1"></i>Add Task
                        </button>
                    </div>
                ` : ''}
            </div>

            <!-- Authorized Users Sections (Current Logged-in User Pinned First) -->
            <div class="space-y-4">
                ${sortedUsers.map(u => renderUserTaskTable(
                    u.name,
                    u.role === 'Admin' ? 'Admin • Authorized Miqaat User' : 'Authorized Miqaat User',
                    tasksByUser.get(u.email) || [],
                    u.email === curUser.email,
                    u.email,
                    false
                )).join('')}

                ${Array.from(unassignedByName.entries()).map(([name, tasks]) => renderUserTaskTable(
                    name,
                    'Use the Reassign dropdown on any row to move tasks to an authorized portal user',
                    tasks,
                    false,
                    '',
                    true
                )).join('')}
            </div>
        `;
    }

    // =========================================================================
    // SUB-HEADER 3: MIQAAT EVENTS DETAILS (Tehriri Imtehan + Other Events)
    // =========================================================================

    function renderEventsDetailsTab() {
        const yr = getYearData(selectedHijriYear);
        const readonly = isViewOnly();
        const q = eventsDetailsSearch.trim().toLowerCase();

        const filterList = (arr) => (arr || []).filter(item => {
            if (!q) return true;
            return `${item.srNo} ${item.description} ${item.hastak} ${item.requirements} ${item.checklist} ${item.remarks}`.toLowerCase().includes(q);
        });

        const tehririRows = filterList(yr.eventsTehriri);
        const otherRows = filterList(yr.eventsOther);

        const renderEventSection = (sectionKey, title, subtitle, rows, accentClass) => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="${accentClass} px-4 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 class="text-base sm:text-lg font-extrabold text-white tracking-wide">${title}</h3>
                        <p class="text-xs text-white/80">${subtitle}</p>
                    </div>
                    ${!readonly ? `
                        <button type="button" onclick="window.MiqaatModule.openEventDetailModal('${sectionKey}')" class="miqaat-edit-only px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow-sm">
                            <i class="fa-solid fa-plus mr-1"></i>Add Entry
                        </button>
                    ` : ''}
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs sm:text-sm border-collapse">
                        <thead class="bg-gray-100 text-gray-800 border-b border-gray-300 text-xs uppercase">
                            <tr>
                                <th class="px-3 py-2.5 text-center w-14 border-r border-gray-200">Sr No</th>
                                <th class="px-3 py-2.5 text-left min-w-[200px] border-r border-gray-200">Description</th>
                                <th class="px-3 py-2.5 text-left w-44 border-r border-gray-200">Hastak</th>
                                <th class="px-3 py-2.5 text-left min-w-[220px] border-r border-gray-200">Requirements</th>
                                <th class="px-3 py-2.5 text-left min-w-[200px] bg-yellow-100 text-yellow-950 border-r border-yellow-300">Checklist for work to be done</th>
                                <th class="px-3 py-2.5 text-center w-16 bg-yellow-100 text-yellow-950 border-r border-yellow-300">Done</th>
                                <th class="px-3 py-2.5 text-left w-40">Remarks</th>
                                ${!readonly ? '<th class="px-3 py-2.5 text-center w-20 miqaat-edit-only">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${rows.length === 0 ? `
                                <tr><td colspan="${readonly ? 7 : 8}" class="px-4 py-6 text-center text-gray-400 italic">No entries found.</td></tr>
                            ` : rows.map(row => `
                                <tr class="hover:bg-emerald-50/30 transition align-top">
                                    <td class="px-3 py-2.5 text-center font-bold text-gray-700 border-r border-gray-200">${escapeHtml(row.srNo)}</td>
                                    <td class="px-3 py-2.5 font-semibold text-gray-900 border-r border-gray-200">${nl2br(row.description)}</td>
                                    <td class="px-3 py-2.5 text-gray-700 border-r border-gray-200">${nl2br(row.hastak)}</td>
                                    <td class="px-3 py-2.5 text-gray-700 border-r border-gray-200">${nl2br(row.requirements)}</td>
                                    <td class="px-3 py-2.5 bg-yellow-50/80 text-gray-900 font-medium border-r border-yellow-200">${nl2br(row.checklist)}</td>
                                    <td class="px-3 py-2.5 text-center bg-yellow-50/80 border-r border-yellow-200">
                                        <input type="checkbox" ${row.done ? 'checked' : ''} ${readonly ? 'disabled' : ''}
                                            onchange="window.MiqaatModule.toggleEventDetailDone('${sectionKey}', '${row.id}', this.checked)"
                                            class="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                                    </td>
                                    <td class="px-3 py-2.5 text-gray-700">${nl2br(row.remarks)}</td>
                                    ${!readonly ? `
                                        <td class="px-3 py-2.5 text-center whitespace-nowrap miqaat-edit-only">
                                            <button type="button" onclick="window.MiqaatModule.openEventDetailModal('${sectionKey}', '${row.id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                            <button type="button" onclick="window.MiqaatModule.deleteEventDetailRow('${sectionKey}', '${row.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        return `
            <div class="bg-white rounded-xl border border-gray-200 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div class="relative flex-1 min-w-[220px] max-w-md">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <input type="text" value="${escapeHtml(eventsDetailsSearch)}" placeholder="Search event description, hastak, requirements..."
                        oninput="window.MiqaatModule.setEventsDetailsSearch(this.value)"
                        class="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
                <div class="text-xs font-semibold text-gray-600">
                    Showing <strong>${tehririRows.length}</strong> Tehriri Imtehan &amp; <strong>${otherRows.length}</strong> Other Event entries for <strong>${selectedHijriYear}H</strong>
                </div>
            </div>

            ${renderEventSection('eventsTehriri', 'TEHRIRI IMTEHAN', 'Core examination hall & pathway arrangements', tehririRows, 'bg-gradient-to-r from-emerald-900 to-teal-800')}
            ${renderEventSection('eventsOther', 'OTHER EVENTS DURING IMTEHAN', 'Namaaz, Urus, Ziyafat, Olda Zafaf, Vajebaat Bethak, Dignitaries & Programs', otherRows, 'bg-gradient-to-r from-slate-800 to-emerald-900')}
        `;
    }

    // =========================================================================
    // SUB-HEADER 4: IMTEHAN BUDGET
    // =========================================================================

    function computeRowAmount(row) {
        const amt = Number(row.amount);
        return isNaN(amt) ? 0 : amt;
    }

    function renderBudgetTab() {
        const yr = getYearData(selectedHijriYear);
        const rows = yr.budget || [];
        const readonly = isViewOnly();

        const categories = Array.from(new Set([...DEFAULT_BUDGET_CATEGORIES, ...rows.map(r => r.category).filter(Boolean)]));
        const q = budgetSearch.trim().toLowerCase();
        const filtered = rows.filter(r => {
            if (budgetCategoryFilter && r.category !== budgetCategoryFilter) return false;
            if (q) {
                const hay = `${r.category} ${r.itemDetails || r.item || ''} ${r.rateDetails || ''} ${r.remarks || ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        const grandTotalAll = rows.reduce((sum, r) => sum + computeRowAmount(r), 0);
        const filteredTotal = filtered.reduce((sum, r) => sum + computeRowAmount(r), 0);

        return `
            <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[240px]">
                    <div class="relative flex-1 min-w-[180px] max-w-xs">
                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input type="text" value="${escapeHtml(budgetSearch)}" placeholder="Search item details, category, rate, remarks..."
                            oninput="window.MiqaatModule.setBudgetFilter('search', this.value)"
                            class="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    </div>
                    <select onchange="window.MiqaatModule.setBudgetFilter('category', this.value)" class="text-xs sm:text-sm border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white">
                        <option value="">All Categories</option>
                        ${categories.map(c => `<option value="${escapeHtml(c)}" ${budgetCategoryFilter === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                    </select>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button type="button" onclick="window.MiqaatModule.openBudgetAnalysisModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-emerald-950 hover:bg-amber-400 shadow-sm">
                        <i class="fa-solid fa-chart-pie mr-1.5"></i>Analysis
                    </button>
                    ${!readonly ? `
                        <button type="button" onclick="window.MiqaatModule.openFullBudgetModal()" class="miqaat-edit-only px-3.5 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm">
                            <i class="fa-solid fa-table-cells mr-1.5"></i>Edit Full Table
                        </button>
                        <button type="button" onclick="window.MiqaatModule.openBudgetRowModal()" class="miqaat-edit-only px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                            <i class="fa-solid fa-plus mr-1"></i>Add Row
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="bg-emerald-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 class="font-extrabold text-sm sm:text-base flex items-center gap-2">
                        <i class="fa-solid fa-indian-rupee-sign text-amber-300"></i>
                        <span>Imtehan Budget (${selectedHijriYear}H)</span>
                    </h3>
                    <span class="text-xs font-extrabold bg-amber-400 text-emerald-950 px-3 py-1 rounded-full">
                        Grand Total: ${formatINR(grandTotalAll)}
                    </span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs sm:text-sm">
                        <thead class="bg-gray-100 text-gray-700 text-xs uppercase border-b border-gray-200">
                            <tr>
                                <th class="px-3 py-3 text-center w-16">Sr No</th>
                                <th class="px-3 py-3 text-left w-52">Category</th>
                                <th class="px-3 py-3 text-left min-w-[220px]">Item Details</th>
                                <th class="px-3 py-3 text-right w-36">Amount (₹)</th>
                                <th class="px-3 py-3 text-left min-w-[180px]">Rate Details</th>
                                <th class="px-3 py-3 text-left min-w-[160px]">Remarks</th>
                                ${!readonly ? '<th class="px-3 py-3 text-center w-24 miqaat-edit-only">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            ${filtered.length === 0 ? `
                                <tr>
                                    <td colspan="${readonly ? 6 : 7}" class="px-4 py-8 text-center text-gray-500">
                                        <i class="fa-solid fa-receipt text-3xl text-gray-300 mb-2 block"></i>
                                        No budget items yet for ${selectedHijriYear}H. Use <strong>Add Row</strong> or <strong>Edit Full Table</strong> to enter budget items.
                                    </td>
                                </tr>
                            ` : filtered.map((r, idx) => {
                                const amt = computeRowAmount(r);
                                const itemText = r.itemDetails !== undefined ? r.itemDetails : (r.item || '');
                                return `
                                    <tr class="hover:bg-emerald-50/40 transition">
                                        <td class="px-3 py-2.5 text-center font-bold text-gray-500">${idx + 1}</td>
                                        <td class="px-3 py-2.5">
                                            ${!readonly ? `
                                                <select onchange="window.MiqaatModule.updateBudgetCategory('${r.id}', this.value)"
                                                    class="text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer w-full">
                                                    ${categories.map(c => `<option value="${escapeHtml(c)}" ${r.category === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                                                </select>
                                            ` : `<span class="inline-block bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-bold">${escapeHtml(r.category || 'HR')}</span>`}
                                        </td>
                                        <td class="px-3 py-2.5 font-semibold text-gray-900">${nl2br(itemText || '—')}</td>
                                        <td class="px-3 py-2.5 text-right font-extrabold text-emerald-900 whitespace-nowrap">${formatINR(amt)}</td>
                                        <td class="px-3 py-2.5 text-gray-700">${nl2br(r.rateDetails || '—')}</td>
                                        <td class="px-3 py-2.5 text-gray-600">${nl2br(r.remarks || '—')}</td>
                                        ${!readonly ? `
                                            <td class="px-3 py-2.5 text-center whitespace-nowrap miqaat-edit-only">
                                                <button type="button" onclick="window.MiqaatModule.openBudgetRowModal('${r.id}')" class="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded text-xs font-bold" title="Edit Row"><i class="fa-solid fa-pen-to-square mr-1"></i>Edit</button>
                                                <button type="button" onclick="window.MiqaatModule.deleteBudgetRow('${r.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                        <tfoot class="bg-emerald-50 border-t-2 border-emerald-300">
                            <tr>
                                <td colspan="3" class="px-4 py-3 text-right font-extrabold text-emerald-950 uppercase tracking-wider">
                                    ${(budgetSearch || budgetCategoryFilter) ? 'Filtered Subtotal' : 'Grand Total'}
                                </td>
                                <td class="px-3 py-3 text-right text-base sm:text-lg font-extrabold text-emerald-900 whitespace-nowrap">${formatINR(filteredTotal)}</td>
                                <td colspan="${readonly ? 2 : 3}"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // SUB-HEADER 5: AQA MAULA – DAILY EVENTS
    // =========================================================================

    function renderDailyEventsTab() {
        const yr = getYearData(selectedHijriYear);
        const readonly = isViewOnly();
        const todayIso = getLocalDateIso(0);
        const tomorrowIso = getLocalDateIso(1);
        const sorted = [...(yr.dailyEvents || [])].sort((a, b) => String(a.englishDate || '').localeCompare(String(b.englishDate || '')));

        return `
            <div class="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 class="text-base sm:text-lg font-extrabold text-emerald-950 flex items-center gap-2">
                        <i class="fa-solid fa-star-and-crescent text-amber-500"></i>
                        <span>Aqa Maula TUS – Daily Events (${selectedHijriYear}H)</span>
                    </h3>
                    <p class="text-xs text-gray-600">Events matching Today (${formatDisplayDate(todayIso)}) or Tomorrow (${formatDisplayDate(tomorrowIso)}) automatically flash at the top of the Dashboard.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button type="button" onclick="window.MiqaatModule.openLastYearEventsModal()" class="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-emerald-950 hover:bg-amber-400 shadow-sm">
                        <i class="fa-solid fa-clock-rotate-left mr-1.5"></i>Last Year Events
                    </button>
                    ${!readonly ? `
                        <button type="button" onclick="window.MiqaatModule.openDailyEventModal()" class="miqaat-edit-only px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm">
                            <i class="fa-solid fa-plus mr-1"></i>Add Day / Events
                        </button>
                    ` : ''}
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead class="bg-emerald-900 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-4 py-3 text-left w-44">English Date</th>
                                <th class="px-4 py-3 text-left w-40">Hijri Date</th>
                                <th class="px-4 py-3 text-left w-32">Day</th>
                                <th class="px-4 py-3 text-left">Events / Programs</th>
                                ${!readonly ? '<th class="px-3 py-3 text-center w-24 miqaat-edit-only">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${sorted.length === 0 ? `
                                <tr>
                                    <td colspan="${readonly ? 4 : 5}" class="px-4 py-8 text-center text-gray-500">
                                        <i class="fa-solid fa-calendar-day text-3xl text-gray-300 mb-2 block"></i>
                                        No daily events scheduled for ${selectedHijriYear}H yet. Click <strong>Add Day / Events</strong> or check <strong>Last Year Events</strong> for reference.
                                    </td>
                                </tr>
                            ` : sorted.map(ev => {
                                const isToday = ev.englishDate === todayIso;
                                const isTomorrow = ev.englishDate === tomorrowIso;
                                const highlightRow = isToday ? 'bg-amber-50/90' : (isTomorrow ? 'bg-yellow-50/60' : 'hover:bg-emerald-50/30');
                                return `
                                    <tr class="${highlightRow} transition align-top">
                                        <td class="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                                            <div>${formatDisplayDate(ev.englishDate)}</div>
                                            ${isToday ? '<span class="inline-block mt-1 text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">TODAY</span>' : ''}
                                            ${isTomorrow ? '<span class="inline-block mt-1 text-[10px] font-extrabold uppercase bg-amber-500 text-emerald-950 px-2 py-0.5 rounded-full">TOMORROW</span>' : ''}
                                        </td>
                                        <td class="px-4 py-3 font-semibold text-emerald-900 whitespace-nowrap">${escapeHtml(ev.hijriDate || '—')}</td>
                                        <td class="px-4 py-3 text-gray-700 whitespace-nowrap">${escapeHtml(ev.day || getDayNameFromIso(ev.englishDate) || '—')}</td>
                                        <td class="px-4 py-3 text-gray-900 leading-relaxed">${nl2br(ev.events)}</td>
                                        ${!readonly ? `
                                            <td class="px-3 py-3 text-center whitespace-nowrap miqaat-edit-only">
                                                <button type="button" onclick="window.MiqaatModule.openDailyEventModal('${ev.id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                                                <button type="button" onclick="window.MiqaatModule.deleteDailyEvent('${ev.id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // =========================================================================
    // MASTER RENDERER
    // =========================================================================

    function renderActiveTab() {
        if (!ensureUiMounted()) return;
        updateSubTabButtonStyles();
        const target = document.getElementById('miqaatTabContent');
        if (!target) return;

        const yearSel = document.getElementById('miqaatHijriYearSelect');
        if (yearSel && yearSel.value !== selectedHijriYear) yearSel.value = selectedHijriYear;
        const pill = document.getElementById('miqaatHeaderYearPill');
        if (pill) pill.textContent = `${selectedHijriYear}H`;

        if (activeSubTab === 'dashboard') {
            target.innerHTML = renderDashboardTab();
        } else if (activeSubTab === 'checklist') {
            target.innerHTML = renderChecklistTab();
        } else if (activeSubTab === 'events-details') {
            target.innerHTML = renderEventsDetailsTab();
        } else if (activeSubTab === 'budget') {
            target.innerHTML = renderBudgetTab();
        } else if (activeSubTab === 'daily-events') {
            target.innerHTML = renderDailyEventsTab();
        }
    }

    // =========================================================================
    // MODAL & CRUD ACTIONS
    // =========================================================================

    function openFormModal(titleHtml, bodyHtml, onSubmit) {
        ensureModalsMounted();
        const modal = document.getElementById('miqaatFormModal');
        const titleEl = document.getElementById('miqaatFormModalTitle');
        const bodyEl = document.getElementById('miqaatFormModalBody');
        const formEl = document.getElementById('miqaatFormModalForm');
        titleEl.innerHTML = titleHtml;
        bodyEl.innerHTML = bodyHtml;
        formEl.onsubmit = async (e) => {
            e.preventDefault();
            const ok = await onSubmit(formEl);
            if (ok !== false) modal.classList.add('hidden');
        };
        modal.classList.remove('hidden');
    }

    function closeModal(id) {
        document.getElementById(id)?.classList.add('hidden');
    }

    // --- Venues CRUD ---
    function openVenueModal(gender, venueId = null) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const list = yr.venues[gender] || [];
        const existing = venueId ? list.find(v => v.id === venueId) : null;
        openFormModal(
            `<i class="fa-solid fa-building-columns text-amber-300"></i> ${existing ? 'Edit' : 'Add'} ${gender === 'male' ? 'Male' : 'Female'} Venue`,
            `
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Venue Name *</label>
                    <input type="text" name="name" required value="${escapeHtml(existing?.name || '')}" class="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Student Count</label>
                    <input type="number" name="studentCount" min="0" value="${Number(existing?.studentCount) || 0}" class="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
                </div>
            `,
            async (form) => {
                const name = form.name.value.trim();
                const studentCount = Math.max(0, Number(form.studentCount.value) || 0);
                if (!name) return false;
                if (existing) {
                    existing.name = name;
                    existing.studentCount = studentCount;
                } else {
                    yr.venues[gender].push({ id: genId('v_' + gender), name, studentCount });
                }
                await persistData(existing ? 'Venue updated.' : 'Venue added.');
                renderActiveTab();
            }
        );
    }

    async function updateVenueCount(gender, venueId, val) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const v = (yr.venues[gender] || []).find(item => item.id === venueId);
        if (!v) return;
        v.studentCount = Math.max(0, Number(val) || 0);
        await persistData('Venue student count updated.');
        renderActiveTab();
    }

    async function deleteVenue(gender, venueId) {
        if (isViewOnly() || !confirm('Remove this venue from the list?')) return;
        const yr = getYearData(selectedHijriYear);
        yr.venues[gender] = (yr.venues[gender] || []).filter(v => v.id !== venueId);
        await persistData('Venue removed.');
        renderActiveTab();
    }

    // --- Timetable CRUD ---
    function openTimetableModal(rowId = null) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const existing = rowId ? yr.timetable.find(r => r.id === rowId) : null;
        openFormModal(
            `<i class="fa-solid fa-calendar-week text-amber-300"></i> ${existing ? 'Edit' : 'Add'} Examination Timetable Entry`,
            `
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">English Date *</label>
                        <input type="date" name="englishDate" required value="${escapeHtml(existing?.englishDate || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            onchange="const d=this.value; if(d){ const dt=new Date(d+'T00:00:00'); this.form.day.value=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dt.getDay()]||''; }">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Hijri Date *</label>
                        <input type="text" name="hijriDate" required placeholder="e.g. 6 Rajab 1448" value="${escapeHtml(existing?.hijriDate || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Day</label>
                        <input type="text" name="day" placeholder="Auto-filled" value="${escapeHtml(existing?.day || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-amber-50/70 p-3 rounded-lg border border-amber-200">
                    <div>
                        <label class="block text-xs font-bold text-amber-950 uppercase mb-1"><i class="fa-solid fa-sun text-amber-500 mr-1"></i>Paper 1 (Morning Shift)</label>
                        <input type="text" name="paper1" placeholder="Subject / Paper 1" value="${escapeHtml(existing?.paper1 || '')}" class="w-full p-2 border border-amber-300 rounded-lg text-sm bg-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-amber-950 uppercase mb-1">Morning Timing</label>
                        <input type="text" name="morningTiming" placeholder="e.g. 8:30 AM – 11:30 AM" value="${escapeHtml(existing?.morningTiming || '')}" class="w-full p-2 border border-amber-300 rounded-lg text-sm bg-white">
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-indigo-50/70 p-3 rounded-lg border border-indigo-200">
                    <div>
                        <label class="block text-xs font-bold text-indigo-950 uppercase mb-1"><i class="fa-solid fa-moon text-indigo-500 mr-1"></i>Paper 2 (Evening Shift — Optional)</label>
                        <input type="text" name="paper2" placeholder="Leave blank if single paper" value="${escapeHtml(existing?.paper2 || '')}" class="w-full p-2 border border-indigo-300 rounded-lg text-sm bg-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-indigo-950 uppercase mb-1">Evening Timing</label>
                        <input type="text" name="eveningTiming" placeholder="e.g. 2:30 PM – 5:30 PM" value="${escapeHtml(existing?.eveningTiming || '')}" class="w-full p-2 border border-indigo-300 rounded-lg text-sm bg-white">
                    </div>
                </div>
            `,
            async (form) => {
                const payload = {
                    id: existing ? existing.id : genId('tt'),
                    englishDate: form.englishDate.value.trim(),
                    hijriDate: form.hijriDate.value.trim(),
                    day: form.day.value.trim() || getDayNameFromIso(form.englishDate.value.trim()),
                    paper1: form.paper1.value.trim(),
                    morningTiming: form.morningTiming.value.trim(),
                    paper2: form.paper2.value.trim(),
                    eveningTiming: form.eveningTiming.value.trim()
                };
                if (existing) {
                    Object.assign(existing, payload);
                } else {
                    yr.timetable.push(payload);
                }
                await persistData(existing ? 'Timetable updated.' : 'Exam date added.');
                renderActiveTab();
            }
        );
    }

    async function deleteTimetableRow(rowId) {
        if (isViewOnly() || !confirm('Delete this examination timetable entry?')) return;
        const yr = getYearData(selectedHijriYear);
        yr.timetable = yr.timetable.filter(r => r.id !== rowId);
        await persistData('Timetable entry deleted.');
        renderActiveTab();
    }

    // --- Checklist CRUD & Bulk Import ---
    function openChecklistModal(taskId = null, prefillUserEmail = '') {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const existing = taskId ? yr.checklist.find(t => t.id === taskId) : null;
        const authUsers = getAuthorizedUsers();
        const curUser = getCurrentUserInfo();
        const defaultEmail = existing
            ? matchTaskToUser(existing, authUsers)
            : (prefillUserEmail || curUser.email || (authUsers[0]?.email || ''));

        openFormModal(
            `<i class="fa-solid fa-list-check text-amber-300"></i> ${existing ? 'Edit' : 'Add'} Checklist Task`,
            `
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Item #</label>
                        <input type="text" name="itemNo" value="${escapeHtml(existing?.itemNo || String(yr.checklist.length + 1))}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Category / Area *</label>
                        <input type="text" name="category" required placeholder="e.g. Seating & Furniture" value="${escapeHtml(existing?.category || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Task Description *</label>
                    <textarea name="description" rows="2" required class="w-full p-2 border border-gray-300 rounded-lg text-sm">${escapeHtml(existing?.description || '')}</textarea>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned User *</label>
                        <select name="assigneeEmail" required class="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                            ${authUsers.map(u => `<option value="${escapeHtml(u.email)}" ${u.email === defaultEmail ? 'selected' : ''}>${escapeHtml(u.name)}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Collaborators / Coordinators</label>
                        <input type="text" name="collaborators" value="${escapeHtml(existing?.collaborators || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Quantity / Specs</label>
                        <input type="text" name="quantitySpecs" value="${escapeHtml(existing?.quantitySpecs || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                        <select name="status" class="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                            ${CHECKLIST_STATUSES.map(st => `<option value="${st}" ${(existing?.status || 'Not Started') === st ? 'selected' : ''}>${st}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Priority</label>
                        <select name="priority" class="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                            ${CHECKLIST_PRIORITIES.map(pr => `<option value="${pr}" ${(existing?.priority || 'Medium') === pr ? 'selected' : ''}>${pr}</option>`).join('')}
                        </select>
                    </div>
                </div>
            `,
            async (form) => {
                const chosenEmail = form.assigneeEmail.value.trim().toLowerCase();
                const matchedUser = authUsers.find(u => u.email === chosenEmail);
                const payload = {
                    id: existing ? existing.id : genId('chk'),
                    itemNo: form.itemNo.value.trim(),
                    category: form.category.value.trim(),
                    description: form.description.value.trim(),
                    assigneeEmail: chosenEmail,
                    assigneeName: matchedUser ? matchedUser.name : (existing?.assigneeName || ''),
                    collaborators: form.collaborators.value.trim(),
                    quantitySpecs: form.quantitySpecs.value.trim(),
                    status: form.status.value,
                    priority: form.priority.value
                };
                if (existing) {
                    Object.assign(existing, payload);
                } else {
                    yr.checklist.push(payload);
                }
                await persistData(existing ? 'Task updated.' : 'Task added.');
                renderActiveTab();
            }
        );
    }

    async function updateChecklistField(taskId, field, value) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const task = yr.checklist.find(t => t.id === taskId);
        if (!task) return;
        task[field] = value;
        await persistData(`Task ${field} updated.`);
        renderActiveTab();
    }

    async function reassignChecklistTask(taskId, newUserEmail) {
        if (isViewOnly() || !newUserEmail) return;
        const yr = getYearData(selectedHijriYear);
        const task = yr.checklist.find(t => t.id === taskId);
        const targetUser = getAuthorizedUsers().find(u => u.email === newUserEmail.toLowerCase());
        if (!task || !targetUser) return;
        task.assigneeEmail = targetUser.email;
        task.assigneeName = targetUser.name;
        await persistData(`Task reassigned to ${targetUser.name}.`);
        renderActiveTab();
    }

    async function deleteChecklistTask(taskId) {
        if (isViewOnly() || !confirm('Delete this checklist task?')) return;
        const yr = getYearData(selectedHijriYear);
        yr.checklist = yr.checklist.filter(t => t.id !== taskId);
        await persistData('Checklist task deleted.');
        renderActiveTab();
    }

    function handleChecklistImport(event) {
        const file = event.target?.files?.[0];
        if (!file) return;
        if (typeof window.XLSX === 'undefined') {
            showToast('Excel parser library (XLSX) not loaded.', true);
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const wb = window.XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows = window.XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

                // Find header row matching screenshot columns (Item #, Category / Area, Task Description, Primary Assignee...)
                let headerIdx = -1;
                for (let i = 0; i < Math.min(rows.length, 20); i++) {
                    const norm = rows[i].map(c => String(c || '').trim().toLowerCase());
                    if (norm.some(c => c.includes('task description')) || (norm.some(c => c.includes('category')) && norm.some(c => c.includes('assignee')))) {
                        headerIdx = i;
                        break;
                    }
                }
                if (headerIdx === -1) {
                    showToast('Could not detect checklist header row (expected Task Description / Primary Assignee columns).', true);
                    return;
                }

                const headers = rows[headerIdx].map(c => String(c || '').trim().toLowerCase());
                const colIdx = (keys) => headers.findIndex(h => keys.some(k => h.includes(k)));
                const iItem = colIdx(['item', 'sr', '#']);
                const iCat = colIdx(['category', 'area']);
                const iDesc = colIdx(['task description', 'description', 'task']);
                const iAss = colIdx(['primary assignee', 'assignee']);
                const iCollab = colIdx(['collaborator', 'coordinator']);
                const iQty = colIdx(['quantity', 'specs', 'qty']);
                const iStat = colIdx(['status']);
                const iPrio = colIdx(['priority']);

                const authUsers = getAuthorizedUsers();
                const imported = [];
                for (let r = headerIdx + 1; r < rows.length; r++) {
                    const row = rows[r];
                    const desc = iDesc >= 0 ? String(row[iDesc] || '').trim() : '';
                    if (!desc) continue;
                    const assigneeName = iAss >= 0 ? String(row[iAss] || '').trim() : '';
                    const matchedEmail = matchTaskToUser({ assigneeName }, authUsers);
                    const rawStatus = iStat >= 0 ? String(row[iStat] || '').trim() : 'Not Started';
                    const rawPrio = iPrio >= 0 ? String(row[iPrio] || '').trim() : 'Medium';

                    imported.push({
                        id: genId('chk_imp'),
                        itemNo: iItem >= 0 ? String(row[iItem] || '').trim() : String(imported.length + 1),
                        category: iCat >= 0 ? String(row[iCat] || '').trim() : 'General',
                        description: desc,
                        assigneeName,
                        assigneeEmail: matchedEmail !== '__unassigned__' ? matchedEmail : '',
                        collaborators: iCollab >= 0 ? String(row[iCollab] || '').trim() : '',
                        quantitySpecs: iQty >= 0 ? String(row[iQty] || '').trim() : '',
                        status: CHECKLIST_STATUSES.includes(rawStatus) ? rawStatus : 'Not Started',
                        priority: CHECKLIST_PRIORITIES.includes(rawPrio) ? rawPrio : 'Medium'
                    });
                }

                if (imported.length === 0) {
                    showToast('No valid task rows found in the uploaded file.', true);
                    return;
                }

                const yr = getYearData(selectedHijriYear);
                const replaceExisting = yr.checklist.length > 0 && confirm(`Found ${imported.length} tasks.\n\nClick OK to APPEND to existing ${yr.checklist.length} tasks, or Cancel to REPLACE all existing tasks for ${selectedHijriYear}H.`);
                if (yr.checklist.length === 0 || replaceExisting) {
                    yr.checklist = [...yr.checklist, ...imported];
                } else {
                    yr.checklist = imported;
                }

                await persistData(`Imported ${imported.length} checklist tasks into ${selectedHijriYear}H.`);
                renderActiveTab();
            } catch (err) {
                console.error(err);
                showToast('Failed to parse Excel/CSV file.', true);
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function downloadChecklistTemplate() {
        if (typeof window.XLSX === 'undefined') {
            showToast('Excel library not loaded.', true);
            return;
        }
        const headers = ['Item #', 'Category / Area', 'Task Description', 'Primary Assignee', 'Collaborators / Coordinators', 'Quantity / Specs', 'Status', 'Priority'];
        const sample = [1, 'Seating & Furniture', 'Procurement of Chairs without handles', 'Mustaali Lohawala', 'Huzaifa Rampurawala', '100 Nos', 'Not Started', 'High'];
        const ws = window.XLSX.utils.aoa_to_sheet([headers, sample]);
        const wb = window.XLSX.utils.book_new();
        window.XLSX.utils.book_append_sheet(wb, ws, 'Checklist_Import');
        window.XLSX.writeFile(wb, `Miqaat_Checklist_Template_${selectedHijriYear}H.xlsx`);
    }

    // --- Miqaat Events Details CRUD ---
    function openEventDetailModal(sectionKey, rowId = null) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const list = yr[sectionKey] || [];
        const existing = rowId ? list.find(r => r.id === rowId) : null;
        const sectionTitle = sectionKey === 'eventsTehriri' ? 'Tehriri Imtehan' : 'Other Events During Imtehan';

        openFormModal(
            `<i class="fa-solid fa-clipboard-list text-amber-300"></i> ${existing ? 'Edit' : 'Add'} ${sectionTitle} Entry`,
            `
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Sr No</label>
                        <input type="text" name="srNo" value="${escapeHtml(existing?.srNo || String(list.length + 1))}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <div class="sm:col-span-3">
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Description *</label>
                        <textarea name="description" rows="2" required class="w-full p-2 border border-gray-300 rounded-lg text-sm">${escapeHtml(existing?.description || '')}</textarea>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Hastak (One name per line)</label>
                    <textarea name="hastak" rows="2" class="w-full p-2 border border-gray-300 rounded-lg text-sm">${escapeHtml(existing?.hastak || '')}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Requirements</label>
                    <textarea name="requirements" rows="3" class="w-full p-2 border border-gray-300 rounded-lg text-sm">${escapeHtml(existing?.requirements || '')}</textarea>
                </div>
                <div>
                    <label class="block text-xs font-bold text-yellow-900 uppercase mb-1">Checklist for work to be done</label>
                    <textarea name="checklist" rows="2" class="w-full p-2 border border-yellow-300 bg-yellow-50/50 rounded-lg text-sm">${escapeHtml(existing?.checklist || '')}</textarea>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div class="sm:col-span-2">
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Remarks</label>
                        <input type="text" name="remarks" value="${escapeHtml(existing?.remarks || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <label class="flex items-center gap-2 pt-4 cursor-pointer">
                        <input type="checkbox" name="done" ${existing?.done ? 'checked' : ''} class="h-4 w-4 rounded text-emerald-600">
                        <span class="text-sm font-bold text-gray-800">Mark as Done</span>
                    </label>
                </div>
            `,
            async (form) => {
                const payload = {
                    id: existing ? existing.id : genId('evd'),
                    srNo: form.srNo.value.trim(),
                    description: form.description.value.trim(),
                    hastak: form.hastak.value.trim(),
                    requirements: form.requirements.value.trim(),
                    checklist: form.checklist.value.trim(),
                    remarks: form.remarks.value.trim(),
                    done: form.done.checked
                };
                if (existing) {
                    Object.assign(existing, payload);
                } else {
                    yr[sectionKey].push(payload);
                }
                await persistData(existing ? 'Event entry updated.' : 'Event entry added.');
                renderActiveTab();
            }
        );
    }

    async function toggleEventDetailDone(sectionKey, rowId, checked) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const item = (yr[sectionKey] || []).find(r => r.id === rowId);
        if (!item) return;
        item.done = Boolean(checked);
        await persistData('Checklist status saved.');
    }

    async function deleteEventDetailRow(sectionKey, rowId) {
        if (isViewOnly() || !confirm('Delete this Miqaat event entry?')) return;
        const yr = getYearData(selectedHijriYear);
        yr[sectionKey] = (yr[sectionKey] || []).filter(r => r.id !== rowId);
        await persistData('Event entry deleted.');
        renderActiveTab();
    }

    // --- Budget Single Row CRUD ---
    async function updateBudgetCategory(rowId, newCategory) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const row = (yr.budget || []).find(r => r.id === rowId);
        if (!row) return;
        row.category = newCategory;
        await persistData('Budget category updated.');
    }

    function openBudgetRowModal(rowId = null) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const existing = rowId ? yr.budget.find(r => r.id === rowId) : null;
        const categories = Array.from(new Set([...DEFAULT_BUDGET_CATEGORIES, ...yr.budget.map(r => r.category).filter(Boolean)]));
        const existingItem = existing ? (existing.itemDetails !== undefined ? existing.itemDetails : (existing.item || '')) : '';

        openFormModal(
            `<i class="fa-solid fa-indian-rupee-sign text-amber-300"></i> ${existing ? 'Edit' : 'Add'} Budget Row`,
            `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Category *</label>
                        <select name="category" required class="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                            ${categories.map(c => `<option value="${escapeHtml(c)}" ${(existing?.category || DEFAULT_BUDGET_CATEGORIES[0]) === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-emerald-900 uppercase mb-1">Amount (₹) *</label>
                        <input type="number" step="any" min="0" name="amount" required value="${existing ? computeRowAmount(existing) : 0}" class="w-full p-2 border-2 border-emerald-400 bg-emerald-50 rounded-lg text-sm font-bold text-emerald-950">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Item Details *</label>
                    <input type="text" name="itemDetails" required value="${escapeHtml(existingItem)}" placeholder="Enter item details" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Rate Details</label>
                    <input type="text" name="rateDetails" value="${escapeHtml(existing?.rateDetails || '')}" placeholder="e.g. 100 Nos x ₹250 / day" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Remarks</label>
                    <input type="text" name="remarks" value="${escapeHtml(existing?.remarks || '')}" placeholder="Optional remarks" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                </div>
            `,
            async (form) => {
                const payload = {
                    id: existing ? existing.id : genId('bdg'),
                    category: form.category.value.trim() || DEFAULT_BUDGET_CATEGORIES[0],
                    itemDetails: form.itemDetails.value.trim(),
                    amount: Number(form.amount.value) || 0,
                    rateDetails: form.rateDetails.value.trim(),
                    remarks: form.remarks.value.trim()
                };
                if (existing) {
                    Object.assign(existing, payload);
                } else {
                    yr.budget.push(payload);
                }
                await persistData(existing ? 'Budget row updated.' : 'Budget row added.');
                renderActiveTab();
            }
        );
    }

    async function deleteBudgetRow(rowId) {
        if (isViewOnly() || !confirm('Delete this budget row?')) return;
        const yr = getYearData(selectedHijriYear);
        yr.budget = yr.budget.filter(r => r.id !== rowId);
        await persistData('Budget row deleted.');
        renderActiveTab();
    }

    // --- Budget Excel-Style Full Table Modal ---
    function openFullBudgetModal() {
        if (isViewOnly()) return;
        ensureModalsMounted();
        const yr = getYearData(selectedHijriYear);
        fullBudgetDraftRows = (yr.budget || []).map(r => ({
            id: r.id || genId('bdg'),
            category: r.category || DEFAULT_BUDGET_CATEGORIES[0],
            itemDetails: r.itemDetails !== undefined ? r.itemDetails : (r.item || ''),
            amount: computeRowAmount(r),
            rateDetails: r.rateDetails || '',
            remarks: r.remarks || ''
        }));
        if (fullBudgetDraftRows.length === 0) {
            fullBudgetDraftRows.push({
                id: genId('bdg'),
                category: DEFAULT_BUDGET_CATEGORIES[0],
                itemDetails: '',
                amount: 0,
                rateDetails: '',
                remarks: ''
            });
        }
        document.getElementById('miqaatFullBudgetYearLabel').textContent = `${selectedHijriYear}H`;
        renderFullBudgetDraftGrid();
        document.getElementById('miqaatFullBudgetModal').classList.remove('hidden');
    }

    function renderFullBudgetDraftGrid() {
        const tbody = document.getElementById('miqaatFullBudgetGridBody');
        if (!tbody) return;
        const categories = Array.from(new Set([...DEFAULT_BUDGET_CATEGORIES, ...fullBudgetDraftRows.map(r => r.category).filter(Boolean)]));

        tbody.innerHTML = fullBudgetDraftRows.map((r, idx) => `
            <tr class="border-b border-gray-200 hover:bg-emerald-50/40">
                <td class="p-1.5 text-center font-bold text-gray-500">${idx + 1}</td>
                <td class="p-1.5">
                    <select onchange="window.MiqaatModule.updateFullBudgetCell(${idx}, 'category', this.value)">
                        ${categories.map(c => `<option value="${escapeHtml(c)}" ${(r.category || DEFAULT_BUDGET_CATEGORIES[0]) === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
                    </select>
                </td>
                <td class="p-1.5">
                    <input type="text" value="${escapeHtml(r.itemDetails || '')}" placeholder="Item Details"
                        oninput="window.MiqaatModule.updateFullBudgetCell(${idx}, 'itemDetails', this.value)">
                </td>
                <td class="p-1.5">
                    <input type="number" step="any" min="0" id="miqaatExcelAmt_${idx}" class="text-right font-bold text-emerald-900" value="${computeRowAmount(r)}"
                        oninput="window.MiqaatModule.updateFullBudgetCell(${idx}, 'amount', this.value)">
                </td>
                <td class="p-1.5">
                    <input type="text" value="${escapeHtml(r.rateDetails || '')}" placeholder="Rate Details"
                        oninput="window.MiqaatModule.updateFullBudgetCell(${idx}, 'rateDetails', this.value)">
                </td>
                <td class="p-1.5">
                    <input type="text" value="${escapeHtml(r.remarks || '')}" placeholder="Remarks"
                        oninput="window.MiqaatModule.updateFullBudgetCell(${idx}, 'remarks', this.value)">
                </td>
                <td class="p-1.5 text-center">
                    <button type="button" onclick="window.MiqaatModule.removeFullBudgetDraftRow(${idx})" class="text-red-500 hover:text-red-700 p-1" title="Remove row"><i class="fa-solid fa-xmark"></i></button>
                </td>
            </tr>
        `).join('');

        updateFullBudgetLiveTotal();
    }

    function updateFullBudgetCell(idx, field, val) {
        const row = fullBudgetDraftRows[idx];
        if (!row) return;
        if (field === 'amount') {
            row.amount = Number(val) || 0;
        } else {
            row[field] = val;
        }
        updateFullBudgetLiveTotal();
    }

    function updateFullBudgetLiveTotal() {
        const total = fullBudgetDraftRows.reduce((sum, r) => sum + computeRowAmount(r), 0);
        const el = document.getElementById('miqaatFullBudgetLiveTotal');
        if (el) el.textContent = formatINR(total);
    }

    function addFullBudgetDraftRow() {
        fullBudgetDraftRows.push({
            id: genId('bdg'),
            category: DEFAULT_BUDGET_CATEGORIES[0],
            itemDetails: '',
            amount: 0,
            rateDetails: '',
            remarks: ''
        });
        renderFullBudgetDraftGrid();
    }

    function removeFullBudgetDraftRow(idx) {
        fullBudgetDraftRows.splice(idx, 1);
        renderFullBudgetDraftGrid();
    }

    async function saveFullBudgetGrid() {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        yr.budget = fullBudgetDraftRows
            .filter(r => (r.itemDetails || '').trim() || computeRowAmount(r) > 0)
            .map(r => ({
                id: r.id || genId('bdg'),
                category: (r.category || '').trim() || DEFAULT_BUDGET_CATEGORIES[0],
                itemDetails: (r.itemDetails || '').trim(),
                amount: computeRowAmount(r),
                rateDetails: (r.rateDetails || '').trim(),
                remarks: (r.remarks || '').trim()
            }));
        await persistData(`Saved all ${yr.budget.length} budget rows.`);
        closeModal('miqaatFullBudgetModal');
        renderActiveTab();
    }

    // --- Budget Analysis Chart Modal ---
    function openBudgetAnalysisModal() {
        ensureModalsMounted();
        document.getElementById('miqaatAnalysisYearLabel').textContent = `${selectedHijriYear}H`;
        document.getElementById('miqaatBudgetAnalysisModal').classList.remove('hidden');
        renderBudgetAnalysisChart();
    }

    function setBudgetChartType(type) {
        budgetAnalysisChartType = type === 'pie' ? 'pie' : 'bar';
        const btnBar = document.getElementById('miqaatChartBtnBar');
        const btnPie = document.getElementById('miqaatChartBtnPie');
        if (btnBar && btnPie) {
            btnBar.className = budgetAnalysisChartType === 'bar'
                ? 'px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white'
                : 'px-3.5 py-1.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50';
            btnPie.className = budgetAnalysisChartType === 'pie'
                ? 'px-3.5 py-1.5 text-xs font-bold bg-emerald-700 text-white'
                : 'px-3.5 py-1.5 text-xs font-bold bg-white text-emerald-800 hover:bg-emerald-50';
        }
        renderBudgetAnalysisChart();
    }

    function renderBudgetAnalysisChart() {
        const yr = getYearData(selectedHijriYear);
        const rows = yr.budget || [];
        const byCat = new Map();
        rows.forEach(r => {
            const cat = (r.category || 'Uncategorized').trim() || 'Uncategorized';
            byCat.set(cat, (byCat.get(cat) || 0) + computeRowAmount(r));
        });

        const entries = Array.from(byCat.entries()).sort((a, b) => b[1] - a[1]);
        const grandTotal = entries.reduce((sum, [, val]) => sum + val, 0);

        const totalEl = document.getElementById('miqaatAnalysisGrandTotal');
        if (totalEl) totalEl.textContent = formatINR(grandTotal);

        const canvas = document.getElementById('miqaatBudgetChartCanvas');
        const emptyEl = document.getElementById('miqaatBudgetChartEmpty');
        const summaryEl = document.getElementById('miqaatBudgetCategorySummaryTable');

        if (budgetAnalysisChartInstance) {
            budgetAnalysisChartInstance.destroy();
            budgetAnalysisChartInstance = null;
        }

        if (entries.length === 0) {
            if (canvas) canvas.classList.add('hidden');
            if (emptyEl) emptyEl.classList.remove('hidden');
            if (summaryEl) summaryEl.innerHTML = '';
            return;
        }

        if (canvas) canvas.classList.remove('hidden');
        if (emptyEl) emptyEl.classList.add('hidden');

        const palette = [
            '#059669', '#d97706', '#2563eb', '#dc2626', '#7c3aed',
            '#0891b2', '#db2777', '#65a30d', '#ea580c', '#4f46e5', '#0f766e'
        ];
        const labels = entries.map(([cat]) => cat);
        const values = entries.map(([, amt]) => amt);
        const colors = labels.map((_, i) => palette[i % palette.length]);

        if (typeof window.Chart !== 'undefined' && canvas) {
            budgetAnalysisChartInstance = new window.Chart(canvas.getContext('2d'), {
                type: budgetAnalysisChartType,
                data: {
                    labels,
                    datasets: [{
                        label: 'Category Total (₹)',
                        data: values,
                        backgroundColor: colors,
                        borderColor: '#ffffff',
                        borderWidth: budgetAnalysisChartType === 'pie' ? 2 : 1,
                        borderRadius: budgetAnalysisChartType === 'bar' ? 6 : 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: budgetAnalysisChartType === 'pie',
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const val = Number(ctx.raw) || 0;
                                    const pct = grandTotal > 0 ? ((val / grandTotal) * 100).toFixed(1) : '0.0';
                                    return ` ${ctx.label}: ${formatINR(val)} (${pct}%)`;
                                }
                            }
                        }
                    },
                    scales: budgetAnalysisChartType === 'bar' ? {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (v) => '₹' + Number(v).toLocaleString('en-IN')
                            }
                        }
                    } : undefined
                }
            });
        }

        if (summaryEl) {
            summaryEl.innerHTML = `
                <table class="w-full text-xs sm:text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead class="bg-gray-100 text-gray-700 text-xs uppercase">
                        <tr>
                            <th class="px-3 py-2 text-left">Category</th>
                            <th class="px-3 py-2 text-right">Amount (₹)</th>
                            <th class="px-3 py-2 text-right">Share</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${entries.map(([cat, amt], i) => {
                            const pct = grandTotal > 0 ? ((amt / grandTotal) * 100).toFixed(1) : '0.0';
                            return `
                                <tr>
                                    <td class="px-3 py-2 font-semibold text-gray-800 flex items-center gap-2">
                                        <span class="w-3 h-3 rounded-full inline-block shrink-0" style="background:${palette[i % palette.length]}"></span>
                                        <span>${escapeHtml(cat)}</span>
                                    </td>
                                    <td class="px-3 py-2 text-right font-bold text-emerald-900">${formatINR(amt)}</td>
                                    <td class="px-3 py-2 text-right text-gray-600 font-semibold">${pct}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            `;
        }
    }

    // --- Aqa Maula Daily Events CRUD & Last Year Modal ---
    function openDailyEventModal(eventId = null) {
        if (isViewOnly()) return;
        const yr = getYearData(selectedHijriYear);
        const existing = eventId ? yr.dailyEvents.find(e => e.id === eventId) : null;

        openFormModal(
            `<i class="fa-solid fa-star-and-crescent text-amber-300"></i> ${existing ? 'Edit' : 'Add'} Aqa Maula Daily Event`,
            `
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">English Date *</label>
                        <input type="date" name="englishDate" required value="${escapeHtml(existing?.englishDate || getLocalDateIso(0))}" class="w-full p-2 border border-gray-300 rounded-lg text-sm"
                            onchange="const d=this.value; if(d){ const dt=new Date(d+'T00:00:00'); this.form.day.value=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dt.getDay()]||''; }">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Hijri Date *</label>
                        <input type="text" name="hijriDate" required placeholder="e.g. 6 Rajab 1448" value="${escapeHtml(existing?.hijriDate || '')}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Day</label>
                        <input type="text" name="day" value="${escapeHtml(existing?.day || getDayNameFromIso(existing?.englishDate || getLocalDateIso(0)))}" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Events / Programs * <span class="text-gray-400 font-normal">(Enter multiple events on separate lines)</span></label>
                    <textarea name="events" rows="5" required placeholder="- Morning program...&#10;- Dignitary visit...&#10;- Night program..." class="w-full p-2.5 border border-gray-300 rounded-lg text-sm">${escapeHtml(existing?.events || '')}</textarea>
                </div>
            `,
            async (form) => {
                const payload = {
                    id: existing ? existing.id : genId('dev'),
                    englishDate: form.englishDate.value.trim(),
                    hijriDate: form.hijriDate.value.trim(),
                    day: form.day.value.trim() || getDayNameFromIso(form.englishDate.value.trim()),
                    events: form.events.value.trim()
                };
                if (existing) {
                    Object.assign(existing, payload);
                } else {
                    yr.dailyEvents.push(payload);
                }
                await persistData(existing ? 'Daily event updated.' : 'Daily event added.');
                renderActiveTab();
            }
        );
    }

    async function deleteDailyEvent(eventId) {
        if (isViewOnly() || !confirm('Delete this daily event entry?')) return;
        const yr = getYearData(selectedHijriYear);
        yr.dailyEvents = yr.dailyEvents.filter(e => e.id !== eventId);
        await persistData('Daily event deleted.');
        renderActiveTab();
    }

    function openLastYearEventsModal() {
        ensureModalsMounted();
        lastYearModalMode = '1447h';
        renderLastYearModalContent();
        document.getElementById('miqaatLastYearModal').classList.remove('hidden');
    }

    function setLastYearModalMode(mode) {
        lastYearModalMode = mode;
        renderLastYearModalContent();
    }

    function renderLastYearModalContent() {
        const prevYear = String(Number(selectedHijriYear) - 1);
        const allData = getAllData();
        const prevYearEvents = allData.years?.[prevYear]?.dailyEvents || [];

        const tabsEl = document.getElementById('miqaatLastYearTabs');
        const bodyEl = document.getElementById('miqaatLastYearBody');
        if (!tabsEl || !bodyEl) return;

        tabsEl.innerHTML = `
            <button type="button" onclick="window.MiqaatModule.setLastYearModalMode('1447h')"
                class="px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition ${lastYearModalMode === '1447h' ? 'border-emerald-700 text-emerald-900 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}">
                Imtehaan Tehriri 1447H — Reference Program List
            </button>
            <button type="button" onclick="window.MiqaatModule.setLastYearModalMode('prev-year')"
                class="px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition ${lastYearModalMode === 'prev-year' ? 'border-emerald-700 text-emerald-900 bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}">
                Saved ${prevYear}H Daily Events (${prevYearEvents.length})
            </button>
        `;

        if (lastYearModalMode === '1447h') {
            bodyEl.innerHTML = `
                <div class="mb-3 flex items-center justify-between">
                    <h4 class="text-sm sm:text-base font-extrabold text-gray-900">IMTEHAAN TEHRIRI 1447H - PROGRAM LIST</h4>
                    <span class="text-xs font-semibold text-gray-500">Reference Schedule</span>
                </div>
                <div class="overflow-x-auto border border-gray-300 rounded-xl">
                    <table class="w-full text-xs sm:text-sm border-collapse">
                        <thead>
                            <tr class="text-left font-extrabold text-gray-900 border-b border-gray-300">
                                <th class="px-3 py-2.5 bg-gray-100 border-r border-gray-300 whitespace-nowrap">Hijri Date</th>
                                <th class="px-3 py-2.5 bg-gray-100 border-r border-gray-300 whitespace-nowrap">English Date</th>
                                <th class="px-3 py-2.5 bg-gray-100 border-r border-gray-300 whitespace-nowrap">Day</th>
                                <th class="px-3 py-2.5 bg-orange-200 border-r border-gray-300 min-w-[180px]">Route Program</th>
                                <th class="px-3 py-2.5 bg-blue-300 border-r border-gray-300 min-w-[180px]">Dignitary Visit</th>
                                <th class="px-3 py-2.5 bg-yellow-200 border-r border-gray-300 min-w-[260px]">Night Program Details</th>
                                <th class="px-3 py-2.5 bg-blue-300 whitespace-nowrap">Marol Prog (Q/M/Z)</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-300">
                            ${LAST_YEAR_1447H_PROGRAMS.map(p => `
                                <tr class="align-top">
                                    <td class="px-3 py-2.5 font-bold text-gray-900 bg-white border-r border-gray-300 whitespace-nowrap">${escapeHtml(p.hijriDate)}</td>
                                    <td class="px-3 py-2.5 text-gray-800 bg-white border-r border-gray-300 whitespace-nowrap">${escapeHtml(p.englishDate)}</td>
                                    <td class="px-3 py-2.5 text-gray-800 bg-white border-r border-gray-300 whitespace-nowrap">${escapeHtml(p.day)}</td>
                                    <td class="px-3 py-2.5 bg-orange-100/80 text-gray-900 border-r border-gray-300">${nl2br(p.routeProgram)}</td>
                                    <td class="px-3 py-2.5 bg-blue-100/80 text-gray-900 border-r border-gray-300">${nl2br(p.dignitaryVisit)}</td>
                                    <td class="px-3 py-2.5 bg-yellow-100/80 text-gray-900 border-r border-gray-300">${nl2br(p.nightProgram)}</td>
                                    <td class="px-3 py-2.5 bg-blue-100/80 font-bold text-center text-gray-900 whitespace-nowrap">${escapeHtml(p.marolProg)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            bodyEl.innerHTML = prevYearEvents.length === 0
                ? `<div class="text-center py-10 text-gray-500 text-sm">No saved daily events found for ${prevYear}H yet.</div>`
                : `
                    <table class="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                        <thead class="bg-emerald-900 text-white text-xs uppercase">
                            <tr>
                                <th class="px-4 py-2.5 text-left">English Date</th>
                                <th class="px-4 py-2.5 text-left">Hijri Date</th>
                                <th class="px-4 py-2.5 text-left">Events / Programs</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${prevYearEvents.map(ev => `
                                <tr>
                                    <td class="px-4 py-2.5 font-bold whitespace-nowrap">${formatDisplayDate(ev.englishDate)}</td>
                                    <td class="px-4 py-2.5 font-semibold text-emerald-900 whitespace-nowrap">${escapeHtml(ev.hijriDate || '—')}</td>
                                    <td class="px-4 py-2.5">${nl2br(ev.events)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
        }
    }

    // =========================================================================
    // PUBLIC API EXPOSED TO index.html
    // =========================================================================

    window.MiqaatModule = {
        render: renderActiveTab,
        onDataUpdated: function () {
            const mod = document.getElementById('module-miqaat');
            if (mod && !mod.classList.contains('hidden')) {
                renderActiveTab();
            }
        },
        switchSubTab: function (tabKey) {
            activeSubTab = tabKey;
            renderActiveTab();
        },
        closeModal,

        // Dashboard
        openVenueModal,
        updateVenueCount,
        deleteVenue,
        openTimetableModal,
        deleteTimetableRow,

        // Checklist
        setChecklistFilter: function (key, val) {
            if (key === 'search') checklistSearch = val;
            if (key === 'status') checklistStatusFilter = val;
            if (key === 'priority') checklistPriorityFilter = val;
            renderActiveTab();
        },
        openChecklistModal,
        updateChecklistField,
        reassignChecklistTask,
        deleteChecklistTask,
        handleChecklistImport,
        downloadChecklistTemplate,

        // Miqaat Events Details
        setEventsDetailsSearch: function (val) {
            eventsDetailsSearch = val;
            renderActiveTab();
        },
        openEventDetailModal,
        toggleEventDetailDone,
        deleteEventDetailRow,

        // Budget
        setBudgetFilter: function (key, val) {
            if (key === 'search') budgetSearch = val;
            if (key === 'category') budgetCategoryFilter = val;
            renderActiveTab();
        },
        updateBudgetCategory,
        openBudgetRowModal,
        deleteBudgetRow,
        openFullBudgetModal,
        updateFullBudgetCell,
        addFullBudgetDraftRow,
        removeFullBudgetDraftRow,
        saveFullBudgetGrid,
        openBudgetAnalysisModal,
        setBudgetChartType,

        // Daily Events
        openDailyEventModal,
        deleteDailyEvent,
        openLastYearEventsModal,
        setLastYearModalMode
    };
})();
