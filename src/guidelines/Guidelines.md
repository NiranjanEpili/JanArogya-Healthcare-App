# General Guidelines
* App must be **offline-first**. All patient actions (tokens, SOS, prescriptions, health records) should work without internet and sync automatically later.
* Voice navigation is **global**. Every screen and major function must be operable by voice mic button.
* Keep layouts **responsive** using flexbox/grid. Avoid absolute positioning.
* Use **clear icons + voice labels** for illiterate users.
* Blockchain is mandatory for health records + worker incentives (stub if needed).
* All generated flows must be **end-to-end functional for demo**.

---

# Design System Guidelines

## Colors
* Primary: Medical green (#2EB086)  
* Secondary: White (#FFFFFF)  
* Accent: Emergency red (#E63946)  
* Background: Light grey (#F8F9FA)  

## Typography
* Base font size: 16px  
* Headings: Bold, large, easy to read  
* Body text: Simple, multilingual supported  

## Buttons
* **Primary Button**: Filled, green background, white text, large touch area  
* **Secondary Button**: Outlined, green border, white background  
* **SOS Button**: Large red circle button, fixed in Emergency screen  

## Layout
* Use card-based sections for dashboards (Patient, Doctor, Worker, Pharmacy).  
* Top header sticky across pages.  
* Footer with partner logos + quick links.  

---

# Functional Guidelines

## Patient Portal
* Dashboard shows big buttons: Book Token, My Family, Medicine Locker, SOS, Symptom Check.  
* Family linkage allows managing multiple profiles (cards for each member).  
* Digital Medicine Locker stores prescriptions as **QR codes**.  
* SOS button must work offline and auto-send when online.  

## Health Worker Portal
* Dashboard: Assigned patients, daily checklist, training modules, incentive wallet.  
* Incentives recorded to blockchain.  
* Training modules available offline (video/AR).  

## Doctor Portal
* Dashboard: List of consultations, AI patient summaries, prescribe medicines (QR), outbreak alerts.  
* Records: Immutable blockchain patient history.  

## Pharmacy Portal
* Dashboard: IoT stock levels, predictive medicine alerts, QR prescription scanner.  

## Admin Portal
* Dashboard: Map + heatmap of villages, outbreak warnings, worker performance, supply chain analytics.  

---

# Content Guidelines
* Text must always have **voice output** (SpeechSynthesis).  
* App must support **dynamic multilingual translation** (English + Indian local dialects).  
* Keep text short, rely on **icons + audio prompts**.  

---

# Demo / Presentation Guidelines
* All major buttons should work and show results (even if stubbed).  
* Offline-first demo must be functional (simulate sync).  
* Include functional voice command examples: “Book Token”, “Emergency Help”, “My Prescription”.  
