-- ─────────────────────────────────────────
-- MOCK DATA — prep app
-- Run in Supabase SQL Editor (after 001 + 002)
-- ─────────────────────────────────────────

-- 1. Book
insert into public.books (id, title, author, edition) values
  ('a1b2c3d4-0001-0000-0000-000000000000', 'Miller''s Anesthesia', 'Michael A. Gropper', '9th Edition');

-- 2. Chapters
insert into public.chapters (id, book_id, title, order_index, content) values
  (
    'a1b2c3d4-0002-0001-0000-000000000000',
    'a1b2c3d4-0001-0000-0000-000000000000',
    'Cardiovascular Physiology',
    1,
    'Cardiovascular physiology covers cardiac output, the cardiac action potential, coronary circulation, and regulation of blood pressure. Key concepts include the Frank-Starling mechanism, preload, afterload, and myocardial contractility. Cardiac output (CO = HR × SV) is normally 4–8 L/min at rest.'
  ),
  (
    'a1b2c3d4-0002-0002-0000-000000000000',
    'a1b2c3d4-0001-0000-0000-000000000000',
    'Pharmacology of Inhalational Agents',
    2,
    'Inhalational anaesthetic agents include volatile agents (sevoflurane, desflurane, isoflurane) and gases (nitrous oxide). Key concepts include MAC, blood-gas partition coefficient, metabolism, and cardiovascular effects. MAC is the alveolar concentration preventing movement in 50% of patients at surgical stimulation.'
  ),
  (
    'a1b2c3d4-0002-0003-0000-000000000000',
    'a1b2c3d4-0001-0000-0000-000000000000',
    'Airway Management',
    3,
    'Airway management covers assessment (Mallampati score, thyromental distance), supraglottic devices (LMA, ProSeal), direct and video laryngoscopy, rapid sequence induction, and emergency front-of-neck access. Failed intubation occurs in approximately 1:2000 general surgical cases.'
  );

-- 3. Questions (all approved, ai_generated)
insert into public.questions (id, chapter_id, stem, explanation, source, status) values

  -- Chapter 1: Cardiovascular Physiology
  (
    'b1000001-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0001-0000-000000000000',
    'Regarding cardiac output and its determinants:',
    'Cardiac output (CO = HR × SV) is regulated by heart rate, preload, afterload, and contractility. Normal resting CO is 4–8 L/min. The Frank-Starling mechanism describes increased stroke volume in response to increased end-diastolic volume.',
    'ai_generated', 'approved'
  ),
  (
    'b1000002-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0001-0000-000000000000',
    'Concerning the ventricular myocyte action potential:',
    'Phase 0 is rapid depolarisation via fast Na⁺ channels. Phase 2 plateau is maintained by L-type Ca²⁺ channels. Automatic phase 4 depolarisation occurs in pacemaker cells only. The absolute refractory period spans phases 0–2, preventing tetanic contraction.',
    'ai_generated', 'approved'
  ),
  (
    'b1000003-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0001-0000-000000000000',
    'Regarding coronary circulation:',
    'Left ventricular coronary perfusion occurs mainly during diastole. CPP = aortic diastolic pressure − LVEDP. Autoregulation maintains coronary flow between MAP 60–140 mmHg. Adenosine is a potent endogenous coronary vasodilator released during ischaemia.',
    'ai_generated', 'approved'
  ),

  -- Chapter 2: Pharmacology of Inhalational Agents
  (
    'b2000001-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0002-0000-000000000000',
    'Regarding minimum alveolar concentration (MAC):',
    'MAC is the ED50 for immobility at surgical stimulation. It decreases with age (~6%/decade after 40), hypothermia, opioids, and pregnancy. N₂O has a MAC of ~104%, requiring hyperbaric conditions to achieve surgical anaesthesia alone.',
    'ai_generated', 'approved'
  ),
  (
    'b2000002-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0002-0000-000000000000',
    'Concerning the properties of sevoflurane:',
    'Sevoflurane (blood-gas coefficient 0.65) allows rapid induction and emergence. It undergoes 3–5% hepatic metabolism via CYP2E1. Compound A forms with soda lime at low flows. It triggers malignant hyperthermia and causes dose-dependent cardiovascular depression.',
    'ai_generated', 'approved'
  ),
  (
    'b2000003-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0002-0000-000000000000',
    'Regarding the properties of desflurane:',
    'Desflurane (blood-gas coefficient 0.45) has the fastest emergence of the volatile agents. Its pungency precludes inhalation induction. It undergoes <0.02% metabolism. Its near-room-temperature boiling point (22.8°C) requires a heated pressurised Tec 6 vaporiser.',
    'ai_generated', 'approved'
  ),

  -- Chapter 3: Airway Management
  (
    'b3000001-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0003-0000-000000000000',
    'Regarding rapid sequence induction (RSI):',
    'RSI minimises aspiration risk in full-stomach patients. Three minutes of pre-oxygenation (or 4 vital-capacity breaths) provides adequate apnoea time. Suxamethonium 1.5 mg/kg or rocuronium 1.2 mg/kg are standard. Cricoid pressure efficacy is disputed.',
    'ai_generated', 'approved'
  ),
  (
    'b3000002-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0003-0000-000000000000',
    'Concerning the laryngeal mask airway (LMA):',
    'The LMA sits in the hypopharynx and does not protect against aspiration. Airway pressures should remain ≤20 cmH₂O to avoid gastric insufflation. The ProSeal LMA includes a drain tube for gastric access. Insertion requires no laryngoscopy.',
    'ai_generated', 'approved'
  ),
  (
    'b3000003-0000-0000-0000-000000000000',
    'a1b2c3d4-0002-0003-0000-000000000000',
    'Regarding difficult airway assessment and management:',
    'Mallampati I–IV classifies oropharyngeal visibility. Thyromental distance <6 cm predicts difficult laryngoscopy. Video laryngoscopy usually improves the view but is not universally superior. Surgical cricothyrotomy is the final rescue in can''t intubate/can''t oxygenate.',
    'ai_generated', 'approved'
  );

-- 4. Statements (5 per question, 45 total)
insert into public.statements (question_id, order_index, text, is_correct, explanation) values

  -- Q1: Cardiac output
  ('b1000001-0000-0000-0000-000000000000', 1, 'Normal resting cardiac output in an adult is 4–8 L/min', true,
   'CO = HR × SV; at rest this gives 4–8 L/min (cardiac index 2.5–4.0 L/min/m²).'),
  ('b1000001-0000-0000-0000-000000000000', 2, 'Cardiac output is the product of heart rate and stroke volume', true,
   'CO = HR × SV is the fundamental relationship governing cardiac output.'),
  ('b1000001-0000-0000-0000-000000000000', 3, 'Preload is defined as ventricular wall tension at the end of systole', false,
   'Preload is end-diastolic wall tension (related to end-diastolic volume), not end-systolic.'),
  ('b1000001-0000-0000-0000-000000000000', 4, 'The Frank-Starling mechanism describes increased stroke volume in response to increased end-diastolic fibre length', true,
   'Greater stretch at end-diastole leads to more forceful contraction, increasing stroke volume up to a physiological limit.'),
  ('b1000001-0000-0000-0000-000000000000', 5, 'Afterload primarily determines diastolic filling of the ventricle', false,
   'Afterload (systolic wall stress opposing ejection) affects systolic performance, not diastolic filling. Diastolic filling is governed by preload and ventricular compliance.'),

  -- Q2: Action potential
  ('b1000002-0000-0000-0000-000000000000', 1, 'Phase 0 depolarisation is caused by rapid influx of sodium ions through fast voltage-gated Na⁺ channels', true,
   'Opening of fast Na⁺ channels produces the steep upstroke (Phase 0) of the ventricular action potential.'),
  ('b1000002-0000-0000-0000-000000000000', 2, 'The Phase 2 plateau is maintained by calcium influx through L-type calcium channels', true,
   'L-type (long-lasting) Ca²⁺ channels sustain the plateau, linking electrical depolarisation to myocyte contraction.'),
  ('b1000002-0000-0000-0000-000000000000', 3, 'Spontaneous Phase 4 depolarisation occurs normally in ventricular myocytes', false,
   'Automatic Phase 4 depolarisation is a property of pacemaker cells (SA node, AV node, His-Purkinje). Ventricular myocytes maintain a stable resting membrane potential of approximately −90 mV.'),
  ('b1000002-0000-0000-0000-000000000000', 4, 'The absolute refractory period in cardiac muscle corresponds approximately to Phases 0, 1, and 2', true,
   'During the absolute refractory period the myocyte cannot be re-stimulated, preventing tetanic contraction — essential for effective pumping.'),
  ('b1000002-0000-0000-0000-000000000000', 5, 'Hyperkalaemia shortens the cardiac action potential duration', false,
   'Hyperkalaemia depolarises the resting membrane potential, reduces the overshoot of Phase 0, and slows conduction. At higher levels it can prolong or abolish the action potential.'),

  -- Q3: Coronary circulation
  ('b1000003-0000-0000-0000-000000000000', 1, 'The left coronary artery supplies the majority of the left ventricular myocardium', true,
   'The left anterior descending and left circumflex arteries together supply most of the LV free wall, septum, and apex.'),
  ('b1000003-0000-0000-0000-000000000000', 2, 'Coronary perfusion pressure equals aortic diastolic pressure minus left ventricular end-diastolic pressure', true,
   'CPP = AoDP − LVEDP. Elevated LVEDP (e.g. heart failure) or low diastolic pressure reduce coronary perfusion.'),
  ('b1000003-0000-0000-0000-000000000000', 3, 'The left ventricle receives the majority of its coronary blood flow during systole', false,
   'LV intramyocardial pressure during systole equals or exceeds aortic pressure, compressing intramural vessels. LV perfusion therefore occurs predominantly during diastole.'),
  ('b1000003-0000-0000-0000-000000000000', 4, 'Adenosine is a potent endogenous coronary vasodilator', true,
   'Adenosine released during ischaemia acts on A2A receptors to dilate coronary arterioles, increasing flow to match metabolic demand.'),
  ('b1000003-0000-0000-0000-000000000000', 5, 'Coronary blood flow autoregulation is maintained across mean arterial pressures of approximately 60–140 mmHg', true,
   'Within this range, myogenic and metabolic mechanisms keep coronary flow constant. Outside it, flow becomes pressure-dependent.'),

  -- Q4: MAC
  ('b2000001-0000-0000-0000-000000000000', 1, 'MAC is the alveolar concentration that prevents purposeful movement in 50% of patients in response to surgical skin incision', true,
   'This is the classical definition (ED50 for immobility). It is measured at steady state at sea level (1 atm).'),
  ('b2000001-0000-0000-0000-000000000000', 2, 'Increasing age is associated with a progressive decrease in MAC', true,
   'MAC decreases approximately 6% per decade after age 40, and is roughly 25% lower at age 80 compared to age 40.'),
  ('b2000001-0000-0000-0000-000000000000', 3, 'Pregnancy increases the MAC of volatile anaesthetic agents', false,
   'Pregnancy decreases MAC by approximately 25–40%, partly attributed to elevated progesterone and endorphin levels.'),
  ('b2000001-0000-0000-0000-000000000000', 4, 'The MAC of nitrous oxide is approximately 104%', true,
   'A MAC >100% means N₂O cannot achieve surgical anaesthesia at atmospheric pressure alone; it is used as an adjunct to reduce volatile agent requirements.'),
  ('b2000001-0000-0000-0000-000000000000', 5, 'Hypothermia increases MAC', false,
   'Hypothermia decreases MAC by approximately 5% per °C. This is exploited in total intravenous anaesthesia during deep hypothermic circulatory arrest.'),

  -- Q5: Sevoflurane
  ('b2000002-0000-0000-0000-000000000000', 1, 'The blood-gas partition coefficient of sevoflurane is approximately 0.65', true,
   'A low coefficient (0.65) favours rapid equilibration between alveolar gas and blood, enabling quick induction and emergence.'),
  ('b2000002-0000-0000-0000-000000000000', 2, 'Sevoflurane undergoes approximately 3–5% hepatic metabolism', true,
   'CYP2E1 metabolises sevoflurane to hexafluoroisopropanol and inorganic fluoride. Far less than halothane (~20%) but more than desflurane (<0.02%).'),
  ('b2000002-0000-0000-0000-000000000000', 3, 'Sevoflurane reacts with carbon dioxide absorbents to produce Compound A', true,
   'Compound A (fluoromethyl-hexafluoroisopropyl ether) forms at low fresh gas flows with soda lime. Nephrotoxic in rats; clinical relevance in humans is debated.'),
  ('b2000002-0000-0000-0000-000000000000', 4, 'Sevoflurane causes dose-dependent depression of myocardial contractility', true,
   'All volatile agents depress contractility in a dose-dependent manner by reducing intracellular Ca²⁺ availability.'),
  ('b2000002-0000-0000-0000-000000000000', 5, 'Sevoflurane is safe to administer to patients with known susceptibility to malignant hyperthermia', false,
   'All potent volatile anaesthetic agents are pharmacogenetic triggers for malignant hyperthermia. They are absolutely contraindicated in susceptible patients.'),

  -- Q6: Desflurane
  ('b2000003-0000-0000-0000-000000000000', 1, 'Desflurane has the lowest blood-gas partition coefficient among the commonly used volatile anaesthetic agents', true,
   'Desflurane (0.45) < sevoflurane (0.65) < isoflurane (1.4) < halothane (2.4), giving it the fastest onset and offset.'),
  ('b2000003-0000-0000-0000-000000000000', 2, 'Desflurane is unsuitable for inhalation induction due to its pungent airway properties', true,
   'Desflurane causes coughing, breath-holding, laryngospasm and excessive secretions on inhalation, making gaseous induction impractical.'),
  ('b2000003-0000-0000-0000-000000000000', 3, 'Desflurane undergoes significant hepatic metabolism, similar to isoflurane', false,
   'Desflurane undergoes <0.02% metabolism, making it essentially inert. Isoflurane undergoes ~0.2% metabolism.'),
  ('b2000003-0000-0000-0000-000000000000', 4, 'Desflurane requires a heated pressurised vaporiser for accurate delivery', true,
   'Its boiling point is 22.8°C (near room temperature). A Tec 6 vaporiser heated to 39°C maintains it as a vapour at controlled pressure.'),
  ('b2000003-0000-0000-0000-000000000000', 5, 'The MAC of desflurane in oxygen is approximately 6%', true,
   'Desflurane MAC is 6.0–7.3% in oxygen. It decreases with age and with nitrous oxide or opioid co-administration.'),

  -- Q7: RSI
  ('b3000001-0000-0000-0000-000000000000', 1, 'Pre-oxygenation with 100% oxygen for 3 minutes provides adequate apnoea time in most healthy adults before RSI', true,
   'Three minutes of normal tidal breathing (or 4 vital-capacity breaths) de-nitrogenates the FRC, providing ~8 min of safe apnoea time in a healthy 70 kg adult.'),
  ('b3000001-0000-0000-0000-000000000000', 2, 'Cricoid pressure reliably prevents pulmonary aspiration in all patients', false,
   'Cricoid pressure is controversial; RCT evidence shows it may fail to occlude the oesophagus in up to 50% of patients and can worsen the laryngoscopy view.'),
  ('b3000001-0000-0000-0000-000000000000', 3, 'The standard intubating dose of suxamethonium for RSI is 1.5 mg/kg intravenously', true,
   '1–1.5 mg/kg IV produces complete neuromuscular block within 60 seconds, enabling rapid tracheal intubation.'),
  ('b3000001-0000-0000-0000-000000000000', 4, 'RSI is indicated in all patients considered to have a full stomach at induction', true,
   'Patients with full stomach, GORD, hiatus hernia, pregnancy, or emergency presentation require RSI to reduce aspiration risk.'),
  ('b3000001-0000-0000-0000-000000000000', 5, 'Rocuronium 1.2 mg/kg provides intubating conditions comparable to suxamethonium in RSI', true,
   'At 1.2 mg/kg (4× ED95), rocuronium produces intubating conditions within 60–90 s. Sugammadex 16 mg/kg enables rapid reversal in a failed airway.'),

  -- Q8: LMA
  ('b3000002-0000-0000-0000-000000000000', 1, 'The laryngeal mask airway does not provide reliable protection against pulmonary aspiration', true,
   'The LMA cuff seals the supraglottic airway but does not protect the trachea; aspiration of gastric contents remains possible.'),
  ('b3000002-0000-0000-0000-000000000000', 2, 'Peak airway pressure should be kept below 20 cmH₂O when ventilating through a classic LMA', true,
   'Higher pressures exceed the LMA seal and risk gastric insufflation, increasing aspiration risk.'),
  ('b3000002-0000-0000-0000-000000000000', 3, 'The LMA is absolutely contraindicated in patients with a body mass index greater than 40 kg/m²', false,
   'Obesity increases aspiration risk and may reduce LMA seal pressure, but is not an absolute contraindication. Clinical risk-benefit assessment is required.'),
  ('b3000002-0000-0000-0000-000000000000', 4, 'Insertion of a laryngeal mask airway requires direct laryngoscopy', false,
   'The LMA is inserted blindly using a standard technique: deflate, lubricate, insert over the tongue into the hypopharynx. No laryngoscopy is needed.'),
  ('b3000002-0000-0000-0000-000000000000', 5, 'The ProSeal LMA incorporates a drain tube that allows gastric decompression', true,
   'The ProSeal drain tube lies alongside the ventilation tube and terminates at the oesophagus, allowing suction and a gastric tube.'),

  -- Q9: Difficult airway
  ('b3000003-0000-0000-0000-000000000000', 1, 'The Mallampati score assesses oropharyngeal visibility with the mouth open and tongue protruded without phonation', true,
   'Mallampati I–IV grades visibility of the soft palate, uvula, fauces, and tonsillar pillars. Class III–IV predicts difficult intubation.'),
  ('b3000003-0000-0000-0000-000000000000', 2, 'A thyromental distance of less than 6 cm is associated with potentially difficult direct laryngoscopy', true,
   'Short thyromental distance (<6 cm or <3 finger breadths) indicates a small submandibular space, predicting poor laryngeal exposure.'),
  ('b3000003-0000-0000-0000-000000000000', 3, 'Video laryngoscopy consistently provides a superior glottic view compared to direct laryngoscopy in all clinical situations', false,
   'Video laryngoscopy usually improves the laryngoscopy grade but is not universally superior; blood, secretions, and lens fogging can impair the camera view.'),
  ('b3000003-0000-0000-0000-000000000000', 4, 'The overall failed intubation rate in the general surgical population is approximately 1 in 2000', true,
   'Failed intubation occurs in ~1:1000–2000 general surgical cases, rising to ~1:250 in obstetrics and higher in the ICU.'),
  ('b3000003-0000-0000-0000-000000000000', 5, 'Surgical cricothyrotomy is the recommended final rescue technique in a ''can''t intubate, can''t oxygenate'' scenario', true,
   'International guidelines (DAS, AAOS) recommend emergency front-of-neck access (surgical cricothyrotomy) as the ultimate rescue when all oxygenation attempts fail.');
