// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const DATA = {

  member: {
    name: 'Jordan Lee', initials: 'JL', nrds: '12345678',
    type: 'Residential Broker', district: '4', balance: 79,
    ceCredits: 10, ceTotal: 14, memberSince: '2018',
  },

  events: [
    { id:'e1', day:'6',  mo:'Mar', title:'Public Policy Committee',   type:'meeting',   border:'border-blue',  location:'Zoom · 9:00 AM',          badge:'badge-blue',  badgeText:'Meeting',      btn:'btn-primary', btnText:'RSVP',         credits:null },
    { id:'e2', day:'8',  mo:'Mar', title:'Broker Roundtable',         type:'event',     border:'border-gray',  location:'Association Office, Rm 202 · 9:00 AM', badge:'badge-gray', badgeText:'Event', btn:'btn-secondary', btnText:'Register', credits:null },
    { id:'e3', day:'10', mo:'Mar', title:'Legal Update Webinar',      type:'education', border:'border-green', location:'Webinar · 1:00 PM',         badge:'badge-green', badgeText:'✓ Registered', btn:'btn-success',   btnText:'Join Webinar', credits:'1.5 CE credits' },
    { id:'e4', day:'12', mo:'Mar', title:'Commercial Forum',          type:'event',     border:'border-gray',  location:'Association Office · 11:30 AM', badge:'badge-gray', badgeText:'Event', btn:'btn-secondary', btnText:'Register', credits:null },
    { id:'e5', day:'14', mo:'Mar', title:'Board of Directors',        type:'meeting',   border:'border-amber', location:'Association Office · 10:00 AM · Agenda posted', badge:'badge-amber', badgeText:'RSVP Required', btn:'btn-primary', btnText:'RSVP Now', credits:null },
    { id:'e6', day:'15', mo:'Mar', title:'Regional Networking Summit',type:'event',     border:'border-gray',  location:'Metro Convention Center · All day', badge:'badge-gray', badgeText:'Event', btn:'btn-secondary', btnText:'Register', credits:null },
    { id:'e7', day:'18', mo:'Mar', title:'RPAC Steering Group',       type:'meeting',   border:'border-blue',  location:'Zoom · 2:00 PM',            badge:'badge-red',   badgeText:'RSVP Overdue', btn:'btn-danger', btnText:'Contact Liaison', credits:null },
    { id:'e8', day:'19', mo:'Mar', title:'Young Professionals Mixer', type:'event',     border:'border-gray',  location:'The Rooftop at Main · 5:00 PM', badge:'badge-gray', badgeText:'Event', btn:'btn-secondary', btnText:'Register', credits:null },
  ],

  courses: {
    inProgress: [
      { id:'c1', title:'Fair Housing & Ethics 2026',    credits:2, deadline:'Apr 12, 2026', pct:72, module:'Module 5 of 7', lastActivity:'Feb 24' },
      { id:'c2', title:'Risk Management Essentials',   credits:3, deadline:'Jun 30, 2026', pct:15, module:'Module 1 of 6', lastActivity:'Feb 10' },
    ],
    available: [
      { id:'c3', title:'Agency Law Update 2026',                credits:2, format:'Online self-paced', price:'$49' },
      { id:'c4', title:'Commercial Real Estate Fundamentals',   credits:4, format:'3-day in-person',   price:'$89' },
      { id:'c5', title:'Social Media Marketing for Agents',     credits:1, format:'Webinar',            price:'Free' },
      { id:'c6', title:'Legal Update 2026',                     credits:2, format:'Webinar',            price:'Included' },
    ],
    completed: [
      { title:'Agency Disclosure Refresher',   date:'Feb 20, 2026', credits:2 },
      { title:'Code of Ethics 2025',           date:'Jan 15, 2026', credits:3 },
      { title:'Fair Housing Fundamentals',     date:'Aug 3, 2025',  credits:3 },
    ],
  },

  meetings: [
    { date:'Mar 5',  title:'RPAC Steering Group',          location:'Zoom · 2:00 PM',               committee:'Advocacy',    role:'Member',     dot:'#dc2626', status:'badge-red',   statusText:'RSVP Overdue',  btnText:'Contact Liaison', btnClass:'btn-danger' },
    { date:'Mar 6',  title:'Public Policy Committee',      location:'Zoom · 9:00 AM',               committee:'Govt Affairs',role:'Member',     dot:'#1d4ed8', status:'badge-blue',  statusText:'Open',          btnText:'RSVP',            btnClass:'btn-primary', id:'m2' },
    { date:'Mar 11', title:'Education Advisory Board',     location:'Assoc. Office · 10:00 AM',     committee:'Education',   role:'Vice Chair', dot:'#059669', status:'badge-green', statusText:'Confirmed',     btnText:'View Agenda',     btnClass:'btn-secondary' },
    { date:'Mar 14', title:'Board of Directors',           location:'Assoc. Office · 10:00 AM',     committee:'Governance',  role:'Member',     dot:'#d97706', status:'badge-amber', statusText:'RSVP Needed',   btnText:'RSVP',            btnClass:'btn-primary', id:'m4' },
    { date:'Mar 22', title:'Community Outreach Committee', location:'Zoom · 3:00 PM',               committee:'Outreach',    role:'Member',     dot:'#8b5cf6', status:'badge-blue',  statusText:'Open',          btnText:'RSVP',            btnClass:'btn-primary', id:'m5' },
    { date:'Mar 28', title:'Legislative Breakfast',        location:'Policy Center · 8:00 AM',      committee:'Policy',      role:'Member',     dot:'#0891b2', status:'badge-blue',  statusText:'Open',          btnText:'RSVP',            btnClass:'btn-primary' },
  ],

  members: [
    { id:'m1', initials:'AM', color:'#1d4ed8', name:'Avery Morgan',    designation:'GRI',  specialty:'Residential Broker', district:'4', nrds:'23456789', email:'avery.morgan@example.com',   phone:'(555) 234-5678', memberSince:'2015', committees:['Government Affairs','Education Advisory'], bio:'Avery has been a licensed broker in District 4 for over 11 years, specializing in residential transactions. Former finance committee member and active RPAC contributor.' },
    { id:'m2', initials:'MP', color:'#059669', name:'Morgan Patel',    designation:'MAI',  specialty:'Appraisal Specialist',district:'2', nrds:'34567890', email:'morgan.patel@example.com',   phone:'(555) 345-6789', memberSince:'2012', committees:['Professional Standards'], bio:'Morgan holds the MAI designation and has 14 years of experience in residential and commercial appraisal. Serves on the Professional Standards panel.' },
    { id:'m3', initials:'SK', color:'#7c3aed', name:'Sage Kim',        designation:'CPM',  specialty:'Property Management', district:'5', nrds:'45678901', email:'sage.kim@example.com',        phone:'(555) 456-7890', memberSince:'2019', committees:['Community Outreach'], bio:'Sage manages a portfolio of over 200 residential units and is a Certified Property Manager. Active in community outreach and tenant-landlord policy advocacy.' },
    { id:'m4', initials:'CR', color:'#b45309', name:'Chris Rivera',    designation:'CCIM', specialty:'Commercial',          district:'1', nrds:'56789012', email:'chris.rivera@example.com',    phone:'(555) 567-8901', memberSince:'2010', committees:['Commercial Real Estate','Risk Management'], bio:'Chris is a CCIM-designated commercial broker with 16 years of experience in office and retail leasing. Co-chairs the Commercial Real Estate committee.' },
    { id:'m5', initials:'TB', color:'#0891b2', name:'Taylor Brooks',   designation:'ABR',  specialty:"Buyer's Agent",       district:'4', nrds:'67890123', email:'taylor.brooks@example.com',   phone:'(555) 678-9012', memberSince:'2020', committees:['Young Professionals Network'], bio:"Taylor is an Accredited Buyer's Representative focused on first-time homebuyers in District 4. Active in the YPN and NAR mentorship programs." },
    { id:'m6', initials:'SN', color:'#be185d', name:'Sam Nguyen',      designation:'SRS',  specialty:"Seller's Rep",        district:'3', nrds:'78901234', email:'sam.nguyen@example.com',      phone:'(555) 789-0123', memberSince:'2017', committees:['Government Affairs'], bio:"Sam holds the Seller Representative Specialist designation and has closed over 300 residential listings. Advocates for seller's rights in local legislative efforts." },
  ],

  invoices: [
    { id:'i1', num:'#5021', desc:'MLS Analytics Add-on',     amount:79,  due:'Mar 30, 2026', paid:false },
    { id:'i2', num:'#4812', desc:'MLS Annual Subscription',  amount:320, due:'Feb 28, 2026', paid:true  },
    { id:'i3', num:'#4633', desc:'2026 Association Dues',     amount:195, due:'Jan 15, 2026', paid:true  },
    { id:'i4', num:'#4201', desc:'CE Course: Fair Housing',   amount:49,  due:'Oct 3, 2025',  paid:true  },
  ],

  elections: [
    { id:'el1', title:'Association Treasurer', subtitle:'Select 1 candidate', multi:false,
      candidates: [
        { id:'sarah', name:'Sarah Mitchell', bio:'Current CFO of Mitchell Realty Group. 12 years of association involvement, former Finance Committee chair.' },
        { id:'david', name:'David Chen',     bio:'Independent broker with corporate finance background. Board member since 2021, known for budget transparency initiatives.' },
      ]
    },
    { id:'el2', title:'At-Large Director (2 seats)', subtitle:'Select up to 2 candidates', multi:true,
      candidates: [
        { id:'avery',  name:'Avery Morgan',     bio:'Residential broker, District 4. Focuses on member education and professional standards.' },
        { id:'marcus', name:'Marcus Washington', bio:'Commercial real estate, District 1. Advocates for small brokerage support programs.' },
        { id:'priya',  name:'Priya Patel',       bio:'Property management specialist, District 5. Champions technology modernization for members.' },
        { id:'tom',    name:'Tom Bradley',       bio:'Veteran broker, District 3. Strong focus on legislative advocacy and RPAC engagement.' },
      ]
    },
  ],

  products: [
    { id:'p1', icon:'📄', name:'2026 Contract Forms Bundle',    desc:'Complete set of updated residential and commercial contract forms, including all 2026 legislative revisions.',      price:49,  priceText:'$49',  free:false },
    { id:'p2', icon:'📚', name:'Broker Compliance Toolkit',     desc:'Step-by-step compliance checklists, disclosure templates, and office policy guides. Digital download.',           price:29,  priceText:'$29',  free:false },
    { id:'p3', icon:'📷', name:'Social Media Brand Assets',     desc:'REALTOR® branded Canva templates for social media. Editable graphics for listings, market updates, and more.',    price:0,   priceText:'Free', free:true  },
    { id:'p4', icon:'📊', name:'Market Report Template',        desc:'Excel and PDF market report templates. Customizable for your district, includes data visualization charts.',       price:15,  priceText:'$15',  free:false },
    { id:'p5', icon:'📋', name:'Professional Standards Guide',  desc:'Comprehensive PDF covering Code of Ethics, grievance procedures, and professional standards best practices.',       price:19,  priceText:'$19',  free:false },
    { id:'p6', icon:'🚩', name:'REALTOR® Yard Signs (10-pack)', desc:'Durable aluminum yard signs with REALTOR® branding. Ships within 5 business days. Customization available.',       price:89,  priceText:'$89',  free:false },
  ],

  ssoServices: [
    { icon:'🏠', name:'Matrix MLS',                  desc:'Access listings, CMA tools, market data, and client search portals. Synced with your NRDS#.' },
    { icon:'📄', name:'zipForm Plus',                desc:'Digital forms, contracts, and e-signatures for residential and commercial transactions.' },
    { icon:'🔄', name:'DotLoop',                     desc:'Transaction management, document storage, and e-signature workflows for your office.' },
    { icon:'📅', name:'ShowingTime',                 desc:'Schedule and manage property showings, confirmations, and agent feedback in one place.' },
    { icon:'📈', name:'RPR — Realtors Property Resource', desc:'Market insights, property valuations, neighborhood data, and prospecting tools. NAR member benefit.' },
    { icon:'🏅', name:'C2EX',                        desc:'Commitment to Excellence — track and fulfill your Code of Ethics training requirements.' },
  ],

  contributions: [
    { date:'Dec 1, 2025',  amount:'$100', campaign:'Annual RPAC Pledge' },
    { date:'Aug 15, 2025', amount:'$50',  campaign:'Housing Trust Fund' },
    { date:'Mar 20, 2025', amount:'$50',  campaign:'Legislative Action Fund' },
    { date:'Nov 5, 2024',  amount:'$100', campaign:'Annual RPAC Pledge' },
  ],

  activity: [
    { dot:'#059669', text:'<strong>Invoice #4812 paid</strong> — MLS Annual Subscription $320', sub:'Billing · Auto-pay ACH 0402',             time:'Feb 28' },
    { dot:'#1d4ed8', text:'<strong>Registered:</strong> Legal Update Webinar — Mar 10, 1:00 PM',sub:'Calendar · 1.5 CE credits',               time:'Feb 25' },
    { dot:'#8b5cf6', text:'<strong>Course completed:</strong> Agency Disclosure Refresher — 2 CE credits earned', sub:'Education · Certificate available', time:'Feb 20' },
    { dot:'#d97706', text:'<strong>Committee application submitted</strong> — Education Advisory Board 2026', sub:'Committees · Under review',  time:'Feb 18' },
  ],

};
