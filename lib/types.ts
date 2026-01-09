export interface Member {
  id?: string
  customer_number: string
  salutation: string
  first_name: string
  last_name: string
  name2: string
  street: string
  postal_code: string
  city: string
  email?: string
  phone?: string
  mobile?: string
  communication_preference?: string
  notes: string
  token: string
  expiry_date: string
  modified: boolean
  modified_at: string | null
  original_street?: string
  original_postal_code?: string
  original_city?: string
  created_at?: string
}

export interface ColumnMapping {
  customerNumber: string | null
  salutation: string | null
  firstName: string | null
  lastName: string | null
  name2: string | null
  street: string | null
  postalCode: string | null
  city: string | null
  email: string | null
  phone: string | null
  mobile: string | null
  communicationPreference: string | null
}

export const GERMAN_COLUMN_NAMES: Record<string, keyof ColumnMapping> = {
  mitgliedsnummer: "customerNumber",
  mitgliedsnr: "customerNumber",
  "mitglieds-nr": "customerNumber",
  "mitglieds-nummer": "customerNumber",
  "mitglieds nr": "customerNumber",
  kundennummer: "customerNumber",
  "kunden-nr": "customerNumber",
  "kunden nr": "customerNumber",
  kdnr: "customerNumber",
  "kd-nr": "customerNumber",
  "kd nr": "customerNumber",
  nr: "customerNumber",
  nummer: "customerNumber",
  id: "customerNumber",
  anrede: "salutation",
  titel: "salutation",
  vorname: "firstName",
  "first name": "firstName",
  firstname: "firstName",
  vname: "firstName",
  nachname: "lastName",
  "last name": "lastName",
  lastname: "lastName",
  familienname: "lastName",
  zuname: "lastName",
  nname: "lastName",
  name2: "name2",
  "name 2": "name2",
  zusatz: "name2",
  namenszusatz: "name2",
  adresszusatz: "name2",
  "c/o": "name2",
  co: "name2",
  straße: "street",
  strasse: "street",
  street: "street",
  adresse: "street",
  "straße hausnr": "street",
  "strasse hausnr": "street",
  plz: "postalCode",
  postleitzahl: "postalCode",
  "postal code": "postalCode",
  postalcode: "postalCode",
  zip: "postalCode",
  ort: "city",
  stadt: "city",
  city: "city",
  wohnort: "city",
  gemeinde: "city",
  email: "email",
  "e-mail": "email",
  "e mail": "email",
  mail: "email",
  telefon: "phone",
  telefonnummer: "phone",
  "telefon-nummer": "phone",
  "telefon nummer": "phone",
  tel: "phone",
  festnetz: "phone",
  handy: "mobile",
  handynummer: "mobile",
  "handy-nummer": "mobile",
  "handy nummer": "mobile",
  mobil: "mobile",
  mobiltelefon: "mobile",
  "mobil-telefon": "mobile",
  "kommunikationspräferenz": "communicationPreference",
  "kommunikations-präferenz": "communicationPreference",
  "kommunikations präferenz": "communicationPreference",
  kontaktpräferenz: "communicationPreference",
  "kontakt-präferenz": "communicationPreference",
  "kontakt präferenz": "communicationPreference",
  präferenz: "communicationPreference",
  kontaktweg: "communicationPreference",
}
