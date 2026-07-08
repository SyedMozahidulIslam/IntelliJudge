// 400+ Bangladesh names provided by the user
export const RAW_NAMES = [
  "Salim Rahaman Dipu", "Shahparan Rownak", "Md Wasiul Islam", "Sahriar Hossain Dipto", "Nazmul Hasan",
  "Mehedi Hasan", "Shakhawat Hossain Shoaib", "Isbatul Tahsin", "Readuanul Farid Fahim", "Tanvir Anjum Rakin",
  "Fimu Jinat", "Latifa Rahman Mahi", "Nasib Araf", "Nazifa Tasnim", "Akram Hoque Khan",
  "Ishrak Hossain Toki", "Ra Fee", "Muhammad Naim Khan", "Nuzhat Kamal", "Kawsar Ahmed",
  "Farabi Ahmed Milon", "Anika Hossain", "Md Fazle Rabby", "Mushfiqur Rahman Papon", "Sumaiya Jannat",
  "AB Nirob", "Tanvir Rifat", "NakShatra Sharmili", "আনমনাজেরিন ফিজা", "Afif Aiman",
  "Ibrahim Masum", "Nazmi Akter Sneha", "Honour Chakma", "Burhan Uddin Khan Shuvo", "Fuad Hasan",
  "Arifur Rahman Arif", "মোঃ সাব্বির হোসেন", "Tajul Islam Rudro", "Md. Jobayer Hossain", "Fahim Mojumder",
  "Shamsul Hooda", "Tawhid Avik", "Hasibul Hasib", "Shantanur Rahman", "Mubin Raian",
  "Rabbul Hussein Fahad", "Shahrin Islam Shafi", "Tamim Shadman", "Amit Hasan Khan", "Sajan Sarker",
  "Nafisa Yesmin", "Shakhawat Hossain", "Fowad Hasan", "Shah Riaj Chowdhury", "Mahamudul Hasan Jiyon",
  "Suraiya Akter Sammi", "কায়কোবাদ", "Shahidah Shome", "A.S. Tasin", "Chowdhury Jifam Tahmid",
  "Fahim Rahman", "Mohona Islam Sukonna", "Imtiyaj Muhammad Utsha", "SG Sagor", "Md Arifuzzaman Arif",
  "Kh Raad", "Jaiefa Islam Toma", "Hannan Maruf", "Mohammad Gias Kamal", "Imtiyaz Moohit",
  "Shanawaz Hossain Rishad", "Mohammad Shohag Shahariyar", "Eshaat Alam", "Abir Ahammed Chowdhury", "মারুফ উজ জামান",
  "Tariqul Islam Ayaan", "Md. Salman", "Sayed Arafat", "Rayed Riasat", "Jannatull Fardos",
  "Tanvin Mahmud Tonmoy", "HR RedOne", "Mottasim Billah Sadi", "Ifteza Ahmed", "Rabiul Hasan",
  "Subrina Mehenaz", "Sk Abyad", "Mu Mu", "Md Golam Sarwar", "Jawad Hossen Khan Sihan",
  "Fazle Rabbi", "Fatema Sultana Ratri", "Meem Islam", "Mahedi Hasan Khan", "Israt Jahan",
  "Abdullah Al Mamun", "Syed Shariful", "Urmy Khandaker", "HR Habib", "Nowshin Zaman",
  "MD Ashikul Islam", "Shakila Rowshan", "Sayman Mehedi Pritom", "Fiaz Al Abid", "AS Khan Sakib",
  "Al Sahariar Shawon", "Nafis Anjum Tanim", "Abu Hasib Nirob", "Minul Rekat", "Noorjahan Provati Bhuiya",
  "Hussain Md Sahariyar", "Tamim Bhuiyan", "Arafat Rahaman Jahin", "Fahim Faysal", "Kiron Rahman",
  "Md Mahid Alom", "Md Yeasin Nur Rahman", "Kamrul Islam", "Sayedul Karim", "Iftikhar Ahmed",
  "Maisha Siddiqua Momo", "Najib Hasan Nibir", "Nayeema Islam Nakshi", "Tanbin Nishad", "Islam Saif",
  "A. Al Mahmud Pias", "Maruf Hasan Robin", "S.M Karimul Hassan", "Mahedi Hasan Nishat", "ফাতেমা সুলতানা রাত্রী",
  "Nayem Sarker", "Tarif Ishmam Abdullah", "Ahtesam Ul Hoq Chishti", "Rumi Islam Ruhi", "Md Hasanul Haque Rumman",
  "Sheikh Sifat Roshidi", "Shidratul Muntaha Binte Farooq", "Mh Dîhàñ", "Rakibul Hassan", "Ahamed Shafi",
  "Nomanul Hasan", "ইসবাতুল ইসলাম", "Farzana Masud Bithi", "Md. Rafi", "Irfan Kabir Abir",
  "KH Borhan Siyam", "Bijoy Ghosh", "Sumaiya Monir", "Araf Shawon", "Benzir Ahammed Shawon",
  "Sé Tû", "Moniruzzaman Monir", "Nahiyan Fahad Sayem", "Ashraful Islam", "Shaila Meraz Jhumu",
  "Hindol Ghose", "Hossain Mazumdar", "Ayesha Akter Papia", "Abdullah Hasan", "Miftahul Jannat",
  "MAisha Hassan", "Lamiya Mehzabien", "Mahbub Hassan Emon", "Harun Mazumder Anik", "Rahimul Haque Afrad",
  "Tanha Ahmed Nijhum", "Miraj Hossain", "Taiub Ali", "Tanbir Ahammad Sayem", "Alif Meraj",
  "Shadman Shakib", "A. F. H Dhrubo", "Md. Mahfuzur Shahed", "Jamiul Muhammad Chashi", "Mahmud Hossain",
  "MH Rakib", "Fiad Sarowar", "মোঃ ফজলে রাব্বী", "Masud Rana", "Mejbah Chowdhury Riyadh",
  "MD Ismail Hossain", "Ar Pranto", "Fatema Tuz Johora", "MD AL Rakib", "Morium Bristy",
  "Shakil Ahmed", "Abdullah Jayed", "Morshed Sagor", "Esfer Sami", "Imtiaj Sajin",
  "Kawsar Ahamed Rony", "Manif Orin", "Rashidul Hasan Ratul", "Ashiquar Ãñík", "Md Faiaj Bin Rahman",
  "Salman Farsi", "H R Sifat", "MD Waliullah", "Arafat Tanjim", "Tanvir Ahammed",
  "Kazi Mohammed Zaber", "Faruque Rumi", "Fahad Bhuiyan", "FN Fazle", "Saydul Haque",
  "Ritu Minha", "Dewan M Durnto", "Mainul Kaysar", "MD Rezwan Islam", "Shomrat Nur Sani",
  "Cm Samiul Ayan", "Namira Rahman Barisha", "SU Z An", "Fahmid Hossain Hamim", "Mortoza Hossain Rocky",
  "Maria Islam", "Joy Nandi Jr.", "Nur Esa Miran", "Antara Alim", "Firoza Khatun",
  "Abdulla Al Mamun", "Fahim Muntasir Soumyo", "Tofael Ahamed", "ফজলে রাব্বি", "ماريا موهيني",
  "RiD MaHir", "Shadid Siyam", "Fahim Ahmed", "Sadaf Kibria Sufal", "Rakibul Islam",
  "Tanvir Ann Noor", "Suhajabin Leeyana", "Samiul Nafiz", "Mushfiqur Rashid", "Yaminur Rahman Farib",
  "Tanvir Hasan Prince", "Mithila Mohshin", "Hamim Ruwayfi", "Abu Suffian", "Nujhat Saleh",
  "Sifat Soha Noor", "Nadira Meem", "Md. Abu Sayem", "Fuad Alvi", "Atif Syed",
  "Jabir Mahmud Rifat", "Munshi Hasib", "AvRo E ImRan", "Sumiya Akter", "Muhammad Ikram Khan",
  "Shojib Ahammed", "Symun Shultana", "Trader Sudipta Deb", "Sikder Mahfuz", "Yana Ahmed",
  "Aklima Hakim Anika", "Mahamudul Hasan", "Jannat Jeni", "Md Ferdous Khan", "Zahur Ovi",
  "Ankita Mon", "Ariiyan Raz Nahid", "Rehnaf Leon", "Natasha Ahmed", "Sheikh Sajin",
  "Shawgat Alrazi Supto", "Naimur Rahman", "Šà J Á Ñ", "Sumaya Suimee", "Sumiya Sultana",
  "Adiba Haque Pronidhi", "Argho Utsho", "Asif Chowdhury", "SM Akash", "Md Minul Islam",
  "Sh Ismail", "Dr-Jannatul Ferdous Anny", "Nushrat Jahan Chowdhury", "আমাতুল কারিম", "Tanha Nurain Naba",
  "Shah Amanullah", "Mehran Hossen", "Lutfur Rahman Rana", "Sayed Ibn Matin Sourab", "M TI Rony",
  "Md. Mainul Hasan Mahin", "Adib Hasan", "F. M Abir Hossain", "Sairat Jamin Shefa", "Mushfikur Islam Siam",
  "Munim Mubashshir", "Angel Hafsa", "Ema Afsan", "Iqbalur Rahman", "Afeda Oshîn",
  "Ahammed Sani", "Shahriar Hussain", "A.K. Mohd Hemel Haque", "Hasan Mamun", "বায়তুল আবেদীন বেনিয়াম",
  "Shanjid Haque Shachchaw", "Ashraful Islam Nayem", "R. A. Shah Sultan", "Al Ifran Lam", "Hasibul Hassan",
  "Asif Ahmed", "Tashiqur Rahman Irrfan", "Arif Hossain", "Kazi Iftakher Rahman", "Anysha Shawana Sharif",
  "Mohammad Olid Afzal", "Humayra Afifa Rifa", "Ismail Sunny", "হাসান আল বান্নাহ", "Sakib Al Hasan",
  "MD Shajalal", "Shahdat Hossain", "Sumit Bosu Raj", "Shourov Haque", "Talukder Alif Mahmood",
  "Omar Faruq", "Azfar Sadat Khan", "Opu Sultan", "Minhaz Husain", "Jobair Alam",
  "Ragib Yasir Hashit", "Mehedi Hasan Anim", "Fabiha Tazri Okita", "Jahangir Alam", "Abid Hasan Ovi",
  "Ahamed Ashik Efty", "Syed Tanvila", "KM Hossain", "Anay Sarker", "Md Abu Sayed Sarker",
  "Abdullah", "Rahat Bhuiyan", "Rosul SK", "Shahriar Kabir Turja", "Asraful Islam Ashik",
  "Redowan Khan Hridoy", "Risul Islam Rifat", "Mehedi Ashraf Simanto", "Hadi Uzzaman", "K.M. Mosabbir",
  "Ah Sam", "Ruman Ahmed", "Md Abdur Rauf", "Rid Dat", "Junayed Alauddin",
  "Zihad Abdur Rahman", "Rafsan", "Phunsukh Wangdu", "Joy Sarker", "Abu Yousuf Neshad",
  "Hassan Shuvoo", "Niaz Uddin Rizon", "Iftekher Hossain", "Shamsun Nahar Purnata", "Arif Alam",
  "Adison Rozario", "Ashrafur Rahman Abid", "Mojahidul Islam Rakib", "Amrita Biswas", "Abrar Faiyaz",
  "Nawaz Hossain", "Rajib Ashraf", "Anika Z", "Liyana Lia Ahmed", "Arman Jumon",
  "Afroza Akter Etiy", "Minhuj Uddin Joy", "Juthi Kabir", "Rifat Islam Akash", "Tamjeeda Osman Meghla",
  "Rubayat Sharmin Barna", "Md Sabur Ahammad Khan", "Kazi Rashidun Mahin", "Nure Tasnim", "Safayet Haque Tayef",
  "Sayed Golam Rabbani", "Sha Din", "Chowdhury Reza Tanjim", "Shohrab Uddin", "Mehedi Hasan Shawon",
  "Mahmudul Irfan", "Osama Islam Abir", "Farhana", "Mejbah Ahammad", "Humayun Rashid",
  "Irfan H Sajid", "Muhaimanul Islam Hemal", "MD Ashraful Islam", "JaHid Hasan Chowdhury", "Jamsony Akter Falgon",
  "Shara Mahin", "Nabiul Hossain", "Hossain Arfan Rion", "Shahdia Rahman Raisa", "Mohammad Abdulla",
  "Md. Edrish Prodhan", "Nudrat Fariha Oishee", "Tanjir Ahmed Nadim", "Najmus Sakib", "Nufsat Rifah",
  "Mahadi Hasan", "Saba Mahzabeen", "Mahedi Hasan", "Jowel Rana"
];

// Heuristic engine to classify if a Bangladeshi name is likely Female or Male
export function detectGender(name: string): "Male" | "Female" {
  const femalePatterns = [
    "fatema", "fara", "sumaiya", "jannat", "anika", "nazifa", "fimu", "jinat", "latifa", "mahi", "tasnim",
    "nuzhat", "sharmili", "ফিজা", "sneha", "yesmin", "sammi", "shahidah", "shome", "sukonna", "jaiefa", "toma",
    "subrina", "mehenaz", "ratri", "meem", "israt", "urmy", "rowshan", "nowshin", "shakila", "noorjahan", "provati",
    "maisha", "momo", "nashi", "nakshi", "রাত্রী", "ruhi", "shidratul", "farzana", "bithi", "sumaiya", "monir",
    "jhumu", "shaila", "papia", "ayesha", "miftahul", "lamiya", "mehzabien", "nijhum", "tanha", "marina",
    "mariah", "marit", "bristy", "johora", "morium", "ritu", "minha", "namira", "barisha", "maria", "antara",
    "alim", "firoza", "موهيني", "leeyana", "suhajabin", "mithila", "mohshin", "soha", "nadira", "meem", "sumiya",
    "sultana", "shultana", "yana", "aklima", "jeni", "ankita", "natasha", "suimee", "suhana", "adiba", "pronidhi",
    "anny", "nushrat", "jahan", "নাবিল", "naba", "nurain", "shefa", "sairat", "hafsa", "angel", "ema", "afsan",
    "afeda", "oshin", "anysha", "shawana", "humayra", "afifa", "rifa", "tanvila", "rid", "dat", "purnata", "nahar",
    "amrita", "biswas", "liyana", "lia", "afroza", "eti", "juthi", "kabir", "tamjeeda", "osman", "meghla", "rubayat",
    "sharmin", "barna", "nure", "falgon", "falguni", "jamsony", "shara", "mahin", "shahdia", "raisa", "nudrat",
    "fariha", "oishee", "nufsat", "rifah", "saba", "mahzabeen"
  ];

  const lower = name.toLowerCase();
  for (const pat of femalePatterns) {
    if (lower.includes(pat)) {
      return "Female";
    }
  }
  return "Male";
}

// Generate realistic mock details for an employee
export function createMockEmployee(id: string, name: string, role: any): any {
  const numericId = parseInt(id.replace(/\D/g, "")) || 0;
  const gender = detectGender(name);
  const normalizedName = name.replace(/[^\x20-\x7E\u0980-\u09FF]/g, "").trim();
  
  // Format consistent email and phone
  const emailPart = normalizedName.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
  const email = `${emailPart || "employee" + id}@intellijudge.gov.bd`;
  
  const localCodes = ["017", "018", "019", "015", "016", "013", "014"];
  const selectedCode = localCodes[numericId % localCodes.length];
  const digits = String(Math.floor(10000000 + Math.random() * 90000000));
  const phone = `+88${selectedCode}${digits.slice(0, 8)}`;
  
  const branches = ["Dhaka Main Branch", "Chittagong Divisional", "Sylhet Court Area", "Rajshahi Corporate"];
  const branch = branches[numericId % branches.length];
  
  const startYear = 2018 + (numericId % 8);
  const month = String(1 + (numericId % 12)).padStart(2, "0");
  const day = String(1 + (numericId % 28)).padStart(2, "0");
  const joiningDate = `${startYear}-${month}-${day}`;
  
  const salaryMultiplier = [120000, 95000, 85000, 75000, 65000, 45000, 35000, 25000, 30000, 40000, 18000];
  const index = Math.min(10, numericId % 11);
  const salary = salaryMultiplier[index] + (numericId % 5000);
  
  const statuses = ["Active", "Active", "Active", "On Leave", "Active"];
  const status = statuses[numericId % statuses.length];
  
  const performanceRating = parseFloat((4.0 + (numericId % 11) * 0.1).toFixed(1));

  return {
    id,
    name: normalizedName,
    gender,
    role,
    email,
    phone,
    branch,
    joiningDate,
    salary,
    status,
    performanceRating
  };
}
