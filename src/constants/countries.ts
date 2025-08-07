type Countries =
  | {
    name: string;
    alpha2Code: string;
    flag: string;
    lang: string[] | string;
  }
  | {
    name: string;
    alpha2Code: string;
    flag: string;
  };

export const defaultCountries: Countries[] = [
  {
    name: 'Afghanistan',
    alpha2Code: 'AF',
    flag: '🇦🇫',
    lang: ['ps', 'fa'] // Pashto, Dari (Persa)
  },
  {
    name: 'Åland Islands',
    alpha2Code: 'AX',
    flag: '🇦🇽',
    lang: ['sv'] // Sueco
  },
  {
    name: 'Albania',
    alpha2Code: 'AL',
    flag: '🇦🇱',
    lang: ['sq'] // Albanés
  },
  {
    name: 'Algeria',
    alpha2Code: 'DZ',
    flag: '🇩🇿',
    lang: ['ar'] // Árabe (el bereber es cooficial pero no tiene código ISO 639-1)
  },
  {
    name: 'American Samoa',
    alpha2Code: 'AS',
    flag: '🇦🇸',
    lang: ['en', 'sm'] // Inglés, Samoano
  },
  {
    name: 'Andorra',
    alpha2Code: 'AD',
    flag: '🇦🇩',
    lang: ['ca'] // Catalán
  },
  {
    name: 'Angola',
    alpha2Code: 'AO',
    flag: '🇦🇴',
    lang: ['pt'] // Portugués
  },
  {
    name: 'Anguilla',
    alpha2Code: 'AI',
    flag: '🇦🇮',
    lang: ['en'] // Inglés
  },
  {
    name: 'Antarctica',
    alpha2Code: 'AQ',
    flag: '🇦🇶',
    lang: [] // Sin idioma oficial
  },
  {
    name: 'Antigua and Barbuda',
    alpha2Code: 'AG',
    flag: '🇦🇬',
    lang: ['en'] // Inglés
  },
  {
    name: 'Argentina',
    alpha2Code: 'AR',
    flag: '🇦🇷',
    lang: ['es'] // Español
  },
  {
    name: 'Armenia',
    alpha2Code: 'AM',
    flag: '🇦🇲',
    lang: ['hy'] // Armenio
  },
  {
    name: 'Aruba',
    alpha2Code: 'AW',
    flag: '🇦🇼',
    lang: ['nl'] // Neerlandés (el papiamento es cooficial pero no tiene código ISO 639-1)
  },
  {
    name: 'Australia',
    alpha2Code: 'AU',
    flag: '🇦🇺',
    lang: ['en'] // Inglés (de facto, no oficial por ley)
  },
  {
    name: 'Austria',
    alpha2Code: 'AT',
    flag: '🇦🇹',
    lang: ['de'] // Alemán
  },
  {
    name: 'Azerbaijan',
    alpha2Code: 'AZ',
    flag: '🇦🇿',
    lang: ['az'] // Azerí
  },
  {
    name: 'Bahamas',
    alpha2Code: 'BS',
    flag: '🇧🇸',
    lang: ['en'] // Inglés
  },
  {
    name: 'Bahrain',
    alpha2Code: 'BH',
    flag: '🇧🇭',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Bangladesh',
    alpha2Code: 'BD',
    flag: '🇧🇩',
    lang: ['bn'] // Bengalí
  },
  {
    name: 'Barbados',
    alpha2Code: 'BB',
    flag: '🇧🇧',
    lang: ['en'] // Inglés
  },
  {
    name: 'Belarus',
    alpha2Code: 'BY',
    flag: '🇧🇾',
    lang: ['be', 'ru'] // Bielorruso y Ruso
  },
  {
    name: 'Belgium',
    alpha2Code: 'BE',
    flag: '🇧🇪',
    lang: ['nl', 'fr', 'de'] // Neerlandés, Francés y Alemán (según región)
  },
  {
    name: 'Belize',
    alpha2Code: 'BZ',
    flag: '🇧🇿',
    lang: ['en'] // Inglés (el criollo beliceño y español son comunes pero no oficiales a nivel nacional)
  },
  {
    name: 'Benin',
    alpha2Code: 'BJ',
    flag: '🇧🇯',
    lang: ['fr'] // Francés
  },
  {
    name: 'Bermuda',
    alpha2Code: 'BM',
    flag: '🇧🇲',
    lang: ['en'] // Inglés
  },
  {
    name: 'Bhutan',
    alpha2Code: 'BT',
    flag: '🇧🇹',
    lang: ['dz'] // Dzongkha
  },
  {
    name: 'Bolivia (Plurinational State of)',
    alpha2Code: 'BO',
    flag: '🇧🇴',
    lang: ['es', 'qu', 'ay'] // Español, Quechua, Aymara (+36 idiomas cooficiales, pero solo estos 3 tienen código ISO 639-1)
  },
  {
    name: 'Bonaire, Sint Eustatius and Saba',
    alpha2Code: 'BQ',
    flag: '🇧🇶',
    lang: ['nl'] // Neerlandés (el papiamento es común en Bonaire pero no tiene código ISO 639-1)
  },
  {
    name: 'Bosnia and Herzegovina',
    alpha2Code: 'BA',
    flag: '🇧🇦',
    lang: ['bs', 'hr', 'sr'] // Bosnio, Croata, Serbio (considerados variantes del serbocroata)
  },
  {
    name: 'Botswana',
    alpha2Code: 'BW',
    flag: '🇧🇼',
    lang: ['en', 'tn'] // Inglés y Setswana
  },
  {
    name: 'Bouvet Island',
    alpha2Code: 'BV',
    flag: '🇧🇻',
    lang: [] // Territorio deshabitado (sin idioma oficial)
  },
  {
    name: 'Brazil',
    alpha2Code: 'BR',
    flag: '🇧🇷',
    lang: ['pt'] // Portugués
  },
  {
    name: 'British Indian Ocean Territory',
    alpha2Code: 'IO',
    flag: '🇮🇴',
    lang: ['en'] // Inglés
  },
  {
    name: 'United States Minor Outlying Islands',
    alpha2Code: 'UM',
    flag: '🇺🇲',
    lang: ['en'] // Inglés
  },
  {
    name: 'Virgin Islands (British)',
    alpha2Code: 'VG',
    flag: '🇻🇬',
    lang: ['en'] // Inglés
  },
  {
    name: 'Virgin Islands (U.S.)',
    alpha2Code: 'VI',
    flag: '🇻🇮',
    lang: ['en'] // Inglés
  },
  {
    name: 'Brunei Darussalam',
    alpha2Code: 'BN',
    flag: '🇧🇳',
    lang: ['ms'] // Malayo (el inglés es cooficial pero no siempre se incluye como oficial a nivel constitucional)
  },
  {
    name: 'Bulgaria',
    alpha2Code: 'BG',
    flag: '🇧🇬',
    lang: ['bg'] // Búlgaro
  },
  {
    name: 'Burkina Faso',
    alpha2Code: 'BF',
    flag: '🇧🇫',
    lang: ['fr'] // Francés
  },
  {
    name: 'Burundi',
    alpha2Code: 'BI',
    flag: '🇧🇮',
    lang: ['fr', 'rn'] // Francés y Kirundi
  },
  {
    name: 'Cambodia',
    alpha2Code: 'KH',
    flag: '🇰🇭',
    lang: ['km'] // Khmer
  },
  {
    name: 'Cameroon',
    alpha2Code: 'CM',
    flag: '🇨🇲',
    lang: ['fr', 'en'] // Francés e Inglés (oficiales bilingües)
  },
  {
    name: 'Canada',
    alpha2Code: 'CA',
    flag: '🇨🇦',
    lang: ['en', 'fr'] // Inglés y Francés (oficiales federales)
  },
  {
    name: 'Cabo Verde',
    alpha2Code: 'CV',
    flag: '🇨🇻',
    lang: ['pt'] // Portugués (el criollo caboverdiano no tiene código ISO 639-1)
  },
  {
    name: 'Cayman Islands',
    alpha2Code: 'KY',
    flag: '🇰🇾',
    lang: ['en'] // Inglés
  },
  {
    name: 'Central African Republic',
    alpha2Code: 'CF',
    flag: '🇨🇫',
    lang: ['fr', 'sg'] // Francés y Sango
  },
  {
    name: 'Chad',
    alpha2Code: 'TD',
    flag: '🇹🇩',
    lang: ['fr', 'ar'] // Francés y Árabe
  },
  {
    name: 'Chile',
    alpha2Code: 'CL',
    flag: '🇨🇱',
    lang: ['es'] // Español (el mapudungun y otros son reconocidos pero no oficiales a nivel nacional)
  },
  {
    name: 'China',
    alpha2Code: 'CN',
    flag: '🇨🇳',
    lang: ['zh'] // Chino mandarín (oficial, aunque hay múltiples lenguas regionales)
  },
  {
    name: 'Christmas Island',
    alpha2Code: 'CX',
    flag: '🇨🇽',
    lang: ['en'] // Inglés (no oficial, pero es el idioma administrativo)
  },
  {
    name: 'Cocos (Keeling) Islands',
    alpha2Code: 'CC',
    flag: '🇨🇨',
    lang: ['en'] // Inglés (similar a Christmas Island)
  },
  {
    name: 'Colombia',
    alpha2Code: 'CO',
    flag: '🇨🇴',
    lang: ['es'] // Español (aunque se reconocen 65 lenguas indígenas)
  },
  {
    name: 'Comoros',
    alpha2Code: 'KM',
    flag: '🇰🇲',
    lang: ['ar', 'fr'] // Árabe y Francés (el comorense es lengua nacional pero no tiene código ISO)
  },
  {
    name: 'Congo',
    alpha2Code: 'CG',
    flag: '🇨🇬',
    lang: ['fr'] // Francés (el lingala y kituba son lenguas nacionales)
  },
  {
    name: 'Congo (Democratic Republic of the)',
    alpha2Code: 'CD',
    flag: '🇨🇩',
    lang: ['fr'] // Francés (con 4 lenguas nacionales: lingala, kikongo, swahili, tshiluba)
  },
  {
    name: 'Cook Islands',
    alpha2Code: 'CK',
    flag: '🇨🇰',
  },
  {
    name: 'Costa Rica',
    alpha2Code: 'CR',
    flag: '🇨🇷',
    lang: ['es'] // Español
  },
  {
    name: 'Croatia',
    alpha2Code: 'HR',
    flag: '🇭🇷',
    lang: ['hr'] // Croata
  },
  {
    name: 'Cuba',
    alpha2Code: 'CU',
    flag: '🇨🇺',
    lang: ['es'] // Español
  },
  {
    name: 'Curaçao',
    alpha2Code: 'CW',
    flag: '🇨🇼',
    lang: ['nl', 'en'] // Neerlandés e Inglés (el papiamento es lengua principal pero no tiene código ISO)
  },
  {
    name: 'Cyprus',
    alpha2Code: 'CY',
    flag: '🇨🇾',
    lang: ['el', 'tr'] // Griego y Turco (oficiales según la constitución)
  },
  {
    name: 'Czech Republic',
    alpha2Code: 'CZ',
    flag: '🇨🇿',
    lang: ['cs'] // Checo
  },
  {
    name: 'Denmark',
    alpha2Code: 'DK',
    flag: '🇩🇰',
    lang: ['da'] // Danés
  },
  {
    name: 'Djibouti',
    alpha2Code: 'DJ',
    flag: '🇩🇯',
    lang: ['fr', 'ar'] // Francés y Árabe
  },
  {
    name: 'Dominica',
    alpha2Code: 'DM',
    flag: '🇩🇲',
    lang: ['en'] // Inglés (el criollo antillano es hablado pero no oficial)
  },
  {
    name: 'Dominican Republic',
    alpha2Code: 'DO',
    flag: '🇩🇴',
    lang: ['es'] // Español
  },
  {
    name: 'Ecuador',
    alpha2Code: 'EC',
    flag: '🇪🇨',
    lang: ['es'] // Español (el quechua y shuar son cooficiales pero no tienen código ISO)
  },
  {
    name: 'Egypt',
    alpha2Code: 'EG',
    flag: '🇪🇬',
    lang: ['ar'] // Árabe
  },
  {
    name: 'El Salvador',
    alpha2Code: 'SV',
    flag: '🇸🇻',
    lang: ['es'] // Español
  },
  {
    name: 'Equatorial Guinea',
    alpha2Code: 'GQ',
    flag: '🇬🇶',
    lang: ['es', 'fr', 'pt'] // Español y Francés (el portugués también es cooficial)
  },
  {
    name: 'Eritrea',
    alpha2Code: 'ER',
    flag: '🇪🇷',
    lang: ['ti', 'ar'] // Tigriña y Árabe (oficiales, aunque se hablan 9 lenguas)
  },
  {
    name: 'Estonia',
    alpha2Code: 'EE',
    flag: '🇪🇪',
    lang: ['et', 'en'] // Estonio y Ruso
  },
  {
    name: 'Ethiopia',
    alpha2Code: 'ET',
    flag: '🇪🇹',
    lang: ['am'] // Amárico (aunque hay más de 80 lenguas, el amárico es el idioma oficial de trabajo)
  },
  {
    name: 'Falkland Islands (Malvinas)',
    alpha2Code: 'FK',
    flag: '🇫🇰',
    lang: ['en'] // Inglés
  },
  {
    name: 'Faroe Islands',
    alpha2Code: 'FO',
    flag: '🇫🇴',
    lang: ['fo'] // Feroés (el danés también es oficial pero menos usado)
  },
  {
    name: 'Fiji',
    alpha2Code: 'FJ',
    flag: '🇫🇯',
    lang: ['en', 'fj', 'hi'] // Inglés, Fiyiano e Hindi fiyiano
  },
  {
    name: 'Finland',
    alpha2Code: 'FI',
    flag: '🇫🇮',
    lang: ['fi', 'sv'] // Finés y Sueco (ambos oficiales)
  },
  {
    name: 'France',
    alpha2Code: 'FR',
    flag: '🇫🇷',
    lang: ['fr'] // Francés
  },
  {
    name: 'French Guiana',
    alpha2Code: 'GF',
    flag: '🇬🇫',
    lang: ['fr'] // Francés (lenguas criollas como el criollo guayanés no son oficiales)
  },
  {
    name: 'French Polynesia',
    alpha2Code: 'PF',
    flag: '🇵🇫',
    lang: ['fr'] // Francés (el tahitiano es lengua regional pero no oficial)
  },
  {
    name: 'French Southern Territories',
    alpha2Code: 'TF',
    flag: '🇹🇫',
    lang: ['fr'] // Francés (territorio deshabitado permanentemente)
  },
  {
    name: 'Gabon',
    alpha2Code: 'GA',
    flag: '🇬🇦',
    lang: ['fr'] // Francés
  },
  {
    name: 'Gambia',
    alpha2Code: 'GM',
    flag: '🇬🇲',
    lang: ['en'] // Inglés (lenguas locales como el mandinka no son oficiales)
  },
  {
    name: 'Georgia',
    alpha2Code: 'GE',
    flag: '🇬🇪',
    lang: ['ka'] // Georgiano (el abjasio tiene estatus en Abjasia)
  },
  {
    name: 'Germany',
    alpha2Code: 'DE',
    flag: '🇩🇪',
    lang: ['de'] // Alemán
  },
  {
    name: 'Ghana',
    alpha2Code: 'GH',
    flag: '🇬🇭',
    lang: ['en'] // Inglés (lenguas locales como el akan no son oficiales a nivel nacional)
  },
  {
    name: 'Gibraltar',
    alpha2Code: 'GI',
    flag: '🇬🇮',
    lang: ['en'] // Inglés (el llanito es una mezcla pero no oficial)
  },
  {
    name: 'Greece',
    alpha2Code: 'GR',
    flag: '🇬🇷',
    lang: ['el'] // Griego
  },
  {
    name: 'Greenland',
    alpha2Code: 'GL',
    flag: '🇬🇱',
    lang: ['kl'] // Groenlandés (el danés también es oficial pero minoritario)
  },
  {
    name: 'Grenada',
    alpha2Code: 'GD',
    flag: '🇬🇩',
    lang: ['en'] // Inglés (el criollo granadino no es oficial)
  },
  {
    name: 'Guadeloupe',
    alpha2Code: 'GP',
    flag: '🇬🇵',
    lang: ['fr'] // Francés (el criollo antillano es hablado pero no oficial)
  },
  {
    name: 'Guam',
    alpha2Code: 'GU',
    flag: '🇬🇺',
    lang: ['en', 'ch'] // Inglés y Chamorro
  },
  {
    name: 'Guatemala',
    alpha2Code: 'GT',
    flag: '🇬🇹',
    lang: ['es'] // Español (aunque se hablan 22 lenguas mayas)
  },
  {
    name: 'Guernsey',
    alpha2Code: 'GG',
    flag: '🇬🇬',
    lang: ['en', 'fr'] // Inglés y Francés (el guernesiano es hablado pero no oficial)
  },
  {
    name: 'Guinea',
    alpha2Code: 'GN',
    flag: '🇬🇳',
    lang: ['fr'] // Francés (lenguas locales como el fula no son oficiales)
  },
  {
    name: 'Guinea-Bissau',
    alpha2Code: 'GW',
    flag: '🇬🇼',
    lang: ['pt'] // Portugués (el crioulo es lengua franca pero no oficial)
  },
  {
    name: 'Guyana',
    alpha2Code: 'GY',
    flag: '🇬🇾',
    lang: ['en'] // Inglés
  },
  {
    name: 'Haiti',
    alpha2Code: 'HT',
    flag: '🇭🇹',
    lang: ['fr', 'ht'] // Francés y Criollo haitiano
  },
  {
    name: 'Heard Island and McDonald Islands',
    alpha2Code: 'HM',
    flag: '🇭🇲',
    lang: [] // Territorio deshabitado
  },
  {
    name: 'Holy See',
    alpha2Code: 'VA',
    flag: '🇻🇦',
    lang: ['la', 'it'] // Latín e Italiano
  },
  {
    name: 'Honduras',
    alpha2Code: 'HN',
    flag: '🇭🇳',
    lang: ['es'] // Español
  },
  {
    name: 'Hong Kong',
    alpha2Code: 'HK',
    flag: '🇭🇰',
    lang: ['zh', 'en'] // Chino (yue/cantonés) e Inglés
  },
  {
    name: 'Hungary',
    alpha2Code: 'HU',
    flag: '🇭🇺',
    lang: ['hu'] // Húngaro
  },
  {
    name: 'Iceland',
    alpha2Code: 'IS',
    flag: '🇮🇸',
    lang: ['is'] // Islandés
  },
  {
    name: 'India',
    alpha2Code: 'IN',
    flag: '🇮🇳',
    lang: ['hi', 'en'] // Hindi e Inglés (oficiales a nivel nacional, hay 22 idiomas reconocidos)
  },
  {
    name: 'Indonesia',
    alpha2Code: 'ID',
    flag: '🇮🇩',
    lang: ['id'] // Indonesio (bahasa indonesia)
  },
  {
    name: "Côte d'Ivoire",
    alpha2Code: 'CI',
    flag: '🇨🇮',
    lang: ['fr'] // Francés
  },
  {
    name: 'Iran (Islamic Republic of)',
    alpha2Code: 'IR',
    flag: '🇮🇷',
    lang: ['fa'] // Persa (farsi)
  },
  {
    name: 'Iraq',
    alpha2Code: 'IQ',
    flag: '🇮🇶',
    lang: ['ar', 'ku'] // Árabe y Kurdo
  },
  {
    name: 'Ireland',
    alpha2Code: 'IE',
    flag: '🇮🇪',
    lang: ['ga', 'en'] // Irlandés (gaélico) e Inglés
  },
  {
    name: 'Isle of Man',
    alpha2Code: 'IM',
    flag: '🇮🇲',
    lang: ['en', 'gv'] // Inglés y Manés (gaélico manés)
  },
  {
    name: 'Israel',
    alpha2Code: 'IL',
    flag: '🇮🇱',
    lang: ['he', 'ar'] // Hebreo y Árabe
  },
  {
    name: 'Italy',
    alpha2Code: 'IT',
    flag: '🇮🇹',
    lang: ['it'] // Italiano
  },
  {
    name: 'Jamaica',
    alpha2Code: 'JM',
    flag: '🇯🇲',
    lang: ['en'] // Inglés (el patois jamaiquino es lengua criolla pero no oficial)
  },
  {
    name: 'Japan',
    alpha2Code: 'JP',
    flag: '🇯🇵',
    lang: ['ja'] // Japonés
  },
  {
    name: 'Jersey',
    alpha2Code: 'JE',
    flag: '🇯🇪',
    lang: ['en', 'fr'] // Inglés y Francés (el jèrriais es hablado minoritariamente)
  },
  {
    name: 'Jordan',
    alpha2Code: 'JO',
    flag: '🇯🇴',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Kazakhstan',
    alpha2Code: 'KZ',
    flag: '🇰🇿',
    lang: ['kk', 'ru'] // Kazajo y Ruso
  },
  {
    name: 'Kenya',
    alpha2Code: 'KE',
    flag: '🇰🇪',
    lang: ['en', 'sw'] // Inglés y Suajili
  },
  {
    name: 'Kiribati',
    alpha2Code: 'KI',
    flag: '🇰🇮',
    lang: ['en', 'gil'] // Inglés y Gilbertés (kiribatiano)
  },
  {
    name: 'Kuwait',
    alpha2Code: 'KW',
    flag: '🇰🇼',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Kyrgyzstan',
    alpha2Code: 'KG',
    flag: '🇰🇬',
    lang: ['ky', 'ru'] // Kirguís y Ruso
  },
  {
    name: "Lao People's Democratic Republic",
    alpha2Code: 'LA',
    flag: '🇱🇦',
    lang: ['lo'] // Lao
  },
  {
    name: 'Latvia',
    alpha2Code: 'LV',
    flag: '🇱🇻',
    lang: ['lv'] // Letón
  },
  {
    name: 'Lebanon',
    alpha2Code: 'LB',
    flag: '🇱🇧',
    lang: ['ar'] // Árabe (el francés es muy usado pero no oficial)
  },
  {
    name: 'Lesotho',
    alpha2Code: 'LS',
    flag: '🇱🇸',
    lang: ['en', 'st'] // Inglés y Sesotho
  },
  {
    name: 'Liberia',
    alpha2Code: 'LR',
    flag: '🇱🇷',
    lang: ['en'] // Inglés
  },
  {
    name: 'Libya',
    alpha2Code: 'LY',
    flag: '🇱🇾',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Liechtenstein',
    alpha2Code: 'LI',
    flag: '🇱🇮',
    lang: ['de'] // Alemán
  },
  {
    name: 'Lithuania',
    alpha2Code: 'LT',
    flag: '🇱🇹',
    lang: ['lt'] // Lituano
  },
  {
    name: 'Luxembourg',
    alpha2Code: 'LU',
    flag: '🇱🇺',
    lang: ['lb', 'fr', 'de'] // Luxemburgués, Francés y Alemán
  },
  {
    name: 'Macao',
    alpha2Code: 'MO',
    flag: '🇲🇴',
    lang: ['zh', 'pt'] // Chino (cantonés) y Portugués
  },
  {
    name: 'Macedonia',
    alpha2Code: 'MK',
    flag: '🇲🇰',
    lang: ['mk'] // Macedonio
  },
  {
    name: 'Madagascar',
    alpha2Code: 'MG',
    flag: '🇲🇬',
    lang: ['fr', 'mg'] // Francés y Malgache
  },
  {
    name: 'Malawi',
    alpha2Code: 'MW',
    flag: '🇲🇼',
    lang: ['en', 'ny'] // Inglés y Chichewa
  },
  {
    name: 'Malaysia',
    alpha2Code: 'MY',
    flag: '🇲🇾',
    lang: ['ms'] // Malayo (Bahasa Malaysia)
  },
  {
    name: 'Maldives',
    alpha2Code: 'MV',
    flag: '🇲🇻',
    lang: ['dv'] // Maldivo (Dhivehi)
  },
  {
    name: 'Mali',
    alpha2Code: 'ML',
    flag: '🇲🇱',
    lang: ['fr'] // Francés
  },
  {
    name: 'Malta',
    alpha2Code: 'MT',
    flag: '🇲🇹',
    lang: ['mt', 'en'] // Maltés e Inglés
  },
  {
    name: 'Marshall Islands',
    alpha2Code: 'MH',
    flag: '🇲🇭',
    lang: ['en', 'mh'] // Inglés y Marshalés
  },
  {
    name: 'Martinique',
    alpha2Code: 'MQ',
    flag: '🇲🇶',
    lang: ['fr'] // Francés
  },
  {
    name: 'Mauritania',
    alpha2Code: 'MR',
    flag: '🇲🇷',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Mauritius',
    alpha2Code: 'MU',
    flag: '🇲🇺',
    lang: ['en', 'fr'] // Inglés y Francés
  },
  {
    name: 'Mayotte',
    alpha2Code: 'YT',
    flag: '🇾🇹',
    lang: ['fr'] // Francés
  },
  {
    name: 'Mexico',
    alpha2Code: 'MX',
    flag: '🇲🇽',
    lang: ['es'] // Español
  },
  {
    name: 'Micronesia (Federated States of)',
    alpha2Code: 'FM',
    flag: '🇫🇲',
    lang: ['en'] // Inglés
  },
  {
    name: 'Moldova (Republic of)',
    alpha2Code: 'MD',
    flag: '🇲🇩',
    lang: ['ro'] // Rumano (oficialmente llamado Moldavo)
  },
  {
    name: 'Monaco',
    alpha2Code: 'MC',
    flag: '🇲🇨',
    lang: ['fr'] // Francés
  },
  {
    name: 'Mongolia',
    alpha2Code: 'MN',
    flag: '🇲🇳',
    lang: ['mn'] // Mongol
  },
  {
    name: 'Montenegro',
    alpha2Code: 'ME',
    flag: '🇲🇪',
    lang: ['sr', 'bs', 'sq', 'hr'] // Serbio, Bosnio, Albanés y Croata
  },
  {
    name: 'Montserrat',
    alpha2Code: 'MS',
    flag: '🇲🇸',
    lang: ['en'] // Inglés
  },
  {
    name: 'Morocco',
    alpha2Code: 'MA',
    flag: '🇲🇦',
    lang: ['ar'] // Árabe (el bereber es cooficial pero no tiene código ISO)
  },
  {
    name: 'Mozambique',
    alpha2Code: 'MZ',
    flag: '🇲🇿',
    lang: ['pt'] // Portugués
  },
  {
    name: 'Myanmar',
    alpha2Code: 'MM',
    flag: '🇲🇲',
    lang: ['my'] // Birmano
  },
  {
    name: 'Namibia',
    alpha2Code: 'NA',
    flag: '🇳🇦',
    lang: ['en'] // Inglés (oficial), aunque se hablan varios idiomas locales
  },
  {
    name: 'Nauru',
    alpha2Code: 'NR',
    flag: '🇳🇷',
    lang: ['en', 'na'] // Inglés y Nauruano
  },
  {
    name: 'Nepal',
    alpha2Code: 'NP',
    flag: '🇳🇵',
    lang: ['ne'] // Nepalí
  },
  {
    name: 'Netherlands',
    alpha2Code: 'NL',
    flag: '🇳🇱',
    lang: ['nl'] // Neerlandés
  },
  {
    name: 'New Caledonia',
    alpha2Code: 'NC',
    flag: '🇳🇨',
    lang: ['fr'] // Francés
  },
  {
    name: 'New Zealand',
    alpha2Code: 'NZ',
    flag: '🇳🇿',
    lang: ['en', 'mi'] // Inglés y Maorí
  },
  {
    name: 'Nicaragua',
    alpha2Code: 'NI',
    flag: '🇳🇮',
    lang: ['es'] // Español
  },
  {
    name: 'Niger',
    alpha2Code: 'NE',
    flag: '🇳🇪',
    lang: ['fr'] // Francés
  },
  {
    name: 'Nigeria',
    alpha2Code: 'NG',
    flag: '🇳🇬',
    lang: ['en'] // Inglés (oficial), con más de 500 lenguas locales
  },
  {
    name: 'Niue',
    alpha2Code: 'NU',
    flag: '🇳🇺',
    lang: ['en', 'niu'] // Inglés y Niueano
  },
  {
    name: 'Norfolk Island',
    alpha2Code: 'NF',
    flag: '🇳🇫',
    lang: ['en', 'pih'] // Inglés y Norfuk (criollo inglés-norfolkense)
  },
  {
    name: "Korea (Democratic People's Republic of)",
    alpha2Code: 'KP',
    flag: '🇰🇵',
    lang: ['ko'] // Coreano
  },
  {
    name: 'Northern Mariana Islands',
    alpha2Code: 'MP',
    flag: '🇲🇵',
    lang: ['en', 'ch'] // Inglés y Chamorro
  },
  {
    name: 'Norway',
    alpha2Code: 'NO',
    flag: '🇳🇴',
    lang: ['no', 'nb', 'nn'] // Noruego (Bokmål y Nynorsk)
  },
  {
    name: 'Oman',
    alpha2Code: 'OM',
    flag: '🇴🇲',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Pakistan',
    alpha2Code: 'PK',
    flag: '🇵🇰',
    lang: ['en', 'ur'] // Inglés y Urdu
  },
  {
    name: 'Palau',
    alpha2Code: 'PW',
    flag: '🇵🇼',
    lang: ['en', 'pau'] // Inglés y Palauano
  },
  {
    name: 'Palestine, State of',
    alpha2Code: 'PS',
    flag: '🇵🇸',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Panama',
    alpha2Code: 'PA',
    flag: '🇵🇦',
    lang: ['es'] // Español
  },
  {
    name: 'Papua New Guinea',
    alpha2Code: 'PG',
    flag: '🇵🇬',
    lang: ['en', 'ho', 'tpi'] // Inglés, Hiri Motu y Tok Pisin
  },
  {
    name: 'Paraguay',
    alpha2Code: 'PY',
    flag: '🇵🇾',
    lang: ['es', 'gn'] // Español y Guaraní
  },
  {
    name: 'Peru',
    alpha2Code: 'PE',
    flag: '🇵🇪',
    lang: ['es'] // Español (quechua y aymara son cooficiales en zonas donde predominan)
  },
  {
    name: 'Philippines',
    alpha2Code: 'PH',
    flag: '🇵🇭',
    lang: ['en', 'tl'] // Inglés y Filipino (basado en tagalo)
  },
  {
    name: 'Pitcairn',
    alpha2Code: 'PN',
    flag: '🇵🇳',
    lang: ['en', 'pih'] // Inglés y Pitcairnés (criollo inglés-tahitiano)
  },
  {
    name: 'Poland',
    alpha2Code: 'PL',
    flag: '🇵🇱',
    lang: ['pl'] // Polaco
  },
  {
    name: 'Portugal',
    alpha2Code: 'PT',
    flag: '🇵🇹',
    lang: ['pt'] // Portugués
  },
  {
    name: 'Puerto Rico',
    alpha2Code: 'PR',
    flag: '🇵🇷',
    lang: ['es', 'en'] // Español e Inglés
  },
  {
    name: 'Qatar',
    alpha2Code: 'QA',
    flag: '🇶🇦',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Republic of Kosovo',
    alpha2Code: 'XK',
    flag: '🇽🇰',
    lang: ['sq', 'sr'] // Albanés y Serbio
  },
  {
    name: 'Réunion',
    alpha2Code: 'RE',
    flag: '🇷🇪',
    lang: ['fr'] // Francés
  },
  {
    name: 'Romania',
    alpha2Code: 'RO',
    flag: '🇷🇴',
    lang: ['ro'] // Rumano
  },
  {
    name: 'Russian Federation',
    alpha2Code: 'RU',
    flag: '🇷🇺',
    lang: ['ru'] // Ruso
  },
  {
    name: 'Rwanda',
    alpha2Code: 'RW',
    flag: '🇷🇼',
    lang: ['rw', 'en', 'fr'] // Kinyarwanda, Inglés y Francés
  },
  {
    name: 'Saint Barthélemy',
    alpha2Code: 'BL',
    flag: '🇧🇱',
    lang: ['fr'] // Francés
  },
  {
    name: 'Saint Helena',
    alpha2Code: 'SH',
    flag: '🇸🇭',
    lang: ['en'] // Inglés
  },
  {
    name: 'Saint Kitts and Nevis',
    alpha2Code: 'KN',
    flag: '🇰🇳',
    lang: ['en'] // Inglés
  },
  {
    name: 'Saint Lucia',
    alpha2Code: 'LC',
    flag: '🇱🇨',
    lang: ['en'] // Inglés (el criollo antillano francés es hablado pero no oficial)
  },
  {
    name: 'Saint Martin (French part)',
    alpha2Code: 'MF',
    flag: '🇲🇫',
    lang: ['fr'] // Francés
  },
  {
    name: 'Saint Pierre and Miquelon',
    alpha2Code: 'PM',
    flag: '🇵🇲',
    lang: ['fr'] // Francés
  },
  {
    name: 'Saint Vincent and the Grenadines',
    alpha2Code: 'VC',
    flag: '🇻🇨',
    lang: ['en'] // Inglés
  },
  {
    name: 'Samoa',
    alpha2Code: 'WS',
    flag: '🇼🇸',
    lang: ['sm', 'en'] // Samoano e Inglés
  },
  {
    name: 'San Marino',
    alpha2Code: 'SM',
    flag: '🇸🇲',
    lang: ['it'] // Italiano
  },
  {
    name: 'Sao Tome and Principe',
    alpha2Code: 'ST',
    flag: '🇸🇹',
    lang: ['pt'] // Portugués
  },
  {
    name: 'Saudi Arabia',
    alpha2Code: 'SA',
    flag: '🇸🇦',
    lang: ['ar'] // Árabe
  },
  {
    name: 'Senegal',
    alpha2Code: 'SN',
    flag: '🇸🇳',
    lang: ['fr'] // Francés (el wolof es lengua franca pero no oficial)
  },
  {
    name: 'Serbia',
    alpha2Code: 'RS',
    flag: '🇷🇸',
    lang: ['sr'] // Serbio
  },
  {
    name: 'Seychelles',
    alpha2Code: 'SC',
    flag: '🇸🇨',
    lang: ['en', 'fr', 'crs'] // Inglés, Francés y Criollo seychelense
  },
  {
    name: 'Sierra Leone',
    alpha2Code: 'SL',
    flag: '🇸🇱',
    lang: ['en'] // Inglés (el krio es lingua franca)
  },
  {
    name: 'Singapore',
    alpha2Code: 'SG',
    flag: '🇸🇬',
    lang: ['en', 'ms', 'zh', 'ta'] // Inglés, Malayo, Chino y Tamil
  },
  {
    name: 'Sint Maarten (Dutch part)',
    alpha2Code: 'SX',
    flag: '🇸🇽',
    lang: ['nl', 'en'] // Neerlandés e Inglés
  },
  {
    name: 'Slovakia',
    alpha2Code: 'SK',
    flag: '🇸🇰',
    lang: ['sk'] // Eslovaco
  },
  {
    name: 'Slovenia',
    alpha2Code: 'SI',
    flag: '🇸🇮',
    lang: ['sl'] // Esloveno
  },
  {
    name: 'Solomon Islands',
    alpha2Code: 'SB',
    flag: '🇸🇧',
    lang: ['en'] // Inglés (se hablan más de 70 lenguas indígenas)
  },
  {
    name: 'Somalia',
    alpha2Code: 'SO',
    flag: '🇸🇴',
    lang: ['so', 'ar'] // Somalí y Árabe
  },
  {
    name: 'South Africa',
    alpha2Code: 'ZA',
    flag: '🇿🇦',
    lang: ['zu', 'xh', 'af', 'en', 'nso', 'st', 'tn', 'ts', 'ss', 've'] // 11 idiomas oficiales
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    alpha2Code: 'GS',
    flag: '🇬🇸',
    lang: ['en'] // Inglés
  },
  {
    name: 'Korea (Republic of)',
    alpha2Code: 'KR',
    flag: '🇰🇷',
    lang: ['ko'] // Coreano
  },
  {
    name: 'South Sudan',
    alpha2Code: 'SS',
    flag: '🇸🇸',
    lang: ['en'] // Inglés
  },
  {
    name: 'Spain',
    alpha2Code: 'ES',
    flag: '🇪🇸',
    lang: ['es'] // Español (castellano), con lenguas cooficiales en algunas regiones
  },
  {
    name: 'Sri Lanka',
    alpha2Code: 'LK',
    flag: '🇱🇰',
    lang: ['si', 'ta'] // Cingalés y Tamil
  },
  {
    name: 'Sudan',
    alpha2Code: 'SD',
    flag: '🇸🇩',
    lang: ['ar', 'en'] // Árabe e Inglés
  },
  {
    name: 'Suriname',
    alpha2Code: 'SR',
    flag: '🇸🇷',
    lang: ['nl'] // Neerlandés
  },
  {
    name: 'Svalbard and Jan Mayen',
    alpha2Code: 'SJ',
    flag: '🇸🇯',
    lang: ['no'] // Noruego
  },
  {
    name: 'Swaziland',
    alpha2Code: 'SZ',
    flag: '🇸🇿',
    lang: ['en', 'ss'] // Inglés y Swati
  },
  {
    name: 'Sweden',
    alpha2Code: 'SE',
    flag: '🇸🇪',
    lang: ['sv'] // Sueco
  },
  {
    "name": "Switzerland",
    "alpha2Code": "CH",
    "flag": "🇨🇭",
    "lang": ["de", "fr", "it", "rm"]
  },
  {
    "name": "Syrian Arab Republic",
    "alpha2Code": "SY",
    "flag": "🇸🇾",
    "lang": ["ar"]
  },
  {
    "name": "Taiwan",
    "alpha2Code": "TW",
    "flag": "🇹🇼",
    "lang": ["zh"]
  },
  {
    "name": "Tajikistan",
    "alpha2Code": "TJ",
    "flag": "🇹🇯",
    "lang": ["tg", "ru"]
  },
  {
    "name": "Tanzania, United Republic of",
    "alpha2Code": "TZ",
    "flag": "🇹🇿",
    "lang": ["sw", "en"]
  },
  {
    "name": "Thailand",
    "alpha2Code": "TH",
    "flag": "🇹🇭",
    "lang": ["th"]
  },
  {
    "name": "Timor-Leste",
    "alpha2Code": "TL",
    "flag": "🇹🇱",
    "lang": ["pt", "tet"]
  },
  {
    "name": "Togo",
    "alpha2Code": "TG",
    "flag": "🇹🇬",
    "lang": ["fr"]
  },
  {
    "name": "Tokelau",
    "alpha2Code": "TK",
    "flag": "🇹🇰",
    "lang": ["en", "tkl"]
  },
  {
    "name": "Tonga",
    "alpha2Code": "TO",
    "flag": "🇹🇴",
    "lang": ["en", "to"]
  },
  {
    "name": "Trinidad and Tobago",
    "alpha2Code": "TT",
    "flag": "🇹🇹",
    "lang": ["en"]
  },
  {
    "name": "Tunisia",
    "alpha2Code": "TN",
    "flag": "🇹🇳",
    "lang": ["ar"]
  },
  {
    "name": "Turkey",
    "alpha2Code": "TR",
    "flag": "🇹🇷",
    "lang": ["tr"]
  },
  {
    "name": "Turkmenistan",
    "alpha2Code": "TM",
    "flag": "🇹🇲",
    "lang": ["tk"]
  },
  {
    "name": "Turks and Caicos Islands",
    "alpha2Code": "TC",
    "flag": "🇹🇨",
    "lang": ["en"]
  },
  {
    "name": "Tuvalu",
    "alpha2Code": "TV",
    "flag": "🇹🇻",
    "lang": ["en", "tvl"]
  },
  {
    "name": "Uganda",
    "alpha2Code": "UG",
    "flag": "🇺🇬",
    "lang": ["sw", "en"]
  },
  {
    "name": "Ukraine",
    "alpha2Code": "UA",
    "flag": "🇺🇦",
    "lang": ["uk"]
  },
  {
    "name": "United Arab Emirates",
    "alpha2Code": "AE",
    "flag": "🇦🇪",
    "lang": ["ar"]
  },
  {
    "name": "United Kingdom of Great Britain and Northern Ireland",
    "alpha2Code": "GB",
    "flag": "🇬🇧",
    "lang": ["en"]
  },
  {
    "name": "United States of America",
    "alpha2Code": "US",
    "flag": "🇺🇸",
    "lang": ["en"]
  },
  {
    "name": "Uruguay",
    "alpha2Code": "UY",
    "flag": "🇺🇾",
    "lang": ["es"]
  },
  {
    "name": "Uzbekistan",
    "alpha2Code": "UZ",
    "flag": "🇺🇿",
    "lang": ["uz"]
  },
  {
    "name": "Vanuatu",
    "alpha2Code": "VU",
    "flag": "🇻🇺",
    "lang": ["bi", "en", "fr"]
  },
  {
    "name": "Venezuela (Bolivarian Republic of)",
    "alpha2Code": "VE",
    "flag": "🇻🇪",
    "lang": ["es"]
  },
  {
    "name": "Viet Nam",
    "alpha2Code": "VN",
    "flag": "🇻🇳",
    "lang": ["vi"]
  },
  {
    "name": "Wallis and Futuna",
    "alpha2Code": "WF",
    "flag": "🇼🇫",
    "lang": ["fr"]
  },
  {
    "name": "Western Sahara",
    "alpha2Code": "EH",
    "flag": "🇪🇭",
    "lang": ["es", "ar"]
  },
  {
    "name": "Yemen",
    "alpha2Code": "YE",
    "flag": "🇾🇪",
    "lang": ["ar"]
  },
  {
    "name": "Zambia",
    "alpha2Code": "ZM",
    "flag": "🇿🇲",
    "lang": ["en"]
  },
  {
    "name": "Zimbabwe",
    "alpha2Code": "ZW",
    "flag": "🇿🇼",
    "lang": ["en", "sn", "nd"]
  },
];
