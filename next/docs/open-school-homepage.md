# Open-school website flow

The homepage in `app/[locale]/page.tsx` uses `OpenHomeExperience`, `OpenFooter`, and the shared `InquiryForm`. The contact page uses the same form. The old pre-launch hero, teaser, and footer components remain in the repository for history but are not rendered by these routes.

- Primary hero action: jump to the M'Sila location section and directions link.
- The section directly below the hero shows the two confirmed public courses, English and French. Each whole card opens a localized `/[locale]/courses/[slug]` detail page. Exact age bands, schedules and prices are not published until confirmed.
- Each detail page explains the school approach without claiming a unique curriculum for one language. Its course enquiry action opens `/[locale]/contact?interest=English|French`, which preselects that language and language classes in the shared form and records the course source. The trip CTA opens `/[locale]/contact?interest=trips`, preselecting the holiday study trip interest. Navigation also links to `#courses`.
- Form: name, phone, language, and a distinct required programme interest in one step. The interests distinguish language classes, holiday language study trips, general studying-abroad enquiries, classes plus a trip, and help choosing. The studying-abroad option records the visitor's question; it is not a claim that Voxbridge offers degree placement. The form writes a contact record through `submitContactForm`; language, programme interest, and source are stored in the message. English and French are named; the third language option is an enquiry, not a claim that another course is open. Older forms calling the same server action remain compatible because the new action field is optional outside this shared form.
- Study trips are described as opportunities during breaks; the site does not imply that every course includes travel or a guaranteed placement.
- Hero, course-card and speech imagery are illustrative studio artwork. They are not evidence of real classes, students, staff, or trips.
- No live seat counter, deadline, unverified response-time promise, or pre-registration language belongs on the active landing or contact pages.
- Current visual source of truth is the workspace's `VOXBRIDGE_BRAND_GUIDELINES.md`. The actual shield is paired with a three-line text wordmark in `BrandLockup`; the old repository files named `lockup-voxbridge-...png` contain the wrong word “Voxford” and must not be reused.
- If a future page adds generated video, keep generation at 480p or below per the owner's instruction. This version uses still images and motion in CSS/React.

Verify a deployment by checking the three locale routes and `/[locale]/contact` on desktop and phone, then send a controlled enquiry only when a production test contact can be identified and handled. A successful build alone does not prove database delivery.
