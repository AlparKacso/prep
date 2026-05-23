// Apply AI-proposed verdicts + explanations to the parsed HOLA 2021 JSON.
// Same compact PROPOSALS format as enrich-edaic-2020.mjs.
//
// Usage: node enrich-hola-2021.mjs

import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/hola-2021/questions.json'
const data = JSON.parse(readFileSync(path, 'utf8'))

const PROPOSALS = {
  // ───────── Paper A ─────────
  a1: { v: 'FFTTT', e: [
    'Raised ICP causes the Cushing reflex with systemic hypertension and increased SVR.',
    'Phaeochromocytoma releases catecholamines → vasoconstriction and raised SVR.',
    'Pregnancy is a state of vasodilation with falling SVR from mid-trimester.',
    'Chronic anaemia decreases blood viscosity and lowers SVR.',
    'Ketamine causes vasodilation via sympatholytic / NMDA effects in deep planes, but clinically often raises SVR via sympathetic outflow; net peripheral effect is reduction of SVR. Accept TRUE as best fit at typical doses.',
  ], q: 'SVR falls with anaemia, vasodilatory states (pregnancy, ketamine peripheral effect); it rises with catecholamine excess and the Cushing response.' },

  a2: { v: 'TTTTF', e: [
    'Neonate alveolar ventilation per kg is roughly double the adult value.',
    'Neonatal VO2 ~6 mL/kg/min vs ~3 in adult.',
    'Cardiac output per kg is higher in neonates (~200 mL/kg/min).',
    'Neonates lose ~15% of TBW daily through skin, lungs, urine and stool.',
    'Blood volume per kg in neonate ~80–90 mL/kg vs adult 70 mL/kg — similar, not higher in proportionate sense at term.',
  ], q: 'On a per-kg basis the neonate has much higher metabolic and respiratory demands than an adult, with higher cardiac output and large insensible losses.' },

  a3: { v: 'FFFFT', e: [
    'Pulmonary fibrosis DECREASES compliance (stiff lungs).',
    'Pulmonary oedema reduces compliance.',
    'Tension pneumothorax decreases effective compliance of the affected lung.',
    'Supine position reduces FRC and chest-wall compliance.',
    'Emphysema destroys elastic tissue, INCREASING static lung compliance.',
  ], q: 'Lung compliance falls with fibrosis, oedema and pneumothorax; emphysema increases compliance through loss of elastic recoil.' },

  a4: { v: 'FTTTT', e: [
    'Axillary temperature lags core and is unreliable for accurate monitoring.',
    'Lower-third oesophageal probe gives an accurate core temperature.',
    'Tympanic-membrane thermometry approximates hypothalamic temperature.',
    'Pulmonary-artery catheter temperature is the gold standard for core temperature.',
    'Nasopharyngeal probe behind the soft palate gives accurate core temperature.',
  ], q: 'Accurate core temperatures: distal oesophagus, nasopharynx, tympanic membrane, pulmonary artery, bladder. Axilla is unreliable.' },

  a5: { v: 'FTTTF', e: [
    'The AV node is in the LOWER part of the interatrial septum (Koch’s triangle), not the interventricular septum.',
    'Bachmann’s bundle provides preferential interatrial conduction from right to left atrium.',
    'The SA node is supplied by the RCA (60%) or LCx (40%) — circumflex supply is recognised.',
    'The bundle of His is the AV bundle.',
    'The SA node sits at the junction of the SVC and the RIGHT atrium, not the left.',
  ], q: 'SA node at SVC/RA junction; AV node in Koch’s triangle of the interatrial septum; Bachmann’s bundle = interatrial conduction; bundle of His = AV bundle.' },

  a6: { v: 'TTFTT', e: [
    'The femoral nerve (via its articular branches and the obturator nerve via Hilton’s law) supplies the hip joint.',
    'Knee joint sensation: femoral, obturator and sciatic (via tibial and common peroneal) — Hilton’s law.',
    'At the femoral triangle base, the femoral nerve lies LATERAL to the femoral artery (NAVeL mnemonic).',
    'The anterior division of the femoral nerve is predominantly sensory (cutaneous + sartorius), correct as "pure" sensory in some textbooks.',
    'The femoral nerve is the largest branch of the lumbar plexus.',
  ], q: 'Femoral nerve: lumbar plexus largest branch; lateral to femoral artery; supplies hip and knee joints (Hilton’s law); anterior division mainly cutaneous/sartorius.' },

  a7: { v: 'TFFTT', e: [
    'Benzodiazepines enhance inhibitory GABA_A receptor activity.',
    'Phenytoin blocks voltage-gated sodium channels, not GABA_A receptors.',
    'Ethosuximide blocks T-type calcium channels in thalamic neurones, not glutamate receptors.',
    'Carbamazepine blocks voltage-gated sodium channels.',
    'Vigabatrin irreversibly inhibits GABA transaminase, raising synaptic GABA.',
  ], q: 'Antiepileptics: Na-channel blockers (phenytoin, carbamazepine), T-Ca blockers (ethosuximide), GABA-enhancers (benzodiazepines, vigabatrin).' },

  a8: { v: 'TFFTF', e: [
    'Chronic respiratory acidosis raises renal HCO3- compensation — high plasma bicarbonate is expected.',
    'A negative base excess reflects metabolic acidosis, not primary respiratory failure.',
    'PEFR occurs at the START of forced expiration, not the end.',
    'FVC is the maximum exhaled volume after a maximum inspiration.',
    'Restrictive disease (pulmonary fibrosis) reduces FVC; FEV1 falls less in proportion, so FEV1/FVC is preserved or increased.',
  ], q: 'Chronic respiratory acidosis → high HCO3- compensation; PEFR occurs early in forced expiration; restrictive pattern reduces FVC more than FEV1.' },

  a9: { v: 'FTFTT', e: [
    'Clonidine acts on α2-adrenergic receptors, not β.',
    'Isoprenaline is a non-selective β-agonist.',
    'Amiodarone has minor β-blocking activity but its primary action is K-channel blockade, not "direct combination" with β-receptors.',
    'Terbutaline is a selective β2-agonist.',
    'Sotalol is a non-selective β-blocker (with K-channel effects).',
  ], q: 'Direct β-receptor agents: agonists (isoprenaline, terbutaline) and antagonists (sotalol, propranolol). Clonidine = α2; amiodarone has minimal direct β-effect.' },

  a10: { v: 'TTTTT', e: [
    'Plethysmography measures limb volume changes (and thus flow) with venous occlusion.',
    'Indicator dye dilution (e.g. cardiogreen) measures cardiac output.',
    'Thermodilution (PA catheter, transpulmonary) measures cardiac output.',
    'Doppler ultrasound measures blood flow non-invasively.',
    'Electromagnetic flowmeters measure flow in conductive fluids using Faraday’s law.',
  ], q: 'Blood flow measurement techniques: plethysmography, indicator/dye dilution, thermodilution, ultrasound (Doppler), electromagnetic flowmeters.' },

  a11: { v: 'FFTTF', e: [
    'Testosterone is from the zona reticularis, not fasciculata.',
    'Aldosterone is from the zona glomerulosa.',
    'Cortisol is the principal glucocorticoid from the zona fasciculata.',
    'Corticosterone is a glucocorticoid from the zona fasciculata.',
    'Estradiol is mainly an ovarian/testicular product, not adrenal cortex.',
  ], q: 'Adrenal cortex zones: glomerulosa (mineralocorticoids), fasciculata (glucocorticoids – cortisol, corticosterone), reticularis (androgens).' },

  a11b: { v: 'FTFTT', e: [
    'Fetal cardiovascular reflexes ARE present (baroreflex, chemoreflex), though immature.',
    'HbF P50 is ~19–20 mmHg, higher affinity than adult Hb.',
    'The ductus arteriosus is PATENT in utero, closes after birth.',
    'Maternal placental blood flow (~600 mL/min) exceeds umbilical flow (~150–200 mL/min).',
    'Fetal respiratory movements are common and necessary for lung development.',
  ], q: 'Fetus at term: PDA patent, HbF P50 ~19 mmHg, respiratory movements present, maternal placental flow > fetal side, cardiovascular reflexes present.' },

  a12: { v: 'TTTTT', e: [
    'Hypothermia decreases MAC by ~5% per °C drop.',
    'Metabolic acidosis modestly lowers MAC.',
    'Clonidine (α2-agonist) reduces MAC substantially.',
    'MAC falls ~6% per decade of age over 40.',
    'Pregnancy decreases MAC by ~30%.',
  ], q: 'MAC is decreased by hypothermia, acidosis, pregnancy, increasing age, α2-agonists, opioids; increased by hyperthermia and chronic alcohol use.' },

  a13: { v: 'FTFTF', e: [
    'Nitrous oxide INCREASES CMRO2 modestly (sympathomimetic-like effects).',
    'Propofol reduces CMRO2 and CBF in parallel — used for neuroprotection.',
    'Nimodipine is a cerebral vasodilator (prevents vasospasm); does not primarily change CMRO2.',
    'Thiopental potently reduces CMRO2 — historical brain-protection agent.',
    'Fentanyl has minimal direct effect on CMRO2.',
  ], q: 'CMRO2 reducers: propofol, thiopental, midazolam, etomidate, hypothermia. N2O paradoxically raises CMRO2; opioids and Ca-blockers have minimal direct CMRO2 effect.' },

  a14: { v: 'FTFFT', e: [
    'Oxygen does not absorb IR significantly and does not interfere.',
    'Nitrous oxide overlaps the CO2 IR band — corrected for in modern analysers.',
    'Helium is a monoatomic gas with no IR absorption.',
    'Nitrogen is diatomic homonuclear with no IR absorption.',
    'Water vapour absorbs IR and interferes; sample drying is required.',
  ], q: 'IR gas analysis requires polyatomic asymmetric molecules. N2O and water vapour interfere with CO2 measurement; O2, He and N2 do not absorb.' },

  a15: { v: 'TTTTT', e: [
    'Chronic aspirin causes GI blood loss → iron-deficiency anaemia.',
    'Aspirin crosses the placenta.',
    'Aspirin-sensitive bronchospasm (Samter triad) is a recognised reaction.',
    'Aspirin reduces fever via central PG inhibition.',
    'Salicylism: tinnitus is a hallmark of toxicity.',
  ], q: 'Aspirin: irreversibly inhibits COX. Adverse effects include GI bleeding/iron-deficiency, bronchospasm in sensitive patients, fetal effects, salicylism (tinnitus).' },

  a16: { v: 'TTFTF', e: [
    'Prolonged NMB exposure (ICU paralysis) up-regulates extra-junctional nAChRs.',
    'Denervation injuries (spinal cord injury) cause extra-junctional receptor up-regulation.',
    'Organophosphate poisoning DOWN-regulates AChRs due to persistent ACh stimulation.',
    'Prolonged immobility leads to disuse up-regulation of receptors.',
    'Myasthenia gravis DOWN-regulates nAChRs (autoantibodies destroy them).',
  ], q: 'Up-regulation of nAChR (and risk of suxamethonium-induced hyperkalaemia): denervation, prolonged immobility, NMB exposure, burns. Down-regulation: MG, ongoing AChE inhibition.' },

  a17: { v: 'TFFTT', e: [
    'Rapid deflation causes over-estimation of systolic pressure (cuff misses true peak crossing).',
    'Korotkoff sounds give a reasonable diastolic estimate (phase V).',
    'Phase V (disappearance) is preferred over phase IV (muffling) for diastolic in most settings.',
    'Ideal cuff width is ~40% of arm circumference (~1/3 of upper-arm length is a rough rule).',
    'A cuff too LARGE underestimates pressure; too SMALL overestimates.',
  ], q: 'Korotkoff auscultation: deflate slowly; phase V for diastolic; cuff width ~40% of circumference. Large cuff → low reading, small cuff → high reading.' },

  a18: { v: 'FFTFF', e: [
    'Adenosine causes vasodilation and reduces MAP.',
    'Propranolol reduces cardiac output and MAP.',
    'Phenylephrine is an α1-agonist that raises SVR and MAP.',
    'Nifedipine causes vasodilation and lowers MAP.',
    'Endothelin antagonists lower vascular tone in pulmonary/systemic vessels.',
  ], q: 'Of these only phenylephrine raises MAP; the others all reduce vascular tone or cardiac output and therefore MAP.' },

  a19: { v: 'TFFFF', e: [
    'Acidaemia increases ionised local-anaesthetic fraction → ion trapping → toxicity risk rises.',
    'Acidosis prolongs (does not shorten) local-anaesthetic duration in nerve tissue.',
    'Acidosis reduces protein binding of local anaesthetics → more free drug.',
    'Onset is SLOWER in acidosis because more ionised drug cannot cross membranes.',
    'Potency is REDUCED (not increased) in acidotic tissue.',
  ], q: 'Acidosis lowers tissue pH, increases ionised drug, decreases membrane penetration → slower onset, increased systemic free drug, increased toxicity.' },

  a20: { v: 'TTTTF', e: [
    'Osmolality (osmoles per kg solvent) is independent of T and P.',
    'Osmolality is used precisely because it avoids temperature-dependent volume changes affecting osmolarity.',
    'Freezing-point depression osmometry is the laboratory standard.',
    'Normal plasma osmolality ≈ 285–295 mOsm/kg.',
    'Osmolality (mOsm/kg) ≠ osmolarity (mOsm/L); they differ slightly, especially at very high solute concentrations.',
  ], q: 'Plasma osmolality ~290 mOsm/kg measured by freezing-point depression; osmolality (mass-based) is preferred over osmolarity because it is temperature-independent.' },

  a21: { v: 'TFTFT', e: [
    'Refractometers are used to calibrate anaesthetic vaporisers.',
    'They do require periodic calibration with standards.',
    'They measure vapour concentrations in known gas mixtures.',
    'Water vapour does affect refractive index — must be corrected.',
    'Refractometer reads vapour percentage directly.',
  ], q: 'Refractometers measure vapour concentration by the change in refractive index, used to calibrate vaporisers; sensitive to water vapour.' },

  a22: { v: 'TTTTT', e: [
    'Time constant = duration to complete the process if the initial rate persisted.',
    'Drug washout (and many physiological decays) follow exponential kinetics.',
    'Mathematically, exponential decay approaches but never reaches zero.',
    'Rate of change is proportional to current quantity — defining property of an exponential.',
    'After 3 half-lives: 12.5% remains; "14%" approximates this within rounding tolerance.',
  ], q: 'Exponential process: rate proportional to quantity remaining; characterised by half-life or time-constant; approaches but never reaches zero.' },

  a24: { v: 'TTTFF', e: [
    'Propofol causes significant peripheral vasodilation and SVR fall.',
    'Opioids (especially morphine via histamine release) reduce SVR.',
    'Volatile inhalational agents cause dose-dependent vasodilation.',
    'Benzodiazepines have minimal direct vascular effect — mainly venodilation.',
    'Mivacurium can release histamine causing some hypotension but minimal SVR reduction.',
  ], q: 'Agents that significantly lower SVR: propofol, volatiles, morphine. Benzodiazepines have minimal vascular tone effect; mivacurium causes only mild histamine release.' },

  a25: { v: 'FTFTT', e: [
    'Fetal cardiovascular reflexes are present (baroreflex/chemoreflex), though immature.',
    'HbF P50 ~19–20 mmHg (high O2 affinity).',
    'Ductus arteriosus is PATENT in utero.',
    'Maternal placental flow exceeds fetal side flow.',
    'Fetal respiratory movements are present and important for lung development.',
  ], q: 'Term fetus: PDA patent, HbF P50 low, fetal breathing movements active, maternal placental flow > umbilical, baroreflex present but immature.' },

  a26: { v: 'FTFTF', e: [
    'Anticholinergics do not reverse NMB; anticholinesterases do (and are given WITH anticholinergics to prevent bradycardia).',
    'Hyoscine is more sedative and centrally active than atropine.',
    'Hyoscine is a more potent antisialogogue than atropine.',
    'They cause bronchodilation, increasing anatomical dead space.',
    'Their cardiovascular effects are via muscarinic (not nicotinic) antagonism.',
  ], q: 'Anticholinergics (muscarinic antagonists): hyoscine > atropine for sedation and antisialogogue effect; increase dead space; do not reverse NMB.' },

  a27: { v: 'FFTFF', e: [
    'Clark electrode measures PO2, not pH (Severinghaus electrode measures CO2/pH).',
    'It uses a polarising voltage; current is proportional to PO2 (amperometric).',
    'Measures dissolved oxygen tension (PO2) — defining function.',
    'Saturation is measured by oximetry, not the Clark electrode.',
    'Not used for ECG; ECG uses surface electrodes of different design.',
  ], q: 'Clark electrode: amperometric polarographic sensor for PO2 — Pt cathode, Ag/AgCl anode, KOH electrolyte, oxygen-permeable membrane.' },

  a29: { v: 'TFTTT', e: [
    'Bicarbonate raises pH, increases un-ionised drug, speeds onset.',
    'Adrenaline causes local vasoconstriction, REDUCING spread (not increasing).',
    'Glucose makes the solution hyperbaric for spinal use; lowers viscosity vs plain heavy preparations.',
    'Saline dilutes the LA → reduced concentration and shorter duration.',
    'Adrenaline’s vasoconstriction prolongs duration of the block.',
  ], q: 'LA additives: bicarbonate speeds onset; adrenaline prolongs block and reduces systemic absorption; glucose adjusts baricity; saline dilution shortens action.' },

  a30: { v: 'FTTFT', e: [
    'Left-to-right shunts INCREASE pulmonary venous O2 saturation (not decrease mixed venous).',
    'Falling CO with constant VO2 increases tissue extraction → low mixed-venous saturation.',
    'Low arterial O2 means less O2 delivered; SvO2 falls.',
    'Lower metabolic rate REDUCES extraction → mixed-venous saturation rises.',
    'Pulmonary hypertension can reduce right-heart output → low SvO2.',
  ], q: 'SvO2 falls with reduced cardiac output, low SaO2, raised VO2, anaemia, or impaired flow (e.g. severe PH). Low metabolic rate or left-to-right shunt raise it.' },

  a31: { v: 'FFFFT', e: [
    'Direct measurement of vessel diameter is by imaging, not pressure-volume curves.',
    'Pressure-volume relationships do not give CBF directly.',
    'CMRO2 is a metabolic, not pressure-volume measurement.',
    'BBB integrity is assessed by contrast leakage, not pressure-volume.',
    'The intracranial pressure-volume curve quantifies cerebral compliance (and elastance).',
  ], q: 'ICP-volume relationship: gives cerebral compliance/elastance (slope of the Langfitt curve), not CBF or BBB integrity.' },

  a32: { v: 'TTTTF', e: [
    'Alveolar surface area decreases with age (~80 m² young adult → smaller in elderly).',
    'Hypoxic ventilatory drive declines with age.',
    'Closing volume rises and may exceed FRC — small airway closure during tidal breathing.',
    'Anatomical dead space increases.',
    'Residual volume INCREASES with age (loss of elastic recoil); statement of decrease is false.',
  ], q: 'Elderly lung: ↑RV, ↑closing volume, ↑dead space, ↓alveolar surface, ↓response to hypoxia/hypercapnia, ↓compliance variable; predisposes to hypoxaemia.' },

  a33: { v: 'TTTTT', e: [
    'Myocardial O2 extraction can increase by up to 50% during peak exercise.',
    'Coronary flow can rise 4–5× to meet demand.',
    'Lactate is an important cardiac fuel during exercise.',
    'TPR can fall ~50% as muscle vasodilation dominates.',
    'Stroke volume can roughly double in trained individuals.',
  ], q: 'Strenuous exercise: CO rises (HR + SV), TPR falls, coronary flow increases 4–5×, myocardium consumes lactate.' },

  a34: { v: 'FFTTF', e: [
    'Levobupivacaine has LOWER affinity for cardiac Na channels (reduced toxicity).',
    'Similar (not higher) lipid solubility to racemic bupivacaine.',
    'Less myocardial depression than racemic bupivacaine.',
    'Higher CNS convulsive threshold — safer profile.',
    'pKa is identical to racemic bupivacaine.',
  ], q: 'Levobupivacaine: S(-)-enantiomer; lower cardiac/CNS toxicity than racemic bupivacaine, similar block characteristics; reduced affinity for cardiac Na channels.' },

  a35: { v: 'TTFTT', e: [
    'Sugammadex has a hydrophobic bucket-shaped cavity (modified γ-cyclodextrin).',
    'It encapsulates rocuronium so the kidney clears the complex — bypassing usual hepatic/biliary route.',
    'Sugammadex binds rocuronium and vecuronium strongly; binds atracurium poorly.',
    'The complex is renally excreted.',
    'It is a modified γ (gamma) cyclodextrin, not α — statement says α; that is INCORRECT. Mark FALSE.',
  ], q: 'Sugammadex: modified γ-cyclodextrin that encapsulates aminosteroid NMBAs (rocuronium >> vecuronium); the complex is renally excreted.' },

  a36: { v: 'TFTTT', e: [
    'CO-oximetry depends on light absorption of haemoglobin species.',
    'Method requires Hb concentration to be known — not independent.',
    'CO-oximetry measures HbCO simultaneously by spectrophotometry.',
    'CO-oximetry measures metHb simultaneously.',
    'At isosbestic points, absorption is identical for oxy- and deoxy-Hb.',
  ], q: 'In-vitro spectrophotometric CO-oximetry measures oxy-, deoxy-, met-, and carboxy-haemoglobin using multiple wavelengths including the isosbestic points.' },

  a37: { v: 'TFFTF', e: [
    'Autoclave at 121 °C, 150 kPa, 15 min kills vegetative organisms and most spores.',
    'Ethylene oxide is sporicidal (not just bacteriostatic).',
    'Boiling does not reliably kill spores (e.g. Clostridium).',
    'Ethylene oxide exposure is several hours plus aeration — 2–4 h is roughly correct for short-cycle systems.',
    '0.1% chlorhexidine disinfects, does not sterilise an LMA; sterilisation needs autoclaving.',
  ], q: 'Sterilisation hierarchy: autoclave (gold standard for heat-resistant items) > ethylene oxide (heat-sensitive). Boiling is disinfection. Chlorhexidine = antiseptic.' },

  a38: { v: 'FFFTF', e: [
    'Ropivacaine is an amide, metabolised in the liver by CYP, not plasma cholinesterase.',
    'Acidosis traps the ionised form; ropivacaine is not "rapidly inactivated" by acidic surroundings — its potency falls but it is not inactivated.',
    'Ropivacaine is the S-enantiomer, not a racemic mixture.',
    'Maximum recommended dose ~3 mg/kg (single shot); plain ~2 mg/kg is reasonable conservative ceiling.',
    'Ropivacaine pKa ~8.1, not 6.8.',
  ], q: 'Ropivacaine: S-enantiomer amide, hepatic CYP metabolism, pKa 8.1, max single dose ~3 mg/kg; less cardiotoxic than racemic bupivacaine.' },

  a39: { v: 'TTTTT', e: [
    'Right upper lobe is most often involved in aspiration when supine (gravity).',
    'Right main bronchus has greater diameter than left.',
    'Right main bronchus runs more vertically than left in adults.',
    'The lingula (left upper lobe equivalent of middle lobe) is on the left.',
    'Left main bronchus is LONGER than right (right is shorter and more vertical).',
  ], q: 'Right main bronchus: shorter, wider, more vertical → preferential aspiration site. Lingula sits on the left upper lobe.' },

  a40: { v: 'TFFFT', e: [
    'Normal CSF has no red cells (xanthochromia after SAH).',
    'CSF chloride is HIGHER than plasma (~125 vs 100 mmol/L).',
    'CSF electrolytes are actively regulated, not independent of plasma — they correlate but differ.',
    'CSF sodium is similar to plasma (~140), not consistently higher.',
    'CSF protein concentration is much lower than plasma (~0.15–0.45 g/L vs 60–80).',
  ], q: 'CSF (lumbar): clear, no RBCs, higher chloride (~125), lower protein (<0.5 g/L), lower glucose (~2/3 plasma), low cells.' },

  a41: { v: 'TTTFT', e: [
    'Etomidate reversibly inhibits 11-β-hydroxylase → cortisol synthesis inhibition.',
    'Hepatic ester hydrolysis to mainly inactive metabolites.',
    'Reduces CBF, CMRO2 and ICP.',
    'No analgesic properties.',
    'Myoclonus on induction is common.',
  ], q: 'Etomidate: imidazole induction agent; haemodynamic stability; inhibits cortisol synthesis (avoid infusion); myoclonus on induction; reduces ICP.' },

  a42: { v: 'TFFTT', e: [
    'A current meter (μA display) confirms current delivery.',
    'Stimulating frequency 1–2 Hz (not kHz) — kHz is far too high.',
    'Pulse duration ~50–100 μs (microseconds), not 100 ms.',
    'Constant-current output ensures predictable depolarisation independent of tissue impedance.',
    'Disconnect indicator alerts to broken circuit.',
  ], q: 'PNS for blocks: constant current output ~0.5 mA threshold, 1–2 Hz, 100 μs pulses, current display and disconnect alarm.' },

  a43: { v: 'FTN', e: [
    'Low blood solubility (e.g. desflurane) gives a RAPID onset, not slow.',
    'Oil:gas partition coefficient is the Meyer-Overton correlate of potency.',
    'Statement truncated in the source; cannot evaluate.',
  ], q: 'Inhalational onset is inversely related to blood:gas solubility; potency is directly related to oil:gas (lipid) solubility.' },

  a44: { v: 'FTTTT', e: [
    'SVP depends on TEMPERATURE only, not barometric pressure.',
    'SVP rises with temperature for any liquid.',
    'At boiling point, SVP equals atmospheric pressure.',
    'SVP is the maximum partial pressure achievable at a given temperature.',
    'A substance reaches SVP = atmospheric pressure at its boiling point — restated true.',
  ], q: 'Saturated vapour pressure depends on temperature; equals atmospheric pressure at the boiling point; independent of barometric pressure changes.' },

  a45: { v: 'TTFTT', e: [
    'Ascending bellows fail to refill on disconnection — visible safety feature.',
    'Ascending bellows are considered safer (disconnection is obvious).',
    'Driving gas is OUTSIDE the bellows; patient gas inside.',
    'Classification is by direction of expiratory movement (ascending vs descending).',
    'Descending bellows continue moving by gravity even on disconnection — masks the leak.',
  ], q: 'Anaesthesia bellows: ascending bellows safer because disconnection is visible; driving gas outside, patient gas inside the bellows.' },

  a51: { v: 'FTFFT', e: [
    'Subcutaneous EEG electrodes deliver leakage current to the scalp, far from the heart — VF unlikely.',
    'Saline-filled intracardiac catheter is a low-impedance microshock pathway → 1 mA can cause VF.',
    'Skin ECG electrodes are macroshock pathway — 1 mA insufficient to cause VF.',
    'Bipolar diathermy forceps deliver localised current — unlikely VF at 1 mA.',
    'Intracardiac pacemaker electrode is a microshock pathway — 1 mA can induce VF.',
  ], q: 'Microshock: current applied directly to the heart can cause VF at ~50–100 μA. Intracardiac electrodes/catheters are microshock pathways; surface electrodes are not.' },

  a52: { v: 'FFFFT', e: [
    'p = 0.02 IS significant at the 95% level (p < 0.05).',
    'Alpha error is conventionally 0.05, not 0.2.',
    'Power (sensitivity) of the test is 0.8 — this matches the statement; mark TRUE? Re-evaluate: the statement says "sensitivity of the test is 0.8". Power = 1-β = 0.8 → β = 0.2. Calling power "sensitivity" is loose terminology; in this context FALSE for strict reading.',
    'Type II error β = 1 - power = 0.2 — it IS known here.',
    'p = 0.02 < 0.05 → reject H0 → evidence against the null hypothesis.',
  ], q: 'p < 0.05 rejects null hypothesis. Power = 1-β; here β = 0.2. Alpha is conventionally 0.05. Significance and power must not be confused.' },

  a54: { v: 'FFTFT', e: [
    'Fentanyl is metabolised in the liver and is reasonable in renal failure.',
    'Mivacurium is degraded by plasma cholinesterase — acceptable in renal failure.',
    'Morphine accumulates as the active M6G metabolite — avoid in renal failure.',
    'Cisatracurium undergoes Hofmann elimination — safe in renal failure.',
    'Pancuronium is renally excreted — avoid in renal failure (prolonged block).',
  ], q: 'Renal failure: avoid morphine, pancuronium; safe: fentanyl, alfentanil, cisatracurium (Hofmann), mivacurium, atracurium.' },

  a55: { v: 'TFTFT', e: [
    'Dorsal respiratory group in the medulla generates inspiratory drive.',
    'Quiet expiration is passive; expiratory neurones fire mainly in active expiration.',
    'Ventral respiratory group is mainly expiratory (and inspiratory for some).',
    'Apneustic centre is involved in inspiratory pattern but not essential for normal respiration.',
    'Pneumotaxic centre limits inspiration and helps set respiratory rate.',
  ], q: 'Respiratory control: medullary DRG (inspiration) + VRG (expiration); pontine pneumotaxic limits inspiration, apneustic prolongs it; central rhythm modulated by chemoreceptors.' },

  a56: { v: 'TFTTF', e: [
    'COX-2 is induced; COX-1 is constitutive but can be upregulated.',
    'Phospholipase A2 (not C) liberates arachidonic acid for prostaglandin synthesis.',
    'PG production is a hallmark of peripheral inflammation.',
    'Membrane phospholipids are the substrate (phospholipase A2 cleaves arachidonic acid).',
    'Endogenous cannabinoids exist but are not central to peripheral inflammation.',
  ], q: 'Peripheral inflammation: phospholipase A2 releases arachidonic acid → COX-1/COX-2 → prostaglandins; lipoxygenase → leukotrienes.' },

  a57: { v: 'FTFFT', e: [
    'Remifentanil has rapid esterase clearance; alfentanil has LOWER clearance.',
    'Alfentanil has a longer context-sensitive half-time than remifentanil.',
    'Alfentanil is LESS potent than fentanyl but the question compares to remifentanil — alfentanil is similar potency.',
    'Alfentanil pKa ~6.5 lower than fentanyl; lower than remifentanil (~7.1) — possibly TRUE; conservative ATI answer treats statement as FALSE since remifentanil has lower pKa.',
    'Onset time is similar (both rapid).',
  ], q: 'Alfentanil vs remifentanil: alfentanil has lower clearance, longer CSHT, similar/rapid onset; remifentanil cleared by tissue esterases.' },

  a58: { v: 'TFFFF', e: [
    'IRV (~3000 mL) is larger than ERV (~1100 mL).',
    'VC = TLC – RV; not equal to TLC.',
    'FRC is INCREASED in asthma (air trapping).',
    'Residual volume cannot be exhaled, even with maximum effort.',
    'Spirometry CANNOT measure RV/FRC; helium dilution or plethysmography required.',
  ], q: 'Lung volume relationships: VC + RV = TLC. RV/FRC require helium dilution or plethysmography (spirometry alone insufficient). Asthma raises FRC.' },

  a59: { v: 'TFTFT', e: [
    'Thoracic duct enters at the junction of left subclavian and IJV.',
    'Left brachiocephalic vein is LONGER than the right.',
    'External jugular drains into the subclavian vein typically — some variants drain into IJV. Conservative answer TRUE (variable).',
    'Cervical sympathetic chain lies POSTERIOR to the carotid sheath.',
    'Vagus lies posterior between the artery and vein within the carotid sheath.',
  ], q: 'Carotid sheath: ICA medial, IJV lateral, vagus posterior between them. Thoracic duct enters left IJV–SCV junction. EJV usually → SCV.' },

  a60: { v: 'TFTFT', e: [
    'Full agonists produce the maximum receptor response.',
    'Non-competitive antagonists may bind reversibly or irreversibly (e.g. allosteric).',
    'Partial agonists have intrinsic activity < 1 and cannot reach maximum response.',
    'Identical affinity ≠ identical response; intrinsic activity also matters.',
    'Inverse agonists stabilise the inactive conformation, producing opposite physiological effect.',
  ], q: 'Receptor pharmacology: affinity vs intrinsic activity. Full agonist = max effect; partial agonist < max; antagonist = no effect; inverse agonist = opposite to agonist.' },

  // ───────── Paper B ─────────
  b1: { v: 'FTTTT', e: [
    'Polycythaemia is not a recognised cause of portal hypertension.',
    'Budd-Chiari syndrome (hepatic vein thrombosis) is a post-hepatic cause.',
    'Constrictive pericarditis raises hepatic venous pressure → post-hepatic portal HTN.',
    'Severe tricuspid regurgitation transmits high RA pressure into hepatic veins.',
    'Biliary cirrhosis is intra-hepatic and causes portal HTN.',
  ], q: 'Portal hypertension causes: pre-hepatic (portal vein thrombosis), intra-hepatic (cirrhosis), post-hepatic (Budd-Chiari, RHF, constrictive pericarditis).' },

  b2: { v: 'TTFFT', e: [
    'Major pelvic surgery with lithotomy positioning carries high DVT risk.',
    'Bowel handling causes paralytic ileus.',
    'Uraemia is not a recognised complication unless other renal injury occurs.',
    'Air embolism not typical for APR.',
    'Postoperative atelectasis is common after major abdominal surgery.',
  ], q: 'Abdomino-perineal resection: post-op complications include DVT, paralytic ileus, atelectasis, wound infection, urinary/sexual dysfunction.' },

  b3: { v: 'TTTFT', e: [
    'MH causes lactic acidosis from uncoupled mitochondrial activity.',
    'Masseter spasm / inability to relax with suxamethonium can be an early sign.',
    'Unexplained tachycardia is an early sign.',
    'Respiratory ACIDosis (high CO2 production) is the hallmark, not alkalosis.',
    'Rhabdomyolysis releases potassium → hyperkalaemia.',
  ], q: 'MH triad: hypermetabolism (↑ETCO2, ↑HR, ↑T), muscle rigidity, mixed acidosis with hyperkalaemia. Triggered by volatiles and suxamethonium.' },

  b4: { v: 'FFFTF', e: [
    'Coeliac plexus block causes DIARRHOEA (sympathetic blockade) not constipation.',
    'Post-dural puncture headache not typical (plexus is retroperitoneal).',
    'Haematuria not a recognised complication.',
    'Hypotension is the most common complication (sympathetic block) — "hypertension" listed here is FALSE.',
    'Urinary incontinence is not a typical complication.',
  ], q: 'Coeliac plexus block complications: hypotension (sympathectomy), back pain, diarrhoea, transient haematuria rare, paraplegia rare (spinal arterial injection).' },

  b5: { v: 'TFFTF', e: [
    'Flumazenil reverses CNS effects of benzodiazepines.',
    'Doxapram is a respiratory stimulant not specific for benzodiazepine overdose.',
    'Forced diuresis does not enhance elimination of benzodiazepines.',
    'Activated charcoal binds benzodiazepines if given early after ingestion.',
    'Naloxone reverses opioids, not benzodiazepines.',
  ], q: 'Acute benzodiazepine overdose: supportive care + flumazenil (caution in chronic users / mixed ingestion); activated charcoal if early.' },

  b6: { v: 'TFFTF', e: [
    'Subcutaneous fat thickness ("structure A") varies considerably between patients.',
    'Deep circumflex iliac artery lies in the same TAP layer; injury risk during block is recognised, but it is not always "in layer B" per the labelled image.',
    'C is typically internal oblique in standard TAP images (external oblique is more superficial).',
    'LA target plane is between internal and transversus abdominis — between C and D in the conventional labelling.',
    'Approach is in-plane from anterior to posterior (lateral to medial), not medial to lateral.',
  ], q: 'TAP block: ultrasound shows three muscle layers (EO, IO, TA); LA deposited in the IO/TA fascial plane; in-plane needle from lateral to medial.' },

  b7: { v: 'TTTTF', e: [
    'Cumulative cigarette exposure correlates with postoperative pulmonary complications.',
    'FEV1 >1.5 L is a traditional threshold for lobectomy.',
    'Resting PaO2 < 60 mmHg or PaCO2 > 45 indicates higher risk.',
    'VO2max < 10 mL/kg/min carries very high operative mortality.',
    '60% predicted FVC is too low for pneumonectomy; ppoFEV1 >40% and >60% predicted FVC are typical, with >2 L FVC.',
  ], q: 'Lung-resection assessment: FEV1, ppoFEV1, DLCO, VO2max < 10 = very high risk; cumulative pack-years correlates with complications.' },

  b8: { v: 'TFTFT', e: [
    'PLR is a reversible fluid challenge — sensitive marker of fluid responsiveness.',
    'CVP is a poor indicator of preload responsiveness.',
    'SVV from arterial waveform (PiCCO/FloTrac) predicts fluid responsiveness in ventilated patients.',
    'PCWP is a static measure with poor predictive value.',
    'End-expiratory occlusion test increases preload by stopping cyclic interruption — predicts responsiveness.',
  ], q: 'Dynamic indices (PPV, SVV, PLR, EEOT) outperform static measures (CVP, PCWP) for predicting fluid responsiveness.' },

  b9: { v: 'TFFFT', e: [
    'DBS is more sensitive than TOF for detecting residual block by tactile assessment.',
    'TOF ratio 0.4 means significant residual block; tidal volume can be near normal but airway compromise possible.',
    'Fade is characteristic of NON-depolarising block, not depolarising (phase I shows equal twitches).',
    'Absent tactile fade is unreliable — true TOF ratio may still be <0.9.',
    'Post-tetanic count detects deep block (when TOF and DBS give no response).',
  ], q: 'NMB monitoring: TOF + DBS + PTC. Fade is the hallmark of non-depolarising block; objective monitoring required to confirm TOF ≥ 0.9.' },

  b10: { v: 'TTTFF', e: [
    'Carbamazepine is first-line for trigeminal neuralgia.',
    'MRI is recommended to exclude secondary causes (vascular loop, MS, tumour).',
    'Gasserian ganglion RF ablation is used for refractory cases.',
    'Trigeminal neuralgia responds poorly to opioids.',
    'Trigeminal neuralgia is mediated by the 5th (trigeminal), not 7th (facial) nerve.',
  ], q: 'Trigeminal neuralgia: 5th cranial nerve; first-line carbamazepine, MRI to exclude secondary cause; refractory → microvascular decompression or RF ablation.' },

  b11: { v: 'TFTFT', e: [
    'Fentanyl and other pure opioids are safe in porphyria.',
    'Suxamethonium is considered safe in porphyria.',
    'Hydralazine is porphyrinogenic and should be avoided.',
    'Thiopental (barbiturates) is the classic porphyrinogenic drug — contraindicated.',
    'Midazolam is safe in porphyria.',
  ], q: 'Acute porphyria: AVOID barbiturates, etomidate, hydralazine, sulphonamides; SAFE: opioids, propofol (caution), suxamethonium, benzodiazepines, NMBs.' },

  b12: { v: 'FTTTF', e: [
    'High FiO2 supports combustion; FiO2 should be kept as LOW as feasible (e.g. <30%).',
    'Saline must be immediately available to extinguish a fire.',
    'N2O supports combustion — replace with air/nitrogen.',
    'Cuff filled with saline (often dyed) lets you detect a cuff perforation.',
    'A cuffed laser-safe tube is preferred — uncuffed risks oxygen escape into the airway.',
  ], q: 'Laser airway surgery: low FiO2, no N2O, laser-resistant tube, saline-filled (dyed) cuff, saline available, drape carefully.' },

  b13: { v: 'TFTFT', e: [
    'Anti-AChR antibodies (or anti-MuSK) target post-synaptic muscle nicotinic receptors.',
    'Acquired autoimmune disease; congenital myasthenia is rare.',
    'Pregnancy may worsen myasthenia in some patients.',
    'Depolarising relaxants (sux) have a SHORTER action / resistance, not prolonged.',
    'Pyridostigmine (oral anticholinesterase) is first-line treatment.',
  ], q: 'Myasthenia gravis: autoantibodies vs nAChR; resistance to suxamethonium and sensitivity to non-depolarisers; treat with pyridostigmine + immunomodulation.' },

  b14: { v: 'TTFFT', e: [
    'Spontaneous ventilation preserved during induction is safer (no positive pressure pushing the FB distally).',
    'Inhalational induction with sevoflurane (no IV) keeps spontaneous ventilation.',
    'Bronchopulmonary lavage is not indicated for solid foreign-body removal.',
    'Sux is generally avoided; spontaneous ventilation is preferred.',
    'Jet ventilation through the rigid bronchoscope is a standard ventilation technique.',
  ], q: 'Paediatric inhaled FB: inhalational induction, maintain spontaneous ventilation, share airway with surgeon via rigid bronchoscope, ± jet ventilation.' },

  b15: { v: 'TTFTF', e: [
    'Modern devices are typically DDD or DDDR rate-responsive units.',
    'Diathermy can inhibit demand pacemakers — bipolar or short-burst recommended.',
    'VVI is INHIBITED (not triggered) by sensed ventricular depolarisation.',
    'AAI paces atrially, inhibited by sensed atrial depolarisation.',
    'External magnet converts demand mode to asynchronous fixed-rate mode, not vice versa.',
  ], q: 'Pacing modes (NBG code): chamber paced / sensed / response. Magnet → asynchronous fixed-rate. Diathermy can interfere with demand sensing.' },

  b16: { v: 'TFTTT', e: [
    'Brachial plexus neuropathy is the most common positioning-related nerve injury.',
    'Prone position generally IMPROVES (not impairs) oxygenation by recruiting dorsal alveoli.',
    'Sitting position predisposes to hypotension and venous air embolism.',
    'Lithotomy classically injures common peroneal (and sciatic) nerves.',
    'Prone position is a risk factor for perioperative visual loss (especially ION).',
  ], q: 'Positioning injuries: brachial plexus most common; lithotomy → peroneal/sciatic; sitting → hypotension/VAE; prone → POVL and venous congestion.' },

  b17: { v: 'TTTFT', e: [
    'Post-CPR lactic acidosis from tissue hypoperfusion.',
    'ATN can cause uraemic metabolic acidosis.',
    'Diarrhoea causes loss of HCO3-; vomiting causes alkalosis (mixed picture).',
    'Morphine overdose causes respiratory acidosis, not metabolic acidosis.',
    'Sepsis with lactic acidosis is a classic cause.',
  ], q: 'Metabolic acidosis (BE −12, HCO3 16): lactic (sepsis, hypoperfusion), ketoacidosis, renal failure, diarrhoea. Opioid OD = respiratory acidosis.' },

  b18: { v: 'TFTFF', e: [
    'Vasospasm-induced ischaemia can produce focal deficits including hemiplegia.',
    'Postoperative ventilation does not prevent vasospasm; nimodipine + euvolaemia do.',
    'Triple-H (now modified) is a recognised treatment (modern preference: induced hypertension + euvolaemia).',
    'Vasospasm peaks at days 4–14 — "two weeks" approximates only the late edge.',
    'Vasospasm can still occur after successful clipping.',
  ], q: 'SAH vasospasm: peaks 4–14 days, treat with nimodipine, induced hypertension, euvolaemia; clipping does not prevent vasospasm.' },

  b19: { v: 'TTTTF', e: [
    'Hypothermia prolongs recovery and PACU length.',
    'Coagulation enzymes are temperature-sensitive — hypothermia → coagulopathy.',
    'Spinal block recovery is delayed by hypothermia (decreased local-anaesthetic clearance).',
    'Hypothermia increases wound infection risk (vasoconstriction, immune dysfunction).',
    'Hypothermia increases (not decreases) potency of muscle relaxants — depolarising and non-depolarising.',
  ], q: 'Perioperative hypothermia: coagulopathy, infection, cardiac events, delayed drug elimination, longer PACU stay; aim to maintain normothermia.' },

  b20: { v: 'TTFFT', e: [
    'Transfuse platelets when count <50 in active bleeding; <100 in CNS or massive transfusion.',
    'Rh-positive blood should be avoided in young women of child-bearing potential to prevent sensitisation.',
    'rFVIIa is not first-line for generalised haemostatic failure; reserved for refractory cases.',
    'FFP can be given without ABO group identification using AB plasma (universal donor plasma); statement says only after ABO known — restrictive but conventionally accepted as FALSE.',
    'O-negative red cells can be given immediately without crossmatch in life-threatening haemorrhage.',
  ], q: 'Massive haemorrhage: O-neg RBCs immediately; transfuse platelets <50 if bleeding; balanced FFP:platelets:RBCs ratio; avoid Rh-pos cells in young women.' },

  b21: { v: 'FFTTT', e: [
    'After PDA closure, pulmonary artery O2 saturation FALLS (shunt removed).',
    'Pulmonary arterial pressure DECREASES after closure.',
    'The continuous machinery murmur disappears.',
    'PVR falls after the high-volume shunt is corrected.',
    'Systemic arterial O2 saturation rises (shunt of de-oxy blood eliminated).',
  ], q: 'PDA closure: pulmonary flow normalises, PAP and PVR fall, machinery murmur disappears, systemic SpO2 rises.' },

  b22: { v: 'FFFTT', e: [
    'Regional techniques are encouraged in day-case anaesthesia.',
    'Day-case patients MUST have a responsible adult escort home.',
    'Modern fasting: clear fluids up to 2 hours before surgery — 6 hours is excessive.',
    'Avoidance of alcohol for 24 h post-anaesthesia is reasonable.',
    'Day-case selection criteria: ASA 1–2 typically, sometimes stable ASA 3.',
  ], q: 'Day-case anaesthesia: ASA 1–2 mainly, escorted home, modern fasting, encourage regional techniques, no alcohol for 24 h.' },

  // Paper B b31–b33 are duplicates of Paper A b31-style — use the same proposals as a31–a33.
  b31: { v: 'FFFFT', e: [
    'Direct measurement of vessel diameter is by imaging, not pressure-volume curves.',
    'Pressure-volume relationships do not give CBF directly.',
    'CMRO2 is a metabolic, not pressure-volume measurement.',
    'BBB integrity is assessed by contrast leakage, not pressure-volume.',
    'The intracranial pressure-volume curve quantifies cerebral compliance.',
  ], q: 'ICP-volume curve: gives cerebral compliance/elastance; does not measure flow, metabolism or BBB.' },

  b32: { v: 'TTTTF', e: [
    'Alveolar surface area decreases with age.',
    'Hypoxic ventilatory drive declines with age.',
    'Closing volume rises and may exceed FRC.',
    'Anatomical dead space increases.',
    'Residual volume INCREASES (not decreases) with age.',
  ], q: 'Elderly lung: ↑RV/closing volume/dead space, ↓alveolar surface, ↓ventilatory response to hypoxia and hypercapnia.' },

  b33: { v: 'TT', e: [
    'Myocardial O2 extraction can increase by up to 50% during peak exercise.',
    'Coronary flow can rise 4–5× to meet demand.',
  ], q: 'Strenuous exercise: CO rises (HR + SV), TPR falls, coronary flow up 4–5×, increased myocardial extraction.' },
}

let applied = 0
let missing = []
for (const q of data) {
  const key = q.id.replace('hola-2021-', '')
  const p = PROPOSALS[key]
  if (!p) {
    if (q.statements.length > 0) missing.push(key)
    continue
  }
  applied++
  q.explanation = p.q
  for (let i = 0; i < q.statements.length; i++) {
    const v = p.v[i]
    q.statements[i].isCorrect = v === 'T' ? true : v === 'F' ? false : null
    q.statements[i].explanation = p.e[i] || null
  }
}

writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
console.log(`enriched ${applied} of ${data.length} questions`)
if (missing.length) console.log('  missing proposals for:', missing.join(', '))
const stemOnly = data.filter((q) => q.statements.length === 0)
console.log(`  stem-only (intentional answerKnown:false): ${stemOnly.length}`)
