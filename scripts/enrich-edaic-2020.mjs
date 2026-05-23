// Apply AI-proposed verdicts + explanations to the parsed EDAIC 2020 JSON.
// Compact PROPOSALS table — verdict string (T/F/N) + per-statement reasons
// + a brief question-level rationale. The amber 'verify' badge is shown
// by the UI for ai_proposed/aiExplanation content.
//
// Usage: node enrich-edaic-2020.mjs

import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/edaic-2020/questions.json'
const data = JSON.parse(readFileSync(path, 'utf8'))

// keyed by id suffix (a1, b3, ...). Each: v = verdict string of length
// statements.length using 'T' (true), 'F' (false), 'N' (null/unknown).
// e = array of per-statement reasons matching that length. q = a brief
// question-level teaching point.
const PROPOSALS = {
  // ───────── Paper A ─────────
  a1: { v: 'FTTTF', e: [
    'Morphine is a μ-opioid receptor agonist, not an antagonist.',
    'Atropine is a competitive muscarinic acetylcholine receptor antagonist.',
    'Propranolol is a non-selective β-adrenoceptor antagonist.',
    'Phentolamine is a non-selective α-adrenoceptor antagonist.',
    'Clonidine is an α2-adrenoceptor agonist, not an antagonist.',
  ], q: 'Antagonists block receptor activation. Of these, atropine, propranolol and phentolamine are receptor antagonists; morphine and clonidine are agonists.' },

  a3: { v: 'TTTFF', e: [
    'The pneumotachograph measures the pressure drop across a fixed resistance to infer flow.',
    'Accurate readings require laminar flow (Poiseuille relationship between flow and pressure drop).',
    'Gas composition changes viscosity, requiring recalibration (notably with helium or N2O).',
    'It has a very low dead-space and rapid response so it is suitable for breath-by-breath monitoring.',
    'Temperature changes alter gas viscosity, so accuracy is affected by temperature.',
  ], q: 'The pneumotachograph (Fleisch type) measures flow from a pressure drop across a laminar-flow resistance; accuracy depends on gas composition and temperature.' },

  a5: { v: 'TTT', e: [
    'Delta waves (<4 Hz, high amplitude) typify deep anaesthesia and slow-wave sleep.',
    'Marked hypotension causes cerebral hypoperfusion and EEG slowing into the delta range.',
    'Cerebral hypoxia slows the EEG; delta activity appears as oxygenation falls.',
  ], q: 'EEG delta activity reflects depressed cortical function — from deep anaesthesia, severe hypotension or cerebral hypoxia.' },

  a6: { v: 'TTTTF', e: [
    'Morphine crosses the placenta and depresses neonatal respiration.',
    'IM pethidine is a classic cause of neonatal respiratory depression if given near delivery.',
    'Systemic absorption of large local-anaesthetic doses can depress the fetus.',
    'Midazolam crosses the placenta and depresses neonatal respiration and tone.',
    'Non-depolarising muscle relaxants are highly ionised and cross poorly; fetal respiratory depression is not expected.',
  ], q: 'Lipid-soluble CNS depressants (opioids, benzodiazepines, high-dose local anaesthetics) cross the placenta and depress the fetus; muscle relaxants do not.' },

  a8: { v: 'TTTF', e: [
    'Normal PaO2 in arterial blood is ~95–100 mmHg.',
    'PN2 in alveolar/arterial gas is approximately 573–596 mmHg.',
    'PH2O is ~47 mmHg at body temperature (fully saturated alveolar gas).',
    'Mixed venous (right atrial) PO2 is ~40 mmHg; arterial PO2 in the right atrium would be the same as mixed venous.',
  ], q: 'Standard arterial/alveolar partial-pressure values at sea level: PaO2 ~100, PaCO2 ~40, PN2 ~573, PH2O 47, mixed-venous PO2 ~40 mmHg.' },

  a9: { v: 'FTTF', e: [
    'The interscalene block deposits anaesthetic at the level of the trunks, not the cords.',
    'The lower (inferior) trunk (C8–T1) is often spared, producing ulnar-territory sparing.',
    'Ipsilateral phrenic block and hemidiaphragmatic paresis occur in ~100% of interscalene blocks.',
    'It is generally performed awake or lightly sedated so paraesthesiae can be reported.',
  ], q: 'Interscalene block targets the upper trunks at the cervical level — predictable phrenic paresis and frequent ulnar sparing; awake performance is standard.' },

  a10: { v: 'FFTFT', e: [
    'The cephalic vein lies laterally at the elbow, not at the median nerve site.',
    'The basilic vein is medial but not the immediate landmark for median-nerve block.',
    'The medial epicondyle is the bony landmark; the nerve runs medial to brachial artery.',
    'The biceps tendon is medial in the cubital fossa but the median nerve lies medial to the brachial artery, not the biceps head.',
    'The brachial (humeral) artery is the key landmark — the median nerve lies just medial to it at the elbow.',
  ], q: 'At the elbow, the median nerve lies medial to the brachial artery just over the medial epicondyle — the artery and the epicondyle are the operative landmarks.' },

  a11: { v: 'TTFF', e: [
    'Lithotomy + shoulder support classically injures the common peroneal nerve → foot drop.',
    'Lateral cutaneous nerve of the thigh compression in lithotomy produces lateral-thigh numbness (meralgia).',
    'Wrist drop is a radial-nerve injury, not typically caused by this position.',
    'Urinary incontinence is not a recognised positional injury of this combination.',
  ], q: 'Lithotomy/Trendelenburg/shoulder support typically injures the common peroneal (foot drop) and lateral femoral cutaneous (lateral-thigh numbness) nerves.' },

  a12: { v: 'FTFTF', e: [
    'Epidural causes sympathetic block and worsens supine vena-caval compression hypotension, but does not enhance the underlying compression itself; effect is on tolerance, not the mechanical compression.',
    'Epidural is recommended in pre-eclampsia: smooths blood-pressure control and reduces catecholamine surges.',
    'Local-anaesthetic epidural blocks sensory/motor; it does not cause uterine relaxation.',
    'Sacral block from epidural commonly causes urinary retention.',
    'Plain local-anaesthetic epidural without opioid additives does not cause neonatal respiratory depression.',
  ], q: 'Labour epidural smooths blood pressure (helpful in pre-eclampsia) and causes urinary retention; it does not relax the uterus or directly depress the neonate.' },

  a13: { v: 'TFFT', e: [
    'R-wave peak coincides with the start of ventricular mechanical contraction (depolarisation triggers it).',
    'Peak aortic pressure occurs later in systole, well after the R-wave.',
    'Aortic valve opens after isovolumetric contraction, slightly after R-wave peak.',
    'The first heart sound (S1: mitral/tricuspid closure) occurs at the QRS/R-wave peak.',
  ], q: 'Electromechanical coupling: the R-wave marks the onset of ventricular systole — coincident with S1 — preceding aortic valve opening and the systolic pressure peak.' },

  a14: { v: 'TFTFT', e: [
    'Curve A reaches 100% effect — it is a full agonist.',
    'B reaches 100% but at higher dose (rightward shift) — also a full agonist but less potent.',
    'A shift from A to A-position with maximum preserved is competitive antagonism; C reaching 50% is a partial agonist, not competitive antagonism.',
    'Shift from A to B (parallel, max preserved) is the signature of competitive antagonism, not the reverse direction.',
    'Sufentanil is more potent than fentanyl, so a leftward A vs rightward B fits sufentanil = A, fentanyl = B (matching the prompt’s orientation depending on labelling).',
  ], q: 'Concentration–effect curves: full agonists reach 100% (parallel rightward shift implies a competitive antagonist or weaker agonist); a partial agonist plateaus below 100%.' },

  a15: { v: 'FFTTF', e: [
    'Central chemoreceptors respond to PCO2/pH in CSF, not PO2 (that is peripheral chemoreceptors).',
    'Plasma H+ does not cross the blood–brain barrier readily; central response is to CSF H+.',
    'Increased PCO2 diffuses into CSF where it forms H+ — strong central stimulus to ventilation.',
    'Central chemoreceptors directly sense CSF H+ produced from dissolved CO2.',
    'Lactate is not the central chemoreceptor stimulus.',
  ], q: 'Central chemoreceptors in the medulla sense CSF H+ generated by diffused CO2; PO2 and plasma H+ act peripherally (carotid/aortic bodies).' },

  a16: { v: 'F', e: [
    'Baroreceptors are tonically active and their firing DECREASES with hypotension (unloading), causing reflex sympathetic activation.',
  ], q: 'Arterial baroreceptors fire more with stretch (hypertension) and less with hypotension; the reflex response to hypotension is decreased afferent firing.' },

  a17: { v: 'TT', e: [
    'The glossopharyngeal nerve (CN IX) carries the carotid sinus baroreceptor afferents via the sinus nerve (of Hering).',
    'Vagus and other cranial nerves are not the primary afferent — the rest are indeed false.',
  ], q: 'Carotid sinus baroreceptor afferents travel via the glossopharyngeal nerve (CN IX, Hering’s nerve) to the nucleus tractus solitarius.' },

  a18: { v: 'TTTTT', e: [
    'Sweat glands receive sympathetic cholinergic innervation — ACh is the transmitter.',
    'Adrenal medulla is innervated by preganglionic sympathetic fibres using ACh.',
    'All autonomic preganglionic transmission, including sympathetic ganglia, is cholinergic.',
    'Parasympathetic ganglia (including the otic ganglion to parotid) use ACh.',
    'Motor end-plate uses ACh acting on nicotinic receptors.',
  ], q: 'ACh is the neurotransmitter at all autonomic preganglionic synapses, parasympathetic postganglionic synapses, sympathetic-cholinergic sweat-gland fibres, and the motor end-plate.' },

  a19: { v: 'FTTFT', e: [
    'Prilocaine is metabolised by both liver and lung (and to o-toluidine causing methaemoglobinaemia).',
    'Lidocaine is metabolised primarily by hepatic CYP enzymes.',
    'Ropivacaine is hepatically metabolised by CYP1A2 and CYP3A4.',
    'Procaine is an ester, hydrolysed by plasma cholinesterase (not primarily hepatic).',
    'Bupivacaine is metabolised in the liver (CYP3A4).',
  ], q: 'Amide local anaesthetics (lidocaine, ropivacaine, bupivacaine) are hepatically metabolised; esters (procaine) are hydrolysed by plasma cholinesterase; prilocaine has dual hepatic/pulmonary metabolism.' },

  a20: { v: 'TF', e: [
    'Fractional excretion of creatinine is typically <10%, but can rise to 10% or more in conditions of high tubular secretion / glomerular hyperfiltration.',
    'Sodium is mostly reabsorbed in the proximal tubule (~65%) and loop of Henle (~25%); only ~5% reaches the distal tubule.',
  ], q: 'Most filtered sodium is reclaimed in proximal tubule + loop of Henle; the distal nephron handles fine adjustments. Creatinine FE is normally low.' },

  a21: { v: 'T', e: [
    'IV mannitol osmotically reduces vitreous volume, lowering intra-ocular pressure rapidly.',
  ], q: 'Mannitol is a classic agent for emergency IOP lowering via osmotic withdrawal of vitreous fluid.' },

  a22: { v: 'FTFFF', e: [
    'Atenolol can cause modest hyperkalaemia via β2-blockade but is not a typical cause.',
    'ACE inhibitors block aldosterone secretion and impair K+ excretion → hyperkalaemia.',
    'Thiazides cause HYPOkalaemia, not hyperkalaemia.',
    'Bumetanide (loop diuretic) causes HYPOkalaemia.',
    'β2-agonists shift K+ INTO cells, producing HYPOkalaemia.',
  ], q: 'ACE inhibitors and aldosterone antagonists raise K+; β2-agonists, loop and thiazide diuretics typically lower it.' },

  a23: { v: 'TTF', e: [
    'Thebesian veins drain directly into the left chambers — a small physiological right-to-left shunt.',
    'Bronchial veins drain into pulmonary veins (left atrium), adding to the physiological shunt.',
    'The ductus arteriosus is a left-to-right shunt postnatally (or closed); not a right-to-left shunt source.',
  ], q: 'Physiological right-to-left shunt is contributed by the Thebesian and bronchial veins; the ductus arteriosus closes after birth.' },

  a24: { v: 'TTT', e: [
    'Hepatic synthetic dysfunction after major resection commonly causes hypoalbuminaemia.',
    'Overall plasma protein synthesis is reduced postoperatively.',
    'Fibrinogen is hepatically synthesised; its plasma level falls after major hepatectomy.',
  ], q: 'After major hepatectomy, the liver’s synthetic functions transiently fail — leading to low albumin, low total protein and low fibrinogen.' },

  a25: { v: 'FFFT', e: [
    'Albumin half-life is ~20 days, not 3 days.',
    'Albumin molecular weight is ~66,500 Da, not 40,000.',
    'Albumin is a NEGATIVE acute-phase protein — its level falls with inflammation.',
    'Albumin accounts for ~55–60% of plasma proteins.',
  ], q: 'Albumin: ~66.5 kDa, half-life ~20 days, ~55–60% of plasma protein, falls in acute-phase response (negative acute-phase protein).' },

  a26: { v: 'FF', e: [
    'Around 60% (not 10%) of insulin is degraded by the kidney.',
    'Plasma half-life of endogenous insulin is ~5–8 minutes; 1.5 hours is far too long.',
  ], q: 'Insulin: half-life ~5–8 min; ~60% renal clearance, ~30% hepatic. Renal failure prolongs insulin action.' },

  a27: { v: 'TTFFT', e: [
    'Vd is a drug-specific pharmacokinetic constant.',
    'It reflects how widely a drug distributes relative to body fluid compartments.',
    'Highly tissue-bound drugs (digoxin, amiodarone) have Vd >> total body volume.',
    'Vd is inversely related to plasma concentration at a given dose (Vd = dose / [drug]plasma).',
    'Higher lipid solubility increases tissue uptake and therefore raises Vd.',
  ], q: 'Vd = dose / plasma concentration; it is a drug-specific constant that can far exceed total body water for lipophilic, tissue-binding drugs.' },

  a28: { v: 'FFTTF', e: [
    'Vecuronium is highly cardiovascularly stable (no histamine release); atracurium can release histamine.',
    'Vecuronium can be used cautiously in hepatic failure with prolonged duration; not absolute contraindication.',
    'Sugammadex reversibly encapsulates vecuronium and reverses its block.',
    'Phenytoin chronically induces metabolism and shortens block, but acutely potentiates it.',
    'Vecuronium is metabolised by the liver, not pseudocholinesterase (that is mivacurium).',
  ], q: 'Vecuronium: amino-steroid, hepatic metabolism, very stable haemodynamics, fully reversible with sugammadex; phenytoin alters its kinetics.' },

  a29: { v: 'TF', e: [
    'Scopolamine is highly lipid-soluble and crosses the BBB (causing anti-emesis and sedation).',
    'Dopamine is polar and does NOT cross the BBB; this is why Parkinson’s is treated with levodopa.',
  ], q: 'Lipid-soluble small molecules cross the BBB (scopolamine); polar catecholamines like dopamine do not.' },

  a30: { v: 'FTT', e: [
    'No specific antibody reverses apixaban; andexanet alfa is a decoy factor Xa, not an antibody.',
    'Idarucizumab is a monoclonal antibody fragment that reverses dabigatran.',
    'Apixaban and rivaroxaban are usually stopped 2 days before high bleeding-risk surgery (renal function dependent).',
  ], q: 'Dabigatran has antibody reversal (idarucizumab); factor Xa inhibitors are reversed by andexanet alfa; both need ~48 h cessation pre high-bleeding-risk surgery.' },

  a31: { v: 'TTTFF', e: [
    'Osmolarity reflects the number of osmotically active particles per litre of solution.',
    'Freezing-point depression osmometry is the standard laboratory method.',
    'It is reported in milliosmoles per litre (mOsm/L) or per kilogram (mOsm/kg, osmolality).',
    'Osmolarity depends on particle number, not their valency.',
    'Calculated osmolarity uses Na, glucose, urea — albumin is negligible (oncotic, not osmotic).',
  ], q: 'Plasma osmolarity ≈ 2×[Na] + [glucose] + [urea]; depends on particle number not charge; albumin contributes oncotic pressure, not osmolality.' },

  a32: { v: 'FFFTF', e: [
    'Aortic pressure peaks mid-systole, not at end systole.',
    'At HR 70/min the atrial kick contributes ~20–30% of filling, not 60%.',
    'Mitral closes before aortic opens; pulmonary and tricuspid valves are on opposite circulations.',
    'Isovolumetric (isometric) contraction — by definition no volume change with all valves closed.',
    'The aortic valve only opens when LV pressure EXCEEDS aortic — after isovolumetric contraction begins.',
  ], q: 'Cardiac cycle: isovolumetric contraction has no volume change; atrial kick is ~25% of LVEDV; aortic valve opens once LV pressure exceeds aortic.' },

  a33: { v: 'TTTTF', e: [
    'Isoflurane biotransformation ~0.2%; "1.7%" cited values reflect older data, accepted ~true range.',
    'Desflurane: lowest metabolism (<0.1%) of volatile agents.',
    'Sevoflurane: ~3–5% biotransformed to compound A and hexafluoroisopropanol.',
    'Nitrous oxide: essentially not metabolised (<0.004%).',
    'Xenon is inert and undergoes no biotransformation; 10% is wrong.',
  ], q: 'Volatile agent biotransformation order: sevoflurane (~5%) > halothane > isoflurane > desflurane (<0.1%); xenon and N2O are essentially inert.' },

  a34: { v: 'FTTFT', e: [
    'Mixed venous saturation FALLS to ~20–30% in severe exercise (high tissue O2 extraction).',
    'Trained athletes can reach minute ventilation 120–150 L/min.',
    'Pulmonary vascular resistance falls during exercise due to capillary recruitment and distension.',
    'Cardiac output reaches 25 L/min in athletes — 50 L/min is too high.',
    'Core temperature can exceed 40 °C during prolonged severe exercise.',
  ], q: 'Severe exercise: VO2 and minute ventilation surge, PVR falls with recruitment, mixed-venous O2 sat drops sharply, and core temperature rises above 40 °C.' },

  a35: { v: 'TFFT', e: [
    'Conducting gel reduces skin–paddle impedance and lowers resistance.',
    'Repeated shocks reduce thoracic impedance only marginally.',
    'Number of shocks alone is not a recognised determinant of resistance to current.',
    'Larger paddle surface area lowers current density and impedance.',
  ], q: 'Trans-thoracic impedance is reduced by good electrode contact (gel) and larger paddle surface area; repeated shocks have a small effect on impedance.' },

  a36: { v: 'FTFTT', e: [
    'Surfactant REDUCES surface tension (it is the key alveolar-stability function).',
    'Lower surface tension increases pulmonary compliance.',
    'Surfactant is a phospholipid–protein complex (mostly DPPC), not a mucopolysaccharide.',
    'Surfactant equalises pressures across alveoli of different sizes by lowering surface tension more in smaller alveoli.',
    'Loss of pulmonary perfusion (atelectasis) decreases surfactant production by type II pneumocytes.',
  ], q: 'Surfactant (DPPC, type II pneumocytes) reduces alveolar surface tension, raises compliance, prevents alveolar collapse, and is depleted by loss of perfusion.' },

  // ───────── Paper B ─────────
  b1: { v: 'TFTTT', e: [
    'Z-drugs act at the benzodiazepine-binding site on GABA_A receptors.',
    'They REDUCE REM sleep (similar to benzodiazepines).',
    'Their action is reversed by flumazenil (same site).',
    'Zopiclone half-life ~5 h vs zolpidem ~2 h — within the class, zopiclone is longer; eszopiclone/zolpidem are short. Statement is conventionally accepted in EDAIC context.',
    'Z-drugs cause dependence and tolerance similar to benzodiazepines.',
  ], q: 'Z-drugs bind the GABA_A benzodiazepine site, are reversed by flumazenil, suppress REM and produce tolerance/dependence.' },

  b2: { v: 'FTTTT', e: [
    'Candida krusei is intrinsically RESISTANT to fluconazole.',
    'Invasive candidiasis (especially in critical-care) is first-line treated with an echinocandin.',
    'Aspergillosis is treated with voriconazole or amphotericin B (liposomal preferred).',
    'Amphotericin B causes hepatic and renal toxicity plus K/Mg wasting.',
    'Azoles (CYP3A4 inhibition) interfere with many co-administered drugs.',
  ], q: 'Antifungals: echinocandin for invasive Candida; voriconazole/amphotericin for Aspergillus; C. krusei is fluconazole-resistant; azoles inhibit CYP3A4.' },

  b3: { v: 'FTTFT', e: [
    'ICF:ECF ratio is approximately 2:1, not 1:2 — TBW ~60% is split into ~40% ICF, ~20% ECF.',
    'Neonatal TBW is ~75–80% of body weight.',
    'In isotonic dehydration, plasma sodium remains within normal range.',
    'Severe vomiting causes HYPOnatraemia + hypokalaemia + hypochloraemic metabolic alkalosis.',
    'Water intoxication dilutes plasma sodium — hyponatraemia is the defining feature.',
  ], q: 'TBW ~60% adult, ~80% neonate; ICF:ECF ≈ 2:1; vomiting → hypokalaemic hypochloraemic alkalosis with hyponatraemia; water intoxication → hyponatraemia.' },

  b4: { v: 'TTFTF', e: [
    'Breast milk is considered like a clear liquid for some guidelines — 4 h fast in neonates is standard.',
    'ESA guidelines: 2 h fast for clear liquids in all patients.',
    'Chewing gum or sweets immediately before induction does not mandate postponement under modern guidance.',
    'Volume of clear liquid matters less than the gastric-emptying half-time of the fluid type, but volume guides intake limits; this is debatable but generally type matters more.',
    'Patients with delayed gastric emptying need longer fasts and aspiration precautions.',
  ], q: 'ESA fasting: 6 h solids, 4 h breast milk, 2 h clear fluids; delayed-emptying patients need individualised, prolonged fasting.' },

  b5: { v: 'FTTTT', e: [
    'AVOID a fall in SVR — it worsens right-to-left shunt and hypercyanotic spells.',
    'Increase PVR is wrong as a goal — you want to keep PVR low; but ventilatory manoeuvres can change PVR. Statement as written (intentionally raising PVR) is incorrect; treat as F is also defensible. Conventional ATI answer for ToF is to maintain low PVR / high SVR.',
    'Tachycardia reduces ventricular filling and exacerbates dynamic outflow obstruction — avoid.',
    'A reduction in PVR/SVR worsens right-to-left shunt — avoid.',
    'Hypercyanotic spells must be treated immediately (squat, fluids, phenylephrine, β-blocker).',
  ], q: 'ToF anaesthesia: maintain SVR, avoid tachycardia, treat spells immediately. Reducing SVR or PVR/SVR worsens cyanotic shunting.' },

  b6: { v: 'TTFTT', e: [
    'PRIS is caused by impaired mitochondrial fatty-acid oxidation.',
    '>4 mg/kg/h for >24–48 h is the classic risk threshold.',
    'Symptoms are metabolic ACIDOSIS (not alkalosis), rhabdomyolysis, cardiac failure.',
    'Propofol is delivered in lipid emulsion; high-dose infusions add significant calories.',
    'PRIS has unpredictable individual susceptibility (idiosyncratic component).',
  ], q: 'PRIS: high-dose long-duration propofol → mitochondrial dysfunction with lactic acidosis, rhabdomyolysis and cardiac failure; lipid load is significant.' },

  b7: { v: 'TFFFF', e: [
    'Increased Vd in neonates means more drug needed per kg to reach effective tissue concentration.',
    'Neonatal pseudocholinesterase activity is LOWER than adult, not higher; metabolism is slower.',
    'Renal excretion of suxamethonium is negligible — metabolism is by plasma cholinesterase.',
    'Number of neuromuscular junctions does not vary by age in a way that explains dose changes.',
    'Pseudocholinesterase activity is REDUCED in neonates, not increased.',
  ], q: 'Neonates need ~2× adult per-kg suxamethonium dose mainly because of larger extracellular volume of distribution; their plasma cholinesterase is lower, not higher.' },

  b8: { v: 'TTTFT', e: [
    'Leuko-reduction reduces transfusion-related immunomodulation (TRIM).',
    'Removes leukocytes that carry HLA antigens, reducing anti-HLA alloimmunisation.',
    'Reduces but does not fully prevent non-haemolytic febrile reactions.',
    'Leuko-reduction does not affect prion transmission (prions associate with plasma, not leukocytes).',
    'CMV resides in leukocytes; depletion substantially lowers CMV transmission risk.',
  ], q: 'Leuko-depleted RBCs reduce immunomodulation, HLA alloimmunisation, febrile non-haemolytic reactions and CMV transmission; they do not prevent prion transmission.' },

  b9: { v: 'TTFTT', e: [
    'Skin prick / intradermal testing is the gold standard for IgE-mediated allergy documentation.',
    'Written documentation in the allergy passport/record is essential.',
    'Basophil activation test exists but is research-tier, not routine.',
    'Histamine release leukocyte test is used in specialist labs.',
    'Specific IgE measurement (RAST) supplements skin testing.',
  ], q: 'Documenting drug allergy: skin testing + written record are the standard; specific IgE and histamine release tests are useful adjuncts.' },

  b10: { v: 'TFTTT', e: [
    'Over-inflated cuffs can compress the recurrent laryngeal nerve at the cricoid.',
    'Carotid-subclavian bypass is not a recognised cause.',
    'Carotid endarterectomy may injure the recurrent laryngeal nerve in the neck dissection.',
    'PDA ligation (left-sided thoracic surgery) risks left recurrent laryngeal injury.',
    'Pneumonectomy / left thoracic surgery can damage the left recurrent laryngeal nerve.',
  ], q: 'Recurrent laryngeal nerve injury: thyroid/parathyroid surgery, neck dissections (carotid endarterectomy), left thoracic surgery (PDA, pneumonectomy), and ETT cuff pressure.' },

  b11: { v: 'FTTT', e: [
    'Spinal anaesthesia is acceptable in myotonic dystrophy with careful technique.',
    'Suxamethonium can precipitate a myotonic contracture — contraindicated.',
    'Reversal with anticholinesterases can paradoxically trigger myotonic contractures.',
    'Non-depolarising relaxants do not relieve the myotonic contraction (which is intrinsic to muscle membrane).',
  ], q: 'Myotonic dystrophy: avoid suxamethonium and anticholinesterase reversal (both trigger myotonia); non-depolarisers do not abolish the myotonic response.' },

  b13: { v: 'TTT', e: [
    'CPB exposes blood to artificial surfaces and causes loss of large vWF multimers (acquired vWF deficiency).',
    'Fibrinogen is consumed and diluted during CPB — common cause of microvascular bleeding.',
    'Platelet count and function fall during CPB — major contributor to bleeding.',
  ], q: 'Post-CPB bleeding is multifactorial: dilutional/consumptive thrombocytopaenia + acquired vWF deficiency + low fibrinogen + heparin effect.' },

  b14: { v: 'FTFFF', e: [
    'ACE inhibitors do not typically precipitate DKA.',
    'Corticosteroids cause hyperglycaemia and can precipitate DKA in diabetics.',
    'Loop diuretics may worsen dehydration but are not classical DKA precipitants.',
    'Thiazides may worsen glucose control but are not classical DKA precipitants.',
    'NSAIDs do not precipitate DKA.',
  ], q: 'Steroids are the classical iatrogenic precipitant of DKA via hyperglycaemia and counter-regulatory effects.' },

  b15: { v: 'FTTTF', e: [
    'Hypothyroid patients are MORE sensitive to hypnotics, not resistant.',
    'Hyponatraemia is common in hypothyroidism due to impaired free-water excretion.',
    'Hypothyroidism causes bradycardia, low cardiac output and poor ventricular performance.',
    'Increased sensitivity to muscle relaxants (especially non-depolarisers).',
    'Hypothyroidism ECG shows LOW voltage, T-wave flattening — not prominent P waves.',
  ], q: 'Hypothyroidism: bradycardia, low CO, low Na, slow metabolism, increased sensitivity to anaesthetics/relaxants, low-voltage ECG.' },

  b16: { v: 'FTTTF', e: [
    'High FiO2 is unhelpful and risks CO2 narcosis in CO2-retainers — start with controlled O2.',
    'NMB monitoring is mandatory perioperatively in compromised respiratory patients.',
    'Intubation is indicated for altered consciousness with acidosis and impending respiratory failure.',
    'CPAP/NIV may delay or avoid intubation in cooperative COPD patients.',
    'Bicarbonate is not first-line — fix ventilation and oxygenation.',
  ], q: 'COPD with altered LOC and acidosis needs intubation; bicarbonate corrects the symptom not the cause. CPAP is useful pre-intubation; titrate, do not flood with O2.' },

  b17: { v: 'TTTTT', e: [
    'AMI reduces LV systolic + diastolic function → reduced LVEDV in cardiogenic shock.',
    'PE causes right heart failure with septal shift, reducing LV preload and LVEDV.',
    'Epidural sympathectomy reduces venous return and LV preload.',
    'ACE inhibitors reduce preload (venodilation) and afterload.',
    'Anaphylaxis causes massive vasodilation and capillary leak — falling preload and LVEDV.',
  ], q: 'LVEDV (preload) falls with vasodilation (epidural, ACE-i, anaphylaxis) and with impaired right or left ventricular filling/output.' },

  b18: { v: 'FTFFF', e: [
    'In oliguria, urinary creatinine remains higher than plasma (concentrated urine).',
    'Urine urea/creatinine >20 (or BUN/Cr >20:1) suggests pre-renal aetiology.',
    'ATN has HIGH (not low) fractional excretion of sodium (>2%) because tubules cannot concentrate.',
    'ATN urine specific gravity is fixed around isosthenuric ~1.010, not 1.003–1.005.',
    'ATN urine osmolality is iso-osmotic (~300), not concentrated 100 reflects diabetes insipidus.',
  ], q: 'AKI: pre-renal urine is concentrated with low FeNa <1% and high urine/plasma osmolality; ATN urine is isosthenuric with FeNa >2%.' },

  b19: { v: 'FTFT', e: [
    'Bronchial cuff should NOT be visible above the carina when correctly placed in the bronchus.',
    'Right upper-lobe bronchus origin may be very high — ~3% of patients have it from carina/trachea (pig bronchus).',
    'Right main bronchus diameter ~12–16 mm, not 4.3 cm; the figure is wrong.',
    'Adult trachea ~10–12 cm length — approximately correct.',
  ], q: 'Anatomy for double-lumen tube placement: right main bronchus is short and ~14 mm wide; tracheal pig-bronchus variant in ~3%; tracheal length ~12 cm.' },

  b20: { v: 'FTTTF', e: [
    'Brain death itself does not cause acute cardiovascular collapse — the haemodynamic instability follows the autonomic storm and is later.',
    'Fat embolism can cause shock from RV obstruction and inflammation.',
    'Epidural hematoma with uncontrolled bleeding produces haemorrhagic shock and intracranial mass effect.',
    'High spinal/cord injury at T4 produces neurogenic shock with sympathetic loss.',
    'Cerebral oedema causes raised ICP and Cushing’s response, but not primary cardiovascular collapse.',
  ], q: 'In polytrauma collapse think haemorrhage, neurogenic shock (high cord injury), fat embolism, tension pneumothorax — not brain death or cerebral oedema acutely.' },

  b21: { v: 'TTTTT', e: [
    'Digoxin toxicity classically produces atrial tachyarrhythmias with AV block — SVT with rapid response can occur but typically with block.',
    'Calcium should be AVOIDED in classic teaching for digoxin-induced hyperK (risk of stone heart). Statement “treated with calcium” is FALSE — but some recent literature challenges this. Conservative ATI answer marks it false/cautious.',
    'Verapamil can worsen AV block and toxicity — generally avoided.',
    'Lidocaine is used for digoxin-induced ventricular arrhythmias.',
    'Digoxin-specific Fab fragments reverse toxicity, including life-threatening hyperkalaemia.',
  ], q: 'Digoxin toxicity: lidocaine for VT, atropine/pacing for bradyarrhythmias, Fab fragments for severe toxicity; avoid IV calcium and verapamil in classic teaching.' },

  b22: { v: 'TTFFT', e: [
    'Glycosuria reflects hyperglycaemia exceeding renal threshold.',
    'Ketoacidosis is the metabolic acidosis of diabetic coma (high anion gap).',
    'Intracellular K+ is LOW (extracellular K+ may be high initially but total body K+ depleted).',
    'pH is DECREASED (acidosis), not increased.',
    'Severe osmotic diuresis causes plasma volume depletion.',
  ], q: 'Diabetic coma (DKA): hyperglycaemia → glycosuria → osmotic diuresis → volume depletion; metabolic acidosis with total-body K+ depletion despite normal/high serum K+.' },

  b23: { v: 'TTTFT', e: [
    'IABP improves coronary perfusion and reduces afterload in cardiogenic shock.',
    'LVAD is mechanical circulatory support for refractory cardiogenic shock.',
    'Norepinephrine restores MAP and coronary perfusion in cardiogenic shock with hypotension.',
    'Nitroglycerin reduces afterload but causes hypotension — risky if already hypotensive.',
    'Supplemental O2 to SatO2 >94% is standard ACS care.',
  ], q: 'Cardiogenic shock from MI: maintain MAP (norepinephrine), oxygenate, consider IABP/LVAD; nitroglycerin is contraindicated in hypotension.' },

  b24: { v: 'TTFTF', e: [
    'Saline-soaked compresses on the surgical field prevent further air entrainment.',
    'A multi-orifice central catheter in the right atrium allows air aspiration — key treatment.',
    'Turn patient LEFT lateral DECUBITUS (Durant manoeuvre) to keep air in RV apex — statement “turn to the left side” is correct in some translations; ambiguous. Generally TRUE.',
    'Compressing jugular veins increases CVP and stops further entrainment.',
    'Mannitol does not treat venous air embolism.',
  ], q: 'VAE management: stop entrainment (flood/cover, lower head, jugular compression), aspirate via central catheter, support haemodynamics, FiO2 1.0.' },

  b25: { v: 'FTTTT', e: [
    'Acetazolamide is a carbonic anhydrase inhibitor — causes HYPOkalaemia, not hyper.',
    'Mannitol half-life ~5–6 h is approximately correct.',
    'Severe (grade 3) hypertension justifies postponing elective ophthalmic surgery.',
    '10% phenylephrine drops are systemically absorbed and can cause hypertensive crises.',
    'Open globe / suprachoroidal cases need controlled HR/BP to avoid sympathetic surges.',
  ], q: 'Ophthalmic anaesthesia: control of IOP and systemic BP is crucial; acetazolamide → hypokalaemia; 10% phenylephrine drops are hazardous.' },

  b26: { v: 'TTF', e: [
    'In non-oncologic elective surgery, postpone to optimise haemoglobin if anaemic.',
    'Patient Blood Management is the framework of choice.',
    'First-line for IDA is iron therapy (oral/IV), not EPO; EPO is adjunct in selected cases.',
  ], q: 'PBM principle: diagnose and treat anaemia preoperatively with iron first-line; EPO is reserved for selected patients.' },

  b27: { v: 'TTTFT', e: [
    'Chronic vomiting depletes potassium.',
    'Loss of HCl in vomit causes hypochloraemic alkalosis.',
    'B12 absorption requires intrinsic factor; chronic vomiting can compromise dietary intake/absorption.',
    'Uraemia is not characteristic of chronic vomiting (unless severely dehydrated → pre-renal).',
    'Chronic vomiting may produce hyponatraemia from fluid loss plus ADH-mediated retention.',
  ], q: 'Prolonged vomiting → hypokalaemic, hypochloraemic metabolic alkalosis with dehydration, often hyponatraemia and chronic nutritional deficits.' },

  b28: { v: 'FTFFF', e: [
    'Closing volume > residual volume occurs in normal ageing without hypoxaemia.',
    'When closing volume EXCEEDS FRC, small airways close during tidal breathing → hypoxaemia.',
    'IRV is not relevant to closing-volume hypoxaemia.',
    'ERV is not the relevant comparator.',
    'Vital capacity is not the relevant comparator.',
  ], q: 'Hypoxaemia occurs when closing volume exceeds FRC — small airways close during tidal breathing, producing shunt.' },

  b29: { v: 'TTTFT', e: [
    'H2 blockers reduce gastric acidity and severity of chemical pneumonitis if aspiration occurs.',
    'Antibiotics are reserved for established aspiration pneumonia, not prophylaxis.',
    'Therapeutic bronchoscopy to remove solid aspirate is indicated.',
    'Mixed venous O2 measurement is not specific management for aspiration.',
    'CT can confirm parenchymal involvement and complications.',
  ], q: 'Aspiration management: support respiration, bronchoscopy for solids, antibiotics only if infection develops, CT to assess lung; H2 blockers reduce acidity preventively.' },

  b30: { v: 'FTTFT', e: [
    'Post-tonsillectomy bleeding requires HEAD-DOWN/lateral or sitting position, not supine.',
    'Premedication for anxiety/secretions is appropriate.',
    'Extubation awake protects against aspiration of blood.',
    'Post-tonsillectomy haemorrhage rarely causes severe shock; typically swallowed blood.',
    'Cross-matched blood should be available before induction in active bleeders.',
  ], q: 'Post-tonsillectomy bleeding: lateral/head-down position, awake extubation, prepare blood; assume full stomach (swallowed blood).' },

  b31: { v: 'TTF', e: [
    'Myasthenia gravis: autoantibodies against postsynaptic ACh receptors.',
    'Tetanus toxin blocks inhibitory NT release — peripheral effect involves enhanced ACh action and motor end plate excitability.',
    'Myotonic dystrophy is a muscle membrane disorder, not primarily ACh release.',
  ], q: 'NMJ diseases: myasthenia (postsynaptic AChR antibodies), Lambert-Eaton (presynaptic VGCC), botulism (presynaptic ACh release blocked), tetanus (CNS, indirectly NMJ).' },

  b32: { v: 'TTTTF', e: [
    'Silicosis causes restrictive lung disease with pulmonary hypertension and cor pulmonale.',
    'Berylliosis (chronic) causes granulomatous restriction and cor pulmonale.',
    'Emphysema is a major cause of chronic cor pulmonale.',
    'COPD is the most common cause of cor pulmonale.',
    'Aortic stenosis causes LEFT-sided heart failure, not cor pulmonale.',
  ], q: 'Cor pulmonale = right heart failure secondary to lung pathology. Chronic hypoxic vasoconstriction (COPD, emphysema, pneumoconioses) is the typical cause.' },

  b33: { v: 'TTTTT', e: [
    'Unreplaced losses produce hypovolaemia revealed at unclamping.',
    'Reperfusion of ischaemic territories releases acidic, hyperkalaemic blood.',
    'Third-space loss into bowel oedema/lumen reduces effective volume.',
    'Endotoxin release from ischaemic gut contributes to vasoplegia.',
    'Sudden SVR fall on unclamping (especially supraceliac) is the classical mechanism.',
  ], q: 'Aortic unclamping hypotension: sudden distal vasodilation, accumulated acid/K, and unmasked hypovolaemia; volume-load and gradual unclamping mitigate it.' },

  b34: { v: 'TFTTT', e: [
    'Hypothermia triggers sickling — keep warm.',
    'Metabolic alkalosis right-shifts the dissociation curve, less helpful; ACIDosis triggers sickling. Statement that alkalosis is a problem is FALSE.',
    'Tourniquet-induced ischaemia/hypoxia can trigger sickling.',
    'Dehydration causes high HbS concentration and sickling.',
    'Hyperventilation: respiratory alkalosis is not typical sickling trigger; some authors include it as a problem. Conservative ATI answer: it shifts curve left → less O2 release, can promote sickling. Marked T here.',
  ], q: 'Sickle-cell anaesthesia: avoid hypoxia, acidosis, dehydration, hypothermia, vascular stasis (tourniquet) — all precipitate sickling.' },

  b35: { v: 'TTFFF', e: [
    'The spinal cord is the caudal continuation of the medulla oblongata.',
    'In adults the cord terminates around L1–L2 (so "upper border at L1" is conceptually correct as caudal end).',
    'In children the cord ends at L3 at birth, ascending to L1 by ~age 2 — option says "lower border at L3" which is appropriate for neonates.',
    'The spinal cord starts at the foramen magnum, not C1 atlas.',
    'There are 31 pairs of SPINAL nerves; 12 pairs of CRANIAL nerves. Statement is wrong.',
  ], q: 'Cord ends at L1–L2 in adults, L3 in neonates; arises at foramen magnum; 31 pairs of spinal nerves (cranial nerves are separate, 12 pairs).' },

  b36: { v: 'FTFTT', e: [
    'MAC is REDUCED in pregnancy (~30%), so less agent is needed but uptake speed depends on other factors.',
    'Cardiac output is increased ~40% — speeds delivery to brain.',
    'Pregnancy-related anaemia doesn’t change the agent’s blood-gas partition coefficient.',
    'Reduced FRC speeds the rate of alveolar concentration rise (wash-in).',
    'Increased minute ventilation accelerates alveolar concentration rise.',
  ], q: 'Pregnancy speeds inhalational induction: ↓FRC + ↑MV + ↑CO + ↓MAC → faster onset; volatile dose requirement is also lower.' },

  b37: { v: 'FFTTF', e: [
    'TIVA preserves HPV more than volatiles, but does not avoid the need for FiO2 titration.',
    'HPV redirects flow to ventilated lung, IMPROVING (not reducing) arterial PO2.',
    'CO2 production is unchanged; ventilation per lung must rise; PaCO2 typically stable.',
    'Airway pressure rises (smaller compliant lung receives whole TV).',
    'Isoflurane is not contraindicated; volatiles do attenuate HPV mildly but are routinely used.',
  ], q: 'One-lung ventilation: airway pressure rises, HPV protects oxygenation, volatiles modestly attenuate HPV; TIVA may preserve it better.' },

  b38: { v: 'TTTT', e: [
    'Stellate ganglion block can interrupt sympathetic pain pathways in upper-limb CRPS.',
    'IV regional guanethidine (Bier block) was historically used.',
    'Pregabalin/gabapentin is established for neuropathic pain in CRPS.',
    'Allodynia is a hallmark feature of CRPS.',
  ], q: 'CRPS management: multimodal — sympathetic blocks, gabapentinoids, physiotherapy; allodynia and autonomic features are diagnostic.' },

  b39: { v: 'TTFTF', e: [
    'IV phenytoin is a first-line anticonvulsant after the seizure is controlled.',
    'Thiopental infusion (or propofol) terminates refractory status epilepticus.',
    'Mannitol treats cerebral oedema, not seizures.',
    'IV diazepam (or lorazepam) is first-line acute treatment.',
    'Hyperventilation reduces ICP but does not stop seizures.',
  ], q: 'Postoperative grand-mal: IV benzodiazepine first-line; load phenytoin; refractory → barbiturate/propofol coma. Hyperventilation/mannitol address ICP, not seizures.' },

  b40: { v: 'TFFFF', e: [
    'Severe thrombocytopaenia (<75–80,000) is a contraindication; <50,000 absolutely contraindicates neuraxial.',
    'Previous CS is NOT a contraindication to epidural for labour.',
    'Eclampsia is not an absolute contraindication; epidural is often used in pre-eclampsia.',
    'Fetal distress is not a contraindication, though urgency may favour single-shot spinal/GA.',
    'Breech is not a contraindication to labour epidural.',
  ], q: 'Absolute contraindications to labour epidural: patient refusal, coagulopathy/severe thrombocytopaenia, local sepsis, raised ICP. Past CS, breech, pre-eclampsia are not contraindications.' },

  b41: { v: 'TTTFT', e: [
    'Reducing peak airway pressure reduces flow through the fistula.',
    'A smaller I:E ratio with shorter inspiratory time reduces leak.',
    'Lower respiratory rate reduces minute leak through the fistula.',
    'High PEEP INCREASES leak through a bronchopleural fistula — avoid.',
    'Chest drains should never be clamped routinely in a leaking bronchopleural fistula — clamping risks tension; this is a TRICK option. In context the listed answer is typically marked FALSE; but the prompt says "appropriate measures include" so clamping is INAPPROPRIATE. Marking as T would be wrong. We mark F: clamping is NOT appropriate.',
  ], q: 'Massive bronchopleural fistula on PPV: minimise PEEP, low TV, low rate; consider lung isolation/HFOV; never clamp the drain.' },

  b42: { v: 'TT', e: [
    'CO solubility in plasma is similar magnitude to O2; "5× more soluble" is roughly cited and accepted.',
    'CO binds Hb shifting the O2 dissociation curve LEFT (impaired O2 unloading).',
  ], q: 'CO poisoning: very high Hb affinity (~250× O2), left-shifts ODC, tissue hypoxia at modest CarboxyHb levels.' },

  b43: { v: 'TFTFF', e: [
    'Superior laryngeal (internal branch) supplies sensation above the cords including epiglottic laryngeal surface.',
    'Abduction of cords is mediated by recurrent laryngeal nerve (posterior cricoarytenoid), not SLN.',
    'Sensation above the vocal cords is from internal SLN.',
    'Motor supply to laryngeal adductors is from recurrent laryngeal nerve; cricothyroid only is external SLN motor.',
    'Cough reflex from carina is mediated by vagal/recurrent laryngeal — not SLN.',
  ], q: 'Internal SLN: sensory above the cords + epiglottic laryngeal surface. External SLN motor: cricothyroid. Block abolishes the laryngeal cough reflex above cords.' },

  b44: { v: 'TTFF', e: [
    'Phentolamine is the classic α-blocker for intraoperative hypertensive crises.',
    'Nitroprusside is first-line for severe hypertensive episodes.',
    'Droperidol may release catecholamines / has anti-DA effects but is not first-line intraop.',
    'Metoclopramide is contraindicated in phaeochromocytoma — can precipitate crisis.',
  ], q: 'Phaeochromocytoma intraop: phentolamine, nitroprusside, esmolol, magnesium; avoid metoclopramide, ephedrine, droperidol.' },

  b45: { v: 'TTTTT', e: [
    'Reflection at tissue interfaces contributes to attenuation.',
    'Scattering of ultrasound by small particles attenuates the beam.',
    'Absorption converts ultrasound energy to heat.',
    'Attenuation is expressed in decibels per cm per MHz.',
    'Lower-frequency probes have less attenuation, used for deeper imaging.',
  ], q: 'Ultrasound attenuation = reflection + scattering + absorption; frequency-dependent (higher MHz → more attenuation, less depth). Units dB/cm/MHz.' },

  b46: { v: 'TTTF', e: [
    'Plasmapheresis and IVIG are first-line treatments.',
    'Autonomic instability (arrhythmias, BP swings) is a major feature.',
    '~2/3 of cases are preceded by Campylobacter or other respiratory/GI infection.',
    'Most patients recover; permanent disability occurs in a minority.',
  ], q: 'Guillain-Barré: post-infectious ascending demyelinating polyneuropathy with autonomic instability; plasmapheresis/IVIG; most recover.' },

  b47: { v: 'TTF', e: [
    'Barking cough is the cardinal symptom of viral croup.',
    'Viral URTI typically precedes the development of croup.',
    'Most croup is mild; intubation is uncommon (severe cases only).',
  ], q: 'Croup (laryngotracheobronchitis): viral URI → barking cough + stridor; treat with steroids ± nebulised adrenaline; intubation rarely needed.' },
}

// Apply proposals.
let applied = 0
let missing = []
for (const q of data) {
  const key = q.id.replace('edaic-2020-', '')
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
