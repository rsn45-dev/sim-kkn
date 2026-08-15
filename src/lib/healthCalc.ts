/**
 * healthCalc.ts
 * Utilitas perhitungan status gizi berdasarkan usia:
 * - 0–59 bulan   : WHO Z-Score (TB/U, BB/U)
 * - 5–18 tahun   : IMT/U (BMI-for-age) sesuai WHO
 * - >18 tahun    : IMT (BMI) standar dewasa
 */

export type HealthResult = {
  method: string;
  primaryStatus: string;
  secondaryStatus?: string;
  bmi?: number;
  interpretation: string;
  recommendation: string;
  isAlert: boolean;
  alertLevel: 'normal' | 'warning' | 'danger';
};

// ──────────────────────────────────────────
// 1. WHO Z-Score untuk 0–59 bulan
// ──────────────────────────────────────────
interface WHOPoint { m: number; bH: number; gH: number; bW: number; gW: number; }
const WHO_POINTS: WHOPoint[] = [
  {m:0,  bH:49.9, gH:49.1, bW:3.3,  gW:3.2},
  {m:3,  bH:61.4, gH:59.8, bW:6.4,  gW:5.8},
  {m:6,  bH:67.6, gH:65.7, bW:7.9,  gW:7.3},
  {m:9,  bH:72.3, gH:70.1, bW:9.0,  gW:8.3},
  {m:12, bH:75.7, gH:74.0, bW:9.6,  gW:8.9},
  {m:18, bH:82.3, gH:80.7, bW:10.9, gW:10.2},
  {m:24, bH:87.1, gH:85.5, bW:12.2, gW:11.5},
  {m:30, bH:91.2, gH:90.0, bW:13.3, gW:12.6},
  {m:36, bH:96.1, gH:95.1, bW:14.3, gW:13.9},
  {m:42, bH:99.9, gH:99.0, bW:15.3, gW:14.9},
  {m:48, bH:103.3,gH:102.7,bW:16.3, gW:16.1},
  {m:54, bH:106.7,gH:106.2,bW:17.3, gW:17.2},
  {m:59, bH:110.0,gH:109.4,bW:18.3, gW:18.2},
];

function interpolate(ageMonths: number, field: keyof WHOPoint): number {
  let lo = WHO_POINTS[0];
  let hi = WHO_POINTS[WHO_POINTS.length - 1];
  for (let i = 0; i < WHO_POINTS.length - 1; i++) {
    if (ageMonths >= WHO_POINTS[i].m && ageMonths <= WHO_POINTS[i+1].m) {
      lo = WHO_POINTS[i];
      hi = WHO_POINTS[i+1];
      break;
    }
  }
  const ratio = (hi.m - lo.m) > 0 ? (ageMonths - lo.m) / (hi.m - lo.m) : 0;
  return (lo[field] as number) + ((hi[field] as number) - (lo[field] as number)) * ratio;
}

function calcWHOZScore(gender: string, ageMonths: number, heightCm: number, weightKg: number): HealthResult {
  const medH = gender === 'L' ? interpolate(ageMonths, 'bH') : interpolate(ageMonths, 'gH');
  const medW = gender === 'L' ? interpolate(ageMonths, 'bW') : interpolate(ageMonths, 'gW');
  const sdH  = medH * 0.042;
  const sdW  = medW * 0.115;
  const zH   = (heightCm - medH) / sdH;
  const zW   = (weightKg - medW) / sdW;

  let tbStatus: string;
  if      (zH < -3) tbStatus = 'Sangat Pendek (Severely Stunted)';
  else if (zH < -2) tbStatus = 'Pendek (Stunted)';
  else if (zH >  2) tbStatus = 'Tinggi';
  else              tbStatus = 'Normal';

  let bbStatus: string;
  if      (zW < -3) bbStatus = 'Gizi Buruk (Severely Underweight)';
  else if (zW < -2) bbStatus = 'Gizi Kurang (Underweight)';
  else if (zW >  2) bbStatus = 'Risiko Gizi Lebih';
  else              bbStatus = 'Berat Badan Normal';

  const isStunted = zH < -2;
  const isMalnutrition = zW < -2;
  const isAlert  = isStunted || isMalnutrition;
  const alertLevel: HealthResult['alertLevel'] = zH < -3 || zW < -3 ? 'danger' : isAlert ? 'warning' : 'normal';

  let recommendation: string;
  if (alertLevel === 'danger') {
    recommendation = '⚠️ Kondisi gizi sangat kritis. Segera bawa ke Puskesmas atau dokter anak untuk penanganan lebih lanjut. Berikan makanan tinggi energi dan protein seperti telur, ikan, hati ayam, dan kacang-kacangan setiap hari.';
  } else if (isAlert) {
    recommendation = 'Anak terindikasi masalah gizi. Konsultasikan ke Posyandu atau tenaga kesehatan. Pastikan asupan protein hewani (telur, ikan, daging) minimal sekali sehari dan pantau pertumbuhan setiap bulan.';
  } else {
    recommendation = 'Pertumbuhan anak dalam batas normal. Pertahankan pola makan bergizi seimbang, rajin ke Posyandu, dan pastikan anak mendapat stimulasi bermain yang cukup.';
  }

  return {
    method: `WHO Z-Score (Usia ${ageMonths} bulan)`,
    primaryStatus: `TB/U: ${tbStatus}`,
    secondaryStatus: `BB/U: ${bbStatus}`,
    interpretation: `Z-Score TB: ${zH.toFixed(2)} | Z-Score BB: ${zW.toFixed(2)}`,
    recommendation,
    isAlert,
    alertLevel,
  };
}

// ──────────────────────────────────────────
// 2. IMT/U untuk 5–18 tahun (WHO BMI-for-age)
//    Menggunakan median dan SD perkiraan per usia
// ──────────────────────────────────────────
interface BMIAgeRef { age: number; boyMed: number; girlMed: number; sd: number; }
const BMI_AGE_REFS: BMIAgeRef[] = [
  {age:5,  boyMed:15.3, girlMed:15.1, sd:1.6},
  {age:6,  boyMed:15.3, girlMed:15.2, sd:1.7},
  {age:7,  boyMed:15.5, girlMed:15.5, sd:1.9},
  {age:8,  boyMed:15.8, girlMed:15.9, sd:2.1},
  {age:9,  boyMed:16.2, girlMed:16.4, sd:2.3},
  {age:10, boyMed:16.6, girlMed:17.0, sd:2.5},
  {age:11, boyMed:17.2, girlMed:17.7, sd:2.8},
  {age:12, boyMed:17.8, girlMed:18.4, sd:3.0},
  {age:13, boyMed:18.5, girlMed:19.1, sd:3.2},
  {age:14, boyMed:19.2, girlMed:19.7, sd:3.3},
  {age:15, boyMed:19.9, girlMed:20.2, sd:3.4},
  {age:16, boyMed:20.5, girlMed:20.6, sd:3.4},
  {age:17, boyMed:21.1, girlMed:21.0, sd:3.5},
  {age:18, boyMed:21.7, girlMed:21.4, sd:3.5},
];

function calcIMTPerAge(gender: string, ageYears: number, heightCm: number, weightKg: number): HealthResult {
  const bmi = weightKg / ((heightCm / 100) ** 2);
  const ref = BMI_AGE_REFS.find(r => r.age === Math.floor(ageYears)) || BMI_AGE_REFS[BMI_AGE_REFS.length - 1];
  const median = gender === 'L' ? ref.boyMed : ref.girlMed;
  const z = (bmi - median) / ref.sd;

  let status: string;
  let isAlert = false;
  let alertLevel: HealthResult['alertLevel'] = 'normal';

  if      (z < -3) { status = 'Sangat Kurus';  isAlert = true;  alertLevel = 'danger'; }
  else if (z < -2) { status = 'Kurus';          isAlert = true;  alertLevel = 'warning'; }
  else if (z <= 1) { status = 'Normal'; }
  else if (z <= 2) { status = 'Gemuk';           isAlert = true;  alertLevel = 'warning'; }
  else             { status = 'Obesitas';         isAlert = true;  alertLevel = 'danger'; }

  let recommendation: string;
  if      (status === 'Sangat Kurus') recommendation = 'IMT sangat rendah untuk usia ini. Segera konsultasikan ke dokter atau ahli gizi. Tingkatkan asupan kalori dan protein secara signifikan.';
  else if (status === 'Kurus')        recommendation = 'IMT di bawah normal. Perbanyak makanan bergizi tinggi kalori seperti nasi, lauk hewani, susu, dan kacang-kacangan. Pantau berat badan setiap bulan.';
  else if (status === 'Normal')       recommendation = 'IMT sesuai usia. Pertahankan pola makan seimbang dan aktivitas fisik rutin minimal 60 menit per hari.';
  else if (status === 'Gemuk')        recommendation = 'IMT di atas normal. Kurangi konsumsi makanan tinggi gula dan lemak. Tingkatkan aktivitas fisik dan konsultasikan ke tenaga kesehatan.';
  else                                recommendation = 'IMT menunjukkan obesitas. Konsultasikan segera ke dokter atau ahli gizi untuk program penurunan berat badan yang aman sesuai usia.';

  return {
    method: `IMT/U – BMI for Age (Usia ${ageYears.toFixed(0)} tahun)`,
    primaryStatus: status,
    bmi: parseFloat(bmi.toFixed(2)),
    interpretation: `IMT: ${bmi.toFixed(1)} kg/m² | Median: ${median} | Z-Score: ${z.toFixed(2)}`,
    recommendation,
    isAlert,
    alertLevel,
  };
}

// ──────────────────────────────────────────
// 3. IMT standar dewasa (>18 tahun)
// ──────────────────────────────────────────
function calcIMTDewasa(heightCm: number, weightKg: number): HealthResult {
  const bmi = weightKg / ((heightCm / 100) ** 2);
  let status: string;
  let isAlert = false;
  let alertLevel: HealthResult['alertLevel'] = 'normal';

  if      (bmi < 17.0) { status = 'Kurus Tingkat Berat';   isAlert = true; alertLevel = 'danger'; }
  else if (bmi < 18.5) { status = 'Kurus';                  isAlert = true; alertLevel = 'warning'; }
  else if (bmi < 25.0) { status = 'Normal'; }
  else if (bmi < 27.0) { status = 'Gemuk (Pre-Obese)';      isAlert = true; alertLevel = 'warning'; }
  else if (bmi < 30.0) { status = 'Obesitas Tingkat I';     isAlert = true; alertLevel = 'warning'; }
  else if (bmi < 35.0) { status = 'Obesitas Tingkat II';    isAlert = true; alertLevel = 'danger'; }
  else                  { status = 'Obesitas Tingkat III';   isAlert = true; alertLevel = 'danger'; }

  let recommendation: string;
  if      (bmi < 17.0) recommendation = 'IMT sangat rendah (Kurus Berat). Segera konsultasikan ke dokter untuk evaluasi status gizi dan program peningkatan berat badan.';
  else if (bmi < 18.5) recommendation = 'Berat badan kurang. Tingkatkan asupan kalori dengan makanan bergizi: nasi, protein hewani, susu, dan camilan sehat. Timbang berat badan setiap minggu.';
  else if (bmi < 25.0) recommendation = 'Berat badan ideal. Pertahankan dengan pola makan seimbang (gizi seimbang 4 sehat 5 sempurna) dan olahraga minimal 150 menit/minggu.';
  else if (bmi < 30.0) recommendation = 'Berat badan berlebih. Kurangi asupan karbohidrat olahan dan gula. Lakukan aktivitas fisik rutin dan pantau berat badan mingguan.';
  else                  recommendation = 'Obesitas terdeteksi. Konsultasikan ke dokter untuk penanganan komprehensif, meliputi diet, olahraga, dan evaluasi risiko penyakit penyerta.';

  return {
    method: 'IMT (Indeks Massa Tubuh) – Dewasa',
    primaryStatus: status,
    bmi: parseFloat(bmi.toFixed(2)),
    interpretation: `IMT: ${bmi.toFixed(1)} kg/m²`,
    recommendation,
    isAlert,
    alertLevel,
  };
}

// ──────────────────────────────────────────
// MAIN FUNCTION — auto-dispatch by age
// ──────────────────────────────────────────
export function calcHealthStatus(
  gender: string,
  dobISOString: string,
  measurementDateISO: string,
  heightCm: number,
  weightKg: number
): HealthResult {
  const dob     = new Date(dobISOString);
  const mDate   = new Date(measurementDateISO);
  const ageMs   = mDate.getTime() - dob.getTime();
  const ageYears  = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  const ageMonths = ageYears * 12;

  if (ageMonths < 0) {
    return { method:'–', primaryStatus:'–', interpretation:'Tanggal tidak valid', recommendation:'', isAlert:false, alertLevel:'normal' };
  }

  if (ageMonths <= 59) {
    return calcWHOZScore(gender, Math.floor(ageMonths), heightCm, weightKg);
  } else if (ageYears <= 18) {
    return calcIMTPerAge(gender, ageYears, heightCm, weightKg);
  } else {
    return calcIMTDewasa(heightCm, weightKg);
  }
}
