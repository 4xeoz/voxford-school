# Open-school website flow

The homepage in `app/[locale]/page.tsx` uses `OpenHomeExperience`, `OpenFooter`, and the shared `InquiryForm`. The contact page uses the same form. The old pre-launch hero, teaser, and footer components remain in the repository for history but are not rendered by these routes.

- Primary hero action: jump to the M'Sila location section and directions link.
- Secondary action: explore the learning experience. Navigation sends enquiries to `/[locale]/contact`.
- Form: name, phone, and language interest in one step. It writes a contact record through `submitContactForm`; the source is stored in the message. English and French are named; the third option is an enquiry, not a claim that another course is open.
- Study trips are described as opportunities during breaks; the site does not imply that every course includes travel or a guaranteed placement.
- Hero and speech imagery are illustrative studio artwork from the approved Voxbridge interior-art set. They are not evidence of real classes, students, staff, or trips.
- No live seat counter, deadline, unverified response-time promise, or pre-registration language belongs on the active landing or contact pages.
- Current visual source of truth is the workspace's `VOXBRIDGE_BRAND_GUIDELINES.md`. The actual shield is paired with a three-line text wordmark in `BrandLockup`; the old repository files named `lockup-voxbridge-...png` contain the wrong word “Voxford” and must not be reused.
- If a future page adds generated video, keep generation at 480p or below per the owner's instruction. This version uses still images and motion in CSS/React.

Verify a deployment by checking the three locale routes and `/[locale]/contact` on desktop and phone, then send a controlled enquiry only when a production test contact can be identified and handled. A successful build alone does not prove database delivery.
