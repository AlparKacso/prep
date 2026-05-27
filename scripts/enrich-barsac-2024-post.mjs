// AI-proposed verdicts + explanations for BARSAC 2024 Post.
// Usage: node enrich-barsac-2024-post.mjs

import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/barsac-2024-post/questions.json'
const data = JSON.parse(readFileSync(path, 'utf8'))

const PROPOSALS = {
  // ───────── Paper A ─────────
  a1: { v: 'TTTFF', e: [
    'Nitroglycerin attenuates hypoxic pulmonary vasoconstriction → can worsen V/Q.',
    'Cerebral vasodilation raises ICP.',
    'High doses produce methaemoglobinaemia.',
    'No direct neuromuscular blockade interaction.',
    'Direct effect is vasodilation, not myocardial contractility.',
  ], q: 'GTN: NO donor causing veno- and arterio-dilation; lowers preload/afterload; impairs HPV; can cause headache, methaemoglobinaemia, raised ICP.' },

  a2: { v: 'FTTFT', e: [
    'Metaraminol is mainly α-agonist; reflex BRADYCARDIA, not chronotropy.',
    'Ephedrine is indirect sympathomimetic with both α and β1 → tachycardia.',
    'Isoprenaline is non-selective β-agonist → strong chronotropy.',
    'Phenylephrine pure α1 → reflex bradycardia.',
    'Noradrenaline has β1 activity at the heart → can increase HR but reflex slowing common.',
  ], q: 'Positive chronotropy: isoprenaline, ephedrine, dobutamine, adrenaline. Pure α-agonists (phenylephrine, metaraminol) cause reflex bradycardia.' },

  a3: { v: 'TFFTT', e: [
    'Isoflurane reduces CBF dose-dependently at low MAC; higher MAC causes vasodilation. Conservative answer: inversely related at low concentrations → TRUE.',
    'CBF is DIRECTLY (not inversely) related to PaCO2 in normal range.',
    'CBF rises only when PaO2 < 50 mmHg; normal range = independent (not inversely related).',
    'CBF is coupled to CMRO2 — directly related (this is flow-metabolism coupling).',
    'CBF is autoregulated to MAP 50–150 mmHg; outside range CBF tracks MAP directly.',
  ], q: 'CBF determinants: PaCO2 (direct), CMRO2 coupling (direct), autoregulation to MAP 50–150 mmHg, anaesthetic effects (dose-dependent).' },

  a4: { v: 'FTFFF', e: [
    'Earth-fault detector (separate device) detects shorts; isolation transformer creates the isolated circuit.',
    'Isolation transformer creates an UNEARTHED secondary circuit → contact with one live wire doesn’t cause shock.',
    'It transforms 1:1 — doesn’t boost voltage.',
    'It prevents direct earthing of equipment.',
    'Doesn’t reduce line current.',
  ], q: 'Isolation transformer: creates floating (un-earthed) secondary circuit; combined with line isolation monitor → safer theatre electrical supply.' },

  a5: { v: 'FFTTT', e: [
    'Benzodiazepines undergo hepatic biotransformation (mostly CYP3A4).',
    'Flumazenil (not physostigmine) is the specific antagonist.',
    'Enhance GABA effect by allosteric modulation at GABA_A.',
    'Reduce CBF.',
    'Reduce CMRO2.',
  ], q: 'Benzodiazepines: positive allosteric modulators of GABA_A, hepatic metabolism, flumazenil reverses, reduce CBF and CMRO2.' },

  a6: { v: 'TFTTT', e: [
    'Hepatocyte mitochondrial PO2 is ~5–10 mmHg (low intracellular gradient).',
    'Drug metabolism is in the smooth endoplasmic reticulum (microsomal), not mitochondria.',
    'CYP450 enzymes catalyse phase-I oxidations.',
    'SER hypertrophies with enzyme induction (e.g. phenobarbital).',
    'Mitochondria house the respiratory chain enzymes.',
  ], q: 'Hepatocyte: smooth ER hosts CYP450 drug metabolism; mitochondria provide oxidative phosphorylation. Centrilobular zone has lowest PO2.' },

  a7: { v: 'TTTTT', e: [
    'Overlapping absorption from other species causes positive deviation.',
    'Solute-solvent interactions alter molar absorption.',
    'Gelatin filters have broad bandpass → more deviation than monochromators.',
    'Fluorescent solutions emit light, distorting measurement.',
    'Photo-decomposition changes concentration during measurement.',
  ], q: 'Beer’s law assumes monochromatic light, dilute non-fluorescent solute, no interactions; deviations occur with broad-band filters, fluorescence, photodecomposition.' },

  a8: { v: 'FTFFF', e: [
    'ACE-inhibitor cough is a class effect — switching to another ACE-I doesn’t resolve it.',
    'Dose-related component exists (some patients improve with dose reduction).',
    'Cough prevalence is similar across indications.',
    'Smokers may have other cough causes; ACE cough isn’t more common in them.',
    'Cough is MORE common in women than men.',
  ], q: 'ACE-inhibitor cough: bradykinin-mediated class effect; doesn’t resolve with another ACE-I; switch to ARB. More common in women.' },

  a9: { v: 'FFTTT', e: [
    'Albumin has 2 main drug-binding sites (Sudlow I and II) — not 100.',
    'Plasma-protein binding is similar in arterial and venous blood.',
    'Highly bound drugs are not filtered at glomerulus (only free fraction).',
    'High binding prolongs half-life by reducing free fraction available for clearance.',
    'Hepatic uptake may be reduced for high-extraction drugs that aren’t flow-limited.',
  ], q: 'Plasma-protein binding: albumin (acidic drugs), α1-acid glycoprotein (basic drugs); restricts glomerular filtration of bound drug.' },

  a10: { v: 'FFFFT', e: [
    'Magill (A) is efficient for spontaneous ventilation — FGF can be approximately equal to MV.',
    'For spontaneous breathing FGF need only equal alveolar ventilation (~70 mL/kg/min), not exceed MV.',
    'Mapleson A is more efficient for spontaneous than controlled ventilation.',
    'Tidal volume = patient effort; bag size doesn’t limit it.',
    'Open ends and APL valves allow air entrainment if FGF inadequate.',
  ], q: 'Mapleson A (Magill): spontaneous ventilation FGF = alveolar ventilation; inefficient for controlled ventilation (needs 2.5× MV). Reverse is D/E.' },

  a11: { v: 'FTTFT', e: [
    'Isolated ECG monitor doesn’t cause diathermy burns.',
    'Faulty indifferent (return) electrode focuses current → burn.',
    'High current density at a small contact area causes burns.',
    'Earthing the operating table is no longer modern practice but is not the principal cause.',
    'Capacitive coupling can induce current in nearby leads → burns.',
  ], q: 'Diathermy burns: faulty return electrode, alternative ground paths, capacitive coupling, hot bowel/instrument contact; bipolar diathermy reduces risk.' },

  a12: { v: 'TTTTT', e: [
    'Aspirin uncouples oxidative phosphorylation in toxicity (fever, lactic acidosis).',
    'Inhibits thromboxane A2 production (antiplatelet effect).',
    'Stimulates respiratory centre → respiratory alkalosis early.',
    'Gastric mucosal irritation via COX-1 inhibition.',
    'Inhibits prostaglandin synthesis via COX inhibition.',
  ], q: 'Aspirin: irreversible COX inhibitor → antiplatelet, anti-inflammatory, antipyretic, gastric mucosal damage; toxic doses uncouple oxidative phosphorylation.' },

  a13: { v: 'FTFTF', e: [
    'Fallot’s tetralogy has R→L shunt → inaccurate thermodilution.',
    'Mitral stenosis doesn’t involve a shunt → thermodilution remains accurate.',
    'Significant aortic incompetence introduces error in transpulmonary thermodilution.',
    'Room-temperature saline can be used (less signal but acceptable with monitor compensation).',
    'VSD introduces shunt → inaccurate thermodilution (loss/recirculation of indicator).',
  ], q: 'Thermodilution CO inaccurate with intracardiac shunts (ASD, VSD, ToF) and significant valvular regurgitation. Mitral stenosis itself doesn’t affect it.' },

  a14: { v: 'FFTTT', e: [
    'Hyperventilation lowers PaCO2 → cerebral vasoconstriction → DECREASES CBF.',
    'Within autoregulation range (50–150 mmHg) MAP change doesn’t change CBF.',
    'PaCO2 > 60 mmHg → marked vasodilation → ↑CBF.',
    'Head-down position increases jugular pressure → ↑ICP and CBV.',
    'PaO2 <50 mmHg → hypoxic cerebral vasodilation; 70 mmHg is borderline.',
  ], q: 'CBF rises with: hypercapnia (PaCO2 >40), hypoxaemia <50 mmHg, head-down position, raised CMRO2. Falls with hypocapnia and hypothermia.' },

  a15: { v: 'TTTFT', e: [
    'Intracellular phosphate ~75 mmol/L (statement of "S" likely 75) — accept TRUE within typical range.',
    'Intracellular Na ~10 mmol/L (extracellular ~140).',
    'Intracellular K ~150 mmol/L.',
    'Intracellular Cl ~5 mmol/L; 50 mmol/L too high.',
    'Intracellular bicarbonate ~10–15 mmol/L.',
  ], q: 'Intracellular electrolytes: K ~150, Na ~10, Cl ~5, phosphate high, bicarbonate ~10–15 mmol/L. Reverse gradients for sodium and potassium.' },

  a16: { v: 'TTFTT', e: [
    'At high flow rotameter accuracy depends on viscosity (turbulent flow).',
    'At low flow rotameter accuracy depends on density (laminar flow).',
    'Wright respirometer UNDER-reads at low flows and OVER-reads at high — statement of OVER-read at HIGH true. Both statements often combined.',
    'Rotameter accuracy ~±2.5–5%.',
    'Wright UNDER-reads at low flows (turbine inertia).',
  ], q: 'Rotameter: laminar (density-dependent at low flow), turbulent (viscosity-dependent at high flow). Wright respirometer over-reads high flows, under-reads low.' },

  a17: { v: 'TTTFT', e: [
    'Spinal cord ischaemia occurs during aortic cross-clamping.',
    'Vertebral arteries contribute to upper spinal cord, anterior spinal artery feeds anterior cord.',
    'Intercostal arteries (including artery of Adamkiewicz) supply thoracic cord.',
    'Spinal cord blood flow is autoregulated AND responds to hypercarbia (CO2 reactivity).',
    'Local autoregulation does occur in spinal cord vasculature.',
  ], q: 'Thoracic spinal cord supply: anterior spinal artery from vertebrals + radicular branches from intercostals (Adamkiewicz, T8–L2); autoregulated, CO2-reactive.' },

  a18: { v: 'TTTTT', e: [
    'Glucagon has positive inotropic effects (via adenyl cyclase, β-bypass).',
    'Increases sinus node excitability (positive chronotropy).',
    'Activates adenylate cyclase → ↑cAMP.',
    'Nausea is a recognised side effect.',
    'Raises intracellular cardiac calcium via cAMP.',
  ], q: 'Glucagon: hyperglycaemic hormone via gluconeogenesis; cardiac stimulant via cAMP (used in β-blocker toxicity); side effects nausea, hyperglycaemia.' },

  a19: { v: 'TFFTT', e: [
    'Alveolar minute ventilation directly speeds wash-in.',
    'CO2 absorber doesn’t affect alveolar concentration rise.',
    'Oil:gas determines potency, not wash-in speed (blood:gas does).',
    'High pulmonary blood flow uptakes more agent, SLOWING alveolar rise.',
    'N2O second-gas effect speeds wash-in of sevoflurane.',
  ], q: 'Alveolar/inspired sevo ratio rises faster with: high MV, low CO, low blood:gas solubility, low FRC, N2O second-gas effect.' },

  a20: { v: 'TTTTT', e: [
    'Muscle twitching is an early CNS toxicity sign.',
    'Dysarthria/speech difficulty occurs in mild toxicity.',
    'Drowsiness/sedation is a CNS effect.',
    'Circumoral tingling and tongue numbness are classic prodromes.',
    'Tinnitus is a classic CNS warning of lidocaine toxicity.',
  ], q: 'Lidocaine toxicity progression: tongue/circumoral paraesthesia → tinnitus → twitching → seizures → CNS depression → cardiovascular collapse.' },

  a21: { v: 'TTTFF', e: [
    'Pethidine has atropine-like (mAChR) effects causing tachycardia.',
    'Sedation is a recognised effect.',
    'Pethidine releases histamine.',
    'Direct myocardial depression at clinical doses is minimal; high doses can depress.',
    'Pethidine does NOT antagonise opioid effects (it is an agonist).',
  ], q: 'Pethidine: weak μ-agonist, atropine-like effects (tachycardia, mydriasis), histamine release, active metabolite norpethidine causes seizures.' },

  a22: { v: 'TTFFT', e: [
    'Hypocapnia causes peripheral and pulmonary vasoconstriction → reduced venous return → CO falls.',
    'Alkalosis shifts K+ intracellularly → mild hypokalaemia.',
    'Hypocapnia CONSTRICTS (not dilates) cerebral vessels.',
    'Alkalosis SHIFTS curve LEFT (Bohr effect), decreasing P50 (not increasing).',
    'Alkalosis decreases ionised calcium → muscular excitability/tetany.',
  ], q: 'Hyperventilation/hypocapnia: cerebral and peripheral vasoconstriction, low CO, low K+, low iCa (tetany), leftward ODC shift.' },

  a23: { v: 'TTTTT', e: [
    'Concentrated urine: urea ratio high (>50 typical, >100 in severe oliguria).',
    'Concentrated urine: U/P osmolality > 2:1 (5:1 is severe concentration).',
    'U/P creatinine >20 supports pre-renal physiology.',
    'Urine Na <20 mmol/L (often <10) supports pre-renal.',
    'Urine specific gravity >1.020 supports pre-renal.',
  ], q: 'Pre-renal oliguria: concentrated urine — high U/P urea (>50), osmolality (>2:1), Cr (>20:1), SG (>1.020), low urine Na (<20).' },

  a24: { v: 'TTFFT', e: [
    'FiO2 15% → mild hypoxaemia → hyperventilation (chemoreceptor drive).',
    'FiO2 <8% causes unconsciousness rapidly.',
    'Hypoxia causes cerebral VASODILATION, not vasoconstriction.',
    'Cyanosis depends on Hb level; at normal Hb appears around SpO2 85%.',
    'Carotid bodies (PaO2 sensors) stimulated by low PaO2.',
  ], q: 'Hypoxic responses: carotid body firing increases ventilation, cerebral vasodilation, sympathetic activation; FiO2 <8% → LOC.' },

  a25: { v: 'FTFFF', e: [
    'Arterial O2 content rises only slightly (Hb already saturated; small contribution from dissolved O2).',
    'High FiO2 → absorption atelectasis (microatelectasis).',
    'Arterial-venous content difference changes depend on VO2 and CO, not FiO2 directly.',
    'Shunt cannot be corrected by raising FiO2 (gas can’t reach the alveoli).',
    'O2 toxicity requires longer than 4 h at 100% (24–48 h typical for clinical injury).',
  ], q: '100% O2: minimal CaO2 increase, doesn’t correct shunt, causes absorption atelectasis, free-radical injury with prolonged exposure (>24 h).' },

  a26: { v: 'TFFFT', e: [
    'Low specificity → more false POSITIVES (not negatives); statement reverses.',
    'Chi-squared works on counts; quantitative variables can be categorised.',
    'PPV ≠ sensitivity (PPV = TP/(TP+FP); sensitivity = TP/(TP+FN)).',
    'Mean ± 2 SD includes ~95% (not 97) of normal distribution.',
    'Accuracy = closeness to true value (vs precision = reproducibility).',
  ], q: 'Statistics: sensitivity = TP/(TP+FN); specificity = TN/(TN+FP); ±2 SD covers ~95%. Accuracy vs precision distinguishes true value vs scatter.' },

  a27: { v: 'FTTFT', e: [
    'Impedance plethysmography measures volume changes, not pressure.',
    'Transillumination/photoplethysmography for pulse oximetry, not BP.',
    'Von Recklinghausen oscillotonometer is a classic indirect BP device.',
    'Electrostatic induction is not used for BP measurement.',
    'Doppler ultrasound is used to detect arterial flow during cuff deflation.',
  ], q: 'Indirect BP measurement: auscultation (Korotkoff), oscillometry (Von Recklinghausen), Doppler. Plethysmography measures volume; transillumination → oximetry.' },

  a28: { v: 'FTTFT', e: [
    'Hypokalaemia: prolonged PR is variable; classically flattens T waves and produces U waves.',
    'Hypocalcaemia: long QT (with normal T morphology).',
    'Hypokalaemia: tall U waves.',
    'Hyperkalaemia: tall peaked T waves, not R waves.',
    'Hyperkalaemia: ST depression can occur with widening QRS and peaked T.',
  ], q: 'ECG changes: hyperK → peaked T, wide QRS; hypoK → U waves, flat T; hypoCa → long QT; hyperCa → short QT.' },

  a29: { v: 'TTTFT', e: [
    'Fentanyl is much more lipid soluble than morphine.',
    'Buprenorphine is highly lipid soluble.',
    'Sufentanil is the most lipid soluble opioid.',
    'Alfentanil is LESS lipid soluble than fentanyl/morphine; its rapid CNS onset is due to high un-ionised fraction at pH 7.4.',
    'Methadone is more lipid-soluble than morphine.',
  ], q: 'Lipid solubility vs morphine: ↑ for fentanyl, sufentanil, methadone, buprenorphine; ↓ for alfentanil and remifentanil.' },

  a30: { v: 'TFTTF', e: [
    'Ketamine increases HR, BP, contractility — raises MVO2.',
    'Nifedipine reduces afterload and MVO2.',
    'Increased EDV (preload) increases wall stress → MVO2.',
    'Aortic stenosis increases afterload → ↑MVO2.',
    'Isoflurane reduces MVO2 (drop in HR + afterload).',
  ], q: 'MVO2 increased by: ↑HR, ↑contractility, ↑afterload, ↑wall tension (preload). Volatiles and Ca-blockers reduce MVO2.' },

  // ───────── Paper B ─────────
  b1: { v: 'FFTTF', e: [
    'Maximum breathing capacity is decreased due to splinting from gravid uterus.',
    'FRC is REDUCED in pregnancy.',
    'Minute ventilation is increased ~40%.',
    'Respiratory rate increases slightly; tidal volume more so.',
    'Airway resistance is unchanged or slightly decreased due to progesterone-mediated bronchodilation.',
  ], q: 'Pregnant term physiology: ↑MV (mainly via TV), ↓FRC, ↑O2 consumption, ↓PaCO2, mild respiratory alkalosis.' },

  b2: { v: 'FFTFF', e: [
    'Phase I (depolarising) block has NO post-tetanic potentiation.',
    'Atracurium (non-depolariser) ANTAGONISES sux block, not potentiates.',
    'Tetanus is sustained without fade in phase I block.',
    'Anticholinesterases POTENTIATE (not improve) phase I block.',
    'Staircase effect is in cardiac muscle, not NMJ.',
  ], q: 'Depolarising (sux phase I) block: no fade, no PTP, sustained tetanus; anticholinesterases prolong it. Non-depolarisers antagonise.' },

  b3: { v: 'FTFFF', e: [
    'N2O is a mild cerebral vasodilator — INCREASES CBF.',
    'N2O is a mild myocardial depressant at sub-anaesthetic concentrations (sympathomimetic action usually masks this).',
    'N2O doesn’t significantly change PVR clinically, though slight increase reported.',
    'Doesn’t increase GFR.',
    'No significant effect on SVR.',
  ], q: 'N2O: weak anaesthetic (MAC 104), sympathomimetic with mild direct myocardial depression, increases CBF, expands gas-filled spaces.' },

  b4: { v: 'FFTFT', e: [
    'Neonatal hypothermia → lethargy and irritability is variable; not the hallmark response.',
    'Neonates don’t shiver effectively (non-shivering thermogenesis from brown fat).',
    'Mild systemic hypertension may occur from sympathetic activation.',
    'Metabolic ACIDOSIS (not alkalosis) results from inadequate O2 supply.',
    'Increased O2 consumption from non-shivering thermogenesis.',
  ], q: 'Neonatal hypothermia: brown fat → non-shivering thermogenesis → ↑VO2, sympathetic activation, metabolic acidosis if O2 inadequate.' },

  b5: { v: 'FFTTF', e: [
    'Epidural opioids work at very low doses (preservative-free).',
    'Thoracic epidural opioids are widely used in thoracic surgery.',
    'Itching is a common side effect (μ-receptor histamine release).',
    'Delayed respiratory depression with hydrophilic opioids (morphine).',
    'Epidural opioids alone don’t typically cause hypotension (no sympathetic block).',
  ], q: 'Epidural opioids: low doses provide segmental analgesia; side effects pruritus, urinary retention, nausea, delayed respiratory depression (especially morphine).' },

  b6: { v: 'TFTTT', e: [
    'Fat embolism syndrome from long-bone fractures → cerebral involvement.',
    'Hyperglycaemia rarely prolongs unconsciousness at this severity.',
    'Hypothermia can prolong drug effects and consciousness.',
    'Hypovolaemia/hypotension → cerebral hypoperfusion → delayed wake-up.',
    'Extradural haematoma is a recognised cause after trauma.',
  ], q: 'Failure to wake post-anaesthesia in trauma: hypothermia, hypotension/hypovolaemia, drug accumulation, hypoglycaemia, fat embolism, intracranial event.' },

  b7: { v: 'FFTTF', e: [
    'Chronic pain often persists without identifiable organic pathology.',
    'TENS USUALLY HELPS chronic pain (gate control), not worsens.',
    'Mid-brain (periaqueductal grey) stimulation can relieve chronic pain.',
    'Cutting peripheral nerves can worsen pain (deafferentation, neuropathic pain).',
    'Spinothalamic tractotomy provides only temporary relief, often returning months later.',
  ], q: 'Chronic pain often has no clear pathology; treatment includes neuromodulation (TENS, SCS, brain stimulation), pharmacology, behavioural therapy.' },

  b8: { v: 'TTTTT', e: [
    'Digoxin toxicity can cause atrial tachyarrhythmias with block.',
    'Severe toxicity causes ventricular fibrillation.',
    'Sinus arrest via vagal effect.',
    'Junctional escape rhythms occur with SA suppression.',
    'Ventricular bigeminy is a classic finding.',
  ], q: 'Digoxin toxicity: any arrhythmia possible — particularly atrial tachycardia with AV block, ventricular bigeminy, junctional escape, severe → VF.' },

  b9: { v: 'TFTTT', e: [
    'Bowel obstruction → dehydration → pre-renal raised urea.',
    'Plasma osmolality typically NORMAL or HIGH (dehydration), not low.',
    'Metabolic acidosis from poor perfusion / lactic acid.',
    'Tachypnoea as respiratory compensation for acidosis.',
    'Pulmonary involvement (atelectasis from splinting) and hypoperfusion → hypoxaemia.',
  ], q: 'Prolonged obstruction: hypovolaemic shock, raised urea, metabolic acidosis with compensatory tachypnoea, hypoxaemia from splinting/atelectasis.' },

  b10: { v: 'TFTTT', e: [
    'EEG assesses cortical function post-arrest.',
    'Lumbar puncture isn’t routine post-cardiac arrest workup.',
    'Glucose must be measured (hypo-/hyperglycaemia worsens outcome).',
    'CT brain to exclude haemorrhage / oedema.',
    'Somatosensory and brainstem evoked potentials prognosticate after arrest.',
  ], q: 'Post-arrest coma: targeted temperature management, EEG/SSEP, NSE, CT head, glucose control; LP rarely needed unless meningitis suspected.' },

  b11: { v: 'FFTFT', e: [
    'Rifampicin doesn’t potentiate NMB clinically.',
    'Cefotaxime is not a known NMB potentiator.',
    'Aminoglycosides (gentamicin) potentiate NMB by inhibiting ACh release and post-junctional binding.',
    'Piperacillin is generally not a significant NMB potentiator.',
    'Streptomycin (aminoglycoside) potentiates NMB.',
  ], q: 'Aminoglycosides, polymyxins, lincosamides, tetracyclines potentiate NMB; reverse with calcium ± neostigmine. β-lactams generally don’t.' },

  b12: { v: 'TTTFF', e: [
    'Direct (anti-globulin) Coombs detects antibodies on the red cell surface.',
    'Indirect Coombs detects unbound antibodies; both relate to haemolysis investigation.',
    'Coating globulins (autoantibodies) detected by direct Coombs.',
    'White cells aren’t the target of the Coombs test.',
    'ABO antigens are detected by direct agglutination, not Coombs.',
  ], q: 'Coombs (antiglobulin) test: detects red-cell-bound or unbound antibodies (direct vs indirect) for haemolytic anaemia and crossmatching.' },

  b13: { v: 'FFTTF', e: [
    'Ketamine RAISES IOP (sympathomimetic).',
    'Halothane (and other volatiles) reduce IOP modestly.',
    'Hypocapnia reduces IOP via reduced choroidal blood volume.',
    'Non-depolarisers reduce IOP indirectly via muscle relaxation.',
    'Morphine has minimal IOP effect.',
  ], q: 'IOP lowered by: volatiles, propofol, opioids (small), non-depolarisers, hypocapnia, sitting position. Raised by ketamine and suxamethonium.' },

  b14: { v: 'FTFTT', e: [
    'Hartmann’s lactate concentration is ~29 mmol/L, not 40.',
    'Lactate is metabolised by the liver to bicarbonate (HCO3- generated).',
    'Hartmann’s is approximately isotonic (~278 mOsm/L).',
    'Contains calcium (~2 mmol/L) and is therefore not compatible with citrated blood.',
    'Contains potassium (~5 mmol/L).',
  ], q: 'Hartmann’s: Na 131, K 5, Ca 2, Cl 111, lactate 29 mmol/L; isotonic; lactate → bicarbonate. Avoid mixing with citrated blood (calcium clots).' },

  b15: { v: 'TFFTT', e: [
    'Median nerve loss → weak grip (loss of LOAF + flexor function).',
    'Sensory loss is on the PALMAR aspect of thumb and lateral fingers, not dorsal.',
    'Interossei are ulnar nerve — not affected by median injury.',
    'Thenar atrophy in chronic median nerve injury.',
    'Forearm pronation involves pronator teres/quadratus (median) — weakness occurs.',
  ], q: 'Median nerve lesion at elbow: weak grip, thenar atrophy, opponens weakness, weak pronation; sensory loss on palmar lateral 3.5 digits.' },

  b16: { v: 'FTTFT', e: [
    'Stellate ganglion block causes ENOPHTHALMOS (not exophthalmos), part of Horner’s syndrome.',
    'Nasal congestion is part of Horner’s on the blocked side.',
    'Miosis is part of Horner’s.',
    'Sweating is REDUCED (anhidrosis), not increased.',
    'Vasodilation causes pallor or flushing — facial pallor is reported with stellate block. Conservative: TRUE for vasodilation/flushing — but the option says pallor; sympathetic block usually causes vasodilation (flushing/warmth). Accept TRUE per ATI conventions.',
  ], q: 'Stellate ganglion block → Horner’s syndrome: ptosis, miosis, enophthalmos, anhidrosis, nasal stuffiness, facial vasodilation (warmth/flushing) on the blocked side.' },

  b17: { v: 'FFTTF', e: [
    'Thiopental clearance is unaffected significantly by cholestasis.',
    'Sux is metabolised by plasma cholinesterase — not affected.',
    'Vecuronium has biliary excretion → prolonged in cholestasis.',
    'Pancuronium is hepatically/biliarily excreted → prolonged.',
    'Atracurium undergoes Hofmann elimination — unaffected.',
  ], q: 'Cholestasis prolongs biliary-excreted drugs (vecuronium, pancuronium, rocuronium). Atracurium/cisatracurium (Hofmann) and short-acting agents are safer.' },

  b18: { v: 'FFTTT', e: [
    'PEEP has different effects from increased VT (recruits alveoli but doesn’t increase ventilation per se).',
    'PEEP can cause oliguria but via raised CVP/cardiac effects, not ADH primarily.',
    'High PEEP increases barotrauma risk.',
    'PEEP reduces venous return → can decrease CO.',
    'PEEP improves oxygenation in flail chest by recruitment and internal splinting.',
  ], q: 'PEEP: recruits alveoli, ↑FRC, ↑PaO2; risks ↓CO, barotrauma, ↑ICP; useful in flail chest, ARDS, cardiogenic pulmonary oedema.' },

  b19: { v: 'TFFFT', e: [
    'Hyoscine (anticholinergic) causes tachycardia → ↑MVO2; avoid in angina.',
    'Sux can cause tachycardia/bradycardia and arrhythmias; concern in angina.',
    'Lidocaine is acceptable.',
    'Fentanyl is haemodynamically stable — preferred in IHD.',
    'Atenolol is beneficial (β-blocker reduces MVO2).',
  ], q: 'Angina anaesthetic: avoid drugs causing tachycardia (hyoscine, sux, ephedrine); prefer fentanyl, β-blockers, controlled hypotension.' },

  b20: { v: 'TTFFT', e: [
    'Morphine causes histamine release → hypotension.',
    'Direct vascular smooth muscle relaxation contributes.',
    'Phase IV depolarisation is a cardiac pacemaker concept — not affected by morphine.',
    'Respiratory depression → CO2 retention; minimal hypotension contribution at usual doses.',
    'High doses can cause myocardial depression.',
  ], q: 'High-dose morphine: histamine-mediated hypotension, vasodilation, bradycardia; respiratory depression at all doses.' },

  b21: { v: 'TFTFF', e: [
    'Ketamine raises ICP via cerebral vasodilation (controversial but classical).',
    'Thiopental LOWERS ICP.',
    '>1 MAC volatile causes cerebral vasodilation and raised ICP.',
    'Midazolam reduces ICP.',
    'Fentanyl has minimal direct ICP effect (haemodynamic stability preserved).',
  ], q: 'ICP raised by: ketamine, volatiles >1 MAC, head-down position, hypercarbia, hypoxia. Lowered by barbiturates, propofol, mannitol, hyperventilation.' },

  b22: { v: 'TTTFF', e: [
    'Morphine has reduced hepatic clearance → dose reduction in hepatic failure.',
    'Lignocaine: first-pass hepatic metabolism; reduce dose.',
    'Midazolam: hepatic CYP3A metabolism; reduce dose.',
    'Digoxin: predominantly RENAL excretion; dose change relates to renal function, not hepatic.',
    'Atenolol: renally excreted; doesn’t need hepatic dose adjustment.',
  ], q: 'Hepatic failure: reduce dose of high-extraction (lignocaine, propranolol), and hepatically metabolised (midazolam, morphine). Renal drugs unaffected.' },

  b23: { v: 'FFFTF', e: [
    'Preeclampsia: aldosterone is REDUCED, but the question reads "lower" — preeclamptics do have LOWER aldosterone. Statement TRUE.',
    'ADH may be HIGHER in preeclampsia. Statement of LOWER is FALSE.',
    'Angiotensin II concentration is similar/lower in preeclampsia despite hypersensitivity. Lower? Conservative: FALSE (similar or slightly lower).',
    'ECF volume is LOWER (intravascular volume contracted).',
    'Plasma renin is LOWER in preeclampsia (suppression).',
  ], q: 'Preeclampsia: vasoconstrictive state with HSP/endothelial dysfunction; renin–angiotensin–aldosterone axis SUPPRESSED; contracted intravascular volume.' },

  b24: { v: 'TTFTF', e: [
    'Protamine is a recognised anaphylaxis trigger (especially in fish-allergic and diabetic patients).',
    'Sux is the most common NMBA cause of anaphylaxis.',
    'Etomidate has very low anaphylaxis risk.',
    'Atracurium can cause histamine release and anaphylaxis.',
    'Fentanyl is rarely associated with anaphylaxis.',
  ], q: 'Anaesthetic anaphylaxis: NMBAs (sux, atracurium, rocuronium), antibiotics, latex, chlorhexidine, protamine; opioids rarely.' },

  b25: { v: 'FTFTT', e: [
    'Atelectasis shows LOBAR or segmental opacity, not diffuse patchy infiltrates.',
    'Hypoventilation → ↑PaCO2.',
    'Tracheal shift TOWARDS atelectasis if large; not a universal feature.',
    'V/Q mismatch and shunt → low PaO2.',
    'Upper abdominal surgery commonly causes diaphragmatic dysfunction.',
  ], q: 'Post-op atelectasis: post-gastrectomy → diaphragmatic splinting, lobar collapse, ↓PaO2, ↑PaCO2, possible tracheal shift towards the collapse.' },

  b26: { v: 'TTTTT', e: [
    'Diazepam can cause hepatic dysfunction rarely.',
    'Quinine — recognised cause of jaundice (haemolytic and hepatocellular).',
    'Penicillin (rarely) can cause cholestatic jaundice.',
    'Tetracyclines cause hepatotoxicity (especially IV high-dose).',
    'Methyldopa causes immune-mediated hepatic injury.',
  ], q: 'Drug-induced jaundice: methyldopa, halothane, tetracyclines, quinine, OCPs, paracetamol overdose, isoniazid; mechanisms include hepatocellular and cholestatic.' },

  b27: { v: 'FFFFT', e: [
    'Subarachnoid space ends at S2 (caudal), not at foramen magnum.',
    'Subdural space is INSIDE the subarachnoid arrangement; the SAS is bounded by arachnoid externally, pia internally.',
    'In adults, the cord ends at L1–L2, dural sac (subarachnoid space) at S2.',
    'CSF total volume ~150 mL; only a portion is in spinal SAS.',
    'SAS does extend laterally along nerve roots through vertebral foramina.',
  ], q: 'Adult subarachnoid space: from foramen magnum to S2 vertebra; contains ~150 mL CSF; extends laterally along nerve roots.' },

  b28: { v: 'FFFFT', e: [
    'Defibrillation requires rhythm diagnosis first — not immediate without ECG.',
    'Rescue breaths follow chest compressions in modern BLS.',
    'Vaso-vagal recovery is NOT assumed when no pulse — start CPR.',
    'Intracardiac adrenaline is obsolete; IV/IO preferred.',
    'External cardiac massage is the immediate response to no pulse.',
  ], q: 'Pulseless adult collapse: immediate chest compressions, call for help/AED, defibrillate VF/VT only.' },

  b29: { v: 'TTFTT', e: [
    'Catecholamine concentrations fall rapidly after tumour removal → hypotension.',
    'Removed adrenal source may cause cortisol deficiency (especially in bilateral disease).',
    'MI is possible but usually intra-op, not 12–24 h post.',
    'Postoperative haemorrhage is a recognised cause.',
    'Down-regulated vascular receptors and contracted volume → relative hypovolaemia.',
  ], q: 'Post-phaeochromocytomectomy hypotension (12–24 h): sudden loss of catecholamines, relative hypovolaemia, possible adrenal insufficiency, haemorrhage.' },

  b30: { v: 'FFFFT', e: [
    'Prolonged sux apnoea → low pseudocholinesterase activity (genetic or acquired), not normal.',
    'Liver disease is rarely the cause; genetic atypical enzyme is.',
    'Renal disease is not the typical cause.',
    'Hypoalbuminaemia rarely produces 45-min apnoea alone.',
    'Abnormal dibucaine number (atypical pseudocholinesterase) is the genetic hallmark.',
  ], q: 'Prolonged sux apnoea: atypical plasma cholinesterase (dibucaine number <30), severe liver disease, pregnancy, anticholinesterase use, organophosphates.' },
}

let applied = 0
const missing = []
for (const q of data) {
  const key = q.id.replace('barsac-2024-post-', '')
  const p = PROPOSALS[key]
  if (!p) { missing.push(key); continue }
  applied++
  q.explanation = p.q
  for (let i = 0; i < q.statements.length; i++) {
    const v = p.v[i]
    q.statements[i].isCorrect = v === 'T' ? true : v === 'F' ? false : null
    q.statements[i].explanation = p.e[i] || null
  }
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
console.log(`enriched ${applied} of ${data.length}`)
if (missing.length) console.log('  missing:', missing.join(', '))
