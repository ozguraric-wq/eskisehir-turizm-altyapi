// Published EBB timetable snapshot, retrieved 2026-09-08. Not a live vehicle feed.
// Times are terminal departures; intermediate timings are estimated separately.
import type { District, Zone } from "./types";
export type ServiceGroup = "weekday" | "saturday" | "sunday";
export interface BusRecord { id: number; number: string; zone: Zone; district: District; source: string; updated: string; directions: {terminal: string; runs: {at: number; group: ServiceGroup; condition: string}[]}[]; routes: string[][]; notes: string[]; }
export const TRANSIT_CHECKED_ON = "2026-09-08";
export const BUS_SOURCE = "https://www.eskisehir.bel.tr/otobus-saatleri";
export const TRAM_SOURCE = "https://www.estram.com.tr/sefer-sklik.php?cat_icerik=5";
export const TRAM_MAP_SOURCE = "https://www.estram.com.tr/sayfalar.php?sayfalar_id=19";
export const ESTRAM_MOBILE_SOURCE = "https://www.estram.com.tr/sayfalar.php?sayfalar_id=23";
export const buses: BusRecord[] = [
  {
    "id": 105,
    "number": "87",
    "zone": "alpu",
    "district": "Alpu",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=105&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1040,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "ALPU İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "KARTAL KAVŞAĞI",
        "SİVRİHİSAR 2 CD.",
        "KIRIM CD.",
        "HASAN POLATKAN CD.",
        "YUNUS EMRE CD.",
        "CUMHURİYET BLV.",
        "BALSU CD.",
        "ALPU KAVŞAĞI",
        "* SEVİNÇ MH.",
        "AĞAPINAR MH.",
        "ALPU İLÇESİ"
      ],
      [
        "ALPU İLÇESİ",
        "AĞAPINAR MH.",
        "SEVİNÇ MH.",
        "* ALPU KAVŞAĞI",
        "BALSU CD.",
        "CUMHURİYET BLV.",
        "YUNUS EMRE CD.",
        "SİVRİHİSAR 1 CD.",
        "SİVRİHİSAR 2 CD.",
        "KARTAL KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T2 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 106,
    "number": "88",
    "zone": "beylikova",
    "district": "Beylikova",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=106&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1030,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1030,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "BEYLİKOVA İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "DOĞANKAYA SK.",
        "NAKIŞ SK.",
        "DEDEOĞLU SK.",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇEVRE YOLU",
        "ESKİŞEHİR-ANKARA YOLU",
        "BALÇIKHİSAR MH.",
        "BEYLİKOVA YOLU",
        "BEYLİKOVA İLÇESİ"
      ],
      [
        "BEYLİKOVA İLÇESİ",
        "BEYLİKOVA YOLU",
        "BALÇIKHİSAR MH.",
        "ESKİŞEHİR-ANKARA YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "DOĞANKAYA SK.",
        "NAKIŞ SK.",
        "DEDEOĞLU SK.",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 107,
    "number": "90",
    "zone": "gunyuzu",
    "district": "Günyüzü",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=107&menu_id=57",
    "updated": "",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "GÜNYÜZÜ İLÇESİ",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "SİVRİHİSAR İLÇESİ",
        "ANKARA-ESKİŞEHİR YOLU",
        "GÜNYÜZÜ YOLU",
        "HAMAMKARAHİSAR MH.",
        "GÜNYÜZÜ YOLU",
        "GÜNYÜZÜ İLÇESİ"
      ],
      [
        "GÜNYÜZÜ İLÇESİ",
        "GÜNYÜZÜ YOLU",
        "HAMAMKARAHİSAR MH.",
        "GÜNYÜZÜ YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "SİVRİHİSAR İLÇESİ",
        "ANKARA-ESKİŞEHİR YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T4 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "KIŞ DÖNEMİ BOYUNCA KIRMIZI 90 NUMARALI HAT İLE TEK ARAÇLA HİZMET VERECEKTİR.",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 108,
    "number": "91",
    "zone": "han",
    "district": "Han",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=108&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1040,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1040,
            "group": "saturday",
            "condition": "unverified"
          }
        ]
      },
      {
        "terminal": "HAN İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": "unverified"
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "KARTAL KAVŞAĞI",
        "BORSA CD.",
        "CUMHURİYET BLV.",
        "ATATÜRK BLV.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ZÜMRÜT CD.",
        "ESKİŞEHİR SEYİTGAZİ YOLU",
        "ESKİŞEHİR-AFYON YOLU",
        "SEYİTGAZİ İLÇESİ",
        "CEVİZLİ MH.",
        "BARDAKÇI MH.",
        "HANKARAAĞAÇ MH.",
        "AKDERE MH.",
        "KAYI MH.",
        "AĞLARCA MH.",
        "GÖKÇEKUYU MH.",
        "TEPEKÖY MH.",
        "ERTEN MH.",
        "HAN İLÇESİ"
      ],
      [
        "HAN İLÇESİ",
        "ERTEN MH.",
        "TEPEKÖY MH.",
        "GÖKÇEKUYU MH.",
        "AĞLARCA MH.",
        "KAYI MH.",
        "AKDERE MH.",
        "HANKARAAĞAÇ MH.",
        "BARDAKÇI MH.",
        "CEVİZLİ MH.",
        "SEYİTGAZİ İLÇESİ",
        "ESKİŞEHİR-AFYON YOLU",
        "ESKİŞEHİR SEYİTGAZİ YOLU",
        "ZÜMRÜT CD.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ATATÜRK BLV.",
        "CUMHURİYET BLV.",
        "BORSA CD.",
        "KARTAL KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "HAN:08:00, ODUNPAZARI:17:30 HAREKET SAATLERİNDE; HAN İLÇESİ-ERTEN-TEPEKÖY-GÖKÇEKUYU-HAN KARAAĞAÇ-BARDAKÇI-CEVİZLİ-SEYİTGAZİ İLÇESİ-ODUNPAZARI GÜZERGAHINDA ÇALIŞIR.",
      "HAN:08:00, ODUNPAZARI 17:30 HAREKET SAATLERİNDE; HAN İLÇESİ-AĞLARCA-KAYI-AKDERE-HAN KARAAĞAÇ-BARDAKÇI-CEVİZLİ-SEYİTGAZİ İLÇESİ-ODUNPAZARI GÜZERGAHINDA ÇALIŞIR.",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 109,
    "number": "94",
    "zone": "mihalgazi",
    "district": "Mihalgazi",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=109&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 600,
            "group": "weekday",
            "condition": "fridaySaturday"
          },
          {
            "at": 600,
            "group": "saturday",
            "condition": "fridaySaturday"
          },
          {
            "at": 1030,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1030,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1080,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      },
      {
        "terminal": "MİHALGAZİ İLÇESİ",
        "runs": [
          {
            "at": 510,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 510,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 840,
            "group": "weekday",
            "condition": "fridaySaturday"
          },
          {
            "at": 840,
            "group": "saturday",
            "condition": "fridaySaturday"
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "SARICAKAYA CD.",
        "IŞIK CD.",
        "BİLGİN SK.",
        "CUMHURİYET CD.",
        "PARK SK.",
        "ILICA CD.",
        "130 SK.",
        "MİHALGAZİ YOLU",
        "HEKİMDAĞI MH.",
        "449 SK.",
        "MİHALGAZİ YOLU",
        "SAKARI ILICA KAPLICALARI",
        "SAKARI ILICA MH.",
        "KAPLICA CD.",
        "BOZANİÇ MH.",
        "KÖPRÜ CD.",
        "ATATÜRK CD.",
        "MİHALGAZİ İLÇESİ"
      ],
      [
        "MİHALGAZİ İLÇESİ",
        "ATATÜRK CD.",
        "KÖPRÜ CD.",
        "BOZANİÇ MH.",
        "KAPLICA CD.",
        "SAKARI ILICA MH.",
        "SAKARI ILICA KAPLICALARI",
        "MİHALGAZİ YOLU",
        "449 SK.",
        "HEKİMDAĞI MH.",
        "MİHALGAZİ YOLU",
        "130 SK.",
        "ILICA CD.",
        "PARK SK.",
        "CUMHURİYET CD.",
        "SARICAKAYA CD.",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "BELİRTİLEN SAATLER CUMA VE CUMARTESİ GÜNLERİ HİZMET VERECEKTİR.",
      "OKULLARIN AÇIK OLDUĞU DÖNEMLERDE CUMA GÜNLERİ OTOGARDAN 18:00?DE HAREKET EDECEKTİR.",
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 110,
    "number": "95",
    "zone": "mihaliccik",
    "district": "Mihalıççık",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=110&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "MİHALIÇÇIK İLÇESİ",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ALPU KAVŞAĞI",
        "ESKİŞEHİR-ALPU YOLU",
        "SEVİNÇ MH.",
        "AĞAPINAR MH.",
        "ALPU İLÇESİ",
        "ALPU MİHALIÇÇIK YOLU",
        "YUKARI DOĞANOĞLU MH.",
        "AŞAĞI DUDAŞ MH.",
        "KAYI MH.",
        "MİHALIÇÇIK İLÇESİ"
      ],
      [
        "MİHALIÇÇIK İLÇESİ",
        "ALPU MİHALIÇÇIK YOLU",
        "KAYI MH.",
        "AŞAĞI DUDAŞ MH.",
        "YUKARI DOĞANOĞLU MH.",
        "ALPU İLÇESİ",
        "ESKİŞEHİR-ALPU YOLU",
        "AĞAPINAR MH.",
        "SEVİNÇ MH.",
        "ALPU KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T4 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 111,
    "number": "96",
    "zone": "saricakaya",
    "district": "Sarıcakaya",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=111&menu_id=57",
    "updated": "2025-09-26",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1030,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1030,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1080,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      },
      {
        "terminal": "SARICAKAYA İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "SARICAKAYA CD.",
        "ESKİŞEHİR-SARICAKAYA YOLU",
        "YARIMCA MH.",
        "DAĞKÜPLÜ MH.",
        "MAYISLAR MH.",
        "İĞDİR MH.",
        "HÜRRİYET CD.",
        "SARICAKAYA İLÇESİ"
      ],
      [
        "SARICAKAYA İLÇESİ",
        "HÜRRİYET CD.",
        "İĞDİR MH.",
        "MAYISLAR MH.",
        "DAĞKÜPLÜ MH.",
        "YARIMCA MH.",
        "ESKİŞEHİR-SARICAKAYA YOLU",
        "SARICAKAYA CD.",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "OKULLARIN AÇIK OLDUĞU DÖNEMLERDE CUMA GÜNLERİ OTOGARDAN 18:00?DE HAREKET EDECEKTİR.",
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 26.09.2025",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 112,
    "number": "97",
    "zone": "seyit",
    "district": "Seyitgazi",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=112&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1040,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "SEYİTGAZİ İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "KARTAL KAVŞAĞI",
        "BORSA CD.",
        "CUMHURİYET BLV.",
        "ATATÜRK BLV.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ZÜMRÜT CD.",
        "ESKİŞEHİR SEYİTGAZİ YOLU",
        "ESKİŞEHİR-AFYON YOLU",
        "SEYİTGAZİ İLÇESİ"
      ],
      [
        "SEYİTGAZİ İLÇESİ",
        "ESKİŞEHİR-AFYON YOLU",
        "ESKİŞEHİR SEYİTGAZİ YOLU",
        "ZÜMRÜT CD.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ATATÜRK BLV.",
        "CUMHURİYET BLV.",
        "BORSA CD.",
        "KARTAL KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T2 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 113,
    "number": "98",
    "zone": "sivri",
    "district": "Sivrihisar",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=113&menu_id=57",
    "updated": "2024-12-30",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "SİVRİHİSAR İLÇESİ",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "SİVRİHİSAR İLÇESİ"
      ],
      [
        "SİVRİHİSAR İLÇESİ",
        "ANKARA-ESKİŞEHİR YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T4 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 30.12.2024",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 114,
    "number": "89",
    "zone": "cifteler",
    "district": "Çifteler",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=114&menu_id=57",
    "updated": "2024-12-30",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1050,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1050,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "ÇİFTELER İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "HAMİDİYE KAVŞAĞI",
        "ESKİŞEHİR-KONYA YOLU",
        "ÇİFTELER İLÇESİ"
      ],
      [
        "ÇİFTELER İLÇESİ",
        "ESKİŞEHİR-KONYA YOLU",
        "HAMİDİYE KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 30.12.2024",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 116,
    "number": "93",
    "zone": "mahmudiye",
    "district": "Mahmudiye",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=116&menu_id=57",
    "updated": "2024-12-30",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1050,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1050,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "MAHMUDİYE İLÇESİ",
        "runs": [
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "HAMİDİYE KAVŞAĞI",
        "ESKİŞEHİR-KONYA YOLU",
        "ESKİŞEHİR CD.",
        "MAHMUDİYE İLÇESİ"
      ],
      [
        "MAHMUDİYE İLÇESİ",
        "ESKİŞEHİR CD.",
        "ESKİŞEHİR-KONYA YOLU",
        "HAMİDİYE KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ŞEHİR HASTANESİ",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "T2 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 30.12.2024",
      "PAZAR GÜNLERİ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 117,
    "number": "101",
    "zone": "yunus",
    "district": "Mihalıççık",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=117&menu_id=57",
    "updated": "2023-10-15",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "YUNUS EMRE MH.",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ALPU KAVŞAĞI",
        "SEVİNÇ MH.",
        "AĞAPINAR MH.",
        "ALPU İLÇESİ",
        "ALPU MİHALIÇÇIK YOLU",
        "BOZAN MH.",
        "BOZAN BEYLİKOVA YOLU",
        "İSTASYON CD.",
        "İSMET İNÖNÜ CD.",
        "BEYLİKOVA İLÇESİ",
        "EMİRCİK MH.",
        "YENİYURT MH.",
        "YALINLI MH.",
        "ADAHİSAR MH.",
        "YUNUS EMRE MH."
      ],
      [
        "YUNUS EMRE MH.",
        "ADAHİSAR MH.",
        "YALINLI MH.",
        "YENİYURT MH.",
        "EMİRCİK MH.",
        "BEYLİKOVA İLÇESİ",
        "İSMET İNÖNÜ CD.",
        "İSTASYON CD.",
        "BOZAN BEYLİKOVA YOLU",
        "BOZAN MH.",
        "ALPU MİHALIÇÇIK YOLU",
        "ALPU İLÇESİ",
        "AĞAPINAR MH.",
        "SEVİNÇ MH.",
        "ALPU KAVŞAĞI",
        "ÇEVRE YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.10.2023",
      "T3 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "PAZAR GÜNLERİ ÇALIŞMASI YOKTUR."
    ]
  },
  {
    "id": 135,
    "number": "90 Kırmızı",
    "zone": "kayakent",
    "district": "Günyüzü",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=135&menu_id=57",
    "updated": "2024-12-30",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "KAYAKENT MH.",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "ÇEVRE YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "SİVRİHİSAR İLÇESİ",
        "ANKARA-ESKİŞEHİR YOLU",
        "GÜNYÜZÜ YOLU",
        "HAMAMKARAHİSAR MH.",
        "GÜNYÜZÜ YOLU",
        "GÜNYÜZÜ İLÇESİ",
        "GÜMÜŞKONAK MH.",
        "KAYAKENT MH."
      ],
      [
        "KAYAKENT MH.",
        "GÜMÜŞKONAK MH.",
        "GÜNYÜZÜ İLÇESİ",
        "GÜNYÜZÜ YOLU",
        "HAMAMKARAHİSAR MH.",
        "GÜNYÜZÜ YOLU",
        "ANKARA-ESKİŞEHİR YOLU",
        "SİVRİHİSAR İLÇESİ",
        "ANKARA-ESKİŞEHİR YOLU",
        "ÇEVRE YOLU",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ÇAVDARLAR SK.",
        "ŞEHİR HASTANESİ",
        "ŞEHİR HASTANESİ KAVŞAĞI",
        "ANKARA-ESKİŞEHİR YOLU",
        "OTOGAR"
      ]
    ],
    "notes": [
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 30.12.2024",
      "T4 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "PAZAR GÜNÜ ÇALIŞMASI YOKTUR"
    ]
  },
  {
    "id": 156,
    "number": "OtobEs26",
    "zone": "sazova",
    "district": "Tepebaşı",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=156&menu_id=57",
    "updated": "",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 500,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 500,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 540,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 580,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 540,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 580,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 620,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 620,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 700,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 700,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 740,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 740,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 780,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 820,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 780,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 820,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 860,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 860,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 900,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 940,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 900,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 940,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 980,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 980,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1060,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1060,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1100,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1100,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1140,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1140,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1180,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1220,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1220,
            "group": "sunday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 480,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 520,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 520,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 560,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 560,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 600,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 640,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 600,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 640,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 680,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 680,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 720,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 760,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 720,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 760,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 800,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 800,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 840,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 880,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 840,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 880,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 920,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 920,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 960,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1000,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 960,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1000,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1080,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1120,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1080,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1120,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1160,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1160,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "sunday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "KENTPARK",
        "AŞK ADASI",
        "AKM (ATATÜRK KÜLTÜR MERKEZİ)",
        "ODUNPAZARI EVLERİ",
        "ETİ ARKEOLOJİ MÜZESİ",
        "UĞUR MUMCU PARKI",
        "AKTİF YAŞAM PARKI",
        "SAZOVA PARKI",
        "DEVRİM ARABASI",
        "TREN GARI",
        "VECİHİ HÜRKUŞ PARKI",
        "HALLER",
        "ADALAR",
        "OPERA",
        "KENTPARK",
        "OTOGAR"
      ],
      [
        "OTOGAR",
        "KENTPARK",
        "OPERA",
        "ADALAR",
        "HALLER",
        "VECİHİ HÜRKUŞ PARKI",
        "TREN GARI",
        "DEVRİM ARABASI",
        "SAZOVA PARKI",
        "AKTİF YAŞAM PARKI",
        "UĞUR MUMCU PARKI",
        "ETİ ARKEOLOJİ MÜZESİ",
        "ODUNPAZARI EVLERİ",
        "AKM (ATATÜRK KÜLTÜR MERKEZİ)",
        "AŞK ADASI",
        "KENTPARK",
        "OTOGAR"
      ]
    ],
    "notes": [
      "CUMARTESİ - PAZAR GÜNLERİ HİZMET VERMEKTEDİR.",
      "KART ÜCRETİ : 180 TL"
    ]
  },
  {
    "id": 23,
    "number": "17",
    "zone": "sazova",
    "district": "Tepebaşı",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=23&menu_id=57",
    "updated": "2024-09-23",
    "directions": [
      {
        "terminal": "BADEMLİK",
        "runs": [
          {
            "at": 405,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 440,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 525,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 620,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 670,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 720,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 770,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 820,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 870,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 920,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 980,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1100,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1160,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1240,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1320,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1395,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      },
      {
        "terminal": "SAZOVA MH.",
        "runs": [
          {
            "at": 375,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 405,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 440,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 525,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 620,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 670,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 720,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 770,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 820,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 870,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 920,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 980,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1040,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1100,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1160,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1280,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1360,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      }
    ],
    "routes": [
      [
        "BADEMLİK",
        "ESOGÜ BADEMLİK KAMPÜSÜ",
        "JANDARMA ALAY K.LIĞI.",
        "DEVETEPESİ SK.",
        "KOCATEPE SK.",
        "ŞUBE SK.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ATATÜRK BLV.",
        "ODUNPAZARI",
        "İKİ EYLÜL BLV",
        "ALAEDDİN CD.",
        "ATATÜRK BLV.",
        "VALİ ALİ FUAT GÜVEN CD.",
        "BASIN ŞEHİTLERİ CD.",
        "ÇİLEM CD.",
        "HÜSAMETTİN ÜRÜN SK.",
        "ÖZÜLKÜ SK.",
        "ESKİŞEHİR KÜTAHYA YOLU",
        "ULUSAL EGEMENLİK BLV.",
        "ULUBATLI CD.",
        "SAZOVA CD.",
        "GAZİ TEPE SK.",
        "BAHÇELİEVLER SK.",
        "ULUSAL EGEMENLİK BLV.",
        "KARLITEPE CD.",
        "GÜRSEM SK.",
        "AYÇİÇEK CD.",
        "AVCILAR SK.",
        "KARLITEPE CD.",
        "YEŞİLDAĞ SK.",
        "AYÇİÇEK CD.",
        "TEPECİKLİ SK.",
        "ÇİÇEKLİTEPE SK.",
        "ALSANCAK CD.",
        "AYÇİÇEK CD.",
        "ÖZBAHÇE KON.",
        "SAZOVA MH."
      ],
      [
        "SAZOVA MH.",
        "AYÇİÇEK CD.",
        "YEŞİLDAĞ SK.",
        "KARLITEPE CD.",
        "ULUSAL EGEMENLİK BLV.",
        "SERKAN SK.",
        "SAZOVA CD.",
        "ULUBATLI CD.",
        "ULUSAL EGEMENLİK BLV.",
        "KARLITEPE CD.",
        "SAĞLIK SK.",
        "ÇİLEM CD.",
        "BASIN ŞEHİTLERİ CD.",
        "VALİ ALİ FUAT GÜVEN CD.",
        "ATATÜRK BLV.",
        "ODUNPAZARI",
        "İKİ EYLÜL BLV",
        "ALAEDDİN CD.",
        "ATATÜRK BLV.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ŞUBE SK.",
        "KOCATEPE SK.",
        "DEVETEPESİ SK.",
        "JANDARMA ALAY K.LIĞI.",
        "ESOGÜ BADEMLİK KAMPÜSÜ",
        "BADEMLİK"
      ]
    ],
    "notes": [
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 23.09.2024",
      "BADEMLİK YÖNÜNE GİTMEK İÇİN ATATÜRK BLV ÜZERİNDEKİ 17 NOLU DURAK,SAZOVA MH. YÖNÜNE GİTMEK İÇİN ALAEDDİN CD. ÜZERİNDEKİ 5 NOLU DURAK KULLANILACAKTIR.",
      "GECE NÖBETİ"
    ]
  },
  {
    "id": 26,
    "number": "18",
    "zone": "oldtown",
    "district": "Odunpazarı",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=26&menu_id=57",
    "updated": "2023-07-01",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 400,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 440,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 525,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 615,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 705,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 750,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 795,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 840,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 885,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 930,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 975,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1065,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1110,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1155,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1290,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1350,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1410,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      },
      {
        "terminal": "PROF. DR. NABİ AVCI BLV.",
        "runs": [
          {
            "at": 400,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 440,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 480,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 525,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 615,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 705,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 750,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 795,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 840,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 885,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 930,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 975,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1020,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1065,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1110,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1155,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1200,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1260,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1320,
            "group": "weekday",
            "condition": "unverified"
          },
          {
            "at": 1380,
            "group": "weekday",
            "condition": "unverified"
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "MUHSİN YAZICIOĞLU CD.",
        "SİVRİHİSAR 2 CD.",
        "KIRIM CD.",
        "GAZİ YAKUP SATAR CD.",
        "SİVRİHİSAR 1 CD.",
        "YUNUS EMRE CD.",
        "ODUNPAZARI",
        "ATATÜRK BLV.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "DUMLUPINAR CD.",
        "ALİ ÇETİNKAYA CD.",
        "HALK CD.",
        "MİLLET CD.",
        "YENİŞEN SK.",
        "SIRASELVİLER SK.",
        "PROF. DR. NABİ AVCI BLV."
      ],
      [
        "PROF. DR. NABİ AVCI BLV.",
        "KAPLANLI CD.",
        "SIRASELVİLER SK.",
        "YENİŞEN SK.",
        "MİLLET CD.",
        "HALK CD.",
        "ALİ ÇETİNKAYA CD.",
        "DUMLUPINAR CD.",
        "ŞHT. YÜZBAŞI T. GÜNGÖR CD.",
        "ATATÜRK BLV.",
        "ODUNPAZARI",
        "YUNUS EMRE CD.",
        "SİVRİHİSAR 1 CD.",
        "SİVRİHİSAR 2 CD.",
        "OTOGAR"
      ]
    ],
    "notes": [
      "PAZARTESİ GÜNLERİ SEMT PAZARI SEBEBİ İLE TAM GÜN GİDİŞ VE DÖNÜŞ GÜZERGAHI MİLLET CD.-KAPLANLI CD. OLARAK ÇALIŞIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 01.07.2023",
      "GECE NÖBETİ (GENÇLİK BULVARI-ODUNPAZARI ARASINDA ÇALIŞIR.)"
    ]
  },
  {
    "id": 49,
    "number": "51",
    "zone": "center",
    "district": "Tepebaşı",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=49&menu_id=57",
    "updated": "2025-03-10",
    "directions": [
      {
        "terminal": "OTOGAR",
        "runs": [
          {
            "at": 370,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 425,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 470,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 515,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 560,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 605,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 650,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 695,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 740,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 785,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 830,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 875,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 920,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 965,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1010,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1055,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1100,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1145,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1190,
            "group": "weekday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "YUNUS EMRE DEVLET HASTANESİ (ESKİ S.S.K)",
        "runs": [
          {
            "at": 360,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 405,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 495,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 540,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 585,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 630,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 675,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 720,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 765,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 810,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 855,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 900,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 945,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 990,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1035,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1080,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1125,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1170,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1215,
            "group": "weekday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "OTOGAR",
        "MUHSİN YAZICIOĞLU CD.",
        "TOKİ SIRAEVLER KONUTLARI",
        "4530 SK.",
        "SİVRİHİSAR 2 CD.",
        "A.HAMİT DEDELEK CD.",
        "19 MAYIS CD.",
        "SARPER CD.",
        "ZİYA PAŞA CD.",
        "YUNUS EMRE CD.",
        "HASAN POLATKAN CD.",
        "KIRIM CD.",
        "GAZİ YAKUP SATAR CD.",
        "SİVRİHİSAR 1 CD.",
        "SAKARYA 1 CD.",
        "SAKARYA 2 CD.",
        "PROF. DR. ORHAN OĞUZ CD.",
        "UYGUN SK.",
        "DİZGİNLER SK.",
        "ESENLİ SK.",
        "PROF. DR. ORHAN OĞUZ CD.",
        "EĞİTİMCİLER CD.",
        "YAYLALAR SK.",
        "MARMARALI SK.",
        "BİLGEÇ CD.",
        "BEYKOZ SK.",
        "ŞHT. HALİT İLBAY CD.",
        "SINIRBOYU SK.",
        "DİNÇERLER SK.",
        "GÜLÇİÇEKLİ SK.",
        "KİBAR SK.",
        "GİRNELİLER SK.",
        "ÖRME SK.",
        "SÖĞÜTCÜ SK.",
        "İSMET İNÖNÜ 2 CD.",
        "SULTAN SK.",
        "FAHRETTİN ALTAY CD.",
        "İÇTENLİK SK.",
        "SALİH BOZOK CD.",
        "YUNUS EMRE DEVLET HASTANESİ (ESKİ S.S.K)"
      ],
      [
        "YUNUS EMRE DEVLET HASTANESİ (ESKİ S.S.K)",
        "SALİH BOZOK CD.",
        "ÖRSAN SK.",
        "SULTAN SK.",
        "İSMET İNÖNÜ 2 CD.",
        "BURSA CD.",
        "ÖRME SK.",
        "GİRNELİLER SK.",
        "KİBAR SK.",
        "DOBRUCA SK.",
        "GÜLÇİÇEKLİ SK.",
        "DİNÇERLER SK.",
        "SINIRBOYU SK.",
        "ŞHT. HALİT İLBAY CD.",
        "BEYKOZ SK.",
        "BİLGEÇ CD.",
        "MARMARALI SK.",
        "YAYLALAR SK.",
        "EĞİTİMCİLER CD.",
        "PROF. DR. ORHAN OĞUZ CD.",
        "ESENLİ SK.",
        "DİZGİNLER SK.",
        "UYGUN SK.",
        "PROF. DR. ORHAN OĞUZ CD.",
        "SAKARYA 2 CD.",
        "SAKARYA 1 CD.",
        "SİVRİHİSAR 1 CD.",
        "VATAN CD.",
        "ZİYA PAŞA CD.",
        "SARPER CD.",
        "19 MAYIS CD.",
        "A.HAMİT DEDELEK CD.",
        "SİVRİHİSAR 2 CD.",
        "OTOGAR"
      ]
    ],
    "notes": [
      "PAZARTESİ GÜNLERİ ÖRME SOKAKTA SEMT PAZARI KURULMASI SEBEBİ İLE TAM GÜN YAYLAPINAR SOKAK GÜZERGAHINDA HİZMET VERİLİR.",
      "OTOGARDAN HAREKET ETTİKTEN SONRA TOKİ SIRAEVLERE GİRER.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ:10.03.2025"
    ]
  },
  {
    "id": 85,
    "number": "92",
    "zone": "inonu",
    "district": "İnönü",
    "source": "https://www.eskisehir.bel.tr/ulasim-hizmetleri-otobus-saatleri-dvm.php?otobus_hat_id=85&menu_id=57",
    "updated": "2025-07-15",
    "directions": [
      {
        "terminal": "YUNUS EMRE DEVLET HASTANESİ (ESKİ S.S.K)",
        "runs": [
          {
            "at": 450,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 450,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 660,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 900,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 900,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 960,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1110,
            "group": "weekday",
            "condition": ""
          }
        ]
      },
      {
        "terminal": "İNÖNÜ İLÇESİ",
        "runs": [
          {
            "at": 390,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 540,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 570,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 780,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 780,
            "group": "sunday",
            "condition": ""
          },
          {
            "at": 870,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1035,
            "group": "weekday",
            "condition": ""
          },
          {
            "at": 1050,
            "group": "saturday",
            "condition": ""
          },
          {
            "at": 1050,
            "group": "sunday",
            "condition": ""
          }
        ]
      }
    ],
    "routes": [
      [
        "YUNUS EMRE DEVLET HASTANESİ (ESKİ S.S.K)",
        "SALİH BOZOK CD.",
        "ÖRSAN SK.",
        "SULTAN SK.",
        "İSMET İNÖNÜ 2 CD.",
        "BURSA-ESKİŞEHİR YOLU",
        "ÇUKURHİSAR",
        "ATATÜRK CD.",
        "İNÖNÜ CD.",
        "OKLUBALI MH.",
        "BURSA-KÜTAHYA YOLU",
        "İNÖNÜ İLÇESİ"
      ],
      [
        "İNÖNÜ İLÇESİ",
        "BURSA-KÜTAHYA YOLU",
        "OKLUBALI MH.",
        "ÇUKURHİSAR MH.",
        "İNÖNÜ CD.",
        "ATATÜRK CD.",
        "BURSA-ESKİŞEHİR YOLU",
        "GÜLPERİ SK.",
        "3070 SK.",
        "ERZURUM KONGRESİ CD.",
        "İSMET İNÖNÜ 2 CD.",
        "SULTAN SK.",
        "FAHRETTİN ALTAY CD.",
        "İÇTENLİK SK.",
        "SALİH BOZOK CD.",
        "YUNUSEMRE DEVLET HASTANESİ"
      ]
    ],
    "notes": [
      "T2 OTOBÜS BİLETİ KULLANILMAKTADIR.",
      "OTOBÜS SEFERLERİ ÇALIŞMA SAATİ GÜNCELLEME TARİHİ: 15.07.2025"
    ]
  }
];
