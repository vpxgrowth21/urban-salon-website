import { MapPin, Clock3, MessageCircle, Phone } from 'lucide-react';
import { PageIntro } from '@/components/ui';
import { EnquiryForm } from '@/components/enquiry-form';
export const metadata = { title: 'Contact & Location' };
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Urban Beauti Salon"
        title={<>Contact & Location</>}
        description="Have a question about a service or planning a special occasion? Start with a little conversation."
      />
      <section className="section form-section">
        <div>
          <span className="eyebrow">URBAN BEAUTI SALON</span>
          <h2>
            A little closer
            <br />
            <em>to your next look.</em>
          </h2>
          <div className="contact-details">
            <div>
              <MapPin size={22} strokeWidth={1.2} />
              <h3>Gandhinagar</h3>
              <p>
                Gujarat, India.
                <br />
                Exact address awaiting confirmation.
              </p>
            </div>
            <div>
              <Clock3 size={22} strokeWidth={1.2} />
              <h3>Business hours</h3>
              <p>Final salon hours awaiting owner confirmation.</p>
            </div>
          </div>
          <span className="disabled-link" aria-disabled="true">
            <MessageCircle size={17} />
            WhatsApp — number to be confirmed
          </span>
          <span className="disabled-link" aria-disabled="true">
            <Phone size={17} />
            Phone — number to be confirmed
          </span>
          <p className="notice">
            Directions and social links will appear when verified salon details are provided.
          </p>
        </div>
        <EnquiryForm kind="contact" />
      </section>
    </>
  );
}
