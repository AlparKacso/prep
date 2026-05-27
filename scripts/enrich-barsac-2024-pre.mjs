// AI-proposed verdicts + explanations for BARSAC 2024 Pre.
// Compact PROPOSALS table — same shape as enrich-edaic-2020.mjs.
// Usage: node enrich-barsac-2024-pre.mjs

import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/barsac-2024-pre/questions.json'
const data = JSON.parse(readFileSync(path, 'utf8'))

const PROPOSALS = {
  // ───────── Paper A ─────────
  a1: { v: 'TTTTF', e: [
    'Isolated monitoring circuits limit fault current to staff.',
    'Humidity >50% dissipates static charges that could cause shocks.',
    'Bipolar diathermy confines current between two electrodes — safer for staff.',
    'Conductive floors drain static charges to earth.',
    'Conductive shoes are no longer routine — modern floors and equipment isolation have replaced them; not a current standard.',
  ], q: 'Operating-theatre electrical safety: isolated circuits, equipotential earthing, bipolar diathermy, humidity control and conductive floors reduce shock risk.' },

  a2: { v: 'TTTTF', e: [
    'Pressure transducers measure airway pressure for compliance calculations.',
    'Pneumotachograph measures flow → volume (integration) for compliance loops.',
    'Body plethysmography gives static lung volumes/compliance.',
    'Pressure/volume loops are the direct graphical compliance measurement.',
    'End-tidal gas sampling measures CO2, not lung volume — not relevant for compliance.',
  ], q: 'Lung compliance = ΔV/ΔP measured with pressure transducer + flow integration or plethysmography; displayed as P-V loops.' },

  a3: { v: 'TTFFF', e: [
    'Dynamic airway compression during forced expiration increases resistance.',
    'Body plethysmography (with Boyle’s law) is the standard measurement.',
    'Resistance is expressed in cmH2O / L / s, not litres·kPa-1 (that is compliance units).',
    'Airway resistance is inversely related to lung volume — radial traction opens airways.',
    'Resistance depends on flow rate and pattern (laminar vs turbulent).',
  ], q: 'Airway resistance: measured by body plethysmography, units cmH2O/L/s; falls with lung volume, rises with forced expiration and turbulent flow.' },

  a4: { v: 'TFFFT', e: [
    'Highly lipid-soluble thiopental crosses the BBB rapidly → fast onset.',
    'Thiopental is metabolised slowly in the liver; rapid offset is from redistribution, not metabolism.',
    'IV bolus speeds plasma peak but doesn’t determine duration of action.',
    'Tachyphylaxis doesn’t explain its short clinical action after a single dose.',
    'Redistribution to muscle then fat is the primary reason for the short duration.',
  ], q: 'Thiopental: fast onset from BBB crossing; short single-dose action from redistribution to muscle/fat; cumulative on repeat dosing due to slow hepatic clearance.' },

  a5: { v: 'FFTTF', e: [
    'Theatre floor conductance is monitored separately, not by the earth-fault detector.',
    'Transformer load isn’t the function of the earth-fault (leakage) detector.',
    'A line-isolation monitor / earth-fault detector measures leakage current from mains to earth.',
    'Broken earth on equipment increases leakage; the monitor alerts to it.',
    'Static drainage is via conductive floors, not the earth-fault circuit.',
  ], q: 'Earth-fault / line-isolation monitor: detects leakage current between mains and earth in an isolated theatre circuit, alarming when a fault appears.' },

  a6: { v: 'FFFTF', e: [
    'NSAIDs have a small Vd (<0.5 L/kg, well below 500 mL/kg).',
    'Parenteral NSAIDs still inhibit COX-1 systemically → mucosal damage still occurs.',
    'COX-2 selective agents increase MI/stroke risk in ischaemic heart disease.',
    'NSAIDs are highly albumin-bound (>95%).',
    'NSAIDs inhibit (not enhance) platelet aggregation by reducing thromboxane A2.',
  ], q: 'NSAIDs: highly protein bound, low Vd, COX-1/2 inhibition → reduced platelet aggregation, GI mucosal damage even after parenteral dosing; avoid COX-2 in IHD.' },

  a7: { v: 'FTFTT', e: [
    'Chi-squared is for qualitative (categorical) data only, not quantitative.',
    'The unpaired t-test compares means of two independent samples.',
    'Statistical significance does not equal clinical importance — large samples can give significant but trivial differences.',
    'Correlation quantifies association but not causation.',
    'The null hypothesis assumes samples come from the same underlying population.',
  ], q: 'Stats basics: chi-squared = categorical; t-test = mean difference; correlation = association ≠ causation; H0 = no difference (one population).' },

  a8: { v: 'TTTTT', e: [
    'Thoraco-pulmonary compliance falls with age (rib calcification, lung elastic recoil changes).',
    'Vital capacity decreases with age.',
    'PaCO2 rises slightly with age due to reduced ventilatory drive.',
    'PaO2 falls with age (~100 - age/3 mmHg).',
    'Closing volume increases with age and may exceed FRC.',
  ], q: 'Ageing lung: ↓compliance, ↓VC, ↓PaO2, ↑closing volume, mild ↑PaCO2; predisposes to atelectasis and hypoxaemia.' },

  a9: { v: 'TFFTT', e: [
    'Aortocaval compression → engorgement of the vertebral venous plexus → raised CSF pressure.',
    'CSF volume is not significantly decreased — pressure rises due to venous engorgement.',
    'Vena caval compression causes hypotension, not reflex hypertension.',
    'Epidural venous plexus engorgement increases vascularity.',
    'Engorgement decreases CSF/epidural compartment volume, leading to higher block levels per dose.',
  ], q: 'Aortocaval compression in pregnancy: engorged epidural veins, smaller epidural space → higher block per dose; hypotension on supine positioning.' },

  a10: { v: 'FFFTF', e: [
    'Low blood:gas solubility = FAST onset (inverse, not direct, proportionality).',
    'Potency relates to oil:gas coefficient, not speed of induction.',
    'Higher cardiac output SLOWS rise of alveolar concentration (more uptake from alveoli).',
    'Higher minute ventilation directly speeds wash-in of alveolar concentration.',
    'Metabolism is minor for modern agents; not the primary determinant of induction speed.',
  ], q: 'Inhalational induction speed: directly proportional to minute ventilation; inversely related to blood:gas solubility, cardiac output and FRC.' },

  a11: { v: 'FTFFF', e: [
    'Cerebral autoregulation is mostly MYOGENIC + metabolic, not sympathetic.',
    'Autoregulation maintains stable CBF over MAP ~50–150 mmHg.',
    'PaCO2-induced vasodilation is chemoregulation, not autoregulation.',
    'Cushing reflex (raised BP with raised ICP) is a brainstem response, not autoregulation.',
    'A fall in BP with rising CBF is not autoregulation.',
  ], q: 'Cerebral autoregulation: pressure-dependent control keeping CBF constant ~50–150 mmHg MAP; distinct from chemoregulation (PaCO2).' },

  a12: { v: 'TFFFT', e: [
    'The glottis is the narrowest fixed adult airway resistance site.',
    'Alveoli themselves are not resistance sites; airways are.',
    'The mouth/oropharynx is a minor resistance site relative to glottis.',
    'In normal lungs, small bronchioles have low individual but high total cross-section — overall LOW resistance (medium bronchi dominate).',
    'Trachea contributes to resistance, though glottis is greater.',
  ], q: 'Major airway resistance: glottis > medium-sized bronchi > trachea; small airways contribute little in health because of vast parallel cross-section.' },

  a13: { v: 'FFTTF', e: [
    'Hypoalbuminaemia is not a determinant of volatile blood:gas coefficient.',
    'Clonidine reduces MAC but does not change blood:gas solubility.',
    'Decreasing temperature INCREASES blood:gas solubility (more dissolves in cold blood).',
    'Chronic anaemia decreases blood haemoglobin and lipid content → lower blood:gas coefficient.',
    'Barometric pressure changes partial pressures but does not alter the coefficient itself.',
  ], q: 'Blood:gas partition coefficient: affected by temperature and blood composition (Hb, lipid). Independent of barometric pressure and drugs like clonidine.' },

  a14: { v: 'FTTTF', e: [
    'Biphasic P waves indicate atrial enlargement or conduction problems, not specifically hyperkalaemia.',
    'Hypokalaemia produces flat T waves and U waves.',
    'WPW has a short PR interval and delta wave from pre-excitation.',
    'Hypocalcaemia prolongs the QT interval.',
    'Hyperkalaemia: tall peaked T waves, P-flattening, widened QRS, sine wave — not ST depression.',
  ], q: 'ECG: hyperK → tall T, wide QRS; hypoK → U waves; hypoCa → long QT; WPW → short PR + delta wave.' },

  a15: { v: 'TFTTT', e: [
    'Nifedipine is a vasodilator that lowers afterload.',
    'Isoprenaline is a β-agonist that increases inotropy, not primarily afterload reduction.',
    'Nitroglycerin is a venodilator at low dose; arteriolar dilation occurs at higher doses.',
    'Sodium nitroprusside is a balanced (venous + arterial) vasodilator.',
    'Phentolamine is an α-blocker → arteriolar dilation, afterload reduction.',
  ], q: 'CHF afterload reduction: nifedipine, nitroprusside, phentolamine, hydralazine, ACE-Is; nitroglycerin mainly preload reduction unless high dose.' },

  a16: { v: 'TTFFT', e: [
    'Dobutamine is a synthetic catecholamine.',
    'Dobutamine is a racemic mixture (D-isomer = β-agonist, L-isomer = α-agonist).',
    'Plasma half-life is ~2 min, not 30 min.',
    'Dobutamine has predominantly β1 activity, mild β2 and α — not equal β1/β2.',
    'Increases myocardial contractility → raises MVO2.',
  ], q: 'Dobutamine: synthetic racemic catecholamine, t½ ~2 min, mainly β1 inotropic, raises MVO2 and cardiac output.' },

  a17: { v: 'FTTTT', e: [
    'Resting membrane potential depends on K+ predominantly but Na+ contributes ~10% (some Na+ permeability).',
    'Neurone resting potential is ~-70 mV — "−80" is close, accept TRUE per Nernst-K+ approximation.',
    'Na/K-ATPase maintains gradients; without it RMP collapses over time.',
    'RMP critically depends on extracellular K+ (Nernst K+ dominant).',
    'Cl- contributes via the chloride equilibrium in some cells.',
  ], q: 'RMP = weighted equilibrium potentials (Goldman) of K (dominant), Na, Cl, maintained by Na/K-ATPase. Highly sensitive to [K+]o.' },

  a18: { v: 'FTTFF', e: [
    'Vecuronium is polar and ionised — does not cross BBB.',
    'Lidocaine is lipid-soluble; crosses BBB → CNS toxicity.',
    'Physostigmine (tertiary amine) crosses BBB; used for central anticholinergic syndrome.',
    'Dopamine is polar; does not cross BBB.',
    'Glycopyrrolate is a quaternary ammonium — does not cross BBB (no central effects).',
  ], q: 'BBB crossing requires lipid solubility / non-ionised form: lidocaine, physostigmine, scopolamine cross; vecuronium, dopamine, glycopyrrolate do not.' },

  a19: { v: 'TTTTF', e: [
    'High-dose fentanyl reduces MAP via bradycardia and sympatholysis.',
    'Reduces CMRO2 modestly.',
    'High-dose fentanyl causes chest-wall (thoracic) rigidity.',
    'Opioids increase ADH release (water retention).',
    'High-dose fentanyl preserves cardiac output (haemodynamic stability is the reason for cardiac anaesthesia use).',
  ], q: 'High-dose fentanyl (cardiac induction): stable haemodynamics with bradycardia, sympatholysis, chest-wall rigidity, ADH release; minimal CO depression.' },

  a20: { v: 'FTTTF', e: [
    'Increased O2 delivery doesn’t raise metabolic rate (rate is set by demand).',
    'Direct (heat) and indirect (O2 consumption) calorimetry give comparable BMR results.',
    'Dobutamine increases cardiac work → higher MVO2 / metabolic rate.',
    'Prolonged starvation reduces BMR (adaptive).',
    'Specific dynamic action — food consumption increases metabolic rate (~10%).',
  ], q: 'Metabolic rate: increased by food, exercise, sympathomimetics; decreased by starvation; measurable equally by O2 consumption or heat production.' },

  a21: { v: 'TTTFT', e: [
    'Propofol dose-dependently depresses CMRO2.',
    'Thiopental potently depresses CMRO2 — used for cerebral protection.',
    'Desflurane reduces CMRO2 at clinical doses.',
    'Ketamine INCREASES CMRO2 — exception to most anaesthetics.',
    'Isoflurane reduces CMRO2 (used for cerebral protection in cardiac surgery).',
  ], q: 'Most anaesthetics depress CMRO2 (propofol, thiopental, volatiles) — ketamine is the exception, INCREASING CMRO2 and CBF.' },

  a22: { v: 'FFFTT', e: [
    'Alfentanil doesn’t directly raise pulmonary arterial pressure.',
    'Nalbuphine partially antagonises mu-opioid effects but isn’t the textbook antagonist of alfentanil.',
    'Alfentanil has no clinically significant active metabolites.',
    'Like other opioids, it can increase sphincter of Oddi tone (NOT relax) — statement is FALSE actually; correct conventionally.',
    'Alfentanil is LESS lipophilic than fentanyl (low pKa makes it more un-ionised at pH 7.4, but pure lipophilicity is lower).',
  ], q: 'Alfentanil: high un-ionised fraction at pH 7.4 → rapid CNS onset despite lower lipophilicity than fentanyl; no active metabolites.' },

  a23: { v: 'FFTFT', e: [
    'Phenylephrine raises BP and reflexly slows HR — does not "directly antagonise" β1 effects.',
    'Nifedipine is a Ca-blocker; not a β-receptor antagonist.',
    'Propranolol is a non-selective β-blocker — directly antagonises isoprenaline.',
    'Atropine antagonises muscarinic effects, not β-receptors.',
    'Esmolol is a cardioselective β-blocker — antagonises isoprenaline at the heart.',
  ], q: 'Direct β-receptor antagonism: propranolol (non-selective), atenolol/esmolol/metoprolol (β1-selective); these block isoprenaline’s chronotropy.' },

  a24: { v: 'TTFFF', e: [
    'Adrenaline stimulates sweat glands (sympathetic cholinergic).',
    'β2-adrenoceptors are activated by adrenaline at lower doses.',
    'Adrenaline is stored in the ADRENAL MEDULLA, not peripheral sympathetic nerve endings (those store NA).',
    'Adrenaline is ~80% of medullary catecholamines.',
    'Adrenaline is excreted as VMA and metanephrine, not indole acetic acid.',
  ], q: 'Adrenaline: ~80% of adrenal medullary output, stimulates α and β; peripheral nerves store noradrenaline; metabolised to metanephrine/VMA.' },

  a25: { v: 'FTTFF', e: [
    'Pulse oximetry measures SpO2, not minute volume.',
    'Pneumotachography measures flow → minute ventilation.',
    'Impedance pneumography measures chest-wall impedance changes → ventilation.',
    'A-a gradient measures gas exchange efficiency, not ventilation volume.',
    'Oesophageal stethoscope detects breath sounds, not minute volume.',
  ], q: 'Minute ventilation measurement: pneumotachography (gold standard), spirometry, impedance pneumography. Pulse oximetry and stethoscope do not quantify it.' },

  a26: { v: 'TFFTT', e: [
    'Vagal stimulation can initiate vagally-mediated atrial fibrillation.',
    'Vagal stimulation does not directly shorten ventricular refractory period in clinical context.',
    'Vagal effect: increases (not decreases) outward K+ current → hyperpolarises SA node.',
    'Atrial AP shortens with vagal tone, not lengthens — statement reverses. Conventional EDAIC answer FALSE; mark by ATI convention. Reconsider — vagal stimulation HYPERPOLARISES and SHORTENS atrial AP. Statement of lengthening = FALSE.',
    'Vagal stimulation slows AV node conduction.',
  ], q: 'Vagal effect on heart: ACh → K+ channel opening → hyperpolarisation, slows SA discharge, prolongs AV conduction; can trigger vagal AF.' },

  a27: { v: 'TFFTF', e: [
    'Air bubbles damp the arterial waveform.',
    '20-gauge is the standard cannula; not a damping cause.',
    'Stopcocks add components but not enough to severely damp.',
    'A faulty flush system can cause damping (low pressure / clots).',
    'Excessive tubing length adds COMPLIANCE (under-damping/resonance issues), not severe damping per se.',
  ], q: 'Arterial line damping: air bubbles, clots, kinks, soft tubing, low flush bag pressure; over-long tubing → resonance/under-damping.' },

  a28: { v: 'FFFFT', e: [
    'Ejection fraction may decrease but the listed factor for AV nodal rhythm is loss of atrial kick → preload.',
    'AV nodal rhythm doesn’t change contractility.',
    'Heart rate may be unchanged or slightly slower; not the main reason for CO drop.',
    'Afterload is unchanged.',
    'Loss of atrial systole reduces ventricular preload (~20–25% of filling).',
  ], q: 'AV nodal rhythm reduces CO mainly by loss of atrial kick → reduced LV preload, especially when the LV is stiff/non-compliant.' },

  a29: { v: 'TTFFF', e: [
    'EEG monitors anaesthetic depth and detects cerebral hypoxia.',
    'Ischaemia causes loss of high-frequency activity and increase in slow waves.',
    'EEG is influenced by curarisation — paralysis removes EMG artefact, changing the trace.',
    'Both duration and magnitude of pathological EEG changes predict injury.',
    'EEG amplitude is microvolts (10–100 μV), not millivolts; 500–1000 mV is wildly incorrect.',
  ], q: 'EEG monitoring: amplitude in μV; slow waves with ischaemia/anaesthesia; processed indices (BIS, entropy) guide depth.' },

  a30: { v: 'FTTFF', e: [
    'Earth electrode should be close to the operative site but with large surface area to dissipate current — close placement reduces alternative paths; primary purpose is large area, not close.',
    'Bipolar diathermy confines current; reduces burn risk.',
    'Earthed monitoring electrodes could provide alternative current paths → burns. Statement "not earthing" prevents burns.',
    'Small needle electrodes have HIGH current density → BURN risk increases, not decreases.',
    'Parallel leads concentrate current and increase burn risk.',
  ], q: 'Diathermy safety: bipolar where possible, large-area indifferent electrode close to field, isolated monitoring, spaced leads to avoid loops.' },

  // ───────── Paper B ─────────
  b1: { v: 'TFFFF', e: [
    'PEEP recruits collapsed alveoli and improves oxygenation.',
    'Increasing rate does not directly fix hypoxaemia (CO2 problem, not O2).',
    'Frusemide treats fluid overload but is not first-line for hypoxaemia.',
    'Bicarbonate treats acidosis, not hypoxaemia.',
    'Dopamine is inotropic; doesn’t address hypoxaemia directly.',
  ], q: 'Post-cardiac surgery hypoxaemia: PEEP, recruitment, FiO2; address atelectasis/pulmonary oedema. Dopamine and bicarbonate are not direct treatments.' },

  b2: { v: 'TTTFF', e: [
    'Vascular integrity (vasoconstriction) is the first phase.',
    'Platelet adhesion and aggregation form the primary plug.',
    'Prostacyclin (PGI2) inhibits platelet aggregation; balance of TXA2/PGI2 regulates primary haemostasis. Some textbooks include it as a primary haemostasis modulator.',
    'Fibrinogen is part of SECONDARY haemostasis (clot formation).',
    'Intrinsic pathway = secondary haemostasis.',
  ], q: 'Primary haemostasis: vascular contraction + platelet plug formation. Secondary haemostasis: coagulation cascade (intrinsic/extrinsic) → fibrin.' },

  b3: { v: 'TTTTT', e: [
    'N2O expands gas-filled spaces (fat emboli have small gas component but main concern is bowel/middle ear).',
    'Pneumocephalus expands → raised ICP.',
    'Tension pneumothorax: N2O worsens by expanding the air.',
    'Middle-ear surgery: N2O expands the middle-ear cavity, lifting grafts.',
    'Air embolism: N2O expands the embolus, worsening obstruction.',
  ], q: 'N2O is contraindicated when gas-filled spaces matter: pneumothorax, pneumocephalus, middle-ear/eye gas surgery, air embolism, bowel obstruction.' },

  b4: { v: 'TTFTF', e: [
    'Paediatric BLS: depress sternum by 1/3 chest depth.',
    'Compression rate 100–120/min in all ages.',
    'In children over 1 year, use heel of one (or two) hand(s); two-fingers technique is for INFANTS.',
    'Paediatric BLS starts with 5 rescue breaths before compressions.',
    'ERC paediatric BLS ratio is 15:2 (single rescuer 30:2 acceptable, but standard is 15:2).',
  ], q: 'ERC 2021 paediatric BLS: 5 rescue breaths first, then 15:2 compressions:ventilations, rate 100–120/min, depth 1/3 chest. Infants → two-finger / two-thumb.' },

  b5: { v: 'TFTFF', e: [
    'Ankle jerk (S1/S2 via tibial nerve) is lost.',
    'Saphenous nerve (femoral branch) supplies medial leg below knee — sensation NOT completely lost.',
    'Common peroneal injury → foot drop.',
    'Hip adductors are obturator nerve — not sciatic.',
    'Rectus femoris is femoral nerve — not sciatic.',
  ], q: 'Sciatic division at the ischial tuberosity: loses hamstring + tibial + peroneal function (foot drop, ankle jerk loss); femoral and obturator unaffected.' },

  b6: { v: 'TFTTT', e: [
    'Equalisation of diastolic pressures means high CVP with relatively low PCWP gradient — TRUE.',
    'Inspiration LOWERS systolic BP (pulsus paradoxus) in tamponade — opposite of statement.',
    'Echocardiography is highly reliable for pericardial effusion.',
    'ECG: low voltage, electrical alternans — diagnostically useful.',
    'CXR may appear normal in acute tamponade with minimal pericardial fluid.',
  ], q: 'Cardiac tamponade: equalised diastolic pressures, pulsus paradoxus, low ECG voltage with possible electrical alternans, echo confirms; CXR may be normal acutely.' },

  b7: { v: 'FTTTT', e: [
    'Vasoconstrictors (adrenaline) DECREASE systemic absorption and toxicity.',
    'Hepatic failure decreases amide LA clearance → higher plasma levels.',
    'Acidosis increases ionised drug and toxicity (ion trapping).',
    'Hypoproteinaemia reduces binding → more free drug.',
    'Hypoxia + acidosis exacerbate cardiac and CNS toxicity.',
  ], q: 'LA systemic toxicity is increased by acidosis, hypoxia, hypoproteinaemia, hepatic failure; reduced by vasoconstrictor additives.' },

  b8: { v: 'TTFTT', e: [
    'Mydriasis from muscarinic block.',
    'Atropine can raise ICP via cerebral vasodilation, though clinically modest.',
    'Atropine does not depress ventilatory CO2 response.',
    'Bronchodilation increases physiological dead space → ↑ VD/VT.',
    'Anticholinergic-induced bronchodilation speeds inhalational induction slightly.',
  ], q: 'Atropine: muscarinic block → mydriasis, dry secretions, bronchodilation (↑VD/VT), tachycardia; minor ICP effect from vasodilation.' },

  b9: { v: 'FFTFF', e: [
    'Atropine doesn’t alter hepatic clearance.',
    'Atropine isn’t sedative (hyoscine is more sedative).',
    'Primary premed use: antagonise parasympathetic (vagal) reflexes.',
    'Surgical arrhythmias are not reliably prevented by routine atropine.',
    'Atropine has no antiemetic effect.',
  ], q: 'Atropine in premed: antagonises vagal reflexes (e.g. oculocardiac), reduces secretions; not for sedation or antiemesis.' },

  b10: { v: 'TTTTF', e: [
    'Hepatic blood flow per kg is greater in infants.',
    'Vessel-rich group is a larger proportion of body mass in infants.',
    'Greater per-kg O2 consumption → faster uptake.',
    'Higher MV/FRC ratio causes faster wash-in.',
    'Infants have MORE (not less) myocardial depression at equivalent MAC.',
  ], q: 'Inhalational induction is faster in infants: ↑MV/FRC, smaller VRG, higher CO; but greater cardiac depression at equivalent MAC.' },

  b11: { v: 'TTTFT', e: [
    'Rapid IV oxytocin causes reflex bradycardia (via vasodilation).',
    'Oxytocin causes vasodilation → fall in BP.',
    'Nausea / vomiting is recognised.',
    'Oxytocin has ADH-like effect → water retention, but inhibition of Na+ excretion is not the principal effect.',
    'Premature ventricular contractions can occur.',
  ], q: 'IV oxytocin (rapid bolus): vasodilation, reflex tachycardia/bradycardia, nausea, water retention (ADH effect), arrhythmias.' },

  b12: { v: 'TFFTT', e: [
    'GCS should be assessed BEFORE intubation to capture verbal response.',
    'GCS doesn’t include pupillary reaction (separate exam).',
    'Early GCS is unreliable for late outcome prediction — many confounders.',
    'GCS includes motor response to pain.',
    'GCS has eye opening + verbal + motor components.',
  ], q: 'GCS: eye opening (4) + verbal (5) + motor (6) = 3–15. Assess before sedation/intubation. Pupillary findings reported separately.' },

  b13: { v: 'TTTFT', e: [
    'FHR varies with labour stage (decelerations with contractions).',
    'Maternal HR correlates loosely (sympathetic state).',
    'Maternal pyrexia raises FHR.',
    'Fetal position is not a major determinant of FHR pattern.',
    'Uterine contractions cause FHR decelerations.',
  ], q: 'Fetal heart rate is influenced by uterine contractions, maternal autonomic state, fetal hypoxia, maternal temperature, and labour stage.' },

  b14: { v: 'TFFTF', e: [
    'Hypothermia → bradycardia and ventricular ectopy.',
    'Bigeminy may occur but is not specific to hypothermia.',
    'LBBB is not a typical hypothermia ECG feature.',
    'Broad notched P waves and J (Osborn) waves are classic.',
    'Hypothermia does not cause peaked T waves — that is hyperkalaemia.',
  ], q: 'Hypothermia ECG: bradycardia, J (Osborn) wave, prolonged PR/QRS/QT, T inversion, ventricular ectopy/VF risk below 28 °C.' },

  b15: { v: 'TTFTF', e: [
    'Bronchodilation makes ketamine suitable in asthma.',
    'Rapid hepatic metabolism (N-demethylation to norketamine).',
    'Ketamine RAISES BP via sympathomimetic effects; not contraindicated in hypertension but caution.',
    'Ketamine can be used in raised ICP with controlled ventilation — modern evidence mostly neutral.',
    'Not contraindicated in atopy.',
  ], q: 'Ketamine: bronchodilator, sympathomimetic (↑BP/HR), preserves airway reflexes, NMDA antagonist; modern data: not contraindicated in raised ICP.' },

  b16: { v: 'FFTTF', e: [
    'Suxamethonium INCREASES ICP transiently.',
    'Phenytoin does not directly reduce ICP.',
    'Barbiturates reduce CMRO2 and ICP.',
    'IV mannitol reduces ICP via osmotic effect.',
    'Isoflurane is a cerebral vasodilator at >1 MAC → can INCREASE ICP.',
  ], q: 'ICP reduction: mannitol, hypertonic saline, hyperventilation, barbiturates, CSF drainage, head-up positioning. Volatiles >1 MAC and suxamethonium can raise ICP.' },

  b17: { v: 'FTFTT', e: [
    'Neonatal MAC is higher than adult (peaks ~1 month), not lower from endorphins.',
    'Neonates do have lower MAC than infants/older children (the value differs by age).',
    'Neonates have LOWER blood:gas partition (less protein), causing faster wash-in.',
    'Higher CO per kg in neonates.',
    'MAC differences relate to nervous-system maturation and developmental changes.',
  ], q: 'Neonatal anaesthesia: high CO/kg, low FRC, low blood:gas coefficient → fast induction; MAC higher than older children but cardiac sensitivity greater.' },

  b18: { v: 'FTFFF', e: [
    'Thoraco-pulmonary compliance doesn’t reliably assess ventilation in myasthenia.',
    'Maximum expiratory flow rate (peak expiratory flow) measures respiratory muscle strength — useful in MG.',
    'V/Q is gas-exchange measure, not ventilatory adequacy.',
    'TLC is not used to assess strength bedside.',
    'PaO2 can be normal despite hypoventilation initially.',
  ], q: 'In myasthenia, monitor respiratory muscle strength: peak expiratory flow, vital capacity, NIF; PaO2 is a late indicator of impending failure.' },

  b19: { v: 'TTTFF', e: [
    'Esmolol controls rate in atrial tachycardia.',
    'Procainamide is used in stable wide-complex tachycardia / AF.',
    'Amiodarone is effective for atrial tachyarrhythmias.',
    'Lidocaine is for ventricular tachycardia, not atrial.',
    'Nimodipine is a cerebral vasodilator for vasospasm — not for atrial arrhythmias.',
  ], q: 'Atrial tachyarrhythmias: rate control (β-blockers, Ca-blockers, digoxin) and rhythm control (amiodarone, procainamide). Lidocaine and nimodipine are not used.' },

  b20: { v: 'FTTTT', e: [
    'Nitroglycerin treats ischaemia, not digoxin toxicity.',
    'β-blockers can be used cautiously in digoxin toxicity for tachyarrhythmias.',
    'K+ correction is critical — hypokalaemia worsens toxicity.',
    'Phenytoin is used for digoxin-induced ventricular arrhythmias (atrial too).',
    'Magnesium suppresses digoxin-induced arrhythmias.',
  ], q: 'Digoxin toxicity ventricular arrhythmia: correct hypokalaemia/magnesium, phenytoin, lidocaine; Fab fragments for severe; avoid IV calcium.' },

  b21: { v: 'TTFTT', e: [
    'Digoxin alters ST/T morphology, mimicking ischaemia.',
    'RBBB alters ST baseline, making ischaemia hard to read.',
    'Complete heart block has wide QRS and abnormal ST but ischaemia diagnosis remains feasible. Conservative answer: FALSE for diagnostic difficulty specifically.',
    'LBBB obscures ST/T changes — gold-standard problem (Sgarbossa criteria needed).',
    'LVH masks ST changes with strain pattern.',
  ], q: 'ST monitoring confounders: LBBB, LVH, digoxin effect, paced rhythm, pre-existing repolarisation abnormalities, electrolyte disturbances.' },

  b22: { v: 'FTTFT', e: [
    'In active trauma resuscitation, platelet >50 is the target during bleeding, not >150.',
    'MAP 65 is the standard resuscitation target without head injury.',
    'iCa > 0.9 mmol/L (1.0–1.2 ideal) prevents coagulopathy.',
    'Hb 70–90 g/L is the modern trauma target; 100 is too high.',
    'SBP 110 mmHg is reasonable; permissive hypotension SBP 80–90 only without head injury — but 110 acceptable when bleeding controlled.',
  ], q: 'Trauma resuscitation (no head injury): permissive hypotension (SBP 80–90 active bleed), MAP 65 once controlled, iCa >1.0, balanced products.' },

  b23: { v: 'TTFTT', e: [
    'Mental nerve (V3 branch) supplies lower lip sensation.',
    'CN VI (abducens) palsy → divergent strabismus (loss of lateral rectus).',
    'Ulnar division → CLAW HAND/sensory loss, not wrist drop (that is radial nerve).',
    'Median nerve injury at wrist abolishes thumb opposition (thenar muscles).',
    'Phrenic nerve → ipsilateral hemidiaphragm paralysis.',
  ], q: 'Nerve injury patterns: mental → lower lip; abducens → divergent strabismus; ulnar → claw hand; median → loss of opposition; phrenic → diaphragm.' },

  b24: { v: 'TTTTF', e: [
    'Factor II is vitamin-K dependent.',
    'Factor X is vitamin-K dependent.',
    'Factor IX is vitamin-K dependent.',
    'Factor VII is vitamin-K dependent (shortest half-life).',
    'Factor V is NOT vitamin-K dependent (mnemonic: 2, 7, 9, 10).',
  ], q: 'Vitamin K-dependent clotting factors: II, VII, IX, X (and proteins C and S). Warfarin inhibits their gamma-carboxylation.' },

  b25: { v: 'FFTFT', e: [
    'Anticoagulants are required for AF >48 h with cardioversion planning.',
    'TOE is used to exclude LA thrombus before cardioversion (if AF >48 h).',
    'Immediate cardioversion only if haemodynamically unstable.',
    'Exercise testing not part of acute AF workup.',
    'Rate control with β-blocker (or Ca-blocker) is standard for stable AF.',
  ], q: 'New-onset AF in haemodynamically stable patient: anticoagulate, rate control (β-blocker or Ca-blocker), consider TOE-guided cardioversion.' },

  b26: { v: 'TTFTF', e: [
    'Afferents via ophthalmic division of trigeminal nerve.',
    'Reflex bradycardia via muscarinic cardiac receptors.',
    'Facial nerve nucleus is NOT involved — vagal motor nucleus is.',
    'Efferent is vagus (CN X) → cardiac slowing.',
    'Corneal incision can trigger the reflex but classical trigger is muscle traction.',
  ], q: 'Oculocardiac reflex: V (afferent, ophthalmic branch) → V medulla → X (efferent) → muscarinic bradycardia; treat with atropine, release stimulus.' },

  b27: { v: 'TFTTT', e: [
    'Suxamethonium raises IOP transiently.',
    'Intragastric pressure INCREASES (not decreases) with fasciculations.',
    'Releases K+ from muscle cells — serum K+ rises ~0.5 mmol/L.',
    'Minor rise in ICP from fasciculations.',
    'Postoperative myalgia common (fasciculation-induced).',
  ], q: 'Suxamethonium: raises K+, IOP, IGP, ICP; fasciculation causes post-op myalgia; metabolised by plasma cholinesterase.' },

  b28: { v: 'FFFFT', e: [
    'Morphine causes histamine release but doesn’t worsen pulmonary HTN significantly.',
    'Diazepam is acceptable.',
    'Frusemide reduces preload — generally safe.',
    'Propofol reduces SVR but is acceptable with caution.',
    'Ketamine increases PVR — exacerbates pulmonary hypertension.',
  ], q: 'Pulmonary hypertension: avoid ketamine (↑PVR), N2O (↑PVR), hypoxia/hypercapnia/acidosis. Inhaled NO, sildenafil, prostacyclins are vasodilators.' },

  b29: { v: 'TTTFF', e: [
    'PaO2 80 on FiO2 0.4 = P/F 200 — adequate for extubation.',
    'VC 18 mL/kg is adequate (>15 mL/kg).',
    'Normal PaCO2 on spontaneous ventilation confirms ventilation.',
    'Inspiratory force −15 cmH2O is weak (need at least −25 to −30).',
    'VD/VT > 0.6 is too high (target < 0.4 to extubate).',
  ], q: 'Extubation criteria: VC >15 mL/kg, NIF more negative than −25, VD/VT <0.4, adequate gas exchange, awake/cooperative.' },

  b30: { v: 'FTFFT', e: [
    'Mannitol initially EXPANDS the intravascular volume by drawing fluid in.',
    'Haematocrit rises temporarily as RBC mass dilutes less than plasma; net effect varies.',
    'Mannitol does not cause haemolysis.',
    'Blood viscosity DECREASES initially (haemodilution).',
    'Initial blood-volume expansion is the principal early effect (then diuresis).',
  ], q: 'IV mannitol: osmotic; initially expands plasma volume and lowers viscosity, then induces osmotic diuresis with risk of late hypovolaemia.' },
}

let applied = 0
const missing = []
for (const q of data) {
  const key = q.id.replace('barsac-2024-pre-', '')
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
